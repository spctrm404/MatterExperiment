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
    new Rect(width * 0.5, 0, width, thickness, {
      isStatic: true,
    }).setStrokeColor("#cccccc"),
    new Rect(width * 0.5, height, width, thickness, {
      isStatic: true,
    }).setStrokeColor("#cccccc"),
    new Rect(width, height * 0.5, thickness, height, {
      isStatic: true,
    }).setStrokeColor("#cccccc"),
    new Rect(0, height * 0.5, thickness, height, {
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

  matterObjs.push(
    new Rect(
      width * 0.5,
      height * 0.5,
      random(25, 50),
      random(25, 50)
    ).setFillColor(colors[Math.floor(random(colors.length))])
  );
  matterObjs.push(
    new Polygon(width * 0.5, height * 0.5, 5, random(25, 50)).setFillColor(
      colors[Math.floor(random(colors.length))]
    )
  );
  matterObjs.push(
    new Circle(width * 0.5, height * 0.5, random(25, 50)).setFillColor(
      colors[Math.floor(random(colors.length))]
    )
  );

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
