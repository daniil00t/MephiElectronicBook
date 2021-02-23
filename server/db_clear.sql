DROP DATABASE IF EXISTS server_db;
CREATE DATABASE server_db;
USE server_db;

CREATE TABLE teachers (
	teacher_id INT NOT NULL AUTO_INCREMENT,
	teacher_name VARCHAR(50) NOT NULL,
	PRIMARY KEY (teacher_id)
);

CREATE TABLE subjects (
	subject_id INT NOT NULL AUTO_INCREMENT,
	subject_name VARCHAR(50) NOT NULL,
	PRIMARY KEY (subject_id)
);

CREATE TABLE times (
	time_id INT NOT NULL AUTO_INCREMENT,
	time_day VARCHAR(50) NOT NULL,
	time_start TIME NOT NULL,
	time_odd VARCHAR(50) NOT NULL,
	PRIMARY KEY (time_id)
);

CREATE TABLE teams (
	team_id INT NOT NULL AUTO_INCREMENT,
	team_name VARCHAR(50) NOT NULL,
	PRIMARY KEY (team_id)
);

CREATE TABLE students (
	student_id INT NOT NULL AUTO_INCREMENT,
	student_name VARCHAR(50) NOT NULL,
	team_id INT NOT NULL,
	PRIMARY KEY (student_id),
	FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE TABLE classes (
	class_id INT NOT NULL AUTO_INCREMENT,
	teacher_id INT NOT NULL,
	subject_id INT NOT NULL,
	time_id INT NOT NULL,
	PRIMARY KEY (class_id),
	FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
	FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
	FOREIGN KEY (time_id) REFERENCES times(time_id)
);

CREATE TABLE classes_teams (
	class_id INT NOT NULL,
	team_id INT NOT NULL,
	PRIMARY KEY (class_id)
);