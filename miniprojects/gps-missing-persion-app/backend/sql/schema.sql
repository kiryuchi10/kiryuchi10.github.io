CREATE TABLE missing_persons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    last_seen_lat DOUBLE,
    last_seen_lon DOUBLE,
    image_url VARCHAR(255),
    status VARCHAR(20)
);
