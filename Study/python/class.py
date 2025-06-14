class Rectangle:
    def __init__(self):
        self.length = 1
        self.width = 1

    def area(self):
        return self.length * self.width

# Instantiate the class and modify its attributes outside the class definition
room_1 = Rectangle()
room_1.length = 10 
room_1.width = 15 
print("Room 1's area:", room_1.area())
print("Room 1's area:", room_1.area())