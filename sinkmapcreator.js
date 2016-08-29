function sinkMapCreator(execlib, ParentSinkMap, leveldb) {
  'use strict';
  var sinkmap = new (execlib.lib.Map);
  sinkmap.add('service', require('./sinks/servicesinkcreator')(execlib, ParentSinkMap.get('service')));
  sinkmap.add('user', require('./sinks/usersinkcreator')(execlib, ParentSinkMap.get('user'), leveldb));
  
  return sinkmap;
}

module.exports = sinkMapCreator;
