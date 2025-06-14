function displayCal(year, month) {
    // Array to map month numbers to names.
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    // Get the name of the requested month.
    const monthName = monthNames[month - 1];
    
    // Build the header.
    console.log(`    ${monthName} ${year}`);
    console.log("Su Mo Tu We Th Fr Sa");
  
    // Determine the first day of the month.
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  
    // Determine the number of days in the month.
    // By creating a date for the 0th day of the next month, we obtain the last day of the current month.
    const daysInMonth = new Date(year, month, 0).getDate();
  
    let calendarStr = "";
    let dayOfWeekCounter = firstDayOfMonth;
  
    // Add spacing for the days before the first day of the month.
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarStr += "   ";
    }
  
    // Loop through each day and format the display.
    for (let day = 1; day <= daysInMonth; day++) {
      // Pad single-digit days for alignment.
      if (day < 10) {
        calendarStr += " " + day + " ";
      } else {
        calendarStr += day + " ";
      }
      dayOfWeekCounter++;
      // Break the line after Saturday.
      if (dayOfWeekCounter % 7 === 0) {
        calendarStr += "\n";
      }
    }
  
    console.log(calendarStr);
  }
  
  function fetchYear() {
    /*
      Prompts the user for a valid year and returns the year as an integer.
    */
    while (true) {
      let input = prompt("Enter year:");
      let year = parseInt(input, 10);
      if (!isNaN(year) && year >= 0) {
        return year;
      } else {
        alert("Invalid input. Please enter a valid year.");
      }
    }
  }
  
  function fetchMonth() {
    /*
      Prompts the user for a valid month (1 through 12) and returns the month as an integer.
    */
    while (true) {
      let input = prompt("Enter month (1-12):");
      let month = parseInt(input, 10);
      if (!isNaN(month) && month >= 1 && month <= 12) {
        return month;
      } else {
        alert("Invalid input. Please enter a valid month between 1 and 12.");
      }
    }
  }
  
  // Gather user input.
  const year_input = fetchYear();
  const month_input = fetchMonth();
  
  // Display the calendar.
  displayCal(year_input, month_input);
  