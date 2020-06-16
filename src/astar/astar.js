/// <reference path="node_modules/@types/p5/global.d.ts" />

class AStar {
    
    constructor(grid, start, goal) {
        this.grid = grid;
        this.start = start;
        this.goal = goal;
        this.closed = Array.from(
            new Array(grid.length), () => new Array(grid[0].length).fill(0));
    }

    search() {
        var actions = [
            [0, -1], //up
            [-1, 0], //left
            [0, 1],  //down
            [1, 0]   //right
        ];

        var open = [new Cell(0, this.start[0], this.start[1])];
        this.closed[this.start[0]][this.start[1]] = 1;

        while (open.length > 0) {
            // sort in descendentin order
            open.sort((a, b) => b.g - a.g);

            var next = open.pop();            

            if (next.x == this.goal[1] && next.y == this.goal[0]) {
                //alert('chegou');
                break;
            } else {
                actions.forEach((action) => {
                    var x2 = next.x + action[0];
                    var y2 = next.y + action[1];
                    var g2 = next.g + 1;                    

                    if (x2 >= 0 && x2 < this.grid.length && y2 >= 0 && y2 < this.grid.length) {
                        
                        if (this.grid[y2][x2] == 0 && this.closed[y2][x2] == 0) {
                            open.push(new Cell(g2, x2, y2));
                            this.closed[y2][x2] = 1;
                        }

                    }
                });

            }
        }

    }
}

class Cell {
    constructor(g, x, y) {
        this.g = g;
        this.x = x;
        this.y = y;
    }
}