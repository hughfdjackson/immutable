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
    get: function(k){ },
    transient: function(){ },
    has: function(k){
        return h.has(this['-data'](secret), h.path(k), k)
    },

    remove: function(k){
        var t = this.transient()
        delete t[k]
        return this.constructor(t)
    }

})

dict.prototype['delete'] = dict.prototype.remove

module.exports = dict
