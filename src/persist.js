var p = {}

var extend = function(t, f) { for ( var p in f ) t[p] = f[p]; return t },
    clone  = function(o){ return extend({}, o) }

var map = p.map = function(attrs){
    var o = Object.create(map.prototype)
    o['-data'] = Object.freeze(clone(attrs))
    return o
}

map.prototype = {
    set: function(k, v){
        var attrs = clone(this['-data'])

        if ( v ) attrs[k] = v
        else     attrs = extend(attrs, k)

        return map(attrs)
    },
    get: function(key){
        return this['-data'][key]
    },
    has: function(key){
        return key in this['-data']
    },
    remove: function(key){
        var attrs = clone(this['-data'])
        delete attrs[key]
        return map(attrs)
    }
}

map.prototype['delete'] = map.prototype.remove

module.exports = p
