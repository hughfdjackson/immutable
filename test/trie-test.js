var a = require('assert'),
    t = require('../src/trie')

suite('trie')

test('t.mask splits up a 32 bit string', function(){
    var bits = parseInt('00111110000011111000001111100000', 2)

    // should chunk bits in groups of 5
    a.equal(t.mask(bits, 0).toString(2), '0')
    a.equal(t.mask(bits, 5).toString(2), '11111')
})

test('t.hashPath splits a hash into chunks, and removes the trailing ones', function(){
    var bits = parseInt('00111110000011111000001111100000', 2),
        path = t.hashPath(bits),
        pathStr = path.map(function(v){ return v.toString(2) })

    a.equal(path.length, 6, 'disregards the rightmove 00')
    a.deepEqual(pathStr, ['11111', '0', '11111', '0', '11111', '0'], 'splits and preserves the rest of the hash')
})

test('t.keyPath splits a key into a hash, then into chunks', function(){
    var hash = t.hash('foo'),
        path = t.keyPath('foo')

    a.deepEqual(t.hashPath(hash), path, 'keyPath is t.hashKey . t.hash')
})

test('t.pathToTrie - takes a path and returns a trie', function(){

})
