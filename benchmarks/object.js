var Benchmark = new require('benchmark')

var genProp = function(){
    var o = {}
    o[Math.random()] = Math.random()
    return o
}

var test = function(p, version){
    var suite = new Benchmark.Suite

    var obj = p.dict({ x: 3 })

    return suite

        .add('set one', function(){
            p.dict(genProp())
        })

        .add('set 25', function(){
            var o = p.dict()
            for ( var i = 0; i < 25; i +=1 ) {
                o = o.set(genProp())
            }
        })

        .add('set 50', function(){
            var o = p.dict()
            for ( var i = 0; i < 50; i +=1 ) {
                o = o.set(genProp())
            }
        })

        .add('set 100', function(){
            var o = p.dict()
            for ( var i = 0; i < 100; i +=1 ) {
                o = o.set(genProp())
            }
        })

        .add('set 1000', function(){
            var o = p.dict()
            for ( var i = 0; i < 1000; i +=1 ) {
                o = o.set(genProp())
            }
        })

        .add('get one', function(){
            obj.get('x')
        })

        .on('complete', function(){
            var data = this.map(function(o){ return { name: o.name, count: o.count } })
            console.log('VERSION', version, data)
        })

        .run({
            async: true
        })

}

test(require('../versions/0.7.0'), '0.7.0')
test(require('../versions/0.6.0'), '0.6.0')
