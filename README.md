# Myyntirobotti
Haaga-Helia AMK:n Softala 3 -projekti Digialle

## Kehitysympäristön asennus

1. Lataa ja asenna seuraavat: `Node.js, PostgreSQL`. Postgres tulee koulun koneilla asentaa portablena, jolloin siitä ei synny erillistä palveluinstanssia. [Tätä varten voit ladata Postgresin zippiversion täältä.](http://www.enterprisedb.com/products-services-training/pgbindownload) Asenna se esimerkiksi oman opiskelijanumerokäyttäjäsi kotikansioon.
2. Luo datakansio tietokantaa varten, esimerkiksi `~/psql/bin/initdb.exe -D ~/Myyntirobotti_data`. Komento toimii joko IDEAN sisälle ohjeistetulla sh-shellillä, tai koulun koneilta löytyvällä Git Bash -ohjelmalla.
3. Käynnistä tietokanta `~/psql/bin/pg_ctl.exe -D ~/Myyntirobotti_data start`.
4. Kloonaa projekti `git clone https://github.com/SWD4TN007-10/myyntirobotti.git`
5. Aja kannan taulurakenteen sekä pohjasisällön create & insert -skriptit komennoilla `~/psql/bin/psql.exe -d postgres -a -f ~/IdeaProjects/myyntirobotti/setup/create.sql` sekä `~/psql/bin/psql.exe -d postgres -a -f ~/IdeaProjects/myyntirobotti/setup/seed.sql` (korjaa kansiopolut tarvittaessa)
6. Postgresin hallintakäyttöliittymään pääset jatkossa oletuksena komennolla `~/psql/bin/psql.exe -d postgres`
7. Siirry backend-kansioon, ja aja `npm install`. Tämä lataa package.json-tiedostossa määritetyt Node-packaget.
8. Aseta Noden ympäristömuuttujat tietokantayhteyttä varten:

Aja komento `node setup.js` backend-kansiossa.
Tämä luo tiedoston `.env`, jossa olevat esimerkkiarvot, kuten tietokannan nimi ja käyttäjätunnus, korvataan tarvittaessa omaan kehitysympäristöön sopivilla arvoilla. Oletuksen pitäisi olla koulun koneilla riittävä. Kirjasto dotenv lataa tiedoston kun backendia ajetaan.

### Backendin ajaminen

Siirry projektin kansioon backend/, ja suorita komento `node index.js`. Backend toimii portissa 3000 eli API:a kutsutaan seuraavasti: `localhost:3000/komento`, esimerkiksi `localhost:3000/question/1`.

### Frontendin ajaminen

(TODO)
