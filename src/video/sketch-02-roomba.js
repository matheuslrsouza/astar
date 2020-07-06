/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var map1;

function preload() {
    map1 = loadImage('../../assets/roomba-map.png');
}

var newImgWidth;
var newImgHeight;

var start;
var end;

var slide = 0;

var fitY = 135;
var fitX = -125;

var routes = {
    route1: [
        [1000+fitX, 400+fitY], 
        [1000+fitX, 550+fitY],
        [848+fitX, 550+fitY],
        [848+fitX, 650+fitY]
    ],
    route2: [
        [700+fitX, 150+fitY], 
        [735+fitX, 190+fitY],
        [735+fitX, 270+fitY],
        [848+fitX, 270+fitY],
        [848+fitX, 650+fitY]
    ], 
    route3: [
        [800+fitX, 433+fitY], 
        [848+fitX, 521+fitY], 
        [848+fitX, 650+fitY]
    ]
};



function setup() {
    var route = routes.route1;
    
    start = new Marker(createVector(route[0][0], route[0][1]), true);
    start.show();
    
    // 1125 × 1317
    var imgWidth = 1125;
    var imgHeight = 1317;

    newImgWidth = 750;
    newImgHeight = newImgWidth / imgWidth * imgHeight;
    createCanvas(1600, 900);
}

function draw() {
    background(0);

    push();
    translate((width - newImgWidth) / 2, (height - newImgHeight) / 2);
    image(map1, 0, 0, newImgWidth, newImgHeight);    
    pop();

    var route = slide == 1 ? routes.route1 : 
            (slide == 3 ? routes.route2 : 
                (slide == 5 ? routes.route3 : undefined)
            );
    renderRoute(route);

    start.draw();
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

    if (slide == 2) {
        var route = routes.route2;
        var newPoint = createVector(route[0][0], route[0][1]);
        
        start.moveTo(newPoint);
    }

    if (slide == 4) {
        var route = routes.route3;
        var newPoint = createVector(route[0][0], route[0][1]);
        
        start.moveTo(newPoint);
    }

}
