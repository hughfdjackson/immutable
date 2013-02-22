var h = require('./hamt')

var secret = {}

var dict = module.exports = function(attrs){
    if ( !(this instanceof dict) ) return new dict(attrs)

    var store = h.Trie({})

    this['-data'] = function(s, data){
        if ( s === secret && data ) return store = data
        else                        return store
    }

    Object.freeze(this)
    return attrs ? this.set(attrs) : this
}

dict.prototype = {
    constructor: dict,

    set: function(k, v){
        if ( typeof k === 'object' && typeof k !== null ) {
            var keys = Object.keys(k)
            return keys.reduce(function(dict, key){ return dict.set(key, k[key]) }, this)
        }
        var t = h.set(this['-data'](secret), h.path(k), k, v)
        var ret = new dict()
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
        var ret = new dict()
        ret['-data'](secret, t)
        return ret
    }
}
dict.prototype['delete'] = dict.prototype.remove
