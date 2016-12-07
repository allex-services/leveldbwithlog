function createLevelDBWithLogService(execlib, ParentService, LevelDBWithLog, leveldblib) {
  'use strict';
  
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;


  function factoryCreator(parentFactory) {
    return {
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')),
      'user': require('./users/usercreator')(execlib, parentFactory.get('user'), leveldblib) 
    };
  }

  function LevelDBWithLogService(prophash) {
    ParentService.call(this, prophash);
    prophash.starteddefer = this.readyToAcceptUsersDefer;
    LevelDBWithLog.call(this, prophash);
  }
  
  ParentService.inherit(LevelDBWithLogService, factoryCreator);
  LevelDBWithLog.addMethods(LevelDBWithLogService);
  
  LevelDBWithLogService.prototype.__cleanUp = function() {
    LevelDBWithLog.prototype.destroy.call(this);
    ParentService.prototype.__cleanUp.call(this);
  };
  
  LevelDBWithLogService.prototype.isInitiallyReady = function () {
    return false;
  };

  LevelDBWithLogService.prototype.propertyHashDescriptor = {
    path: {
      type: 'string'
    }
  };
  
  return LevelDBWithLogService;
}

module.exports = createLevelDBWithLogService;
