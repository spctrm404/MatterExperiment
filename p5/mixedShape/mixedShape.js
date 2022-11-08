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
let colors = ["#ececd1", "#f55a3c", "#f19648", "#f5d259", "#063e7b"];

function createWalls(thickness) {
  let walls = [
    new P5Rect(width * 0.5, 0, width, thickness, {
      isStatic: true,
    }).setStrokeColor("#cccccc"),
    new P5Rect(width * 0.5, height, width, thickness, {
      isStatic: true,
    }).setStrokeColor("#cccccc"),
    new P5Rect(width, height * 0.5, thickness, height, {
      isStatic: true,
    }).setStrokeColor("#cccccc"),
    new P5Rect(0, height * 0.5, thickness, height, {
      isStatic: true,
    }).setStrokeColor("#cccccc"),
  ];
  walls.forEach((wall) => matterObjs.push(wall));
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

  Composites.stack(20, 20, 10, 5, 0, 0, (x, y) => {
    let sides = Math.round(random(1, 8));

    // round the edges of some bodies
    let chamfer = null;
    if (sides > 2 && random() > 0.7)
      chamfer = {
        radius: 10,
      };

    let newObj = null;
    switch (Math.round(random(0, 1))) {
      case 0:
        if (random() < 0.8) {
          newObj = new P5Rect(x, y, random(25, 50), random(25, 50), {
            chamfer: chamfer,
          }).setFillColor(colors[Math.floor(random(colors.length))]);
          matterObjs.push(newObj);
          return newObj.getBody();
        } else {
          newObj = new P5Rect(x, y, random(80, 120), random(25, 30), {
            chamfer: chamfer,
          }).setFillColor(colors[Math.floor(random(colors.length))]);
          matterObjs.push(newObj);
          return newObj.getBody();
        }
      case 1:
        newObj = new P5Polygon(x, y, sides, random(25, 50), {
          chamfer: chamfer,
        }).setFillColor(colors[Math.floor(random(colors.length))]);
        matterObjs.push(newObj);
        return newObj.getBody();
    }
  });

  createWalls(50);

  console.log(matterObjs);

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
  matterObjs.forEach((obj) => {
    obj.render();
  });
  // matterObjs.forEach((obj) => {
  //   obj.renderDirVector();
  // });
}
