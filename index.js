function createServicePack(execlib) {
  'use strict';
  return {
    service: {
      dependencies: ['.', 'allex_leveldbwithloglib', 'allex_leveldblib']
    },
    sinkmap: {
      dependencies: ['.', 'allex_leveldblib']
    }, /*
    tasks: {
      dependencies: []
    }
    */
  }
}

module.exports = createServicePack;
