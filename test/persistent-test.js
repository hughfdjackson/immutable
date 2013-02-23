var a = require('assert'),
    p = require('..')

suite('persist')

test('exports API', function(){
    a.equal(p.object, require('../src/object'))
    a.equal(p.array, require('../src/array'))
})
