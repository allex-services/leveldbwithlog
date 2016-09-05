(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
ALLEX.execSuite.registry.registerClientSide('allex_leveldbwithlogservice',require('./sinkmapcreator')(ALLEX, ALLEX.execSuite.registry.getClientSide('.'), ALLEX.execSuite.libRegistry.get('allex_leveldblib')));

},{"./sinkmapcreator":4}],2:[function(require,module,exports){
module.exports = {
};

},{}],3:[function(require,module,exports){
module.exports = {
  put: [{
    title: 'Key',
    anyOf: [{type:'string'},{type:'number'},{type:'integer'}]
  },{
    title: 'Value',
    anyOf: [{type:'string'},{type:'number'},{type:'integer'},{type:'object'},{type:'array'}]
  }],
  get: [{
    title: 'Key',
    anyOf: [{type:'string'},{type:'number'},{type:'integer'}]
  }],
  safeGet: [{
    title: 'Key',
    anyOf: [{type:'string'},{type:'number'},{type:'integer'}]
  },{
    title: 'Default',
    anyOf: [{type:'string'},{type:'number'},{type:'integer'},{type:'object'},{type:'array'}]
  }],
  getWDefault: [{
    title: 'Key',
    anyOf: [{type:'string'},{type:'number'},{type:'integer'}]
  },{
    title: 'Default',
    anyOf: [{type:'string'},{type:'number'},{type:'integer'},{type:'object'},{type:'array'}]
  }],
  del: [{
    title: 'Key',
    anyOf: [{type:'string'},{type:'number'},{type:'integer'}]
  }],
  traverseResets: [{
    title: 'Traverse options',
    type: 'object'
  }]
};

},{}],4:[function(require,module,exports){
function sinkMapCreator(execlib, ParentSinkMap, leveldb) {
  'use strict';
  var sinkmap = new (execlib.lib.Map);
  sinkmap.add('service', require('./sinks/servicesinkcreator')(execlib, ParentSinkMap.get('service')));
  sinkmap.add('user', require('./sinks/usersinkcreator')(execlib, ParentSinkMap.get('user'), leveldb));
  
  return sinkmap;
}

module.exports = sinkMapCreator;

},{"./sinks/servicesinkcreator":5,"./sinks/usersinkcreator":6}],5:[function(require,module,exports){
function createServiceSink(execlib, ParentSink) {
  'use strict';
  function ServiceSink(prophash, client) {
    ParentSink.call(this, prophash, client);
  }
  
  ParentSink.inherit(ServiceSink, require('../methoddescriptors/serviceuser'));
  ServiceSink.prototype.__cleanUp = function () {
    ParentSink.prototype.__cleanUp.call(this);
  };
  return ServiceSink;
}

module.exports = createServiceSink;

},{"../methoddescriptors/serviceuser":2}],6:[function(require,module,exports){
function createUserSink(execlib, ParentSink, leveldblib) {
  'use strict';
  function UserSink(prophash, client) {
    ParentSink.call(this, prophash, client);
  }
  
  ParentSink.inherit(UserSink, require('../methoddescriptors/user'));
  leveldblib.enhanceSink(UserSink);
  UserSink.prototype.__cleanUp = function () {
    ParentSink.prototype.__cleanUp.call(this);
  };
  return UserSink;
}

module.exports = createUserSink;

},{"../methoddescriptors/user":3}]},{},[1]);
