let Engine = Matter.Engine,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Vertices = Matter.Vertices,
  Svg = Matter.Svg,
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

  // add bodies
  if (typeof fetch !== "undefined") {
    let select = function (root, selector) {
      return Array.prototype.slice.call(root.querySelectorAll(selector));
    };

    let loadSvg = function (url) {
      return fetch(url)
        .then(function (response) {
          return response.text();
        })
        .then(function (raw) {
          return new window.DOMParser().parseFromString(raw, "image/svg+xml");
        });
    };

    [
      "./svgFiles/iconmonstr-check-mark-8-icon.svg",
      "./svgFiles/iconmonstr-paperclip-2-icon.svg",
      "./svgFiles/iconmonstr-puzzle-icon.svg",
      "./svgFiles/iconmonstr-user-icon.svg",
    ].forEach(function (path, i) {
      loadSvg(path).then(function (root) {
        let vertexSets = select(root, "path").map(function (path) {
          return Vertices.scale(Svg.pathToVertices(path, 30), 0.4, 0.4);
        });
        let newObj = new FromConcaveBody(
          Bodies.fromVertices(
            100 + i * 150,
            200 + i * 50,
            vertexSets,
            null,
            true
          )
        ).setFillColor(colors[Math.floor(random(colors.length))]);
        matterObjs.push(newObj);
      });
    });

    loadSvg("./svgFiles/svg.svg").then(function (root) {
      let vertexSets = select(root, "path").map(function (path) {
        return Svg.pathToVertices(path, 30);
      });

      let newObj = new FromConcaveBody(
        Bodies.fromVertices(400, 80, vertexSets, null, true)
      ).setFillColor(colors[Math.floor(random(colors.length))]);
      matterObjs.push(newObj);
    });
  } else {
    console.log("Fetch is not available. Could not load SVG.");
  }

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
