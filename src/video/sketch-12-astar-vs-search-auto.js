/// <reference path="../../node_modules/@types/p5/global.d.ts" />


var mapGrid;

var astarWithHeuristic;
var currentWithHeuristic;
var renderers;
var markerStart;
var markerGoal;

var nonAStar;
var currentNonAStar;
var nonAstarRenderers;

var stopwatch;

var config = {
    map1: { map: 'map1.json', start: [0, 0], goal: [4, 4], circleSize: 18, current: {size: 40,stroke: 10}}, 
    map2: { map: 'map2.json', start: [0, 0], goal: [11, 4], circleSize: 12, current: {size: 25,stroke: 5}}, 
    map3: { map: 'map3.json', start: [0, 0], goal: [3, 5], circleSize: 15, current: {size: 40,stroke: 10}},
    map4: { map: 'map4.json', start: [0, 0], goal: [30, 5], circleSize: 8, current: {size: 20,stroke: 5}},
    map6: { map: 'map6.json', start: [0, 0], goal: [29, 2], circleSize: 10, current: {size: 20,stroke: 5}},
    mapRyu: { map: 'map-ryu.json', start: [10, 69], goal: [55, 27], circleSize: 5, current: {size: 10,stroke: 3}}
}

var curConfig = 'mapRyu';

var fontRockwellBold;


function preload() {
    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);

    images.vsAStar.file = loadImage('../../assets/vs-Astar.png');
    images.vsNonAStar.file = loadImage('../../assets/non-AStar.png');

    fontRockwellBold = loadFont('../../assets/fonts/rockwell.otf');
}

var size = 600;
function setup() {
    createCanvas(1600, 900);

    var mapConfig = config[curConfig];

    // x, y
    var start = mapConfig.start;
    var goal = mapConfig.goal;
    
    var cellSize = size / mapGrid.length;

    astarWithHeuristic = new AStarInteractive(mapGrid, start, goal, cellSize, true);
    currentWithHeuristic = new Current(getPixelByCell(start[0], start[1]),
        mapConfig.current.size, mapConfig.current.stroke);
    
    markerStart = new Marker(getPixelByCell(start[0], start[1]), true);
    markerStart.show();
    
    markerGoal = new Marker(getPixelByCell(goal[0], goal[1]), false);
    markerGoal.show();
    
    renderers = [
        new GridRenderer(mapGrid, cellSize), 
        new DirectionsRenderer(astarWithHeuristic)
    ];

    
    // without heuristic
    nonAStar = new AStarInteractive(mapGrid, start, goal, cellSize, false);
    currentNonAStar = new Current(getPixelByCell(start[0], start[1]),
        mapConfig.current.size, mapConfig.current.stroke);
    
    nonAstarRenderers = [
        new GridRenderer(mapGrid, cellSize), 
        new DirectionsRenderer(nonAStar)
    ];

    stopwatch = new Stopwatch();    
}

let startSearch = false;
function mousePressed() {
    if (!startSearch) {
        stopwatch.start('astar');
        stopwatch.start('nonAStar');
    }
    startSearch = true;
}

let countAStarFinished;

function draw() {
    background(0);    

    image(images.vsAStar.file, width / 4 - 70, 40);

    image(images.vsNonAStar.file, width / 4 * 3 - 150, 40);

    let offsetX = (width/2 - size)/2;
    let offsetY = 130;
    
    countAStarFinished = 0;
    countAStarFinished += astarWithHeuristic.isGoalHit() ? 1 : 0;
    countAStarFinished += nonAStar.isGoalHit() ? 1 : 0;

    push();
    translate(offsetX, offsetY);
    _doDraw(astarWithHeuristic, currentWithHeuristic, renderers);
    pop();

    push();
    translate(width / 2 + offsetX, offsetY);
    _doDraw(nonAStar, currentNonAStar, nonAstarRenderers);
    pop();
    
}

function _doDraw(astar, current, renderers) {
    if (startSearch && frameCount % 1 == 0 && !astar.isGoalHit()) {
        astar.next();
        current.moveTo(getPixelByCell(astar.current.x, astar.current.y));
    }

    if (astar.isGoalHit()) {
        let nameSW = astar.aStarEnabled ? 'astar' : 'nonAStar';
        if (!stopwatch.hasFinished(nameSW)) {
            stopwatch.stop(nameSW);
        }
    }

    if (countAStarFinished < 2) {
        return;
    }
        
    _drawTexts(astar);

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
        circle(canvaX, canvaY, config[curConfig].circleSize);

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
        x * astarWithHeuristic.cellSize + astarWithHeuristic.cellSize / 2, 
        y * astarWithHeuristic.cellSize + astarWithHeuristic.cellSize / 2
    );
}

function _drawTexts(astar) {
    push();
    //noStroke();
    
    let txtSize = 18;
    let x = 0;

    let nameSW = astar.aStarEnabled ? 'astar' : 'nonAStar';
    let time = stopwatch.timeElapsed(nameSW);

    textFont(fontRockwellBold);
    textSize(txtSize);
    fill(255);
    text('Tempo: ' + int(time) + 's', x, size + 40);
    fill(colors.cost.expanded);
    text('Expandidas: ' + astar.numExpandeds, x, size + 70);
    fill(0,255,0);
    text('Distância: ' + astar.sizeOfPath, x, size + 100);
    pop();
}