/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var img;

function preload() {
    img = loadImage('../../assets/logo.png');
}

var size = 550;
function setup() {
    createCanvas(size, size);
}

var theta = 0;

var acc = .005;
var vel = 0;
var touchedPiOverTwoCount = 0;

function draw() {
    background(0);

    scale(.6);
    translate(width/2-100, height/2+80);
    image(img, 0, 0, size, size);

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
    var x = cos(theta) * lineLength;
    var y = sin(theta) * lineLength;

    push();
    strokeWeight(15);
    stroke(253, 2, 157);

    rotate(theta);
    line(lineLength, 0, lineLength -20, -20);
    line(0, 0, lineLength, 0);
    line(lineLength, 0, lineLength -20, 20);
    // beginShape();

    // stroke(253, 2, 157);
    // strokeWeight(10);
    
    // rotate(theta);

    // vertex(0, 0);
    // vertex(lineLength, 0);
    // vertex(lineLength - 15, -20);
    // vertex(lineLength, 0);
    // vertex(lineLength - 15, 20);
    // vertex(lineLength, 0);
    // vertex(0, 0);

    // endShape();
    pop();

    if (theta > -PI/2) {
        theta = theta - vel;
    }

    vel += acc;
}