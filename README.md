# Myyntirobotti
Haaga-Helia AMK:n Softala 3 -projekti Digialle

## Kehitysympäristön asennus

1. Lataa ja asenna seuraavat: `Node.js, PostgreSQL`
2. Luo datakansio tietokantaa varten, esimerkiksi `~/psql/bin/initdb.exe -D ~/Myyntirobotti_data`.
3. Käynnistä tietokanta `~/psql/bin/pg_ctl.exe -D ~/Myyntirobotti_data start`.
4. Kloonaa projekti `git clone https://github.com/SWD4TN007-10/myyntirobotti.git`
5. Siirry setup-kansioon. Aja ensin postgressä komennot tiedostosta `create.sql` ja tämän jälkeen tiedostosta `seed.sql`.
6. Siirry backend-kansioon, ja aja `npm install`. Tämä lataa package.json-tiedostossa määritetyt Node-packaget.
7. Aseta Node ympäristömuuttujat tietokantayhteyttä varten: 

Aja komento `node setup.js` backend-kansiossa. 
Tämä luo tiedoston `.env`, jossa olevat esimerkkiarvot, kuten tietokannan nimi ja käyttäjätunnus, korvataan tarvittaessa omaan kehitysympäristöön sopivilla arvoilla. Kirjasto dotenv lataa tiedoston kun backendia ajetaan.

Alla esimerkki tiedoston sisällöstä:

```
NODE_ENV=development
DATABASE_NAME=tietokannan_nimi
DATABASE_USERNAME=käyttäjätunnus
DATABASE_PASSWORD=salasana
DATABASE_HOST=localhost
```

### Backendin ajaminen

Siirry projektin kansioon backend/, ja suorita komento `node indexjs`. Backend toimii portissa 3000 eli API:a kutsutaan seuraavasti: `localhost:3000/komento`, esimerkiksi `localhost:3000/question/1`.

### Frontendin ajaminen

(TODO)