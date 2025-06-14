/**
 * @param {number[]} arr
 * @param {Function} fn
 * @return {number[]}
 */

var greaterThan10 = function(n){
        return n > 10;
    };
    
// filter function that directly uses the callback with (value, index).
var filter = function(arr, fn){
    const result = [];
    for (let i = 0; i < arr.length ; i++){
        // Check if the function returns a truthy value
        if(fn(arr[i]),i){
            result.push(arr[i]);
        }
    }
    return result;
}

var filter2 = function(fn){
    return function inner(arr){
        const result = [];
        for (let i = 0; i < arr.length ; i++){
            if(fn(arr[i],i)){
                result.push(arr[i]);
            }
        }
        return result;
    }
}

let val1 = filter([10,20,30],greaterThan10);
console.log(val1);
let val2 = filter2(greaterThan10)([10,20,30]);
console.log(val2);