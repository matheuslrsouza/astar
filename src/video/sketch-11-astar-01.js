/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var renderers;

var mapGrid;
var astar;
var markerStart;
var markerGoal;

var config = {
    map5: { map: 'map5-1.json', start: [0, 0], goal: [4, 4] }
}

var imgEquations = {file: '', width: 950, height: 482};
var curConfig = 'map5';
var fontRockwellBold;
var current;
var heuristic;
var heuristicShape;
var overlays;

var slide = 0;


function preload() {
    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);
    loadJSON('../astar/map5-heuristic.json', (data) => heuristic = data);

    fontRockwellBold = loadFont('../../assets/fonts/rockwell-bold.ttf');

    imgEquations.file = loadImage('../../assets/equations.png');
}

var size = 500;
function setup() {
    createCanvas(1600, 900);

    var mapConfig = config[curConfig];

    // x, y
    var start = mapConfig.start;
    var goal = mapConfig.goal;
    
    var cellSize = size / mapGrid.length;

    astar = new AStarInteractive(mapGrid, start, goal, cellSize, true, heuristic);

    current = new Current(getPixelByCell(start[0], start[1]), 30, 10);

    markerStart = new Marker(getPixelByCell(start[0], start[1]), true);
    markerStart.show();

    markerGoal = new Marker(getPixelByCell(goal[0], goal[1]), false);
    markerGoal.show();

    heuristicShape = new Heuristic(heuristic, cellSize, 8);
    overlays = [
        new Overlay(createVector(0, 0)), 
        new Overlay(createVector(0, 88)), 
        new Overlay(createVector(0, 180))
    ];

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

    if (slide == 1) {
        overlays[0].hide();
    }
    if (slide == 2) {
        overlays[1].hide();
    }
    if (slide == 4) {
        heuristicShape.numbers[0].show();
    }
    if (slide == 5) {
        heuristicShape.showAllNumbers();        
    }
    if (slide == 6) {
        // highlight on h(0, 0)
        heuristicShape.highlight(0, 0);
    }
    if (slide == 7) {
        // highlight on h(4, 1)
        heuristicShape.highlight(4, 1);
    }
    if (slide == 8) {
        overlays[2].hide();
    }
    if (slide == 9) {
        // move to the last region
        let space = width / 3;
        heuristicShape.moveTo(createVector(space, 0));
    }
}

function draw() {
    background(0);

    _drawTexts();

    let region = 0;
    let space = width / 3;

    // draw equations
    push();
    translate(space * region, 200);
    _drawEquations(space);
    pop();

    // draw heuristic grid
    region = 1;
    if (slide >= 3) {
        push();
        translate(space * region, 200);
        heuristicShape.draw();
        pop();
    }

    translate(space * region, 200);

    if (slide >= 9 && !heuristicShape.moving) {
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
            circle(canvaX, canvaY, 15);

            if (cell.f > 0) {
                textSize(20);
                let y = canvaY + 40;
                fill(255, 241, 84);
                text(cell.f + ' = ', cell.f < 10 ? canvaX-40 : canvaX-50, y);
                fill(255);
                text(cell.g + ' + ', canvaX-8, y);
                fill(245, 153, 153);
                text(cell.h, canvaX + 24, y);
            }

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
    var x = (width - 100) / 2;

    textFont(fontRockwellBold);
    textSize(txtSize);
    fill([255, 222, 89]);
    text('A*', x, 100);
    pop();
}

function _drawEquations(space) {
    let xOffset = 20;
    let newWidth = space - xOffset * 2;
    image(imgEquations.file, xOffset, 0, newWidth, (newWidth / imgEquations.width) * imgEquations.height);

    overlays.forEach(o => {
        o.draw();
    });
}

class Overlay {

    constructor(pos) {
        this.pos = pos;
        this.visible = true;
        this.alpha = 255;
    }

    draw() {
        if (!this.visible && this.alpha > 0) {
            this.alpha -= 5;
        }
        push();
        fill(0, 0, 0, this.alpha);
        noStroke();
        rect(this.pos.x, this.pos.y, 520, 80);
        pop();
    }

    hide() {
        this.visible = false;
    }

}