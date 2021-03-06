/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var renderers;

var mapGrid;
var astar;
var markerStart;
var markerGoal;
var slide = 0;

var config = {
    map1: { map: 'map1.json', start: [0, 0], goal: [4, 4] }, 
    map2: { map: 'map2.json', start: [0, 0], goal: [11, 4] }, 
    map3: { map: 'map3.json', start: [0, 0], goal: [3, 5] },
    map4: { map: 'map4.json', start: [0, 0], goal: [30, 5] },
    map5: { map: 'map5.json', start: [0, 0], goal: [4, 5] }
}

var curConfig = 'map5';

var fontRockwellBold;

var texts;

function preload() {
    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);

    //fontRockwellBold = loadFont('../../assets/fonts/rockwell.otf');
    fontRockwellBold = loadFont('../../assets/fonts/rockwell-bold.ttf');
}

var size = 700;
function setup() {
    createCanvas(1600, 900);

    var mapConfig = config[curConfig];

    // x, y
    var start = mapConfig.start;
    var goal = mapConfig.goal;
    
    var margin = 0;
    var cellSize = (size-margin) / mapGrid.length;

    astar = new AStarInteractive(mapGrid, start, goal, cellSize, true);

    markerStart = new Marker(getPixelByCell(start[0], start[1]), true);
    markerStart.show();

    markerGoal = new Marker(getPixelByCell(goal[0], goal[1]), false);
    markerGoal.show();

    renderers = [
        new GridRenderer(mapGrid, cellSize), 
        new DirectionsRenderer(astar)
    ];

    var yItemText = 120;
    var ySpace = 100;

    texts = [
        new ItemText('Kalman Filter', 80, yItemText), 
        new ItemText('Particle Filter', 80, yItemText + ySpace)
    ];
}

function draw() {
    background(0);

    _drawTexts();

    translate((width - size) / 2, 100);

    renderers.forEach(renderer => {
        renderer.render();
    });

    astar.cells.forEach((cell) => {
        var canvaX = cell.x * astar.cellSize + astar.cellSize / 2;
        var canvaY = cell.y * astar.cellSize + astar.cellSize / 2;

        push();
        if (cell.expanded) {
            fill(colors.cost.expanded);
        } else {
            fill(255);
        }

        pop();    
    });

    if (slide >= 1 && slide < 5) {
        markerStart.draw();
    }

    if (slide >= 2 && slide < 5) {
        markerGoal.draw();
    }

}

function _drawTexts() {
    texts.forEach(t => {
        t.render();
    });
}

function getPixelByCell(x, y) {
    return createVector(
        x * astar.cellSize + astar.cellSize / 2, 
        y * astar.cellSize + astar.cellSize / 2
    );
}


function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        slide++;
    }

    if (keyCode === LEFT_ARROW) {
        slide--;
    }

    if (slide == 3) {
        texts[0].show();
    }

    if (slide == 4) {
        texts[1].show();
    }
}