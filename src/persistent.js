var p = {}


// utils
var extend   = function(t, f) { for ( var p in f ) t[p] = f[p]; return t },
    clone    = function(o){ return extend({}, o) },
    isObject = function(o){ return typeof o === 'object' && o !== null }

var wrapMethodBasic = function(method){
    return function(){
        var t = this.transient()
        return method.apply(t, arguments)
    }
}

var wrapMethod = function(method, type) {
    return function(){
        var t = this.transient()
        var r = method.apply(t, arguments)
        if ( isObject(r) ) return type(r)
        else               return r
    }
}


// persistent.dict
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


// persistent.array
var array = p.array = function(attrs){
    var o = Object.create(array.prototype)
    o['-data'] = Object.freeze(clone(attrs))
    return o
}

array.prototype = extend(clone(dict.prototype), {
    transient: function(){
        return extend([], this['-data'])
    }
})

// wrap native array methods to work with persistent version or return a non-obj
var arrayMethods = ["toString", "toLocaleString", "join", "pop", 
                    "push", "concat", "reverse", "shift", "unshift", 
                    "slice", "splice", "sort", "filter", "forEach", 
                    "some", "every", "map", "indexOf", "lastIndexOf"]


arrayMethods.reduce(function(proto, name){ 
    proto[name] = wrapMethod(Array.prototype[name], array)
    return proto
}, array.prototype)

// don't wrap the output, even if it's an object
var delicateArrayMethods = ["reduce", "reduceRight"]

delicateArrayMethods.reduce(function(proto, name){
    proto[name] = wrapMethodBasic(Array.prototype[name], array)
    return proto
}, array.prototype)

// export
module.exports = p
