// The interface all immutable objects implement
var interfaceFns = ['get', 'has', 'assoc', 'dissoc']

// Predicate that indicates whether an object is
var isImmutable = function(o){

    if ( typeof o !== 'object' || o === null ) return false

    for ( var i = 0, len = interfaceFns.length; i < len; i += 1 )
        if ( typeof o[interfaceFns[i]] !== 'function' ) return false

    if ( o.immutable !== true ) return false
    return true
}

module.exports = isImmutable