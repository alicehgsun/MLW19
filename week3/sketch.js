// Based on: Daniel Shiffman's Particles code & textToPoints instruction

// teachable machine
const checkpoint = 'CHECKPOINT URL';
const maxPredictions = 2;
const size = 400;
let model;
let video;
let canvas;
let weights = document.getElementById('weights');
let json = document.getElementById('json');
// teachable machine
var font;
var vehicles = [];
var bounds;

function preload() {
  font = loadFont('GT-Sectra-Display-Trial-Super.otf');
}

async function load() {
  model = await tm.mobilenet.load(checkpoint);
  console.log("Number of classes, ", getNumberOfClasses());
}

async function loadFiles() {
  let jsonFile = json.files[0];
  let weightsFile = weights.files[0];

  if(jsonFile != undefined && weightsFile != undefined) {
    console.log("model loaded from uploaded files");
    model = await tm.mobilenet.loadFromFiles(json.files[0], weights.files[0]);
    console.log("Number of classes, ", getNumberOfClasses());
  }
}

function getNumberOfClasses() {
  return model.model.outputShape[1];
}

async function setup() {
  // Call the load function, wait util it finishes loading
  await load();
  setupVideo();
  canvas = createCanvas(size, size);
  // createCanvas(windowWidth, windowHeight);
  // drawing text
  noStroke();
  var points = font.textToPoints('Focus', size/5.8, size/1.8, size/4, {
    sampleFactor: 2,
    simplifyThreshold: 0
  });
  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    vehicles.push(new Vehicle(pt.x, pt.y));
  }

  bounds = font.textBounds('particles', 50, 180);
}

function setupVideo() {
  video = createCapture(VIDEO);
  // video.parent('videoContainer');
  video.hide()
}


function draw() {
  if (video) {
  translate(size, 0);
  scale(-1.0, 1.0);

  image(video, 0, 0);

  predictVideo(canvas.elt);
  movetype();

}

}

async function predictVideo(image) {
  const prediction = await model.predict(image, maxPredictions);
  movetype(prediction[0].className);

  const res = select('#res');
  res.html(prediction[0].className);

  const prob = select('#prob');
  prob.html(ceil(prediction[0].probability*100)+'%');

  console.log(prediction[0])

}

function movetype(classs){
  background(0);
  if (classs==1) {
    for (let i = 0; i < vehicles.length; i++) {
      var v = vehicles[i];
      stroke(255,0,0);
      v.shatter();
      v.show();
    }
  } else{
    for (let i = 0; i < vehicles.length; i++) {
      var v = vehicles[i];
      stroke(random(255),random(255),random(255));
      v.update();
      v.show();
      v.behaviors();
    }
  }
}
