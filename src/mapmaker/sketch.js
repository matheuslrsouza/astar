/// <reference path="node_modules/@types/p5/global.d.ts" />

var map;
var slider;
var curRows = 5;
var button;

function setup() {
    var size = 550;
    createCanvas(size, size);
    var size = width / curRows;
    map = new MapMaker(curRows, curRows, size);

    slider = createSlider(1, 100, curRows);

    button = createButton('Save');
    button.mousePressed(saveMap);
}

function draw() {
    background(0);

    var valSlider = slider.value();
    if (curRows != valSlider) {
        console.log(valSlider);
        
        curRows = valSlider;
        var size = width / curRows;
        map = new MapMaker(curRows, curRows, size);
    }

    test();
    map.render();
}

var pressed = false;

function mousePressed() {
    pressed = true;
    console.log(pressed);
    
}

function mouseReleased() {
    pressed = false;
}

function test() {
    if (pressed && mouseX <= width && mouseY <= height) {
        var col = int(mouseX / width * curRows);
        var row = int(mouseY / height * curRows);
        
        map.toggleValue(row, col);
    }
}

function saveMap() {
    saveJSON(map.grid, 'teste.json');
}
