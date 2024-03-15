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
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json", "charset=UTF-8");
      const years = extractYears(files);
      res.json({ years });
    }
  });
});

function extractYears(files) {
  const yearsSet = [];

  files.forEach((file) => {
    const startIndex = file.indexOf("oscars-") + 7; // +7 porqué oscars- tiene 7 caracteres
    const year = file.substring(startIndex, startIndex + 4); // subtring saca los datos de un inicio y un final
    if (!isNaN(year) && year.length === 4) {
      yearsSet.push(year);
    }
  });

  return yearsSet;
}

server.use("/", router);

server.listen(PORT, () => {
  console.log(`Servidor está levantado y escuchando en el puerto ${PORT}`);
});
