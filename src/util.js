// Internal
var extend   = function(t, f) { for ( var p in f ) t[p] = f[p]; return t },
    merge    = function(t, f){ var r = clone(t); return extend(r, f) },
    clone    = function(o){ return extend({}, o) },
    isObject = function(o){ return typeof o === 'object' && o !== null },
    slice    = function(a, f, n){ return [].slice.call(a, f, n) },

    mapObj   = function(o, fn){
        var r = {}
        for ( var p in o ) r[p] = fn(o[p], p, o)
        return r
    },
    pick     = function(o){
        var names = slice(arguments, 1),
            r     = {}
        names.forEach(function(p){ r[p] = o[p] })
        return r
    },
    noop     = function(){}

module.exports = {
    extend: extend,
    merge: merge,
    clone: clone,
    isObject: isObject,
    slice: slice,
    mapObj: mapObj,
    pick: pick,
    noop: noop
}
