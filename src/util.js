'use strict'

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
    var names = slice(arguments, 1),
        r     = {}
    names.forEach(function(p){ r[p] = o[p] })
    return r
}

module.exports = {
    extend    : extend,
    clone     : clone,
    slice     : slice,
    mapObj    : mapObj,
    pick      : pick
}
