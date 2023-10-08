const fs = require("fs");

function readDataFile() {
    try {
        const data = fs.readFileSync("./dataManager/log.json", "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading data file:", err);
        return [];
    }
}

let log = readDataFile();
let lastId = log.length;


function newLog(name, message) {
    const timestamp = currentTime();
    log.push({ id: lastId++, name, message, timestamp});
    save();
}

function readLog() {
    return log;
}

function searchByLogId(id) {
    return log.find(data => data.id == id);
}


function save() {
    const dataToSave = JSON.stringify(log, null, 2);
    try {
        fs.writeFileSync("./dataManager/log.json", dataToSave);
    } catch (err) {
        
    }
}

function currentTime() {
    const now = new Date();
  
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

module.exports =  {
    newLog,
    readLog
}
