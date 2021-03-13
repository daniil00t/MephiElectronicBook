DROP DATABASE IF EXISTS server_db;
CREATE DATABASE server_db;
USE server_db;

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
	login VARCHAR(100) NOT NULL,
	hash INT NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE teams (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(50) NOT NULL,
	leader INT DEFAULT NULL,
	PRIMARY KEY (id),
	UNIQUE (name)
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
	name VARCHAR(300) NOT NULL,
	duration VARCHAR(100) DEFAULT NULL,
	PRIMARY KEY (id),
	UNIQUE KEY unkey (name, duration) -- !!!!!
);

CREATE TABLE students (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
	team_id INT NOT NULL,
	count INT NOT NULL,
	PRIMARY KEY (id),
	UNIQUE KEY unkey (name, team_id, count), -- !!!!!
	FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE lessons (
	id INT NOT NULL AUTO_INCREMENT,
	teacher_id INT NOT NULL,
	subject_id INT NOT NULL,
	wday INT NOT NULL,
	clock VARCHAR(50) NOT NULL,
	even INT NOT NULL,
	type VARCHAR(10),
	place VARCHAR(50),
	PRIMARY KEY (id),
	FOREIGN KEY (teacher_id) REFERENCES teachers(id),
	FOREIGN KEY (subject_id) REFERENCES subjects(id),
	UNIQUE KEY unkey (teacher_id, subject_id, wday, clock, even)-- !!!!!
);

CREATE TABLE lessons_teams (
	lesson_id INT NOT NULL,
	team_id INT NOT NULL,
	PRIMARY KEY (lesson_id, team_id),
	FOREIGN KEY (lesson_id) REFERENCES lessons(id),
	FOREIGN KEY (team_id) REFERENCES teams(id)
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





-- INSERT IGNORE INTO lessons (teacher_id, subject_id, wday, clock, even, type, place) VALUES
-- (1,(SELECT id FROM subjects WHERE name = "Методы планирования и управления деятельностью современного предприятия ядерного приборостроения"),5, "08:30 — 10:05", 0,"Пр", "ДОТ");

-- INSERT IGNORE INTO lessons (teacher_id, subject_id, wday, clock, even, type, place) VALUES
-- ((SELECT id FROM teachers WHERE name = "Абакумов Евгений Михайлович"),(SELECT id FROM subjects WHERE name = "Методы планирования и управления деятельностью современного предприятия ядерного приборостроения"),5, "08:30 — 10:05", 0,"Пр", "ДОТ"),
-- ((SELECT id FROM teachers WHERE name = "Абакумов Евгений Михайлович"),(SELECT id FROM subjects WHERE name = "Методы планирования и управления деятельностью современного предприятия ядерного приборостроения"),5, "08:30 — 10:05", 0,"Лек", "ДОТ"),
-- ((SELECT id FROM teachers WHERE name = "Абакумов Евгений Михайлович"),(SELECT id FROM subjects WHERE name = "Методы планирования и управления деятельностью современного предприятия приборостроения"),5, "10:15 — 11:50", 0,"Лек", "ДОТ"),
-- ((SELECT id FROM teachers WHERE name = "Абакумов Евгений Михайлович"),(SELECT id FROM subjects WHERE name = "Методы планирования и управления деятельностью современного предприятия приборостроения"),5, "10:15 — 11:50", 0,"Пр", "ДОТ"),
-- ((SELECT id FROM teachers WHERE name = "Абакумов Евгений Михайлович"),(SELECT id FROM subjects WHERE name = "Методы планирования и управления деятельностью современного предприятия приборостроения"),5, "11:55 — 12:40", 0,"Лек", "ДОТ"),
-- ((SELECT id FROM teachers WHERE name = "Абакумов Евгений Михайлович"),(SELECT id FROM subjects WHERE name = "Методы планирования и управления деятельностью современного предприятия приборостроения"),5, "12:45 — 15:15", 0,"Пр", "ДОТ");












-- CREATE TABLE clocks (
-- 	id INT NOT NULL AUTO_INCREMENT,
-- 	day INT NOT NULL,
-- 	clock VARCHAR(50) NOT NULL,
-- 	even INT NOT NULL,
-- 	PRIMARY KEY (id)
-- );

-- CREATE TABLE lessons (
-- 	id INT NOT NULL AUTO_INCREMENT,
-- 	teacher_id INT NOT NULL,
-- 	subject_id INT NOT NULL,
-- 	wday INT 
-- 	clock VARCHAR(50),
-- 	even INT,
-- 	type VARCHAR(10),
-- 	place VARCHAR(20),
-- 	PRIMARY KEY (id),
-- 	FOREIGN KEY (teacher_id) REFERENCES teachers(id),
-- 	FOREIGN KEY (subject_id) REFERENCES subjects(id)
-- );