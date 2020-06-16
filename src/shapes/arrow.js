class Arrow {
    constructor(x, y, theta, scale, color) {
        this.x = x;
        this.y = y;
        this.theta = theta;
        this.scale = scale;
        this.color = color;
    }

    render() {

        push();
        beginShape();
        stroke(this.color);
        fill(this.color);
        translate(this.x, this.y);
        rotate(this.theta);

        scale(this.scale);
        
        vertex(0, -5);
        vertex(20, -5);
        vertex(20, -15);
        vertex(30, 0);
        vertex(20, 15);
        vertex(20, 5);
        vertex(0, 5);

        vertex(0, -5);

        endShape();
        pop();
    }

}