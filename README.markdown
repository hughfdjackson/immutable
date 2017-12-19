# NOTE
This project is no longer actively supported.  If anyone is interested in becoming the new maintainer, don't hesitate to contact me (hughfdjackson@googlemail.com).  

The go-to immutable library is https://github.com/facebook/immutable-js. 

# immutable


Effecient immutable collections in javascript.

[![browser support](https://ci.testling.com/hughfdjackson/immutable.png)](http://ci.testling.com/hughfdjackson/immutable)

## Why?

Using immutable objects can make code easier to reason about, allowing programmers to geniunely create sections of their programs that operate on a 'data-in/data-out' basis.

This style of code is easy to test, and use in a mix-and-match style.

# Install

### npm

```bash
npm install immutable
```

### browser

Download build/immutable.js, and include it as a script tag.

### AMD/require.js

Download build/immutable.js, and require it in:

```javascript
require(['libs/immutable'], function(immutable){
  // ... assuming immutable is in libs/immutable.js, now it's ready to use
})
```

# Usage

Immutable has two types of collection: objects and arrays.  Like regular JavaScript Objects and  Arrays, both act as key:value stores (using strings as the keys).

## Basic Manipulation

### creation

```javascript
var person = im.object({ name: 'joe bloggs', age: 34 })
var numbers = im.array([1, 2, 3, 4, 5])
```

### .assoc

```javascript
var emptyObj = im.object()
var person = emptyObj.assoc({ name: 'joe bloggs', age: 34 })
var personWithSports = person.assoc('sport', 'golf')

var emptyArr = im.array()
var numbers = emptyArr.assoc([1, 2, 3, 4, 5])
var upTo6 = numbers.assoc(5, 6)
```

### .get

```javascript
var person = im.object({ name: 'joe bloggs', age: 34 })
person.get('age') //= 34

var numbers = im.array([1, 2, 3, 4, 5])
numbers.get(0) //= 1
```

### .has

```javascript
var person = im.object({ name: 'joe bloggs', age: 34 })

person.has('name')        //= true
person.has('discography') //= false
```

### .dissoc

Create a collection like this one, but without a particular property:

```javascript
var person = im.object({ name: 'joe bloggs', age: 34 })
var personShyAboutAge = person.dissoc('age')

personShyAboutAge.has('age') //= false

var numbers = im.array([1, 2, 3, 4, 5])
var upTo4 = numbers.dissoc(4) // dissocs the 4th key

numbers.has(4) //= true
upTo4.has(4)   //= false
```

### .mutable / .toJSON

Create a regular JavaScript object from an immutable one:

```javascript
var person = im.object({ name: 'joe bloggs', age: 34 })
person.mutable() //= { name: 'joe bloggs', age: 34 }
```

The `.toJSON` alias allows immutable objects to be serialised seamlessly with regular objects:

```javscript
var favouritePeople = {
	joe: im.object({ name: 'joe bloggs', age: 34, sports: im.array(['golf', 'carting']) })
}

JSON.stringify(favouritePeople) // = '{ "joe": { "name": "joe bloggs", "age": 34, "sports": ["golf", "carting"] } }'
```

## Value Equality

Collections can be checked for equality:

```javascript
var person1 = im.object({ name: 'joe bloggs', age: 34 })
var person2 = im.object({ name: 'joe bloggs', age: 34 })
var person3 = im.object({ name: 'joe bloggs', age: 34, sport: 'golf' })

person1.equal(person2) //= true
person3.equal(person2) //= false
```

Collections are considered equal when:

* They are immutable
* They have all the same keys
* All values are:
** Mutable objects or primtive values that are strictly equal (===),
** Immutable objects that are .equal to one another

## Iteration methods

Immutable objects and arrays can be iterated over almost identically, except that:
* objects iterate over *all* keys, and return objects where appropriate;
* arrays iterate over *only numberic* keys, and return arrays where appropriate.

All iterator methods (unless mentioned) will pass the value, the key, and the original immutable object to their callback functions.

### .map

```javascript
var inc = function(a){ return a + 1 }

var coordinates = im.object({ x: 1, y: 1 })
coordinates.map(inc).mutable() //= { x: 2, y: 3 }

var numbers = im.array([1, 2, 3, 4, 5])
numbers.map(inc).mutable() //= [2, 3, 4, 5, 6]
```

### .forEach

```javascript
var log = console.log.bind(console)

var person = im.object({ name: 'joe bloggs', age: 34 })
person.map(log)
// *log output*
// 'joe bloggs' 'name' person
// 34           'age'  person
```

### .filter

```javascript
var isNum = function(a){ return typeof a === 'number' }

var person = im.object({ name: 'joe bloggs', age: 34 })
person.filter(isNum).mutable() //= { age: 34 }

var alphaNumber = im.array(['a', 1, 'b', 2, 'c', 3])
alphaNumber.filter(isNum).mutable() //= [1, 2, 3]
```

### .every

```javascript
var isNum = function(a){ return typeof a === 'number' }

im.object({ name: 'joe bloggs', age: 34 }).every(isNum) //= false
im.object({ x: 1, y: 2 }).every(isNum) //= true

im.array(['a', 1, 'b', 2, 'c', 3]).every(isNum) //= false
im.array([1, 2, 3]).every(isNum) //= true
```

### .some

```javascript
var isNum = function(a){ return typeof a === 'number' }

im.object({ name: 'joe bloggs', sport: 'golf' }).some(isNum) //= false
im.object({ name: 'joe bloggs', age: 34 }).some(isNum) //= true

im.array(['a', 'b', 'c']).some(isNum) //= false
im.array(['a', 1, 'b', 2, 'c', 3]).every(isNum) //= true
```

### .reduce

```javascript
var flip = function(coll, val, key){
	return coll.assoc(key, val)
}

var coords = im.object({ x: '1', y: '2', z: '3' })
var flippedCoords = coords.reduce(flip, im.object())
flippedCoords.mutable() //= { 1: 'x', 2: 'y', 3: 'z' }

var cat = function(a, b){ return a + b }
var letters = im.array(['a', 'b', 'c'])
letters.reduce(cat)  //= 'abc'
```

## Array Methods

Since arrays are *ordered* collections, they have some methods of their own, that only make sense in an ordered context:

### .reduceRight

```javascript
var cat = function(a, b){ return a + b }
var letters = im.array(['a', 'b', 'c'])
letters.reduceRight(cat)  //= 'cba'
```

### .push

```javascript
var numbersTo3 = im.array([1, 2, 3])
var numbersTo4 = numbersTo3.push(4)

numbersTo4.mutable() //= [1, 2, 3, 4]
```

### .indexOf

```javascript
var mixed = im.array([1, 2, 3, im.object({ x: 3 }), { x: 3 }])
mixed.indexOf('a')      //= -1 -- 'a' not in array
mixed.indexOf({ x: 3 }) //= -1 -- mutable objects are compared by reference
mixed.indexOf(im.object({ x: 3 })) //= 3 -- immutable objects are compared by value
mixed.indexOf(3) //= 2 -- primitives are compared by value
```

## Library Functions

## .isImmutableCollection

A predicate that returns true if the object is an immutable one, such as produced by this library.

```javascript
im.isImmutableCollection(im.array([1, 2, 3])) //= true
im.isImmutableCollection(Object.freeze({}))   //= false - you couldn't assoc/dissoc/get/set on it
```
