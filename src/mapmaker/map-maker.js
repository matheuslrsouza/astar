class MapMaker {

  constructor(numRows, numCols, cellSize) {
      // creates a matrix (numRows x numCols)
      this.grid = Array.from(Array(numRows), () => new Array(numCols).fill(0));

      this.renderers = [
          new GridRenderer(this.grid, cellSize)
      ];
  }

  toggleValue(row, col) {
      var curValue = this.grid[row][col];
      this.grid[row][col] = curValue == 0 ? 1 : 1;
  }

  render() {
      this.renderers.forEach((render) => render.render());
  }

}