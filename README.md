# @babel/plugin-proposal-let-decorators

> Compile let decorators to ES6

## Example

(examples are from proposal)

### Simple let decorator

```js
@annotation
let a = {};

function annotation(target) {
   target.annotated = true;
}
```

### Let decorator

```js
@logger(true)
let a = () => {};

function logger(flag) {
   return function(target) {
       if (flag) {
           return (...x) => (result => (console.log(result), result))(target(...x));
       } else {
           return target;
       }
   };
}
```

### Multi decorators

```js
@double
@inc
let a = 0;

function inc(value) {
  return value + 1;
}

function double(value) {
  return value * 2;
};
```

## Installation

```sh
npm install --save-dev @babel/plugin-proposal-let-decorators
```

## Usage

Add the following line to your .babelrc file:

```json
{
  "plugins": ["@babel/plugin-proposal-let-decorators"]
}
```

### Via CLI

```sh
babel --plugins @babel/plugin-proposal-let-decorators script.js
```

### Via Node API

```javascript
require("@babel/core").transform("code", {
  plugins: ["@babel/plugin-proposal-let-decorators"]
});
```

## References

* [Proposal: JavaScript Let Decorators](https://github.com/ukari/javascript-let-decorators/blob/master/README.md)
