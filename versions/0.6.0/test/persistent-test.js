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

test('dict(Object)', function(){
    var opts = { x: 1, y: 2 },
        o = p.dict(opts)

    a.ok(o.has('x'))
    delete opts.x
    a.ok(o.has('x'))
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
    var o = p.dict({ x: 3 })

    a.equal(o.get('x'), 3)
    a.equal(o.get('y'), undefined)
})

test('dict.has', function(){
    var o = p.dict({ x: 3 })

    a.ok(o.has('x'))
    a.ok(!o.has('y'))
})

test('dict.remove', function(){
    var o1 = p.dict({ x: 3 }),
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


suite('p.list')

test('has right constructor', function(){
    a.equal(p.list.prototype.constructor, p.list)
})

test('it is frozen', function(){
    var arr = p.list([])

    arr.x = 4
    a.equal(arr.x, undefined)
})

test('-data is frozen', function(){
    var arr = p.list([])

    arr['-data'].x = 3
    a.equal(arr['-data'].x, undefined)
})

test('takes p.dict\'s methods', function(){
    var arr  = p.list(),
        dict = p.dict()

    a.equal(arr.get, dict.get)
    a.equal(arr.remove, dict.remove)
    a.equal(arr['delete'], dict['delete'])
})

test('list.set returns list', function(){
    var arr = p.list().set(1, '2').set({ x: 3 }).set([1, 2, 3])

    a.ok(arr instanceof p.list)
})

test('list.transient returns list with *all* props copied', function(){
    var arr = p.list({ x: 3, 0: 1, 2: 3 }).transient()

    a.equal(arr[0], 1)
    a.equal(arr[2], 3)
    a.equal(arr.length, 3)

    a.equal(arr.x, 3)
    a.ok(Array.isArray(arr))
})

test('push', function(){
    var arr = p.list([1, 2, 3])
    
    arr.push(4, 5, 6)
    a.deepEqual(arr.transient(), [1, 2, 3])
    
    arr = arr.push(4, 5, 6)
    a.deepEqual(arr.transient(), [1, 2, 3, 4, 5, 6])
})

test('pop', function(){
    var arr = p.list([1, 2, 3])

    arr.pop()
    a.deepEqual(arr.transient(), [1, 2, 3])
    
    arr = arr.pop()
    a.deepEqual(arr.transient(), [1, 2])

    arr = p.list([])
    arr = arr.pop()

    a.deepEqual(arr.transient(), [])
})


test('unshift', function(){
    var arr = p.list([1, 2, 3])

    arr.unshift(4, 5, 6)
    a.deepEqual(arr.transient(), [1, 2, 3])

    arr = arr.unshift(4, 5, 6)
    a.deepEqual(arr.transient(), [4, 5, 6, 1, 2, 3])
})

test('shift', function(){
    var arr = p.list([1, 2, 3])

    arr.shift()
    a.deepEqual(arr.transient(), [1, 2, 3])
    
    arr = arr.shift()
    a.deepEqual(arr.transient(), [2, 3])

    arr = p.list([])
    arr = arr.shift()

    a.deepEqual(arr.transient(), [])
})

test('concat', function(){
    var arr = p.list([1, 2, 3]),
        res = arr.concat([4, 5, 6])

    a.deepEqual(res.transient(), [1, 2, 3, 4, 5, 6])

    res = arr.concat(arr)
    a.deepEqual(res.transient(), [1, 2, 3, 1, 2, 3])
})

test('length', function(){
    var arr = p.list([1, 2, 3])
    
    a.equal(arr.length, 3)
    
    arr = arr.push(1)
    a.equal(arr.length, 4)
    
    arr = arr.set(100, 3)
    a.equal(arr.length, 101)
})



test('wraps all native methods', function(){
    var assertNotSameAsPrototype = function(name){ a.notEqual(p.list.prototype[name], Array.prototype[name]) }

    ;["toString", "toLocaleString", "join", "pop", "push", "concat", "reverse", "slice", 
     "splice", "sort", "filter", "forEach", "some", "every", "map", "indexOf", "lastIndexOf", 
      "reduce", "reduceRight"].forEach(assertNotSameAsPrototype)
})


test('.filter - an object returning wrapped method - rewraps in p.list', function(){
    var arr = p.list([1, 2, 3]),
        odd = function(n){ return n % 2 !== 0 },
        res = arr.filter(odd)
    
    a.ok(res instanceof p.list)

    a.ok(arr.get(1), 2)
    a.ok(res.get(1), undefined)
})

test('.every - a non-object returning wrapped method', function(){
    var arr = p.list([1, 2, 3]),
        odd = function(n){ return n % 2 !== 0 }

    a.equal(arr.every(odd), false)
    a.equal(arr.some(odd), true)
})

test('.reduce and .reduceRight return the same type', function(){
    var arr = p.list([1, 2, 3])
    
    var res = arr.reduce(function(arr, i) { arr.push(i + 1); return arr }, [])
    a.ok(!(res instanceof p.list))

    res = arr.reduceRight(function(arr, i) { arr.push(i + 1); return arr }, [])
    a.ok(!(res instanceof p.list))
})
