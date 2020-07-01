import express = require('express')
import path = require('path')
import ejs = require('ejs')
import lru = require('lru-cache')

const app = express()

app.set("views", path.join(__dirname, "/views"));


app.use(express.static(path.join(__dirname, "/public"), {
	cacheControl: true,
	etag: false,
	maxAge: "30d"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

ejs.cache = lru(200);

app.set("view engine", "ejs");
app.use(require("express-ejs-layouts"));


app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
	res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
	res.header("Expires", "-1");
	res.header("Pragma", "no-cache");
	next();
});

app.use('/', require('./routes/home'))

 const porta = (parseInt(process.env.PORT) || 3000)

app.listen(porta, () => {
	console.log("Executando servidor na porta " + porta);
});

