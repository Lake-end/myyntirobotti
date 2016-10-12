# Myyntirobotti
Haaga-Helia AMK:n Softala 3 -projekti Digialle

## Kehitysympäristön asennus

### Manuaalisesti

1. Lataa ja asenna seuraavat: `Node.js, PostgreSQL`
2. Luo tietokanta projektia varten, ja lisää sinne taulut tietokantaskriptejä käyttäen.
3. Kloonaa projekti `git clone https://github.com/SWD4TN007-10/myyntirobotti.git`
4. Siirry backend-kansioon ja aja `npm install`. Tämä lataa package.json-tiedostossa määritetyt Node-packaget.
5. Aseta Node ympäristömuuttujat tietokantayhteyttä varten: 

Aja komento `node setup.js` backend-kansiossa. 
Tämä luo tiedoston `.env`, jossa olevat esimerkkiarvot, kuten tietokannan nimi ja käyttäjätunnus, korvataan omaan kehitysympäristöön sopivilla arvoilla. Kirjasto dotenv lataa tiedoston kun backendia ajetaan.
Alla esimerkki tiedoston sisällöstä:

```
NODE_ENV=development
DATABASE_NAME=tietokannan_nimi
DATABASE_USERNAME=käyttäjätunnus
DATABASE_PASSWORD=salasana
DATABASE_HOST=localhost
```

### Vagrantia käyttäen

(TODO)

### Backendin ajaminen

Siirry projektin kansioon backend/, ja suorita komento `node indexjs`. Backend toimii portissa 3000 eli siihen pääsee lokaalissa kehitysympäristössä osoitteessa `localhost:3000/`.

### Frontendin ajaminen

(TODO)