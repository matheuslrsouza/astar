/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var renderers;

var map;
var astar;

function preload() {
    loadJSON('map2.json', (data) => map = data);
}


function setup() {
    var size = 550;
    createCanvas(size, size);

    // x, y
    var start = [0, 0];
    var goal = [2, 0];

    
    var cellSize = width / map.length;

    astar = new AStarInteractive(map, start, goal, cellSize);
    astar.next();

    renderers = [
        new GridRenderer(map, cellSize), 
        new PointsRenderer(start, goal, cellSize), 
        new DirectionsRenderer(astar)
    ];    
}

function mousePressed() {
    astar.next();
}

function draw() {
    background(0);

    

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

}