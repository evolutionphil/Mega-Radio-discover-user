import { Station } from '@/services/megaRadioApi';

var API_BASE = 'https://themegaradio.com';

var _pollInterval: ReturnType<typeof setInterval> | null = null;
var _reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
var _shouldPoll: boolean = false;
var _sessionId: string | null = null;
var _token: string | null = null;
var _onMessage: ((msg: any) => void) | null = null;
var _onStatusChange: ((status: string) => void) | null = null;
var _lastCommandId: string | null = null;
var _isConnected: boolean = false;

function getDeviceId(): string {
  try {
    var w = window as any;
    if (w.webapis && w.webapis.productinfo && typeof w.webapis.productinfo.getDuid === 'function') {
      return w.webapis.productinfo.getDuid();
    }
  } catch (e) {
  }

  try {
    var w2 = window as any;
    if (w2.webOS && w2.webOS.deviceInfo) {
      if (typeof w2.webOS.deviceInfo === 'object' && w2.webOS.deviceInfo.serialNumber) {
        return w2.webOS.deviceInfo.serialNumber;
      }
      if (typeof w2.webOS.deviceInfo === 'function') {
        var serial: string | null = null;
        w2.webOS.deviceInfo(function(info: any) {
          if (info && info.serialNumber) {
            serial = info.serialNumber;
            try { localStorage.setItem('tv_device_id', info.serialNumber); } catch (e) {}
          }
        });
        if (serial) return serial;
      }
    }
  } catch (e) {
  }

  try {
    var saved = localStorage.getItem('tv_device_id');
    if (saved) return saved;
  } catch (e) {
  }

  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  try {
    localStorage.setItem('tv_device_id', uuid);
  } catch (e) {
  }

  return uuid;
}

function getPlatformName(): string {
  var ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent.toLowerCase() : '';
  if (ua.indexOf('tizen') !== -1) return 'tizen';
  if (ua.indexOf('webos') !== -1) return 'webos';
  return 'browser';
}

function getDeviceName(): string {
  var platform = getPlatformName();
  if (platform === 'tizen') return 'Samsung TV';
  if (platform === 'webos') return 'LG TV';
  return 'TV';
}

function extractCommand(data: any): any {
  if (!data) return null;

  if (data.pendingCommand) return data.pendingCommand;
  if (data.command && typeof data.command === 'object') return data.command;
  if (data.lastCommand && typeof data.lastCommand === 'object') return data.lastCommand;

  if (data.type && typeof data.type === 'string' && data.type.indexOf('cast:') === 0) {
    return data;
  }

  if (data.action && typeof data.action === 'string') {
    var actionType = data.action;
    if (actionType.indexOf('cast:') !== 0) {
      actionType = 'cast:' + actionType;
    }
    return { type: actionType, data: data.data || data };
  }

  if (data.station && typeof data.station === 'object' && data.station._id) {
    return { type: 'cast:play', data: { station: data.station } };
  }

  if (data.currentStation && typeof data.currentStation === 'object') {
    return { type: 'cast:play', data: { station: data.currentStation } };
  }

  if (data.playStation && typeof data.playStation === 'object') {
    return { type: 'cast:play', data: { station: data.playStation } };
  }

  return null;
}

function getCommandId(cmd: any): string {
  if (cmd.id) return String(cmd.id);
  if (cmd.timestamp) return String(cmd.timestamp);
  if (cmd.commandId) return String(cmd.commandId);
  if (cmd._id) return String(cmd._id);
  if (cmd.createdAt) return String(cmd.createdAt);
  return JSON.stringify(cmd);
}

