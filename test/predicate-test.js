var a = require('assert')
var isImmutable = require('../src/predicate')
var im = require('..')


describe('isImmutable', function(){
    it('should return true on immutable objects', function(){
        a.equal(isImmutable(im.object()), true)
        a.equal(isImmutable(im.array()), true)
    })

    it('should return false on data that has an immutable flag', function(){
        var fake = { immutable: true }
        a.equal(isImmutable(fake), false)
        a.equal(isImmutable(fake), false)
    })

    it('should require get, set, has, assoc and dissoc to be functions, along with an immutable flag', function(){
        var noop = function(){}
        var convincingFake = { immutable: true, get: noop, set: noop, assoc: noop, dissoc: noop, has: noop }

        a.equal(isImmutable(convincingFake), true)
    })

    it('should return false on all js primitives', function(){
        a.equal(isImmutable(null), false)
        a.equal(isImmutable(undefined), false)
        a.equal(isImmutable('foo'), false)
        a.equal(isImmutable(1), false)
        a.equal(isImmutable(true), false)
    })
})