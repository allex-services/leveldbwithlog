var Path = require('path');

function createLevelDBWithLogService(execlib, ParentService, leveldblib, bufferlib) {
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

  function encodingFor(dbcreationoptions, path) {
    if (!dbcreationoptions) {
      return 'json';
    }
    if (dbcreationoptions.bufferValueEncoding &&
        lib.isArray(dbcreationoptions.bufferValueEncoding)) {
      return bufferlib.makeCodec(dbcreationoptions.bufferValueEncoding, path)
    }
    if (dbcreationoptions.leveldbValueEncoding) {
      if (!leveldblib[dbcreationoptions.leveldbValueEncoding]) {
        throw new lib.Error('LEVELDB_ENCODING_NOT_RECOGNIZED', dbcreationoptions.leveldbValueEncoding);
      }
      return leveldblib[dbcreationoptions.leveldbValueEncoding];
    }
    return dbcreationoptions.valueEncoding;
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
    this.dbdirpath = prophash.path;
    this.kvstorageopts = prophash.kvstorage || {};
    this.kvstorageopts.dbname = this.kvstorageopts.dbname || 'kvstorage.db';
    this.logopts = prophash.log || {};
    this.logopts.dbname = this.logopts.dbname || 'log.db';
    this.kvstorage = null;
    this.log = null;
    this.locks = new qlib.JobCollection();
    this.startDBs();
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
    this.dbdirpath = null;
    ParentService.prototype.__cleanUp.call(this);
  };
  
  LevelDBWithLogService.prototype.isInitiallyReady = function () {
    return false;
  };

  LevelDBWithLogService.prototype.startDBs = function () {
    q.allSettled(this.createStartDBPromises()).then(
      this.onDBsReady.bind(this)
    ).fail(
      this.close.bind(this)
    );
  };

  LevelDBWithLogService.prototype.onDBsReady = function (dbpath) {
    this.readyToAcceptUsersDefer.resolve(true);
  };

  LevelDBWithLogService.prototype.createStartDBPromises = function () {
    var kvsd = q.defer(),
      kvso = leveldboptshash2obj(this.kvstorageopts, this.dbdirpath),
      ld = q.defer(),
      lo = this.logCreateObj(),
      rd = q.defer();

    kvso.starteddefer = kvsd;
    lo.starteddefer = ld;

    this.kvstorage = leveldblib.createDBHandler(kvso);
    this.log = new (leveldblib.DBArray)(lo);
    this.resets = leveldblib.createDBHandler({
      dbname: Path.join(this.dbdirpath, 'resets.db'),
      dbcreationoptions: {
        valueEncoding: bufferlib.makeCodec(['String', 'UInt64LE', 'UInt64LE', 'UInt32LE'], 'resets')
        //username, minmoment, maxmoment, txncount
      }
    });
    return [kvsd.promise, ld.promise];
  };

  LevelDBWithLogService.prototype.logCreateObj = function () {
    var lo = leveldboptshash2obj(this.logopts, this.dbdirpath);
    lo.startfromone = true;
    return lo;
  };

  LevelDBWithLogService.prototype.put = function (key,value) {
    return this.kvstorage.put(key,value);
    //TODO work with log....
  };

  LevelDBWithLogService.prototype.get = function (key) {
    return this.kvstorage.get(key);
  };

  LevelDBWithLogService.prototype.safeGet = function (key, deflt) {
    return this.kvstorage.safeGet(key, deflt);
  };

  LevelDBWithLogService.prototype.getWDefault = function (key, deflt) {
    return this.kvstorage.getWDefault(key, deflt);
  };

  LevelDBWithLogService.prototype.del = function (key) {
    return this.kvstorage.del(key);
  };

  LevelDBWithLogService.prototype.recordReset = function (resetid, username, minmoment, maxmoment, txncount) {
    return this.resets.put(resetid, [username, minmoment, maxmoment, txncount]);
  };

  LevelDBWithLogService.prototype.propertyHashDescriptor = {
    path: {
      type: 'string'
    }
  };
  
  return LevelDBWithLogService;
}

module.exports = createLevelDBWithLogService;
