# Myyntirobotti
Haaga-Helia AMK:n Softala 3 -projekti Digialle

## Kehitysympäristön asennus

### Manuaalisesti

1. Lataa ja asenna seuraavat: `Node.js, PostgreSQL`
2. Kloonaa projekti `git clone https://github.com/SWD4TN007-10/myyntirobotti`
3. Siirry backend-kansioon ja aja `npm install`. Tämä lataa package.json-tiedostossa määritetyt Node packaget.
4. Aseta Node ympäristömuuttujat tietokantayhteyttä varten: Siirry backend-kansioon, ja aja komento `nodejs setup.js`. 
Tämä luo tiedoston `.env`, jossa olevat esimerkkiarvot korvataan omaan kehitysympäristöön sopivilla arvoilla.

### Vagrantia käyttäen

(TODO)

### Backendin ajaminen

Siirry projektin kansioon backend/, ja suorita komento `nodejs indexjs`. Backend toimii portissa 3000. Selaimessa siihen pääsee siis osoitteesta localhost:3000/`

### Frontendin ajaminen

(TODO)