DROP DATABASE IF EXISTS server_db;
CREATE DATABASE server_db;
USE server_db;

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
	login VARCHAR(100) NOT NULL,
	hash INT NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE teachers (
	id INT NOT NULL AUTO_INCREMENT,
	user_id INT DEFAULT NULL,
	name VARCHAR(100) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (name),
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE subjects (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
	duration VARCHAR(100) DEFAULT NULL,
	PRIMARY KEY (id),
	UNIQUE (name)
);

CREATE TABLE clocks (
	id INT NOT NULL AUTO_INCREMENT,
	day INT NOT NULL,
	clock VARCHAR(50) NOT NULL,
	even INT NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE classes (
	id INT NOT NULL AUTO_INCREMENT,
	teacher_id INT NOT NULL,
	subject_id INT NOT NULL,
	clock_id INT NOT NULL,
	type VARCHAR(10) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (teacher_id) REFERENCES teachers(id),
	FOREIGN KEY (subject_id) REFERENCES subjects(id),
	FOREIGN KEY (clock_id) REFERENCES clocks(id)
);

CREATE TABLE teams (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(50) NOT NULL,
	leader INT DEFAULT NULL,
	PRIMARY KEY (id),
	UNIQUE (name)
);

CREATE TABLE students (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
	team_id INT NOT NULL,
	count INT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE classes_teams (
	class_id INT NOT NULL,
	team_id INT NOT NULL,
	PRIMARY KEY (class_id),
	FOREIGN KEY (team_id) REFERENCES teams(id),
	FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE reports (
	id INT NOT NULL AUTO_INCREMENT,
	team_id INT NOT NULL,
	subject_id INT NOT NULL,
	content VARCHAR(100) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (team_id) REFERENCES teams(id),
	FOREIGN KEY (subject_id) REFERENCES subjects(id)
);