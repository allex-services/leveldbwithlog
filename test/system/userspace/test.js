function traverser (taskobj) {
  var leveldblib;
  if (!(taskobj && taskobj.sink)) {
    process.exit(1);
    return;
  }
  leveldblib = taskobj.execlib.execSuite.libRegistry.get('allex_leveldblib').value;
  leveldblib.streamInSink(taskobj.sink, 'traverseLog', {pagesize: 5}, console.log.bind(console, 'log'), function(d) {d.resolve(true);});
}

function go (taskobj) {
  var p2c, sinkcall;
  if (!(taskobj && taskobj.sink)) {
    process.exit(1);
    return;
  }
  p2c = taskobj.execlib.lib.qlib.promise2console;
  sinkcall = taskobj.sink.call.bind(taskobj.sink);
  taskobj.sink.consumeChannel('l', console.log.bind(console, 'hook'));
  taskobj.sink.sessionCall('hook', {keys: ['***'], scan: true});
  taskobj.sink.consumeChannel('g', console.log.bind(console, 'log hook'));
  taskobj.sink.sessionCall('hookTolog', {keys: ['***'], scan: true});
  p2c(taskobj.sink.call('put', 'param1', Math.floor(Math.random()*10)), 'put').then(
    p2c.bind(null, sinkcall('get', 'param1'), 'get')
  ).then(
    traverser.bind(null, taskobj)
  );
}


module.exports = {
  sinkname: 'LDBWLog',
  identity: {name: 'user', role: 'user'},
  task: {
    name: go
  }
};
