'use strict';

var p = require('persistent-hash-trie')
var util = require('./util')
var object = require('./object')

// exported constructor
// -- accepts attrs, and auto-assocs them on
// -- as sugar
module.exports = function(attrs){
    return (new array()).assoc(attrs)
}


// helper assoc functions, to help support the variadicness of
// array.prototype.assoc
var assocMultiple = function(arr, attrs){
    for ( var p in attrs )
        if ( attrs.hasOwnProperty(p) )
            arr = arr.assoc(p, attrs[p])
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


    this.immutable = true

    util.freeze(this)
}

var firstMember = function(a){
    for ( var i = 0, len = a.length; i < len; i += 1 ) if ( a.has(i) ) return i
}

var lastMember = function(a){
    for ( var i = a.length - 1; i  >= 0; i -= 1 ) if ( a.has(i) ) return i
}


// prototype to both constructors
// -- so that `immutable.array() instanceof immutable.array` is true,
// -- and extending the prototype works as expected
module.exports.prototype = array.prototype = {

    // futher cementing the lie that the prototype 'belongs' to the exported
    // constructor
    constructor: module.exports,

    map: function(fn){
        var result = this
        for ( var i = 0, len = this.length; i < len; i += 1 ) {
            if ( this.has(i) ) result = result.assoc(i, fn(this.get(i), i, this))
        }
        return result
    },

    // iteration methods
    forEach: function(fn){
        for ( var i = 0, len = this.length; i < len; i += 1 ) {
            if ( this.has(i) ) fn(this.get(i), i.toString(), this)
        }
    },

    every: function(predicate){
        for ( var i = 0, len = this.length; i < len; i += 1 ) {
            if ( this.has(i) ) {
                if ( predicate(this.get(i), i.toString(), this) !== true ) return false
            }
        }
        return true
    },

    some: function(predicate){
        for ( var i = 0, len = this.length; i < len; i += 1 ) {
            if ( this.has(i) ) {
                if ( predicate(this.get(i), i.toString(), this) === true ) return true
            }
        }
        return false
    },

    filter: function(predicate){
        var result = new array()
        for ( var i = 0, len = this.length; i < len; i += 1 ) {
            if ( this.has(i) ) {
                if ( predicate(this.get(i), i.toString(), this) === true ) result = result.assoc(result.length, this.get(i))
            }
        }
        return result
    },

    reduce: function(fn, seed){
        if ( arguments.length === 1 ) {
            var member = firstMember(this)
            return this.dissoc(member).reduce(fn, this.get(member))
        }

        for ( var i = 0, len = this.length; i < len; i += 1 ) {
            if ( this.has(i) ) seed = fn(seed, this.get(i), i.toString(), this)
        }
        return seed
    },

    // array-specific methods
    reduceRight: function(fn, seed){
        if ( arguments.length === 1 ) {
            var member = lastMember(this)
            return this.dissoc(member).reduceRight(fn, this.get(member))
        }

        for ( var i = this.length - 1; i  >= 0; i -= 1 ) {
            if ( this.has(i) ) seed = fn(seed, this.get(i), i.toString(), this)
        }
        return seed
    },

    push: function(v){
        return this.assoc(this.length, v)
    },

    indexOf: function(v){
        for ( var i = 0, len = this.length; i < len; i += 1 ) {
            if ( this.has(i) && util.areEqual(v, this.get(i)) )  return i
        }
        return -1
    },

    equal: object.prototype.equal
}
