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
    map5: { map: 'map5.json', start: [0, 0], goal: [4,5] }
}

var curConfig = 'map5';

var fontRockwellBold;

var current;

function preload() {
    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);

    fontRockwellBold = loadFont('../../assets/fonts/rockwell-bold.ttf');
}

var size = 700;
function setup() {
    createCanvas(1600, 900);

    var mapConfig = config[curConfig];

    // x, y
    var start = mapConfig.start;
    var goal = mapConfig.goal;
    
    var cellSize = size / mapGrid.length;

    astar = new AStarInteractive(mapGrid, start, goal, cellSize, true);

    current = new Current(getPixelByCell(start[0], start[1]), 40, 10);

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

    push();
    current.expandeds.forEach((expanded) => {
        fill(colors.cost.expanded);
        circle(expanded.x, expanded.y, 10);
    });
    pop();

    current.draw();

    markerStart.draw();
    markerGoal.draw();
}

function getPixelByCell(x, y) {
    return createVector(
        x * astar.cellSize + astar.cellSize / 2, 
        y * astar.cellSize + astar.cellSize / 2
    );
}