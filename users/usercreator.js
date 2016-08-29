function createUser(execlib, ParentUser, leveldblib) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib,
    execSuite = execlib.execSuite,
    HookableUserSessionMixin = leveldblib.HookableUserSessionMixin;

  if (!ParentUser) {
    ParentUser = execlib.execSuite.ServicePack.Service.prototype.userFactory.get('user');
  }

  var UserSession = ParentUser.prototype.getSessionCtor('.'),
    Channel = UserSession.Channel;

  function KVStorageChannel (usersession){
    Channel.call(this, usersession);
  }
  lib.inherit(KVStorageChannel, Channel);
  KVStorageChannel.prototype.name = 'l';

  function KVStorageSession (user, session, gate) {
    UserSession.call(this, user, session, gate);
    HookableUserSessionMixin.call(this, this.user.__service.kvstorage);
    this.addChannel(KVStorageChannel);
  }

  UserSession.inherit(KVStorageSession, HookableUserSessionMixin.__methodDescriptors);
  HookableUserSessionMixin.addMethods(KVStorageSession);

  KVStorageSession.prototype.__cleanUp = function () {
    HookableUserSessionMixin.prototype.destroy.call(this);
    UserSession.prototype.__cleanUp.call(this);
  };

  KVStorageSession.Channel = KVStorageChannel;

  function User(prophash) {
    ParentUser.call(this, prophash);
  }
  
  ParentUser.inherit(User, require('../methoddescriptors/user'), [/*visible state fields here*/]/*or a ctor for StateStream filter*/);
  User.prototype.__cleanUp = function () {
    ParentUser.prototype.__cleanUp.call(this);
  };

  User.prototype.traverseResets = function (options, defer) {
    this.streamLevelDB(this.__service.resets, options, defer);
  };

  User.prototype.getSessionCtor = execSuite.userSessionFactoryCreator(KVStorageSession);

  return User;
}

module.exports = createUser;
