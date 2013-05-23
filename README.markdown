# immutable

Effecient immutable data-structures in javascript.

## Why?

Mutability causes headaches; immutability soothes them.  JavaScript's Object and Array are crying out for immutable counterparts to complement first-class functions.

## Support

[![browser support](https://ci.testling.com/hughfdjackson/immutable.png)](http://ci.testling.com/hughfdjackson/immutable)

## Example

```javascript
var im = require('immutable')
var person = im.object({ firstName: 'hugh', secondName: 'jackson' })

var personWithAge = person.assoc({ age: 24 })

person.has('age')          //= false
personWithAge.has('age')   //= true
personWithAge.get('age')   //= 24
```

## Install

`npm install immutable`

## immutable.object

Create an empty immutable object:

```javascript
var emptyObject = im.object()
```

Or define the initial set of properties:
```javascript
var person = im.object({ name: 'joe bloggs', age: 34 })
```

### .assoc

Create a new immutable object with a property added or updated:

```javascript
var emptyObject = im.object()

var basicPerson = emptyObject.assoc('human', true)
```

Or pass an object to define multiple properties at once:
```javascript
var personRecord = basicPerson.assoc({ name: 'joe bloggs', age: 34 })
```

### .get

Get a property:

```javascript
var person = im.object({ name: 'joe bloggs', age: 34 })

person.get('age') //= 34
```

It works on numeric keys too, although you're more likely to use an array for this:

```javascript
var readingList = im.object({ 1: 'Operating System Design: The Xinu Approach' })

readingList.get(1) //= 'Operating System Design: The Xinu Approach'
```

### .has

Check if an immutable object has a property:

```javascript
var person = im.object({ name: 'joe bloggs', age: 34 })

person.has('name')        //= true
person.has('discography') //= false
```

### .dissoc

Create a new immutable object *without* a property:

```javascript
var person = im.object({ name: 'joe bloggs', age: 34 })

var personShyAboutAge = person.dissoc('age')

personShyAboutAge.get('age') //= undefined
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
	joe: im.object({ name: 'joe bloggs', age: 34 })
}

var data = JSON.stringify(favouritePeople)

data // = { joe: { name: 'joe bloggs', age: 34 } }
```
### .immutable

`.immutable` is a simple boolean flag, which is set to `true` on all immutable objects, for easy, consistent querying:

```javascript
im.object().immutable //= true
```

### .map

`.map` maps over all values in an object to create a new one.

```
var o = im.object({ x: 1, y: 2, z: 3 })
var inc = function(a){ return a + 1 }

o.map(inc).mutable() //= { x: 2, y: 3, z: 4 }
```

## immutable.array

Create a new immutable array:

```javascript
var arr = im.array()
```

or with initial values:

```javascript
var arr = im.array([1, 2, 3, 4])
```

### .assoc/.dissoc/.get/.has/.immutable

Work identically in imutable.array as they do in immutable.object, except that they keep the .length property of the array up to date.

### .length

Check the 'length' of an immutable array:

```javascript
var arr = im.array([1, 2, 3])
arr.length //= 3
```

### .mutable / .toJSON

Create a regular JavaScript object from an immutable one:

```javascript
var todo = im.array(['write README', 'run tests on all supported platform'])

todo.mutable() //= ['write README', 'run tests on all supported platform']
```

The `.toJSON` alias allows immutable objects to be serialised seamlessly with regular objects:

```javscript
var lists = {
	todo: im.array(['write README', 'run tests on all supported platform'])
}

var data = JSON.stringify(lists)

data // = { todo: ['write README', 'run tests on all supported platform'] }
```

### .map

`.map` maps over all values in an array, like JavaScript's native Array.prototype.map

```
var arr = im.array([1, 2, 3])
var inc = function(a){ return a + 1 }

arr.map(inc).mutable() //= [2, 3, 4]
```
