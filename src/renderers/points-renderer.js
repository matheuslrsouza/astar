/// <reference path="../../node_modules/@types/p5/global.d.ts" />

class PointsRenderer {
    constructor(start, goal, cellSize) {
        this.start = start;
        this.goal = goal;
        this.cellSize = cellSize;
    }

    render() {
        push();

        stroke(255);

        // start
        fill(colors.start.fill);
        var x = this.start[0] * this.cellSize;
        var y = this.start[1] * this.cellSize;
        // rect(x, y, this.cellSize, this.cellSize);

        // goal
        fill(colors.goal.fill);
        noStroke();
        x = this.goal[0] * this.cellSize;
        y = this.goal[1] * this.cellSize;
        rect(x, y, this.cellSize, this.cellSize);
        
        pop();
  }
}