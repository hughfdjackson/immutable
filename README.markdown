# Persist

Persistant data-structures from the comfort of JavaScript - a lá clojure.

## Why?

Mutability causes headaches; immutability soothes them.  JavaScript's Object and Array are crying out for immutable counterparts to complement first-class functions.

## Example

```javascript
var p = require('persist'),
    person = p.map({ firstName: 'hugh', secondName: 'jackson' })
    
var personWithAge = person.set({ age: 24 })

person.has('age')          //= false
personWithAge.has('age')   //= true
personWithAge.get('age')   //= true
```

## Install

`npm install persist` 

## persist.map([Object]) -> map

Creates an empty map, or sets the attributes if an object is passed.

```javascript
var o = p.map()

// or
var you = p.map({ wise: true, willUseThisLib: true })
```

### .set(String, Value) OR .set(Object) -> map

Returns a new map with the additional attribute(s).

```javascript
var o = p.map()

var changed = o.set('x', 3).set({ y: 4, z: 5 })

changed.has('x') //= true
changed.get('y') //= 4
```

### .get(String) -> value

Gets an attribute.

``` 
var o = p.map({ x: 3, y: 4 })

o.get('x') //= 3
```

### .has(String) -> Boolean

Returns true or false; same as `key in object` for regular objects:

```
var o = p.map({ x: 3, y: 4 })

o.has('x') //= true
o.has('z') //= false
```

### .remove(String) `alias: .delete(String)` -> map

Returns a new `map` with the key removed.

```
var o = p.map({
    foo: 'bar',
    baz: 'quux'
})

var updated = o.remove('foo').remove('baz')
updated.has('foo') //= false
o.has('foo')       //= true
```
