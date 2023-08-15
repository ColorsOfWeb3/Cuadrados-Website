import { mint } from "./contract.js";

const socket = io();
let data = {};

const supply = 1225;
const dafaultColor = "95A5A6";

function initSVG(totalItems) {
    const gridDiv = document.querySelector(".grid");
    for (let i = 0; i < totalItems; i++) {
        const svgImage = createSVG(i);
        gridDiv.appendChild(svgImage);
    }
}

function createSVG(id) {
    const data = getElementData(id);

    const svgNS = "http://www.w3.org/2000/svg";
    const viewBox = "0 0 100 100";
    const rectWidth = "100%";
    const rectHeight = "100%";
    let color = data ? data.color : dafaultColor;

    const container = document.createElement("div");
    container.classList = "svg-container"

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("id", id);

    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("width", rectWidth);
    rect.setAttribute("height", rectHeight);
    rect.setAttribute("fill", `#${color}`);

    svg.appendChild(rect);

    const tooltip = document.createElement("div");
    tooltip.classList = "svg-tooltip";
    tooltip.textContent = color;

    container.appendChild(svg);
    container.appendChild(tooltip);

    svg.addEventListener("click", async function () {
        const id = this.getAttribute("id");
        mint(id);
    });

    return container;
}

function updateSVG(id, color) {
    const svgElement = document.getElementById(id);
    svgElement.querySelector("rect").setAttribute("fill", `#${color}`);
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

function getElementData(id) {
    const result = data.find(data => data.tokenId == id);
    return result;
}

socket.on('update', data => {
    updateSVG(data.id, data.color)
});

document.addEventListener("DOMContentLoaded", async function () {
    data = await getData();
    updateElementSize();
    initSVG(supply)
});

function updateElementSize() {
    const gapRatio = 0.2;
    const padding = 20;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const vw = (windowWidth - padding) * (1 - gapRatio);
    const vh = (windowHeight - padding) * (1 - gapRatio);

    
    let area = vw * vh;
    let squareArea = area / supply;
    let width = Math.sqrt(squareArea);

    let nw = vw / width;
    let nh = vh / width;

    const gapW = (windowWidth * gapRatio) / nw;
    const gapH = (windowHeight * gapRatio) / nh;

    const gap = Math.min(gapW, gapH)

    const result = width - ((width + gap) / Math.max(nw, nh));

    const element = document.getElementById('grid');
    element.style.gridTemplateColumns = `repeat(auto-fit, ${result}px)`;
    element.style.gridAutoRows = `${result}px`;
    element.style.gap = `${gap}px`
}

window.addEventListener('resize', updateElementSize);