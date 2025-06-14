# Take the operator input
operator = input("Enter operator (either +, -, * or /): ")

# Get numbers from the user
number1 = float(input("Enter first number: "))
number2 = float(input("Enter second number: "))

# Perform the calculation
if operator == '+':
    result = number1 + number2
elif operator == '-':
    result = number1 - number2
elif operator == '*':
    result = number1 * number2
elif operator == '/':
    result = number1 / number2
else:
    print("Invalid operator")
    exit(1)

# Display the result
print(f"{number1} {operator} {number2} = {result}")
