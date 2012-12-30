**Warning: API Unstable (even more so than most < 1.0.0 releases)**

# Persistent

Persistent data-structures from the comfort of JavaScript - a lá clojure.

## Why?

Mutability causes headaches; immutability soothes them.  JavaScript's Object and Array are crying out for immutable counterparts to complement first-class functions.

## Example

```javascript
var p = require('persistent'),
    person = p.dict({ firstName: 'hugh', secondName: 'jackson' })
    
var personWithAge = person.set({ age: 24 })

person.has('age')          //= false
personWithAge.has('age')   //= true
personWithAge.get('age')   //= 24
```

## Install

`npm install persistent` 

## persistent.dict([Object]) -> dict

Creates an empty dict, or sets the attributes if an object is passed.

```javascript
var o = p.dict()

// or
var you = p.dict({ wise: true, willUseThisLib: true })
```

### .set(String, Value) OR .set(Object) -> dict

Returns a new dict with the additional attribute(s).

```javascript
var o = p.dict()

var changed = o.set('x', 3).set({ y: 4, z: 5 })

changed.has('x') //= true
changed.get('y') //= 4
```

### .get(String) -> value

Gets an attribute.

```javascript
var o = p.dict({ x: 3, y: 4 })

o.get('x') //= 3
```

### .has(String) -> Boolean

Returns true or false; same as `key in object` for regular objects:

```javascript
var o = p.dict({ x: 3, y: 4 })

o.has('x') //= true
o.has('z') //= false
```

### .remove(String) `alias: .delete(String)` -> dict

Returns a new `dict` with the key removed.

```javascript
var o = p.dict({
    foo: 'bar',
    baz: 'quux'
})

var updated = o.remove('foo').remove('baz')
updated.has('foo') //= false
o.has('foo')       //= true
```

### .transient() -> dict

Returns a seperate, mutable object with the same attrs.

```javascript
var o = p.dict({
    foo: 'bar',
    baz: 'quux'
})

var trans = o.transient()
delete trans.foo

o.has('foo') //= true
```

## persistent.array(Array) -> array

Shares the same API as `persistent.dict`, except:

### persistent.transient() -> array

Returns a seperate, mutable array with the same attrs.

```javascript
var arr1 = p.array([1, 2, 3]),
    arr2 = arr1.transient()
    
arr2.splice(1)

arr1[1] !== arr2[1] //= true
```

### Native Methods

The following native methods return a new instance of p.array:
                    
* map
* sort
* filter
* splice
* slice
* reverse
* concat

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

The following silently fail, since they're normally mutating:

* pop
* push
* shift
* unshift
