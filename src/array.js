'use strict'

var u    = require('./util')
var object = require('./object')

var p = require('persistent-hash-trie')

// exported constructor
// -- accepts attrs, and auto-assocs them on
// -- as sugar
module.exports = function(attrs){
    return (new array()).assoc(attrs)
}

// internal constructor
var array = function(trie, length){
    this._trie = trie || p.Trie()
    this.length = length || 0
    Object.freeze(this._trie)
    Object.freeze(this)
}

// helper assoc functions, to help support the variadicness of
// object.prototype.assoc
var assocMultiple = function(arr, attrs){
    for ( var p in attrs ) arr = arr.assoc(p, attrs[p])
    return arr
}

var assocOne = function(arr, key, value){
    var keyAsLength = parseInt(key, 10) + 1
    var length = Math.max(arr.length, keyAsLength || 0)

    var trie = p.assoc(arr._trie, key.toString(), value)
    return new array(trie, length)
}


// prototype to both constructors
// -- so that `immutable.array() instanceof immutable.array` is true,
// -- and extending the prototype works as expected
module.exports.prototype = array.prototype = {

    // futher cementing the lie that the prototype 'belongs' to the exported
    // constructor
    constructor: module.exports,

    assoc: function(arg1, arg2){
        if ( arguments.length === 1 ) return assocMultiple(this, arg1)
        else                          return assocOne(this, arg1, arg2)
    },

    dissoc: function(key){
        var trie = p.dissoc(this._trie, key.toString())
        return new array(trie, this.length)
    },

    get: function(key){
        return p.get(this._trie, key.toString())
    },

    has: function(key){
        return p.has(this._trie, key.toString())
    },

    mutable: function(){
        return u.extend([], p.mutable(this._trie))
    },

    concat: function(a){
        a = (a instanceof array) ? a.mutable() : a
        var aggregate = this.mutable().concat(a)
        return new module.exports(aggregate)
    },

    push: function(){
        var args = u.slice(arguments)
        return this.concat(args)
    },

    pop: function(){
        return this.slice(0, -1)
    },

    unshift: function(){
        return new module.exports(u.slice(arguments)).concat(this.mutable())
    },

    shift: function(){
        return this.slice(1, this.length)
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
        return new module.exports(fn.apply(t, arguments))
    }
}

u.extend(array.prototype, u.mapObj(retPrim, wrapPrim))
u.extend(array.prototype, u.mapObj(retAny, wrapPrim))
u.extend(array.prototype, u.mapObj(retArr, wrapArr))
