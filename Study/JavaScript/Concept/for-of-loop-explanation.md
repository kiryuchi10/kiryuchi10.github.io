
# 🔍 Understanding `for (const _ of args)` in JavaScript

## What does `of` mean?

`of` is part of the **`for...of` loop** syntax in JavaScript.

It is used to **iterate over the values** of an iterable object such as:
- Arrays
- Strings
- Sets
- Maps
- NodeLists, etc.

---

## Syntax

```javascript
for (const value of iterable) {
  // use value
}
```

- `const value`: A new variable created on each iteration to store the current value.
- `of iterable`: Loops **through the values** of the iterable object.

> ⚠️ `for...of` is **not the same as** `for...in`!

---

## What does `const _ of args` mean?

```javascript
for (const _ of args)
```

- `const _`: Declares a variable named `_` for each element in the loop.
  - The underscore `_` is commonly used as a placeholder when the value isn’t needed.
- `of args`: Loops through each value inside the `args` array.

This is often used just to **count** how many items are in `args` without needing the actual values.

---

## Example

```javascript
const args = [10, 20, 30];

for (const _ of args) {
  console.log(_); // logs 10, then 20, then 30
}
```

If the value isn’t needed:

```javascript
let count = 0;
for (const _ of args) {
  count++;
}
console.log(count); // Output: 3
```

---

## Quick Comparison: `for...of` vs `for...in`

| Loop Type      | Iterates Over     | Example Output        |
|----------------|-------------------|------------------------|
| `for...of`     | **Values**         | `[10, 20] → 10, 20`    |
| `for...in`     | **Keys/Indices**   | `[10, 20] → "0", "1"`  |

### Code Demo

```javascript
for (let i in [10, 20]) console.log(i); // "0", "1"
for (let val of [10, 20]) console.log(val); // 10, 20
```

---
