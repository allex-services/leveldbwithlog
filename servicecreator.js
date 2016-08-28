var Path = require('path');

function createLevelDBWithLogService(execlib, ParentService, leveldblib, bufferlib) {
  'use strict';
  
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;


  function factoryCreator(parentFactory) {
    return {
      'service': require('./users/serviceusercreator')(execlib, parentFactory.get('service')),
      'user': require('./users/usercreator')(execlib, parentFactory.get('user')) 
    };
  }

  function encodingFor(dbcreationoptions, path) {
    if (dbcreationoptions.bufferValueEncoding &&
        lib.isArray(dbcreationoptions.bufferValueEncoding)) {
      return bufferlib.makeCodec(dbcreationoptions.bufferValueEncoding, path)
    }
  }

  function leveldboptshash2obj (leveldboptshash, path) {
    return {
      dbname: Path.join(path, leveldboptshash.dbname),
      listenable: true,
      dbcreationoptions: {
        valueEncoding: encodingFor(leveldboptshash.dbcreationoptions, path)
      }
    }
  }

  function LevelDBWithLogService(prophash) {
    ParentService.call(this, prophash);
    this.kvstorageopts = prophash.kvstorage;
    this.logopts = prophash.log;
    this.kvstorage = null;
    this.log = null;
    this.locks = new qlib.JobCollection();
    this.startDBs(prophash.path);
  }
  
  ParentService.inherit(LevelDBWithLogService, factoryCreator);
  
  LevelDBWithLogService.prototype.__cleanUp = function() {
    if (this.locks) {
      this.locks.destroy();
    }
    this.locks = null;
    if (this.log) {
      this.log.destroy();
    }
    if (this.kvstorage) {
      this.kvstorage.destroy();
    }
    this.log = null;
    this.kvstorage = null;
    this.kvstoragename = null;
    ParentService.prototype.__cleanUp.call(this);
  };
  
  LevelDBWithLogService.prototype.isInitiallyReady = function () {
    return false;
  };

  LevelDBWithLogService.prototype.startDBs = function (path, error) {
    if (error) {
      this.close();
      return;
    }
    q.allSettled(this.createStartDBPromises(path)).then(
      this.onDBsReady.bind(this, path)
    ).fail(
      this.close.bind(this)
    );
  };

  LevelDBWithLogService.prototype.onDBsReady = function (dbpath) {
    this.readyToAcceptUsersDefer.resolve(true);
  };

  LevelDBWithLogService.prototype.createStartDBPromises = function (path) {
    var kvsd = q.defer(),
      kvso = leveldboptshash2obj(this.kvstorageopts, path),
      ld = q.defer(),
      lo = leveldboptshash2obj(this.logopts, path);

    kvso.starteddefer = kvsd;
    lo.starteddefer = ld;
    lo.startfromone = true;

    this.kvstorage = leveldblib.createDBHandler(kvso);
    this.log = new (leveldblib.DBArray)(lo);
    return [kvsd.promise, ld.promise];
  };

  LevelDBWithLogService.prototype.get = function (key) {
    return this.kvstorage.get(key);
  };

  LevelDBWithLogService.prototype.safeGet = function (key, deflt) {
    return this.kvstorage.safeGet(key, deflt);
  };

  LevelDBWithLogService.prototype.getWDefault = function (key, deflt) {
    return this.kvstorage.getWDefault(username, deflt);
  };

  LevelDBWithLogService.prototype.del = function (key) {
    return this.kvstorage.del(key);
  };

  LevelDBWithLogService.prototype.propertyHashDescriptor = {
    path: {
      type: 'string'
    }
  };
  
  return LevelDBWithLogService;
}

module.exports = createLevelDBWithLogService;
