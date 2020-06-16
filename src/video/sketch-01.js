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
        push();
        stroke(146, 100, 255);
        strokeWeight(5);
        for (let i = 0; i < route.length-1; i++) {
            const c = route[i];
            const c2 = route[i+1];
            line(c[0], c[1], c2[0], c2[1]);
        }
        pop();
    }

    start.draw();
    end.draw();

    _drawTexts();
}

function _drawTexts() {
    push();
    noStroke();
    textSize(40);

    var x = 50;

    fill(slide == 1 && start.onPlace ? 255 : 50);
    text('Localização', x, 100);

    fill(slide == 2 && end.onPlace ? 255 : 50);
    text('Destino', x, 250);

    fill(slide == 3 ? 255 : 50);
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

class Marker {

    constructor(pos, isStart) {
        this.pos = createVector(pos.x, -100);
        this.endPos = pos;
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 2);

        this.radius = 30;
        this.isStart = isStart;

        this.visible = false;
        this.onPlace = false;

        this.target = 80;
        this.currentRadius = 30;
    }

    show() {
        this.visible = true;
    }

    draw() {        
       

        if (this.pos.dist(this.endPos) <= 20) {
            this.visible = false;
            this.pos = this.endPos;
            this.onPlace = true;
        }

        if (this.visible) {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
        }

        push();
        translate(this.pos.x, this.pos.y - 40);

        if (this.onPlace) {
            noStroke();
            if (this.isStart) {
                fill(105, 204, 17, 100);                
            } else {
                fill(238, 52, 70, 100);
            }
            circle(0, 0, this.currentRadius);

            this.currentRadius += 1;

            if (this.currentRadius >= this.target) {
                this.currentRadius = 30;
            }
        }
        
        scale(0.5);


        strokeWeight(7);

        if (this.isStart) {
            stroke(81, 130, 37);
        } else {
            stroke(73, 67, 66);
        }

        line(0, this.radius / 2, 0, 80);

        // green
        if (this.isStart) {
            fill(105, 204, 17);
            stroke(81, 130, 37);
        } else {
            fill(238, 52, 70);
            stroke(173, 41, 67);
        }

        circle(0, 0, this.radius);

        pop();
    }

}