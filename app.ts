import express = require('express')
import path = require('path')

const app = express()

app.get("/", (req, res) =>
 res.sendFile(path.join(__dirname, "/index.html")))

 const porta = (parseInt(process.env.PORT) || 3000)

app.listen(porta, () => {
	console.log("Executando servidor na porta " + porta);
});
