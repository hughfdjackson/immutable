var Benchmark = new require('benchmark')
var p = require('../v/0.7.0')

var suite = new Benchmark.Suite
var obj = p.dict({ x: 3 })

suite.add('set test', function(){
    var o = {}
    o[Math.random()] = Math.random()
    p.dict(o)
})

.add('get test', function(){
    obj.get('x')
})

.on('complete', function(){
    var data = this.map(function(o){ return { name: o.name, count: o.count } })
    console.log(data)
})


.run()
// suite.reduce('set test', function(object){
//     return object.set(Math.random(), Math.random())
// }, p.dict({}))

// .run()
