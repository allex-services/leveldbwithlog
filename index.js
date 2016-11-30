function createServicePack(execlib) {
  'use strict';
  return {
    service: {
      dependencies: ['.', 'allex:leveldbwithlog:lib', 'allex:leveldb:lib']
    },
    sinkmap: {
      dependencies: ['.', 'allex:leveldb:lib']
    }, /*
    tasks: {
      dependencies: []
    }
    */
  }
}

module.exports = createServicePack;
