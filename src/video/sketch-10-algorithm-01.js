/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var renderers;

var mapGrid;
var astar;

var config = {
    map: { map: 'map-2cells.json' }
}

var curConfig = 'map';

var fontRockwellBold;

var current;

var slide = 0;

var localImages = {
    cost: {file: '', width: 290, height: 258}, 
    g: {file: '', width: 638, height: 470},
    result1: {file: '', width: 338, height: 222}, 
    result2: {file: '', width: 320, height: 236}
}

function preload() {
    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);    
    fontRockwellBold = loadFont('../../assets/fonts/rockwell-bold.ttf');

    localImages.cost.file = loadImage('../../assets/cost.png');
    localImages.g.file = loadImage('../../assets/g.png');
    localImages.result1.file = loadImage('../../assets/result1.png');
    localImages.result2.file = loadImage('../../assets/result2.png');
}

var size = 700;
function setup() {
    createCanvas(1600, 900);
    
    var cellSize = size / mapGrid[0].length;

    astar = new AStarInteractive(mapGrid, [0,0], [2,0], cellSize, false);
    astar.next();

    current = new Current(getPixelByCell(0, 0), 80, 15);

    renderers = [
        new GridRenderer(mapGrid, cellSize)
    ];    
}

function mousePressed() {    
    astar.next();
    current.moveTo(getPixelByCell(astar.current.x, astar.current.y));

    slide++;
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

    translate((width - size) / 2, 300);

    renderers.forEach(renderer => {
        renderer.render();
    });

    current.draw();

    if (slide >= 1 && current.expandeds.length > 0) {
        let pos = current.expandeds[0];
        _drawCost(pos.x + 60, pos.y - astar.cellSize / 3);

        // image cost
        push();
        image(localImages.cost.file, 300, -170, localImages.cost.width, localImages.cost.height);
        pop();
    }

    if (slide >= 2) {
        let firstPos = getPixelByCell(0, 0);
        _drawG("0", firstPos.x + 60 + 25, firstPos.y + astar.cellSize / 2.2);
        let pos = current.expandeds[0];
        _drawG("1", pos.x + 60 + 25, pos.y + astar.cellSize / 2.2);

        // image g
        push();
        image(localImages.g.file, -10, 30, localImages.g.width, localImages.g.height);
        pop();
    }


    if (slide >= 3) {        
        // result 1
        push();
        image(localImages.result1.file, 410, 270, localImages.result1.width, localImages.result1.height);
        pop();        
    }

    if (slide >= 4) {
        // result 1
        push();
        image(localImages.result2.file, 590, 230, localImages.result2.width, localImages.result2.height);
        pop();        
    }

    if (slide >= 5 && current.expandeds.length > 1) {
        let pos = current.expandeds[1];
        _drawCost(pos.x + 60, pos.y - astar.cellSize / 3);        
    }

    if (slide >= 6) {
        let pos = current.expandeds[1];
        _drawG("2", pos.x + 60 + 25, pos.y + astar.cellSize / 2.2);
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
    var x = (width - 400) / 2;

    textFont(fontRockwellBold);
    textSize(txtSize);
    fill([255, 222, 89]);
    text('Algoritmo', x, 120);
    pop();
}

function _drawCost(x, y) {

    push();
    //noStroke();
    
    var txtSize = 40;
    var color = [0, 255, 0];

    
    stroke(color);
    strokeWeight(4);

    textSize(txtSize);
    fill(color);
    text('+1', x, y);
    pop();

}

function _drawG(val, x, y) {

    push();
    //noStroke();
    
    var txtSize = 40;
    var color = [255];
    stroke(color);
    strokeWeight(4);

    textSize(txtSize);
    fill(color);
    text(val, x, y);
    pop();

}