/// <reference path="../../node_modules/@types/p5/global.d.ts" />

class AStarInteractive {
    
    constructor(grid, start, goal, cellSize, aStarEnabled) {
        this.grid = grid;
        this.start = start;
        this.goal = goal;
        this.cellSize = cellSize;
        this.aStarEnabled = aStarEnabled;

        this.closed = Array.from(
            new Array(grid.length), () => new Array(grid[0].length).fill(0));

        var cell = new Cell(0, 0, this.start[0], this.start[1]);
        this.open = [cell];
        this.closed[this.start[0]][this.start[1]] = 1;
        this.allowedActions = [];

        // cells expanded and touched
        this.cells = [cell];

        this.current = cell;
        this.goalCell = undefined;
    }

    next() {
        // used to show arrows point to the allowed path
        this.allowedActions = [];

        var actions = [
            [0, -1, -PI/2], //up
            [-1, 0, PI], //left
            [0, 1, PI/2],  //down
            [1, 0, 0]   //right
        ];

        if (this.open.length > 0) {
            // if A* is enabled we must order by f not g
            if (this.aStarEnabled) {
                // sort in descending order by f
                this.open.sort((a, b) => b.f - a.f);
            } else {
                // sort in descending order by g
                this.open.sort((a, b) => b.g - a.g);
            }

            var next = this.open.pop();
            next.expanded = true;
            this.current = next;      

            if (next.x == this.goal[0] && next.y == this.goal[1]) {
                this.goalCell = next;
            } else {
                actions.forEach((action) => {
                    var x2 = next.x + action[0];
                    var y2 = next.y + action[1];
                    // com um valor maior se comporta melhor
                    var g2 = next.g + this.cellSize/3.5;                    

                    if (x2 >= 0 && x2 < this.grid.length && y2 >= 0 && y2 < this.grid.length) {
                        
                        if (this.grid[y2][x2] == 0 && this.closed[y2][x2] == 0) {

                            var centerGoalX = this.goal[0] * this.cellSize + this.cellSize / 2;
                            var centerGoalY = this.goal[1] * this.cellSize + this.cellSize / 2;

                            var canvaX2 = x2 * this.cellSize + this.cellSize / 2;
                            var canvaY2 = y2 * this.cellSize + this.cellSize / 2;

                            var h = dist(canvaX2, canvaY2, centerGoalX, centerGoalY);

                            var f2 = g2 + h;

                            var cell = new Cell(f2, g2, x2, y2);
                            cell.previous = next;

                            this.open.push(cell);
                            this.cells.push(cell);
                            this.closed[y2][x2] = 1;

                            var theta = action[2];

                            var centerX = next.x * this.cellSize + this.cellSize / 2;
                            var centerY = next.y * this.cellSize + this.cellSize / 2;
                            
                            // (x2 - next.x) * this.cellSize / 4
                            // this part just moves the arrow towards the next cell
                            var canvaX = centerX + (x2 - next.x) * this.cellSize / 4;
                            var canvaY = centerY + (y2 - next.y) * this.cellSize / 4;

                            this.allowedActions.push(new Arrow(canvaX, canvaY, theta, 0.5, colors.arrow.fill));
                        }

                    }
                });

            }
        }

    }
}

class Cell {
    constructor(f, g, x, y) {
        this.f = f;
        this.g = g;
        this.x = x;
        this.y = y;
        this.expanded = false;
        this.previous = undefined;
    }
}