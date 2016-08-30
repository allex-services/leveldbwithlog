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
