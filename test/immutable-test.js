var a = require('assert')
var im = require('..')

describe('immutable', function(){
	it('should export API', function(){
		a.equal(im.object, require('../src/object'))
		a.equal(im.array, require('../src/array'))
	})

    describe('isImmutable', function(){
        it('should return true on immutable objects', function(){
            a.equal(im.isImmutable(im.object()), true)
            a.equal(im.isImmutable(im.array()), true)
        })

        it('should return false on data that has an immutable flag', function(){
            var fake = { immutable: true }
            a.equal(im.isImmutable(im.object()), true)
            a.equal(im.isImmutable(im.array()), true)
        })

        it('should require get, set, has, assoc and dissoc to be functions, along with an immutable flag', function(){
            var noop = function(){}
            var convincingFake = { immutable: true, get: noop, set: noop, assoc: noop, dissoc: noop, has: noop }

            a.equal(im.isImmutable(convincingFake), true)
        })

        it('should return false on all js primitives', function(){
            a.equal(im.isImmutable(null), false)
            a.equal(im.isImmutable(undefined), false)
            a.equal(im.isImmutable('foo'), false)
            a.equal(im.isImmutable(1), false)
            a.equal(im.isImmutable(true), false)
        })
    })
})
