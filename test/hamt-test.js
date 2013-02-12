var a = require('assert')
var h = require('../src/hamt')

suite('hamt - has')

test('shallow', function(){
    var t = h.Trie({ 3: h.Value('foo', 'bar', [3, 5, 6]) })
    a.ok(h.has(t, [3, 3, 5, 6], 'foo'))
    a.ok(!h.has(t, [3, 3, 5, 6], 'bar'))
    a.ok(!h.has(t, [4, 3, 5, 6], 'quux'))

})

test('1 deep', function(){
    var t = h.Trie({ 3: h.Trie({ 3: h.Value('foo', 'bar', [5, 6]) }) })
    a.ok(h.has(t, [3, 3, 5, 6], 'foo'))
    a.ok(!h.has(t, [3, 3, 5, 6], 'bar'))
    a.ok(!h.has(t, [9, 3, 5, 6], 'quux'))
})

test('2 deep', function(){
    var t = h.Trie({
        3: h.Trie({
            3: h.Trie({
                5: h.Trie({
                    6: h.Value('foo', 'bar', []) }) }) }) })

    a.ok(h.has(t, [3, 3, 5, 6], 'foo'))
    a.ok(!h.has(t, [3, 3, 5, 6], 'bar'))
    a.ok(!h.has(t, [9, 3, 5, 6], 'quux'))
})

suite('hamt - get')

test('shallow', function(){
    var t = h.Trie({ 3: h.Value('foo', 'bar', [3, 5, 6]) })
    a.equal(h.get(t, [3, 3, 5, 6], 'foo'), 'bar')
    a.equal(h.get(t, [3, 3, 5, 6], 'bar'), undefined)
    a.equal(h.get(t, [9, 3, 5, 6], 'quux'), undefined)
})

test('1 deep', function(){
    var t = h.Trie({ 3: h.Trie({ 3: h.Value('foo', 'bar', [5, 6]) }) })
    a.equal(h.get(t, [3, 3, 5, 6], 'foo'), 'bar')
    a.equal(h.get(t, [3, 3, 5, 6], 'bar'), undefined)
    a.equal(h.get(t, [9, 3, 5, 6], 'quux'), undefined)
})

test('2 deep', function(){
    var t = h.Trie({
        3: h.Trie({
            3: h.Trie({
                5: h.Trie({
                    6: h.Value('foo', 'bar', []) }) }) }) })

    a.equal(h.get(t, [3, 3, 5, 6], 'foo'), 'bar')
    a.equal(h.get(t, [3, 3, 5, 6], 'bar'), undefined)
    a.equal(h.get(t, [4, 3, 5, 6], 'quux'), undefined)
})


suite('hamt - set')

test('shallow', function(){
    var t1 = h.Trie({})
    var t2 = h.set(t1, [3, 3, 4, 5], 'wiggle', 'quux')

    a.deepEqual(t2, h.Trie({ 3: h.Value('wiggle', 'quux', [3, 4, 5]) }))
})

test('overwrite', function(){
    var t1 = h.Trie({ 3: h.Value('wiggle', 'quux', [3, 4, 5]) })
    var t2 = h.set(t1, [3, 3, 4, 5], 'wiggle', 'baz')

    a.deepEqual(t1, h.Trie({ 3: h.Value('wiggle', 'quux', [3, 4, 5]) }))
    a.deepEqual(t2, h.Trie({ 3: h.Value('wiggle', 'baz', [3, 4, 5]) }))
})


// test('1 deep w/ conflict', function(){
//     var t1 = h.Trie({ 3: h.Value('foo', 'bar', [3, 5, 6]) })
//     var t2 = h.set(t1, [3, 3, 4, 5], 'wiggle', 'quux')

//     a.deepEqual(t2, h.Trie({
//         3: h.Trie({
//             3: h.Trie({
//                 4: h.Value('wiggle', 'quux', [5]),
//                 5: h.Value('foo', 'bar', [6]) })})}))
// })

// test('deep with no conflict', function(){

// })

// test('shallow', function(){
//     var t1 = h.Trie({ 3: h.Value('foo', 'bar', [3, 5, 6]) })
//     var t2 = h.set(t1, [3, 3, 4, 5], 'wiggle', 'quux')

//     a.deepEqual(t2, h.Trie({
//         3: h.Trie({
//             3: h.Trie({
//                 4: h.Value('wiggle', 'quux', [4, 5]),
//                 5: h.Value('foo', 'bar', [5, 6]) }) }) }))
// })

suite('hamt - nodes')

test('Trie', function(){
    var children = { 0: {} }
    var t = h.Trie(children)

    a.equal(t.type, 'trie')
    a.deepEqual(t.children, children)
    a.ok(Object.isFrozen(t))
    a.ok(Object.isFrozen(t.children))
})

test('Value', function(){
    var key = 'my-key'
    var val = 'my-val'
    var v   = h.Value(key, val)

    a.equal(v.type, 'value')
    a.equal(v.value, val)
    a.equal(v.key, key)

    a.ok(Object.isFrozen(v))
})

test('Hashmap', function(){
    var values = { 0: {} }
    var hm     = h.Hashmap(values)

    a.equal(hm.type, 'hashmap')
    a.deepEqual(hm.values, values)
    a.ok(Object.isFrozen(hm.values))
    a.ok(Object.isFrozen(hm))
})

test('path', function(){
    var priv = h['-']
    a.deepEqual(h.path('foo'), priv.hashPath(priv.hash('foo')), 'keyPath is hashPath . hash')
})


suite('hamt - private')

test('-mask5', function(){
    var bits  = parseInt('00111110000011111000001111100000', 2)
    var mask5 = h['-'].mask5

    a.equal(mask5(bits, 0).toString(2), '0')
    a.equal(mask5(bits, 5).toString(2), '11111')
})

test('hashPath', function(){
    var bits    = parseInt('00111110000011111000001111100001', 2),
        path    = h['-'].hashPath(bits),
        strPath = path.map(function(v){ return v.toString(2) })

    a.deepEqual(strPath, ['1', '11111', '0', '11111', '0', '11111', '0'], 'hashPath splits into groups of 5 bits where possible, reversing for natural traversal')
})
