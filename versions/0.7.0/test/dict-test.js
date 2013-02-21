var a = require('assert')
var p = require('..')
var h = require('../src/hamt')
var util = require('util')

suite('p.dict')

test('has right constructor', function(){
    a.equal(p.dict.prototype.constructor, p.dict)
})

suite('p.dicts')

test('are frozen', function(){
    var d = p.dict({ })

    d.x = 3
    a.equal(d.x, undefined)
})

test('-data is a function', function(){
    var d = p.dict({ })

    a.equal(typeof d['-data'], 'function')
})


test('dict()', function(){
    var o = p.dict()
    a.ok(o)
})

test('dict(Object)', function(){
    var opts = { x: 1, y: 2 },
        o = p.dict(opts)

    a.ok(o.has('x'))
    delete opts.x
    a.ok(o.has('x'))
})

test('dict.set(k, v)', function(){
    var o  = p.dict(),
        o2 = o.set('x', 3)

    a.notEqual(o, o2)

})

test('dict.set', function(){
    var o1 = p.dict({ 'x': 3 }),
        o2 = o1.set('y', 3).set({ 'z': 3 })

    a.ok(o1.has('x'))
    a.ok(!o1.has('y'))
    a.ok(!o1.has('z'))

    a.ok(o2.has('x'))
    a.ok(o2.has('y'))
    a.ok(o2.has('z'))
})

test('dict.get', function(){
    var o = p.dict().set('x', 3)

    a.equal(o.get('x'), 3)
    a.equal(o.get('y'), undefined)
})

test('dict.has', function(){
    var o = p.dict().set('x', 3)

    a.ok(o.has('x'))
    a.ok(!o.has('y'))
})

test('dict.remove', function(){
    var o1 = p.dict().set('x', 3),
        o2 = o1.remove('x')

    a.ok(o1.has('x'))
    a.ok(!o2.has('x'))
})


test('dict.delete alias for dict.remove', function(){
    var o = p.dict()

    a.equal(o.delete, o.remove)
})

test('p.dict is a new-less constructor', function(){
    var o = p.dict()

    a.ok(o instanceof p.dict)
})


test('dict.transient returns a new mutable object with the same attrs', function(){
    var o = p.dict({ foo: 'bar' }),
        t = o.transient()

    a.ok('foo' in t)
    delete t.foo
    a.ok(!('foo' in t))
    a.ok(o.has('foo'))
})

suite('hammer test')

test('set, get, transient and remove', function(){
    var range = function(s, e){
        var a = []
        for ( var i = s; i < e; i += 1 ) a.push(i)
        return a
    }

    var alpha = 'abcdefghijklmnopqrstuvwxyz'.split('')
    var randNth = function(a){ return a[Math.floor(Math.random() * a.length)] }

    var vals = range(0, 10000).map(function(i){ var o = {}; o[i] = randNth(alpha); return o })

    var o = vals.reduce(function(o, v){
        return o.set(v)
    }, p.dict())

    var t = o.transient()

    // check all values are stored, both in the object and the transient
    vals.forEach(function(val){
        var k = Object.keys(val)[0]
        var v = val[k]

        a.equal(o.get(k), v)
        a.equal(o.has(k), true)
        a.equal(t[k], v)
    })

    // 'empty' the object
    var empty = vals.reduce(function(o, val){
        var k = Object.keys(val)[0]
        return o.remove(k)
    }, o)

    a.equal(Object.keys(empty.transient()), 0)
})
