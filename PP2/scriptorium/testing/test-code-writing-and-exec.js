const { default: test } = require('node:test');
const utils = require('../utils/code-writing-and-exec.js');

// DEBUG: check parallel output from executeCode
function testParallel() {
    (async () => {
        const code1 = 
        `print('Hello, World1!')
    while True:
        pass
        `;
        const code2 = "print('Hello, World2!')";
        const promises = [
          utils.executeCode(code1, "python", ""),
          utils.executeCode(code2, "python", "")
        ];
    
        promises.forEach(promise => {
            promise
                .then(output => console.log(output))
                .catch(error => console.error(error));
        });
    
    })();
}

// DEBUG: test single Java code
function testSingleJava() {
    (async () => {
        const code1 = 
        ` public static void main(String[] args) {
                System.out.println("Hello, Java!");
            }`;
        const promises = [
          utils.executeCode(code1, "java", "")
        ];
    
        promises.forEach(promise => {
            promise
                .then(output => console.log(output))
                .catch(error => console.error(error));
        });
    
    })();
}

// DEBUG: test single C code
function testSingleC() {
    (async () => {
        const code1 = 
        `#include <stdio.h>
            int main() {
                printf("Hello, C!");
                return 0;
            }`;
        const promises = [
          utils.executeCode(code1, "c", "")
        ];
    
        promises.forEach(promise => {
            promise
                .then(output => console.log(output))
                .catch(error => console.error(error));
        });
    
    })();
}

function testSingleJavascript() {
    (async () => {
        const code = 
        `console.log("Hello, JS!")`;
        const output = await utils.executeCode(code, "javascript", "");
        console.log(output);
    })();
}

function testSinglePython() {
    (async () => {
        const code = 
        `print("Hello, Python!")`;
        const output = await utils.executeCode(code, "python", "");
        console.log(output);
    })();
}

function testStdinPython() {
    (async () => {
        const code = 
`user_input = input("Enter something: ")

# Print the input back
print()
print(f'You entered: {user_input}')
`;
        const output = await utils.executeCode(code, "python", "heloooo");
        console.log(output);
    })();
}

function testSingleCpp() {
    (async () => {
        const code = `
#include <iostream>
int main() {
    std::cout << "Hello from C++!" << std::endl;
    return 0;
}
`;
        const output = await utils.executeCode(code, "c++", "");
        console.log(output);
    })();
}

testSingleCpp()
