import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Create a Scanner object to read input from stdin
        Scanner scanner = new Scanner(System.in);
        
        // Take first input
        System.out.print("Enter the first number: ");
        int num1 = scanner.nextInt();
        
        // Take second input
        System.out.print("Enter the second number: ");
        int num2 = scanner.nextInt();
        
        // Print the result
        System.out.println("You entered: " + num1 + " and " + num2);
        
        // Close the scanner
        scanner.close();
    }
}
