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

var fitY = 0;

var routes = {
    route1: [
        [1000, 400+fitY], 
        [1000, 504],
        [868, 504],
        [868, 564]
    ],
    route2: [
        [750, 200+fitY], 
        [735, 200+fitY],
        [735, 270+fitY],
        [868, 270+fitY],
        [868, 564+fitY]
    ], 
    route3: [
        [737, 433+fitY], 
        [868, 521+fitY], 
        [868, 564+fitY]
    ]
};



function setup() {
    var route = routes.route1;
    
    start = new Marker(createVector(route[0][0], route[0][1]), true);
    start.show();
    
    // 1125 × 1317
    var imgWidth = 1125;
    var imgHeight = 1317;

    newImgWidth = 550;
    newImgHeight = newImgWidth / imgWidth * imgHeight;
    createCanvas(1200, 800);
}

function draw() {
    background(0);

    push();
    image(map1, width - newImgWidth, 0, newImgWidth, newImgHeight);    
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
