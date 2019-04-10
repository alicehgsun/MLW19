// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
KNN Classification on Webcam Images with mobileNet. Built with p5.js
=== */
let video;
// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;

function setup() {
  // Create a featureExtractor that can extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);

  noCanvas();
  // Create a video element
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');
  // Create the UI buttons
  createButtons();
}

function modelReady(){
  select('#status').html('FeatureExtractor(mobileNet model) Loaded')
}

// Add the current frame from the video to the classifier
function addExample(label) {
  // Get the features of the input video
  const features = featureExtractor.infer(video);
  // You can also pass in an optional endpoint, defaut to 'conv_preds'
  // const features = featureExtractor.infer(video, 'conv_preds');
  // You can list all the endpoints by calling the following function
  // console.log('All endpoints: ', featureExtractor.mobilenet.endpoints)

  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  updateCounts();
}

// Predict the current frame.
function classify() {
  // Get the total number of labels from knnClassifier
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error('There is no examples in any label');
    return;
  }
  // Get the features of the input video
  const features = featureExtractor.infer(video);

  // Use knnClassifier to classify which label do these features belong to
  // You can pass in a callback function `gotResults` to knnClassifier.classify function
  knnClassifier.classify(features, gotResults);
  // You can also pass in an optional K value, K default to 3
  // knnClassifier.classify(features, 3, gotResults);

  // You can also use the following async/await function to call knnClassifier.classify
  // Remember to add `async` before `function predictClass()`
  // const res = await knnClassifier.classify(features);
  // gotResults(null, res);
}

// A util function to create UI buttons
function createButtons() {
  // When the A button is pressed, add the current frame
  // from the video with a label of "Right" to the classifier
  buttonA = select('#addClassRight');
  buttonA.mousePressed(function() {
    addExample('Right');
  });

  // When the B button is pressed, add the current frame
  // from the video with a label of "Left" to the classifier
  buttonB = select('#addClassLeft');
  buttonB.mousePressed(function() {
    addExample('Left');
  });

  // When the C button is pressed, add the current frame
  // from the video with a label of "Up" to the classifier
  buttonC = select('#addClassUp');
  buttonC.mousePressed(function() {
    addExample('Up');
  });

  buttonD = select('#addClassDown');
  buttonD.mousePressed(function() {
    addExample('Down');
  });

  // Reset buttons
  resetBtnA = select('#resetRight');
  resetBtnA.mousePressed(function() {
    clearLabel('Right');
  });

  resetBtnB = select('#resetLeft');
  resetBtnB.mousePressed(function() {
    clearLabel('Left');
  });

  resetBtnC = select('#resetUp');
  resetBtnC.mousePressed(function() {
    clearLabel('Up');
  });

  resetCtnC = select('#resetDown');
  resetCtnC.mousePressed(function() {
    clearLabel('Down');
  });

  // Predict button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);

  // Clear all classes button
  buttonClearAll = select('#clearAll');
  buttonClearAll.mousePressed(clearAllLabels);

  // Load saved classifier dataset
  buttonSetData = select('#load');
  buttonSetData.mousePressed(loadMyKNN);

  // Get classifier dataset
  buttonGetData = select('#save');
  buttonGetData.mousePressed(saveMyKNN);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      select('#result').html(result.label);
      select('#confidence').html(`${confidences[result.label] * 100} %`);
    }

    select('#confidenceRight').html(`${confidences['Right'] ? confidences['Right'] * 100 : 0} %`);
    select('#confidenceLeft').html(`${confidences['Left'] ? confidences['Left'] * 100 : 0} %`);
    select('#confidenceUp').html(`${confidences['Up'] ? confidences['Up'] * 100 : 0} %`);
    select('#confidenceDown').html(`${confidences['Down'] ? confidences['Down'] * 100 : 0} %`);
  }

  classify();
}

// Update the example count for each label
function updateCounts() {
  const counts = knnClassifier.getCountByLabel();

  select('#exampleRight').html(counts['Right'] || 0);
  select('#exampleLeft').html(counts['Left'] || 0);
  select('#exampleUp').html(counts['Up'] || 0);
  select('#exampleDown').html(counts['Down'] || 0);
}

// Clear the examples in one label
function clearLabel(label) {
  knnClassifier.clearLabel(label);
  updateCounts();
}

// Clear all the examples in all labels
function clearAllLabels() {
  knnClassifier.clearAllLabels();
  updateCounts();
}

// Save dataset as myKNNDataset.json
function saveMyKNN() {
  knnClassifier.save('myKNNDataset');
}

// Load dataset to the classifier
function loadMyKNN() {
  knnClassifier.load('myKNNDataset.json', updateCounts);
}
