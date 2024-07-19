const readline = require('readline');

//arithmetic series formula
const sum_to_n_a = function(n) {
    return (n * (n + 1)) / 2;
};

//iterative approach
const sum_to_n_b = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// recursive approach
const sum_to_n_c = function(n) {
    if (n === 1) {
        return 1;
    } else {
        return n + sum_to_n_c(n - 1);
    }
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Input any integer N: ", (number) => {
    let n = parseInt(number);
    if (!isNaN(n) && Number.isInteger(n)) {
        console.log("Method 1 (arithmetic series formula): ", sum_to_n_a(n));
        console.log("Method 2 (iterative approach):", sum_to_n_b(n));
        console.log("Method 3 (recursive approach): ", sum_to_n_c(n));
        rl.close();
    } else {
        console.log("Please enter a valid integer.");
        rl.close();
    }
});