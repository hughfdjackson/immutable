'use strict'

var h = require('./ht')

var secret = {}

var object = module.exports = function(attrs){
    if ( !(this instanceof object) ) return new object(attrs)

    var store = h.Trie({})

    this['-data'] = function(s, data){
        if ( s === secret && data ) return store = data
        else                        return store
    }

    Object.freeze(this)
    return attrs ? this.set(attrs) : this
}

object.prototype = {
    constructor: object,

    set: function(k, v){
        if ( typeof k === 'object' && typeof k !== null ) {
            var keys = Object.keys(k)
            return keys.reduce(function(object, key){ return object.set(key, k[key]) }, this)
        }
        var t = h.set(this['-data'](secret), h.path(k), k, v)
        var ret = new object()
        ret['-data'](secret, t)
        return ret
    },

    get: function(k){
        k = k.toString()
        return h.get(this['-data'](secret), h.path(k), k)
    },

    transient: function(){
        return h.transient(this['-data'](secret))
    },

    has: function(k){
        return h.has(this['-data'](secret), h.path(k), k)
    },

    remove: function(k){
        var t = h.remove(this['-data'](secret), h.path(k), k)
        var ret = new object()
        ret['-data'](secret, t)
        return ret
    }
}
object.prototype['delete'] = object.prototype.remove
