var a = require('assert'),
    h = require('../src/hamt')


suite('hamt')

test('t.mask splits up a 32 bit string', function(){
    var bits = parseInt('00111110000011111000001111100000', 2)

    // should chunk bits in groups of 5
    a.equal(h.mask(bits, 0).toString(2), '0')
    a.equal(h.mask(bits, 5).toString(2), '11111')
})

test('h.hashPath', function(){
    var bits    = parseInt('00111110000011111000001111100001', 2),
        path    = h.hashPath(bits),
        strPath = path.map(function(v){ return v.toString(2) })

    a.deepEqual(strPath, ['1', '11111', '0', '11111', '0', '11111', '0'], 'hashPath splits into groups of 5 bits where possible, reversing for natural traversal')
})

test('h.keyPath', function(){
    a.deepEqual(h.keyPath('foo'), h.hashPath(h.hash('foo')), 'keyPath is hashPath . hash')
})

test('h.unpack', function(){
    var trie = { type: 'trie',
                 children: {
                     3: { type: 'value', key: 'foo', value: 3 }}}

    var path = h.keyPath('foo')
    a.deepEqual(h.unpack(trie, path[0], 'foo'), { type: 'value', key: 'foo', value: 3 }, 'fetches node')

    var path = h.keyPath('bar')
    a.deepEqual(h.unpack(trie, path[0], 'bar'), undefined, 'returns undefined if there\'s nothing to unpack')
})

test('h.realPath', function(){
    var trie = { type: 'trie',
                 children: {
                     3: { type: 'trie',
                          children: {
                              3: { type: 'value', key: 'foo', value: 4 }}}}}

    a.deepEqual(h.realPath(trie, 'foo'), [3, 3], 'it should return all the parts needed to actually traverse the path up a trie')
})

test('h.has', function(){
    var trie = { type: 'trie',
                 children: {
                     3: { type: 'trie',
                          children: {
                              3: { type: 'value', key: 'foo', value: 4 }}}}}

    a.equal(h.has(trie, 'foo'), true)
    a.equal(h.has(trie, 'bar'), false)

    // on the 7-deep with the hash ending
    var trie = { type: 'trie',
                 children: {
                     3: { type: 'trie',
                          children: {
                              3: { type: 'trie',
                                   children: {
                                       23: { type: 'trie',
                                             children: {
                                                 14: { type: 'trie',
                                                     children: {
                                                         24: { type: 'trie',
                                                               children: {
                                                                   5: { type: 'trie',
                                                                        children: {
                                                                            0: { type: 'hashmap', values: { 'foo': 3 }}}}}}}}}}}}}}}}
    a.equal(h.has(trie, 'foo'), true)
    a.equal(h.has(trie, 'bar'), false)
})

test('h.get', function(){
    var trie = { type: 'trie',
                 children: {
                     3: { type: 'trie',
                          children: {
                              3: { type: 'value', key: 'foo', value: 4 }}}}}

    a.equal(h.get(trie, 'foo'), 4)
    a.equal(h.get(trie, 'bar'), undefined)

    // on the 7-deep with the hash ending
    var trie = { type: 'trie',
                 children: {
                     3: { type: 'trie',
                          children: {
                              3: { type: 'trie',
                                   children: {
                                       23: { type: 'trie',
                                             children: {
                                                 14: { type: 'trie',
                                                     children: {
                                                         24: { type: 'trie',
                                                               children: {
                                                                   5: { type: 'trie',
                                                                        children: {
                                                                            0: { type: 'hashmap', values: { 'foo': 3 }}}}}}}}}}}}}}}}
    a.equal(h.get(trie, 'foo'), 3)
    a.equal(h.get(trie, 'bar'), undefined)
})
