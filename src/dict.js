var u = require('./util'),
    h = require('./hamt')

var secret = {}

var dict = u.ctor({

    constructor: function(attrs){
        var store = h.Trie({})

        this['-data'] = function(s, data){
            if ( s === secret && data ) return store = data
            else                        return store
        }

        Object.freeze(this)
        return this
    },
    set: function(k, v){
        var t = h.set(this['-data'](secret), h.path(k), k, v)
        var ret = this.constructor()
        ret['-data'](secret, t)
        return ret
    },
    get: function(k){
        return h.get(this['-data'](secret), h.path(k), k)
    },
    transient: function(){

    },
    has: function(k){
        return h.has(this['-data'](secret), h.path(k), k)
    },

    remove: function(k){
        var t = h.remove(this['-data'](secret), h.path(k), k)
        var ret = this.constructor()
        ret['-data'](secret, t)
        return ret
    }

})

dict.prototype['delete'] = dict.prototype.remove

module.exports = dict
