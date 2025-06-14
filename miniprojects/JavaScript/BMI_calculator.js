const fs = require('fs');
const readline = require('readline');

function referenceChart() {
    fs.readFile('bmi.csv', 'utf8', (err, data) => {
        if (err) {
            console.error("Could not read file:", err);
            return;
        }
        const rows = data.trim().split('\n').map(line => line.split(','));
        console.log("Here You can take the reference chart\n");
        console.table(rows.slice(1), rows[0]);
    });
}

function calculateBMI(height, weight) {
    if (height <= 0) return null;
    return +(weight / (height ** 2)).toFixed(2);
}

function interpretBMI(bmi) {
    if (bmi === null) return "Invalid input. Height should be greater than 0.";

    if (bmi < 18.5) return `Your BMI is ${bmi}, you are underweight.`;
    else if (bmi < 24.9) return `Your BMI is ${bmi}, you have a normal weight.`;
    else if (bmi < 29.9) return `Your BMI is ${bmi}, you are overweight.`;
    else if (bmi < 34.9) return `Your BMI is ${bmi}, you are obese (Class I).`;
    else if (bmi < 39.9) return `Your BMI is ${bmi}, you are obese (Class II).`;
    else return `Your BMI is ${bmi}, you are obese (Class III).`;
}

function main() {
    referenceChart();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter your height in meters: ', heightInput => {
        rl.question('Enter your weight in kilograms: ', weightInput => {
            const height = parseFloat(heightInput);
            const weight = parseFloat(weightInput);

            if (isNaN(height) || isNaN(weight)) {
                console.log("Invalid input. Please enter numerical values for height and weight.");
            } else {
                const bmi = calculateBMI(height, weight);
                const result = interpretBMI(bmi);
                console.log(result);
            }

            rl.close();
        });
    });
}

main();
