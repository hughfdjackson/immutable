'use strict'

var p = require('persistent-hash-trie')
var util = require('./util')

// exported constructor
// -- accepts attrs, and auto-assocs them on
// -- as sugar
module.exports = function(attrs){
    return (new array()).assoc(attrs)
}


// helper assoc functions, to help support the variadicness of
// array.prototype.assoc
var assocMultiple = function(arr, attrs){
    for ( var p in attrs ) arr = arr.assoc(p, attrs[p])
    return arr
}

var assocOne = function(arr, trie, key, value){
    var keyAsLength = parseInt(key, 10) + 1
    var length = Math.max(arr.length, keyAsLength || 0)

    var newTrie = p.assoc(trie, key.toString(), value)
    return new array(newTrie, length)
}


// internal constructor
var array = function(trie, length){
    trie = trie || p.Trie()

    this.length = length || 0

    this.assoc = function(arg1, arg2){
        if ( arguments.length === 1 ) return assocMultiple(this, arg1)
        else                          return assocOne(this, trie, arg1, arg2)
    }

    this.dissoc = function(key){
        var newTrie = p.dissoc(trie, key.toString())
        return new array(newTrie, this.length)
    }

    this.get = function(key){
        return p.get(trie, key.toString())
    }

    this.has = function(key){
        return p.has(trie, key.toString())
    }

    this.mutable = this.toJSON = function(){
        return util.extend([], p.mutable(trie))
    }

    util.freeze(this)
}



// prototype to both constructors
// -- so that `immutable.array() instanceof immutable.array` is true,
// -- and extending the prototype works as expected
module.exports.prototype = array.prototype = {

    // futher cementing the lie that the prototype 'belongs' to the exported
    // constructor
    constructor: module.exports,

    concat: function(a){
        a = (a instanceof array) ? a.mutable() : a
        var aggregate = this.mutable().concat(a)
        return new module.exports(aggregate)
    },

    push: function(){
        var args = util.slice(arguments)
        return this.concat(args)
    },

    pop: function(){
        return this.slice(0, -1)
    },

    unshift: function(){
        return new module.exports(util.slice(arguments)).concat(this.mutable())
    },

    shift: function(){
        return this.slice(1, this.length)
    }
}

var retPrim = util.pick(Array.prototype, 'toString', 'toLocaleString', 'indexOf', 'lastIndexOf', 'some', 'every', 'join')
var retArr  = util.pick(Array.prototype, 'reverse', 'slice', 'splice', 'sort', 'filter', 'forEach', 'map')
var retAny  = util.pick(Array.prototype, 'reduce', 'reduceRight')

var wrap = function(fn){
    return function(){
        var result = fn.apply(this.mutable(), arguments)
        if ( result instanceof Array ) return new module.exports(result)
        else                           return result
    }

}
var wrapPrim = function(fn){
    return function(){
        return fn.apply(this.mutable(), arguments)
    }
}


util.extend(array.prototype, util.mapObj(retPrim, wrapPrim))
util.extend(array.prototype, util.mapObj(retAny, wrap))
util.extend(array.prototype, util.mapObj(retArr, wrap))
