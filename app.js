import { web3modal, WagmiCore, mint } from "./contract.js";

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
    container.setAttribute("id", id);

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttribute("viewBox", viewBox);

    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("width", rectWidth);
    rect.setAttribute("height", rectHeight);
    rect.setAttribute("fill", `#${color}`);

    svg.appendChild(rect);

    const tooltip = document.createElement("div");
    tooltip.classList = "svg-tooltip";
    tooltip.textContent = color == dafaultColor ? "mint" : color;

    container.appendChild(svg);
    container.appendChild(tooltip);

    container.addEventListener("click", async function () {
        const id = this.getAttribute("id");
        mint(id);
    });

    return container;
}

function updateSVG(data) {
    const svgElement = document.getElementById(data.id);
    svgElement.querySelector("rect").setAttribute("fill", `#${data.color}`);
    svgElement.querySelector("div").textContent = data.color;
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

    return data;

}

function getElementData(id) {
    const result = data.find(data => data.tokenId == id);
    return result;
}

socket.on('update', data => {
    updateSVG(data);
});

document.addEventListener("DOMContentLoaded", async function () {
    data = await getData();
    updateElementSize();
    initSVG(supply);
    const account = WagmiCore.getAccount();
    console.log(account.address);
    const button = document.getElementById('connect');
    if (account.address) {
        button.innerHTML = "Connected";
        button.style.backgroundColor = "#3498DB";
    } else {
        web3modal.openModal();
        button.style.backgroundColor = "#1ABC9C";
    }
});

document.getElementById('connect').addEventListener('click', () => {
    web3modal.openModal()
})

web3modal.subscribeModal(newState => {
    const account = WagmiCore.getAccount();
    const button = document.getElementById('connect');
    if (account.address) {
        button.innerHTML = "Connected";
        button.style.backgroundColor = "#3498DB";
    } else {
        button.innerHTML = "Connect";
        button.style.backgroundColor = "#1ABC9C";
    }
})

function updateElementSize() {
    const gapRatio = 0.2;
    const widthPnM = 20;
    const heightPnM = 20;
    const heightRatio = 0.94;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight * heightRatio;

    const vw = (windowWidth - widthPnM) * (1 - gapRatio);
    const vh = (windowHeight - heightPnM) * (1 - gapRatio);


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