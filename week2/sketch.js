// using KNN in snake game example by Prashant Gupta

let video;
// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;

function classify() {
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error('There is no examples in any label');
    return;
  }
  const features = featureExtractor.infer(video);
  knnClassifier.classify(features, gotResults);
}

function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      select('#status').html('Snake turns ' + result.label);
      select('#gesture').html(' with a confidence of ' + ` ${floor(confidences[result.label] * 100)} %`);
      document.querySelector('#gesture').style.color = "#777777"

      if (direction != 'right' && result.label == 'Left') {
        direction = 'left';
      } else if (direction != 'left' && result.label == 'Right') {
        direction = 'right';
      } else if (direction != 'down' && result.label == 'Up') {
        direction = 'up';
      } else if (direction != 'up' && result.label == 'Down') {
        direction = 'down';
      }

    }
  }

  classify();
}

var numSegments = 6;
var direction = 'right';

var xStart = 0;
var yStart = 250;
var diff = 10;

var xCor = [];
var yCor = [];

var xFruit = 0;
var yFruit = 0;

function modelReady() {
  select('#status').html('FeatureExtractor(mobileNet model) Loaded')
}

function setup() {
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  video = createCapture(VIDEO);
  video.parent('videoContainer');
  knnClassifier.load('data/myKNNDataset.json');

  createCanvas(windowWidth, windowHeight);
  frameRate(15);
  stroke(255);
  strokeWeight(10);
  updateFruitCoordinates();

  for (var i = 0; i < numSegments; i++) {
    xCor.push(xStart + (i * diff));
    yCor.push(yStart);
  }
  // slowing down for speech
  frameRate(4);
}

function draw() {
  background(0);
  for (var i = 0; i < numSegments - 1; i++) {
    line(xCor[i], yCor[i], xCor[i + 1], yCor[i + 1]);
  }
  updateSnakeCoordinates();
  checkGameStatus();
  checkForFruit();
  classify();
}


function updateSnakeCoordinates() {

  for (var i = 0; i < numSegments - 1; i++) {
    xCor[i] = xCor[i + 1];
    yCor[i] = yCor[i + 1];
  }
  switch (direction) {
    case 'right':
      xCor[numSegments - 1] = xCor[numSegments - 2] + diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'up':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] - diff;
      break;
    case 'left':
      xCor[numSegments - 1] = xCor[numSegments - 2] - diff;
      yCor[numSegments - 1] = yCor[numSegments - 2];
      break;
    case 'down':
      xCor[numSegments - 1] = xCor[numSegments - 2];
      yCor[numSegments - 1] = yCor[numSegments - 2] + diff;
      break;
  }
}

function checkGameStatus() {
  if (xCor[xCor.length - 1] > width ||
    xCor[xCor.length - 1] < 0 ||
    yCor[yCor.length - 1] > height ||
    yCor[yCor.length - 1] < 0 ||
    checkSnakeCollision()) {
    noLoop();
    document.querySelector('#status').textContent = 'Game Ended';
    document.querySelector('#status').textContent = '';
    document.querySelector('#status').style.color = "#FFFFFF";
  }
}

function checkSnakeCollision() {
  var snakeHeadX = xCor[xCor.length - 1];
  var snakeHeadY = yCor[yCor.length - 1];
  for (var i = 0; i < xCor.length - 1; i++) {
    if (xCor[i] === snakeHeadX && yCor[i] === snakeHeadY) {
      return true;
    }
  }
}

function checkForFruit() {
  point(xFruit, yFruit);
  if (xCor[xCor.length - 1] === xFruit && yCor[yCor.length - 1] === yFruit) {
    xCor.unshift(xCor[0]);
    yCor.unshift(yCor[0]);
    numSegments++;
    updateFruitCoordinates();
  }
}

function updateFruitCoordinates() {
  xFruit = floor(random(10, (width - 100) / 10)) * 10;
  yFruit = floor(random(10, (height - 100) / 10)) * 10;
}
