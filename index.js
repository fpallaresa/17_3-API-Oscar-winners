const express = require("express");
const fs = require("fs");

const PORT = 3000;
const server = express();
const router = express.Router();
const oscarsFilesPath = "./data/";

// Configuración del server
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  fs.readFile("./templates/index.html", "utf-8", (error, data) => {
    if (error) {
      res.status(500).send("Error al leer el archivo");
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.send(data);
    }
  });
});

router.get("/oscars", (req, res) => {
  fs.readdir(oscarsFilesPath, (error, files) => {
    if (error) {
      res.status(500).send("Error inesperado");
    }
    const yearList = files.map((file) => file.replace(".json", "").replace("oscars-", ""));
    res.json({ years: yearList });
  });
});

router.get("/oscars/:year", (req, res) => {
  const year = req.params.year;
  const yearFilePath = oscarsFilesPath + `oscars-${year}.json`;

  fs.readFile(yearFilePath, (error, data) => {
    if (error) {
      res.status(404).send("Página no encontrada.");
    } else {
      try {
        res.statusCode = 200;
        const yearData = JSON.parse(data);
        res.setHeader("Content-Type", "application/json", "charset=UTF-8");
        res.json({ yearData });
      } catch {
        res.status(500).send("Error inesperado");
      }
    }
  });
});

router.post("/oscars/:year", (req, res) => {
  const year = req.params.year;
  const yearFilePath = oscarsFilesPath + `oscars-${year}.json`;

  fs.readFile(yearFilePath, (error, data) => {
    if (error) {
      const newOscarData = [req.body];

      fs.writeFile(yearFilePath, JSON.stringify(newOscarData), (error) => {
        if (error) {
          res.status(500);
          res.send("Error inesperado");
        }
        res.status(200);
        res.json(newOscarData);
      });
    } else {
      try {
        const oscarData = JSON.parse(data);
        oscarData.push(req.body);

        fs.writeFile(yearFilePath, JSON.stringify(oscarData), (error) => {
          if (error) {
            res.status(500);
            res.send("Error inesperado");
          }
          res.status(200);
          res.json(oscarData);
        });
      } catch {
        res.status(500);
        res.send("Error inesperado");
      }
    }
  });
});

router.get("/winners-multiple/:year", (req, res) => {
  const year = req.params.year;
  const yearFilePath = oscarsFilesPath + `oscars-${year}.json`;

  fs.readFile(yearFilePath, (error, data) => {
    if (error) {
      res.status(500).send("Error inesperado");
    } else {
      try {
        const oscarData = JSON.parse(data);
        const multipleWinners = oscarData.reduce((acc, curr) => {
          const existingWinnerIndex = acc.findIndex((winner) => winner.name === curr.entity);

          if (existingWinnerIndex === -1) {
            acc.push({ name: curr.entity, awards: [{ category: curr.category, year }] });
          } else {
            acc[existingWinnerIndex].awards.push({ category: curr.category, year });
          }

          return acc;
        }, []);
        const winnersWithMultipleAwards = multipleWinners.filter((winner) => winner.awards.length > 1);
        res.json({ winners: winnersWithMultipleAwards });
      } catch {
        res.status(500).send("Error inesperado");
      }
    }
  });
});

server.use("/", router);

server.listen(PORT, () => {
  console.log(`Servidor está levantado y escuchando en el puerto ${PORT}`);
});
