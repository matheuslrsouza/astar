/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var renderers;

var mapGrid;
var astar;

var config = {
    map: { map: 'map-actions.json' }
}

var curConfig = 'map';

var fontRockwellBold;

var route = [
    [1,1], 
    [1,0], 
    [1,1], 
    [0,1],
    [1,1]
];

var routeIndex = 0;

var current;

function preload() {
    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);

    fontRockwellBold = loadFont('../../assets/fonts/rockwell-bold.ttf');
}

var size = 700;

function setup() {
    createCanvas(1600, 900);

    
    
    var cellSize = size / mapGrid[0].length;
    astar = new AStarInteractive(mapGrid, route[0], [0,0], cellSize, false);

    current = new Current(
        getPixelByCell(route[routeIndex][0], route[routeIndex][1]), 80, 15);

    renderers = [
        new GridRenderer(mapGrid, cellSize)
    ];
}

function mousePressed() {
    routeIndex++;
    current.moveTo(getPixelByCell(route[routeIndex][0], route[routeIndex][1]));
}

function draw() {
    background(0);

    //_drawTexts();

    translate((width - size) / 2, 100);

    renderers.forEach(renderer => {
        renderer.render();
    });

    // current
    var canvaX = route[routeIndex][0] * astar.cellSize + astar.cellSize / 2;
    var canvaY = route[routeIndex][1] * astar.cellSize + astar.cellSize / 2;
    
    current.draw();
}

function getPixelByCell(x, y) {
    return createVector(
        x * astar.cellSize + astar.cellSize / 2, 
        y * astar.cellSize + astar.cellSize / 2
    );
}