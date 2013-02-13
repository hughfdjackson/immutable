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


var copyAdd = function(o, k, v){
    o = u.clone(o)
    o[k] = v
    return o
}

// node, path, string, val -> Trie
var set = multimethod()
    .dispatch('type')
    .when('trie', function(trie, path, key, val){
        var child = trie.children[path[0]]

        if ( child === undefined  ) return Trie(copyAdd(trie.children, path[0], Value(key, val, path.slice(1))))
        else                        return Trie(copyAdd(trie.children, path[0], set(child, path.slice(1), key, val)))
    })
    .when('value', function(value, path, key, val){
        if ( value.key === key ) return Value(key, val, path)

        // resolve shallow conflict
        if ( path[0] !== value.path[0] ) {
            var cs = {}
            cs[value.path[0]] = Value(value.key, value.value, value.path.slice(1))
            cs[path[0]]       = Value(key, val, path.slice(1))
            return Trie(cs)
        }

        // resolve deep conflict
        if ( path.length !== 0 ) {

            var val1 = Value(value.key, value.value, value.path.slice(1))
            var val2 = Value(key, val, path.slice(1))

            var cs = {}
            cs[path[0]] = val2
            return set(Trie(cs), value.path, value.key, value.value)
        }

        // resolve empty path - store them in a hashmap
        var cs = {}
        cs[key] = Value(key, val, path)
        cs[value.key] = value

        return Hashmap(cs)
    })
    .when('hashmap', function(hashmap, path, key, val){
        var v = copyAdd(hashmap.values, key, Value(key, val, []))
        return Hashmap(v)
    })

var copyRemove = function(o, k){
    o = u.clone(o)
    delete o[k]
    return o
}

// node, path, key -> Trie
var remove = multimethod()
    .dispatch('type')
    .when('trie', function(trie, path, key){
        var child = trie.children[path[0]]

        var t = child      === undefined                     ? trie
              : child.type === 'value' && child.key !== key  ? trie
              : child.type === 'value' && child.key === key  ? Trie(copyRemove(trie.children, path[0]))
              :                                                Trie(copyAdd(trie.children, path[0], remove(child, path.slice(1), key)))

        var keys = Object.keys(t.children)
        var child = t.children[keys[0]]

        if ( keys.length === 1 && child.type === 'value' ) return Value(child.key, child.value, [+keys[0]].concat(child.path))
        else                                               return t
    })
    .when('hashmap', function(map, path, key){
        var ret = copyRemove(map.values, key)
        var keys = Object.keys(ret)
        var child = ret[keys[0]]

        if ( keys.length === 1 ) return Value(child.key, child.value, [])
        else                     return Hashmap(ret)
    })

var transient = multimethod()
    .dispatch('type')
    .when('trie', function(trie){
        var keys = Object.keys(trie.children)
        var vals = keys.map(function(key){
            return transient(trie.children[key])
        })
        if ( vals.length > 0 ) return vals.reduce(u.extend)
        else                   return {}
    })
    .when('value', function(value){
        var o = {}
        o[value.key] = value.value
        return o
    })
    .when('hashmap', function(hashmap){
        var keys = Object.keys(hashmap.values)
        var vals = keys.map(function(key){
            return transient(hashmap.values[key])
        })
        if ( vals.length > 0 ) return vals.reduce(u.extend)
        else                   return {}
    })

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
    remove    : remove,
    transient : transient
}

module.exports['-'] = {
    hashPath  : hashPath,
    mask5     : mask5,
    hash      : hash
}
