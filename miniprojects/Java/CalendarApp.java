import java.util.Scanner;

public class CalendarApp {

    public static void main(String[] args) {
        int yearInput = fetchYear();
        int monthInput = fetchMonth();
        displayCal(yearInput, monthInput);
    }

    /**
     * Display a calendar for the desired year and month.
     * 
     * @param yearInput The year for which the calendar is to be displayed.
     * @param monthInput The month for which the calendar is to be displayed.
     */
    public static void displayCal(int yearInput, int monthInput) {
        java.util.Calendar calendar = java.util.Calendar.getInstance();
        calendar.set(yearInput, monthInput - 1, 1);  // Month is 0-based in Calendar
        int daysInMonth = calendar.getActualMaximum(java.util.Calendar.DAY_OF_MONTH);
        System.out.println("Mo Tu We Th Fr Sa Su");
        
        // Print initial spaces for the first day of the month
        int firstDayOfMonth = calendar.get(java.util.Calendar.DAY_OF_WEEK);
        for (int i = 1; i < firstDayOfMonth; i++) {
            System.out.print("   ");
        }
        
        // Print the days of the month
        for (int day = 1; day <= daysInMonth; day++) {
            System.out.printf("%2d ", day);
            if ((firstDayOfMonth + day - 1) % 7 == 0) {
                System.out.println();
            }
        }
        System.out.println();
    }

    /**
     * Prompts the user for a valid year and returns the year as an integer.
     * 
     * @return The valid year input by the user.
     */
    public static int fetchYear() {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            try {
                System.out.print("Enter year: ");
                int yearInput = Integer.parseInt(scanner.nextLine());
                if (yearInput < 0) {
                    throw new NumberFormatException("Year must be a positive integer.");
                }
                return yearInput;
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a valid year.");
            }
        }
    }

    /**
     * Function that asks the user to enter a month, validates the input, and returns the valid month.
     * 
     * @return The valid month input by the user.
     */
    public static int fetchMonth() {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            try {
                System.out.print("Enter month: ");
                int monthInput = Integer.parseInt(scanner.nextLine());
                if (monthInput < 1 || monthInput > 12) {
                    throw new NumberFormatException("Month must be between 1 and 12.");
                }
                return monthInput;
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a valid month.");
            }
        }
    }
}
