
# Higher-Order Functions in JavaScript

Higher-order functions are functions that either take other functions as arguments, return a function, or both.

---

## 1. map()
Creates a new array by applying a function to each element.

```js
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2); // [2, 4, 6]
```

## 2. filter()
Returns a new array with only the elements that pass a test in the callback.

```js
const nums = [1, 2, 3, 4];
const evens = nums.filter(n => n % 2 === 0); // [2, 4]
```

## 3. reduce()
Accumulates array values into a single result.

```js
const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, curr) => acc + curr, 0); // 10
```

## 4. forEach()
Executes a callback for each element in the array.

```js
const fruits = ['apple', 'banana'];
fruits.forEach(fruit => console.log(fruit));
```

## 5. some() / every()
- `some()` returns true if at least one element satisfies the condition.
- `every()` returns true if all elements satisfy the condition.

```js
const nums = [1, 2, 3];
nums.some(n => n > 2); // true
nums.every(n => n > 0); // true
```

## 6. find() / findIndex()
- `find()` returns the first element that satisfies the condition.
- `findIndex()` returns the index of the first satisfying element.

```js
const users = [{id: 1}, {id: 2}];
users.find(u => u.id === 2); // {id: 2}
```

---

## 🔁 Returning Functions from Functions

Higher-order functions can also return functions:

```js
function multiplyBy(factor) {
    return function(num) {
        return num * factor;
    };
}

const double = multiplyBy(2);
double(5); // 10
```

### More Examples

```js
function greet(greeting) {
    return function(name) {
        return `${greeting}, ${name}!`;
    };
}

const sayHello = greet("Hello");
console.log(sayHello("Alice")); // Hello, Alice!

function makeComparator(key) {
    return function(a, b) {
        return a[key] - b[key];
    };
}

const arr = [{age: 30}, {age: 25}, {age: 35}];
arr.sort(makeComparator("age")); // [{age: 25}, {age: 30}, {age: 35}]
```
