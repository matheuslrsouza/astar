/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var renderers;

var mapGrid;
var astar;
var markerStart;
var markerGoal;

var config = {
    map5: { map: 'map5.json', start: [0, 0], goal: [4, 5] }
};

var images = {
    pseudo: {file: '', width: 1460, height: 1458, path: '../../assets/pseudo-code2.png'}
};

var curConfig = 'map5';

var fontRockwellBold;

function preload() {
    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);    

    fontRockwellBold = loadFont('../../assets/fonts/rockwell-bold.ttf');

    images.pseudo.file = loadImage(images.pseudo.path);
}

var size = 700;

var current;

var slide = 0;

var texts;

// just for debug
// toggles between open and expanded
var currentDrawOpen = true;

// debug
var debugLine;
var currentLine = 0;
var lineIndexes = [];
var yInc = 64;
lineIndexes.push({x: 750, y: 143});
lineIndexes.push({x: 750, y: lineIndexes[lineIndexes.length-1].y + yInc});
lineIndexes.push({x: 750, y: lineIndexes[lineIndexes.length-1].y + yInc});
lineIndexes.push({x: 750, y: lineIndexes[lineIndexes.length-1].y + yInc});
lineIndexes.push({x: 750, y: lineIndexes[lineIndexes.length-1].y + yInc});
lineIndexes.push({x: 750, y: lineIndexes[lineIndexes.length-1].y + yInc});
lineIndexes.push({x: 750, y: lineIndexes[lineIndexes.length-1].y + yInc});
lineIndexes.push({x: 750, y: lineIndexes[lineIndexes.length-1].y + yInc});
lineIndexes.push({x: 750, y: lineIndexes[lineIndexes.length-1].y + yInc + 28});

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

    texts[0].show();    
    texts[1].show();

    debugLine = new DebugLine(
        createVector(lineIndexes[0].x, lineIndexes[0].y), 600, 50);
}

let transitionsExpand = 0;
let transitionsOpen = 0;

function mousePressed() {
    if (currentDrawOpen) {

        if (transitionsExpand == 0) {
            transitionsExpand++;
            currentLine = 2;
            debugLine.moveTo(
                createVector(lineIndexes[currentLine].x, lineIndexes[currentLine].y));
        } else if (transitionsExpand == 1) {
            transitionsExpand = 0;
            currentDrawOpen = false;
            astar.expand();
            currentLine = 3;
            debugLine.moveTo(
                createVector(lineIndexes[currentLine].x, lineIndexes[currentLine].y));
        }
        
    } else {
        if (transitionsOpen == 0) {
            transitionsOpen++;
            currentLine = 4;
            debugLine.moveTo(
                createVector(lineIndexes[currentLine].x, lineIndexes[currentLine].y));
        } else if (transitionsOpen == 1) {
            transitionsOpen++;
            if (!astar.isGoalHit()) {
                // send to show the path
                currentLine = 7;
                debugLine.moveTo(
                    createVector(lineIndexes[currentLine].x, lineIndexes[currentLine].y));                
            } else {
                currentLine = 5;
                debugLine.moveTo(
                    createVector(lineIndexes[currentLine].x, lineIndexes[currentLine].y));
            }
        } else if (transitionsOpen == 2) {
            transitionsOpen = 0;
            astar.next2();
            currentDrawOpen = true;
            if (!astar.isGoalHit()) {
                currentLine = 8;
                debugLine.moveTo(
                    createVector(lineIndexes[currentLine].x, lineIndexes[currentLine].y));            
            }
        }
    }
    current.moveTo(getPixelByCell(astar.current.x, astar.current.y));

    console.log(mouseX, mouseY);    
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

    _drawTexts();

    translate((width - size) / 4, 100);

    renderers.forEach(renderer => {
        if (renderer instanceof DirectionsRenderer) {
            if (current.endPos == current.pos && currentDrawOpen) {
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

        if (slide >= 3) {
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

    // draw break point
    if (slide >= 2) {
        push();
        noStroke();
        fill(220, 0, 0);
        circle(730, 170, 15);
        pop();
    }

    _drawPseudoCode();
}

function _drawPseudoCode() {
    debugLine.height = currentLine != 7 ? 50 : 73;

    if (slide < 1) return;

    let newWidth = 580;
    let newHeight = (newWidth / images.pseudo.width) * images.pseudo.height;

    push();
    image(images.pseudo.file, 760, 150, newWidth, newHeight);    

    // draws the debug line
    if (slide >= 3) {
        debugLine.draw();
    }

    pop();
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
    let x = texts[0].x + 300;
    let y = texts[0].y - 10;
    fill(255);
    circle(x, y, 20);

    // show expanded
    x = texts[1].x + 300;
    y = texts[1].y - 10;
    fill(colors.cost.expanded);
    circle(x, y, 20);

    pop();
}