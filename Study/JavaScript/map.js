/**
 * 
 * @param {*} arr 
 * @param {*} fn 
 * @returns 
 */

var plusone = function(n){
    return n + 1;
};

var map = (arr,fn) =>{
    let result = [];
    for (let i = 0; i < arr.length; i++){
        result.push(fn(arr[i],i))
    }
    return result;
};

let val1 = map([1,2,3],plusone);
console.log(val1);
let val2 = map([1,2,3], (x, i) => x * 2);
console.log(val2);