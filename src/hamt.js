'use strict'

var u = require('./util')
var hash = require('string-hash')
var multimethod = require('multimethod')



// node, [int], string -> bool
var has = multimethod()
    .dispatch('type')
    .when('trie', function(trie, path, key){
        var child = trie.children[path[0]]
        if ( child === undefined )    return false
        if ( child.type === 'value' ) return has(child, path, key)
        if ( child.type === 'trie' )  return has(child, path.slice(1), key)
    })
    .when('value', function(value, path, key){
        if ( value.key === key ) return true
        else                     return false
    })
    .when('hashmap', function(hashmap, path, key){})

// node, [int], string -> val
var get = multimethod()
    .dispatch('type')
    .when('trie', function(trie, path, key){
        var child = trie.children[path[0]]
        if ( child === undefined )    return undefined
        if ( child.type === 'value' ) return get(child, path, key)
        if ( child.type === 'trie' )  return get(child, path.slice(1), key)
    })
    .when('value', function(value, path, key){
        if ( value.key === key ) return value.value
        else                     return undefined
    })
    .when('hashmap', function(hashmap, path, key){})

// node, path, string, val -> Trie
var set = multimethod()
    .dispatch('type')
    .when('trie', function(trie, path, key, val){})
    .when('value', function(value, path, key, val){})
    .when('hashmap', function(hashmap, path, key){})

// node, path, key -> Trie
var remove = multimethod()
    .dispatch('type')


// node ctors
var Trie = function(children){
    return Object.freeze({ type: 'trie', children: Object.freeze(children) })
}

var Value    = function(key, value, path){
    return Object.freeze({ type: 'value', key: key, value: value, path: path })
}

var Hashmap  = function(values){
    return Object.freeze({ type: 'hashmap', values: Object.freeze(values) })
}

// hashing operations

// get a <= 5 bit section of a hash, shifted from the left position
// int, int -> int
var mask5 = function(hash, from){ return (hash >>> from) & 0x01f }

// get the path from an already hashed key
// int -> [int]
var hashPath = function(hash){
    return splitPositions.map(mask5.bind(null, hash))
}
var splitPositions = [0, 5, 10, 15, 20, 25, 30]

// get the maximal path to a key
// string -> [int]
var path =  function(k){ return hashPath(hash(k)) }

module.exports = {
    Trie      : Trie,
    Value     : Value,
    Hashmap   : Hashmap,
    path      : path,
    has       : has,
    get       : get,
    set       : set,
    remove    : remove
}

module.exports['-'] = {
    hashPath  : hashPath,
    mask5     : mask5,
    hash      : hash
}
