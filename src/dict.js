var u = require('./util')

var dict = u.ctor({
    constructor: function(attrs){
        this['-data'] = Object.freeze(u.clone(attrs || {}))
        Object.freeze(this)
        return this
    },
    set: function(k, v){
        var attrs = this.transient()
        if ( v ) attrs[k] = v
        else     u.extend(attrs, k)
        return this.constructor(attrs)
    },
    get: function(k){ return this['-data'][k]  },
    has: function(k){ return k in this['-data'] },
    remove: function(k){
        var t = this.transient()
        delete t[k]
        return this.constructor(t)
    },
    transient: function(){ return u.extend({}, this['-data']) }
})

dict.prototype['delete'] = dict.prototype.remove

module.exports = dict
