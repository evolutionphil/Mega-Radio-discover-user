// Polyfills for Samsung Tizen TV (Chromium 76 / ES2015 support only)
(function() {
    'use strict';
    
    console.log('[Polyfills] Loading polyfills for Samsung Tizen TV...');
    
    // globalThis polyfill (ES2020) - MUST BE FIRST
    if (typeof globalThis === 'undefined') {
        (function() {
            if (typeof self !== 'undefined') { 
                self.globalThis = self; 
            } else if (typeof window !== 'undefined') { 
                window.globalThis = window; 
            } else if (typeof global !== 'undefined') { 
                global.globalThis = global; 
            } else { 
                this.globalThis = this; 
            }
        }).call(this);
        console.log('[Polyfills] Added globalThis');
    }
    
    // Object.fromEntries polyfill (ES2019)
    if (!Object.fromEntries) {
        Object.fromEntries = function(entries) {
            if (!entries || !entries[Symbol.iterator]) {
                throw new Error('Object.fromEntries() requires an iterable argument');
            }
            
            const obj = {};
            for (const [key, value] of entries) {
                obj[key] = value;
            }
            return obj;
        };
        console.log('[Polyfills] Added Object.fromEntries');
    }
    
    // Object.entries polyfill (ES2017) - just in case
    if (!Object.entries) {
        Object.entries = function(obj) {
            var ownProps = Object.keys(obj),
                i = ownProps.length,
                resArray = new Array(i);
            while (i--)
                resArray[i] = [ownProps[i], obj[ownProps[i]]];
            return resArray;
        };
        console.log('[Polyfills] Added Object.entries');
    }
    
    // Array.prototype.flat polyfill (ES2019)
    if (!Array.prototype.flat) {
        Array.prototype.flat = function(depth) {
            var flattend = [];
            (function flat(array, depth) {
                for (var el of array) {
                    if (Array.isArray(el) && depth > 0) {
                        flat(el, depth - 1);
                    } else {
                        flattend.push(el);
                    }
                }
            })(this, Math.floor(depth) || 1);
            return flattend;
        };
        console.log('[Polyfills] Added Array.prototype.flat');
    }
    
    // Array.prototype.flatMap polyfill (ES2019)
    if (!Array.prototype.flatMap) {
        Array.prototype.flatMap = function(callback, thisArg) {
            return this.map(callback, thisArg).flat(1);
        };
        console.log('[Polyfills] Added Array.prototype.flatMap');
    }
    
    // String.prototype.replaceAll polyfill (ES2021)
    if (!String.prototype.replaceAll) {
        String.prototype.replaceAll = function(str, newStr) {
            if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
                return this.replace(str, newStr);
            }
            return this.replace(new RegExp(str, 'g'), newStr);
        };
        console.log('[Polyfills] Added String.prototype.replaceAll');
    }
    
    // Promise.allSettled polyfill (ES2020)
    if (!Promise.allSettled) {
        Promise.allSettled = function(promises) {
            return Promise.all(
                promises.map(function(promise) {
                    return Promise.resolve(promise).then(
                        function(value) {
                            return { status: 'fulfilled', value: value };
                        },
                        function(reason) {
                            return { status: 'rejected', reason: reason };
                        }
                    );
                })
            );
        };
        console.log('[Polyfills] Added Promise.allSettled');
    }
    
    console.log('[Polyfills] All polyfills loaded successfully');
})();
