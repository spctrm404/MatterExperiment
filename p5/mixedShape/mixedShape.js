let Engine = Matter.Engine,
  Composites = Matter.Composites,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies;

// create engine
let engine;

// add mouse control
let mouse;

let canvas;
let matterObjs = [];

function createWalls(thickness) {
  let walls = [
    new Rect(width * 0.5, 0, width, thickness, { isStatic: true }),
    new Rect(width * 0.5, height, width, thickness, { isStatic: true }),
    new Rect(width, height * 0.5, thickness, height, { isStatic: true }),
    new Rect(0, height * 0.5, thickness, height, { isStatic: true }),
  ];
  walls.forEach((wall) => {
    matterObjs.push(wall);
    Composite.add(world, wall.body);
  });
}

function setup() {
  let dom = document.getElementById("sketch");
  canvas = createCanvas(
    dom.getBoundingClientRect().width,
    dom.getBoundingClientRect().height
  );
  canvas.parent("sketch");
  engine = Engine.create();
  world = engine.world;

  let stack = Composites.stack(20, 20, 10, 5, 0, 0, function (x, y) {
    let sides = Math.round(random(1, 8));

    // round the edges of some bodies
    let chamfer = null;
    if (sides > 2 && random() > 0.7) {
      chamfer = {
        radius: 10,
      };
    }

    switch (Math.round(random(0, 1))) {
      case 0:
        if (random() < 0.8) {
          let newObj = new Rect(x, y, random(25, 50), random(25, 50), {
            chamfer: chamfer,
          });
          matterObjs.push(newObj);
          return newObj.body;
        } else {
          let newObj = new Rect(x, y, random(80, 120), random(25, 30), {
            chamfer: chamfer,
          });
          matterObjs.push(newObj);
          return newObj.body;
        }
      case 1:
        let newObj = new Polygon(x, y, sides, random(25, 50), {
          chamfer: chamfer,
        });
        matterObjs.push(newObj);
        return newObj.body;
    }
  });

  Composite.add(world, stack);

  createWalls(50);

  mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  Composite.add(world, mouseConstraint);
}

function draw() {
  background(255);
  Engine.update(engine);
  noFill();
  stroke(0);
  matterObjs.forEach((obj) => {
    if (mouseConstraint.body === obj.body) {
      stroke(255, 0, 0);
    } else {
      stroke(0);
    }
    obj.render();
    obj.renderDirVector();
  });
}
