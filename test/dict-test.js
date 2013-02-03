var a = require('assert'),
    p = require('..')

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

test('-data is frozen', function(){
    var d = p.dict({ })

    d['-data'].x = 3
    a.equal(d['-data'].x, undefined)
})


test('dict()', function(){
    var o = p.dict()
    a.ok(o)
})

// test('dict(Object)', function(){
//     var opts = { x: 1, y: 2 },
//         o = p.dict(opts)

//     a.ok(o.has('x'))
//     delete opts.x
//     a.ok(o.has('x'))
// })

test('dict.set(k, v)', function(){
    var o  = p.dict(),
        o2 = o.set('x', 3)

    a.notEqual(o, o2)

})

// test('dict.set', function(){
//     var o1 = p.dict({ 'x': 3 }),
//         o2 = o1.set('y', 3).set({ 'z': 3 })

//     a.ok(o1.has('x'))
//     a.ok(!o1.has('y'))
//     a.ok(!o1.has('z'))

//     a.ok(o2.has('x'))
//     a.ok(o2.has('y'))
//     a.ok(o2.has('z'))
// })

// test('dict.get', function(){
//     var o = p.dict({ x: 3 })

//     a.equal(o.get('x'), 3)
//     a.equal(o.get('y'), undefined)
// })

// test('dict.has', function(){
//     var o = p.dict({ x: 3 })

//     a.ok(o.has('x'))
//     a.ok(!o.has('y'))
// })

// test('dict.remove', function(){
//     var o1 = p.dict({ x: 3 }),
//         o2 = o1.remove('x')

//     a.ok(o1.has('x'))
//     a.ok(!o2.has('x'))
// })


// test('dict.delete alias for dict.remove', function(){
//     var o = p.dict()

//     a.equal(o.delete, o.remove)
// })

// test('p.dict is a new-less constructor', function(){
//     var o = p.dict()

//     a.ok(o instanceof p.dict)
// })


// test('dict.transient returns a new mutable object with the same attrs', function(){
//     var o = p.dict({ foo: 'bar' }),
//         t = o.transient()

//     a.ok('foo' in t)
//     delete t.foo
//     a.ok(!('foo' in t))
//     a.ok(o.has('foo'))
// })
