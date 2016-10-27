INSERT INTO Question (id, text)
VALUES 
(1, 'Ensimmäisen tason kysymys?'),
(2, 'Toisen tason kysymys?'),
(3, 'Toisen tason toinen kysymys?'),
(4, 'Kolmas kysymys?'),
(1000, 'Ostopäätösloppu'),
(1500, 'Yhteydenottopyyntö'),
(1501, 'Sähköpostiloppu'),
(1502, 'Puheluloppu'),
(2000, 'EVVK-loppu');

INSERT INTO Answer (id, text) 
VALUES 
(1, 'Ahaa, kerro lisää'),
(2, 'Hmm hmm.'),
(3, 'Kiehtovaa.'),
(1000, 'Kyllä, ostan!'),
(1500, 'Tahdon lisätietoa myyjältänne!'),
(1501, 'Sähköpostitse'),
(1502, 'Puhelimitse'),
(2000, 'En tahdo tätä.');

INSERT INTO QuestionAnswer (question_id, answer_id, next_question)
VALUES
(1, 1, 2),
(1, 2, 3),
(1, 1000, 1000),
(1, 2000, 2000),
(2, 3, 4),
(2, 1, 4),
(2, 1000, 1000),
(2, 2000, 2000),
(3, 2, 4),
(3, 3, 4),
(4, 1000, 1000),
(4, 1500, 1500),
(4, 2000, 2000),
(1500, 1501, 1501),
(1500, 1502, 1502);