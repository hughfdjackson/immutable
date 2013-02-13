var u    = require('./util')
var h    = require('./hamt')
var dict = require('./dict')

var secret = {}

var list = u.ctor(u.merge(dict.prototype, {
    constructor: function(attrs){
        var store = h.Trie({})

        this['-data'] = function(s, data){
            if ( s === secret && data ) return store = data
            else                        return store
        }
        return attrs ? this.set(attrs) : this
    },

    set: function(k, v){
        if ( typeof k === 'object' && typeof k !== null ) {
            var keys = Object.keys(k)
            return keys.reduce(function(dict, key){ return dict.set(key, k[key]) }, this)
        }
        var t = h.set(this['-data'](secret), h.path(k), k, v)
        var ret = this.constructor()
        ret['-data'](secret, t)

        ret.length = this.length > k ? this.length  : parseInt(k, 10) + 1
        Object.freeze(this)
        return ret
    },

    transient: function(){
        return u.extend([], h.transient(this['-data'](secret)))
    },
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
}))

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
