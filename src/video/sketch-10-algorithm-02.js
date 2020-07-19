/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var renderers;

var mapGrid;
var astar;
var markerStart;
var markerGoal;

var config = {
    map5: { map: 'map5.json', start: [0, 0], goal: [4, 5] }
}

var curConfig = 'map5';

var fontRockwellBold;

function preload() {
    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);

    fontRockwellBold = loadFont('../../assets/fonts/rockwell-bold.ttf');
}

var size = 700;

var current;

var slide = 0;

function setup() {
    createCanvas(1600, 900);

    var mapConfig = config[curConfig];

    // x, y
    var start = mapConfig.start;
    var goal = mapConfig.goal;
    
    var cellSize = size / mapGrid.length;

    astar = new AStarInteractive(mapGrid, start, goal, cellSize, false);

    current = new Current(getPixelByCell(start[0], start[1]), 30, 10);

    markerStart = new Marker(getPixelByCell(start[0], start[1]), true);
    markerStart.show();

    markerGoal = new Marker(getPixelByCell(goal[0], goal[1]), false);
    markerGoal.show();

    renderers = [
        new GridRenderer(mapGrid, cellSize), 
        new DirectionsRenderer(astar)
    ];    
}

function mousePressed() {
    astar.next();
    current.moveTo(getPixelByCell(astar.current.x, astar.current.y));    
}

function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        slide++;
    }

    if (keyCode === LEFT_ARROW) {
        slide--;
    }
}

function draw() {
    background(0);

    translate((width - size) / 2, 100);

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
        // if (cell.expanded) {
        //     fill(colors.cost.expanded);
        // } else {
        //     fill(255);
        // }
        // circle(canvaX, canvaY, 10);

        stroke(255);
        strokeWeight(2);
        fill(255);
        textSize(int(astar.cellSize/4));
        text(cell.g, 
            cell.x * astar.cellSize + astar.cellSize - int(astar.cellSize/4) - 5, 
            cell.y * astar.cellSize + astar.cellSize - int(astar.cellSize/4));

        pop();    
    });

    // on complete

    if (astar.goalCell && slide == 1) {
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