global.proxyquire = require('proxyquire').noCallThru();
global.chai = require('chai');
global.sinon = require('sinon');
global.sinonAsPromised = require('sinon-as-promised');
global.chai.use(require('sinon-chai'));
global.f = require('./fixtures');

require('babel/register');
require('./setup')();
