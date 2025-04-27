CREATE DATABASE songjog_scholarship;

USE songjog_scholarship;

CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'sponsor', 'coordinator') NOT NULL
);

CREATE TABLE Students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address JSON,
  dob DATE,
  academic_records JSON,
  financial_status JSON,
  bio TEXT,
  goals TEXT,
  profile_picture VARCHAR(255),
  certificates JSON
);

CREATE TABLE Sponsors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  preferences JSON,
  sponsored_student_ids JSON
);

CREATE TABLE Payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT,
  sponsorId INT,
  amount DECIMAL(10, 2),
  date DATE,
  type ENUM('one-time', 'monthly'),
  status ENUM('pending', 'completed'),
  FOREIGN KEY (studentId) REFERENCES Students(id),
  FOREIGN KEY (sponsorId) REFERENCES Sponsors(id)
);

CREATE TABLE Applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  studentId INT,
  type ENUM('one-time', 'monthly'),
  essay TEXT,
  references JSON,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  comments TEXT,
  assignedSponsorId INT,
  FOREIGN KEY (studentId) REFERENCES Students(id),
  FOREIGN KEY (assignedSponsorId) REFERENCES Sponsors(id)
);

CREATE TABLE Messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  senderId INT,
  receiverId INT,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (senderId) REFERENCES Users(id),
  FOREIGN KEY (receiverId) REFERENCES Users(id)
);

CREATE TABLE Logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  action VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id)
);