const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const inputs = [];

// Collect multiple lines from stdin
rl.on('line', (line) => {
  inputs.push(line);
});

rl.on('close', () => {
  if (inputs.length >= 2) {
    // Assuming you want the first and second input lines
    const firstInput = inputs[0];
    const secondInput = inputs[1];
    console.log(`Input 1: ${firstInput} and Input 2: ${secondInput} from JavaScript!`);
  } else {
    console.log('Insufficient input provided.');
  }
});