#include <stdio.h>

int main() {
    int num1, num2;
    
    // Take first input
    printf("Enter the first number: ");
    scanf("%d", &num1);
    
    // Take second input
    printf("Enter the second number: ");
    scanf("%d", &num2);
    
    // Print the result
    printf("You entered: %d and %d\n", num1, num2);
    
    return 0;
}