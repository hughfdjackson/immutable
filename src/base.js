var u = require('./util')

// basic abstraction
var base = {
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
base['delete'] = base.remove

module.exports = base
