/**
 * 
 * @param {*} fn 
 * @returns 
 */


var once = function(fn){
    let called = false;
    let result;

    return function(...args){
        if(!called){
            called = true;
            result = fn(...args);
            return result;
        }
        return undefined;
    }
};

let fn = (a,b,c) => a + b + c; 
let onceFn =once(fn);


console.log(onceFn(1,2,3));
console.log(onceFn(2,3,6));