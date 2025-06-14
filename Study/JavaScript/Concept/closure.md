# How Closures Work in JavaScript

Closures are a powerful feature in JavaScript that allow an inner function to access variables from its outer function—even after the outer function has finished executing. This mechanism supports data privacy, state management, cleaner code organization, and more.

---

## The Core Concept

1. **Outer Function**  
   Declares local variables and sets up the environment for the inner function.

2. **Inner Function**  
   Defined within the outer function, it uses the outer function's variables.

3. **Returning the Inner Function**  
   Once the outer function returns, the inner function still retains access to the outer function’s variables. This is what we call a **closure**.

---

## Why Use Closures?
   

## Basic Example: A Counter

This example shows a typical use-case where an inner function modifies a variable declared in an outer function.

```js
function createCounter(init) {
  let current = init;  // 'current' is a local variable

  // Inner function that "remembers" and modifies 'current'
  function increment() {
    current++;
    return current;
  }

  return increment;  // Return the inner function
}

// Usage:
const counter = createCounter(5);
console.log(counter()); // 6 (current is now 6)
console.log(counter()); // 7 (current is now 7)