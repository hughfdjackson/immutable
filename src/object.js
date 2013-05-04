'use strict'

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

    this.immutable = true

    util.freeze(this)
}

// prototype to both constructors
// -- so that `immutable.object() instanceof immutable.object` is true,
// -- and extending the prototype works as expected
module.exports.prototype = object.prototype = {

    // futher cementing the lie that the prototype 'belongs' to the exported
    // constructor
    constructor: module.exports
}
