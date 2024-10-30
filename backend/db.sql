CREATE DATABASE peer_learning;

USE peer_learning;

-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  accessibility_options JSON DEFAULT NULL,
  subjects JSON DEFAULT NULL
);

-- Tutors Table
CREATE TABLE tutors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  subjects JSON,
  availability DATETIME,
  accessibility_options JSON,
  rating FLOAT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
