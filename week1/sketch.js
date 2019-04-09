let video;
let poseNet;
let poses = [];
let wow = ["Wow", "Teknology", "So fancy", "Such future", "Cool", "Mashin learnin"]
let wowcolor = ["magenta", "cyan", "green", "red", "yellow", "lime", "blue"]


function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  poseNet = ml5.poseNet(video, function() {
    console.log("model ready");
  });
  poseNet.on('pose', function(results) {
    poses = results;
  });
  video.hide();
}


function draw() {
  image(video, 0, 0, width, height);
  frameRate(10);
  drawKeypoints();
}

function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      if (keypoint.score > 0.2) {
        fill(wowcolor[int(random(0,7))]);
        textAlign(CENTER, CENTER);
        noStroke();
        let leftEye = poses[0].pose.keypoints[1].position;
        let rightEye = poses[0].pose.keypoints[2].position;
        let leftEar = poses[0].pose.keypoints[3].position;
        let rightEar = poses[0].pose.keypoints[4].position;
        textFont("Comic Sans MS");
        push();
        textSize((leftEar.x - rightEar.x) * random(0.1, 0.3));
        text(wow[j], keypoint.position.x + random(-200, 200), keypoint.position.y + random(-200, 200));
        pop();
      }
    }
  }
}
