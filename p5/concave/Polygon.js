class Polygon {
  constructor(x, y, sides, radius, options) {
    this.radius = radius;
    this.body = Matter.Bodies.polygon(x, y, sides, this.radius, options);
    // Matter.Composite.add(engine.world, this.body);
  }
  render() {
    beginShape();
    this.body.vertices.forEach((v) => {
      vertex(v.x, v.y);
    });
    endShape(CLOSE);
  }
  renderDirVector() {
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    line(0, 0, this.radius, 0);
    pop();
  }
}
