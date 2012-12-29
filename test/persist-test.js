var a = require('assert'),
    p = require('..')

suite('p.map')

test('map()', function(){
    var o = p.map()
    a.ok(o)
})

test('map(Object)', function(){
    var opts = { x: 1, y: 2 },
        o = p.map(opts)

    a.ok(o.has('x'))
    delete opts.x
    a.ok(o.has('x'))
})

test('map.set', function(){
    var o1 = p.map({ x: 3 }),
        o2 = o1.set('y', 3).set({ z: 3 })

    a.ok(o1.has('x'))
    a.ok(!o1.has('y'))
    a.ok(!o1.has('z'))

    a.ok(o2.has('x'))
    a.ok(o2.has('y'))
    a.ok(o2.has('z'))
})

test('map.get', function(){
    var o = p.map({ x: 3 })

    a.equal(o.get('x'), 3)
    a.equal(o.get('y'), undefined)
})

test('map.has', function(){
    var o = p.map({ x: 3 })

    a.ok(o.has('x'))
    a.ok(!o.has('y'))
})
test('map.remove', function(){
    var o1 = p.map({ x: 3 }),
        o2 = o1.remove('x')

    a.ok(o1.has('x'))
    a.ok(!o2.has('x'))
})

test('map.delete alias for map.remove', function(){
    var o = p.map()

    a.equal(o.delete, o.remove)
})

test('p.map is a new-less constructor', function(){
    var o = p.map()

    a.ok(o instanceof p.map)
})
