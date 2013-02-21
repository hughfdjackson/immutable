var a = require('assert'),
    p = require('..')

suite('persist')

test('exports the right parts', function(){
    a.equal(p.dict, require('../src/dict'))
    a.equal(p.list, require('../src/list'))
})
