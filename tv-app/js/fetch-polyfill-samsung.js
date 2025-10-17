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
                
                // DON'T set responseType - Samsung TV has issues with it
                // xhr.responseType = 'text';
                
                // Set headers
                xhr.setRequestHeader('Accept', 'application/json');
                if (options.headers) {
                    Object.keys(options.headers).forEach(function(key) {
                        xhr.setRequestHeader(key, options.headers[key]);
                    });
                }
                
                // Use onreadystatechange for better Samsung TV compatibility
                xhr.onreadystatechange = function() {
                    if (xhr.readyState !== 4) return;
                    
                    if (xhr.status === 0) {
                        console.error('[Fetch] Network error (status 0) for:', url);
                        reject(new TypeError('Network request failed'));
                        return;
                    }
                    
                    handleResponse();
                };
                
                function handleResponse() {
                    console.log('[Fetch] Response status:', xhr.status, 'for', url);
                    
                    // Try both response and responseText for Samsung TV compatibility
                    var responseText = xhr.response || xhr.responseText || '';
                    console.log('[Fetch] Response text length:', responseText ? responseText.length : 0);
                    
                    if (typeof responseText !== 'string') {
                        responseText = String(responseText);
                    }
                    
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
                            return Promise.resolve(responseText);
                        },
                        json: function() {
                            try {
                                if (!responseText || responseText.trim() === '') {
                                    console.error('[Fetch] Empty response body for:', url);
                                    return Promise.resolve(null);
                                }
                                var parsed = JSON.parse(responseText);
                                console.log('[Fetch] JSON parsed successfully, keys:', Object.keys(parsed || {}));
                                return Promise.resolve(parsed);
                            } catch(e) {
                                console.error('[Fetch] JSON parse error:', e);
                                console.error('[Fetch] Response text was:', responseText.substring(0, 200));
                                return Promise.reject(e);
                            }
                        }
                    };
                    
                    resolve(response);
                }
                
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
