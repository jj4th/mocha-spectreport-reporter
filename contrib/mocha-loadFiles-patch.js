var Module = require('module');
var path = require('path');
var mocha = require('mocha');

var originalLoader = Module._load;

var mochaLoadFiles = function(fn) {
    var self = this;
    var suite = this.suite;
    this.files.forEach(function(file) {
        file = path.resolve(file);
        suite.emit('pre-require', global, file, self);

        try {
            suite.emit('require', require(file), file, self);
        } catch (e) {
            describe('!! Test file errors', function () {
                it('Failed to load: ' + file, function () {
                    throw e;
                });
            });
            suite.emit('require', undefined, file, self);
        }

        suite.emit('post-require', global, file, self);
    });

    if(fn) {
        fn();
    }
};

/**
 * Hack the case where we're running under mocha directly.
 */
mocha.prototype.loadFiles = mochaLoadFiles;

/**
 * Hack require so that we can catch files with syntax errors in mocha.
 */
Module._load = function(request, parent, isMain) {
    var result = originalLoader(request, parent, isMain);

    if(request === 'mocha') {
        result.prototype.loadFiles = mochaLoadFiles;
    }

    return result;
};

exports = module.exports = undefined;
