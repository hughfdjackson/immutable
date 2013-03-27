**Warning: API Unstable (even more so than most < 1.0.0 releases)**

# immutable

immutable neatly packages immutable equivalents to JavaScript's Objects and Arrays.

## Why?

Mutability causes headaches; immutability soothes them.  JavaScript's Object and Array are crying out for immutable counterparts to complement first-class functions.


## Support

Current support is limited to ECMAScript 5 compliant environments; although ECMAScript 3 compliance [is a goal of this project](https://github.com/hughfdjackson/immutable/issues/7).


[![browser support](http://ci.testling.com/hughfdjackson/immutable.png)](http://ci.testling.com/hughfdjackson/immutable)

## Example

```javascript
var i = require('immutable'),
    person = i.object({ firstName: 'hugh', secondName: 'jackson' })

var personWithAge = person.assoc({ age: 24 })

person.has('age')          //= false
personWithAge.has('age')   //= true
personWithAge.get('age')   //= 24
```

## Install

`npm install immutable`

## immutable.object([Object]) -> object

Creates an empty object, or assocs the attributes if an object is passed.

```javascript
var o = i.object()

// or
var you = i.object({ wise: true, willUseThisLib: true })
```

### .assoc(String, Value) OR .assoc(Object) -> object

Returns a new object with the additional attribute(s).

```javascript
var o = i.object()

var changed = o.assoc('x', 3).assoc({ y: 4, z: 5 })

changed.has('x') //= true
changed.get('y') //= 4
```

### .get(String) -> value

Gets an attribute.

```javascript
var o = i.object({ x: 3, y: 4 })

o.get('x') //= 3
```

### .has(String) -> Boolean

Returns true or false; same as `key in object` for regular objects:

```javascript
var o = i.object({ x: 3, y: 4 })

o.has('x') //= true
o.has('z') //= false
```

### .dissoc(String) -> object

Returns a new `object` with the key removed.

```javascript
var o = i.object({
    foo: 'bar',
    baz: 'quux'
})

var updated = o.dissoc('foo').dissoc('baz')
updated.has('foo') //= false
o.has('foo')       //= true
```

### .transient() -> Object

Returns a seperate, mutable object with the same attrs.

```javascript
var o = i.object({
    foo: 'bar',
    baz: 'quux'
})

var trans = o.transient()
delete trans.foo

o.has('foo') //= true
```

## immutable.array(Array) -> array

Shares the same API as `immutable.object`, except:

### .transient() -> Array

Returns a seperate, mutable array with the same attrs.

```javascript
var arr1 = i.array([1, 2, 3]),
    arr2 = arr1.transient()

arr2.splice(1)

arr1[1] !== arr2[1] //= true
```

### Native Methods

The following native methods return a new instance of i.array:

* map
* sort
* filter
* splice
* slice
* reverse
* concat
* pop
* push
* shift
* unshift

The following native methods work as expected for a regular array:

* toString
* toLocaleString
* join
* forEach
* indexOf
* lastIndexOf
* every
* some
* reduce
* reduceRight

## Resources

Based on [Bagwell (2001)](http://lampwww.epfl.ch/papers/idealhashtrees.pdf), and [Clojure's immutable implementation of a Hash Array Mapped Trie](https://github.com/clojure/clojure/blob/master/src/jvm/clojure/lang/PersistentHashMap.java).
