var u    = require('./util'),
    dict = require('./dict')

// persistent.list
var list = function(attrs){
    var o = Object.create(list.prototype)
    o['-data'] = Object.freeze(u.extend([], attrs))
    o.length   = o['-data'].length
    Object.freeze(o)
    return o
}

list.prototype = u.merge(dict.prototype, {
    constructor: list,
    transient: function(){ return u.extend([], this['-data']) },
    push: function(){
        var args = u.slice(arguments)
        return this.concat(args)
    },
    pop: function(){
        return this.slice(0, -1)
    },
    unshift: function(){
        return this.constructor(u.slice(arguments)).concat(this.transient())
    },
    shift: function(){
        return this.slice(1, this.length)
    },
    concat: function(a){
        if ( a instanceof this.constructor ) return this.concat(a.transient())
        else                                 return this.constructor(this.transient().concat(a))
    }
})

var retPrim = u.pick(Array.prototype, 'toString', 'toLocaleString', 'indexOf', 'lastIndexOf', 'some', 'every')
var retArr  = u.pick(Array.prototype, 'join', 'reverse', 'slice', 'splice', 'sort', 'filter', 'forEach', 'map')
var retAny  = u.pick(Array.prototype, 'reduce', 'reduceRight')

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

u.extend(list.prototype, u.mapObj(retPrim, wrapPrim))
u.extend(list.prototype, u.mapObj(retAny, wrapPrim))
u.extend(list.prototype, u.mapObj(retArr, wrapArr))

module.exports = list
