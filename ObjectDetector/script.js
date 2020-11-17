
let objectDetector;
let objects = [];
const videoElement = document.getElementById("video");
let video;
const canvas = document.getElementById("canvasElement");
let ctx;
const width = 640;
const height = 480;
const msg = document.getElementById("msg");

async function make() {
    msg.innerText = "Loading, please wait...";
    video = await getVideo();

    objectDetector = await ml5.objectDetector('cocossd', startDetecting)

    // canvas.width = 640;
    // canvas.height = 480;
    
    canvas.width = width;
    canvas.height = height;
    ;
    ctx = canvas.getContext('2d');
}
// webcam
async function getVideo() {
    // Create a webcam capture
    const capture = await navigator.mediaDevices.getUserMedia({ video: true })
    videoElement.srcObject = capture;
    videoElement.play();

    return videoElement
}

// when the dom is loaded, call make();
window.addEventListener('DOMContentLoaded', function () {
    make();
});

function startDetecting() {
    console.log('model ready')
    msg.innerText = "Detecting...";
    detect();
}

function detect() {
    objectDetector.detect(video, function (err, results) {
        if (err) {
            console.log(err);
            return
        }
        objects = results;

        if (objects) {
            draw();
        }

        detect();
    });
}

function draw() {
    // Clear part of the canvas
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, width, height);
    //ctx.fillRect(0, 0, 640, 480);

    ctx.drawImage(video, 0, 0);
    for (let i = 0; i < objects.length; i += 1) {

        ctx.font = "16px Arial";
        ctx.fillStyle = "green";
        ctx.fillText(objects[i].label, objects[i].x + 4, objects[i].y + 16);

        ctx.beginPath();
        ctx.rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.closePath();
    }
}
