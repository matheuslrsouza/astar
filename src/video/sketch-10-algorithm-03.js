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

var texts;

function setup() {
    createCanvas(1600, 900);

    var mapConfig = config[curConfig];

    // x, y
    var start = mapConfig.start;
    var goal = mapConfig.goal;
    
    var cellSize = size / mapGrid.length;

    astar = new AStarInteractive(mapGrid, start, goal, cellSize, false);

    current = new Current(getPixelByCell(start[0], start[1]), 40, 10);

    markerStart = new Marker(getPixelByCell(start[0], start[1]), true);
    markerStart.show();

    markerGoal = new Marker(getPixelByCell(goal[0], goal[1]), false);
    markerGoal.show();

    renderers = [
        new GridRenderer(mapGrid, cellSize), 
        new DirectionsRenderer(astar)
    ];

    var yItemText = 130;
    var ySpace = 70;

    texts = [
        new ItemText('Abertas', 1000, yItemText, [255, 255, 255]), 
        new ItemText('Expandidas', 1000, yItemText + ySpace, [229, 129, 131])
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

    if (slide == 1) {
        texts[0].show();
    }

    if (slide == 2) {
        texts[1].show();
    }
}

function draw() {
    background(0);

    _drawTexts();

    translate((width - size) / 4, 100);

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
        if (slide >= 5) {
            if (cell.expanded) {
                fill(colors.cost.expanded);
            } else {
                fill(255);
            }
            circle(canvaX, canvaY, 20);
        }

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
    texts.forEach(t => {
        t.render();
    });

    push();
    noStroke();
    
    // show open
    if (slide >= 3) {
        let x = texts[0].x + 300;
        let y = texts[0].y - 10;
        fill(255);
        circle(x, y, 20);
    }

    // show expanded
    if (slide >= 4) {
        let x = texts[1].x + 300;
        let y = texts[1].y - 10;
        fill(colors.cost.expanded);
        circle(x, y, 20);
    }
    pop();
}