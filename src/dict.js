var u = require('./util')

// persistent.dict
var dict = function(attrs){
    var o = Object.create(dict.prototype)
    o['-data'] = Object.freeze(u.clone(attrs || {}))
    Object.freeze(o)
    return o
}

dict.prototype = {
    constructor: dict,
    transient: function(){ return u.extend({}, this['-data']) },
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
    }
}
dict.prototype['delete'] = dict.prototype.remove

module.exports = dict
