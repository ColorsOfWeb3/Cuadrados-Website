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
    save();
}

function read() {
    return database;
}

function searchByTokenId(tokenId) {
    return database.find(data => data.tokenId == tokenId);
}

function update(tokenId, newColor, newOwner, newTransaction) {
    const index = database.findIndex(data => data.tokenId == tokenId);
    if (index !== -1) {
        database[index].color = newColor;
        database[index].owner = newOwner;
        database[index].transaction = newTransaction;
        save();
    }
}

function remove(tokenId) {
    database = database.filter(user => user.tokenId != tokenId);
    save();
}


function save() {
    const dataToSave = JSON.stringify(database, null, 2);
    fs.writeFileSync("./dataManager/data.json", dataToSave, (err) => {
        if (err) {
            console.error("Error saving data to file:", err);
        }
    });
}

module.exports =  {
    create,
    read,
    searchByTokenId,
    update,
    remove
}
