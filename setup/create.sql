DROP TABLE IF EXISTS SessionAnswer;
DROP TABLE IF EXISTS Contact;
DROP TABLE IF EXISTS Session;
DROP TABLE IF EXISTS QuestionAnswer;
DROP TABLE IF EXISTS Answer;
DROP TABLE IF EXISTS Question;

CREATE TABLE Question (
id serial primary key,
text VARCHAR(200) not null,
contains_link BOOLEAN DEFAULT '0'
);

CREATE TABLE Answer (
id serial primary key,
text VARCHAR(200) not null
);

CREATE TABLE QuestionAnswer (
question_id serial REFERENCES Question(id),
answer_id serial REFERENCES Answer(id),
next_question serial REFERENCES Question(id),
level VARCHAR(20)
);

CREATE TABLE Session (
id SERIAL PRIMARY KEY,
ip VARCHAR(50),
current_question SERIAL REFERENCES Question(id)
);

CREATE TABLE SessionAnswer (
id SERIAL PRIMARY KEY,
session_id INT REFERENCES Session(id),
timestamp TIMESTAMP NOT NULL,
question_id SERIAL REFERENCES Question(id),
answer_id SERIAL REFERENCES Answer(id),
link_clicked BOOLEAN
);

CREATE TABLE Contact (
id SERIAL PRIMARY KEY,
session_id INT REFERENCES Session(id),
timestamp TIMESTAMP NOT NULL,
name VARCHAR(30) NOT NULL,
surname VARCHAR(30) NOT NULL,
phone VARCHAR(20),
email VARCHAR(60),
organisation VARCHAR(100) NOT NULL,
comments VARCHAR(255)
);