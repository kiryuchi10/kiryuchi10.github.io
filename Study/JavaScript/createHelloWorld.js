// createHelloWorld Outer function 
var createHelloWorld = function() {
    console.log("Hello World");
    // return innter function 
    return function(...args){ 
        // ...args : get unlimited number of parameters 
        return "Hello World";
    }
}

createHelloWorld();

var function1 = function(a,b){
    return (a,b) =>
    {
        return a+b;
    }
}

var function2 = function(a,b){
    let sum = a+b;
    return sum;
}