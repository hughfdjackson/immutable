'use strict'

var u = require('./util')
var hash = require('string-hash')
var multimethod = require('multimethod')

var copyAdd = function(o, k, v){
    o = u.clone(o)
    o[k] = v
    return o
}

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
        else                          return get(child, path.slice(1), key)
    })
    .when('value', function(value, path, key){
        if ( value.key === key ) return value.value
        else                     return undefined
    })
    .when('hashmap', function(hashmap, path, key){
        var v = hashmap.values[key]
        if ( v ) return v.value
    })

// node, path, string, val -> Trie
var set = multimethod()
    .dispatch('type')
    .when('trie', function(trie, path, key, val){
        var child = trie.children[path[0]]

        if ( child === undefined  )   return Trie(copyAdd(trie.children, path[0], Value(key, val, path.slice(1))))
        if ( child.type === 'value' ) return Trie(copyAdd(trie.children, path[0], set(child, path.slice(1), key, val)))
    })
    .when('value', function(value, path, key, val){
        if ( value.key === key ) return Value(key, val, path)
        // result shallow conflict
        if ( path[0] !== value.path[0] ) {
            var cs = {}
            cs[value.path[0]] = Value(value.key, value.value, value.path.slice(1))
            cs[path[0]]       = Value(key, val, path.slice(1))
            return Trie(cs)
        }

        if ( path.length !== 0 ) {
            // deep conflict
            var val1 = Value(value.key, value.value, value.path.slice(1))
            var val2 = Value(key, val, path.slice(1))

            var cs = {}
            cs[path[0]] = val2
            return set(Trie(cs), value.path, value.key, value.value)
        }

        var cs = {}
        cs[key] = Value(key, val, path)
        cs[value.key] = value

        return Hashmap(cs)
    })
    .when('hashmap', function(hashmap, path, key, val){
        var v = copyAdd(hashmap.values, key, Value(key, val, []))
        return Hashmap(v)
    })

// node, path, key -> Trie
var remove = multimethod()
    .dispatch('type')


// node ctors
var Trie = function(children){
    return Object.freeze({ type: 'trie', children: Object.freeze(children) })
}

var Value = function(key, value, path){
    return Object.freeze({ type: 'value', key: key, value: value, path: path })
}

var Hashmap = function(values){
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
