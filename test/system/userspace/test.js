function doQuery(taskobj, methodname, filters) {
  taskobj.taskRegistry.run('queryLevelDB', {
    queryMethodName: methodname,
    sink: taskobj.sink,
    scanInitially: true,
    filter: filters,
    onPut: console.log.bind(console, 'qput'),
    onDel: console.log.bind(console, 'qdel')
  });
}

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
  doQuery(taskobj, 'query', {});
  doQuery(taskobj, 'queryLog', {});
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
