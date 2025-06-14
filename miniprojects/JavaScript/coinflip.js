const readline = require('readline');

// Utility to prompt user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisified version of readline question
const ask = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Toss a coin randomly
function tossCoin() {
  const options = ["heads", "tails"];
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

// Main game function
async function main() {
  while (true) {
    let flag = false;
    console.clear(); // Clear terminal screen

    let answer = await ask("Pick a side for the coin toss
