/// <reference path="../../node_modules/@types/p5/global.d.ts" />

var renderers;

var mapGrid;
var astar;
var slide = 0;
var alphaNumbers = 0;

var config = {
    map1: { map: 'map-grid.json', start: [0, 0], goal: [4, 4] }
}

var zerosAndOnes = [[0,1,0,0,0],[0,1,0,0,0],[0,1,0,1,0],[0,0,0,1,0],[0,1,0,0,0]];

var curConfig = 'map1';

var fontRockwellBold;

function preload() {
    loadJSON('../astar/' + config[curConfig].map, (data) => mapGrid = data);

    //fontRockwellBold = loadFont('../../assets/fonts/rockwell.otf');
    fontRockwellBold = loadFont('../../assets/fonts/rockwell-bold.ttf');
}

var size = 700;
function setup() {
    createCanvas(1600, 900);

    var mapConfig = config[curConfig];

    // x, y
    var start = mapConfig.start;
    var goal = mapConfig.goal;
    
    var margin = 0;
    var cellSize = (size-margin) / mapGrid.length;

    astar = new AStarInteractive(mapGrid, start, goal, cellSize, true);

    renderers = [
        new GridRenderer(mapGrid, cellSize), 
        new DirectionsRenderer(astar)
    ];
}

function draw() {
    background(0);

    translate((width - size) / 2, 100);

    renderers.forEach(renderer => {
        renderer.render();
    });
    
    if (slide == 4 && alphaNumbers > 0) {
        alphaNumbers -= 5;
    } else if (alphaNumbers > 0 && alphaNumbers < 255) {
        alphaNumbers += 5;
    }

    zerosAndOnes.forEach((row, y) => {

        row.forEach((value, x) => {
            var xCorner = x * astar.cellSize;
            var yCorner = y * astar.cellSize;
            var canvaX = xCorner + astar.cellSize / 2;
            var canvaY = yCorner + astar.cellSize / 2;

            push();

            textSize(30);
            var gray = 80;
            var white = 255;

            if (slide == 1) {
                fill(gray, gray, gray, alphaNumbers);
            } else if (slide == 2) {
                if (!value) { // zero
                    fill(white);
                } else {
                    fill(gray);
                }
            } else if (slide == 3 || slide == 4) {
                if (!value) { // zero
                    fill(gray, gray, gray, alphaNumbers);                    
                } else {
                    fill(white, white, white, alphaNumbers);
                    
                    if (slide == 4) {
                        stroke(255);
                        fill(white, white, white, abs(alphaNumbers - 255));
                        rect(xCorner, yCorner, astar.cellSize, astar.cellSize);
                    }
                }   
            }
            text(value, canvaX, canvaY);
            
            
            pop();    

        });

        
    });

}

function getPixelByCell(x, y) {
    return createVector(
        x * astar.cellSize + astar.cellSize / 2, 
        y * astar.cellSize + astar.cellSize / 2
    );
}


function keyPressed() {
    if (keyCode === RIGHT_ARROW) {
        slide++;
    }

    if (keyCode === LEFT_ARROW) {
        slide--;
    }

    if (slide == 1) {
        // init the show process
        alphaNumbers = 1;
    }
}
