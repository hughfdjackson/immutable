var a = require('assert'),
    p = require('..')

suite('p.array')

test('has right constructor', function(){
    a.equal(p.array.prototype.constructor, p.array)
})

test('-data is a function', function(){
    var arr = p.array([])
    a.equal(typeof arr['-data'], 'function')
})

test('takes p.object\'s methods', function(){
    var arr  = p.array(),
        object = p.object()

    a.equal(arr.get, object.get)
    a.equal(arr.has, object.has)
    a.equal(arr.dissoc, object.dissoc)
})

test('array.assoc returns array', function(){
    var arr = p.array().assoc(1, '2').assoc({ x: 3 }).assoc([1, 2, 3])

    a.ok(arr instanceof p.array)
})

test('array.mutable returns array with *all* props copied', function(){
    var arr = p.array({ x: 3, 0: 1, 2: 3 }).mutable()

    a.equal(arr[0], 1)
    a.equal(arr[2], 3)
    a.equal(arr.length, 3)

    a.equal(arr.x, 3)
    a.ok(Array.isArray(arr))
})

test('push', function(){
    var arr = p.array([1, 2, 3])

    arr.push(4, 5, 6)
    a.deepEqual(arr.mutable(), [1, 2, 3])

    arr = arr.push(4, 5, 6)
    a.deepEqual(arr.mutable(), [1, 2, 3, 4, 5, 6])
})

test('pop', function(){
    var arr = p.array([1, 2, 3])

    arr.pop()
    a.deepEqual(arr.mutable(), [1, 2, 3])

    arr = arr.pop()
    a.deepEqual(arr.mutable(), [1, 2])

    arr = p.array([])
    arr = arr.pop()

    a.deepEqual(arr.mutable(), [])
})


test('unshift', function(){
    var arr = p.array([1, 2, 3])

    arr.unshift(4, 5, 6)
    a.deepEqual(arr.mutable(), [1, 2, 3])

    arr = arr.unshift(4, 5, 6)
    a.deepEqual(arr.mutable(), [4, 5, 6, 1, 2, 3])
})

test('shift', function(){
    var arr = p.array([1, 2, 3])

    arr.shift()
    a.deepEqual(arr.mutable(), [1, 2, 3])

    arr = arr.shift()
    a.deepEqual(arr.mutable(), [2, 3])

    arr = p.array([])
    arr = arr.shift()

    a.deepEqual(arr.mutable(), [])
})

test('concat', function(){
    var arr = p.array([1, 2, 3]),
        res = arr.concat([4, 5, 6])

    a.deepEqual(res.mutable(), [1, 2, 3, 4, 5, 6])

    res = arr.concat(arr)
    a.deepEqual(res.mutable(), [1, 2, 3, 1, 2, 3])
})

test('length', function(){
    var arr = p.array([1, 2, 3])

    a.equal(arr.length, 3)

    arr = arr.push(1)
    a.equal(arr.length, 4)

    arr = arr.assoc(100, 3)
    a.equal(arr.length, 101)
})


test('wraps all native methods', function(){
    var assertNotSameAsPrototype = function(name){ a.notEqual(p.array.prototype[name], Array.prototype[name]) }

    ;["toString", "toLocaleString", "join", "pop", "push", "concat", "reverse", "slice",
     "splice", "sort", "filter", "forEach", "some", "every", "map", "indexOf", "lastIndexOf",
      "reduce", "reduceRight"].forEach(assertNotSameAsPrototype)
})


test('.filter - an object returning wrapped method - rewraps in p.array', function(){
    var arr = p.array([1, 2, 3]),
        odd = function(n){ return n % 2 !== 0 },
        res = arr.filter(odd)

    a.ok(res instanceof p.array)

    a.ok(arr.get(1), 2)
    a.ok(res.get(1), undefined)
})

test('.every - a non-object returning wrapped method', function(){
    var arr = p.array([1, 2, 3]),
        odd = function(n){ return n % 2 !== 0 }

    a.equal(arr.every(odd), false)
    a.equal(arr.some(odd), true)
})

test('.reduce and .reduceRight return the same type', function(){
    var arr = p.array([1, 2, 3])

    var res = arr.reduce(function(arr, i) { arr.push(i + 1); return arr }, [])
    a.ok(!(res instanceof p.array))

    res = arr.reduceRight(function(arr, i) { arr.push(i + 1); return arr }, [])
    a.ok(!(res instanceof p.array))
})
