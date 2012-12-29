var p = {}

var extend = function(t, f) { for ( var p in f ) t[p] = f[p]; return t },
    clone  = function(o){ return extend({}, o) }

var dict = p.dict = function(attrs){
    var o = Object.create(dict.prototype)
    o['-data'] = Object.freeze(clone(attrs))
    return o
}

dict.prototype = {
    set: function(k, v){
        var attrs = clone(this['-data'])

        if ( v ) attrs[k] = v
        else     attrs = extend(attrs, k)

        return dict(attrs)
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
        return dict(attrs)
    },
    transient: function(){
        return clone(this['-data'])
    }
}
dict.prototype['delete'] = dict.prototype.remove



module.exports = p
