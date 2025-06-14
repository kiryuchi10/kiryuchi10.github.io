# Short-Circuiting of Logical Operators

Short-circuiting is a mechanism used by logical operators (such as `&&` and `||`) in many programming languages where evaluation stops as soon as the outcome is determined. This means that not all operands may be evaluated if the first one already determines the result.

## How It Works

- **Logical AND (`&&`):**  
  For the expression `A && B`, if `A` is falsy, then the entire expression is falsy and `B` is not evaluated.  
  *Example:*  
  ```js
  // If checkA() returns false, checkB() won't be executed
  checkA() && checkB();
