import { Station } from '@/services/megaRadioApi';

var API_BASE = 'https://themegaradio.com';

var _intervalId: ReturnType<typeof setInterval> | null = null;
var _backoffTimerId: ReturnType<typeof setTimeout> | null = null;
var _listening = false;
var _currentToken: string | null = null;

export var castService = {
  start: function(token: string, onCastReceived: (station: Station) => void) {
    castService.stop();
    _currentToken = token;
    _listening = true;

    function poll() {
      if (!_listening || !_currentToken) return;

      fetch(API_BASE + '/api/cast/poll', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + _currentToken }
      })
      .then(function(response) {
        if (!response.ok) {
          if (response.status === 404) {
            return { hasCast: false };
          }
          throw new Error('Cast poll failed: ' + response.status);
        }
        return response.json();
      })
      .then(function(data: any) {
        if (data && data.hasCast && data.station) {
          onCastReceived(data.station);

          if (_currentToken) {
            fetch(API_BASE + '/api/cast/ack', {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + _currentToken }
            }).catch(function(err) {
              console.warn('[Cast] Failed to acknowledge cast:', err);
            });
          }
        }
      })
      .catch(function(err) {
        console.warn('[Cast] Poll error, will retry in 10s:', err);
        if (_intervalId) {
          clearInterval(_intervalId);
          _intervalId = null;
        }
        if (_listening) {
          _intervalId = setInterval(poll, 10000) as any;
          if (_backoffTimerId) { clearTimeout(_backoffTimerId); }
          _backoffTimerId = setTimeout(function() {
            _backoffTimerId = null;
            if (_listening && _intervalId) {
              clearInterval(_intervalId);
              _intervalId = setInterval(poll, 5000) as any;
            }
          }, 10000);
        }
      });
    }

    _intervalId = setInterval(poll, 5000);
  },

  stop: function() {
    _listening = false;
    _currentToken = null;
    if (_intervalId) {
      clearInterval(_intervalId);
      _intervalId = null;
    }
    if (_backoffTimerId) {
      clearTimeout(_backoffTimerId);
      _backoffTimerId = null;
    }
  },

  isListening: function(): boolean {
    return _listening;
  }
};
