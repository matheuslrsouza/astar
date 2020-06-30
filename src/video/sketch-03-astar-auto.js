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
    map4: { map: 'map4.json', start: [0, 0], goal: [30, 5] }
}

var curConfig = 'map4';

function preload() {
    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);
}


function setup() {
    createCanvas(1200, 900);
    var size = 750;

    var mapConfig = config[curConfig];

    // x, y
    var start = mapConfig.start;
    var goal = mapConfig.goal;
    
    var margin = 100;
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
}

function mousePressed() {
    astar.next();
}

function draw() {
    background(0);

    if (frameCount % 1 == 0 && !astar.goalCell) {
        astar.next();
    }

    translate(400, 100);

    renderers.forEach(renderer => {
        renderer.render();
    });

    // current
    var canvaX = astar.current.x * astar.cellSize + astar.cellSize / 2;
    var canvaY = astar.current.y * astar.cellSize + astar.cellSize / 2;
    push();
    stroke([140, 140, 236, 150]);
    strokeWeight(5);
    fill(colors.current.fill);
    noFill();
    circle(canvaX, canvaY, 20);
    //rect(astar.current.x * astar.cellSize, astar.current.y * astar.cellSize, astar.cellSize, astar.cellSize);
    pop();

    // TODO
    // - [OK] diferenciar expandidos de "tocados" 
    // - [OK] mostrar o custo
    // - mostrar os caminhos e o caminho ideal

    // TODO extrair para renderer
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

        // textSize(int(astar.cellSize/4));
        // text(cell.g, 
        //     cell.x * astar.cellSize + astar.cellSize - int(astar.cellSize/4) - 5, 
        //     cell.y * astar.cellSize + astar.cellSize - int(astar.cellSize/4));

        // // f
        // text(int(cell.f), 
        //     cell.x * astar.cellSize + astar.cellSize - int(astar.cellSize/4) - 50, 
        //     cell.y * astar.cellSize + astar.cellSize - int(astar.cellSize/4));

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