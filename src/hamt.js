var u = require('./util'),
    hash = require('string-hash')

var mask = function(hash, shift){
    return (hash >>> shift) & 0x01f
}

var splitPositions = [0, 5, 10, 15, 20, 25, 30]

// get the path from an already hashed key
// int -> [int]
var hashPath = function(h){
    return splitPositions.map(mask.bind(null, h))
}

// get the path from a key
// string -> [int]
var keyPath = function(k){ return hashPath(hash(k)) }

var reduceWhile = function(a, fn, pred, seed){
    for ( var i = 0; i < a.length; i += 1 ) {
        if ( ! pred(a[i], i, a) ) return seed
        seed = fn(seed, a[i], i, a)
    }
    return seed
}

// a hash array map trie (hamt) is one in which each non-leaf node has 32 children, from 0-31.
// The children could be A) an empty node (represented here as an absence of
// a property at all in the children hash), B) a trie, or C) a value object, which
// contains the key and val (since the trie is traversed by a hash, this is needed to
// ensure that the key is the same on retrieval.
// Since the trie's depth is bounded by the number of 5-bit groups in the 32-bit int, when
// collision occurs, there can only be a maximum of 7 depths of specificity.  After this, a regular 'hash'
// value will be used as a catch all conflict resolver.

// nodes
var trie     = function(){     return { type : 'trie', children: {} } }
var value    = function(k, v){ return { type: 'value', key: k, value: v } }
var hashmap  = function(){     return { type: 'hashmap', values: {} } }

var isTrie    = function(v){ return v.type === 'trie' }
var isValue   = function(v){ return v.type === 'value' }
var isHashmap = function(v){ return v.type === 'hashmap' }

var unpack = function(v, pathPart, k) {
    if ( isTrie(v)  ) return v.children[pathPart]
}

var getPathState = function(trie, k){
    var path = keyPath(k)

    // always O(n) at the moment
    return path.reduce(function(state, pathPart){
        var newNode = unpack(state.currNode, pathPart)
        if ( newNode === undefined ) return state
        return {
            currNode: newNode,
            realPath: state.realPath.concat([pathPart])
        }
    }, { currNode: trie, realPath: [] })
}

var realPath = function(trie, k){ return getPathState(trie, k).realPath }
var realValue = function(trie, k){ return getPathState(trie, k).currNode }

// immutable trie operations
var has    = function(trie, key) {
    // get longest possible path to the key
    var node = realValue(trie, key)

    if ( isValue(node) && node.key === key )     return true
    if ( isHashmap(node) && key in node.values ) return true
    else                                         return false
}

var get    = function(trie, key) {
    var node = realValue(trie, key)

    if ( isValue(node) && node.key === key ) return node.value
    if ( isHashmap(node) && key in node.values ) return node.values[key]
}

var set    = function(trie, k, v) {}
var remove = function(trie, k) {}

module.exports = {
    hashPath: hashPath,
    keyPath : keyPath,
    mask    : mask,
    hash    : hash,
    has     : has,
    get     : get,
    set     : set,
    remove  : remove,
    unpack  : unpack,
    realPath: realPath
}
