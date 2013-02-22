var Benchmark = new require('benchmark')

var genProp = function(){
    var o = {}
    o[Math.random()] = Math.random()
    return o
}

var genObj = function(p, n){
    var o = p.dict({})
    for ( var i = 0; i < n; i +=1 ) {
        o = o.set(genProp())
    }
    return o
}


var testSet = function(p, n){
    var o = genObj(p, n)
    return function(){
        o.set(genProp())
    }
}

var testTransient = function(p, n){
    var o = genObj(p, n)
    return function(){
        o.transient()
    }
}

var testGet = function(p, n){
    var o = genObj(p, n - 1)
    var k = 'a'
    o.set(k, Math.random())
    return function(){
        o.get(k)
    }
}

var testHas = function(p, n){
    var o = genObj(p, n - 1)
    var k = 'a'
    o.set(k, Math.random())
    return function(){
        o.has(k)
    }
}

var testRemove = function(p, n){
    var o = genObj(p, n - 1)
    var k = 'a'
    o.set(k, Math.random())
    return function(){
        o.remove(k)
    }
}


var test = function(p, version){
    var suite = new Benchmark.Suite

    return suite
        .add(version + ': has 1', testHas(p, 1))
        .add(version + ': has 3', testHas(p, 3))
        .add(version + ': has 5', testHas(p, 5))
        .add(version + ': has 10', testHas(p, 10))
        .add(version + ': has 25', testHas(p, 25))
        .add(version + ': has 100', testHas(p, 100))
        .add(version + ': has 1000', testHas(p, 1000))
        .add(version + ': has 10000', testHas(p, 10000))

        .add(version + ': get 1', testGet(p, 1))
        .add(version + ': get 3', testGet(p, 3))
        .add(version + ': get 5', testGet(p, 5))
        .add(version + ': get 10', testGet(p, 10))
        .add(version + ': get 25', testGet(p, 25))
        .add(version + ': get 100', testGet(p, 100))
        .add(version + ': get 1000', testGet(p, 1000))
        .add(version + ': get 10000', testGet(p, 10000))

        .add(version + ': set 1', testSet(p, 1))
        .add(version + ': set 3', testSet(p, 3))
        .add(version + ': set 5', testSet(p, 5))
        .add(version + ': set 10', testSet(p, 10))
        .add(version + ': set 25', testSet(p, 25))
        .add(version + ': set 100', testSet(p, 100))
        .add(version + ': set 1000', testSet(p, 1000))
        .add(version + ': set 10000', testSet(p, 10000))

        .add(version + ': remove 1', testRemove(p, 1))
        .add(version + ': remove 3', testRemove(p, 3))
        .add(version + ': remove 5', testRemove(p, 5))
        .add(version + ': remove 10', testRemove(p, 10))
        .add(version + ': remove 25', testRemove(p, 25))
        .add(version + ': remove 100', testRemove(p, 100))
        .add(version + ': remove 1000', testRemove(p, 1000))
        .add(version + ': remove 10000', testRemove(p, 10000))

        .add(version + ': transient 1', testTransient(p, 1))
        .add(version + ': transient 3', testTransient(p, 3))
        .add(version + ': transient 5', testTransient(p, 5))
        .add(version + ': transient 10', testTransient(p, 10))
        .add(version + ': transient 25', testTransient(p, 25))
        .add(version + ': transient 100', testTransient(p, 100))
        .add(version + ': transient 1000', testTransient(p, 1000))
        .add(version + ': transient 10000', testTransient(p, 10000))

        .on('cycle', function(event) {
            var bench = event.target
            if (bench.error)
                console.error( '\x1B[0;31m' + ++err + ')'
                               , String(bench)
                               , bench.error.message
                               , '\n' + (bench.error.stack || '')
                               , '\x1B[0m')
            else
                console.log('››', String(bench)) })

        .on('complete', function() {
            console.log( '---\nFastest:', this.filter('fastest').pluck('name').join(', '))
        })

        .run({
            async: true
        })
}

test(require('../versions/0.7.0'), '0.7.0')
test(require('../versions/0.6.0'), '0.6.0')
test(require('..'), 'current')
