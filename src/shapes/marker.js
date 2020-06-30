// same radius for all markers
var currentRadius = 30;

class Marker {

  constructor(pos, isStart) {
      this.pos = createVector(pos.x, -100);
      this.endPos = pos;
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 2);

      this.radius = 30;
      this.isStart = isStart;

      this.visible = false;
      this.onPlace = false;

      this.target = 70;     
      
      this.newPoint = undefined;
  }

  show() {
      this.visible = true;
  }

  draw() {
      // checks if the marker is on place
      if (this.pos.dist(this.endPos) <= 50) {
          this.visible = false;
          this.pos = this.endPos;
          this.onPlace = true;
      }

      // moving the place
      if (this.visible) {
          this.vel.add(this.acc);
          this.pos.add(this.vel);
          //console.log(this.pos);
          
      }

      push();
      translate(this.pos.x, this.pos.y - 40);

      if (this.onPlace) {
          noStroke();
          var alpha = map(currentRadius, 30, this.target, 100, 10);
          if (this.isStart) {
              fill(105, 204, 17, alpha);                
          } else {
              fill(238, 52, 70, alpha);
          }
          circle(0, 0, currentRadius);

          currentRadius += .5;

          if (currentRadius >= this.target) {
              currentRadius = 30;
          }
      }
      
      scale(0.5);


      strokeWeight(7);

      if (this.isStart) {
          stroke(81, 130, 37);
      } else {
          stroke(73, 67, 66);
      }

      line(0, this.radius / 2, 0, 80);

      // green
      if (this.isStart) {
          fill(105, 204, 17);
          stroke(81, 130, 37);
      } else {
          fill(238, 52, 70);
          stroke(173, 41, 67);
      }

      circle(0, 0, this.radius);

      pop();
  }

  moveTo(newPoint) {
    this.endPos = newPoint;
    this.visible = true;

    var newHeading = p5.Vector.sub(newPoint, this.pos);

    this.vel.mult(0);
    this.acc = p5.Vector.fromAngle(newHeading.heading(), .5);
  }

}