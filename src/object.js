'use strict';

var p = require('persistent-hash-trie')
var util = require('./util')

// exported constructor
// -- accepts attrs, and auto-assocs them on
// -- as sugar
module.exports = function(attrs){
    return (new object()).assoc(attrs)
}


// helper assoc functions, to help support the variadicness of
// object.prototype.assoc
var assocMultiple = function(obj, attrs){
    for ( var p in attrs )
        if ( attrs.hasOwnProperty(p) )
            obj = obj.assoc(p, attrs[p])
    return obj
}

var assocOne = function(trie, key, value){
    return new object(p.assoc(trie, key.toString(), value))
}

// internal constructor
var object = function(trie){
    trie = trie || p.Trie()

    // assoc returns a new object with values associated across.
    // supports either an object, or a key and a value
    this.assoc = function(arg1, arg2){
        if ( arguments.length === 1 ) return assocMultiple(this, arg1)
        else                          return assocOne(trie, arg1, arg2)
    }

    this.dissoc = function(key){
        return new object(p.dissoc(trie, key.toString()))
    }

    this.get = function(key){
        return p.get(trie, key.toString())
    }

    this.has = function(key){
        return p.has(trie, key.toString())
    }

    this.mutable = this.toJSON = function(){
        return p.mutable(trie)
    }

    var separateSeed = function(o){
        var keyVal = p.reduce(trie, function(seed, val, key){
            return p.reduce.Break({ key: key, val: val })
        })

        return {
            seed: keyVal.val,
            rest: o.dissoc(keyVal.key)
        }
    }

    this.reduce = function(fn, seed){
        var orig = this

        if ( arguments.length === 1 ) {
            var seedAndRest = separateSeed(this)
            seed = seedAndRest.seed
            return seedAndRest.rest.reduce(fn, seed)
        }

        return p.reduce(trie, function(seed, val, key){
            return fn(seed, val, key, orig)
        }, seed)
    }

    this.immutable = true

    util.freeze(this)
}

// prototype to both constructors
// -- so that `immutable.object() instanceof immutable.object` is true,
// -- and extending the prototype works as expected
module.exports.prototype = object.prototype = {

    // futher cementing the lie that the prototype 'belongs' to the exported
    // constructor
    constructor: module.exports,

    // iteration methods
    map: function(fn){
        var orig = this
        return this.reduce(function(o, val, key){
            return o.assoc(key, fn(val, key, orig))
        }, orig)
    },

    forEach: function(fn){
        var orig = this
        return this.reduce(function(o, val, key){
            fn(val, key, orig)
        }, undefined)
    },

    every: function(predicate){
        var orig = this
        return this.reduce(function(o, val, key){
            if ( predicate(val, key, orig) === true ) return true
            else                                      return new p.reduce.Break(false)
        }, true)
    },

    some: function(predicate){
        var orig = this
        return this.reduce(function(o, val, key){
            if ( predicate(val, key, orig) === true ) return new p.reduce.Break(true)
            else                                      return false
        }, false)
    },

    filter: function(predicate){
        var orig = this
        return this.reduce(function(o, val, key){
            if ( predicate(val, key, orig) === true ) return o.assoc(key, val)
            else                                      return o
        }, new object())
    },

    // value equality!
    equal: function(val1){
        var val2 = this
        if ( val1 === val2 ) return true;
        if ( !val1 || !val1.immutable ) return false;

        var equal1 = val1.every(function(v, k){ return util.areEqual(v, val2.get(k)) })
        var equal2 = val2.every(function(v, k){ return util.areEqual(v, val1.get(k)) })

        return equal1 && equal2
    }
}
