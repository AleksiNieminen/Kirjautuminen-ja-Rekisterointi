//1. Kirjastot
const express = require("express"); // Palvelimen reititys
const bcrypt = require("bcrypt"); // Salasanojen tiivistys
const jwt = require("jsonwebtoken"); // Tokenien käyttö
const cookieParser = require("cookie-parser"); // Evästeiden käyttö
const path = require("path"); // Noden työkalu //tiedostopolkuje hallinta

//2. Alustus
const app = express(); // luodaan app muuttuja

//3. Middlewaret
app.use(express.json()); // sovellus käyttää JSON- dataa
app.use(cookieParser()); // evästeiden lukija käyttöön
app.use(express.static("public")); // määritellään public-kansio staattiseksi

//4. Salaisuudet / Valemuistit
const secretKey = "asdfgyuiopå654321bvcxz";
const users = []; //Kunnes tietokanta on käytössä
const registerCode = "TervetuloaKäyPeremmälle";

//5. Verify
app.get("/api/verify", (req, res) => {
  const token = req.cookies.token; //haetaan token evästeistä

  //Evästettä ei ole, lähetetään 401. Nginx ohjaa kirjautumissivulle.
  if (!token) {
    //ohjataan 401:een Unauthorized
    return res.status(401).send("Unauthorized");
  }

  // Tarkastetaan että token on aito
  // True - Pääsy allittu
  // False - Nginx ohjaa kirjautumissivulle
  try {
    const verified = jwt.verify(token, secretKey);
    res.status(200).send("OK"); // On kirjautunut => eteenpäin
  } catch (err) {
    // Ota koppi jos ei ole
    res.status(401).send("Invalid Token"); // Ei ole kirjautunut => kirjautumis sivuille
  }
});

//6. Reitit

// Etusivu ohjataan kirjautumisee
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Kirjautumissivu
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Rekisteröitymissivu
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

//7. Palvelimen käynnistäminen
const PORT = 3000; //portti

app.listen(PORT, () => {
  console.log(`Identify-kontti käynnissä portissa ${PORT}`);
  console.log(`Kokeile osoitetta: http://localhost:${PORT}/login`);
});
