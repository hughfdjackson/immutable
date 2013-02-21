'use strict'

// Internal
var extend   = function(t, f) { for ( var p in f ) t[p] = f[p]; return t },
    merge    = function(t, f){ var r = clone(t); return extend(r, f) },
    clone    = function(o){ return extend({}, o) },
    isObject = function(o){ return typeof o === 'object' && o !== null },
    slice    = function(a, f, n){ return [].slice.call(a, f, n) },

    mapObj   = function(o, fn){
        var r = {}
        for ( var p in o ) r[p] = fn(o[p], p, o)
        return r
    },
    pick     = function(o){ 
        var names = slice(arguments, 1),
            r     = {}
        names.forEach(function(p){ r[p] = o[p] })
        return r
    },
    noop     = function(){}


// basic abstraction
var base = {
    set: function(k, v){
        var attrs = this.transient()
        if ( v ) attrs[k] = v
        else     extend(attrs, k)
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

var p = {}

// Exported API

// persistent.dict
p.dict = function(attrs){
    var o = Object.create(p.dict.prototype)
    o['-data'] = Object.freeze(clone(attrs || {}))
    Object.freeze(o)
    return o
}

p.dict.prototype = merge(base, {
    constructor: p.dict,
    transient: function(){ return extend({}, this['-data']) }
})


// persistent.list
p.list = function(attrs){
    var o = Object.create(p.list.prototype)
    o['-data'] = Object.freeze(extend([], attrs))
    o.length   = o['-data'].length 
    Object.freeze(o)
    return o
}

p.list.prototype = merge(base, {
    constructor: p.list,
    transient: function(){ return extend([], this['-data']) },
    push: function(){
        var args = slice(arguments)
        return this.concat(args)
    },
    pop: function(){
        return this.slice(0, -1)
    },
    unshift: function(){
        return this.constructor(slice(arguments)).concat(this.transient())
    },
    shift: function(){
        return this.slice(1, this.length)
    },
    concat: function(a){
        if ( a instanceof this.constructor ) return this.concat(a.transient())
        else                                 return this.constructor(this.transient().concat(a))
    }
})

var retPrim = pick(Array.prototype, 'toString', 'toLocaleString', 'indexOf', 'lastIndexOf', 'some', 'every')
var retArr  = pick(Array.prototype, 'join', 'reverse', 'slice', 'splice', 'sort', 'filter', 'forEach', 'map')
var retAny  = pick(Array.prototype, 'reduce', 'reduceRight')

var wrapPrim = function(fn){
    return function(){
        var t = this.transient()
        return fn.apply(t, arguments)
    }
}
var wrapArr = function(fn){
    return function(){
        var t = this.transient()
        return this.constructor(fn.apply(t, arguments))
    }
}

extend(p.list.prototype, mapObj(retPrim, wrapPrim))
extend(p.list.prototype, mapObj(retAny, wrapPrim))
extend(p.list.prototype, mapObj(retArr, wrapArr))

// export
module.exports = p
