var a = require('assert')
var im = require('..')

describe('im.array', function(){

	it('freezes arrays on creation if available', function(){
		if ( !Object.freeze ) return

		var arr = im.array()

		arr.x = 3
		a.equal(a.x, undefined)
	})

    describe('.immutable', function(){
        it('should be set to true', function(){
            a.equal(im.array().immutable, true)
        })
    })

	describe('.assoc', function(){

		it('should allow a new version to be made with added properties', function(){

			var arr1 = im.array()
				.assoc(1, 'first')
				.assoc({ x: 'x val' })

			var arr2 = arr1.assoc(['a', 'b', 'c'])

			a.equal(arr1.get(1), 'first')
			a.equal(arr1.get('x'), 'x val')
			a.equal(arr1.length, 2)

			a.equal(arr2.get(1), 'b')
		})

		it('should return an im.array', function(){
			a.ok(im.array() instanceof im.array)
		})

		it('shouldn\'t copy over properties on the prototype', function(){
			var F = function(){}
			F.prototype.foo = 'my-val'

			var arr = im.array([1, 2, 3]).assoc(new F())
			a.equal(arr.get('foo'), undefined)
		})
	})

	describe('length', function(){
		it('should get updated to be the largest int + 1', function(){
			var arr1 = im.array([1, 2, 3])
			a.equal(arr1.length, 3)

			var arr2 = arr1.assoc(3, 1)
			a.equal(arr2.length, 4)

			var arr3 = arr1.assoc(4, 1)
			a.equal(arr3.length, 5)

			var arr4 = arr1.assoc(100, 3)
			a.equal(arr4.length, 101)
		})
	})

	describe('.mutable', function(){
		it('should return an array with all properties copied', function(){
			var arr = im.array({ x: 3, 0: 1, 2: 3 }).mutable()

			a.equal(arr[0], 1)
			a.equal(arr[2], 3)
			a.equal(arr.length, 3)

			a.equal(arr.x, 3)
			a.ok(arr instanceof Array)
		})

		it('should represent gaps with missing data', function(){
			var input = [1]
			input[2] = 2
			var arr = im.array(input)

			a.deepEqual(arr.mutable(), input)
		})
	})

	describe('.toJSON', function(){
		it('should be an alias for .mutable', function(){
			var arr = im.array()
			a.equal(arr.mutable, arr.toJSON)
		})
	})

	describe('.map', function(){
        it('should create an immutable object with updated values', function(){
            var inc = function(a){ return a + 1 }
            var arr = im.array([1, 2, 3])

            a.deepEqual(arr.map(inc).mutable(), [2, 3, 4])
        })

        it('should pass val, key, array', function(){
            var details = function(val, key, array){ return { val: val, key: key, array: array } }
            var arr = im.array([1, 2, 3])

            a.deepEqual(arr.map(details).mutable(), [
                { val: 1, key: '0', array: arr },
                { val: 2, key: '1', array: arr },
                { val: 3, key: '2', array: arr }
            ])
        })
    })

    describe('forEach', function(){
        it('should pass val, key, array, but return nothing', function(){
            var results = []
            var details = function(val, key, array){
                results.push({ val: val, key: key, array: array })
            }
            var arr = im.array([1, 2, 3])

            var ret = arr.forEach(details)

            a.equal(ret, undefined)
            a.deepEqual(results, [
                { val: 1, key: '0', array: arr },
                { val: 2, key: '1', array: arr },
                { val: 3, key: '2', array: arr }
            ])
        })
    })


    describe('every', function(){
        var isOdd = function(n){ return n % 2 !== 0 }

        it('should return false if the predicate does once', function(){
            var arr = im.array([1, 2, 3])
            a.equal(arr.every(isOdd), false)
        })

        it('should return true if predicate always is satisfied', function(){
            var arr = im.array([1, 3, 5])
            a.equal(arr.every(isOdd), true)
        })

        it('should pass val, key, array', function(){
            var results = []
            var details = function(val, key, array){
                results.push({ val: val, key: key, array: array })
                return true
            }

            var arr = im.array([1, 3, 5])
            arr.every(details)

            a.deepEqual(results, [
                { val: 1, key: '0', array: arr },
                { val: 3, key: '1', array: arr },
                { val: 5, key: '2', array: arr }
            ])
        })
    })

    describe('some', function(){
        var isOdd = function(n){ return n % 2 !== 0 }

        it('should return true if the predicate does once', function(){
            var arr = im.array([1, 2, 3])
            a.equal(arr.some(isOdd), true)
        })

        it('should return false if predicate never is satisfied', function(){
            var arr = im.array([2, 4, 6])
            a.equal(arr.some(isOdd), false)
        })

        it('should pass val, key, array', function(){
            var results = []
            var details = function(val, key, array){
                results.push({ val: val, key: key, array: array })
                return false
            }

            var arr = im.array([2, 4, 6])
            arr.some(details)

            a.deepEqual(results, [
                { val: 2, key: '0', array: arr },
                { val: 4, key: '1', array: arr },
                { val: 6, key: '2', array: arr }
            ])
        })
    })


    describe('filter', function(){
        var isOdd = function(n){ return n % 2 !== 0 }

        it('should filter a collection', function(){
        	var arr = im.array([1, 2, 3])
            a.deepEqual(arr.filter(isOdd).mutable(), [1, 3])
        })

        it('should pass val, key, array', function(){
            var results = []
            var details = function(val, key, array){
                results.push({ val: val, key: key, array: array })
            }

            var arr = im.array([ 2, 4, 6 ])
            arr.filter(details)

            a.deepEqual(results, [
                { val: 2, key: '0', array: arr },
                { val: 4, key: '1', array: arr },
                { val: 6, key: '2', array: arr }
            ])
        })
    })
})
