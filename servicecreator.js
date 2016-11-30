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

  LevelDBWithLogService.prototype.onDBsReady = function (dbpath) {
    this.readyToAcceptUsersDefer.resolve(true);
  };

  LevelDBWithLogService.prototype.propertyHashDescriptor = {
    path: {
      type: 'string'
    }
  };
  
  return LevelDBWithLogService;
}

module.exports = createLevelDBWithLogService;
