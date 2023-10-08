const express = require("express");
const { read, searchByTokenId } = require("./dataManager/dataManager.js")
const { initDataManager, updateDataInBatch } = require("./manager");

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
global.io = io;


app.use(express.static(__dirname));

app.get("/", (req, res) => {

    res.render("index.html");

});

app.get("/data", (req, res) => {

    let data = {};

    if (Object.keys(req.query).length == 0) {
        data = read();
    } else {
        const id = req.query.id;
        data = searchByTokenId(id);
    }

    res.json(data);

});

updateDataInBatch(0, 1225);
initDataManager();

server.listen(process.env.PORT || 3000, () => console.log(`App available on http://localhost:3000`))