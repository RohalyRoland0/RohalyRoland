const express = require("express");
const app = express();
const mysql = require("mysql2");
const port = 3000;
 
app.use(express.json());
 
app.listen(port, () => {
    console.log(`A szerver ${port}-as porton fut.`);
})
 
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "szerviz_db",
    port: 3307
});
 
connection.connect((err) => {
    if (err) {
      console.error("Hiba", err);
      return;
    }
    console.log("Siker");
  });
 
app.get('/api/szolgaltatasok', (req, res) => {
    connection.query(
        'SELECT * FROM `szolgaltatasok` ORDER BY alapar ASC',
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
});

app.get('/api/szolgaltatasok/elerheto', (req, res) => {
    connection.query(
        'SELECT * FROM `szolgaltatasok` WHERE aktiv = 1 AND munkaido_perc >= 60',
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
});

app.get('/api/szolgaltatasok/kereses/:szoveg', (req, res) => {
    const szoveg = req.params.szoveg
    connection.query(
        'SELECT * FROM `szolgaltatasok` WHERE megnevezes LIKE ?',
        [`%${szoveg}%`],
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
});

app.get('/api/kategoriak/statisztika', (req, res) => {
    connection.query(
        'SELECT nev, id AS szolgaltatasok_szama, AVG alapar AS atalgos_alapar FROM kategoriak INNER JOIN szolgaltatasok ON kategoriak.id = szolgaltatasok.kategoria_id',
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
});

app.get('/api/szolgaltatasok/dragak', (req, res) => {
    connection.query(
        'SELECT megnevezes, alapar, munkaido_perc FROM szolgaltatasok WHERE alapar > 25000 ORDER BY munkaido_perc DESC',
        (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(results);
        }
    );
});