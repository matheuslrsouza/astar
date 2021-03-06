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
    mapRyu: { map: 'map-ryu.json', start: [7, 40], goal: [80, 50] },
    mapWalter: { map: 'map-walter.json', start: [7, 40], goal: [80, 50] },
    mapDarth: { map: 'map-darth.json', start: [7, 40], goal: [80, 50] }
}

var curConfig = 'map6';

var fontRockwellBold;

var current;

function preload() {
    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);

    fontRockwellBold = loadFont('../../assets/fonts/rockwell-bold.ttf');
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

    if (startSearch && frameCount % 2 == 0 && !astar.goalCell) {
        astar.next();
        current.moveTo(getPixelByCell(astar.current.x, astar.current.y));
    }

    //_drawTexts();

    translate((width - astar.cellSize * mapGrid[0].length) / 2, 50);

    renderers.forEach(renderer => {
        if (renderer instanceof DirectionsRenderer) {
            if (current.endPos == current.pos) {
                renderer.render();
            }
        } else {
            renderer.render();
        }
    });

    current.draw();

    astar.cells.forEach((cell) => {
        var canvaX = cell.x * astar.cellSize + astar.cellSize / 2;
        var canvaY = cell.y * astar.cellSize + astar.cellSize / 2;

        push();
        if (cell.expanded) {
            fill(colors.cost.expanded);
        } else {
            fill(255);
        }
        circle(canvaX, canvaY, 10);

        pop();    
    });

    // on complete

    if (astar.goalCell) {
        push();
        stroke(0, 255, 0, 200);
        strokeWeight(8);
        var cell = astar.goalCell;
        while (cell.previous != undefined) {            
            var canvaX1 = cell.x * astar.cellSize + astar.cellSize / 2;
            var canvaY1 = cell.y * astar.cellSize + astar.cellSize / 2;
            var canvaX2 = cell.previous.x * astar.cellSize + astar.cellSize / 2;
            var canvaY2 = cell.previous.y * astar.cellSize + astar.cellSize / 2;
            line(canvaX1, canvaY1, canvaX2, canvaY2);
            cell = cell.previous;
        }
        pop();
    }

    markerStart.draw();
    markerGoal.draw();
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