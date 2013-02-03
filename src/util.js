// Internal
var extend   = function(t, f) { for ( var p in f ) t[p] = f[p]; return t }
var merge    = function(t, f){ var r = clone(t); return extend(r, f) }
var clone    = function(o){ return extend({}, o) }
var isObject = function(o){ return typeof o === 'object' && o !== null }
var slice    = function(a, f, n){ return [].slice.call(a, f, n) }

var mapObj = function(o, fn){
    var r = {}
    for ( var p in o ) r[p] = fn(o[p], p, o)
    return r
}

var reduceObj = function(o, fn, seed){
    for ( var p in o ) seed = fn(seed, o[p], o)
    return seed
}

var pick = function(o){
    var names = slice(arguments, 1),
        r     = {}
    names.forEach(function(p){ r[p] = o[p] })
    return r
}

var noop = function(){}

var ctor = function(p){
    var init = p.constructor
    var C = function(){
        var o = Object.create(p)
        return init ? init.apply(o, arguments) : o
    }
    C.prototype = p
    p.constructor = C
    return C
}


module.exports = {
    extend    : extend,
    merge     : merge,
    clone     : clone,
    isObject  : isObject,
    slice     : slice,
    mapObj    : mapObj,
    reduceobj : reduceObj,
    pick      : pick,
    noop      : noop,
    ctor      : ctor
}
