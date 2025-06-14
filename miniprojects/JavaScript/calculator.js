// Import the readline-sync module
const readlineSync = require('readline-sync');

// Take the operator input
const operator = readlineSync.question("Enter operator (either +, -, * or /): ");

// Get numbers from the user
const number1 = parseFloat(readlineSync.question("Enter first number: "));
const number2 = parseFloat(readlineSync.question("Enter second number: "));

let result;

if (operator == '+') {
    result = number1 + number2;
} else if (operator == '-') {
    result = number1 - number2;
} else if (operator == '*') {
    result = number1 * number2;
} else if (operator == '/') {
    result = number1 / number2;
} else {
    console.log("Invalid operator");
    process.exit(1);
}

console.log(`${number1} ${operator} ${number2} = ${result}`);
