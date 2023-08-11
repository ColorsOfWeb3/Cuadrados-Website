function base64ToJSON(base64Data) {
    const encodedData = base64Data.replace('data:application/json;base64,', '');
    const jsonData = atob(encodedData);
    const JSONData = JSON.parse(jsonData);
    return JSONData;
}

function getColor(JSONData) {
    const colorAttribute = JSONData.attributes.find(attr => attr.trait_type === "Color");
    return colorAttribute ? colorAttribute.value : "#FF0000";
}

module.exports = {
    base64ToJSON,
    getColor
}