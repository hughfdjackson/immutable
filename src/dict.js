var u    = require('./util'),
    hash = require('string-hash')

var dict = u.ctor({
    constructor: function(attrs){
        this['-data'] = Object.freeze({})
        Object.freeze(this)
        return this
    },
    set: function(k, v){
        var d = u.clone(this['-data'])
        var h = hash(k)
        var ret = this.constructor()
        ret['-data'] = Object.freeze(d)
        return ret
    },
    get: function(k){ },
    transient: function(){ },
    has: function(k){ },

    remove: function(k){
        var t = this.transient()
        delete t[k]
        return this.constructor(t)
    }

})

dict.prototype['delete'] = dict.prototype.remove

module.exports = dict
