require('jsdom-global')();

const localStorageMock = function() {
    let storage = {};

    return {
        setItem: function(key, value) {
            storage[key] = value || '';
        },
        getItem: function(key) {
            return key in storage ? storage[key] : null;
        },
        removeItem: function(key) {
            delete storage[key];
        },
        get length() {
            return Object.keys(storage).length;
        },
        key: function(i) {
            var keys = Object.keys(storage);
            return keys[i] || null;
        },
    };
};

// mock the localStorage in JSDOM
global.localStorage = localStorageMock();
// mock the sessionStorage in JSDOM
global.sessionStorage = localStorageMock();

// mock window object in JSDOM
window = global;
window.requestAnimationFrame = function(callback) {
    setTimeout(callback, 0);
};

window.cancelAnimationFrame = function(callback) {
    setTimeout(callback, 0);
};

window.open = function(callback) {
    setTimeout(callback, 0);
};

window.URL.createObjectURL = function() {};

global.expect = require('expect');
