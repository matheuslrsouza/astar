class DebugLine {

    constructor(pos, width, height) {
        this.pos = pos;
        this.endPos = pos;
        
        this.width = width;
        this.height = height;

        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        this.moving = false;
    }

    moveTo(newPoint) {
        this.endPos = newPoint;
        var newHeading = p5.Vector.sub(newPoint, this.pos);

        this.vel.mult(0);
        this.acc = p5.Vector.fromAngle(newHeading.heading(), 1);
        this.moving = true;
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

        push();
        strokeWeight(1);
        stroke(0 , 255, 0);
        // noStroke();
        fill(0, 255, 0, 50);
        rect(this.pos.x, this.pos.y, this.width, this.height);
        pop();
    }
}