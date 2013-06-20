var a = require('assert')
var im = require('..')

describe('immutable', function(){
	it('should export API', function(){
		a.equal(im.object, require('../src/object'))
		a.equal(im.array, require('../src/array'))
        a.equal(im.isImmutableCollection, require('../src/predicate'))
	})
})
