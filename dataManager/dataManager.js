const fs = require("fs");

function readDataFile() {
    try {
        const data = fs.readFileSync("./dataManager/data.json", "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading data file:", err);
        return [];
    }
}

let database = readDataFile();


function create(tokenId, color, owner, transaction) {
    database.push({ tokenId, color, owner, transaction });
    save(tokenId, color);
}

function read() {
    return database;
}

function searchByTokenId(tokenId) {
    return database.find(data => data.tokenId == tokenId);
}

function update(tokenId, color, owner, transaction) {
    const index = database.findIndex(data => data.tokenId == tokenId);
    if (index !== -1) {
        database[index].color = color;
        database[index].owner = owner;
        database[index].transaction = transaction;
        save(tokenId, color);
    }
}

function remove(tokenId) {
    database = database.filter(user => user.tokenId != tokenId);
    save(tokenId, "dcdde1");
}


function save(tokenId, color) {
    const dataToSave = JSON.stringify(database, null, 2);
    try {
        fs.writeFileSync("./dataManager/data.json", dataToSave);
        global.io.emit("tokenUpdated", {id: tokenId, color: color});
    } catch (err) {
        console.error("Error saving data to file:", err);
    }
}

module.exports =  {
    create,
    read,
    searchByTokenId,
    update,
    remove
}
