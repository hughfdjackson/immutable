var a = require('assert')
var p = require('..')

suite('p.object')

test('has right constructor', function(){
    a.equal(p.object.prototype.constructor, p.object)
})

suite('p.objects')

test('are frozen', function(){
    var d = p.object({ })

    d.x = 3
    a.equal(d.x, undefined)
})

test('-data is a function', function(){
    var d = p.object({ })
    a.equal(typeof d['-data'], 'function')
})


test('object()', function(){
    var o = p.object()
    a.ok(o)
})

test('object(Object)', function(){
    var opts = { x: 1, y: 2 },
        o = p.object(opts)

    a.ok(o.has('x'))
    delete opts.x
    a.ok(o.has('x'))
})

test('object.assoc(k, v)', function(){
    var o  = p.object(),
        o2 = o.assoc('x', 3)

    a.notEqual(o, o2)
})

test('object.assoc', function(){
    var o1 = p.object({ 'x': 3 }),
        o2 = o1.assoc('y', 3).assoc({ 'z': 3 })

    a.ok(o1.has('x'))
    a.ok(!o1.has('y'))
    a.ok(!o1.has('z'))

    a.ok(o2.has('x'))
    a.ok(o2.has('y'))
    a.ok(o2.has('z'))
})

test('object.get', function(){
    var o = p.object().assoc('x', 3)

    a.equal(o.get('x'), 3)
    a.equal(o.get('y'), undefined)
})

test('object.has', function(){
    var o = p.object().assoc('x', 3)

    a.ok(o.has('x'))
    a.ok(!o.has('y'))
})

test('object.dissoc', function(){
    var o1 = p.object().assoc('x', 3),
        o2 = o1.dissoc('x')

    a.ok(o1.has('x'))
    a.ok(!o2.has('x'))
})

test('object.delete NOT alias for object.dissoc', function(){
    var o = p.object()
    a.equal(o.delete, undefined)
})

test('p.object is a new-less constructor', function(){
    a.ok(p.object() instanceof p.object)
})


test('object.transient returns a new mutable object with the same attrs', function(){
    var o = p.object({ foo: 'bar' }),
        t = o.transient()

    a.ok('foo' in t)
    delete t.foo
    a.ok(!('foo' in t))
    a.ok(o.has('foo'))
})
