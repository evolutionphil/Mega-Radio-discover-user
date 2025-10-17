// Fetch polyfill for Samsung Tizen TV - handles CORS better
(function() {
    'use strict';
    
    console.log('[Fetch Polyfill] Loading Samsung TV fetch handler...');
    
    // Store original fetch
    const originalFetch = window.fetch;
    
    // Enhanced fetch for Samsung TV
    window.fetch = function(url, options) {
        options = options || {};
        
        // Log all fetch requests for debugging
        console.log('[Fetch] Request:', url);
        
        // For Samsung TV, try to use XMLHttpRequest for better CORS support
        if (navigator.userAgent.toLowerCase().includes('tizen')) {
            return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                var method = (options.method || 'GET').toUpperCase();
                
                xhr.open(method, url, true);
                
                // Set headers
                xhr.setRequestHeader('Accept', 'application/json');
                if (options.headers) {
                    Object.keys(options.headers).forEach(function(key) {
                        xhr.setRequestHeader(key, options.headers[key]);
                    });
                }
                
                xhr.onload = function() {
                    console.log('[Fetch] Response status:', xhr.status, 'for', url);
                    
                    var response = {
                        ok: xhr.status >= 200 && xhr.status < 300,
                        status: xhr.status,
                        statusText: xhr.statusText,
                        headers: {
                            get: function(name) {
                                return xhr.getResponseHeader(name);
                            }
                        },
                        text: function() {
                            return Promise.resolve(xhr.responseText);
                        },
                        json: function() {
                            try {
                                return Promise.resolve(JSON.parse(xhr.responseText));
                            } catch(e) {
                                console.error('[Fetch] JSON parse error:', e);
                                return Promise.reject(e);
                            }
                        }
                    };
                    
                    resolve(response);
                };
                
                xhr.onerror = function() {
                    console.error('[Fetch] Network error for:', url);
                    reject(new TypeError('Network request failed'));
                };
                
                xhr.ontimeout = function() {
                    console.error('[Fetch] Timeout for:', url);
                    reject(new TypeError('Network request timeout'));
                };
                
                // Set timeout (30 seconds)
                xhr.timeout = 30000;
                
                // Send request
                xhr.send(options.body || null);
            });
        }
        
        // For other platforms, use original fetch
        return originalFetch.apply(this, arguments);
    };
    
    console.log('[Fetch Polyfill] Samsung TV fetch handler loaded');
})();
