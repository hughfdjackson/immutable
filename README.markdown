# immutable

Effecient immutable collections in javascript.

[![browser support](https://ci.testling.com/hughfdjackson/immutable.png)](http://ci.testling.com/hughfdjackson/immutable)

## Why?

Using immutable objects can make code easier to reason about, by eliminating a class of difficult-to-find side-effects that can (and do) trip programmers up.

# Install

`npm install immutable`

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
var personWithSports = o.assoc('sport', 'golf')

var emptyArr = im.array()
var numbers = emptyArr.assoc([1, 2, 3, 4, 5])
var upTo6 = emptyArr.assoc(5, 6)
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
var upTo4 = numbers.dissoc(4)

numbers.has(4) //= false
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

var data = JSON.stringify(favouritePeople)

data // = '{ "joe": { "name": "joe bloggs", "age": 34, "sports": ["golf", "carting"] } }'
```

### .immutable

`.immutable` is a simple boolean flag, which is set to `true` on all immutable objects, for easy, consistent querying:

```javascript
im.object().immutable //= true
im.array().immutable  //= true
```


## Iteration

Immutable objects and arrays can be iterated over almost identically, except that:
* objects iterate over *all* keys, and return objects where appropriate;
* arrays iterate over *only numberic* keys, and return arrays where appropriate.

All iterator functions (unless mentioned) well pass the value, the key, and the original immutable object to their callback functions.

### .map

```javascript
var inc = function(a){ return a + 1 }

var coordinates = im.object({ x: 1, y: 1 })
coordinates.map(inc).mutable() // { x: 1, y: 1 }

var numbers = im.array([1, 2, 3, 4, 5])
numbers.map(inc).mutable() // [2, 3, 4, 5, 6]
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

var person = im.object({ name: 'joe bloggs', age: 34 })
person.every(isNum) //= false

var alphaNumber = im.array(['a', 1, 'b', 2, 'c', 3])
alphaNumber.every(isNum) //= false

```

### .some

```javascript
var isNum = function(a){ return typeof a === 'number' }

var person = im.object({ name: 'joe bloggs', age: 34 })
person.some(isNum) //= true

var alphaNumber = im.array(['a', 1, 'b', 2, 'c', 3])
alphaNumber.some(isNum) //= true

```

### .reduce

```javascript

```

### .reduceRight

*array only*

```javascript

```
