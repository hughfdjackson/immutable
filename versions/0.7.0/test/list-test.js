var a = require('assert'),
    p = require('..')

suite('p.list')

test('has right constructor', function(){
    a.equal(p.list.prototype.constructor, p.list)
})

// test('it is frozen', function(){
//     var arr = p.list([])

//     arr.x = 4
//     a.equal(arr.x, undefined)
// })

test('-data is a function', function(){
    var arr = p.list([])
    a.equal(typeof arr['-data'], 'function')
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
