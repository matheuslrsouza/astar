/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var heuristic;
var mapGrid;
var newImgWidth;
var newImgHeight;
var heuristicShape;
var nonHShape;
var ed;
var cellSize;

var config = {
    map5: { map: 'map5-1.json', start: [0, 0], goal: [3, 4] }
}

var curConfig = 'map5';

function preload() {
    images.vs.file = loadImage('../../assets/vs.png');
    images.vsAStar.file = loadImage('../../assets/vs-Astar.png');
    images.vsNonAStar.file = loadImage('../../assets/non-AStar.png');

    images.distance.file = loadImage('../../assets/distance.png');
    images.deltaX.file = loadImage('../../assets/delta_x.png');
    images.deltaY.file = loadImage('../../assets/delta_y.png');

    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);
    loadJSON('../astar/map5-heuristic.json', (data) => heuristic = data);
}


function setup() {
    
    newImgWidth = 600;
    newImgHeight = (newImgWidth / images.vs.width) * images.vs.height;

    cellSize = 90;
    heuristicShape = new Heuristic(heuristic, cellSize, 8, false);
    nonHShape = new Heuristic(heuristic, cellSize, 8, false);

    ed = new EuclideanDistance(getPixelByCell(2, 2), 
        getPixelByCell(4, 4));
    ed.show();
    ed.showEquations();

    createCanvas(1600, 900);
}

function draw() {
    background(0);


    push();
    translate(width/2-newImgWidth/2, height/2 + 100);
    image(images.vs.file, 0, 0, newImgWidth, newImgHeight);

    image(images.vsAStar.file, -200, 40);

    image(images.vsNonAStar.file, newImgWidth/2 + 300, 40);
    pop();

    push();
    translate(100, 100);        
    heuristicShape.draw();
    ed.draw();
    pop();

    push();
    translate(1040, 100);        
    nonHShape.draw();
    pop();
}

function mousePressed() {
    console.log(mouseX, mouseY);    
}

function getPixelByCell(x, y) {
    return createVector(
        x * cellSize + cellSize / 2, 
        y * cellSize + cellSize / 2
    );
}

