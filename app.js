import { mint, maxSupply } from "./contract.js";

const socket = io();
let data = {};

let supply = 0;
const colorDefault = "#D6D1D8";

function initSVG(totalItems) {
    const gridDiv = document.querySelector(".grid");
    for (let i = 0; i < totalItems; i++) {
        const svgImage = createSVG(i);
        gridDiv.appendChild(svgImage);
    }
}

function createSVG(id) {
    const svgNS = "http://www.w3.org/2000/svg";
    const viewBox = "0 0 100 100";
    const rectWidth = "100%";
    const rectHeight = "100%";
    let fill = getColor(id);



    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttribute("viewBox", viewBox);

    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("width", rectWidth);
    rect.setAttribute("height", rectHeight);
    rect.setAttribute("fill", fill);
    svg.setAttribute("id", id);

    svg.appendChild(rect);

    svg.addEventListener("click", async function () {
        const id = this.getAttribute("id");
        mint(id);
    });

    return svg;
}

function updateSVG(id, color) {
    const svgElement = document.getElementById(id);
    svgElement.querySelector("rect").setAttribute("fill", `#${color}`);
}

async function getDataById(id) {
    const data = await fetch(`/data?id=${id}`)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    console.log(data);
    return data;

}

async function getData() {
    const data = await fetch("/data")
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    console.log(data);
    return data;

}

function getColor(id) {
    let color = colorDefault
    const result = data.find(data => data.tokenId == id);
    if (result != undefined) color = `#${result.color}`
    return color;
}

socket.on('update', data => {
    updateSVG(data.id, data.color)
});

document.addEventListener("DOMContentLoaded", async function () {
    data = await getData();
    //supply = await maxSupply();
    supply = 999;
    updateElementSize();
    initSVG(supply)
});

function updateElementSize() {
    const vw = window.innerWidth - 40;
    const vh = window.innerHeight - 40;
    const nw = Math.sqrt((vw * supply) / vh)
    const gap = (vw / nw) / 6
    console.log(gap)
    const nh = Math.sqrt((vh * supply) / (vw - (nw * (gap * 2))))
    const result = vh / nh;

    const element = document.getElementById('grid'); // Replace with your element's ID
    element.style.gridTemplateColumns = `repeat(auto-fill, ${result}px)`; // Adjust the property name as needed
    element.style.gridTemplateRows = `repeat(auto-fill, ${result}px)`; // Adjust the property name as needed
    element.style.gap = `${gap}px`
}

window.addEventListener('resize', updateElementSize);