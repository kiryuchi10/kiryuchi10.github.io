
# Functions and Forms in JavaScript

## 1. Functions

A **function** is a block of code designed to perform a particular task. Functions are reusable and can be invoked or called when needed.

### Function Declaration

A function declaration defines a function with a specified name. 

```js
function greet(name) {
  console.log("Hello, " + name);
}
greet("Alice"); // Output: Hello, Alice
```

### Function Expression

A function expression defines a function inside an expression. 

```js
const greet = function(name) {
  console.log("Hello, " + name);
};
greet("Bob"); // Output: Hello, Bob
```

### Arrow Function

An arrow function is a concise way to write function expressions. It does not have its own `this` value.

```js
const greet = (name) => {
  console.log("Hello, " + name);
};
greet("Charlie"); // Output: Hello, Charlie
```

## 2. Higher-Order Functions

A **higher-order function** is a function that either takes one or more functions as arguments, returns a function, or both.

### Examples:

#### 1. filter()

Returns a new array with only the elements that pass a test in the callback.

```js
const nums = [1, 2, 3, 4];
const evens = nums.filter(n => n % 2 === 0); // [2, 4]
```

#### 2. reduce()

Accumulates array values into a single result.

```js
const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, curr) => acc + curr, 0); // 10
```

#### 3. forEach()

Executes a callback for each element in the array.

```js
const fruits = ['apple', 'banana'];
fruits.forEach(fruit => console.log(fruit));
// Output: apple
//         banana
```

#### 4. some() / every()

- `some()` returns `true` if at least one element satisfies the condition.
- `every()` returns `true` if all elements satisfy the condition.

```js
const nums = [1, 2, 3];
console.log(nums.some(n => n > 2)); // true
console.log(nums.every(n => n > 0)); // true
```

#### 5. find() / findIndex()

- `find()` returns the first element that satisfies the condition.
- `findIndex()` returns the index of the first satisfying element.

```js
const users = [{id: 1}, {id: 2}];
console.log(users.find(u => u.id === 2)); // {id: 2}
```

## 3. Returning Functions from Functions

Higher-order functions can also return functions:

```js
function multiplyBy(factor) {
  return function(num) {
    return num * factor;
  };
}

const double = multiplyBy(2);
console.log(double(5)); // 10
```

## 4. Forms in JavaScript

Forms are essential components of web pages for collecting user input. The JavaScript `HTMLFormElement` interface represents an HTML form element, and methods can be used to access and modify form data.

### Getting Form Data

You can get data from form elements like `<input>`, `<select>`, and `<textarea>`.

```js
const form = document.querySelector("form");
form.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission
  const name = form.querySelector("input[name='name']").value;
  console.log(name); // Output the value of the 'name' input field
});
```

### Validating Forms

You can validate form data before submission using JavaScript.

```js
const form = document.querySelector("form");
form.addEventListener("submit", function(event) {
  const email = form.querySelector("input[name='email']").value;
  if (!email.includes("@")) {
    alert("Invalid email!");
    event.preventDefault(); // Stop form submission
  }
});
```

### Modifying Form Elements

You can change values of form elements via JavaScript.

```js
document.querySelector("input[name='name']").value = "John Doe"; // Set value
document.querySelector("input[name='age']").disabled = true; // Disable input
```

### Form Submission

You can programmatically submit a form.

```js
const form = document.querySelector("form");
form.submit(); // Submit form programmatically
```
