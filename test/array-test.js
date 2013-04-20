var a = require('assert')
var im = require('..')

describe('im.array', function(){

	it('freezes arrays on creation if available', function(){
		if ( !Object.freeze ) return

		var arr = im.array()

		arr.x = 3
		a.equal(a.x, undefined)
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
	})

	describe('length', function(){
		it('should get updated to be the largest int + 1', function(){
			var arr1 = im.array([1, 2, 3])
			a.equal(arr1.length, 3)

			var arr2 = arr1.push(1)
			a.equal(arr2.length, 4)

			var arr3 = arr1.concat([1, 2])
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
	})


	describe('ES3 equvialent methods', function(){
		describe('.toJSON', function(){
			it('should be an alias for .mutable', function(){
				var arr = im.array()
				a.equal(arr.mutable, arr.toJSON)
			})
		})

		describe('.join', function(){
			it('should join together values with a default seperator (i.e. none)', function(){
				a.equal(im.array([1, 2, 3]).join(), [1, 2, 3].join())
			})

			it('should take a separator an argument', function(){
				a.equal(im.array([1, 2, 3]).join(' '), [1, 2, 3].join(' '))
			})
		})

		describe('.slice', function(){
			var arr = [1, 2, 3]
			var imArr = im.array(arr)

			it('should return the same as native, once mutable is called', function(){
				a.deepEqual(arr.slice(), imArr.slice().mutable())
				a.deepEqual(arr.slice(1), imArr.slice(1).mutable())
				a.deepEqual(arr.slice(1, 2), imArr.slice(1, 2).mutable())
			})
		})

		describe('.sort', function(){
			var arr = [3, 2, 1]
			var imArr = im.array(arr)
			var reverseComparator = function(a, b){ return a < b }

			it('should return the same as native, once mutable is called', function(){
				a.deepEqual(arr.slice().sort(), imArr.sort().mutable())
				a.deepEqual(arr.slice().sort(reverseComparator), imArr.sort(reverseComparator).mutable())
			})
		})

		describe('.reverse', function(){
			var arr = [1, 2, 3]
			var imArr = im.array(arr)

			it('should return the same as native, once mutable is called', function(){
				a.deepEqual(arr.slice().reverse(), imArr.reverse().mutable())
			})
		})

		describe('.splice', function(){
			var arr = [1, 2, 3]
			var imArr = im.array(arr)

			it('should return the same as native, once mutable is called', function(){
				a.deepEqual(arr.slice().splice(), imArr.splice().mutable())
				a.deepEqual(arr.slice().splice(1), imArr.splice(1).mutable())
				a.deepEqual(arr.slice().splice(1, 2), imArr.splice(1, 2).mutable())
			})

		})

		describe('.push', function(){
			it('should return a new immutable array with properties appended', function(){
				var arr = im.array([1, 2, 3])

				arr.push(4, 5, 6)
				a.deepEqual(arr.mutable(), [1, 2, 3])

				arr = arr.push(4, 5, 6)
				a.deepEqual(arr.mutable(), [1, 2, 3, 4, 5, 6])
			})

		})

		describe('.pop', function(){
			it('should return a new immutable array with properties a property removed from the end', function(){
				var arr = im.array([1, 2, 3])

				arr.pop()
				a.deepEqual(arr.mutable(), [1, 2, 3])

				arr = arr.pop()
				a.deepEqual(arr.mutable(), [1, 2])

				arr = im.array([])
				arr = arr.pop()

				a.deepEqual(arr.mutable(), [])
			})
		})

		describe('.unshift', function(){
			it('should return a new immutable array with properties unshifted onto the start', function(){

				var arr1 = im.array([1, 2, 3])
				var arr2 = arr1.unshift(4, 5, 6)

				a.deepEqual(arr1.mutable(), [1, 2, 3])
				a.deepEqual(arr2.mutable(), [4, 5, 6, 1, 2, 3])
			})
		})

		describe('.shift', function(){
			it('should return a new immutable array with properties shifted from the front', function(){
				var arr1 = im.array([1, 2, 3])
				var arr2 = arr1.shift()

				a.deepEqual(arr1.mutable(), [1, 2, 3])
				a.deepEqual(arr2.mutable(), [2, 3])
			})

			it('should return an empty immutable array for the empty case', function(){
				var arr1 = im.array([])
				var arr2 = arr1.shift()

				a.deepEqual(arr1.mutable(), [])
				a.deepEqual(arr2.mutable(), [])
			})

		})

		describe('.concat', function(){
			it('should concat regular arrays, returning a new immutable array with the aggregate value', function(){
				var arr1 = im.array([1, 2, 3])
				var arr2 = arr1.concat([4, 5, 6])

				a.deepEqual(arr1.mutable(), [1, 2, 3])
				a.deepEqual(arr2.mutable(), [1, 2, 3, 4, 5, 6])
			})

			it('should concat immutable arrays, returning a new immutable array with the aggregate value', function(){
				var arr1 = im.array([1, 2, 3])
				var arr2 = im.array([4, 5, 6])
				var arr3 = arr1.concat(arr2)

				a.deepEqual(arr1.mutable(), [1, 2, 3])
				a.deepEqual(arr2.mutable(), [4, 5, 6])
				a.deepEqual(arr3.mutable(), [1, 2, 3, 4, 5, 6])
			})
		})
		describe('.toString', function(){
			it('should return the same as array\'s', function(){
				a.equal([1, 2, 3].toString(), im.array([1, 2, 3]).toString())
			})
		})

		describe('.toLocaleString', function(){
			it('should return the same as array\'s', function(){
				a.equal([1, 2, 3].toLocaleString(), im.array([1, 2, 3]).toLocaleString())
			})
		})

		describe('.indexOf', function(){
			var arr = im.array([1, 2, 3, 1, 2, 3])

			it('should return -1 if not found', function(){
				a.equal(arr.indexOf(0), -1)
			})

			it('should return first index otherwise', function(){
				a.equal(arr.indexOf(1), 0)
				a.equal(arr.indexOf(2), 1)
				a.equal(arr.indexOf(3), 2)
			})
		})

		describe('.lastIndexOf', function(){
			var arr = im.array([1, 2, 3, 1, 2, 3])

			it('should return -1 if not found', function(){
				a.equal(arr.lastIndexOf(0), -1)
			})

			it('should return last index otherwise', function(){
				a.equal(arr.lastIndexOf(1), 3)
				a.equal(arr.lastIndexOf(2), 4)
				a.equal(arr.lastIndexOf(3), 5)
			})
		})
	})



	describe('ES5 equivalent methods', function(){

		// IF es5 is not available, these methods are unsupported
		describe('.filter', function(){

			if ( !Array.prototype.filter ) return

			it('should return a new immutable array, filtered for elements', function(){
				var isOdd = function(n){ return n % 2 !== 0 }
				var arr1 = im.array([1, 2, 3])
				var arr2 = arr1.filter(isOdd)

				a.deepEqual(arr1.mutable(), [1, 2, 3])
				a.deepEqual(arr2.mutable(), [1, 3])
			})
		})

		describe('.every', function(){

			if ( !Array.prototype.every ) return

			it('should return a boolean indicating if every member of an array satisfies a predicate', function(){

				var isOdd = function(n){ return n % 2 !== 0 }
				var arr1 = im.array([1, 2, 3])
				var arr2 = im.array([1, 3, 5])

				a.equal(arr1.every(isOdd), false)
				a.equal(arr2.every(isOdd), true)
			})
		})

		describe('.reduce', function(){
			if ( !Array.prototype.reduce ) return

			var arr = im.array(['a', 'b', 'c'])
			var cat = function(a, b){ return a + b }


			it('should accumulate results, and return them', function(){
				a.equal(arr.reduce(cat), 'abc')
			})

			it('should accumlate results from a seed', function(){
				a.equal(arr.reduce(cat, 'def'), 'defabc')
			})

			it('should return an array if reducing over an array', function(){
				var id = function(a){ return a }
				a.deepEqual(arr.reduce(id, []), [])
			})
		})

		describe('.reduceRight', function(){
			if ( !Array.prototype.reduceRight ) return

			var arr = im.array(['a', 'b', 'c'])
			var cat = function(a, b){ return a + b }

			it('should accumulate results in the opposite direction to .reduce, and return them', function(){
				a.equal(arr.reduceRight(cat), 'cba')
			})

			it('should accumulate results in the opposite direction to .reduce with a seed, and return them', function(){
				a.equal(arr.reduceRight(cat, 'def'), 'defcba')
			})

			it('should return an array if reducing over an array', function(){
				var id = function(a){ return a }
				a.deepEqual(arr.reduceRight(id, []), [])
			})

		})

	})
})
