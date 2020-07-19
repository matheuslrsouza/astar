class Current {

    constructor(pos, size, sw) {
        this.pos = pos;
        this.endPos = pos;
        this.size = size;
        this.strokeWeight = sw;

        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        this.moving = false;
        this.expandeds = [];
    }

    moveTo(newPoint) {
        this.endPos = newPoint;
        var newHeading = p5.Vector.sub(newPoint, this.pos);

        this.vel.mult(0);
        this.acc = p5.Vector.fromAngle(newHeading.heading(), 8);
        this.moving = true;
    }

    draw() {
        // checks if is on place
        if (this.pos.dist(this.endPos) <= 40 && this.moving) {
            this.moving = false;
            this.pos = this.endPos;
            this.expandeds.push(this.endPos.copy());
        } else if (this.moving) {
            // moving the place
            this.vel.add(this.acc);
            this.pos.add(this.vel);
        }

        push();
        stroke([140, 140, 236, 150]);
        strokeWeight(this.strokeWeight);
        fill(colors.current.fill);
        noFill();
        circle(this.pos.x, this.pos.y, this.size);
        pop();
    }
}