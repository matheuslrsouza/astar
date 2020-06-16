class GridRenderer {
    constructor(grid, cellSize) {
        this.grid = grid;
        this.cellSize = cellSize;
  }

    render() {
        push();
        var freeColor = 0;
        var wallColor = 255;

        stroke(wallColor);
        
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                var x = col * this.cellSize;
                var y = row * this.cellSize;

                switch (this.grid[row][col]) {
                    case 0:
                        stroke(255, 255, 255, 50);
                        fill(freeColor)
                        break;
                    case 1:
                        fill(colors.wall.fill);
                        break;
                    case 2:
                        fill(0, 255, 0);
                        break;
                    case 3:
                        fill(255, 0, 0);
                        break;
                    default:
                        break;
                }
                rect(x, y, this.cellSize, this.cellSize);
            }
        }
        pop();
  }
}