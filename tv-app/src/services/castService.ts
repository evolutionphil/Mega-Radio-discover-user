import { Station } from '@/services/megaRadioApi';

var API_BASE = 'https://themegaradio.com';
var WS_BASE = 'wss://themegaradio.com/ws/cast';

var _ws: WebSocket | null = null;
var _heartbeatInterval: ReturnType<typeof setInterval> | null = null;
var _reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
var _shouldReconnect: boolean = false;
var _sessionId: string | null = null;
var _token: string | null = null;
var _onMessage: ((msg: any) => void) | null = null;
var _onStatusChange: ((status: string) => void) | null = null;

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
    _shouldReconnect = true;

    if (_ws) {
      try { _ws.close(); } catch (e) {}
      _ws = null;
    }
    if (_heartbeatInterval) {
      clearInterval(_heartbeatInterval);
      _heartbeatInterval = null;
    }
    if (_reconnectTimeout) {
      clearTimeout(_reconnectTimeout);
      _reconnectTimeout = null;
    }

    var wsUrl = WS_BASE +
      '?sessionId=' + encodeURIComponent(sessionId) +
      '&role=tv' +
      '&token=' + encodeURIComponent(token) +
      '&deviceId=' + encodeURIComponent(getDeviceId());

    console.log('[Cast] Connecting WebSocket...');
    var ws = new WebSocket(wsUrl);
    _ws = ws;

    ws.onopen = function() {
      console.log('[Cast] WebSocket connected');
      if (_onStatusChange) {
        _onStatusChange('connected');
      }

      _heartbeatInterval = setInterval(function() {
        if (_ws && _ws.readyState === WebSocket.OPEN) {
          _ws.send(JSON.stringify({ type: 'cast:heartbeat' }));
        }
      }, 30000);
    };

    ws.onmessage = function(event) {
      try {
        var msg = JSON.parse(event.data);
        if (_onMessage) {
          _onMessage(msg);
        }
      } catch (e) {
        console.warn('[Cast] Failed to parse message:', e);
      }
    };

    ws.onclose = function(event) {
      console.log('[Cast] WebSocket closed:', event.code, event.reason);
      if (_heartbeatInterval) {
        clearInterval(_heartbeatInterval);
        _heartbeatInterval = null;
      }
      if (_onStatusChange) {
        _onStatusChange('disconnected');
      }

      if (_shouldReconnect && _sessionId && _token && _onMessage && _onStatusChange) {
        console.log('[Cast] Scheduling reconnect in 5s...');
        _reconnectTimeout = setTimeout(function() {
          _reconnectTimeout = null;
          if (_shouldReconnect && _sessionId && _token && _onMessage && _onStatusChange) {
            castService.connect(_sessionId, _token, _onMessage, _onStatusChange);
          }
        }, 5000);
      }
    };

    ws.onerror = function(event) {
      console.error('[Cast] WebSocket error:', event);
    };
  },

  disconnect: function() {
    console.log('[Cast] Disconnecting...');
    _shouldReconnect = false;
    _onMessage = null;
    _onStatusChange = null;
    _sessionId = null;
    _token = null;

    if (_heartbeatInterval) {
      clearInterval(_heartbeatInterval);
      _heartbeatInterval = null;
    }
    if (_reconnectTimeout) {
      clearTimeout(_reconnectTimeout);
      _reconnectTimeout = null;
    }
    if (_ws) {
      try { _ws.close(); } catch (e) {}
      _ws = null;
    }

    try {
      localStorage.removeItem('cast_session_id');
    } catch (e) {
    }
  },

  sendNowPlaying: function(data: { title?: string; artist?: string; stationName?: string; isPlaying: boolean }) {
    if (_ws && _ws.readyState === WebSocket.OPEN) {
      _ws.send(JSON.stringify({
        type: 'cast:now_playing',
        data: data
      }));
    }
  },

  isConnected: function(): boolean {
    return !!_ws && _ws.readyState === WebSocket.OPEN;
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
