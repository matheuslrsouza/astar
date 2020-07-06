/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var map1;
var fontRockwell;
var fontRockwellBold;

function preload() {
    map1 = loadImage('../../assets/map-01.png');

    fontRockwell = loadFont('../../assets/fonts/rockwell.otf');
    fontRockwellBold = loadFont('../../assets/fonts/rockwell-bold.ttf');
}

var newImgWidth;
var newImgHeight;

var start;
var end;

var slide = 0;

var fitY = 0;

var route = [

    [851, 128+fitY],
    [538, 105+fitY],
    [522, 181+fitY],
    [661, 186+fitY],
    [679, 310+fitY],
    [994, 326+fitY],
    [1004, 337+fitY],
    [1017, 330+fitY],
    [1472, 348+fitY],
    [1459, 448+fitY],
    [1037, 426+fitY]
]



function setup() {

    start = new Marker(createVector(route[0][0], route[0][1]), true);
    end = new Marker(createVector(route[route.length-1][0], route[route.length-1][1]), false);
    // end 822 402

    var imgWidth = 1874;
    var imgHeight = 1024;

    newImgWidth = 1000;
    newImgHeight = newImgWidth / imgWidth * imgHeight;
    createCanvas(1600, 900);
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
        image(map1, 500, 50, newImgWidth, newImgHeight);
        renderRoute(route);
    }

    start.draw();
    end.draw();

    _drawTexts();
}

function _drawTexts() {
    push();
    noStroke();
    
    translate(50, 0);

    var x = 50;

    textFont(slide == 1 && start.onPlace ? fontRockwellBold : fontRockwell);
    textSize(slide == 1 && start.onPlace ? 60 : 50);
    fill(slide == 1 && start.onPlace ? [255, 222, 89] : 50);
    text('Localização', x, 100);

    textFont(slide == 2 && end.onPlace ? fontRockwellBold : fontRockwell);
    textSize(slide == 2 && end.onPlace ? 60 : 50);
    fill(slide == 2 && end.onPlace ? [255, 222, 89] : 50);
    text('Destino', x, 250);

    textFont(slide == 3 && end.onPlace ? fontRockwellBold : fontRockwell);
    textSize(slide == 3 ? 60 : 50);
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
