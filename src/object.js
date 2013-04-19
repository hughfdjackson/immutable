'use strict'

var p = require('persistent-hash-trie')

// exported constructor
// -- accepts attrs, and auto-assocs them on
// -- as sugar
module.exports = function(attrs){
    return (new object()).assoc(attrs)
}

// internal constructor
var object = function(trie){
    this._trie = trie || p.Trie()
    Object.freeze(this._trie)
    Object.freeze(this)
}


// helper assoc functions, to help support the variadicness of
// object.prototype.assoc
var assocMultiple = function(obj, attrs){
    for ( var p in attrs ) obj = obj.assoc(p, attrs[p])
    return obj
}

var assocOne = function(obj, key, value){
    return new object(p.assoc(obj._trie, key.toString(), value))
}

// prototype to both constructors
// -- so that `immutable.object() instanceof immutable.object` is true,
// -- and extending the prototype works as expected
module.exports.prototype = object.prototype = {

    // futher cementing the lie that the prototype 'belongs' to the exported
    // constructor
    constructor: module.exports,


    // assoc returns a new object with values associated across.
    // supports either an object, or a key and a value
    assoc: function(arg1, arg2){
        if ( arguments.length === 1 ) return assocMultiple(this, arg1)
        else                          return assocOne(this, arg1, arg2)
    },

    dissoc: function(key){
        return new object(p.dissoc(this._trie, key.toString()))
    },

    get: function(key){
        return p.get(this._trie, key.toString())
    },

    has: function(key){
        return p.has(this._trie, key.toString())
    },

    mutable: function(){
        return p.mutable(this._trie)
    }
}
