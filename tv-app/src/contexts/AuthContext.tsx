import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

var API_BASE = 'https://themegaradio.com';

interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  deviceCode: string | null;
  codeExpiresAt: string | null;
  isPolling: boolean;
}

var AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  var [user, setUser] = useState<User | null>(null);
  var [token, setToken] = useState<string | null>(null);
  var [isLoading, setIsLoading] = useState(true);
  var [deviceCode, setDeviceCode] = useState<string | null>(null);
  var [codeExpiresAt, setCodeExpiresAt] = useState<string | null>(null);
  var [isPolling, setIsPolling] = useState(false);
  var pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  var codeExpiresAtRef = useRef<string | null>(null);

  useEffect(function() {
    codeExpiresAtRef.current = codeExpiresAt;
  }, [codeExpiresAt]);

  var isAuthenticated = !!token && !!user;

  useEffect(function() {
    var savedToken = null;
    try {
      savedToken = localStorage.getItem('tv_auth_token');
    } catch (e) {
      // localStorage not available
    }

    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    verifyToken(savedToken);
  }, []);

  function verifyToken(savedToken: string) {
    fetch(API_BASE + '/api/auth/tv/verify', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + savedToken }
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Token invalid');
      }
      return response.json();
    })
    .then(function(data) {
      setToken(savedToken);
      var savedUser = null;
      try {
        var raw = localStorage.getItem('tv_auth_user');
        if (raw) {
          savedUser = JSON.parse(raw);
        }
      } catch (e) {
        // parse error
      }
      if (savedUser) {
        setUser(savedUser);
      } else if (data && data.user) {
        setUser(data.user);
      }
      setIsLoading(false);
    })
    .catch(function() {
      try {
        localStorage.removeItem('tv_auth_token');
        localStorage.removeItem('tv_auth_user');
      } catch (e) {
        // ignore
      }
      setToken(null);
      setUser(null);
      setIsLoading(false);
    });
  }

  function stopPolling() {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setIsPolling(false);
  }

  function login() {
    stopPolling();
    setDeviceCode(null);
    setCodeExpiresAt(null);

    fetch(API_BASE + '/api/auth/tv/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Failed to get device code');
      }
      return response.json();
    })
    .then(function(data) {
      var code = data.code;
      var expiresAt = data.expiresAt;
      setDeviceCode(code);
      setCodeExpiresAt(expiresAt);
      startPolling(code);
    })
    .catch(function(err) {
      console.error('[Auth] Failed to get device code:', err);
    });
  }

  function startPolling(code: string) {
    setIsPolling(true);

    pollingRef.current = setInterval(function() {
      var expiresStr = codeExpiresAtRef.current;
      if (expiresStr) {
        var expiresTime = new Date(expiresStr).getTime();
        if (Date.now() >= expiresTime) {
          console.log('[Auth] Device code expired, requesting new code');
          stopPolling();
          login();
          return;
        }
      }

      fetch(API_BASE + '/api/auth/tv/code/' + code + '/status', {
        method: 'GET'
      })
      .then(function(response) {
        if (!response.ok) {
          if (response.status === 404 || response.status === 410) {
            console.log('[Auth] Code expired/invalid on server, requesting new code');
            stopPolling();
            login();
            return;
          }
          throw new Error('Polling failed');
        }
        return response.json();
      })
      .then(function(data) {
        if (!data) return;
        if (data.expired) {
          console.log('[Auth] Server reported code expired, requesting new code');
          stopPolling();
          login();
          return;
        }
        if (data.activated && data.token) {
          var newToken = data.token;
          var newUser = data.user;

          try {
            localStorage.setItem('tv_auth_token', newToken);
            localStorage.setItem('tv_auth_user', JSON.stringify(newUser));
          } catch (e) {
            // localStorage error
          }

          setToken(newToken);
          setUser(newUser);
          setDeviceCode(null);
          setCodeExpiresAt(null);
          stopPolling();
        }
      })
      .catch(function(err) {
        console.warn('[Auth] Polling error:', err);
      });
    }, 3000);
  }

  function logout() {
    var currentToken = token;
    stopPolling();

    if (currentToken) {
      fetch(API_BASE + '/api/auth/tv/logout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + currentToken }
      }).catch(function() {
        // ignore logout API errors
      });
    }

    try {
      localStorage.removeItem('tv_auth_token');
      localStorage.removeItem('tv_auth_user');
    } catch (e) {
      // ignore
    }

    setToken(null);
    setUser(null);
    setDeviceCode(null);
    setCodeExpiresAt(null);
  }

  useEffect(function() {
    return function() {
      stopPolling();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        user: user,
        token: token,
        isLoading: isLoading,
        login: login,
        logout: logout,
        deviceCode: deviceCode,
        codeExpiresAt: codeExpiresAt,
        isPolling: isPolling,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  var context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
