class Heuristic {

    constructor(heuristic, cellSize, maxValueH) {
        this.heuristic = heuristic;
        this.pos = createVector(0, 0);
        this.endPos = this.pos;
        this.cellSize = cellSize;
        this.maxValueH = maxValueH;

        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        this.moving = false;
        this.showingNumbersUntil = 0;
        this.showAll = false;
        this.numbers = new Array(this.maxValueH);
        this.highlightings = [];

        heuristic.forEach((row) => {        
            row.forEach((value) => {
                this.numbers[value] = new ItemText(value, 0, 0, [255]);
            });
        });
    }

    draw() {
        // checks if is on place
        if (this.pos.dist(this.endPos) <= 10 && this.moving) {
            this.moving = false;
            this.pos = this.endPos;
        } else if (this.moving) {
            // moving the place
            this.vel.add(this.acc);
            this.pos.add(this.vel);
        }

        if (this.showAll && this.showingNumbersUntil < this.maxValueH) {
            if (frameCount % 30 == 0) {
                this.showingNumbersUntil++;
                this.numbers[this.showingNumbersUntil].show();
            }
        }

        heuristic.forEach((row, y) => {
        
            row.forEach((value, x) => {
                push();
                var xCorner = this.pos.x + x * astar.cellSize;
                var yCorner = this.pos.y + y * astar.cellSize;
                var canvaX = xCorner + astar.cellSize - astar.cellSize / 2-7;
                var canvaY = yCorner + astar.cellSize - astar.cellSize / 3;

                if (this.highlightings.length > 0) {
                    const hl = this.highlightings.find((el, i) => {
                        if (el.frames >= 90) {
                            this.highlightings.splice(i, 1);
                        }
                        return el.x == x && el.y == y;
                    });
                    if (hl) {
                        hl.frames += 1;
                        fill(0, 255, 0, 30);
                    } else {
                        noFill();
                    }
                } else {
                    noFill();
                }
    
                stroke(255, 255, 255, 30);
                rect(xCorner, yCorner, astar.cellSize, astar.cellSize);
    
                this.numbers[value].x = canvaX;
                this.numbers[value].y = canvaY;
                this.numbers[value].render();
                pop();    
            });
        });
    }

    moveTo(newPoint) {
        this.endPos = newPoint;
        var newHeading = p5.Vector.sub(newPoint, this.pos);

        this.vel.mult(0);
        this.acc = p5.Vector.fromAngle(newHeading.heading(), 1);
        this.moving = true;
    }

    showAllNumbers() {
        this.showAll = true;
    }

    highlight(y, x) {
        this.highlightings.push({
            x: x, y: y, frames: 0
        });
    }

}
