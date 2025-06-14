import java.util.Scanner;

public class Calculator {
    public static void main(String[] args) {
        // Create a scanner object to take user input
        Scanner scanner = new Scanner(System.in);

        // Take the operator input
        System.out.print("Enter operator (either +, -, * or /): ");
        String operator = scanner.nextLine();

        // Get numbers from the user
        System.out.print("Enter first number: ");
        double number1 = scanner.nextDouble();
        System.out.print("Enter second number: ");
        double number2 = scanner.nextDouble();

        double result = 0;

        // Perform the calculation
        if (operator.equals("+")) {
            result = number1 + number2;
        } else if (operator.equals("-")) {
            result = number1 - number2;
        } else if (operator.equals("*")) {
            result = number1 * number2;
        } else if (operator.equals("/")) {
            if (number2 == 0) {
                System.out.println("Error: Division by zero is not allowed.");
                return;
            }
            result = number1 / number2;
        } else {
            System.out.println("Invalid operator");
            return;
        }

        // Display the result
        System.out.println(number1 + " " + operator + " " + number2 + " = " + result);
    }
}
