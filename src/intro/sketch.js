/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var img;

function preload() {
    img = loadImage('../../assets/logo.png');
}

var imgSize = 550;
function setup() {
    createCanvas(1920, 1080);
}

var theta = 0;

var acc = .005;
var vel = 0;
var touchedPiOverTwoCount = 0;

function draw() {
    background(0);
    
    image(img, (width - imgSize) / 2, (height - imgSize) / 2, imgSize, imgSize);

    var radius = 200;
    translate(width/2, height/2 + 25);
    
    if (theta < -PI/2 && touchedPiOverTwoCount < 10) {
        // test
        theta = -PI/2;
        vel = -(vel * (.6 - touchedPiOverTwoCount/10));
        theta = theta - vel;
        console.log(vel);
        touchedPiOverTwoCount++;
    } 
    else if (theta < -PI/2) {
        theta = -PI/2;
    }

    push();
    noStroke();
    beginShape();
    fill(146, 190, 255);
    vertex(0, 0);  

    for (let alfa = theta; alfa <= 0; alfa+=0.1) {        
        var x2 = cos(alfa) * radius;
        var y2 = sin(alfa) * radius;
        vertex(x2, y2);
    }

    x2 = radius;
    y2 = 0;
    vertex(x2, y2);
    vertex(0, 0);
    endShape();
    pop();

    push();
    noStroke();
    fill(0, 255, 0);
    for (let alfa = theta; alfa <= 0; alfa+=0.01) {        
        var x2 = cos(alfa) * radius;
        var y2 = sin(alfa) * radius;
        circle(x2, y2, 13);
    }
    x2 = radius;
    y2 = 0;
    circle(x2, y2, 13);
    pop();

    var lineLength = radius + 25;

    push();
    strokeWeight(15);
    stroke(253, 2, 157);

    rotate(theta);
    line(lineLength, 0, lineLength -20, -20);
    line(0, 0, lineLength, 0);
    line(lineLength, 0, lineLength -20, 20);+

    pop();

    if (theta > -PI/2) {
        theta = theta - vel;
    }

    vel += acc;
}