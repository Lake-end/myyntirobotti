CREATE TABLE Question (
id serial primary key, 
text VARCHAR(200) not null
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

CREATE TABLE Session(
id SERIAL PRIMARY KEY,
current_question SERIAL REFERENCES Question(id)
);

CREATE TABLE UserAnswer(
id SERIAL PRIMARY KEY,
session_id SERIAL REFERENCES Session(id),
timestamp TIMESTAMP NOT NULL,
question_id SERIAL REFERENCES Question(id),
answer_id SERIAL REFERENCES Answer(id)
);