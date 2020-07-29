class EuclideanDistance {

    constructor(start, end) {
        this.start = start;
        this.end = end;        

        this.diffXStartEnd = this.end.x - this.start.x;
        // p5.Vector.sub(this.start, p5.Vector.sub(this.start, this.end));
        this.visible = false;
        this.alpha = 0;

        this.endPos = this.start;
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.moving = false;

        this.showEq = false;
        
    }

    draw() {
        if (this.visible && this.alpha < 255) {
            this.alpha += 5;
        }

        // checks if is on place
        if (this.start.dist(this.endPos) <= 40 && this.moving) {
            this.moving = false;
            this.start = this.endPos;
        } else if (this.moving) {
            // moving the place
            this.vel.add(this.acc);
            this.start.add(this.vel);
        }

        let diffStartEnd = createVector(this.start.x, this.end.y);
        push();
        stroke(255, 255, 255, this.alpha);
        strokeWeight(4);
        line(this.start.x, this.start.y, diffStartEnd.x + this.diffXStartEnd, diffStartEnd.y);

        if (this.showEq) {
            let newWidth = 190;
            image(images.distance.file, 
                this.start.x + this.diffXStartEnd / 2, this.start.y + 50, 
                newWidth, (newWidth / images.distance.width) * images.distance.height);
    
            newWidth = 56;
            image(images.deltaX.file, 
                this.start.x - 80, this.start.y + 80,
                newWidth, newWidth);
    
            image(images.deltaY.file, 
                this.start.x + 80, this.start.y + 220,
                newWidth, newWidth);

            let blue = [109, 158, 235, this.alpha];
            stroke(blue);
            line(this.start.x, this.start.y, this.start.x, this.end.y);

            stroke(blue);
            line(this.start.x, this.end.y, diffStartEnd.x + this.diffXStartEnd, diffStartEnd.y);
        }

        

        let maxAlphaCircles = 180;
        let ratio = maxAlphaCircles / 255;
        noStroke();
        fill(0, 255, 0, ratio * this.alpha);
        circle(this.start.x, this.start.y, 20);
        fill(255, 0, 0, ratio * this.alpha);
        circle(diffStartEnd.x + this.diffXStartEnd, diffStartEnd.y, 20);

        

        pop();
    }

    show() {
        this.visible = true;
    }

    moveTo(newPoint) {
        this.endPos = newPoint;
        this.endPos.x += this.start.x;
        var newHeading = p5.Vector.sub(newPoint, this.start);

        this.vel.mult(0);
        this.acc = p5.Vector.fromAngle(newHeading.heading(), 1.8);
        this.moving = true;
    }

    showEquations() {
        this.showEq = true;
    }

}