function pollForCommands() {
  if (!_sessionId || !_token) return;

  var url = API_BASE + '/api/cast/session/' + encodeURIComponent(_sessionId) + '/status?deviceId=' + encodeURIComponent(getDeviceId());

  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + _token,
      'Content-Type': 'application/json'
    }
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Poll failed: ' + response.status);
    }
    return response.json();
  })
  .then(function(data) {
    console.log('[Cast] Poll response:', JSON.stringify(data));

    if (!_isConnected) {
      _isConnected = true;
      if (_onStatusChange) {
        _onStatusChange('connected');
      }
    }

    var command = extractCommand(data);
    if (command) {
      var cmdId = getCommandId(command);
      if (cmdId !== _lastCommandId) {
        _lastCommandId = cmdId;
        console.log('[Cast] New command:', command.type, command);
        if (_onMessage) {
          _onMessage(command);
        }
      }
    }
  })
  .catch(function(err) {
    console.warn('[Cast] Poll error:', err);
    if (_isConnected) {
      _isConnected = false;
      if (_onStatusChange) {
        _onStatusChange('disconnected');
      }
    }
  });
}

export var castService = {
  pair: function(pairingCode: string): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    return fetch(API_BASE + '/api/cast/session/pair', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pairingCode: pairingCode,
        deviceId: getDeviceId(),
        deviceName: getDeviceName(),
        platform: getPlatformName()
      })
    })
    .then(function(response) {
      return response.json().then(function(data: any) {
        if (!response.ok || !data.success) {
          return { success: false, error: data.message || data.error || 'Pairing failed' };
        }
        var sid = data.sessionId as string;
        try {
          localStorage.setItem('cast_session_id', sid);
        } catch (e) {
        }
        return { success: true, sessionId: sid };
      });
    })
    .catch(function(err) {
      console.error('[Cast] Pair error:', err);
      return { success: false, error: 'Network error' };
    }) as Promise<{ success: boolean; sessionId?: string; error?: string }>;
  },

  connect: function(sessionId: string, token: string, onMessage: (msg: any) => void, onStatusChange: (status: string) => void) {
    _sessionId = sessionId;
    _token = token;
    _onMessage = onMessage;
    _onStatusChange = onStatusChange;
    _shouldPoll = true;
    _lastCommandId = null;

    if (_pollInterval) {
      clearInterval(_pollInterval);
      _pollInterval = null;
    }
    if (_reconnectTimeout) {
      clearTimeout(_reconnectTimeout);
      _reconnectTimeout = null;
    }

    console.log('[Cast] Starting HTTP polling...');

    pollForCommands();

    _pollInterval = setInterval(function() {
      if (_shouldPoll) {
        pollForCommands();
      }
    }, 3000);
  },

  disconnect: function() {
    console.log('[Cast] Disconnecting...');
    _shouldPoll = false;
    _isConnected = false;
    _onMessage = null;
    _onStatusChange = null;
    _sessionId = null;
    _token = null;
    _lastCommandId = null;

    if (_pollInterval) {
      clearInterval(_pollInterval);
      _pollInterval = null;
    }
    if (_reconnectTimeout) {
      clearTimeout(_reconnectTimeout);
      _reconnectTimeout = null;
    }

    try {
      localStorage.removeItem('cast_session_id');
    } catch (e) {}
  },

  sendNowPlaying: function(data: { title?: string; artist?: string; stationName?: string; isPlaying: boolean }) {
    if (!_sessionId || !_token || !_isConnected) return;

    fetch(API_BASE + '/api/cast/session/' + encodeURIComponent(_sessionId) + '/now-playing', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + _token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deviceId: getDeviceId(),
        title: data.title,
        artist: data.artist,
        stationName: data.stationName,
        isPlaying: data.isPlaying
      })
    }).catch(function(err) {
      console.warn('[Cast] sendNowPlaying error:', err);
    });
  },

  isConnected: function(): boolean {
    return _isConnected;
  },

  getSessionId: function(): string | null {
    return _sessionId;
  },

  getSavedSessionId: function(): string | null {
    try {
      return localStorage.getItem('cast_session_id');
    } catch (e) {
      return null;
    }
  }
};
