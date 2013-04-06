'use strict'

var u    = require('./util')
var object = require('./object')

var p = require('persistent-hash-trie')

var secret = {}

var array = function(attrs){
    if ( !(this instanceof array) ) return new array(attrs)

    var store = p.Trie({})

    this['-data'] = function(s, data){
        if ( s === secret && data ) return store = data
        else                        return store
    }
    return attrs ? this.assoc(attrs) : this
}

array.prototype = {

    constructor: array,

    // stealing from object


    assoc: function(k, v){
        if ( typeof k === 'object' && typeof k !== null ) {
            var keys = Object.keys(k)
            return keys.reduce(function(object, key){ return object.assoc(key, k[key]) }, this)
        }
        var t = p.assoc(this['-data'](secret), k, v)
        var ret = new array()
        ret['-data'](secret, t)

        ret.length = this.length > k ? this.length  : parseInt(k, 10) + 1
        Object.freeze(this)
        return ret
    },

    dissoc: object.prototype.dissoc,

    get: object.prototype.get,
    has: object.prototype.has,

    mutable: function(){
        return u.extend([], p.mutable(this['-data'](secret)))
    },
    push: function(){
        var args = u.slice(arguments)
        return this.concat(args)
    },
    pop: function(){
        return this.slice(0, -1)
    },
    unshift: function(){
        return new array(u.slice(arguments)).concat(this.mutable())
    },
    shift: function(){
        return this.slice(1, this.length)
    },
    concat: function(a){
        if ( a instanceof array ) return this.concat(a.mutable())
        else                     return new array(this.mutable().concat(a))
    }
}

var retPrim = u.pick(Array.prototype, 'toString', 'toLocaleString', 'indexOf', 'lastIndexOf', 'some', 'every')
var retArr  = u.pick(Array.prototype, 'join', 'reverse', 'slice', 'splice', 'sort', 'filter', 'forEach', 'map')
var retAny  = u.pick(Array.prototype, 'reduce', 'reduceRight')

var wrapPrim = function(fn){
    return function(){
        var t = this.mutable()
        return fn.apply(t, arguments)
    }
}
var wrapArr = function(fn){
    return function(){
        var t = this.mutable()
        return new array(fn.apply(t, arguments))
    }
}

u.extend(array.prototype, u.mapObj(retPrim, wrapPrim))
u.extend(array.prototype, u.mapObj(retAny, wrapPrim))
u.extend(array.prototype, u.mapObj(retArr, wrapArr))

module.exports = array
