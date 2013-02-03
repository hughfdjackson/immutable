var u = require('./util'),
    base = require('./base')

// persistent.dict
var dict = function(attrs){
    var o = Object.create(dict.prototype)
    o['-data'] = Object.freeze(u.clone(attrs || {}))
    Object.freeze(o)
    return o
}

dict.prototype = u.merge(base, {
    constructor: dict,
    transient: function(){ return u.extend({}, this['-data']) }
})

module.exports = dict
