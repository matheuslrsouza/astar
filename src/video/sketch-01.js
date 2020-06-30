/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var map1;

function preload() {
    map1 = loadImage('../../assets/map-01.png');
}

var newImgWidth;
var newImgHeight;

var start;
var end;

var slide = 0;

var fitY = -50;

var route = [
    [681, 163+fitY],
    [430, 144+fitY],
    [418, 203+fitY],
    [530, 209+fitY],
    [542, 308+fitY],
    [796, 322+fitY],
    [799, 327+fitY],
    [805, 331+fitY],
    [810, 328+fitY],
    [813, 323+fitY],
    [1177, 338+fitY],
    [1166, 418+fitY],
    [822, 402+fitY]
]



function setup() {

    start = new Marker(createVector(route[0][0], route[0][1]), true);
    end = new Marker(createVector(route[route.length-1][0], route[route.length-1][1]), false);
    // end 822 402

    var imgWidth = 1874;
    var imgHeight = 1024;

    newImgWidth = 800;
    newImgHeight = newImgWidth / imgWidth * imgHeight;
    createCanvas(1200, 800);
}

function draw() {
    background(0);

    if (slide == 1) {
        start.show();
    }

    if (slide == 2) {
        end.show();
    }

    if (slide == 3) {
        image(map1, width - newImgWidth, 50, newImgWidth, newImgHeight);
        renderRoute(route);
    }

    start.draw();
    end.draw();

    _drawTexts();
}

function _drawTexts() {
    push();
    noStroke();
    

    var x = 50;

    textFont('Rockwell');
    textSize(slide == 1 && start.onPlace ? 60 : 40);
    fill(slide == 1 && start.onPlace ? [255, 222, 89] : 50);
    text('Localização', x, 100);

    textSize(slide == 2 && end.onPlace ? 60 : 40);
    fill(slide == 2 && end.onPlace ? [255, 222, 89] : 50);
    text('Destino', x, 250);

    textSize(slide == 3 ? 60 : 40);
    fill(slide == 3 ? [255, 222, 89] : 50);
    text('Mapa', x, 400);
    pop();
}

function mousePressed() {
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
