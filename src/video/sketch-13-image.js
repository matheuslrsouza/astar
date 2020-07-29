/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var renderers;

var mapGrid;
var astar;
var markerStart;
var markerGoal;

var config = {
    map1: { map: 'map1.json', start: [0, 0], goal: [4, 4] }, 
    map2: { map: 'map2.json', start: [0, 0], goal: [11, 4] }, 
    map3: { map: 'map3.json', start: [0, 0], goal: [3, 5] },
    map4: { map: 'map4.json', start: [0, 0], goal: [30, 5] },
    map6: { map: 'map6.json', start: [0, 0], goal: [29, 2] }, 
    mapWalter: { map: 'map-walter.json', start: [7, 40], goal: [80, 50] },
    mapDarth: { map: 'map-darth.json', start: [7, 40], goal: [80, 50] }
}

var curConfig = 'mapDarth';

var fontRockwellBold;

var current;

let imgDarth;

function preload() {
    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);
    imgDarth = loadImage('../../assets/darth.bmp');
}

var size = 800;
function setup() {
    createCanvas(1600, 900);

    var mapConfig = config[curConfig];

    // x, y
    var start = mapConfig.start;
    var goal = mapConfig.goal;
    
    var cellSize = size / mapGrid.length;

    astar = new AStarInteractive(mapGrid, start, goal, cellSize, true);

    current = new Current(getPixelByCell(start[0], start[1]), 20, 5);

    markerStart = new Marker(getPixelByCell(start[0], start[1]), true);
    markerStart.show();

    markerGoal = new Marker(getPixelByCell(goal[0], goal[1]), false);
    markerGoal.show();

    renderers = [
        new GridRenderer(mapGrid, cellSize), 
        new DirectionsRenderer(astar)
    ];    
}

let startSearch = false;

function mousePressed() {
    startSearch = true;
}

function draw() {
    background(0);

    //_drawTexts();

    translate((width - astar.cellSize * mapGrid[0].length) / 2, 50);

    image(imgDarth, 0, 0, size, astar.cellSize * mapGrid[0].length);
}

function getPixelByCell(x, y) {
    return createVector(
        x * astar.cellSize + astar.cellSize / 2, 
        y * astar.cellSize + astar.cellSize / 2
    );
}

function _drawTexts() {
    push();
    noStroke();
    
    var txtSize = 80;
    var x = (width - txtSize) / 2;

    textFont(fontRockwellBold);
    textSize(txtSize);
    fill([255, 222, 89]);
    text('A*', x, 80);
    pop();
}