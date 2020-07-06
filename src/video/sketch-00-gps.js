/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var imgSattelite;
var fontRockwell;
var fontRockwellBold;

function preload() {
    imgSattelite = loadImage('../../assets/satellite.jpg');

    // fontRockwell = loadFont('../../assets/fonts/rockwell.otf');
    // fontRockwellBold = loadFont('../../assets/fonts/rockwell-bold.ttf');
}

var newImgWidth;
var newImgHeight;

var slide = 0;

var fitY = 0;

var route = [
    [885, 753],
    [890, 741],
    [893, 731],
    [897, 714],
    [898, 700],
    [897, 680],
    [896, 670],
    [892, 654],
    [891, 644],
    [885, 627],
    [879, 614],
    [874, 599],
    [868, 585],
    [857, 567],
    [851, 554],
    [840, 543],
    [827, 535],
    [808, 526],
    [785, 515],
    [773, 514],
    [759, 513],
    [744, 514],
    [734, 517],
    [718, 512],
    [705, 503],
    [699, 491],
    [696, 480],
    [690, 461],
    [684, 445],
    [680, 430],
    [675, 415],
    [675, 399],
    [675, 382],
    [679, 368],
    [684, 355],
    [693, 348],
    [705, 342],
    [720, 345],
    [735, 344],
    [745, 347],
    [755, 353],
    [763, 366],
    [765, 381],
    [760, 393],
    [749, 404],
    [733, 408],
    [722, 408],
    [708, 408],
    [686, 403],
    [670, 403],
    [658, 405],
    [643, 408],
    [624, 412],
    [611, 417],
    [606, 425],
    [605, 437],
    [610, 451],
    [622, 460],
    [641, 458],
    [653, 451],
    [658, 435],
    [656, 419],
    [654, 405],
    [647, 391],
    [642, 381],
    [638, 364], 
    [647, 344],
    [658, 339],
    [668, 333],
    [678, 331],
    [689, 328],
    [701, 328],
]

var signals;
var markerStart;
var markerGoal;
var curIndexRoute = route.length-1;

function setup() {

    signals = [new Signal(createVector(982, 185))];

    markerStart = new Marker(createVector(709, 330), true);
    markerStart.show();

    markerGoal = new Marker(createVector(887, 755), false);
    markerGoal.show();

    var imgWidth = 3300;
    var imgHeight = 3300;

    newImgWidth = 900;
    newImgHeight = newImgWidth / imgWidth * imgHeight;
    createCanvas(1600, 900);
}

function draw() {
    background(0);

    image(imgSattelite, (width - newImgWidth) / 2, 0, newImgWidth, newImgHeight);

    if (slide >= 1) {
        signals.forEach(s => {
            s.render();
        });

        if (frameCount % 15 == 0) {
            signals.push(new Signal(createVector(982, 185)));
        }

        for (let i = signals.length - 1; i >= 0; i--) {
            const s = signals[i];
            if (s.outOfRange()) {
                signals.splice(i, 1);
            }
        }
    }

    if (slide >= 3) {
        if (frameCount % 5 == 0 && curIndexRoute > 0) {
            curIndexRoute--;
        }
        push();
        fill(0);
        strokeWeight(8);
        for (let i = route.length-1; i >= curIndexRoute; i-=2) {
            
            if (i - 1 < 0) break;

            const p = route[i];
            const p2 = route[i-1];

            line(p[0], p[1], p2[0], p2[1]);
        }
        pop();
    }

    if (slide >= 2) {
        markerStart.draw();
        markerGoal.draw();
    }


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


class Signal {

    constructor(pos) {
        this.pos = pos;
        this.currentRadius = 30;
        this.maxRadius = 1200;
    }

    render() {

        push();

        var alpha = map(this.currentRadius, 10, this.maxRadius, 255, 0);

        translate(this.pos.x, this.pos.y);
        noFill();
        stroke(255, 255, 255, alpha);
        strokeWeight(5);

        //rotate(PI/4);
        //arc(0, 0, this.currentRadius, this.currentRadius, 0, PI);
        circle(0, 0, this.currentRadius);

        pop();

        this.currentRadius += 10;
    }

    outOfRange() {
        return this.currentRadius > this.maxRadius;
    }

}