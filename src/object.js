'use strict'

var p = require('persistent-hash-trie')

var secret = {}

var object = module.exports = function(attrs){
    if ( !(this instanceof object) ) return new object(attrs)

    var store = p.Trie()

    this['-data'] = function(s, data){
        if ( s === secret && data ) return store = data
        else                        return store
    }

    Object.freeze(this)
    return attrs ? this.assoc(attrs) : this
}

object.prototype = {
    constructor: object,

    assoc: function(k, v){
        if ( typeof k === 'object' && typeof k !== null ) {
            var keys = Object.keys(k)
            return keys.reduce(function(object, key){ return object.assoc(key, k[key]) }, this)
        }
        var t = p.assoc(this['-data'](secret), k, v)
        var ret = new object()
        ret['-data'](secret, t)
        return ret
    },

    dissoc: function(k){
        var t = p.dissoc(this['-data'](secret), k)
        var ret = new object()
        ret['-data'](secret, t)
        return ret
    },

    get: function(k){
        k = k.toString()
        return p.get(this['-data'](secret), k)
    },

    has: function(k){
        return p.has(this['-data'](secret), k)
    },

    transient: function(){
        return p.mutable(this['-data'](secret))
    }
}

