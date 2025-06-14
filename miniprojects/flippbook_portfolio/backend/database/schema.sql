-- schema.sql
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

CREATE TABLE resume (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  content TEXT
);

CREATE TABLE contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255),
  message TEXT
);
