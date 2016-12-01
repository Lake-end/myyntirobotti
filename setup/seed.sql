INSERT INTO Question (id, text)
VALUES
 (1, 'Mikä on yrityksenne toimiala?')
,(2, 'Minkä kokoinen yrityksenne on?')
,(3, 'Miten suuri on yrityksenne liikevaihto?')
,(4, 'Mikä on asemasi yrityksessä?')
,(5, 'Millainen toiminnallisuus on ERP-ratkaisullesi tärkeintä?')
,(6, 'Suosittelemme teille ratkaisuamme Digia Logistics -- enemmän näkyvyyttä kansainvälisille kuljetusketjuille')
,(60, 'Suosittelemme teille Digia Enterprise -- monipuolinen, suomalainen toiminnan- ja talousohjausjärjestelmä')
,(8, 'Tässä hieman muiden asiakkaidemme kokemuksia Digia Logisticsista')
,(80, 'Tässä hieman muiden asiakkaidemme kokemuksia Digia Enterprisesta')
,(1000, 'Täytä yhteystietosi, jotta voimme kertoa sinulle lisää!')
,(2000, 'Viimeinen kysymys');

INSERT INTO Answer (id, text)
VALUES
 (11, 'Tukkumyynti')
,(12, 'Vähittäiskauppa')
,(21, 'Pieni (alle 50 työntekijää)')
,(22, 'Keskikokoinen (50-249 työntekijää)')
,(23, 'Suuri (yli 250 työntekijää)')
,(31, 'Alle 5 miljoonaa € vuodessa')
,(32, '5-20 miljoonaa € vuodessa')
,(33, 'Yli 20 miljoonaa € vuodessa')
,(34, 'En mielelläni sano')
,(41, 'Toimitusjohtaja')
,(42, 'Talousjohtaja')
,(43, 'Markkinointijohtaja')
,(44, 'Logistiikkajohtaja')
,(45, 'Muu')
,(51, 'Nopea toimitus ja käyttöönotto')
,(52, 'Operatiivisten tehtävien ajanhallinta')
,(53, 'Arvoketjujen tehokkuus')
,(54, 'Kuluttajan palautelähtöinen ymmärtäminen')
,(61, 'Tämä vaikuttaa hyvältä. Kuinka voin saada lisätietoa?')
,(62, 'Mitä muuta voitte minulle tarjota?')
,(1001, 'Dummy answer (ei pitäisi näkyä)')
,(2002, 'Dummy answer (ei pitäisi näkyä)');

INSERT INTO QuestionAnswer (question_id, answer_id, next_question)
VALUES
 (1, 11, 2)
,(1, 12, 2)
,(2, 21, 3)
,(2, 22, 3)
,(2, 23, 3)
,(3, 31, 4)
,(3, 32, 4)
,(3, 33, 4)
,(3, 34, 4)
,(4, 41, 5)
,(4, 42, 5)
,(4, 43, 5)
,(4, 44, 5)
,(5, 51, 6)
,(5, 52, 6)
,(5, 53, 6)
,(5, 54, 6)
,(6, 61, 1000)
,(6, 62, 60)
,(60, 61, 1000)
,(60, 62, 6)
,(1000, 1001, 2000)
,(2000, 2002, 1);

INSERT INTO Session (id, ip, current_question)
VALUES
 (1, '127.0.0.1', 1000);

INSERT INTO SessionAnswer (id, session_id, "timestamp", question_id, answer_id, link_clicked)
VALUES
 (1, 1, '2016-11-15 07:56:38', 1, 11, null)
,(2, 1, '2016-11-15 07:56:38', 2, 22, null)
,(3, 1, '2016-11-15 07:56:39', 3, 32, null)
,(4, 1, '2016-11-15 07:56:41', 4, 41, null)
,(5, 1, '2016-11-15 07:56:44', 5, 53, null)
,(6, 1, '2016-11-15 07:56:49', 6, 61, null)
,(7, 1, '2016-11-15 07:57:31', 1000, 1001, null);

INSERT INTO Contact (id, session_id, timestamp, name, surname, phone, email, organisation, comments)
VALUES
 (1, 1, '2016-11-15 07:57:31', 'Myynti', 'Robotti', '013-131313', 'myyntirobotti@gmail.com', 'Haaga-Helia AMK', 'Hei maailma!');