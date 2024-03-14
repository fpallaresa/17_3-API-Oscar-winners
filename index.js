const express = require("express");
const fs = require("fs");

const PORT = 3000;
const server = express();
const router = express.Router();
const driversFilesPath = "./drivers.json";

// Configuración del server
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  // Leemos el fichero index.html
  fs.readFile("./templates/index.html", "utf-8", (error, data) => {
    if (error) {
      res.status(500).send("Error al leer el archivo");
    } else {
      res.set("Content-Type", "text/html");
      res.send(data);
    }
  });
});

router.get("/f1-driver", (req, res) => {
  fs.readFile(driversFilesPath, (error, data) => {
    if (error) {
      res.status(500).send("Error inesperado");
    } else {
      const drivers = JSON.parse(data);
      res.json(drivers);
    }
  });
});

router.post("/f1-driver", (req, res) => {
  // Leemos el fichero drivers
  fs.readFile(driversFilesPath, (error, data) => {
    if (error) {
      res.status(500).send("Error inesperado");
    } else {
      const drivers = JSON.parse(data);
      const newDriver = req.body;
      const lastId = drivers[drivers.length - 1].id;
      newDriver.id = lastId + 1;
      drivers.push(newDriver);

      // Guardamos fichero
      fs.writeFile(driversFilesPath, JSON.stringify(drivers), (error) => {
        if (error) {
          res.status(500).send("Error inesperado");
        } else {
          res.json(newDriver);
        }
      });
    }
  });
});

router.get("/f1-driver/:id", (req, res) => {
  fs.readFile(driversFilesPath, (error, data) => {
    if (error) {
      res.status(500).send("Error inesperado");
    } else {
      const id = parseInt(req.params.id);
      const drivers = JSON.parse(data);
      const driver = drivers.find((driver) => driver.id === id);

      if (driver) {
        res.json(driver);
      } else {
        res.status(404).send("Pokemon con encontrado.");
      }
    }
  });
});

server.use("/", router);

server.listen(PORT, () => {
  console.log(`Servidor está levantado y escuchando en el puerto ${PORT}`);
});
