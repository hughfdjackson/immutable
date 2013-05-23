var a = require('assert')
var im = require('..')

describe('im.object', function(){
    it('has the right constructor', function(){
        a.equal(im.object.prototype.constructor, im.object)
    })

    it('freezes object on creation if Object.freeze is available', function(){
        if ( ! Object.freeze ) return

        var o = im.object({ })

        o.x = 3
        a.equal(o.x, undefined)
    })


    describe('creation', function(){
        it('should be a newless constructor', function(){
            a.ok(im.object() instanceof im.object)
        })

        it('creates an empty object if no props are passed', function(){
            var o = im.object()
            a.deepEqual(o.mutable(), {})
        })

        it('creates an object with props passed in', function(){
            var props = { x: 'y', z: 'wibble' }
            var o = im.object(props)
            a.deepEqual(o.mutable(), props)
        })

        it('shouldn\'t copy over properties on the prototype', function(){
            var F = function(){}
            F.prototype.foo = 'my-val'

            var obj = im.object({ name: 'joe bloggs' }).assoc(new F())
            a.equal(obj.get('foo'), undefined)
        })
    })

    describe('.immutable', function(){
        it('should be set to true', function(){
            a.equal(im.object().immutable, true)
        })
    })


    describe('.assoc', function(){
        it('returns a new immutable object with props updated', function(){
            var obj1 = im.object()
            var obj2 = obj1.assoc('x', 3)
            var obj3 = obj1.assoc({ y: 'x' })

            a.deepEqual(obj1.mutable(), {})
            a.deepEqual(obj2.mutable(), { x: 3 })
            a.deepEqual(obj3.mutable(), { y: 'x' })
        })
    })

    describe('.dissoc', function(){
        it('returns a new immutable object with props removed', function(){

            var obj1 = im.object({ x: 1, y: 1 })
            var obj2 = obj1.dissoc('x')

            a.deepEqual(obj1.mutable(), { x: 1, y: 1 })
            a.deepEqual(obj2.mutable(), { y: 1 })
        })
    })

    describe('.get', function(){
        it('should return a value of a stored property, or else undefined', function(){
            var o = im.object({ x: 3 })
            a.equal(o.get('x'), 3)
            a.equal(o.get('y'), undefined)
        })
    })

    describe('.has', function(){
        it('should return true or false, indicating whether a property exists on the prop', function(){
            var o = im.object({ x: 3 })
            a.equal(o.has('x'), true)
            a.equal(o.has('y'), false)
        })
    })

    describe('.mutable', function(){
        it('should return a mutable version of the immutable object', function(){
            var obj1 = im.object({ foo: 'bar' })
            var obj2 = obj1.mutable()

            obj2.bar = 'baz'

            a.deepEqual(obj1.mutable(), { foo: 'bar' })
            a.deepEqual(obj2, { bar: 'baz', foo: 'bar' })
        })
    })

    describe('.toJSON', function(){
        it('should be an alias for mutable', function(){
            var obj = im.object()
            a.equal(obj.mutable, obj.toJSON)
        })
    })

    describe('.map', function(){
        it('should create an immutable object with updated values', function(){
            var inc = function(a){ return a + 1 }
            var obj = im.object({ x: 1, y: 2, z: 3 })

            a.deepEqual(obj.map(inc).mutable(), { x: 2, y: 3, z: 4 })
        })

        it('should pass val, key, object', function(){
            var details = function(val, key, object){ return { val: val, key: key, object: object } }
            var obj = im.object({ x: 1, y: 2, z: 3 })

            a.deepEqual(obj.map(details).mutable(), {
                x: { val: 1, key: 'x', object: obj },
                y: { val: 2, key: 'y', object: obj },
                z: { val: 3, key: 'z', object: obj }
            })
        })
    })

    describe('forEach', function(){
        it('should pass val, key, object, but return nothing', function(){
            var results = {}
            var details = function(val, key, object){
                results[key] = { val: val, key: key, object: object }
            }
            var obj = im.object({ x: 1, y: 2, z: 3 })

            var ret = obj.forEach(details)

            a.equal(ret, undefined)
            a.deepEqual(results, {
                x: { val: 1, key: 'x', object: obj },
                y: { val: 2, key: 'y', object: obj },
                z: { val: 3, key: 'z', object: obj }
            })
        })
    })

    describe('every', function(){
        var isOdd = function(n){ return n % 2 !== 0 }

        it('should return false if the predicate does once', function(){
            var obj = im.object({ x: 1, y: 2, z: 3 })
            a.equal(obj.every(isOdd), false)
        })

        it('should return true if predicate always is satisfied', function(){
            var obj = im.object({ x: 1, y: 3, z: 5 })
            a.equal(obj.every(isOdd), true)
        })

        it('should pass val, key, object', function(){
            var results = {}
            var details = function(val, key, object){
                results[key] = { val: val, key: key, object: object }
                return true
            }

            var obj = im.object({ x: 1, y: 3, z: 5 })
            obj.every(details)

            a.deepEqual(results, {
                x: { val: 1, key: 'x', object: obj },
                y: { val: 3, key: 'y', object: obj },
                z: { val: 5, key: 'z', object: obj }
            })
        })
    })
})
