'use strict';

var isImmutableCollection = require('./predicate')

// Internal
var extend   = function(t, f) { for ( var p in f ) t[p] = f[p]; return t }
var clone    = function(o){ return extend({}, o) }
var slice    = function(a, f, n){ return [].slice.call(a, f, n) }

var mapObj = function(o, fn){
    var r = {}
    for ( var p in o ) r[p] = fn(o[p], p, o)
    return r
}

var pick = function(o){
    var names = slice(arguments, 1)
    var r = {}

    for ( var i = 0; i < names.length; i += 1 )
        r[names[i]] = o[names[i]]

    return r
}

var freeze = Object.freeze || function(o){ return o }

var areEqual = function(v1, v2){
    if ( v1 && typeof v1.equal == 'function' && isImmutableCollection(v1) )
        return v1.equal(v2)
    else return v1 === v2
}

module.exports = {
    extend    : extend,
    clone     : clone,
    slice     : slice,
    mapObj    : mapObj,
    pick      : pick,
    freeze    : freeze,
    areEqual  : areEqual
}
