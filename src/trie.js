var u = require('./util'),
    hash = require('string-hash')

var trimLeftWith = function(a, fn){
    var filter = true
    return a.filter(function(v){
        if ( fn(v) && filter ) return false
        filter = false
        return true
    })
}

var mask = function(hash, shift){
    return (hash >>> shift) & 0x01f
}

var splitPositions = [0, 5, 10, 15, 20, 25, 30]

// get the path from a key
// string -> [int]
var keyPath = function(k){ return hashPath(hash(k)) }

// get the path from an already hashed key
// int -> [int]
var hashPath = function(h){
    var is0   = function(v){ return v === 0 },
        nodes = splitPositions.map(mask.bind(null, h))
    return trimLeftWith(nodes, is0)
}

// turns a path into a trie
// [int], val -> trie
var pathToTrie = function(path, val){}





module.exports = {
    hashPath: hashPath,
    keyPath : keyPath,
    mask    : mask,
    hash    : hash
}
