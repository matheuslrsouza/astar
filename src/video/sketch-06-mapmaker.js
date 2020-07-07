/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var map;
var slider;
var curRows = 5;
var button;
var size = 550;

// new coordinates to be considered as point 0, 0
var newZeroX;
var newZeroY;

function setup() {
    createCanvas(1600, 900);

    newZeroX = (width - size) / 2;
    newZeroY = (height - size) / 2;

    var cellSize = size / curRows;
    map = new MapMaker(curRows, curRows, cellSize);

    slider = createSlider(1, 100, curRows);
    slider.position(523, 776);

    button = createButton('Exportar');
    button.position(680, 776);
    button.mousePressed(saveMap);
}

function draw() {
    background(0);

    _drawTexts();

    translate(newZeroX, newZeroY);

    var valSlider = slider.value();
    if (curRows != valSlider) {        
        curRows = valSlider;
        var cellSize = size / curRows;
        map = new MapMaker(curRows, curRows, cellSize);
    }

    
    addWall();
    map.render();
}

var pressed = false;

function mousePressed() {
    pressed = true;
    console.log(mouseX, mouseY);
}

function mouseReleased() {
    pressed = false;
}

function addWall() {
    if (pressed) {
        var col = int((mouseX-newZeroX) / size * curRows);
        var row = int((mouseY-newZeroY) / size * curRows);
        
        if (col >= 0 && col < curRows && row >= 0 && row < curRows) {
            map.toggleValue(row, col);
        }
    }
}

function saveMap() {
    saveJSON(map.grid, 'map.json');
}

function _drawTexts() {
    push();
    noStroke();
    
    var txtSize = 40;
    var x = (width - 80) / 2;

    //textFont(fontRockwellBold);
    textSize(txtSize);
    fill([255, 222, 89]);
    text(curRows + ' x ' + curRows, x, 150);
    pop();
}