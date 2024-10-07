
// window.addEventListener('DOMContentLoaded', (event) => {

let gamespeed = 1
let mutationRate = .0
let smallMutationRate = .0
let hugeMutationRate = .0
let colorMutationRate = .0
let tankmax = 1280*.75
let tankmin =  1280*.25
let foodrate = 100
let slugin = {}
let slugout = {}
    const squaretable = {} // this section of code is an optimization for use of the hypotenuse function on Line and LineOP objects
    for(let t = 0;t<10000000;t++){
        squaretable[`${t}`] = Math.sqrt(t)
        if(t > 999){
            t+=9
        }
    }
    const gamepadAPI = {
        controller: {},
        turbo: true,
        connect: function (evt) {
            if (navigator.getGamepads()[0] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[1] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[2] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            } else if (navigator.getGamepads()[3] != null) {
                gamepadAPI.controller = navigator.getGamepads()[0]
                gamepadAPI.turbo = true;
            }
            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i] === null) {
                    continue;
                }
                if (!gamepads[i].connected) {
                    continue;
                }
            }
        },
        disconnect: function (evt) {
            gamepadAPI.turbo = false;
            delete gamepadAPI.controller;
        },
        update: function () {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.buttonsCache = [];// clear the buttons cache
            for (var k = 0; k < gamepadAPI.buttonsStatus.length; k++) {// move the buttons status from the previous frame to the cache
                gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
            }
            gamepadAPI.buttonsStatus = [];// clear the buttons status
            var c = gamepadAPI.controller || {}; // get the gamepad object
            var pressed = [];
            if (c.buttons) {
                for (var b = 0, t = c.buttons.length; b < t; b++) {// loop through buttons and push the pressed ones to the array
                    if (c.buttons[b].pressed) {
                        pressed.push(gamepadAPI.buttons[b]);
                    }
                }
            }
            var axes = [];
            if (c.axes) {
                for (var a = 0, x = c.axes.length; a < x; a++) {// loop through axes and push their values to the array
                    axes.push(c.axes[a].toFixed(2));
                }
            }
            gamepadAPI.axesStatus = axes;// assign received values
            gamepadAPI.buttonsStatus = pressed;
            // //////console.log(pressed); // return buttons for debugging purposes
            return pressed;
        },
        buttonPressed: function (button, hold) {
            var newPress = false;
            for (var i = 0, s = gamepadAPI.buttonsStatus.length; i < s; i++) {// loop through pressed buttons
                if (gamepadAPI.buttonsStatus[i] == button) {// if we found the button we're looking for...
                    newPress = true;// set the boolean variable to true
                    if (!hold) {// if we want to check the single press
                        for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {// loop through the cached states from the previous frame
                            if (gamepadAPI.buttonsCache[j] == button) { // if the button was already pressed, ignore new press
                                newPress = false;
                            }
                        }
                    }
                }
            }
            return newPress;
        },
        buttons: [
            'A', 'B', 'X', 'Y', 'LB', 'RB', 'Left-Trigger', 'Right-Trigger', 'Back', 'Start', 'Axis-Left', 'Axis-Right', 'DPad-Up', 'DPad-Down', 'DPad-Left', 'DPad-Right', "Power"
        ],
        buttonsCache: [],
        buttonsStatus: [],
        axesStatus: []
    };
    
let video_recorder
let recording = 0
    
//  function CanvasCaptureToWEBM(canvas, bitrate) {
//     // it uses the same canvas as the rest of the file.
//     // to start a recording call .record() on video_recorder
//     this.record = Record
//     this.stop = Stop
//     this.download = saveToDownloads
//     let blobCaptures = []
//     let outputFormat = {}
//     let recorder = {}
//     let canvasInput = canvas.captureStream()
//     if (typeof canvasInput == undefined || !canvasInput) {
//         return
//     }
//     const video = document.createElement('video')
//     video.style.display = 'none'
// 
// 
//     function Record() {
//         let formats = [
//             "video/webm\;codecs=h264",
//             "video/webm\;codecs=vp8",
//             'video/vp8',
//             "video/webm",
//             'video/webm,codecs=vp9',
//             "video/webm\;codecs=daala",
//             "video/mpeg"
//         ];
//         for (let t = 0; t < formats.length; t++) {
//             if (MediaRecorder.isTypeSupported(formats[t])) {
//                 outputFormat = formats[t]
//                 break
//             }
//         }
//         if (typeof outputFormat != "string") {
//             return
//         } else {
//             let videoSettings = {
//                 mimeType: outputFormat,
//                 videoBitsPerSecond: bitrate || 2000000
// 
//             };
//             blobCaptures = []
//             try {
//                 recorder = new MediaRecorder(canvasInput, videoSettings)
//             } catch (error) {
//                 return;
//             }
//             recorder.onstop = handleStop
//             recorder.ondataavailable = handleAvailableData
//             recorder.start(100)
//         }
//     }
// 
//     function handleAvailableData(event) {
//         if (event.data && event.data.size > 0) {
//             blobCaptures.push(event.data)
//         }
//     }
// 
//     function handleStop() {
//         const superBuffer = new Blob(blobCaptures, { type: outputFormat, duration: rectime })
//         video.src = window.URL.createObjectURL(superBuffer)
//     }
// 
//     function Stop() {
//         recorder.stop()
//         video.controls = true
//         video.duration = rectime
//     }
// 
//     function saveToDownloads(input) { // specifying a file name for the output
//         const name = input || 'video_out.webm'
//         const blob = new Blob(blobCaptures, { type: outputFormat, duration: rectime })
//         blob.duration = rectime
//         //////////////////////console.log(blob)
//         const url = window.URL.createObjectURL(blob)
//         const storageElement = document.createElement('a')
//         storageElement.style.display = 'none'
//         storageElement.href = url
//         storageElement.download = name
//         document.body.appendChild(storageElement)
//         storageElement.click()
//         setTimeout(() => {
//             document.body.removeChild(storageElement)
//             window.URL.revokeObjectURL(url)
//         }, 100)
//     }
// }



    let canvas
    let canvas_context
    let keysPressed = {}
    let FLEX_engine
    let TIP_engine = {}
    let XS_engine
    let YS_engine
    TIP_engine.x = 1000
    TIP_engine.y = 350
    class Point {
        constructor(x, y) {
            this.x = x
            this.y = y
            this.radius = 0
        }
        pointDistance(point) {
            return (new LineOP(this, point, "transparent", 0)).hypotenuse()
        }
    }

    class Vector{ // vector math and physics if you prefer this over vector components on circles
        constructor(object = (new Point(0,0)), xmom = 0, ymom = 0){
            this.xmom = xmom
            this.ymom = ymom
            this.object = object
        }
        isToward(point){
            let link = new LineOP(this.object, point)
            let dis1 = link.sqrDis()
            let dummy = new Point(this.object.x+this.xmom, this.object.y+this.ymom)
            let link2 = new LineOP(dummy, point)
            let dis2 = link2.sqrDis()
            if(dis2 < dis1){
                return true
            }else{
                return false
            }
        }
        rotate(angleGoal){
            let link = new Line(this.xmom, this.ymom, 0,0)
            let length = link.hypotenuse()
            let x = (length * Math.cos(this.angleGoal))
            let y = (length * Math.sin(this.angleGoal))
            this.xmom = x
            this.ymom = y
        }
        magnitude(){
            return (new Line(this.xmom, this.ymom, 0,0)).hypotenuse()
        }
        normalize(size = 1){
            let magnitude = this.magnitude()
            this.xmom/=magnitude
            this.ymom/=magnitude
            this.xmom*=size
            this.ymom*=size
        }
        multiply(vect){
            let point = new Point(0,0)
            let end = new Point(this.xmom+vect.xmom, this.ymom+vect.ymom)
            return point.pointDistance(end)
        }
        add(vect){
            return new Vector(this.object, this.xmom+vect.xmom, this.ymom+vect.ymom)
        }
        subtract(vect){
            return new Vector(this.object, this.xmom-vect.xmom, this.ymom-vect.ymom)
        }
        divide(vect){
            return new Vector(this.object, this.xmom/vect.xmom, this.ymom/vect.ymom) //be careful with this, I don't think this is right
        }
        draw(){
            let dummy = new Point(this.object.x+this.xmom, this.object.y+this.ymom)
            let link = new LineOP(this.object, dummy, "#FFFFFF", 1)
            link.draw()
        }
    }
    class Line {
        constructor(x, y, x2, y2, color, width) {
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        angle() {
            return Math.atan2(this.y1 - this.y2, this.x1 - this.x2)
        }
        squareDistance() {
            let xdif = this.x1 - this.x2
            let ydif = this.y1 - this.y2
            let squareDistance = (xdif * xdif) + (ydif * ydif)
            return squareDistance
        }
        hypotenuse() {
            let xdif = this.x1 - this.x2
            let ydif = this.y1 - this.y2
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
            if(hypotenuse < 10000000-1){
                if(hypotenuse > 1000){
                    return squaretable[`${Math.round(10*Math.round((hypotenuse*.1)))}`]
                }else{
                return squaretable[`${Math.round(hypotenuse)}`]
                }
            }else{
                return Math.sqrt(hypotenuse)
            }
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.x1, this.y1)
            canvas_context.lineTo(this.x2, this.y2)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }
    class LineOP {
        constructor(object, target, color, width) {
            this.object = object
            this.target = target
            this.color = color
            this.width = width
        }
        squareDistance() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let squareDistance = (xdif * xdif) + (ydif * ydif)
            return squareDistance
        }
        hypotenuse() {
            let xdif = this.object.x - this.target.x
            let ydif = this.object.y - this.target.y
            let hypotenuse = (xdif * xdif) + (ydif * ydif)
//             if(hypotenuse < 10000000-1){
//                 if(hypotenuse > 1000){
//                     return squaretable[`${Math.round(10*Math.round((hypotenuse*.1)))}`]
//                 }else{
//                 return squaretable[`${Math.round(hypotenuse)}`]
//                 }
//             }else{
                return Math.sqrt(hypotenuse)
//             }
        }
        angle() {
            return Math.atan2(this.object.y - this.target.y, this.object.x - this.target.x)
        }
        draw() {
            let linewidthstorage = canvas_context.lineWidth
            canvas_context.strokeStyle = this.color
            canvas_context.lineWidth = this.width
            canvas_context.beginPath()
            canvas_context.moveTo(this.object.x, this.object.y)
            canvas_context.lineTo(this.target.x, this.target.y)
            canvas_context.stroke()
            canvas_context.lineWidth = linewidthstorage
        }
    }
    class Triangle {
        constructor(x, y, color, length, fill = 0, strokeWidth = 0, leg1Ratio = 1, leg2Ratio = 1, heightRatio = 1) {
            this.x = x
            this.y = y
            this.color = color
            this.length = length
            this.x1 = this.x + this.length * leg1Ratio
            this.x2 = this.x - this.length * leg2Ratio
            this.tip = this.y - this.length * heightRatio
            this.accept1 = (this.y - this.tip) / (this.x1 - this.x)
            this.accept2 = (this.y - this.tip) / (this.x2 - this.x)
            this.fill = fill
            this.stroke = strokeWidth
        }
        draw() {
            canvas_context.strokeStyle = this.color
            canvas_context.stokeWidth = this.stroke
            canvas_context.beginPath()
            canvas_context.moveTo(this.x, this.y)
            canvas_context.lineTo(this.x1, this.y)
            canvas_context.lineTo(this.x, this.tip)
            canvas_context.lineTo(this.x2, this.y)
            canvas_context.lineTo(this.x, this.y)
            if (this.fill == 1) {
                canvas_context.fill()
            }
            canvas_context.stroke()
            canvas_context.closePath()
        }
        isPointInside(point) {
            if (point.x <= this.x1) {
                if (point.y >= this.tip) {
                    if (point.y <= this.y) {
                        if (point.x >= this.x2) {
                            this.accept1 = (this.y - this.tip) / (this.x1 - this.x)
                            this.accept2 = (this.y - this.tip) / (this.x2 - this.x)
                            this.basey = point.y - this.tip
                            this.basex = point.x - this.x
                            if (this.basex == 0) {
                                return true
                            }
                            this.slope = this.basey / this.basex
                            if (this.slope >= this.accept1) {
                                return true
                            } else if (this.slope <= this.accept2) {
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    }
    class Rectangle {
        constructor(x, y, width, height, color, fill = 1, stroke = 0, strokeWidth = 1) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
            this.stroke = stroke
            this.strokeWidth = strokeWidth
            this.fill = fill
        }
        draw() {
//             canvas_context.strokeStyle = "white"
            canvas_context.fillStyle = this.color
//             canvas_context.lineWidth = "1"
            canvas_context.fillRect(this.x, this.y, this.width, this.height)
//             canvas_context.strokeRect(this.x, this.y, this.width, this.height)
        }
        sdraw() {
            canvas_context.strokeStyle = "white"
            canvas_context.lineWidth = "6"
            canvas_context.strokeRect(this.x, this.y, this.width, this.height)
        }
        move() {
            this.x += this.xmom
            this.y += this.ymom
        }
        isPointInside(point) {
            if (point.x >= this.x) {
                if (point.y >= this.y) {
                    if (point.x <= this.x + this.width) {
                        if (point.y <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            if (point.x + point.radius >= this.x) {
                if (point.y + point.radius >= this.y) {
                    if (point.x - point.radius <= this.x + this.width) {
                        if (point.y - point.radius <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Circle {
        constructor(x, y, radius, color, xmom = 0, ymom = 0, friction = 1, reflect = 0, strokeWidth = 0, strokeColor = "transparent") {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.friction = friction
            this.reflect = reflect
            this.strokeWidth = strokeWidth
            this.strokeColor = strokeColor
        }
        ddraw(){
            
            guy.canvas_context.lineWidth = this.strokeWidth
            guy.canvas_context.strokeStyle = "black"
            guy.canvas_context.beginPath();
                guy.canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
                guy.canvas_context.fillStyle = this.color
                guy.canvas_context.fill()
//                 guy.canvas_context.stroke();
        }
        draw() {
            canvas_context.lineWidth = this.strokeWidth
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath();
            if (this.radius > 0) {
                canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
                canvas_context.fillStyle = this.color
                canvas_context.fill()
                canvas_context.stroke();
            } else {
                //////console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
            }
        }
        move() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
        }
        unmove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x -= this.xmom
            this.y -= this.ymom
        }
        frictiveMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
            this.xmom *= this.friction
            this.ymom *= this.friction
        }
        frictiveunMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.xmom /= this.friction
            this.ymom /= this.friction
            this.x -= this.xmom
            this.y -= this.ymom
        }
        isPointInside(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.radius * this.radius)) {
                return true
            }
            return false
        }
        doesPerimeterTouch(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= ((this.radius + point.radius) * (this.radius + point.radius))) {
                return true
            }
            return false
        }
    } 
    function circleLine(line, circle) {
    // Line start and end points
    let x1 = line.object.x;
    let y1 = line.object.y;
    let x2 = line.target.x;
    let y2 = line.target.y;

    // Circle center and radius
    let cx = circle.x;
    let cy = circle.y;
    let r = circle.radius;

    // Line segment variables
    let dx = x2 - x1;
    let dy = y2 - y1;

    // Compute the projection of the circle center onto the line
    let fx = x1 - cx;
    let fy = y1 - cy;

    // Coefficients of the quadratic equation
    let a = dx * dx + dy * dy;
    let b = 2 * (fx * dx + fy * dy);
    let c = (fx * fx + fy * fy) - r * r;

    // Discriminant to check for intersections
    let discriminant = b * b - 4 * a * c;

    if (discriminant >= 0) {
        // Check if the intersection point is on the line segment
        discriminant = Math.sqrt(discriminant);
        let t1 = (-b - discriminant) / (2 * a);
        let t2 = (-b + discriminant) / (2 * a);

        // If either t1 or t2 is between 0 and 1, there is an intersection
        if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
            return 1; // Intersection exists
        }
    }

    return 0; // No intersection
}
    class CircleRing {
        constructor(x, y, radius, color, xmom = 0, ymom = 0, friction = 1, reflect = 0, strokeWidth = 0, strokeColor = "transparent") {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.friction = friction
            this.reflect = reflect
            this.strokeWidth = 1
            this.strokeColor = strokeColor
        }
        draw() {
            canvas_context.lineWidth = this.strokeWidth
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath();
            if (this.radius > 0) {
                canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
                canvas_context.fillStyle = this.color
//                 canvas_context.fill()
                canvas_context.stroke();
            } else {
                //////console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
            }
        }
        move() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
        }
        unmove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x -= this.xmom
            this.y -= this.ymom
        }
        frictiveMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.x += this.xmom
            this.y += this.ymom
            this.xmom *= this.friction
            this.ymom *= this.friction
        }
        frictiveunMove() {
            if (this.reflect == 1) {
                if (this.x + this.radius > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y + this.radius > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.x - this.radius < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.y - this.radius < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.xmom /= this.friction
            this.ymom /= this.friction
            this.x -= this.xmom
            this.y -= this.ymom
        }
        isPointInside(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.radius * this.radius)) {
                return true
            }
            return false
        }
        doesPerimeterTouch(point) {
            this.areaY = point.y - this.y
            this.areaX = point.x - this.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= ((this.radius + point.radius) * (this.radius + point.radius))) {
                return true
            }
            return false
        }
    } class Polygon {
        constructor(x, y, size, color, sides = 3, xmom = 0, ymom = 0, angle = 0, reflect = 0) {
            if (sides < 2) {
                sides = 2
            }
            this.reflect = reflect
            this.xmom = xmom
            this.ymom = ymom
            this.body = new Circle(x, y, size - (size * .293), "transparent")
            this.nodes = []
            this.angle = angle
            this.size = size
            this.color = color
            this.angleIncrement = (Math.PI * 2) / sides
            this.sides = sides
            for (let t = 0; t < sides; t++) {
                let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                this.nodes.push(node)
                this.angle += this.angleIncrement
            }
        }
        isPointInside(point) { // rough approximation
            this.body.radius = this.size - (this.size * .293)
            if (this.sides <= 2) {
                return false
            }
            this.areaY = point.y - this.body.y
            this.areaX = point.x - this.body.x
            if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.body.radius * this.body.radius)) {
                return true
            }
            return false
        }
        move() {
            if (this.reflect == 1) {
                if (this.body.x > canvas.width) {
                    if (this.xmom > 0) {
                        this.xmom *= -1
                    }
                }
                if (this.body.y > canvas.height) {
                    if (this.ymom > 0) {
                        this.ymom *= -1
                    }
                }
                if (this.body.x < 0) {
                    if (this.xmom < 0) {
                        this.xmom *= -1
                    }
                }
                if (this.body.y < 0) {
                    if (this.ymom < 0) {
                        this.ymom *= -1
                    }
                }
            }
            this.body.x += this.xmom
            this.body.y += this.ymom
        }
        draw() {
            this.nodes = []
            this.angleIncrement = (Math.PI * 2) / this.sides
            this.body.radius = this.size - (this.size * .293)
            for (let t = 0; t < this.sides; t++) {
                let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
                this.nodes.push(node)
                this.angle += this.angleIncrement
            }
            canvas_context.strokeStyle = this.color
            canvas_context.fillStyle = this.color
            canvas_context.lineWidth = 0
            canvas_context.beginPath()
            canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
            for (let t = 1; t < this.nodes.length; t++) {
                canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
            }
            canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
            canvas_context.fill()
            canvas_context.strokeStyle = "black"
            canvas_context.stroke()
            canvas_context.closePath()
            canvas_context.fillStyle = "black"         
            canvas_context.font = "14px comic sans ms"   
            
            let sum = 0
            for(let t= 0;t<this.parent.dist.length;t++){
                sum += this.parent.dist[t]
            }
            
            
            if(hand.dieSel == this.parent && this.parent.rolled == 1){
                
                           canvas_context.font = "20px comic sans ms"   
            }
            
                           
                           
            canvas_context.fillText(sum +"/"+this.sides, this.body.x-15, this.body.y+5)
            
            
        }
    }
    class Shape {
        constructor(shapes) {
            this.shapes = shapes
        }
        draw() {
            for (let t = 0; t < this.shapes.length; t++) {
                this.shapes[t].draw()
            }
        }
        isPointInside(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].isPointInside(point)) {
                    return true
                }
            }
            return false
        }
        doesPerimeterTouch(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].doesPerimeterTouch(point)) {
                    return true
                }
            }
            return false
        }
        innerShape(point) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (this.shapes[t].doesPerimeterTouch(point)) {
                    return this.shapes[t]
                }
            }
            return false
        }
        isInsideOf(box) {
            for (let t = 0; t < this.shapes.length; t++) {
                if (box.isPointInside(this.shapes[t])) {
                    return true
                }
            }
            return false
        }
        adjustByFromDisplacement(x,y) {
            for (let t = 0; t < this.shapes.length; t++) {
                if(typeof this.shapes[t].fromRatio == "number"){
                    this.shapes[t].x+=x*this.shapes[t].fromRatio
                    this.shapes[t].y+=y*this.shapes[t].fromRatio
                }
            }
        }
        adjustByToDisplacement(x,y) {
            for (let t = 0; t < this.shapes.length; t++) {
                if(typeof this.shapes[t].toRatio == "number"){
                    this.shapes[t].x+=x*this.shapes[t].toRatio
                    this.shapes[t].y+=y*this.shapes[t].toRatio
                }
            }
        }
        mixIn(arr){
            for(let t = 0;t<arr.length;t++){
                for(let k = 0;k<arr[t].shapes.length;k++){
                    this.shapes.push(arr[t].shapes[k])
                }
            }
        }
        push(object) {
            this.shapes.push(object)
        }
    }

    class Spring {
        constructor(x, y, radius, color, body = 0, length = 1, gravity = 0, width = 1) {
            if (body == 0) {
                this.body = new Circle(x, y, radius, color)
                this.anchor = new Circle(x, y, radius, color)
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
                this.length = length
            } else {
                this.body = body
                this.anchor = new Circle(x, y, radius, color)
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
                this.length = length
            }
            this.gravity = gravity
            this.width = width
        }
        balance() {
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
            if (this.beam.hypotenuse() < this.length) {
                this.body.xmom += (this.body.x - this.anchor.x) / this.length
                this.body.ymom += (this.body.y - this.anchor.y) / this.length
                this.anchor.xmom -= (this.body.x - this.anchor.x) / this.length
                this.anchor.ymom -= (this.body.y - this.anchor.y) / this.length
            } else {
                this.body.xmom -= (this.body.x - this.anchor.x) / this.length
                this.body.ymom -= (this.body.y - this.anchor.y) / this.length
                this.anchor.xmom += (this.body.x - this.anchor.x) / this.length
                this.anchor.ymom += (this.body.y - this.anchor.y) / this.length
            }
            let xmomentumaverage = (this.body.xmom + this.anchor.xmom) / 2
            let ymomentumaverage = (this.body.ymom + this.anchor.ymom) / 2
            this.body.xmom = (this.body.xmom + xmomentumaverage) / 2
            this.body.ymom = (this.body.ymom + ymomentumaverage) / 2
            this.anchor.xmom = (this.anchor.xmom + xmomentumaverage) / 2
            this.anchor.ymom = (this.anchor.ymom + ymomentumaverage) / 2
        }
        draw() {
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
            this.beam.draw()
            this.body.draw()
            this.anchor.draw()
        }
        move() {
            this.anchor.ymom += this.gravity
            this.anchor.move()
        }

    }  
    class SpringOP {
        constructor(body, anchor, length, width = 3, color = body.color) {
            this.body = body
            this.anchor = anchor
            this.beam = new LineOP(body, anchor, color, width)
            this.length = length
        }
        balance() {
            if (this.beam.hypotenuse() < this.length) {
                this.body.xmom += ((this.body.x - this.anchor.x) / this.length) 
                this.body.ymom += ((this.body.y - this.anchor.y) / this.length) 
                this.anchor.xmom -= ((this.body.x - this.anchor.x) / this.length) 
                this.anchor.ymom -= ((this.body.y - this.anchor.y) / this.length) 
            } else if (this.beam.hypotenuse() > this.length) {
                this.body.xmom -= (this.body.x - this.anchor.x) / (this.length)
                this.body.ymom -= (this.body.y - this.anchor.y) / (this.length)
                this.anchor.xmom += (this.body.x - this.anchor.x) / (this.length)
                this.anchor.ymom += (this.body.y - this.anchor.y) / (this.length)
            }

            let xmomentumaverage = (this.body.xmom + this.anchor.xmom) / 2
            let ymomentumaverage = (this.body.ymom + this.anchor.ymom) / 2
            this.body.xmom = (this.body.xmom + xmomentumaverage) / 2
            this.body.ymom = (this.body.ymom + ymomentumaverage) / 2
            this.anchor.xmom = (this.anchor.xmom + xmomentumaverage) / 2
            this.anchor.ymom = (this.anchor.ymom + ymomentumaverage) / 2
        }
        draw() {
            this.beam.draw()
        }
        move() {
            //movement of SpringOP objects should be handled separate from their linkage, to allow for many connections, balance here with this object, move nodes independently
        }
    }

    class Color {
        constructor(baseColor, red = -1, green = -1, blue = -1, alpha = 1) {
            this.hue = baseColor
            if (red != -1 && green != -1 && blue != -1) {
                this.r = red
                this.g = green
                this.b = blue
                if (alpha != 1) {
                    if (alpha < 1) {
                        this.alpha = alpha
                    } else {
                        this.alpha = alpha / 255
                        if (this.alpha > 1) {
                            this.alpha = 1
                        }
                    }
                }
                if (this.r > 255) {
                    this.r = 255
                }
                if (this.g > 255) {
                    this.g = 255
                }
                if (this.b > 255) {
                    this.b = 255
                }
                if (this.r < 0) {
                    this.r = 0
                }
                if (this.g < 0) {
                    this.g = 0
                }
                if (this.b < 0) {
                    this.b = 0
                }
            } else {
                this.r = 0
                this.g = 0
                this.b = 0
            }
        }
        normalize() {
            if (this.r > 255) {
                this.r = 255
            }
            if (this.g > 255) {
                this.g = 255
            }
            if (this.b > 255) {
                this.b = 255
            }
            if (this.r < 0) {
                this.r = 0
            }
            if (this.g < 0) {
                this.g = 0
            }
            if (this.b < 0) {
                this.b = 0
            }
        }
        randomLight() {
            var letters = '0123456789ABCDEF';
            var hash = '#';
            for (var i = 0; i < 6; i++) {
                hash += letters[(Math.floor(Math.random() * 12) + 4)];
            }
            var color = new Color(hash, 55 + Math.random() * 100, 55 + Math.random() * 100, 55 + Math.random() * 100)
            return color;
        }
        randomDark() {
            var letters = '0123456789ABCDEF';
            var hash = '#';
            for (var i = 0; i < 6; i++) {
                hash += letters[(Math.floor(Math.random() * 12))];
            }
            var color = new Color(hash, Math.random() * 100, Math.random() * 100, Math.random() * 100)
            return color;
        }
        random() {
            var letters = '0123456789ABCDEF';
            var hash = '#';
            for (var i = 0; i < 6; i++) {
                hash += letters[(Math.floor(Math.random() * 16))];
            }
            var color = new Color(hash, Math.random() * 255, Math.random() * 255, Math.random() * 255)
            return color;
        }
    }
    class Softbody { //buggy, spins in place
        constructor(x, y, radius, color, size, members = 10, memberLength = 5, force = 10, gravity = 0) {
            this.springs = []
            this.pin = new Circle(x, y, radius, color)
            this.points = []
            this.flop = 0
            let angle = 0
            this.size = size 
            let line = new Line((Math.cos(this.angle)*size), (Math.sin(this.angle)*size), (Math.cos(this.angle+ ((Math.PI*2)/members))*size), (Math.sin(this.angle+ ((Math.PI*2)/members))*size) )
            let distance = line.hypotenuse()
            for(let t =0;t<members;t++){
                let circ = new Circle(x+(Math.cos(this.angle)*size), y+(Math.sin(this.angle)*size), radius, color)
                circ.reflect = 1
                circ.bigbody = new Circle(x+(Math.cos(this.angle)*size), y+(Math.sin(this.angle)*size), distance, color)
                circ.draw()
                circ.touch = []
                this.points.push(circ)
                angle += ((Math.PI*2)/members)
            }

            for(let t =0;t<this.points.length;t++){
                for(let k =0;k<this.points.length;k++){
                    if(t!=k){
                        if(this.points[k].bigbody.doesPerimeterTouch(this.points[t])){
                        if(!this.points[k].touch.includes(t) && !this.points[t].touch.includes(k)){
                                let spring = new SpringOP(this.points[k], this.points[t], (size*Math.PI)/members, 2, color)
                                this.points[k].touch.push(t)
                                this.points[t].touch.push(k)
                                this.springs.push(spring)
                                spring.beam.draw()
                            }
                        }
                    }
                }
            }

            //////console.log(this)

            // this.spring = new Spring(x, y, radius, color, this.pin, memberLength, gravity)
            // this.springs.push(this.spring)
            // for (let k = 0; k < members; k++) {
            //     this.spring = new Spring(x, y, radius, color, this.spring.anchor, memberLength, gravity)
            //     if (k < members - 1) {
            //         this.springs.push(this.spring)
            //     } else {
            //         this.spring.anchor = this.pin
            //         this.springs.push(this.spring)
            //     }
            // }
            this.forceConstant = force
            this.centroid = new Circle(0, 0, 10, "red")
        }
        circularize() {
            this.xpoint = 0
            this.ypoint = 0
            for (let s = 0; s < this.springs.length; s++) {
                this.xpoint += (this.springs[s].anchor.x / this.springs.length)
                this.ypoint += (this.springs[s].anchor.y / this.springs.length)
            }
            this.centroid.x = this.xpoint
            this.centroid.y = this.ypoint
            this.angle = 0
            this.angleIncrement = (Math.PI * 2) / this.springs.length
            for (let t = 0; t < this.points.length; t++) {
                this.points[t].x = this.centroid.x + (Math.cos(this.angle) * this.forceConstant)
                this.points[t].y = this.centroid.y + (Math.sin(this.angle) * this.forceConstant)
                this.angle += this.angleIncrement 
            }
        }
        balance() {
            this.xpoint = 0
            this.ypoint = 0
            for (let s = 0; s < this.points.length; s++) {
                this.xpoint += (this.points[s].x / this.points.length)
                this.ypoint += (this.points[s].y / this.points.length)
            }
            this.centroid.x = this.xpoint
            this.centroid.y = this.ypoint
            // this.centroid.x += TIP_engine.x / this.points.length
            // this.centroid.y += TIP_engine.y / this.points.length
            for (let s = 0; s < this.points.length; s++) {
                this.link = new LineOP(this.points[s], this.centroid, 0, "transparent")
                if (this.link.hypotenuse() != 0) {

                    if(this.size < this.link.hypotenuse()){
                        this.points[s].xmom -= (Math.cos(this.link.angle())*(this.link.hypotenuse())) * this.forceConstant*.1
                        this.points[s].ymom -= (Math.sin(this.link.angle())*(this.link.hypotenuse())) * this.forceConstant*.1
                    }else{
                        this.points[s].xmom += (Math.cos(this.link.angle())*(this.link.hypotenuse())) * this.forceConstant*.1
                        this.points[s].ymom += (Math.sin(this.link.angle())*(this.link.hypotenuse())) * this.forceConstant*.1
                    }

                    // this.points[s].xmom += (((this.points[s].x - this.centroid.x) / (this.link.hypotenuse()))) * this.forceConstant
                    // this.points[s].ymom += (((this.points[s].y - this.centroid.y) / (this.link.hypotenuse()))) * this.forceConstant
                }
            }
            if(this.flop%2 == 0){
                for (let s =  0; s < this.springs.length; s++) {
                    this.springs[s].balance()
                }
            }else{
                for (let s = this.springs.length-1;s>=0; s--) {
                    this.springs[s].balance()
                }
            }
            for (let s = 0; s < this.points.length; s++) {
                this.points[s].move()
                this.points[s].draw()
            }
            for (let s =  0; s < this.springs.length; s++) {
                this.springs[s].draw()
            }
            this.centroid.draw()
        }
    }
    class Observer {
        constructor(x, y, radius, color, range = 100, rays = 10, angle = (Math.PI * .125)) {
            this.body = new Circle(x, y, radius, color)
            this.color = color
            this.ray = []
            this.rayrange = range
            this.globalangle = Math.PI
            this.gapangle = angle
            this.currentangle = 0
            this.obstacles = []
            this.raymake = rays
        }
        beam() {
            this.currentangle = this.gapangle / 2
            for (let k = 0; k < this.raymake; k++) {
                this.currentangle += (this.gapangle / Math.ceil(this.raymake / 2))
                let ray = new Circle(this.body.x, this.body.y, 1, "white", (((Math.cos(this.globalangle + this.currentangle)))), (((Math.sin(this.globalangle + this.currentangle)))))
                ray.collided = 0
                ray.lifespan = this.rayrange - 1
                this.ray.push(ray)
            }
            for (let f = 0; f < this.rayrange; f++) {
                for (let t = 0; t < this.ray.length; t++) {
                    if (this.ray[t].collided < 1) {
                        this.ray[t].move()
                        for (let q = 0; q < this.obstacles.length; q++) {
                            if (this.obstacles[q].isPointInside(this.ray[t])) {
                                this.ray[t].collided = 1
                            }
                        }
                    }
                }
            }
        }
        draw() {
            this.beam()
            this.body.draw()
            canvas_context.lineWidth = 1
            canvas_context.fillStyle = this.color
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath()
            canvas_context.moveTo(this.body.x, this.body.y)
            for (let y = 0; y < this.ray.length; y++) {
                canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
                canvas_context.lineTo(this.body.x, this.body.y)
            }
            canvas_context.stroke()
            canvas_context.fill()
            this.ray = []
        }
    }
    function setUp(canvas_pass, style = "#000900") {
        canvas = canvas_pass
        canvas_context = canvas.getContext('2d');
        canvas_context.scale(2,2)
        canvas_context.translate(-320,-320)
        
    canvas.ondrop = dropHandler

    canvas.ondragover = function (e) {
        e.preventDefault();
        
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
                const canvasRect = canvas.getBoundingClientRect();

    // Calculate pointer position relative to the canvas size
     XS_engine = (e.clientX - canvasRect.left) * (canvas.width / canvasRect.width);
     YS_engine = (e.clientY - canvasRect.top) * (canvas.height / canvasRect.height);

            TIP_engine.x = (XS_engine/2)+320
            TIP_engine.y = (YS_engine/2)+320
            TIP_engine.body = TIP_engine
        return false;
    };
  
    function dropHandler(ev) { 
        const reader = new FileReader();


        //////////////////console.log('File(s) dropped');

        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    const file = ev.dataTransfer.items[i].getAsFile();
                    //////////////////console.log('... file[' + i + '].name = ' + file.name);
                    //   //////////////////console.log((file.text()))
                    file.text().then(result => {
                        if(slugout.made == 0){
                        }else{
                            slugout = slugin
                        }
                        eval(result)
                        if(slugout.made == 0){
                        addSlug(slugin, slugout)
                        }else{
                        }
                        /*
                        vessel.scrap = 10000
                        vessel.weapons.push(new Weapon(1)
                        vessel.weapons.push(new Weapon(2)
                        vessel.weapons.push(new Weapon(3)
                        vessel.weapons.push(new Weapon(4)
                        enemy.hull = 0
                        */
                    }).catch(err => {
                        // process error here
                    });
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.files.length; i++) {
                //////////////////console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
            }
        }
    }
 
        
//     video_recorder = new CanvasCaptureToWEBM(canvas, 5000000);
        canvas.style.background = style
//         window.setInterval(function () {
//             main()
//         },1)
function update() {
for(let t= 0;t<gamespeed;t++){

    smain();  // Call the main function
}
main();
    requestAnimationFrame(update);  // Request the next frame
}

// Start the animation loop
requestAnimationFrame(update);
        document.addEventListener('keydown', (event) => {
            keysPressed[event.key] = true;
            
    if(keysPressed['c']){
        cn++
        keysPressed['c'] = false
    }
        });
        document.addEventListener('keyup', (event) => {
            delete keysPressed[event.key];
        });
        window.addEventListener('pointerdown', e => {
            FLEX_engine = canvas.getBoundingClientRect();
            XS_engine = e.clientX - FLEX_engine.left;
            YS_engine = e.clientY - FLEX_engine.top;
                const canvasRect = canvas.getBoundingClientRect();

    // Calculate pointer position relative to the canvas size
     XS_engine = (e.clientX - canvasRect.left) * (canvas.width / canvasRect.width);
     YS_engine = (e.clientY - canvasRect.top) * (canvas.height / canvasRect.height);

            TIP_engine.x = (XS_engine/2)+320
            TIP_engine.y = (YS_engine/2)+320
            TIP_engine.body = TIP_engine
            let dot = new Circle(TIP_engine.x, TIP_engine.y, 5, "red")
            dot.draw()
//             hand.check(TIP_engine)

// if(start == 0){
// start = 1
// return
// }
        let l = new LineOP(TIP_engine, TIP_engine)
        
        for(let t = 0;t<animals.length;t++){
            l.target = animals[t].body
            if(l.hypotenuse() < 10){
                if(animals[t].held != 1){
                animals[t].held = 1
                return
                }
            }
        }
        
        for(let t= 0;t<animals.length;t++){
            if(animals[t].held == 1){
                animals[t].held = 0
                return
            }
        }
//         avey.check(TIP_engine)

//         scanner.stretch(TIP_engine)
            // example usage: if(object.isPointInside(TIP_engine)){ take action }
        });
        window.addEventListener('pointermove', continued_stimuli);

        window.addEventListener('pointerup', e => {
            // window.removeEventListener("pointermove", continued_stimuli);
        })
        function continued_stimuli(e) {
            FLEX_engine = canvas.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();
     XS_engine = (e.clientX - canvasRect.left) * (canvas.width / canvasRect.width);
     YS_engine = (e.clientY - canvasRect.top) * (canvas.height / canvasRect.height);

            TIP_engine.x = (XS_engine/2)+320
            TIP_engine.y = (YS_engine/2)+320
            TIP_engine.body = TIP_engine
//             hand.subCheck(TIP_engine)

//         scanner.stretch(TIP_engine)


//         avey.check(TIP_engine)
            
        }
    }
    
    
function exportJSON(originalData) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["slugin = "  + JSON.stringify(originalData, null, 2)], {
        type: "js"
    }));
    a.setAttribute("download", "slug_contender.js");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


    function gamepad_control(object, speed = 1) { // basic control for objects using the controler
//         //////console.log(gamepadAPI.axesStatus[1]*gamepadAPI.axesStatus[0]) //debugging
        if (typeof object.body != 'undefined') {
            if(typeof (gamepadAPI.axesStatus[1]) != 'undefined'){
                if(typeof (gamepadAPI.axesStatus[0]) != 'undefined'){
                object.body.x += (gamepadAPI.axesStatus[0] * speed)
                object.body.y += (gamepadAPI.axesStatus[1] * speed)
                }
            }
        } else if (typeof object != 'undefined') {
            if(typeof (gamepadAPI.axesStatus[1]) != 'undefined'){
                if(typeof (gamepadAPI.axesStatus[0]) != 'undefined'){
                object.x += (gamepadAPI.axesStatus[0] * speed)
                object.y += (gamepadAPI.axesStatus[1] * speed)
                }
            }
        }
    }
    function control(object, speed = 1) { // basic control for objects
        if (typeof object.body != 'undefined') {
            if (keysPressed['w']) {
                object.body.ymom -= speed
            }
            if (keysPressed['d']) {
                object.body.xmom += speed
            }
            if (keysPressed['s']) {
                object.body.ymom += speed
            }
            if (keysPressed['a']) {
                object.body.xmom -= speed
            }
        } else if (typeof object != 'undefined') {
            if (keysPressed['w']) {
                object.ymom -= speed
            }
            if (keysPressed['d']) {
                object.xmom += speed
            }
            if (keysPressed['s']) {
                object.ymom += speed
            }
            if (keysPressed['a']) {
                object.xmom -= speed
            }
        }
    }
    function getRandomLightColor() { // random color that will be visible on  black background
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 12) + 4)];
        }
        return color;
    }
    function getRandomColor() { // random color
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 16) + 0)];
        }
        return color;
    }
    function getRandomDarkColor() {// color that will be visible on a black background
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[(Math.floor(Math.random() * 12))];
        }
        return color;
    }
    function castBetween(from, to, granularity = 10, radius = 1) { //creates a sort of beam hitbox between two points, with a granularity (number of members over distance), with a radius defined as well
            let limit = granularity
            let shape_array = []
            for (let t = 0; t < limit; t++) {
                let circ = new Circle((from.x * (t / limit)) + (to.x * ((limit - t) / limit)), (from.y * (t / limit)) + (to.y * ((limit - t) / limit)), radius, "red")
                circ.toRatio = t/limit
                circ.fromRatio = (limit-t)/limit
                shape_array.push(circ)
            }
            return (new Shape(shape_array))
    }

    let setup_canvas = document.getElementById('canvas') //getting canvas from document

    setUp(setup_canvas) // setting up canvas refrences, starting timer. 

    // object instantiation and creation happens here 
    
    
    class Bullet {
        constructor(x,y, angle){
            this.x = x
            this.y = y
            this.angle = angle
            this.z = .01
            this.time = 0
            this.shot = new Circle(x,y,2, "#FFDD11", Math.cos(this.angle)*5, Math.sin(this.angle)*5)
        this.angle += ((Math.random()-.5)/2)
        }
        ddraw(){
            if(this.drawn != 1){
                if(Math.random() < .3){
                    
                this.drawn = 1
                }
            let circle2 = new Circle(this.x+1, this.y+2, 2, "#00000088")
            circle2.ddraw() 
            let circle = new Circle(this.x, this.y, 6, "#aa6600")
            circle.ddraw()      
            
            }
        }
        shaddraw(){
            
            if(this.z <= 0 ){
                if(Math.random() <.1){
                this.ddraw()
                return
                }
            }
             if(this.drawn == 1){
                return
            }

                this.time += .0075 + (Math.random()/100)
            let shadx = (Math.cos(this.angle)*this.z*10)*(Math.cos(this.angle)*this.z*1)
            let shady = (Math.sin(this.angle)*this.z*10)*(Math.sin(this.angle)*this.z*1)
            this.z += this.time - (this.time*this.time)
             if(this.z <= 0){
                this.z = 0
          }
            this.x -= Math.cos(this.angle) + ((Math.random()-.5)/2)
            this.y -= Math.sin(this.angle) + ((Math.random()-.5)/2)
            let circle = new Circle(this.x, this.y, 6, "#00000088")
            circle.draw()
            
        }
        draw(){
            if(this.z <= 0 ){
                if(Math.random() <.015){
                this.ddraw()
                return
                }
            }
             if(this.drawn == 1){
                return
            }
            let p = new Point(this.shot.x, this.shot.y)
            
            this.shot.move()
//             this.shot.draw()
//             let l = new LineOP(p, this.shot, "yellow", 3)
//             l.draw()
//             this.shot.y += 15
//             this.shot.color = "#00000088"
//             this.shot.draw()
//             this.shot.y -= 15
//             this.shot.color = "#FFDD11"
    
            
            let circle = new Circle(this.x, this.y-(10*this.z), 6, "#aa6600")
            circle.draw()       
        }
    }
    
    class Guy {
        constructor(){
            this.body = new Circle(360,360,10,"pink")
            this.canvas = document.createElement('canvas');
            this.canvas.width = 720
            this.canvas.height = 720
            this.canvas_context = this.canvas.getContext('2d');
            this.bullets = []
            for(let t = 0;t<1;t++){
                this.bullets.push(new Bullet(this.body.x, this.body.y, 0))
            }
//             document.body.appendChild(this.canvas);
        }
        draw(){
            control(this.body, .9)
            canvas_context.drawImage(this.canvas,0,0)
            this.body.draw()
            if(keysPressed[' '] && Math.random()<1){
            for(let t = 0;t<1;t++){
                this.bullets.push(new Bullet(this.body.x, this.body.y, (new LineOP(TIP_engine, this.body)).angle()))
            }
            }
            
            for(let t = 0;t<this.bullets.length;t++){
                this.bullets[t].shaddraw()
            }
            for(let t = 0;t<this.bullets.length;t++){
                this.bullets[t].draw()
                if(this.bullets[t].drawn != 1 && t > 0){
                    let xmom = (this.bullets[t-1].shot.xmom + this.bullets[t].shot.xmom)/2
                    let ymom = (this.bullets[t-1].shot.ymom + this.bullets[t].shot.ymom)/2
                    this.bullets[t-1].shot.ymom = ymom
                    this.bullets[t-1].shot.xmom = xmom
                    this.bullets[t].shot.ymom = ymom
                    this.bullets[t].shot.xmom = xmom
                    let l = new LineOP(this.bullets[t].shot, this.bullets[t-1].shot, "#FFFF0088",3)
                    l.draw()
                }
            }
        }
    }

// let guy = new Guy()


    function calculateSilverWeight(x,y,z){
        let vol = x*y*z
        let mass = vol*10.49
        //////console.log(vol+" cubic centimeters", mass+ " grams", (mass/28.3495)+"oz")
    }

    let x = 0
    let y = 0
    let z = 0

    calculateSilverWeight(x,y,z)
function indexer(t) {
    let p = {};
    p.x = (t / 4) % 720;
    p.y = Math.floor(t / (4 * 720));
    
    return p;
}
function tout(x, y) {
    return Math.round(Math.floor((y * 720 + x) * 4));
}

   let pom = new Image()
   pom.src = "newbl.png"
   
   canvas_context.drawImage(pom, 0,0,pom.width,pom.height,0,0,720,720)
let pix = canvas_context.getImageData(0,0,720,720)
 let pix2 = canvas_context.getImageData(0,0,720,720)
   let d = pix.data
   let d2 = pix2.data
   let c = 0
   canvas_context.drawImage(pom, 0,0,pom.width,pom.height,0,0,720,720)
   pix = canvas_context.getImageData(0,0,720,720)
   
//         for(let t= 0;t<d.length;t+=4){
//             c+=.004
//                 d[t] = 1*((t%(720*4))/(720*4))*360
//                 d[t+1] = 1*(c/10)
//                 d[t+2] = 1*(c/10)*((t%(720*4))/(720*4))*255
//                 d[t+3] = 255
//                 
//                 if(t > d.length*0){
//                     
//                 d[t] = 0
//                 d[t+1] =255
//                 d[t+2] = 255
//                 d[t+3] = 255
//                 }
//                 if(t > d.length*.17){
//                     
//                 d[t] = 255
//                 d[t+1] =0
//                 d[t+2] = 255
//                 d[t+3] = 255
//                 }
//                 if(t > d.length*.34){
//                     
//                 d[t] = 255
//                 d[t+1] =255
//                 d[t+2] =0
//                 d[t+3] = 255
//                 }
//                 
//                 
//                 if(t > d.length*.5){
//                     
//                 d[t] = 0
//                 d[t+1] =255
//                 d[t+2] = 255
//                 d[t+3] = 255
//                 }
//                 if(t > d.length*.67){
//                     
//                 d[t] = 255
//                 d[t+1] =0
//                 d[t+2] = 255
//                 d[t+3] = 255
//                 }
//                 if(t > d.length*.85){
//                     
//                 d[t] = 255
//                 d[t+1] =255
//                 d[t+2] =0
//                 d[t+3] = 255
//                 }
//                 d2[t] = Math.random()*255
//                 d2[t+1] = Math.random()*255
//                 d2[t+2] = Math.random()*255
//                 d2[t+3] = 255
//         }   
//         canvas_context.putImageData(pix,0,0)
    let angle = 0
    let step = Math.PI/100
    let lf = new Circle(360, 360, 3600)
    
    let egg2 = new Image()
    egg2.src = "eggbar2.png"
    let egg = new Image()
    egg.src = "eggbar.png"
    
    let growrate = 10
    let cn = 3
    
    canvas_context.imageSmoothingEnabled = true
    
    let stats =  []// [.9,.8,.3,.75,.8,.3,.5]
    let center = new Point(360,360)
    let outerColor = "red"
    let innerColor = "white"
    
    
    class Knocktapus {
        constructor(){
            this.body = new Circle(360,360, 10, "purple")
            this.body.friction = .99
            this.tentacleEnds = []
            this.angle = 0
            for(let t= 0;t<8;t++){
                this.angle += Math.PI/4
                let circ = new Circle(360+(Math.cos(this.angle)*20), 360+(Math.sin(this.angle)*20), 3, "purple")
                circ.link = new LineOP(circ,this.body)
                this.tentacleEnds.push(circ)
            }
        }
        draw(){
            this.body.draw()
            for(let t= 0;t<8;t++){
                this.tentacleEnds[t].draw()
            }
            control(this.body, .1)
            this.body.frictiveMove()
            
            for(let t= 0;t<8;t++){
                if(this.tentacleEnds[t].link.hypotenuse() < 100){
                this.tentacleEnds[t].x += this.body.xmom
                this.tentacleEnds[t].y += this.body.ymom
                }else{
                this.tentacleEnds[t].x += this.body.xmom*1.1
                this.tentacleEnds[t].y += this.body.ymom*1.1
                }
            }
        }
    }
    
//     let nock = new Knocktapus()

    let handimg = new Image()
    handimg.src = "handeaux.png"
    
    let bodies = []
    for(let t= 0;t<100;t++){
        bodies.push(new Polygon(360, 360, 25, getRandomColor(), t))
    }
    
    
    
    
    
    class EnemyDice {
        constructor(sides, dist, ord = 0, ){
            this.sides = sides 
            this.dist = [...dist]
            this.body = new Polygon(1100, 360, 20, getRandomColor(), sides)
            this.body.parent = this
            this.realBody = new Rectangle(900, 360-(ord*100), 48,48)
            this.color = getRandomColor()
            this.realBody.color = this.color
            this.flags = []
            this.rolled = 0
            this.die = 1
        }
        rollx(){
            let face = Math.floor(Math.random()*this.sides)
            return {d:this.dist[this.upface], f:this.flags}
        }
        draw(){
               this.moving--
                    if(this.moving > 0){
                     
                    this.body.move()
                    }
            if(this.rewarded == 1){
            this.realBody.draw()
            }else{
                this.body.draw()
            }
            if(this.read == 1){
             if(this.rolled == 1){
                 
                           canvas_context.font = "20px comic sans ms"   
                canvas_context.fillStyle = "white"
                canvas_context.fillRect((this.body.body.x+50)-15, (this.body.body.y+5)-30, canvas_context.measureText(this.dist[this.upface]).width + 45, 50)
                
                canvas_context.fillStyle = "black"
                if(this.rollx().f.includes("healing")){
                    
                canvas_context.fillStyle = "green"
                }
                
                
                     canvas_context.fillText(this.dist[this.upface], this.body.body.x+50, this.body.body.y+5)
                    
                    
                 
              }else{
                  
                           canvas_context.font = "20px comic sans ms"   
                canvas_context.fillStyle = "white"
                canvas_context.fillRect((this.body.body.x+50)-15, (this.body.body.y+5)-30, canvas_context.measureText(this.dist).width + 45, 50)
                canvas_context.fillStyle = "black"
                
                     canvas_context.fillText(this.dist, this.body.body.x+50, this.body.body.y+5)
                    
                    
                }
            }
            if(this.read == 2){
                           canvas_context.font = "20px comic sans ms"   
                canvas_context.fillStyle = "white"
                canvas_context.fillRect((this.realBody.x+50)-15, (this.realBody.y+5)-30, canvas_context.measureText(this.dist).width + 45, 50)
                canvas_context.fillStyle = "black"
                     canvas_context.fillText(this.dist, this.realBody.x+50, this.realBody.y+5)
                    
                    
            }
            
             if(this.rolled == 1){
//                 if(this.body.isPointInside(point)){
                hand.enemies[0].dieSel = this
                hand.enemies[0].enemSel = hand
                if(hand.enemies[0].enemSel.health > 0 && this.moving <= -30){
                    this.rolled = 0
                    this.body.body.x += 400
                    
                    
                    hand.enemies[0].enemSel.health -= this.dist[this.upface]
                    hand.enemies[0].dieSel = {}
                }
//                 }
            }
        }
        invdraw(){
            
        }
        subCheck(point){
            if(this.rewarded == 1){
                if(this.realBody.isPointInside(point)){
                    this.dist = this.dist.sort((a,b) => a>b?-1:1)
                        this.read = 2
                }else{
                      this.read = 0

                }
                return
            }else{
                if(this.body.body.isPointInside(point)){
                    this.dist = this.dist.sort((a,b) => a>b?-1:1)
                        this.read = 1
                }else{
                      this.read = 0

                }
            }
            
        }
        check(point){
            if(this.rewarded == 1){
                if(this.realBody.isPointInside(point)){
                    this.rewarded = 0
//                     hand.rewards = []
//                     hand.reward(this)
//             hand.generateReward()
                    return
                }
            }
        }
        roll(){
            if(this.rolled != 1){
                
                
            this.upface = Math.floor(Math.random()*this.sides)
            this.rolled = 1
            this.body.xmom = -12
            this.moving = 33
            
            }
        }
    }




    
    class Dice {
        constructor(sides, dist, ord = 0, flaglist = []){
            this.sides = sides 
            this.dist = [...dist]
            this.flagDist = []
            this.flaglist = flaglist
            for(let t = 0;t<dist.length;t++){
                if(Math.random()< .05){ //.05 is 1/20 
                    this.flagDist[t] = "healing" 
                }else {
                    if(this.flaglist.length > 0){
                           this.flagDist[t] = this.flaglist[Math.floor(Math.random()*this.flaglist.length)]
                    }
                }
            }
            
            
            this.body = new Polygon(100, 360, 20, getRandomColor(), sides)
            this.body.parent = this
            this.realBody = new Rectangle(500, 360-(ord*100), 48,48)
            this.color = getRandomColor()
            this.realBody.color = this.color
            this.flags = ["healing" ]
            this.rolled = 0
            this.die = 1
            this.moving = 0
        }
        rollx(){
            let face = Math.floor(Math.random()*this.sides)
            let falseFlags = [...this.flags]
            if(this.flags[this.upface] != this.flagDist){
               falseFlags[this.upface] =  this.flagDist
                }
            return {d:this.dist[this.upface], f:falseFlags}
        }
        draw(){
                        this.moving--
                    if(this.moving > 0){
                    this.body.move()
                    }
            if(this.rewarded == 1){
            this.realBody.draw()
            }else{
                
                this.body.draw()
            }
            if(this.read == 1){
             if(this.rolled == 1){
                 
                           canvas_context.font = "20px comic sans ms"   
                canvas_context.fillStyle = "white"
                canvas_context.fillRect((this.body.body.x+50)-15, (this.body.body.y+5)-30, canvas_context.measureText(this.dist[this.upface]).width + 45, 50)
                canvas_context.fillStyle = "black"
                canvas_context.fillStyle = "black"
                if(this.rollx().f.includes("healing")){
                    
                canvas_context.fillStyle = "green"
                }
                
                
                     canvas_context.fillText(this.dist[this.upface], this.body.body.x+50, this.body.body.y+5)
                    
                    
                 
              }else{
                  
                           canvas_context.font = "20px comic sans ms"   
                canvas_context.fillStyle = "white"
                canvas_context.fillRect((this.body.body.x+50)-15, (this.body.body.y+5)-30, canvas_context.measureText(this.dist).width + 45, 50)
                canvas_context.fillStyle = "black"
                
                     canvas_context.fillText(this.dist, this.body.body.x+50, this.body.body.y+5)
                    
                    
                }
            }
            if(this.read == 2){
                           canvas_context.font = "20px comic sans ms"   
                canvas_context.fillStyle = "white"
                canvas_context.fillRect((this.realBody.x+50)-15, (this.realBody.y+5)-30, canvas_context.measureText(this.dist).width + 45, 50)
                canvas_context.fillStyle = "black"
                     canvas_context.fillText(this.dist, this.realBody.x+50, this.realBody.y+5)
                    
                    
            }
        }
        invdraw(){
            
        }
        subCheck(point){
            if(this.rewarded == 1){
                if(this.realBody.isPointInside(point)){
                    this.dist = this.dist.sort((a,b) => a>b?-1:1)
                        this.read = 2
                }else{
                      this.read = 0

                }
                return
            }else{
                if(this.body.body.isPointInside(point)){
                    this.dist = this.dist.sort((a,b) => a>b?-1:1)
                        this.read = 1
                }else{
                      this.read = 0

                }
            }
            
        }
        check(point){
            if(this.rewarded == 1){
                if(this.realBody.isPointInside(point)){
                    this.rewarded = 0
                    hand.rewards = []
                    hand.reward(this)
//             hand.generateReward()
                    return
                }
            }
            //////console.log(this.rolled)
             if(this.rolled == 1){
                if(this.body.isPointInside(point)){
                hand.dieSel = this
                if(hand.enemSel.has == 1 && hand.enemSel.health > 0){
                    this.rolled = 0
                    this.body.body.x -= 400
                    let obj = this.rollx()
                    hand.enemSel.health -= obj.d           
                    if(obj.f.includes("healing")){
                        hand.health += obj.d
                    }
    
                }
                }
            }
        }
        roll(){
            if(this.rolled != 1){
                
            this.upface = Math.floor(Math.random()*this.sides)
            this.rolled = 1
            this.body.xmom = 12
            this.moving = 33
            }
        }
    }
    
    class Enemy {
        constructor(level){
            this.has = 1
            this.body = new Circle(1000,360, 24, "red")
            this.frames = Math.floor(89)
            this.frame = 0
            this.health = Math.round(5 + (level*5))
            this.attack = level 
            this.maxhealth = this.health
            this.dicecup = []
            this.level = level
            for(let t= 0;t<2+(Math.floor(this.level/4));t++){
                
            let fd1 = Math.floor(Math.random()*6)+3
            let fdist1 = []
            for(let t= 0;t<fd1;t++){
                fdist1.push(Math.floor(Math.random()*this.level*2)+1)
            }
            let d1 = new EnemyDice(fd1, fdist1, t)
            this.dicecup.push(d1)
            }
            this.rewards = []
        }   
        check(point){
            if(this.body.isPointInside(point)){
                hand.enemSel = this
                
                if(hand.dieSel.die == 1 && hand.dieSel.rolled == 1){
                    hand.dieSel.rolled = 0
                    hand.dieSel.body.body.x -= 400
                    
                    
                    hand.enemSel.health -= hand.dieSel.dist[hand.dieSel.upface]
                    hand.dieSel = {}
                }
                
                return
            }
        }
        draw(){
            this.enemSel = hand
            this.body.y = ((720/(hand.enemies.length+1))*hand.enemies.indexOf(this)) + (720/(hand.enemies.length+1)) 
            this.body.draw()
            canvas_context.fillStyle = "#00FF00"
            canvas_context.fillRect(this.body.x-24, this.body.y-34, 48*(this.health/this.maxhealth), 10)
            
            canvas_context.strokeStyle = "black"
            canvas_context.fillStyle = "black"
            
            if(hand.enemSel == this){
                
                           canvas_context.font = "20px comic sans ms"   
            }else{
                
                           canvas_context.font = "10px comic sans ms"   
                    }
                     canvas_context.fillText(this.health, this.body.x-64 + 50, this.body.y-50)
                     
                     
                     
            canvas_context.strokeStyle = "black"
            canvas_context.lineWidth = "1"
            canvas_context.strokeRect(this.body.x-24, this.body.y-34, 48, 10)
            
            for(let t = 0;t<this.dicecup.length;t++){
               if(Math.random()<.01 && this.dicecup[t].rolled ==0){
               this.dicecup[t].body.body.x = 1280 - ((Math.random()*100)+ 44)
               this.dicecup[t].body.body.y =   this.body.y + (((Math.random()-.5)*100))
            }
                   this.dicecup[t].draw()
              }
        }
    }
    
    class Handeaux {
        constructor(){
            this.body = new Circle(360,360, 64, "red")
            this.frames = Math.floor(89)
            this.frame = 0
            this.health = 69
            this.maxhealth = this.health
            this.dicecup = []
            this.level = 1
            this.rewards = []
            this.generateReward()
            this.enemies = [new Enemy(this.level), new Enemy(this.level)]
            this.rollButton = new Rectangle(this.body.x-64, this.body.y +100, 89, 50, "red")
            this.dieSel = {}
            this.enemSel = {}
            
        }   
        generateReward(){
        for(let t= 0;t<3;t++){
            let fd1 = Math.floor(Math.random()*6)+3
            let fdist1 = []
            for(let t= 0;t<fd1;t++){
                fdist1.push(Math.floor(Math.random()*this.level*3)+1)
            }
            let d1 = new Dice(fd1, fdist1, t)
            d1.rewarded = 1
        
            this.rewards.push(d1)
        }
        }
        check(point){
            
        for(let t= 0;t<this.enemies.length;t++){
            this.enemies[t].check(point)
        }
        for(let t= 0;t<this.dicecup.length;t++){
            this.dicecup[t].check(point)
        }
        for(let t= 0;t<this.rewards.length;t++){
            this.rewards[t].check(point)
        }
        if(this.rollButton.isPointInside(point)){
            this.dieSel = {}
            this.enemSel = {}
           for(let t = 0;t<this.dicecup.length;t++){
                this.dicecup[t].roll()
          }
           for(let t = 0;t<this.dicecup.length;t++){
                this.dicecup[t].roll()
          }
          for(let k = 0;k<this.enemies.length;k++){
           for(let t = 0;t<this.enemies[k].dicecup.length;t++){
                this.enemies[k].dicecup[t].roll()
          }
            }
        }
        }
        subCheck(point){
            
        for(let t= 0;t<this.rewards.length;t++){
            this.rewards[t].subCheck(point)
        }
        for(let t= 0;t<this.dicecup.length;t++){
            this.dicecup[t].subCheck(point)
        }
        }
        displayRewards(){   
        for(let t= 0;t<this.rewards.length;t++){
            this.rewards[t].draw()
        }
        }
        reward(selection){
            this.dicecup.push(selection)    
        }
        draw(){
            this.rollButton.draw()
                           canvas_context.font = "20px comic sans ms"   
                canvas_context.fillStyle = "white"
            canvas_context.fillText("roll", this.rollButton.x+15, this.rollButton.y+25)
            
            
            
            
            this.frame+= .25
            canvas_context.drawImage(handimg, 64*(Math.floor(this.frame)%(this.frames)), 0, 48,48, this.body.x-64, this.body.y-64, 89, 89)
            canvas_context.fillStyle = "#00FF00"
            canvas_context.fillRect(this.body.x-64, this.body.y-74, 89*(this.health/this.maxhealth), 10)
            
            
            
                     canvas_context.fillText(this.health, this.body.x-64 + 50, this.body.y-100)
                     
                     
                     
                                 canvas_context.strokeStyle = "black"
            canvas_context.lineWidth = "1"
            canvas_context.strokeRect(this.body.x-66, this.body.y-76, 130, 12)
           this.displayRewards() 
           for(let t = 0;t<this.enemies.length;t++){
              this.enemies[t].draw()
            }
           for(let t = this.enemies.length-1;t>=0;t--){
               if(this.enemies[t].health <= 0){
                        this.enemies.splice(t,1)
                  }
            }
           for(let t = 0;t<this.dicecup.length;t++){
               if(Math.random()<.01 && this.dicecup[t].rolled ==0){
               this.dicecup[t].body.body.x = (Math.random()*100)+ 44
               this.dicecup[t].body.body.y = (Math.random()*620)+50
                  }
                   this.dicecup[t].draw()
              }
              
              if(this.enemies.length==0){
                  this.level+=.5
                  this.generateReward()
                  
                  
           for(let t = 0;t<this.dicecup.length;t++){
               
               this.dicecup[t].body.body.x = (Math.random()*100)+ 44
               this.dicecup[t].body.body.y = (Math.random()*620)+50
               this.dicecup[t].rolled = 0
              }
              
                    this.enemies = [new Enemy(this.level), new Enemy(this.level), new Enemy(this.level)] 
                }
        }  
        
    }
    
    let hand = new Handeaux()
    
    class Projector {
        constructor(){
            this.body = new Circle(640, 360, 10,"red")
            this.ball = new Circle(640, 360, 6,"white")
            this.len = 0
            this.ang = 0
            this.link = new LineOP(this.body, this.ball, "yellow", 3)
            this.xvec = .03
            this.yvec = .01
            this.obstacles = []
//             for(let t = 0; t<100;t++){
//                 this.obstacles.push(new Circle((Math.random()*1000) + 140, Math.random()*480, 15, "orange"))
//             }
            for(let t = 0; t<100;t++){
                let c = new Circle((Math.floor(t/10)*90) + (70) + (t*1) + ((t%3)*40) ,30+ ((t%5) * 90) + 240 + ((t%3)*40), 15, "orange")
//                 this.obstacles.push(c)
            }
            this.friction = 1
            this.restitution = .01
        }
        reflectDot(){
let l = new LineOP(this.dot, this.dot);
for (let t = 0; t < this.obstacles.length; t++) {
    l.target = this.obstacles[t];
    let h = l.hypotenuse();
    let rad = this.dot.radius + this.obstacles[t].radius;
    if (h < rad) {
        let nx = l.target.x - this.dot.x;
        let ny = l.target.y - this.dot.y;
        let length = Math.sqrt(nx * nx + ny * ny);
        nx /= length; 
        ny /= length;
        let overlap = rad - h;
        this.dot.x -= nx * overlap * 1; 
        this.dot.y -= ny * overlap * 1;
        let dotSpeed = Math.sqrt(this.dot.xmom * this.dot.xmom + this.dot.ymom * this.dot.ymom);
        let dotVelocity = { x: this.dot.xmom / dotSpeed, y: this.dot.ymom / dotSpeed };
        let dotProduct = dotVelocity.x * nx + dotVelocity.y * ny;
        this.dot.xmom -= 2 * dotProduct * nx * (1 -  this.restitution);
        this.dot.ymom -= 2 * dotProduct * ny * (1 - this.restitution);
        this.dot.xmom *= this.friction;
        this.dot.ymom *= this.friction;
        break
    }
}

        }
        draw(){
            this.body.draw()
            this.link.draw()
            this.ball.draw()
            for(let t = 0; t<this.obstacles.length;t++){
            this.obstacles[t].draw()
            }
             this.dot = new Circle(this.ball.x, this.ball.y, 4, "magenta")
             this.dot.xmom = Math.cos(this.ang)*this.len/50
             this.dot.ymom = Math.sin(this.ang)*this.len/50
            for(let k = 0;k<300;k++){
                this.ndot = new Circle(this.dot.x, this.dot.y)
            for(let t = 0;t<5;t++){
                this.dot.xmom += this.xvec
                 this.dot.ymom += this.yvec
                 this.dot.move()
                this.reflectDot()
            }
            
              this.dot.draw()
              let lx = new LineOP(this.ndot, this.dot, "pink", 2)
              lx.draw()
              
             }
            
            
            
        }
        stretch(point){
            this.ball.x = point.x
            this.ball.y = point.y
            this.len = this.link.hypotenuse()
            this.ang = this.link.angle()
        }
    }
    
    let scanner = new Projector()
    
    let dtx = 0
    let buff1 = canvas_context.getImageData(0,0,16,16)
    let destinationImageData;

function addImageDataAtPosition(sourceImageData, offsetX, offsetY) {
  const sourceData = sourceImageData.data;
  const destData = destinationImageData.data;
  
  const sourceWidth = sourceImageData.width;
  const sourceHeight = sourceImageData.height;
  
  // Define pixel byte positions (RGBA = 4 bytes)
  const sourceWidth4 = sourceWidth * 4;
  const destWidth = destinationImageData.width;
  const destWidth4 = destWidth * 4;

  // Start mddain loop to merge source data into destination data
  for (let y = 0; y < sourceHeight; y++) {
    // Precompute row start positions
    const sourceRowStart = y * sourceWidth4;
    const destRowStart = (y + offsetY) * destWidth4 + offsetX * 4;

    for (let x = 0; x < sourceWidth; x++) {
      // Compute pixel start positions for source and destination
      const sourcePixelIndex = sourceRowStart + x * 4;
      const destPixelIndex = destRowStart + x * 4;

      // Directly copy RGBA values (no need for intermediary operations)
      destData[destPixelIndex]     = sourceData[sourcePixelIndex];     // Red
      destData[destPixelIndex + 1] = sourceData[sourcePixelIndex + 1]; // Green
      destData[destPixelIndex + 2] = sourceData[sourcePixelIndex + 2]; // Blue
      destData[destPixelIndex + 3] = sourceData[sourcePixelIndex + 3]; // Alpha
    }
  }

  // Put the modified image data back onto the canvas
//   canvas_context.putImageData(destinationImageData, 0, 0);
}

// Example usage
// Assume destinationImageData and sourceImageData are already defined
// with proper sizes and pixel data

// Initialize destinationImageData if not yet initialized
destinationImageData = canvas_context.getImageData(0, 0, canvas.width, canvas.height);

// Adding source data at offset (50, 50)
    
    let sporeball2 = new Image()
    sporeball2.src = "sporeball2.png"
    
    
    
    
    
//     if(keysPressed[' ']){
//     }
    
//     canvas_context.putImageData(destinationImageData, 0, 0)
    
    
    class Terrain {
        constructor(){
            this.grid = []
            this.linear = []
            for(let t =0;t<25;t++){
                let fr = []
            for(let k =0;k<25;k++){
                let r = new Rectangle(100+(t*20), 100+(k*20), 20,20,"white")
                fr.push(r)
                this.linear.push(r)
                if(k == 24){
                    r.block = 1
                }
            }
            this.grid.push(fr)
            }
        }
        draw(){
            for(let t= 0;t<this.linear.length;t++){
                this.linear[t].draw()
                if(t%25 < 1){
                    if(Math.random()<.03){
                        this.linear[t].wet = 1
                    }
                }
            }
            for(let t= 0;t<this.grid.length;t++){
            for(let k =0;k<this.grid.length;k++){
                if(this.grid[t][k].isPointInside(TIP_engine)){
                    this.grid[t][k].block = 1
                }
                if(this.grid[t][k].wet == 1){
                    this.grid[t][k].color = "blue"
                }else{
                    this.grid[t][k].color = "white"
                    
                }
                if(this.grid[t][k].block == 1){
                    this.grid[t][k].color = "black"
                }
                this.grid[t][k].draw()
            }
            }
            for(let t= this.grid.length-1;t>=0;t--){
            for(let k = this.grid.length-1;k>=0;k--){
                if(t < 24){
                    if(k < 24){
                if(this.grid[t][k].wet == 1){
                    if(this.grid[t][k+1].block != 1 && this.grid[t][k+1].wet!=1){
                    this.grid[t][k].wet = 0
                    this.grid[t][k+1].wet=1
                    }else{
                        
                           if(t > 0){
                    if(k > 0){ 
                        if(Math.random()<.7){
                            if(this.grid[t-1][k].block != 1 && this.grid[t-1][k].wet != 1){
                    this.grid[t][k].wet = 0
                                this.grid[t-1][k].wet = 1
                            }else{
                                
                            if(this.grid[t+1][k].block != 1 && this.grid[t+1][k].wet != 1){
                    this.grid[t][k].wet = 0
                                this.grid[t+1][k].wet = 1
                            }
                            }
                            
                        }else{
                    
                            if(this.grid[t+1][k].block != 1 && this.grid[t+1][k].wet != 1){
                    this.grid[t][k].wet = 0
                                this.grid[t+1][k].wet = 1
                            }else{
                                
                                  if(this.grid[t-1][k].block != 1 && this.grid[t-1][k].wet != 1){
                    this.grid[t][k].wet = 0
                                this.grid[t-1][k].wet = 1
                            }
                            }
                            
                        }
                    }else{
                         this.grid[t][k].wet = 0
                    }
                }else{
                    this.grid[t][k].wet = 0 
                }
                    }
                }
            }
            }
            }
            }
            
            
            
            for(let t= this.grid.length-1;t>=0;t--){
            for(let k = this.grid.length-1;k>=0;k--){
                if(t == 0 || t > 23){
                    this.grid[t][k].wet = 0
                }
            }
            }
        }
    }
    
    
    let g = new Terrain()
    
    let sheet = new Image()
    sheet.src = "starssheet.png"
    
    let waterTile = new Image()
    waterTile.src = "waterTile.png"
    let grassTile = new Image()
    grassTile.src = "grassTile.png"
    let hillTile = new Image()
    hillTile.src = "hillTile.png"
    
    let rightBank = new Image()
    rightBank.src = "rightBank.png"
    let leftBank = new Image()
    leftBank.src = "leftBank.png"
    let botBank = new Image()
    botBank.src = "botBank.png"
    let topBank = new Image()
    topBank.src = "topBank.png"
    
    
    let bank0 = new Image()
    bank0.src = "0bank.png"
    let bank3 = new Image()
    bank3.src = "3bank.png"
    let bank6 = new Image()
    bank6.src = "6bank.png"
    let bank9 = new Image()
    bank9.src = "9bank.png"
    
    
    let Hill0 = new Image()
    Hill0.src = "0Hill.png"
    let Hill3 = new Image()
    Hill3.src = "3Hill.png"
    let Hill6 = new Image()
    Hill6.src = "6Hill.png"
    let Hill9 = new Image()
    Hill9.src = "9Hill.png"
    
    let rightHill = new Image()
    rightHill.src = "rightHill.png"
    let leftHill = new Image()
    leftHill.src = "leftHill.png"
    let botHill = new Image()
    botHill.src = "botHill.png"
    let topHill = new Image()
    topHill.src = "topHill.png"
    
    class Tile {
        constructor(x, y){
            this.tall = 0
            if(Math.random() < .01){
                this.tall = 1
            }
            this.calced = 0
            this.water = 0
            if(Math.random() < .1){
                this.water = 1
            }
            this.improvements = []
            this.redarmy = []
            this.greenarmy = []
            this.x =  x
            this.y =  y
            this.width = 64
            this.height = 64
            this.rect = new Rectangle(this.x, this.y, this.width, this.height, "black")
            this.owner = -1
            this.castle = 0
            this.ten = Math.floor(Math.random()*9)
            this.twen = Math.floor(Math.random()*9)
        }
        calcTile(t,k, w){
            
            this.image = grassTile
            if(this.water == 1){
            
            
            if(gid.planets[w].world[((t-1)+128)%128][((k-1)+128)%128].water != 1){
                gid.planets[w].world[((t-1)+128)%128][((k-1)+128)%128].image = bank9
                gid.planets[w].world[((t-1)+128)%128][((k-1)+128)%128].calced = 1
            }else{
                gid.planets[w].world[((t-1)+128)%128][((k-1)+128)%128].image = waterTile
                gid.planets[w].world[((t-1)+128)%128][((k-1)+128)%128].calced = 1
            }
            
            if(gid.planets[w].world[((t-1)+128)%128][((k)+128)%128].water != 1){
                gid.planets[w].world[((t-1)+128)%128][((k)+128)%128].image = leftBank
                gid.planets[w].world[((t-1)+128)%128][((k)+128)%128].calced = 1
            }else{
                gid.planets[w].world[((t-1)+128)%128][((k)+128)%128].image = waterTile
                gid.planets[w].world[((t-1)+128)%128][((k)+128)%128].calced = 1
            }
            
            if(gid.planets[w].world[((t-1)+128)%128][((k+1)+128)%128].water != 1){
                gid.planets[w].world[((t-1)+128)%128][((k+1)+128)%128].image = bank6
                gid.planets[w].world[((t-1)+128)%128][((k+1)+128)%128].calced = 1
            }else{
                gid.planets[w].world[((t-1)+128)%128][((k+1)+128)%128].image = waterTile
                gid.planets[w].world[((t-1)+128)%128][((k+1)+128)%128].calced = 1
            }
                
                gid.planets[w].world[((t)+128)%128][((k-1)+128)%128].image = topBank
//                 gid.planets[w].world[((t)+128)%128][((k)+128)%128].image = this is the one in line
                gid.planets[w].world[((t)+128)%128][((k+1)+128)%128].image = botBank
                
                
                gid.planets[w].world[((t+1)+128)%128][((k-1)+128)%128].image = bank0
                gid.planets[w].world[((t+1)+128)%128][((k)+128)%128].image = rightBank
                gid.planets[w].world[((t+1)+128)%128][((k+1)+128)%128].image = bank3
                
                
                gid.planets[w].world[((t-1)+128)%128][((k+1)+128)%128].calced = 1
                
                
                gid.planets[w].world[((t)+128)%128][((k-1)+128)%128].calced = 1
//                 gid.planets[w].world[((t)+128)%128][((k)+128)%128].image = this is the one in line
                gid.planets[w].world[((t)+128)%128][((k+1)+128)%128].calced = 1
                
                
                gid.planets[w].world[((t+1)+128)%128][((k-1)+128)%128].calced = 1
                gid.planets[w].world[((t+1)+128)%128][((k)+128)%128].calced = 1
                gid.planets[w].world[((t+1)+128)%128][((k+1)+128)%128].calced = 1
                
                
                
                this.image = waterTile
                return
            }
            if(this.tall == 1){
                
                gid.planets[w].world[((t-1)+128)%128][((k-1)+128)%128].image = Hill9
                gid.planets[w].world[((t-1)+128)%128][((k)+128)%128].image = rightHill
                gid.planets[w].world[((t-1)+128)%128][((k+1)+128)%128].image = Hill6
                
                
                gid.planets[w].world[((t)+128)%128][((k-1)+128)%128].image = botHill
//                 gid.planets[w].world[((t)+128)%128][((k)+128)%128].image = this is the one in line
                gid.planets[w].world[((t)+128)%128][((k+1)+128)%128].image = topHill
                
                
                gid.planets[w].world[((t+1)+128)%128][((k-1)+128)%128].image = Hill0
                gid.planets[w].world[((t+1)+128)%128][((k)+128)%128].image = leftHill
                gid.planets[w].world[((t+1)+128)%128][((k+1)+128)%128].image = Hill3
                
                
                gid.planets[w].world[((t-1)+128)%128][((k-1)+128)%128].calced = 1
                gid.planets[w].world[((t-1)+128)%128][((k)+128)%128].calced = 1
                gid.planets[w].world[((t-1)+128)%128][((k+1)+128)%128].calced = 1
                
                
                gid.planets[w].world[((t)+128)%128][((k-1)+128)%128].calced = 1
//                 gid.planets[w].world[((t)+128)%128][((k)+128)%128].image = this is the one in line
                gid.planets[w].world[((t)+128)%128][((k+1)+128)%128].calced = 1
                
                
                gid.planets[w].world[((t+1)+128)%128][((k-1)+128)%128].calced = 1
                gid.planets[w].world[((t+1)+128)%128][((k)+128)%128].calced = 1
                gid.planets[w].world[((t+1)+128)%128][((k+1)+128)%128].calced = 1
                
                
                this.image = hillTile
                return
            }
                
        
        
                
            
        }
        isPointInside(point) {
            if (point.x >= this.x) {
                if (point.y >= this.y) {
                    if (point.x <= this.x + this.width) {
                        if (point.y <= this.y + this.height) {
                            return true
                        }
                    }
                }
            }
            return false
        }
        draw(){
            
            this.rect = new Rectangle(this.x, this.y, this.width, this.height, getRandomColor())
            this.rect.draw()
            
            return
            this.rect = new Rectangle(this.x, this.y, this.width, this.height, "black")
            
            if(this.owner == 1){
                this.rect.color = "#00ff0044"
            }
            if(this.owner == 0){
                this.rect.color = "#ff000044"
            }
            
            this.rect.draw()
            if(avey.players[avey.turn].select == this){
                  this.rect.sdraw()

            }
            canvas_context.drawImage(sheet, this.ten*32,  this.twen*32, 32,32, this.rect.x+(this.rect.width*.33), this.rect.y+(this.rect.width*.33), (this.rect.width*.33), (this.rect.width*.33))
            
            
                if(this.castle == 1){ 
                
                        let r = new Rectangle(this.x + 25 , this.y+ 25, 50,50, "black")
                        r.color = "#0000ff44"
                        r.draw()
                    
                    
                    }
                    
                    
            if(this.improvements.length > 0){
                for(let t =0;t<this.improvements.length;t++){
                        let r = new Rectangle(this.x + 15 + (17*t), this.y+ 50, 15,15, "black")
                    if(this.improvements[t] == 0){ 
                        r.color = "#0000ff88"
                        r.draw()
                    }
                    if(this.improvements[t] == 1){
                        r.color = "#FFAA0088"
                        r.draw()
                        
                    }
                    if(this.improvements[t] == 2){
                        r.color = "#AA00FF88"
                        r.draw()
                        
                    }
                    if(this.improvements[t] == 3){
                        r.color = "#ffffff88"
                        r.draw()
                        
                    }
                }
            }
            
            
            this.rhash = {}
            this.ghash = {}
            for(let t = 0;t<this.redarmy.length;t++){
                if(this.rhash[this.redarmy[t].type]){
                    this.rhash[this.redarmy[t].type]++
                }else{
                    this.rhash[this.redarmy[t].type] = 1
                }
            }
            
            for(let t = 0;t<this.greenarmy.length;t++){
                if(this.ghash[this.greenarmy[t].type]){
                    this.ghash[this.greenarmy[t].type]++
                }else{
                    this.ghash[this.greenarmy[t].type] = 1
                }
            }
            
            
            if(this.owner == 0){
                
            for(let t = 0;t<5;t++){
            if(this.rhash[t] > 0){
                
                        let r = new Rectangle(this.x + 0 + (0), this.y+ (t*16), 34,17, "pink")
                        r.draw()
                canvas_context.fillStyle = "#000000"
            canvas_context.font = "12px comic sans ms"
            
            canvas_context.fillText(this.rhash[t], this.x+5,  this.y+ (t*16) + 10)
            }
            
            }
            }else if (this.owner == 1){
                
            for(let t = 0;t<5;t++){
            if(this.ghash[t] > 0){
                
                        let r = new Rectangle(this.x + 0 + (0), this.y+ (t*16), 34,17, "#aaffaa")
                        r.draw()
                canvas_context.fillStyle = "#000000"
            canvas_context.font = "12px comic sans ms"
            
            canvas_context.fillText(this.ghash[t], this.x+5,  this.y+ (t*16) + 10)
            }
            
            }
            
            }
            
            
        }
        account(mode){ //catj
        this.mode = mode
                if(this.castle == 1){ 
                
//                                  avey.players[this.owner].cash[0] += 1
//                                  avey.players[this.owner].cash[1] += 1
//                                  avey.players[this.owner].cash[2] += 1
//                                  avey.players[this.owner].cash[3] += 1
                }
            if(this.mode == 0){
            if(this.improvements.length > 0){
                for(let t =0;t<this.improvements.length;t++){
                             if(this.improvements[t] == 0){
                                 avey.players[this.owner].cash[0] += 1
                              }
                             if(this.improvements[t] == 1){
                                 avey.players[this.owner].cash[0] += 1
                                 avey.players[this.owner].cash[2] += 1
                              }
                             if(this.improvements[t] == 2){
                                 avey.players[this.owner].cash[2] += 1
                              }
                             if(this.improvements[t] == 3){
                                 avey.players[this.owner].cash[3] += 1
                                 avey.players[this.owner].cash[1] += 1
                              }
                }
            }
            }

            if(this.mode == 1){
            if(this.improvements.length > 0){
                for(let t =0;t<this.improvements.length;t++){
                             if(this.improvements[t] == 0){
                                 avey.players[this.owner].cash[0] += 1
                              }
                             if(this.improvements[t] == 1){
                                 avey.players[this.owner].cash[0] += 1
                                 avey.players[this.owner].cash[2] += 1
                              }
                             if(this.improvements[t] == 2){
                                 avey.players[this.owner].cash[2] += 1
                              }
                             if(this.improvements[t] == 3){
                                 avey.players[this.owner].cash[3] += 1
                                 avey.players[this.owner].cash[1] += 1
                              }
                }
            }
            }
            if(this.mode == 2){
            if(this.improvements.length > 0){
                for(let t =0;t<this.improvements.length;t++){
                             if(this.improvements[t] == 0){
                                 avey.players[this.owner].cash[0] += 1
                              }
                             if(this.improvements[t] == 1){
                                 avey.players[this.owner].cash[0] += 1
                                 avey.players[this.owner].cash[2] += 1
                              }
                             if(this.improvements[t] == 2){
                                 avey.players[this.owner].cash[2] += 1
                              }
                             if(this.improvements[t] == 3){
                                 avey.players[this.owner].cash[3] += 1
                                 avey.players[this.owner].cash[1] += 1
                              }
                }
            }
            }
            if(this.mode == 3){
            if(this.improvements.length > 0){
                for(let t =0;t<this.improvements.length;t++){
                         
                             if(this.improvements[t] == 0){
                                 avey.players[this.owner].cash[0] += 1
                              }
                             if(this.improvements[t] == 1){
                                 avey.players[this.owner].cash[0] += 1
                                 avey.players[this.owner].cash[2] += 1
                              }
                             if(this.improvements[t] == 2){
                                 avey.players[this.owner].cash[2] += 1
                              }
                             if(this.improvements[t] == 3){
                                 avey.players[this.owner].cash[3] += 1
                                 avey.players[this.owner].cash[1] += 1
                              }
                }
            }
            }
            if(this.mode == 4){
            if(this.improvements.length > 0){
                for(let t =0;t<this.improvements.length;t++){
                             if(this.improvements[t] == 0){
                                 avey.players[this.owner].cash[0] += 1
                              }
                             if(this.improvements[t] == 1){
                                 avey.players[this.owner].cash[0] += 1
                                 avey.players[this.owner].cash[2] += 1
                              }
                             if(this.improvements[t] == 2){
                                 avey.players[this.owner].cash[2] += 1
                              }
                             if(this.improvements[t] == 3){
                                 avey.players[this.owner].cash[3] += 1
                                 avey.players[this.owner].cash[1] += 1
                              }
                }
            }
            }
            
            
        }
    }
    
    class Giy {
        constructor(type){
            this.type = type
        }
    }
    
    class Owners {
        constructor(n){
            this.fac = n
            this.cash = [3, 3, 3, 3]
        }
    }
    class Avey {
        constructor(){
            this.aistep =0 
            this.aitick =0
            this.aiPlayers = [0,0]
            this.combattimer = 100
            this.combat = 0
            this.blonk = 0
            this.moding = 0
            this.moveSegment = 0
            this.turn = 0
            this.modeButtons = []
            this.modeDisp = []
            this.modeList = [-1,-1,-1]
            this.submode = -1
            for(let t= 0;t<6;t++){
                let rect = new Rectangle(1000+(t*40), 500, 30, 30, "red")
                       if(t == 1){
                    rect.color = "yellow"
                }      if(t == 2){
                    rect.color = "#00ff00"
                }    if(t == 3){
                    rect.color = "#ff00ff"
                }    if(t == 4){
                    rect.color = "#00ffff"
                }    if(t == 5){
                    rect.color = "#0000ff"
                }
                this.modeButtons.push(rect)
            }
            for(let t= 0;t<3;t++){
                let rect = new Rectangle(800, 10+(220*t), 200, 220, "red")
                if(t == 1){
                    rect.color = "yellow"
                }      if(t == 2){
                    rect.color = "#00ff00"
                }
                this.modeDisp.push(rect)
            }

            this.grid = []
            this.linear = []
            this.players = []
            this.players.push(new Owners(0))
            this.players.push(new Owners(1))
            for(let t= 0;t<7;t++){
                let g = []
            for(let k= 0;k<7;k++){
                let tile = new Tile(10+(100*t), 10+(100*k))
                tile.t = t
                tile.k = k
                g.push(tile)
                this.linear.push(tile)
            }
            this.grid.push(g)
        }
        
            let c = 0
            let r = 0
            let b = 0
            for(let d= 0;c<7;d++){
                let t = Math.floor(Math.random()*7)
                let k = Math.floor(Math.random()*7)
                
                    if(r == 0){
                        t = 0
                        k = 0 
                    }
                    if(r == 1){
                        if(b == 0){
                        t = 6
                        k = 6
                        }else{
                            k = 6-t
                            
                        }
                    }
                let n = this.neighbors(this.grid[t][k])
                let f = [...n]
                
//                 //////console.log(n)
                for(let s = 0;s<n.length;s++){
                    let g = this.neighbors(n[s])
                    for(let x = 0;x<g.length;x++){
                        if(Math.random() < .2){
                            
                            
                        f.push(g[x])
                        }
                    }
                }
                n = [...f]
//                 //////console.log(n)
                let w = 0
                for(let s = 0;s<n.length;s++){
                    if(n[s].castle == 1 || this.grid[t][k].castle == 1){
                        w++
                    }
                }
                if(w == 0){ 
                    this.grid[t][k].castle = 1
                    if(r == 0){
                        this.grid[t][k].owner = 0
                        this.grid[t][k].redarmy.push(new Giy(0))
                        this.grid[t][k].redarmy.push(new Giy(0))
                        this.grid[t][k].improvements = [3,2,1]
                        r = 1
                    }else{
                        if(b == 0){
                            this.grid[t][k].owner = 1
                        this.grid[t][k].greenarmy.push(new Giy(0))
                        this.grid[t][k].greenarmy.push(new Giy(0))
                        this.grid[t][k].improvements = [3,2,1]
                             b = 1
                        }
                    }
                    c++
                    continue
                }
            }
        }
        aiPlay(){
            
            if(this.blonk >= 3){
                
            this.blonk = 0
            this.moding = 0
            this.moveSegment = 0
            this.turn++
            this.turn%=2
            return
            }
            this.cleanoutrec()
            this.point = new Circle(0,0,1,"white")
            if(Math.random() < .001){
                
            this.check(this.point)
            }
            this.point.draw()
            
            this.pointertile = {}
            
            if(this.moding == 0){
            this.card = Math.floor(Math.random()*6)
            this.set = 0
            if(this.players[this.turn].cash[0] >= 14){      //
             if( (this.players[this.turn].cash[0] < 30)){   
            if(Math.random() < .3){
            this.card = 5
            this.set = 1
            }
            if(Math.random() < .2){
            this.card = 4
            this.set = 1
            }
            }
            if( (this.players[this.turn].cash[2] > 11 &&  this.players[this.turn].cash[1] > 11)){    
            
             if( (this.players[this.turn].cash[2] < 40)){      
             if(Math.random() < .3){
            this.card = 5
            this.set = 1
            }
            
            if(Math.random() < .4){
            this.card = 3
            this.set = 1
            }
            }
            }
            }
              if( (this.players[this.turn].cash[3] > 11 &&  this.players[this.turn].cash[0] > 11)){      
             if( (this.players[this.turn].cash[3] < 40)){      
       
            if(Math.random() < .34){
            this.card = 0
            this.set = 1
            }
            if(Math.random() < .34){
            this.card = 2
            this.set = 1
            }
                    }
            }
             if( (this.players[this.turn].cash[2] > 19 &&  this.players[this.turn].cash[3] > 9)){      
             if(Math.random() < .4){
            this.card = 1
            this.set = 1
            }
             if(Math.random() < .4){
            this.card = 2
            this.set = 1
            }
             if(Math.random() < .4){
            this.card = 3
            this.set = 1
            }
            }else if( (this.players[this.turn].cash[2] >11&&  this.players[this.turn].cash[1] > 11)){    
             if(Math.random() < .66){
            this.card = 5
            this.set = 1
            }
            }
            
            if( (this.players[this.turn].cash[2] > 19 &&  this.players[this.turn].cash[3] > 9)){      
             if(Math.random() < .4){
            this.card = 1
            this.set = 1
            }
             if(Math.random() < .4){
            this.card = 2
            this.set = 1
            }
             if(Math.random() < .4){
            this.card = 3
            this.set = 1
            }
            }
             if( (this.players[this.turn].cash[2] > 11 &&  this.players[this.turn].cash[1] > 11)){    
             if(Math.random() < .66){
            this.card = 5
            this.set = 1
            }
            }
            
            if(this.set == 0){
                
                   if(Math.random() < .55){
            this.card = Math.floor(Math.random()*3)
                }
                   if(Math.random() < .15){
                    
                this.card = 4
                }
            }
            
            
                this.point.x = this.modeButtons[this.card].x+10
                this.point.y = this.modeButtons[this.card].y+10
            }
            
            if(this.moding == 1){
                if(this.submode == -1){
            this.card = Math.floor(Math.random()*3)
            this.card = this.blonk
     
            if(this.blonk >= 3){
                
            this.blonk = 0
            this.moding = 0
            this.moveSegment = 0
            this.turn++
            this.turn%=2
            return
            }
                            this.point.x = this.modeDisp[this.card].x+10
                this.point.y = this.modeDisp[this.card].y+10
                    this.c = 0
                }else{
                    
            this.card = Math.floor(Math.random()*7)
            this.card2 = Math.floor(Math.random()*7)
            if(this.submode == 1){
                
                let few = 0
                for(let w = 0;w<20;w++){
                    
                let n = this.neighbors(this.grid[this.card][this.card2])
                let wet = 0
                    if(this.turn == 0){
                    for(let d = 0;d<n.length;d++){
                        if(this.grid[this.card][this.card2].redarmy.length > 0){
                            continue
                        }
                        if(wet == 1){
                            continue   
                        }
                        if(n[d].greenarmy.length > 0){
                            wet = 1
                           this.card = Math.floor(Math.random()*7)
                           this.card2 = Math.floor(Math.random()*7) 
                        }
                    }
                    if(wet == 0){
                        few = 1
                    }
                    }else{
                        
                    for(let d = 0;d<n.length;d++){
                        if(this.grid[this.card][this.card2].greenarmy.length > 0){
                            continue
                        }
                        if(wet == 1){
                            continue   
                        }
                        if(n[d].redarmy.length > 0){
                            wet = 1
                           this.card = Math.floor(Math.random()*7)
                           this.card2 = Math.floor(Math.random()*7) 
                        }
                    }
                    if(wet == 0){
                        few = 1
                    }
                    }
                    if(few == 1){
                        break
                    }
                }

                
            }else  if(this.submode > 1){ 
                
                let few = 0
                for(let w = 0;w<20;w++){
                    
                let n = this.neighbors(this.grid[this.card][this.card2])
                let wet = 0
                    if(this.turn == 0){
                    for(let d = 0;d<n.length;d++){
                        if(wet == 1){
                            continue   
                        }
                        if(n[d].greenarmy.length > 0){
                            wet = 1
                           this.card = Math.floor(Math.random()*7)
                           this.card2 = Math.floor(Math.random()*7) 
                        }
                        if(n[d].owner != this.turn){
                            if(Math.random() <.1){
                                
                            wet = 1
                           this.card = Math.floor(Math.random()*7)
                           this.card2 = Math.floor(Math.random()*7)
                            }
                        }
                    }
                    if(wet == 0){
                        few = 1
                    }
                    }else{
                        
                    for(let d = 0;d<n.length;d++){
                        if(wet == 1){
                            continue   
                        }
                        if(n[d].redarmy.length > 0){
                            wet = 1
                           this.card = Math.floor(Math.random()*7)
                           this.card2 = Math.floor(Math.random()*7)
                        }
                        
                        if(n[d].owner != this.turn){
                            if(Math.random() <.1){
                                
                            wet = 1
                           this.card = Math.floor(Math.random()*7)
                           this.card2 = Math.floor(Math.random()*7)
                            }
                        }
                    }
                    if(wet == 0){
                        few = 1
                    }
                    
                    }
                    if(few == 1){
                        break
                    }
                }
            }else if(this.submode == 0){
                    let f = []
                    
                    let g = this.neighbors(this.players[this.turn].select)
                    
                    let cet = 0
                    for(let r = 0;r<g.length;r++){
                        if(g[r].owner == this.turn){
                            cet++
                        }
                    }
                    ////console.log(g,cet)
                    if(cet == g.length && g.length > 0){
                        if(Math.random() < .1){
                            
                this.players[this.turn].select = {}
                delete this.players[this.turn].select
                        }
                    }
                    
                    
                    if(this.players[this.turn].select){
                        
                    if(this.turn == 0){
                        
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                if(this.grid[t][k].redarmy.length > 0){
//                     let n = this.neighbors(this.grid[t][k])

                    let n = this.neighbors(this.players[this.turn].select)
//                     n.push(this.grid[t][k])
let cf = 0
                    for(let d = 0;d<n.length;d++){
                        if(cf >0){
                            
                                continue
                        }
                        if(n[d].redarmy.length > 0){
                            if(Math.random() < .8){
                                continue
                            }
                            
                        }
                        if(n[d].owner ==  this.turn){
                            if(Math.random() < .8){
                                continue
                            }
                            
                        }
                        f.push(n[d])
           
                        if(n[d].castle == 1 && n[d].greenarmy.length*1.1 < this.grid[t][k].redarmy.length && n[d].owner !=  this.turn){
                            f = [n[d]]
                            cf = 1
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                       f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                    f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                    f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])

                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                       f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                    f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                    f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                            
                        }
                        if(n[d].greenarmy.length  == 0 && n[d].owner != this.turn){
                            
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                 if(n[d].castle == 1 && n[d].greenarmy.length*1.1 < this.grid[t][k].redarmy.length  && n[d].owner !=  this.turn){
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])

                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])

                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])

                            
                        }
                        }
                        if(n[d].greenarmy.length*1.1 < this.grid[t][k].redarmy.length && n[d].greenarmy.length > 0){
                            
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])

                        }
                    }
                }
            }
            }
                    }else{
                        
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                if(this.grid[t][k].greenarmy.length > 0){
//                     let n = this.neighbors(this.grid[t][k])

                    let n = this.neighbors(this.players[this.turn].select)
//                     n.push(this.grid[t][k])
let cf = 0
                    for(let d = 0;d<n.length;d++){
                        if(cf >0){
                            
                                continue
                        }
                        if(n[d].greenarmy.length > 0){
                            if(Math.random() < .8){
                                continue
                            }
                            
                        }
                        if(n[d].owner ==  this.turn){
                            if(Math.random() < .8){
                                continue
                            }
                            
                        }
                        f.push(n[d])
           
                        if(n[d].castle == 1 && n[d].redarmy.length*1.1 < this.grid[t][k].greenarmy.length && n[d].owner !=  this.turn){
                            f = [n[d]]
                            cf = 1
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                       f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                    f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                    f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])

                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                       f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                    f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                    f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                            
                        }
                        if(n[d].redarmy.length  == 0 && n[d].owner != this.turn){
                            
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                                 if(n[d].castle == 1 && n[d].redarmy.length*1.1 < this.grid[t][k].greenarmy.length  && n[d].owner !=  this.turn){
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])

                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])

                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])

                            
                        }
                        }
                        if(n[d].redarmy.length*1.1 < this.grid[t][k].greenarmy.length && n[d].redarmy.length > 0){
                            
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])
                         f.push(n[d])

                        }
                    }
                }
            }
            }
            }
                    }else{
                        
                        
                    if(this.turn == 0){
                        
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                if(this.grid[t][k].redarmy.length > 0){
                    let n = this.neighbors(this.grid[t][k])
                    for(let d = 0;d<n.length;d++){
                         if(this.grid[t][k].castle == 1 || this.grid[t][k].improvements.includes(2)){
                                      if(Math.random() < .5){
                                 continue
                              }
                             
                        f.push(this.grid[t][k])
                          }else{
                              
                            let n = this.neighbors(this.grid[t][k])
                            
                            let cf2 = 1
                    for(let d = 0;d<n.length;d++){
                        if(n[d].owner != this.turn){
                            cf2+=Math.round(this.grid[t][k].redarmy.length/2)
                        }else{
                            cf2+=Math.floor(this.grid[t][k].redarmy.length/3)
                        }
                    }
                    
                    for(let s = 0;s<cf2*cf2;s++){
                        f.push(this.grid[t][k])
                    }
                        
                        
                        
                            }
                    }
                }
            }
            }
                    }else{
                        
                        
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                if(this.grid[t][k].greenarmy.length > 0){
                    let n = this.neighbors(this.grid[t][k])
                    for(let d = 0;d<n.length;d++){
                         if(this.grid[t][k].castle == 1|| this.grid[t][k].improvements.includes(2)){
                             if(Math.random() < .5){
                                 continue
                              }
                        f.push(this.grid[t][k])
                          }else{
           
                              
                            let n = this.neighbors(this.grid[t][k])
                            
                            let cf2 = 1
                    for(let d = 0;d<n.length;d++){
                        if(n[d].owner != this.turn){
                            cf2+=Math.round(this.grid[t][k].greenarmy.length/2)
                        }else{
                            cf2+=Math.floor(this.grid[t][k].greenarmy.length/3)
                        }
                    }
                    
                    for(let s = 0;s<cf2*cf2;s++){
                        f.push(this.grid[t][k])
                    }
                        
                        

                            }
                    }
                }
            }
            }
            }
            
            
                    }
                let sd = Math.floor(Math.random()*f.length)
                ////console.log(f,sd)
                this.point.x = f[sd].x + 10
                this.point.y = f[sd].y + 10
                this.card = f[sd].t
                this.card2 = f[sd].k
            }
                this.point.x = this.grid[this.card][this.card2].x+10
                this.point.y = this.grid[this.card][this.card2].y + 10
                this.c++
                if(this.c > 100){
                    
            this.card = this.blonk
                this.point.x = this.modeDisp[this.card].x+10
                this.point.y = this.modeDisp[this.card].y+10
                }
                }
            }
            this.aistep++
            if(this.aistep > this.aitick){
                this.aistep = 0
            this.check(this.point)
            }
            
            
            
        }
        cleanoutrec(){
            
            if(this.submode == 6 && this.players[this.turn].cash[0] < 15){         
                                  this.submode = -1
                                  this.blonk++
                                  return
            }
            if(this.submode == 3 && (this.players[this.turn].cash[3] < 12 ||  this.players[this.turn].cash[0] < 12)){         
                                  this.submode = -1
                                  this.blonk++
                                  return
            }
            if(this.submode == 1 && (this.players[this.turn].cash[2] < 20 ||  this.players[this.turn].cash[3] < 10)){         
                                  this.submode = -1
                                  this.blonk++
                                  return
            }
            
            
            if(this.submode == 5 && (this.players[this.turn].cash[2] < 12 ||  this.players[this.turn].cash[1] < 12)){         
                                  this.submode = -1
                                  this.blonk++
                                  return
            }
        }
        check(point){
            if(this.blonk >= 3){
                
            this.blonk = 0
            this.moding = 0
            this.moveSegment = 0
            this.turn++
            this.turn%=2
            return
            }
            this.cleanoutrec()
            
            
                let fer = 0
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                
                    if(this.grid[t][k].isPointInside(point)){
                        fer++
                    }
            }
            }
            if(fer == 0){
                if(this.submode > -1 && this.moding > 0){
                
                if(this.submode ==0){
            if(!this.players[this.turn].select){
                                  this.submode = -1
                                  this.blonk++
                                return
            }
                }else{
                    if(this.submode != 4 && this.submode != 2){
                        
                                  this.submode = -1
                                  this.blonk++
                                return
                                        }
                    
                }
            }
            }
            
            
            
            if(this.moding == 2){
                this.moding = 0
                return
            }
            if(this.moding == 0){ 
                let wet = 0
            for(let k= 0;k<this.modeButtons.length;k++){
            if(this.modeButtons[k].isPointInside(point)){
                for(let t = 0;t<this.linear.length;t++){
                    if(this.linear[t].owner == this.turn){
//                         this.linear[t].account(t)
                        this.players[this.turn].gid = k
                        wet = 1
                        
                    }
                }
            }
            }
            if(wet == 1){
                        this.moding++
                
            }
                return
            }
            if(this.moding == 1){
                if(this.moveSegment == 0){
                    
            for(let k= 0;k<this.modeDisp.length;k++){
            if(this.modeDisp[k].isPointInside(point) && k <= this.blonk){
                this.submode = this.modeList[k]      
                return   
            }
            }
                }
            }
            
            if(this.submode == 0){
                              if(this.turn == 0){
                let fet = 0

            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                fet+=this.grid[t][k].redarmy.length
                //////console.log(fet,t,k)
            }
            } 
            //////console.log(fet)
                            if(fet == 0){
                                
                                  this.submode = -1
                                  this.blonk++
                                  return
                            }
                  
                }
                              if(this.turn == 1){
                let fet = 0

            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                fet+=this.grid[t][k].greenarmy.length
                //////console.log(fet,t,k)
            }
            }
            
            //////console.log(fet)
                            if(fet == 0){
                                
                                  this.submode = -1
                                  this.blonk++
                                  return
                            }
                  
                }
                
                
                
                let fe = 0
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                
                    if(this.grid[t][k].isPointInside(point)){
                        fe++
                    }
            }
            }
            if(fe == 0){
                this.players[this.turn].select = {}
                delete this.players[this.turn].select
                return
            }
                let wet = 0

            
            if(!this.players[this.turn].select){
                
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                if(this.grid[t][k].owner == this.turn){
                    if(this.grid[t][k].isPointInside(point)){
                        if(this.grid[t][k].redarmy.length+this.grid[t][k].greenarmy.length){
                        this.grid[t][k].selected = 1 
                        this.players[this.turn].select = this.grid[t][k]
                        }
                    } 
                }
            }
            }
            return
            }
                        let wtt = 0
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                    if(this.grid[t][k].isPointInside(point) && this.players[this.turn].select){
                        if(this.grid[t][k] != this.players[this.turn].select){
                            if(this.turn == 0 && this.neighbors(this.players[this.turn].select).includes(this.grid[t][k])){
                                for(let f = 0;f<this.players[this.turn].select.redarmy.length;f++){
                                  this.grid[t][k].redarmy.push(this.players[this.turn].select.redarmy[f])
                                
                                 if(this.grid[t][k].owner == -1){
                                      wtt =0
                                      
                                  this.grid[t][k].owner = this.turn
                                }else if(this.grid[t][k].owner == 0){
                                      
                                      wtt =0 
                                  this.grid[t][k].owner = this.turn
                                    }else if(this.grid[t][k].greenarmy.length == 0){
                                      
                                      wtt =0
                                  this.grid[t][k].owner = this.turn
                                    }else{
                                        wtt = 1
                                        //combat
                                    }
                                }
                                //////console.log("l", wtt, this.grid[t][k])

                                if(wtt == 1){
                                        this.combat = 1
                                        ships = []
                         
                                        for(let e= 0;e<this.grid[t][k].redarmy.length;e++){
                                            ships.push(new Ship(0, 0))
                                        }
                                        for(let e = 0;e<this.grid[t][k].greenarmy.length;e++){
                                            ships.push(new Ship(0, 1))
                                        }
                                   this.contest = this.grid[t][k]
                                  this.players[this.turn].select.redarmy = []
                                  this.players[this.turn].select.greenarmy = []
                                  this.players[this.turn].select = {}
                                  this.submode = -1
//                                   this.blonk++
                                   wet = 1
                                    break
                                }
                                  this.players[this.turn].select.redarmy = []
                                  this.players[this.turn].select = {}
                                  this.submode = -1
//                                   this.blonk++
                                   wet = 1
                                    break

                            }else if(this.turn == 1 &&  this.neighbors(this.players[this.turn].select).includes(this.grid[t][k])){
                                
                                for(let f = 0;f<this.players[this.turn].select.greenarmy.length;f++){
                                  this.grid[t][k].greenarmy.push(this.players[this.turn].select.greenarmy[f])
                                
                                 if(this.grid[t][k].owner == -1){
                                      
                                      wtt =0
                                  this.grid[t][k].owner = this.turn
                                }else if(this.grid[t][k].owner == 1){
                                      wtt =0
                                  this.grid[t][k].owner = this.turn
                                    }else if(this.grid[t][k].redarmy == 1){
                                      wtt =0
                                  this.grid[t][k].owner = this.turn
                                    }else{
                                        wtt = 1
                                        //combat
                                    }
                                }
                                //////console.log("l")
                                //////console.log("l", wtt, this.grid[t][k])
                                if(wtt == 1){
                                        this.combat = 1
                                        ships = []
                                        for(let e= 0;e<this.grid[t][k].redarmy.length;e++){
                                            ships.push(new Ship(0, 0))
                                        }
                                        for(let e = 0;e<this.grid[t][k].greenarmy.length;e++){
                                            ships.push(new Ship(0, 1))
                                        }
                                   this.contest = this.grid[t][k]
                                  this.players[this.turn].select.redarmy = []
                                  this.players[this.turn].select.greenarmy = []
                                  this.players[this.turn].select = {}
                                  this.submode = -1
                                   wet = 1
//                                   this.blonk++
                                    break

                                }
                                  this.players[this.turn].select.greenarmy = []
                                  this.players[this.turn].select = {}
                                  this.submode = -1
                                   wet = 1
                                   this.contest = this.grid[t][k]
//                                   this.blonk++
                                    break

                            }
                        }
                       }
                    
            }
            }
                
                if(wet == 1){
                    
                this.players[this.turn].select = {}
                delete this.players[this.turn].select
                                  this.blonk++
                                  return
                }
            }
//             //////console.log(this.submode)
            if(this.submode == 2){
                
                let wet = 0
//             //////console.log(this.submode)
            for(let t= 0;t<this.grid.length;t++){
//             //////console.log(this.submode)
            for(let k= 0;k<this.grid[t].length;k++){
//             //////console.log(this.submode)
                if(this.grid[t][k].owner == this.turn){
                        if(this.turn == 0){ 
                        if(this.grid[t][k].castle == 1){
                            
                                  this.submode = -1
//                             this.grid[t][k].redarmy.push(new Giy(0))
                        }
                        
                        
                        for(let r = 0;r<this.grid[t][k].improvements.length;r++){
                            if( this.grid[t][k].improvements[r] == 2){
                                
                                  this.submode = -1
                                ////console.log(this)
                            this.grid[t][k].redarmy.push(new Giy(0))
                            }
                        } 
                        
                                  this.submode = -1
                                   wet = 1

                        }else{
                        if(this.grid[t][k].castle == 1){
                                  this.submode = -1
//                             this.grid[t][k].greenarmy.push(new Giy(0))
                        }
                        
                        for(let r = 0;r<this.grid[t][k].improvements.length;r++){
                            if( this.grid[t][k].improvements[r] == 2){
                                  this.submode = -1
                                ////console.log(this)
                            this.grid[t][k].greenarmy.push(new Giy(0))
                            }
                        }
                        
                        
                                  this.submode = -1
                             wet = 1
                             

                        }
                }
                        
                    }
                }
                
                if(wet == 1){
                    
                                  this.blonk++
                                  return
                }
            }
            
            if(this.submode == 4){
                
                let wet = 0
                for(let t = 0;t<this.linear.length;t++){
                    if(this.linear[t].owner == this.turn){
                        ////console.log(this.players[this.turn].gid)
                        this.linear[t].account(this.players[this.turn].gid)
                                  this.submode = -1
                                  wet = 1
                    }
                }
                if(wet == 1){
                    
                                  this.blonk++
                                  return
                }
            }
            
            
            
            if(this.submode == 3){
                
                let wet = 0

                
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                if(this.grid[t][k].owner == this.turn){
                    if(this.grid[t][k].isPointInside(point)){
                        if(this.grid[t][k].improvements.length <4){
                            
                        this.grid[t][k].improvements.push(3)         
                                  this.submode = -1
                                wet = 1
                                  this.players[this.turn].cash[3] -= 12
                                  this.players[this.turn].cash[0] -= 12

                        }
                    }
                }
            }
            }
                if(wet == 1){
                    
                                  this.blonk++
                                  return
                }
            }
            
            
            
            
            if(this.submode == 1){
                
                let wet = 0
                
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                if(this.grid[t][k].owner == this.turn){
                    if(this.grid[t][k].isPointInside(point)){
                        if(this.grid[t][k].improvements.length <4){
                        this.grid[t][k].improvements.push(2)         
                                  this.submode = -1
                                  this.players[this.turn].cash[3] -= 10
                                  this.players[this.turn].cash[2] -= 20
//                                   this.blonk++
 wet = 1

                              }
                    }
                }
            }
            }
            
                if(wet == 1){
                    
                                  this.blonk++
                                  return
                }
            }
            
            
            if(this.submode == 5){
                
                let wet = 0
                
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                if(this.grid[t][k].owner == this.turn){
                    if(this.grid[t][k].isPointInside(point)){
                        if(this.grid[t][k].improvements.length <4){
                        this.grid[t][k].improvements.push(1)          
                                  this.submode = -1
                                  this.players[this.turn].cash[2] -= 12
                                  this.players[this.turn].cash[1] -= 12
//                                   this.blonk++
 wet = 1
}
                               
                    }
                }
            }
            }
            
                if(wet == 1){
                    
                                  this.blonk++
                                  return
                }
            }
            
            if(this.submode == 6){
                
                let wet = 0
                
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                if(this.grid[t][k].owner == this.turn){
                    if(this.grid[t][k].isPointInside(point)){
                        if(this.grid[t][k].improvements.length <4){
                        this.grid[t][k].improvements.push(0)          
                                  this.submode = -1
                                  this.players[this.turn].cash[0]-= 15
//                                   this.blonk++
 wet = 1
}
                               
                    }
                }
            }
            }
            
                if(wet == 1){
                    
                                  this.blonk++
                                  return
                }
            }
            
            
            if(this.blonk >= 3){
                
            this.blonk = 0
            this.moding = 0
            this.moveSegment = 0
            this.turn++
            this.turn%=2
            }
            
        }
    neighbors(node) {
        
        if(node){
            
        }else{
            return []
        }
        var ret = [];
        var x = node.t;
        var y = node.k;
        var grid = this.grid;
        this.diagonal = false
        // West
        if (grid[x - 1] && grid[x - 1][y]) {
            // if (grid[x - 1][y].type == node.type || (node.type2 == -1 && grid[x - 1][y].type2 == -1)) {
            // if (grid[x - 1][y].marked == 1) {
            ret.push(grid[x - 1][y]);
            // }
            // }
        }
        // East
        if (grid[x + 1] && grid[x + 1][y]) {
            // if (grid[x + 1][y].type == node.type || (node.type2 == -1 && grid[x + 1][y].type2 == -1)) {
            // if (grid[x + 1][y].marked == 1) {
            ret.push(grid[x + 1][y]);
            // }
            // }
        }
        // South
        if (grid[x] && grid[x][y - 1]) {
            // if (grid[x][y - 1].type == node.type || (node.type2 == -1 && grid[x][y - 1].type2 == -1)) {
            // if (grid[x][y - 1].marked == 1) {
            ret.push(grid[x][y - 1]);
            // }
            // }
        }
        // North
        if (grid[x] && grid[x][y + 1]) {
            // if (grid[x][y + 1].type == node.type || (node.type2 == -1 && grid[x][y + 1].type2 == -1)) {
            // if (grid[x][y + 1].marked == 1) {
            ret.push(grid[x][y + 1]);
            // }
            // }
        }
        if (this.diagonal) {
            // Southwest
            if (grid[x - 1] && grid[x - 1][y - 1]) {
                // if (grid[x - 1][y - 1].marked == 1) {
                ret.push(grid[x - 1][y - 1]);
                // }
            }
            // Southeast
            if (grid[x + 1] && grid[x + 1][y - 1]) {
                // if (grid[x + 1][y - 1].marked == 1) {
                ret.push(grid[x + 1][y - 1]);
                // }
            }
            // Northwest
            if (grid[x - 1] && grid[x - 1][y + 1]) {
                // if (grid[x - 1][y + 1].marked == 1) {
                ret.push(grid[x - 1][y + 1]);
                // }
            }
            // Northeast
            if (grid[x + 1] && grid[x + 1][y + 1]) {
                // if (grid[x + 1][y + 1].marked == 1) {
                ret.push(grid[x + 1][y + 1]);
                // }
            }
        }
                return ret;
    }


        draw(){
            
            if(this.blonk >= 3){
                
            this.blonk = 0
            this.moding = 0
            this.moveSegment = 0
            this.turn++
            this.turn%=2
            }
            this.cleanoutrec()
            if(this.moding == 2){
                this.moding = 0
                return
            }
            
            if(this.moding == 0){
                
            for(let k= 0;k<this.modeButtons.length;k++){
            this.modeButtons[k].draw()
            if(k == 0){
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("MSC", this.modeButtons[k].x , this.modeButtons[k].y + 60)  
            }
            if(k == 1){
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("FMS", this.modeButtons[k].x, this.modeButtons[k].y + 60)  
            }
            if(k == 2){
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("RCM", this.modeButtons[k].x, this.modeButtons[k].y + 60)  
            }
            if(k == 3){
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("StRF", this.modeButtons[k].x, this.modeButtons[k].y + 60)  
            }
            if(k == 4){
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("SDR", this.modeButtons[k].x, this.modeButtons[k].y + 60)  
            }
            if(k == 5){
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("DMSt", this.modeButtons[k].x, this.modeButtons[k].y + 60)  
            }
            
            
            }
            }
            if(this.moding == 1){
                
            for(let k= 0;k<this.modeDisp.length;k++){
                if(k >= this.blonk){
            this.modeDisp[k].draw()
            if(k == this.blonk  && this.submode != -1){
                this.modeDisp[k].sdraw()

            }
                    
                }else{
                    continue
                }
            if(k == 0){
                if(this.players[this.turn].gid == 0){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Move", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("Move One group of Ships", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60)  
            this.modeList[0] = 0
            }
                if(this.players[this.turn].gid == 1){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Fortify", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("For [0,0,20,10] Place Fort", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60)   
            this.modeList[0] = 1
            }
                if(this.players[this.turn].gid == 2){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Recruit", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("Gain 1 Ship Zone/Fort", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60) 
            this.modeList[0] = 2
            }
                if(this.players[this.turn].gid == 3){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Station", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("For [0,12,12,0] Place Station", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60) 
            this.modeList[0] = 5
            }
                if(this.players[this.turn].gid == 4){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Scrounge", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)   
            canvas_context.font = "12px comic sans ms"
            //canvas_context.fillText("Gain [1,1,1,1] Per Zone", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60)   
            canvas_context.fillText("Gain [1,0,0,0] Per Depot", this.modeDisp[k].x + 10, this.modeDisp[k].y + 80)   
            canvas_context.fillText("Gain [1,0,1,0] Per Station", this.modeDisp[k].x + 10, this.modeDisp[k].y + 100)   
            canvas_context.fillText("Gain [0,0,1,0] Per Fort", this.modeDisp[k].x + 10, this.modeDisp[k].y + 120)   
            canvas_context.fillText("Gain [0,1,0,1] Per Colony", this.modeDisp[k].x + 10, this.modeDisp[k].y + 140) 
            
            this.modeList[0] = 4
            }
            
                if(this.players[this.turn].gid == 5){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Depot", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("For [15,0,0,0] Place Depot", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60)   
            this.modeList[0] = 6
            }
            }
            if(k == 1){
                if(this.players[this.turn].gid == 1){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Move", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("Move One group of Ships", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60)   
            
            this.modeList[1] = 0
            }
                if(this.players[this.turn].gid == 2){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Colony", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("For [12,0,0,12] Place Colony", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60) 
            this.modeList[1] = 3
            }
                if(this.players[this.turn].gid == 3){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Recruit", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("Gain 1 Ship Zone/Fort", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60)   
            this.modeList[1] = 2 
            }
                if(this.players[this.turn].gid == 4){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Depot", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("For [15,0,0,0] Place Depot", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60)   
            this.modeList[1] = 6
            }
                if(this.players[this.turn].gid == 0){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Scrounge", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            //canvas_context.fillText("Gain [1,1,1,1] Per Zone", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60)   
            canvas_context.fillText("Gain [1,0,0,0] Per Depot", this.modeDisp[k].x + 10, this.modeDisp[k].y + 80)   
            canvas_context.fillText("Gain [1,0,1,0] Per Station", this.modeDisp[k].x + 10, this.modeDisp[k].y + 100)    
            canvas_context.fillText("Gain [0,0,1,0] Per Fort", this.modeDisp[k].x + 10, this.modeDisp[k].y + 120)   
            canvas_context.fillText("Gain [0,1,0,1] Per Colony", this.modeDisp[k].x + 10, this.modeDisp[k].y + 140) 
            
            this.modeList[1] = 4 
            }
            
                if(this.players[this.turn].gid == 5){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Move", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("Move One group of Ships", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60)  
            this.modeList[1] = 0
            }
            
            }
            if(k == 2){
                if(this.players[this.turn].gid == 2){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Move", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("Move One group of Ships", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60)  
            
            this.modeList[2] = 0
            }
                if(this.players[this.turn].gid == 3){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Fortify", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("For [0,0,20,10] Place Fort", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60) 
            this.modeList[2] = 1 
            }
                if(this.players[this.turn].gid == 4){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Recruit", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("Gain 1 Ship Zone/Fort", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60) 
            this.modeList[2] = 2
            }
                if(this.players[this.turn].gid == 5){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Station", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("For [0,12,12,0] Place Station", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60) 
            this.modeList[2] = 5
            }
                if(this.players[this.turn].gid == 0){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Colony", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            canvas_context.fillText("For [12,0,0,12] Place Colony", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60) 
            this.modeList[2] = 3
            }
                if(this.players[this.turn].gid == 1){
            canvas_context.fillStyle = "black"
            canvas_context.font = "30px comic sans ms"
            canvas_context.fillText("Scrounge", this.modeDisp[k].x + 10, this.modeDisp[k].y + 30)    
            canvas_context.font = "12px comic sans ms"
            //canvas_context.fillText("Gain [1,1,1,1] Per Zone", this.modeDisp[k].x + 10, this.modeDisp[k].y + 60)   
            canvas_context.fillText("Gain [1,0,0,0] Per Depot", this.modeDisp[k].x + 10, this.modeDisp[k].y + 80)   
            canvas_context.fillText("Gain [1,0,1,0] Per Station", this.modeDisp[k].x + 10, this.modeDisp[k].y + 100)      
            canvas_context.fillText("Gain [0,0,1,0] Per Fort", this.modeDisp[k].x + 10, this.modeDisp[k].y + 120)   
            canvas_context.fillText("Gain [0,1,0,1] Per Colony", this.modeDisp[k].x + 10, this.modeDisp[k].y + 140) 
            this.modeList[2] = 4
            }
            }
            }
            }
            for(let t= 0;t<this.grid.length;t++){
            for(let k= 0;k<this.grid[t].length;k++){
                this.grid[t][k].draw()
            }
            }
            canvas_context.fillStyle = "red"
            if(this.turn == 1){
                canvas_context.fillStyle = "#00ff00"
            }
            
            canvas_context.font = "30px comic sans ms"
            
            
            canvas_context.fillText(this.players[this.turn].cash[0] +" Scrap", 1000, 100)
            
            canvas_context.fillText(this.players[this.turn].cash[1] +" Fuel", 1000, 200)
            
            canvas_context.fillText(this.players[this.turn].cash[2] +" Ammo", 1000, 300)
            
            canvas_context.fillText(this.players[this.turn].cash[3] +" Crewmen", 1000, 400)
            
            
            if(this.aiPlayers[this.turn] == 1){
                this.aiPlay()
            }
            
            
        }
    }
    let avey = new Avey()
    
    let ship1 = new Image()
    ship1.src = "ship1.png"
    
    let ship1l = new Image()
    ship1l.src = "ship1l.png"
    
    let ship1g = new Image()
    ship1g.src = "ship1g.png"
    
    let ship1gl = new Image()
    ship1gl.src = "ship1gl.png"
    
    function drawRotatedSprite(ctx, image, x, y, width, height, angle) {
    // Save the current canvas state
//     ctx.save();

    // Move the canvas origin to the center of the sprite
    ctx.translate(x + width / 2, y + height / 2);

    // Rotate the canvas by the specified angle
    ctx.rotate(angle);

    // Draw the sprite, adjusting for the translation
    ctx.drawImage(image,0, 0, 60,60, -width / 2, -height / 2, width, height);

    ctx.rotate(-angle);
    ctx.translate(-(x + width / 2), -(y + height / 2));
    // Restore the canvas state (undo the translation and rotation)
//     ctx.restore();
}



// shippy.tilt = 0
    let dot = new Circle(360,360, 10, "white")
let link = new LineOP(TIP_engine, dot)
let la = 0

 class Ship {
     constructor(type, owner){
         this.shipin = 0
         this.a =   0
         this.clock = Math.floor((Math.random()-.5)*3)
         this.click = Math.floor((Math.random()-.5)*3)
         this.tilt = 0
         this.owner = owner
         this.x = 640
         this.y = 360
         this.target = {}
         this.target.x = this.x+50
         this.target.y = this.y
         if(this.owner == 0){
             this.x =89
             this.y = 64+(Math.random()*(720-89))
             this.target.x = this.x+50
          }else{
             this.x =1280-89
             this.target.x = this.x-50
             this.y = 64+(Math.random()*(720-89))
          }
         this.type = type
         this.link = new LineOP(this.target,this )
         this.health = 8
         this.range = 192
         this.pops = []
         this.po = 0
         
      }
      pop(){
          if(this.po == 0){
              
          for(let t =0 ;t<18;t++){
              this.pops.push(new Circle(this.x, this.y, 5, (this.owner == 1? "#00ff00" : "#ff0000"), Math.cos((t/18)*Math.PI*2), Math.sin((t/18)*Math.PI*2)))
            }
            this.po =1
            this.time = 30
            }
          
        }
      draw(){
//           this.target.x += (Math.random()-.5)*14
//           this.target.y += (Math.random()-.5)*14


            if(this.po == 1){
                
                for(let t= 0;t<this.pops.length;t++){
                    this.pops[t].draw()
                    this.pops[t].move()
                    this.pops[t].radius*=.95
                }
                this.time--
                return
            }
            let w = 0
            for(let t = 0;t<ships.length;t++){
                if(this.owner != ships[t].owner && ships[t].po == 0){
                    if(Math.random() < (2/ships.length) + .03){
                         w = 1
                        this.target = new Point(ships[t].x, ships[t].y + (this.clock*189))
                        this.target.x = ships[t].x - (this.click*189)
                        this.target.y = ships[t].y + (this.clock*189)
                        this.shipin = t
                        if(Math.random()<.05){
         this.clock = Math.floor((Math.random()-.5)*3)
         this.click = Math.floor((Math.random()-.5)*3)
                            
                        }
                        this.link.object = this.target
                        if(Math.random()<.25){
                            let l2 = new LineOP(this, ships[t], "white", 1.5)
                            let l = new LineOP(this, ships[t], "red", 3)
                            if(this.owner == 0){
                                l.color = "red"
                            }else{
                                l.color = "#00ff00"
                            }
                            if(l.hypotenuse() < this.range){
                            l.draw()
                            l2.draw()
                            ships[t].health--
                            }
                        }
                    }
                }
            }
          if(w == 0){
              
            for(let t = 0;t<ships.length;t++){
                if(this.owner != ships[t].owner && ships[t].po == 0){
//                     if(Math.random() < .1){
                         w = 1
                        this.target = new Point(ships[t].x, ships[t].y + (this.clock*189))
                        this.target.x = ships[t].x - (this.click*189)
                        this.target.y = ships[t].y + (this.clock*189)
                        this.shipin = t
                        if(Math.random()<.15){
         this.clock = Math.floor((Math.random()-.5)*3)
         this.click = Math.floor((Math.random()-.5)*3)
                            
                        }
                        this.link.object = this.target
//                     }
                }else{
                    if(this.owner != ships[t].owner){
                         w = 1
                    }
                }
            }
            }
          
          if(ships.length > 0 && this.shipin < ships.length){
              
                        this.target.x = ships[this.shipin].x - (this.click*189) 
                        this.target.y = ships[this.shipin].y + (this.clock*189)
                        this.link.object = this.target
            }
          if(w == 0 && avey.combattimer < 0 && this.po == 0){
//               avey.combattimer = 100
            }
    let a = this.link.angle()
    let z = la-this.a
    la = this.a
    if((z) > .1){
        this.tilt+=.5
        if(this.tilt > 5){
            this.tilt = 5
        }
    }else    if((z) < -.1){
        
        this.tilt-=.5
        if(this.tilt < -5){
            this.tilt = -5
        }
    }else{
        this.tilt = (Math.abs(this.tilt)-1)*Math.sign(this.tilt)
    }
    this.a =  easeAngle(this.a,a, .15)
    //////console.log(this.a)
    for(let m = 0;m<2;m++){
        
    this.x += Math.cos(this.a)*2.5

    this.y += Math.sin(this.a)*2.5
    
    let wet = 0
            for(let t = 0;t<ships.length;t++){
                
                            let l = new LineOP(this, ships[t], "red", 2)
                            if(l.hypotenuse()<48 && this != ships[t]){
                                let a = l.angle()
                                this.x += Math.cos(a)*6.5
                                this.y += Math.sin(a)*6.5
                                if(wet == 0){
                                    
        this.a +=Math.PI/2
                                }
                                wet+=.5
                            }
                            if(l.hypotenuse()<128 && this != ships[t]){
                                wet+=.25
                                
                                if(wet == 0){
                                    
        this.a +=Math.PI/5
                                }
                            }
                
            }
            let speed = Math.max(0,12-wet)
            
    this.x += Math.cos(this.a)*speed
    this.y += Math.sin(this.a)*speed
    
            for(let t = 0;t<ships.length;t++){
                
                            let l = new LineOP(this, ships[t], "red", 2)
                            if(l.hypotenuse()<48 && this != ships[t]){
                                let a = l.angle()
                                this.x += Math.cos(a)*6.5
                                this.y += Math.sin(a)*6.5
                                wet+=3
                            }
                            if(l.hypotenuse()<128 && this != ships[t]){
                                wet++
                                
                            }
                
            }
    let c = new Point(640+((Math.random()-.5)*100),360+((Math.random()-.5)*100))
    let d = new LineOP(c,this)
    let sd = d.angle()
    this.x += Math.cos(sd)*.5
    this.y += Math.sin(sd)*.5
    let re = new Rectangle(200,200,1280-400, 720-400)
    if(re.isPointInside(this)){
        
    }else{
        
    this.x += Math.cos(sd)*.75*speed
    this.y += Math.sin(sd)*.75*speed
    }
    
    }
    
    
    
    
    if(this.x > 1280-24){
        this.x = 1280-24
        this.a +=Math.PI
    }
    if(this.x < 32){
        this.x = 32
        this.a +=Math.PI

    }
    if(this.y > 720-24){
        this.y = 720-24
        this.a +=Math.PI

    }
    if(this.y< 32){
        this.y = 32
        this.a +=Math.PI

    }
    if(this.tilt >= 0){
        if(this.owner == 0){
            
    drawRotatedSprite(canvas_context, ship1,this.x-24, this.y-24, 48,48, this.a, this)
        }else{
            
    drawRotatedSprite(canvas_context, ship1g,this.x-24, this.y-24, 48,48, this.a, this)
        }
    
    }else{
        
        if(this.owner == 0){
            
    drawRotatedSprite(canvas_context, ship1l,this.x-24, this.y-24, 48,48, this.a, this)
        }else{
            
    drawRotatedSprite(canvas_context, ship1gl,this.x-24, this.y-24, 48,48, this.a, this)
        }
    
    }

        }
  }
  
//   let s = new Ship(0,0)

let ships = []
for(let t = 0;t<4;t++){
    let s = new Ship(0,t%2)
//     ships.push(s)
}
function easeAngle(current, target, easeFactor) {
    // Normalize angles to be within [0, 2π)
    const TWO_PI = 2 * Math.PI;
    current = (current % TWO_PI + TWO_PI) % TWO_PI;
    target = (target % TWO_PI + TWO_PI) % TWO_PI;

    // Find the shortest difference between the two angles
    let difference = target - current;

    // Ensure the difference is in the range [-π, π)
    if (difference > Math.PI) {
        difference -= TWO_PI;
    } else if (difference < -Math.PI) {
        difference += TWO_PI;
    }

    // Ease the current angle towards the target by a fraction of the difference
    let easedAngle = current + difference * easeFactor;

    // Normalize the eased angle back to [0, 2π)
    return (easedAngle % TWO_PI + TWO_PI) % TWO_PI;
}
function averageAngles(angle1, angle2) {
    // Convert degrees to radians
    const rad1 = angle1 * (Math.PI / 180);
    const rad2 = angle2 * (Math.PI / 180);

    // Compute the average of the sine and cosine of both angles
    const x = (Math.cos(rad1) + Math.cos(rad2)) / 2;
    const y = (Math.sin(rad1) + Math.sin(rad2)) / 2;

    // Convert the result back to degrees and use atan2 to find the resulting angle
    let result = Math.atan2(y, x) * (180 / Math.PI);

    // Ensure the angle is between 0 and 360 degrees
    if (result < 0) {
        result += 360;
    }

    return result*(Math.PI / 180);
}
let start = 0
let wins = [0,0]

class Planet {
        constructor(x,y,type){
            this.spinout = 0
            this.canvas = document.createElement('canvas');
            this.canvas.width = 128*64
            this.canvas.height = 128*64
            this.canvas_context = this.canvas.getContext('2d');
            this.world = []
            this.x = x
            this.y = y
            for(let t = 0;t<128;t++){
                let w = []
                for(let k = 0;k<128;k++){
                    let te = new Tile(t*64, k*64)
                    te.t = t
                    te.k = k
                    w.push(te)                    
                }
                this.world.push(w)
            }
            this.type = type
            if(this.type == 0){
                
            }
        }
        
    neighbors(node) {
        
        if(node){
            
        }else{
            return []
        }
        var ret = [];
        var x = node.t;
        var y = node.k;
        var grid = this.world;
        this.diagonal = false
        // West
        if (grid[x - 1] && grid[x - 1][y]) {
            // if (grid[x - 1][y].type == node.type || (node.type2 == -1 && grid[x - 1][y].type2 == -1)) {
            // if (grid[x - 1][y].marked == 1) {
            ret.push(grid[x - 1][y]);
            // }
            // }
        }
        // East
        if (grid[x + 1] && grid[x + 1][y]) {
            // if (grid[x + 1][y].type == node.type || (node.type2 == -1 && grid[x + 1][y].type2 == -1)) {
            // if (grid[x + 1][y].marked == 1) {
            ret.push(grid[x + 1][y]);
            // }
            // }
        }
        // South
        if (grid[x] && grid[x][y - 1]) {
            // if (grid[x][y - 1].type == node.type || (node.type2 == -1 && grid[x][y - 1].type2 == -1)) {
            // if (grid[x][y - 1].marked == 1) {
            ret.push(grid[x][y - 1]);
            // }
            // }
        }
        // North
        if (grid[x] && grid[x][y + 1]) {
            // if (grid[x][y + 1].type == node.type || (node.type2 == -1 && grid[x][y + 1].type2 == -1)) {
            // if (grid[x][y + 1].marked == 1) {
            ret.push(grid[x][y + 1]);
            // }
            // }
        }
        if (this.diagonal) {
            // Southwest
            if (grid[x - 1] && grid[x - 1][y - 1]) {
                // if (grid[x - 1][y - 1].marked == 1) {
                ret.push(grid[x - 1][y - 1]);
                // }
            }
            // Southeast
            if (grid[x + 1] && grid[x + 1][y - 1]) {
                // if (grid[x + 1][y - 1].marked == 1) {
                ret.push(grid[x + 1][y - 1]);
                // }
            }
            // Northwest
            if (grid[x - 1] && grid[x - 1][y + 1]) {
                // if (grid[x - 1][y + 1].marked == 1) {
                ret.push(grid[x - 1][y + 1]);
                // }
            }
            // Northeast
            if (grid[x + 1] && grid[x + 1][y + 1]) {
                // if (grid[x + 1][y + 1].marked == 1) {
                ret.push(grid[x + 1][y + 1]);
                // }
            }
        }
                return ret;
    }

        draw(){
            if(gid.mode == 0){
                this.rect = new Rectangle(this.x-32, this.y-32, 64, 64, this.color)
                this.rect.draw()
            }else{
                if(this.spinout != 1){
                    ////console.log(this)
                    for(let t = 0;t<this.world.length;t++){
                       for(let k = 0;k<this.world.length;k++){
                           if(this.world[t][k].calced == 0){
                           this.world[t][k].calcTile(t,k, gid.planets.indexOf(this))
                              }
                           this.world[t][k].calced = 1
                          }
                        }
                    for(let t = 0;t<this.world.length;t++){
                       for(let k = 0;k<this.world.length;k++){
                        this.canvas_context.drawImage(this.world[t][k].image, 0, 0, 64,64,this.world[t][k].x, this.world[t][k].y, 64,64)
                        
                       }
                    }
//                     this.spinout = 1
                    canvas_context.drawImage(this.canvas,0,0,128*64,128*64, 0,0,720,720)
                }else{
                    canvas_context.drawImage(this.canvas,0,0,128*64,128*64, 0,0,720,720)
                    
                }
                
            }
            
        }
}

    class Gid {
        constructor(){
            this.mode = 0
            this.planets = []
            for(let t = 0;t<3;t++){
                let planet = new Planet(300+ t*100, 300+ t*100, t)
                this.planets.push(planet)
            }
            
        }
        draw(){
            if(keysPressed[' ']){
                this.mode= 1
            }
            for(let t = 0;t<this.planets.length;t++){
                this.planets[t].draw()
            }
        }
    }
    
    let gid = new Gid()
    
    
    class RPS {
        constructor(){
            this.rock = Math.random()
            this.paper = Math.random()
            this.scissors = Math.random()
            this.normalize()
            this.wall = 0
            
        }
        normalize(){
            if(this.paper <= 0){
                this.paper = .0001
            }
            if(this.scissors <= 0){
                this.scissors = .0001
            }
            if(this.rock <= 0){
                this.rock = .0001
            }
            if(this.wall == 1){
                this.rock = 10000
                this.paper = 10000
                this.scissors = 10000
                return
            }
            this.j = 0
            while(this.rock+this.scissors+this.paper < 2){
                this.j++
                if(this.j>100){
                    ////console.log(this.rock, this.scissors, this.paper)
                    break
                }
                this.rock*=1.02
                this.scissors*=1.02
                this.paper*=1.02
                this.rock += .01
                this.paper += .01
                this.scissors += .01
            }
            while(this.rock > 1){     this.j++
                if(this.j>1000){
                    ////console.log("g")
                    break
                }
                this.rock/=1.01
            }
            while(this.paper > 1){     this.j++
                if(this.j>10000){
                    ////console.log("g")
                    break
                }
                this.paper/=1.01
            }
            while(this.scissors > 1){     this.j++
                if(this.j>100000){
                    ////console.log("g")
                    break
                }
                this.scissors/=1.01
            }
            while(this.rock+this.scissors+this.paper > 2){     this.j++
                if(this.j>1000000){
                    ////console.log("g")
                    break
                }
                this.rock/=1.01
                this.scissors/=1.01
                this.paper/=1.01
            }
            this.rockx = this.rock
            this.scissorsx = this.scissors
            this.paperx = this.paper
        }
        reset(){
            if(this.wall == 1){
                this.rock = 10000
                this.paper = 10000
                this.scissors = 10000
                return
            }
            this.rock = this.rockx
            this.scissors = this.scissorsx
            this.paper = this.paperx
        }
        umt(){
            return (Math.random()-.5)/15
        }
        attack(){
            
            if(this.wall == 1){
                this.rock = 10000
                this.paper = 10000
                this.scissors = 10000
                return
            }
            if(!this.n){
               this.n = nodeNeighbors(this) 
            }
//             for(let g = 0;g<this.n.length;g++){
        if(true){
            let g = Math.floor(Math.random()*this.n.length)
                
            if(this.n[g].wall == 1){
                return
            }
            if(this.rock > this.paper && this.rock > this.scissors){
                if(this.rock > this.n[g].scissors){
                    this.n[g].rockx = this.rock +this.umt()
                    this.n[g].paperx = this.paper +this.umt()
                    this.n[g].scissorsx = this.scissors +this.umt()
                }else{
                    this.rockx = this.n[g].rock +this.umt()
                    this.paperx = this.n[g].paper +this.umt()
                    this.scissorsx = this.n[g].scissors +this.umt()
                }
            }
            if(this.paper > this.rock && this.paper > this.scissors){
                if(this.paper > this.n[g].rock){
                    this.n[g].rockx = this.rock +this.umt()
                    this.n[g].paperx = this.paper +this.umt()
                    this.n[g].scissorsx = this.scissors +this.umt()
                }else{
                    this.rockx = this.n[g].rock +this.umt()
                    this.paperx = this.n[g].paper +this.umt()
                    this.scissorsx = this.n[g].scissors +this.umt()
                }
            }
            if(this.scissors > this.rock && this.scissors > this.paper){
                if(this.scissors > this.n[g].paper){
                    this.n[g].rockx = this.rock +this.umt()
                    this.n[g].paperx = this.paper +this.umt()
                    this.n[g].scissorsx = this.scissors +this.umt()
                }else{
                    this.rockx = this.n[g].rock +this.umt()
                    this.paperx = this.n[g].paper +this.umt()
                    this.scissorsx = this.n[g].scissors +this.umt()
                }
            }

            }
                    }
        draw(t){
            this.rect = new Rectangle(10+((t%size)*2), 2+(Math.floor(t/size)*2), 2, 2, `rgb(${this.rock*255},${this.paper*255},${this.scissors*255})`)
            this.rect.draw()
//             ////console.log(t, this.rect)
this.normalize()
        }
    }
    
    let size = 150
    let rps = []
    for(let t= 0;t<size;t++){
        let rpsx = []
        for(let k = 0;k<size;k++){
          let f =   new RPS()
          f.t = t
          f.k = k
          if(k == 10 && t <= 140){
              f.wall = 1
            }
          if(k == 20 && t >= 10){
              f.wall = 1
            }
          if(k == 30 && t <= 140){
              f.wall = 1
            }
          if(k == 40 && t >= 10){
              f.wall = 1
            }
          if(k == 50 && t <= 140){
              f.wall = 1
            }
          if(k == 60 && t >= 10){
              f.wall = 1
            }
          if(k == 70 && t <= 140){
              f.wall = 1
            }
          if(k == 80 && t >= 10){
              f.wall = 1
            }
        rpsx.push(f)
        }
        rps.push(rpsx)
    }
    
    function nodeNeighbors(node){
        if(node){
            
        }else{
            return []
        }
        var ret = [];
        var x = node.t;
        var y = node.k;
        var grid = rps;
        this.diagonal = false
        // West
        if (grid[x - 1] && grid[x - 1][y]) {
            // if (grid[x - 1][y].type == node.type || (node.type2 == -1 && grid[x - 1][y].type2 == -1)) {
            // if (grid[x - 1][y].marked == 1) {
            ret.push(grid[x - 1][y]);
            // }
            // }
        }
        // East
        if (grid[x + 1] && grid[x + 1][y]) {
            // if (grid[x + 1][y].type == node.type || (node.type2 == -1 && grid[x + 1][y].type2 == -1)) {
            // if (grid[x + 1][y].marked == 1) {
            ret.push(grid[x + 1][y]);
            // }
            // }
        }
        // South
        if (grid[x] && grid[x][y - 1]) {
            // if (grid[x][y - 1].type == node.type || (node.type2 == -1 && grid[x][y - 1].type2 == -1)) {
            // if (grid[x][y - 1].marked == 1) {
            ret.push(grid[x][y - 1]);
            // }
            // }
        }
        // North
        if (grid[x] && grid[x][y + 1]) {
            // if (grid[x][y + 1].type == node.type || (node.type2 == -1 && grid[x][y + 1].type2 == -1)) {
            // if (grid[x][y + 1].marked == 1) {
            ret.push(grid[x][y + 1]);
            // }
            // }
        }
        if (this.diagonal) {
            // Southwest
            if (grid[x - 1] && grid[x - 1][y - 1]) {
                // if (grid[x - 1][y - 1].marked == 1) {
                ret.push(grid[x - 1][y - 1]);
                // }
            }
            // Southeast
            if (grid[x + 1] && grid[x + 1][y - 1]) {
                // if (grid[x + 1][y - 1].marked == 1) {
                ret.push(grid[x + 1][y - 1]);
                // }
            }
            // Northwest
            if (grid[x - 1] && grid[x - 1][y + 1]) {
                // if (grid[x - 1][y + 1].marked == 1) {
                ret.push(grid[x - 1][y + 1]);
                // }
            }
            // Northeast
            if (grid[x + 1] && grid[x + 1][y + 1]) {
                // if (grid[x + 1][y + 1].marked == 1) {
                ret.push(grid[x + 1][y + 1]);
                // }
            }
        }
                return ret;
    
    }
    
    let swap = 0
    
    class Armor {
        constructor(angle, guy, width){
            this.width = width
            this.angle = angle
            this.guy = guy
            this.width = Math.min(19, this.width) //canvas size
            width = this.width
let perpAngle = angle + Math.PI / 2;

this.guy.sbody = new Circle(this.guy.body.x, this.guy.body.y, 1, "red")
this.guy.sbody.x += Math.cos(angle)*this.guy.body.radius
this.guy.sbody.y += Math.sin(angle)*this.guy.body.radius

this.p1 = new Point(
    this.guy.sbody.x + Math.cos(perpAngle) * this.width,
    this.guy.sbody.y + Math.sin(perpAngle) *this.width
);

this.p2 = new Point(
    this.guy.sbody.x - Math.cos(perpAngle) * this.width,
    this.guy.sbody.y - Math.sin(perpAngle) * this.width
);

this.link = new LineOP(this.p1, this.p2);
        }
    }
    
    class Spine {
        constructor(angle, length, guy){
            this.angle = angle
            this.length = length
            this.length = Math.min(19, this.length) //canvas size
            length = this.length
            this.guy = guy
            this.p1 = new Point(this.guy.body.x+ ((Math.cos(angle)*this.guy.body.radius)) , this.guy.body.y+ ((Math.sin(angle)*this.guy.body.radius)))
            this.p2 = new Point(this.p1.x+ ((Math.cos(angle)*length)) , this.p1.y+ ((Math.sin(angle)*length)))
            this.link = new LineOP(this.p2, this.p1)
            
        }
    }
    class Eye {
        constructor(angle, length, guy){
            this.angle = angle
            this.length = length
            this.guy = guy
            this.length = Math.min(19, this.length)//canvas size
            length = this.length
            this.p1 = new Point(this.guy.body.x+ ((Math.cos(angle)*this.guy.body.radius)) , this.guy.body.y+ ((Math.sin(angle)*this.guy.body.radius)))
            this.p2 = new Point(this.p1.x+ ((Math.cos(angle)*length)) , this.p1.y+ ((Math.sin(angle)*length)))
            this.link = new LineOP(this.p2, this.p1)
        }
    }
    class Tail {
        constructor(angle, length, guy){
            this.angle = angle
            this.length = length
            this.guy = guy
            this.length = Math.min(19, this.length)//canvas size
            length = this.length
            this.p1 = new Point(this.guy.body.x+ ((Math.cos(angle)*this.guy.body.radius)) , this.guy.body.y+ ((Math.sin(angle)*this.guy.body.radius)))
            this.p2 = new Point(this.p1.x+ ((Math.cos(angle)*length)) , this.p1.y+ ((Math.sin(angle)*length)))
            this.link = new LineOP(this.p2, this.p1)
        }
    }
    
    class Graph{
        constructor(color){
            this.color = color
            this.speck = 0
            this.height = 0
            this.max = 0
            this.canvas = document.createElement('canvas');
            this.canvas.width = 420
            this.canvas.height = 210
            this.canvas_context = this.canvas.getContext('2d');
            this.rerender = 1
            
let f = document.getElementById("graphContainer")
f.appendChild(this.canvas);
            this.nums = []
        }
        update(data, inv = 1){
            this.inv = inv
            this.speck+=1/3
            if(data > this.max){
            this.max = Math.max(data, this.max)*2
            this.rerender = 1
            
            }
            this.nums.push(data)
            this.draw()
        }
        draw(){
            this.canvas_context.clearRect(0,0,(this.nums.length/3)+420,210)
            this.canvas_context.fillStyle = "white"
            this.canvas_context.font = "9px comic sans ms"
            this.canvas_context.fillText(this.name, Math.max(10, (this.nums.length/3)-410), 10)
            this.canvas_context.strokeStyle = "white"
            this.canvas_context.lineWidth = 2
            if(this.nums.length > 1260){
                this.canvas_context.translate(-1/3, 0)
            }
//             this.canvas_context.strokeRect(0+Math.max(0, (this.nums.length/3)-420),0,420,210)
             this.rerender = 1
            this.sp = new Circle(0, 0,0, "red")
            if(this.rerender == 1){
                this.rerender = 0
            this.sp = new Circle(0, 0, 1, "red")
            let g = 0
            for(let t= Math.max(0, this.nums.length-1260);t<this.nums.length;t++){
                this.sp.x=g+Math.max(0, (this.nums.length/3)-420)
                if(this.inv == 1){
                this.sp.y = 210-((this.nums[t]/this.max)*210)
                    
                }else{
                    
                this.sp.y = ((this.nums[t]/this.max)*210)
                }
            this.canvas_context.fillStyle = this.color
            this.canvas_context.strokeStyle = this.color
            this.canvas_context.lineWidth = .5
             this.canvas_context.beginPath()
            this.canvas_context.arc(this.sp.x, this.sp.y, this.sp.radius, 0, Math.PI*2, true)
            this.canvas_context.stroke()
            g+=1/3
            }
            }else{
                
//                 this.sp.x =  this.speck
//                 this.sp.y = 210-((this.nums[this.nums.length-1]/this.max)*210)
//             this.canvas_context.fillStyle = this.color
//             this.canvas_context.strokeStyle = this.color
//             this.canvas_context.lineWidth = 1
//              this.canvas_context.beginPath()
//             this.canvas_context.arc(this.sp.x, this.sp.y, this.sp.radius, 0, Math.PI*2, true)
//             this.canvas_context.stroke()
            }
        }
    }
    
    class Animal {
        constructor(){
            this.happy = true
            this.regen = .001 + (Math.random()/10000)
//             this.speed =  0
            this.maturity = 0
            this.age = 0
            this.id = Math.random()
            this.health = 1
            this.maxhealth = this.health
            this.spincycleson = 5
            this.spincyclesoff = 5
            this.r = 128
            this.g = 128
            this.b = 128
            this.r2 = 128
            this.g2 = 128
            this.b2 = 128
            this.angle = Math.random()*2
            this.body = new Circle(Math.random()*1280, Math.random()*1280, 5, `rgb(${this.r*1},${this.g*1},${this.b*1})`)
            this.spinpattern = []
            let z = 0
            for(let t =0;t<Math.PI*4;t+=((Math.PI*2)/64)){
                this.spinpattern.push(Math.cos(t))
                if(z >= 65){
                    break
                }
                z++
            }
            this.spinstep = 10
            this.canvas = document.createElement('canvas');
            this.canvas.animal = this
            this.canvas.width = 60
            this.canvas.height = 60
            this.canvas_context = this.canvas.getContext('2d');
            this.spines = []
            this.armor = []
            this.eyes = []
            this.tails = [new Tail(Math.PI*Math.random(), 5, this)]
            this.calories = 700
            this.made = 0
            this.spinrate = .15
            this.children = [this.id]
             this.metabolism = 0
            this.canvas_context.imageSmoothingEnabled = true
            this.canvas.addEventListener('pointerup', () => {
                  let a =  new Animal()
                  let b = {}
                  b.body = {x:0,y:0,radius:this.canvas.animal.body.radius}
                  a.tails = []
                  b.tails = []
                  let keyz = Object.keys(this.canvas.animal)
//                   console.log(keyz)
                  for(let t =0;t<keyz.length;t++){
                      if( keyz[t] == "canvas" ||  keyz[t] == "canvas_context"  ||  keyz[t] == "body" ){
                        }else{
                            if(keyz[t] == "body"){
                                continue
                            }
                            if(keyz[t] == "tails"){
                                a[keyz[t]] = []
                                b[keyz[t]] = []
                                for(let k = 0;k<this.canvas.animal[keyz[t]].length;k++){
                                    a[keyz[t]][k] = new Tail(this.canvas.animal[keyz[t]][k].angle, this.canvas.animal[keyz[t]][k].length, a)
                                }
                                for(let k = 0;k<this.canvas.animal[keyz[t]].length;k++){
                                    b[keyz[t]][k] = {a:this.canvas.animal[keyz[t]][k].angle,l: this.canvas.animal[keyz[t]][k].length}
                                }
                                continue
                            }
                            if(keyz[t] == "spines"){
                                a[keyz[t]] = []
                                b[keyz[t]] = []
                                for(let k = 0;k<this.canvas.animal[keyz[t]].length;k++){
                                    a[keyz[t]][k] = new Spine(this.canvas.animal[keyz[t]][k].angle, this.canvas.animal[keyz[t]][k].length, a)
                                }
                                for(let k = 0;k<this.canvas.animal[keyz[t]].length;k++){
                                    b[keyz[t]][k] = {a:this.canvas.animal[keyz[t]][k].angle,l: this.canvas.animal[keyz[t]][k].length}
                                }
                                continue
                            }
                            if(keyz[t] == "eyes"){
                                a[keyz[t]] = []
                                b[keyz[t]] = []
                                for(let k = 0;k<this.canvas.animal[keyz[t]].length;k++){
                                    a[keyz[t]][k] = new Eye(this.canvas.animal[keyz[t]][k].angle, this.canvas.animal[keyz[t]][k].length, a)
                                }
                                for(let k = 0;k<this.canvas.animal[keyz[t]].length;k++){
                                    b[keyz[t]][k] = {a:this.canvas.animal[keyz[t]][k].angle,l: this.canvas.animal[keyz[t]][k].length}
                                }
                                continue
                            }
                            if(keyz[t] == "armor"){
                                a[keyz[t]] = []
                                b[keyz[t]] = []
                                for(let k = 0;k<this.canvas.animal[keyz[t]].length;k++){
                                    a[keyz[t]][k] = new Armor(this.canvas.animal[keyz[t]][k].angle, a, this.canvas.animal[keyz[t]][k].width)
                                }
                                for(let k = 0;k<this.canvas.animal[keyz[t]].length;k++){
                                    b[keyz[t]][k] = {a:this.canvas.animal[keyz[t]][k].angle,l: this.canvas.animal[keyz[t]][k].width}
                                }
                                continue
                            }
                            
                      a[keyz[t]] = this.canvas.animal[keyz[t]]
                      b[keyz[t]] = this.canvas.animal[keyz[t]]
                            
                        }
                      
                    }
//                   a.held = 1
                  a.made = 0
                  a.marked = 0
                  a.calories = 700
                  a.id = Math.random()
                  a.children = [a.id]
                  a.body.x = 640
                  a.body.y = 640
                  a.body.radius = this.canvas.animal.body.radius
                  a.spinstep = 10
                  a.health = this.canvas.animal.maxhealth
                  
                  
                  
                  b.made = 0
                  b.marked = 0
                  b.calories = 700
                  b.id = Math.random()
                  b.children = [b.id]
                  b.body.x = 640
                  b.body.y = 640
                  b.body.radius = this.canvas.animal.body.radius
                  b.spinstep = 10
                  b.health = this.canvas.animal.maxhealth
                  
//                   console.log(a)
                  animals.push(a)
                  console.log(b)
                  exportJSON(b)
                  
                  
            });
        }
        construct(){

let f = document.getElementById("canvasContainer")
f.appendChild(this.canvas);



            this.birthCost = 25 // 3 //10 //36 //40 //25
            this.birthCost += this.regen*30
            this.birthCost += this.spinrate*1 //3
            this.birthCost += this.maxhealth*5
            this.birthCost += this.spinpattern.length/10000
//             this.birthCost += this.speed*5
            this.birthCost += (this.body.radius*2) // r*10 // *2 //r
            this.sp =  new Circle(30,30, this.body.radius, `rgb(${this.r*1},${this.g*1},${this.b*1})`)
            this.canvas_context.fillStyle = `rgb(${this.r*1},${this.g*1},${this.b*1})`
            this.canvas_context.strokeStyle = `rgb(${this.r2*1},${this.g2*1},${this.b2*1})`
            this.canvas_context.arc(this.sp.x, this.sp.y, this.sp.radius, 0, Math.PI*2, true)
            this.canvas_context.fill()
            for(let t = 0;t<this.armor.length;t++){
                ////console.log("D")
            this.canvas_context.strokeStyle = `rgb(${this.g2*1},${this.b2*1},${this.r2*1})`
                let a = new Armor(this.armor[t].angle, {body:this.sp},this.armor[t].width )
            this.canvas_context.lineWidth = 2
             this.canvas_context.beginPath()
             this.canvas_context.moveTo(a.link.object.x, a.link.object.y)
             this.canvas_context.lineTo(a.link.target.x, a.link.target.y)
             this.canvas_context.stroke()
             this.birthCost+=1
            }
            for(let t = 0;t<this.tails.length;t++){
                ////console.log("S")
            this.canvas_context.strokeStyle = `rgba(${this.r2*1},${this.b*1},${this.g2*1},.5)`
                let a = new Tail(this.tails[t].angle, this.tails[t].length, {body:this.sp})
            this.canvas_context.lineWidth = 1
             this.canvas_context.beginPath()
             this.canvas_context.moveTo(a.link.object.x, a.link.object.y)
             this.canvas_context.lineTo(a.link.target.x, a.link.target.y)
             this.canvas_context.stroke()
            this.canvas_context.strokeStyle = `rgba(${this.b2*1},${this.g2*1},${this.r*1},.5)`
//              this.canvas_context.fillRect(a.link.object.x-2, a.link.object.y-2, 4,4)
             
                  this.canvas_context.lineWidth = 1
             this.canvas_context.beginPath()
             
             
             this.canvas_context.lineTo(a.link.object.x-(Math.cos(a.link.angle()+(Math.PI/2))*3) + (Math.cos(a.link.angle())*4), a.link.object.y-(Math.sin(a.link.angle()+(Math.PI/2))*3) + (Math.sin(a.link.angle())*4) )
             
             
             this.canvas_context.lineTo(a.link.object.x-(Math.cos(a.link.angle()+(Math.PI/2))*3), a.link.object.y-(Math.sin(a.link.angle()+(Math.PI/2))*3))
             this.canvas_context.lineTo(a.link.object.x+(Math.cos(a.link.angle()+(Math.PI/2))*3), a.link.object.y+(Math.sin(a.link.angle()+(Math.PI/2))*3))
             
             
             this.canvas_context.lineTo(a.link.object.x+(Math.cos(a.link.angle()+(Math.PI/2))*3) + (Math.cos(a.link.angle())*4), a.link.object.y+(Math.sin(a.link.angle()+(Math.PI/2))*3) + (Math.sin(a.link.angle())*4) )
             
             this.canvas_context.stroke()
             
             
             this.birthCost+=2
             this.birthCost+=(a.length/10) 
            }
            for(let t = 0;t<this.spines.length;t++){
                ////console.log("S")
            this.canvas_context.strokeStyle = `rgb(${this.r2*1},${this.g2*1},${this.b2*1})`
                let a = new Spine(this.spines[t].angle, this.spines[t].length, {body:this.sp}) //-2
            this.canvas_context.lineWidth = 1
             this.canvas_context.beginPath()
             this.canvas_context.moveTo(a.link.object.x, a.link.object.y)
             this.canvas_context.lineTo(a.link.target.x, a.link.target.y)
             this.canvas_context.stroke()
            this.canvas_context.strokeStyle = `rgb(${this.b*1},${this.g*1},${this.r*1})`
//              this.canvas_context.fillRect(a.link.object.x-2, a.link.object.y-2, 4,4)
             
                  this.canvas_context.lineWidth = 4
             this.canvas_context.beginPath()
             this.canvas_context.moveTo(a.link.object.x-(Math.cos(a.link.angle()+(Math.PI/2))*2), a.link.object.y-(Math.sin(a.link.angle()+(Math.PI/2))*2))
             this.canvas_context.lineTo(a.link.object.x+(Math.cos(a.link.angle()+(Math.PI/2))*2), a.link.object.y+(Math.sin(a.link.angle()+(Math.PI/2))*2))
             this.canvas_context.stroke()
             
             
             this.birthCost+=6
             this.birthCost+=(a.length/8)
            }
            for(let t = 0;t<this.eyes.length;t++){
                ////console.log("S")
            this.canvas_context.strokeStyle = `rgb(${this.b2*1},${this.r2*1},${this.g2*1})`
                let a = new Eye(this.eyes[t].angle, this.eyes[t].length, {body:this.sp})
             this.canvas_context.lineWidth = 1
             this.canvas_context.beginPath()
             this.canvas_context.moveTo(a.link.object.x, a.link.object.y)
             this.canvas_context.lineTo(a.link.target.x, a.link.target.y)
             this.canvas_context.stroke()
             this.birthCost+=.5
             this.birthCost+=(a.length/100)
            }
            
            
            for(let t = 0;t<this.eyes.length;t++){
            this.canvas_context.fillStyle = `rgb(${this.g*1},${this.b*1},${this.r*1})`
                let a = new Eye(this.eyes[t].angle, this.eyes[t].length-2, {body:this.sp})  //-2
//              this.canvas_context.beginPath()
//                this.canvas_context.arc(a.link.target.x, a.link.target.y, 2, 0, Math.PI*2, true)
//               this.canvas_context.fill()
             this.canvas_context.beginPath()
               this.canvas_context.arc(a.link.object.x, a.link.object.y, 2, 0, Math.PI*2, true)
              this.canvas_context.fill()
            }
            
            
            this.birthCost *= 10
            this.metabolism = this.birthCost/4000 //5000
            if(this.tails.length == 0){
            this.metabolism = this.birthCost/10000 //5000
            }
        }
        live(){
            if(this.held == 1){
                this.body.x = TIP_engine.x
                this.body.y = TIP_engine.y
                
                canvas_context.fillStyle = "white"
                canvas_context.fillRect(this.body.x, this.body.y, 430, 700)
                canvas_context.fillStyle = "black"
            canvas_context.font = "10px comic sans ms"
//             canvas_context.fillText("Click to start, you will play as gid", 100, 100)
                let ks = Object.keys(this)
                let g =0
                for(let t =0 ;t<ks.length;t++){
                    if(typeof this[ks[t]] == "number"){
                        g++
                    canvas_context.fillText(ks[t]+": "+this[ks[t]], this.body.x + 10, this.body.y + (g*12)+ 12)
                    } 
                    if(ks[t] == 'tails' || ks[t] == 'armor' || ks[t] == 'eyes' || ks[t] == 'spines' ){
                        g++
                    canvas_context.fillText(ks[t]+": "+this[ks[t]].length, this.body.x + 10, this.body.y + (g*12)+ 12)
                    }
                }
                g++
                canvas_context.fillText("Path: ", this.body.x + 10, this.body.y + (g*12)+ 12)
                let dot = new Circle(this.body.x + 200, this.body.y + 515, .4, "black")
                
                let count = this.spincycleson
                let count2 = this.spincyclesoff
                let dir = new Point(0,0)
                let ang = 0
                for(let t = 0;t<(this.spinpattern.length*(count+count2));t++){
                    if(t<(this.spinpattern.length*count)){
                    dot.draw()
                    dot.x += (Math.cos(ang))/5
                    dot.y += (Math.sin(ang))/5
                    dir.x += (Math.cos(ang))/5
                    dir.y += (Math.sin(ang))/5
                    ang+= (this.spinpattern[t%this.spinpattern.length])*(this.spinrate/2)
                    
                    }else{
                        dot.draw()
                        
                    dot.x += (Math.cos(ang))/5
                    dot.y += (Math.sin(ang))/5
//                         dot.x += dir.x/((this.spinpattern.length*count)+1)
//                         dot.y += dir.y/((this.spinpattern.length*count)+1)
                    }
                }
                
                
                return
            }
            this.age++
            if(this.age > 500){
                this.maturity = 1
                this.age = 100
            }
            this.seekFood()
            if(this.calories >= 750+this.birthCost && this.maturity == 1){
                //console.log(this.birthCost)
                this.birth()
                this.calories = 700
            }
            this.calories -= this.metabolism
            if(this.calories <= 0){
                this.marked = 1
            }
            if(this.idle == 1){
                this.spinstep+=1
            this.angle += ((this.spinpattern[Math.floor(this.spinstep)%this.spinpattern.length])*(this.spinrate/2)) //.  /20 // /10
            if(Math.floor(this.spinstep)%(this.spinpattern.length*this.spincycleson) == 0 || this.spincycleson == 0){
                this.idle = 0
            }
            }else{
                this.spinstep+=1
            if(Math.floor(this.spinstep)%(this.spinpattern.length*this.spincyclesoff) == 0 || this.spincyclesoff == 0){
                this.idle = 1
            }
            } 
        }
        draw(){
            if(this.made == 0){
                this.construct()
                this.made = 1
            }
            drawRotatedSprite(canvas_context, this.canvas, this.body.x-30, this.body.y-30,60,60, this.angle)

            
        }
        seekFood(){
            this.lc = new LineOP(this.body, this.body)
            if(this.age%1 ==0){ //throttle
                this.l = new LineOP(this.body, this.body)
            let p = new Point(this.body.x, this.body.y)
                let l = new LineOP(this.body, this.body, "red" ,1)
            for(let t= 0;t<this.eyes.length;t++){
                p.x = this.body.x
                p.y = this.body.y
                p.x += Math.cos(this.eyes[t].angle+this.angle)*this.eyes[t].length
                p.y += Math.sin(this.eyes[t].angle+this.angle)*this.eyes[t].length
                l.target = p
//                 l.draw()
                for(let k = 0;k<food.length;k++){
                    this.lc.target = food[k].body
                    if(this.lc.hypotenuse > 50){
                        continue
                    }
                    
                    
                  if(circleLine(l, food[k].body)==1){
                     this.angle = easeAngle(this.angle, (new LineOP( food[k].body,this.body)).angle(), this.spinrate)
                     this.idle = 0
                     this.spinstep = 1
                        this.l.target = food[k].body
                        if(this.l.hypotenuse() < this.body.radius+food[k].body){
                         food[k].marked = 1
                         food[k].calories = 0
                         this.calories += food[k].calories
                      }
                  }
                }
                if(this.spines.length > 0){
                for(let k = 0;k<animals.length;k++){   
                    this.lc.target = animals[k].body
                    if(this.lc.hypotenuse > 50){
                        continue
                    }
                for(let r = 0;r<this.spines.length;r++){
                               p.x = this.body.x
                p.y = this.body.y
                p.x += Math.cos(this.spines[r].angle+this.angle)*this.spines[r].length
                p.y += Math.sin(this.spines[r].angle+this.angle)*this.spines[r].length
                l.target = p
                    if(!this.children.includes(animals[k].id) && this.health >= animals[k].health && this.spines.length > animals[k].spines.length && this.spines.length > animals[k].armor.length){
//                         //console.log("find") 
                      if(circleLine(l, animals[k].body)==1){
                        //console.log("this")
                     this.angle = easeAngle(this.angle, (new LineOP(animals[k].body, this.body )).angle(), this.spinrate)  //was flipped?
//                      if(this.body.doesPerimeterTouch(animals[k].body)){
                        this.l.target = animals[k].body
                        if(this.l.hypotenuse() < this.body.radius+animals[k].body){
                         if(animals[k].health >= 1){
                              //console.log("one")
                             if(animals[k].armor.length > 0){
                              //console.log("two")
                                    let wet = 0
                                    for(let a = 0;a<animals[k].armor.length;a++){
                                    for(let s = 0;s<this.spines.length;s++){
                                        if(lineLine(animals[k].armor[a].link, this.spines[s].link)){
                                            wet = 1
                                        } 
                                    } 
                                    }
                                    if(wet == 0){
                                    for(let s = 0;s<this.spines.length;s++){
                                        if(circleLine(this.spines[s].link, animals[k].body)==1){
                                            if(wet ==1){
                                                continue
                                            }
                                              animals[k].health--
                                              //console.log(this, animals[k])
                                              //animals[k].body.x  += Math.cos(this.angle)*this.speed*2
                                              //animals[k].body.y  += Math.sin(this.angle)*this.speed*2
                                              wet = 1
                                                     if(animals[k].health <= 0){

                                 this.calories += (new Food()).calories/2 // Math.max(animals[k].calories-700, 0) + 50
                              animals[k].marked = 1
                              animals[k].calories = -1
                              //console.log("dead")
                              
                                }
                                        }
                                    }
                                    }
    
                              }else{
                                animals[k].health--
                                              //console.log(this, animals[k])
                                //animals[k].body.x  += Math.cos(this.angle)*this.speed*2
                                //animals[k].body.y  += Math.sin(this.angle)*this.speed*2
                                if(animals[k].health <= 0){

                                 this.calories += (new Food()).calories/2 // Math.max(animals[k].calories-700, 0) + 50
                              animals[k].marked = 1
                              animals[k].calories = -1
                              //console.log("dead")
                              
                                }
                              }
                          }else{
                                 this.calories += (new Food()).calories/2 // Math.max(animals[k].calories-700, 0) + 50
                              animals[k].marked = 1
                              animals[k].calories = -1
                              //console.log("dead")
                              
                              
                            }
                      }
                      }
                  }else{
                      
                      if(circleLine(l, animals[k].body)==1){
                          if(animals[k].spines.length > 0 && !this.children.includes(animals[k].id)){
                                this.angle = easeAngle(this.angle, (new LineOP(this.body, animals[k].body)).angle(), this.spinrate)
                                this.idle = 0 
                            }
                     }
                     
                      
                      
                      
                      
                      
                    } 
                    
                    
                    
                  }
                }
                }
            }
            
                if(this.spines.length > 0){
                for(let k = 0;k<animals.length;k++){
                    this.lc.target = animals[k].body
                    if(this.lc.hypotenuse > 50){
                        continue
                    }
                    
                    if(!this.children.includes(animals[k].id) && this.health >= animals[k].health){
//                                               //console.log("tap")
                        for(let r = 0;r<this.spines.length;r++){
                               p.x = this.body.x
                p.y = this.body.y
                p.x += Math.cos(this.spines[r].angle+this.angle)*this.spines[r].length
                p.y += Math.sin(this.spines[r].angle+this.angle)*this.spines[r].length
                l.target = p
                      if(circleLine(l, animals[k].body)==1){
                              //console.log("poke")
//                         this.l.target = animals[k].body
//                         if(this.l.hypotenuse() < this.body.radius+animals[k].body){
//                               //console.log("snap")
                         if(animals[k].health >= 1){
                             animals[k].health--
                               //console.log("snap")
                                              //console.log(this, animals[k])
                                //animals[k].body.x  += Math.cos(this.angle)*this.speed*2
                                //animals[k].body.y  += Math.sin(this.angle)*this.speed*2
                                       if(animals[k].health <= 0){

                              //console.log("dead")
                                 this.calories += (new Food()).calories/2 // Math.max(animals[k].calories-700, 0) + 50
                              animals[k].marked = 1
                              animals[k].calories = -1
                              
                                }
                          }else{
                                 this.calories += (new Food()).calories/2 // Math.max(animals[k].calories-700, 0) + 50
                              //console.log("dead")
                              animals[k].marked = 1
                              animals[k].calories = -1
                              
                            }
//                       }
                      }
                      }
                  }
                  }
                }
                for(let k = 0;k<food.length;k++){
//                     this.lc.target = food[k].body
//                     if(this.lc.hypotenuse > 50){
//                         continue
//                     }
                    this.l.target = food[k].body
//                      if(this.body.doesPerimeterTouch(food[k].body)){
                        if(this.l.hypotenuse() < this.body.radius+food[k].body.radius){
                         food[k].marked = 1
                         this.calories += food[k].calories
//                          ////console.log("G")
                      }
                }
                
                }
                
                
                let a = new Point(0,0)
            
                for(let k = 0;k<this.tails.length;k++){
                    a.x -= Math.cos(this.tails[k].angle)*this.tails[k].length
                    a.y -= Math.sin(this.tails[k].angle)*this.tails[k].length
                }
                let len = new LineOP(a, new Point(0,0))
                let h = len.hypotenuse()/11
                let as = len.angle()
                as += this.angle
            
//             this.angle = as
                
            if(this.body.x > tankmax){
                this.angle = (Math.PI*1)+as+(Math.random()*Math.PI)
                this.body.x = tankmax
            }
            if(this.body.y > tankmax){ 
                this.angle = (Math.PI*1.5)+as+(Math.random()*Math.PI)
                this.body.y = tankmax
            }
            if(this.body.x < tankmin){
                this.angle = (Math.PI*0)+as+(Math.random()*Math.PI)
                this.body.x = tankmin
            }
            if(this.body.y < tankmin){
                this.angle = (Math.PI*.5)+as+(Math.random()*Math.PI)
                this.body.y = tankmin
            }
            
            this.weight = ((this.body.radius)/5)+24
            this.weight += this.maxhealth/5
            for(let t =0;t<this.tails.length;t++){
            this.weight++
            this.weight+= this.tails[t].length/10
            }
            for(let t =0;t<this.eyes.length;t++){
            this.weight+=.05
            this.weight+= this.eyes[t].length/100
                
            }
            for(let t =0;t<this.armor.length;t++){
            this.weight++
            this.weight+= this.armor[t].width/5
                
            }
            for(let t =0;t<this.spines.length;t++){
            this.weight+=1.2
            this.weight+= this.spines[t].length/10
                
            }
            this.rad = this.weight/25
            if(this.rad == 0){
                this.rad = .001
            }
            if(h == 0){
                h = .01
            }
            
            this.movespeed = (h/this.rad)
            
            
            this.body.x += Math.cos(as)*(h/this.rad)
            this.body.y += Math.sin(as)*(h/this.rad)
            this.dangle = as
            this.warp = h
            if(this.health < this.maxhealth){
                this.health += this.regen
                this.calories -= this.regen*20
            }else{
                this.health = this.maxhealth
            }
//             this.body.x += Math.cos(this.angle)*this.speed
//             this.body.y += Math.sin(this.angle)*this.speed
        }
        umtc(){
            return (Math.random()-.5)*20 //30 //10
        }
        umts(){
            return (Math.random()-.5)/2
        }
        umte(){
            return (Math.random()-.5)*3 //2
        }
        umtp(){
            return (Math.random()-.5)/20
        }
        umtr(){
            return (Math.random()-.5)/2000
        }
        umtt(){
            return (Math.random()-.5)/10
        }
        umth(){
            return Math.floor((Math.random()-.5)*3)
        }
        birth(){
            if(this.maturity == 0){
                return
            }else{
                this.age = 100
                this.maturity = 0
            }
            let clone = new Animal()
                if(Math.random() <mutationRate){
            clone.regen = this.regen+this.umtr()
            clone.regen = Math.max(0, clone.regen)
            }
            clone.tails = []
            for(let t =0;t<this.spinpattern.length;t++){
                clone.spinpattern[t] = this.spinpattern[t]
                if(Math.random() <mutationRate){
                    clone.spinpattern[t] += this.umtp()
                }
            }
                if(Math.random() <mutationRate){
                    clone.spinpattern.splice(Math.floor(Math.random()*clone.spinpattern.length), 0, this.umte()) //umtp
                }
                if(Math.random() <mutationRate){
                    clone.spinpattern.splice(Math.floor(Math.random()*clone.spinpattern.length),1)
                }
            clone.spincycleson = this.spincycleson
            clone.spincyclesoff = this.spincyclesoff
                if(Math.random() <mutationRate){
                    clone.spincycleson += (this.umte())
                    clone.spincycleson = Math.round(clone.spincycleson)
                }
                if(Math.random() <mutationRate){
                    clone.spincyclesoff += (this.umte())
                    clone.spincyclesoff = Math.round(clone.spincyclesoff)
                }
                if(clone.spincycleson <= 0){
                    clone.spincycleson = 0
                }
                if(clone.spincyclesoff <= 0){
                    clone.spincyclesoff = 0
                }
            
            clone.maturity = 0
                if(Math.random() <mutationRate){
            clone.health = this.maxhealth + this.umth()
            }else{
               clone.health = this.maxhealth 
            }
            if(clone.health <=1){
                clone.health = 1
            }
            clone.maxhealth = clone.health
            
            
            if(Math.random() <colorMutationRate){
                clone.r = this.r + this.umtc()
            }else{
                clone.r = this.r 
            }
            if(Math.random() <colorMutationRate){
                clone.g = this.g + this.umtc()
            }else{
                clone.g = this.g
            }
            if(Math.random() <colorMutationRate){
                clone.b = this.b + this.umtc()
            }else{
                clone.b = this.b
            }
            if(Math.random() <colorMutationRate){
                clone.r2 = this.r2 + this.umtc()
            }else{
                clone.r2 = this.r2 
            }
            if(Math.random() <colorMutationRate){
                clone.g2 = this.g2 + this.umtc()
            }else{
                clone.g2 = this.g2 
            }
            if(Math.random() <colorMutationRate){
                clone.b2 = this.b2 + this.umtc()
            }else{
                clone.b2 = this.b2
            }
            clone.r = Math.min(Math.max(clone.r,0),255)
            clone.g = Math.min(Math.max(clone.g,0),255)
            clone.b = Math.min(Math.max(clone.b,0),255)
            clone.r2 = Math.min(Math.max(clone.r2,0),255)
            clone.g2 = Math.min(Math.max(clone.g2,0),255)
            clone.b2 = Math.min(Math.max(clone.b2,0),255)
                if(Math.random() <mutationRate){
            clone.spinrate = this.spinrate + this.umtp()
            clone.spinrate = Math.max(0,clone.spinrate)
            }else{
                
            clone.spinrate = this.spinrate 
            clone.spinrate = Math.max(0,clone.spinrate)
                
            }
                if(Math.random() <mutationRate){
            clone.body.radius = this.body.radius +  this.umts()
            }else{
                
            clone.body.radius = this.body.radius 
            }
            clone.body.radius = Math.max(.1,clone.body.radius)
            clone.body.radius = Math.min(19,clone.body.radius)
            clone.body.x = this.body.x
            clone.body.y = this.body.y
            clone.body.color = `rgb(${clone.g*1},${clone.b*1},${clone.r*1})`
            
//             clone.speed = this.speed + this.umtp()
//             clone.speed = Math.max(0,clone.speed)
            
            for(let t = 0;t<this.armor.length;t++){
           if(Math.random() < smallMutationRate){
                       if(Math.random() < smallMutationRate){
                clone.armor.push(new Armor(this.armor[t].angle+this.umtp(), clone,this.armor[t].width+this.umte()))
                }else{
                    
                clone.armor.push(new Armor(this.armor[t].angle, clone, this.armor[t].width+this.umte()))
                }
                
                    }else{
                        
                       if(Math.random() < smallMutationRate){

                clone.armor.push(new Armor(this.armor[t].angle+this.umtp(),clone,this.armor[t].width))
                }else{
                    
                clone.armor.push(new Armor(this.armor[t].angle,clone,this.armor[t].width))
                }
                    }
            }
            if(Math.random() < hugeMutationRate*2){
                clone.armor.push(new Armor(Math.random()*Math.PI*2, clone, 2))
                
                 ////console.log("a")
            }
            if(Math.random() < hugeMutationRate*2){
                clone.armor.splice(Math.floor(Math.random()*clone.armor.length),1)
            }
            
            
            
            
            for(let t = 0;t<this.spines.length;t++){
                    if(Math.random() < smallMutationRate){
                       if(Math.random() < smallMutationRate){
                clone.spines.push(new Spine(this.spines[t].angle+this.umtp(),this.spines[t].length+this.umte(), clone))
                }else{
                    
                clone.spines.push(new Spine(this.spines[t].angle,this.spines[t].length+this.umte(), clone))
                }
                
                    }else{
                        
                       if(Math.random() < smallMutationRate){

                clone.spines.push(new Spine(this.spines[t].angle+this.umtp(),this.spines[t].length, clone))
                }else{
                    
                clone.spines.push(new Spine(this.spines[t].angle,this.spines[t].length, clone))
                }
                    }//maybe remove very short spines?
            }
            if(Math.random() < hugeMutationRate){
                clone.spines.push(new Spine(Math.random()*Math.PI*2,  (Math.random()-.5)+1, clone))
                 ////console.log("s") 
            }
            if(Math.random() < hugeMutationRate){
                clone.spines.splice(Math.floor(Math.random()*clone.spines.length),1)
            }
            
            
            
            
            
            
            
            
            for(let t = 0;t<this.tails.length;t++){
                    if(Math.random() < smallMutationRate){
                       if(Math.random() < smallMutationRate){
                clone.tails.push(new Tail(this.tails[t].angle+this.umtp(),this.tails[t].length+this.umtt(), clone))
                }else{
                    
                clone.tails.push(new Tail(this.tails[t].angle,this.tails[t].length+this.umtt(), clone))
                }
                
                    }else{
                        
                       if(Math.random() < smallMutationRate){

                clone.tails.push(new Tail(this.tails[t].angle+this.umtp(),this.tails[t].length, clone))
                }else{
                    
                clone.tails.push(new Tail(this.tails[t].angle,this.tails[t].length, clone))
                }
                    }
            }
            if(Math.random() < hugeMutationRate*.2){
                clone.tails.push(new Tail(Math.random()*Math.PI*2, 1, clone))
                 ////console.log("s") 
            }
            if(Math.random() < hugeMutationRate*.2){
                clone.tails.splice(Math.floor(Math.random()*clone.tails.length),1)
            }
            
            
            
            for(let t = 0;t<this.eyes.length;t++){
            
                  if(Math.random() < smallMutationRate){
                       if(Math.random() < smallMutationRate){
                clone.eyes.push(new Eye(this.eyes[t].angle+this.umtp(),this.eyes[t].length+this.umte(), clone))
                }else{
                    
                clone.eyes.push(new Eye(this.eyes[t].angle,this.eyes[t].length+this.umte(), clone))
                }
                
                    }else{
                        
                       if(Math.random() < smallMutationRate){

                clone.eyes.push(new Eye(this.eyes[t].angle+this.umtp(),this.eyes[t].length, clone))
                }else{
                    
                clone.eyes.push(new Eye(this.eyes[t].angle,this.eyes[t].length, clone))
                }
                    }
            }
            if(Math.random() < hugeMutationRate){
                clone.eyes.push(new Eye(Math.random()*Math.PI*2,  (Math.random()-.5) + 8, clone))
                 ////console.log("e")
            }
            if(Math.random() < hugeMutationRate){
                clone.eyes.splice(Math.floor(Math.random()*clone.eyes.length),1)
            }
            
            clone.id = this.id
            this.children.push(clone.id)
            clone.children.push(this.id)
            clone.children.push(clone.id)
            
            
            animals.push(clone)
        }
    }
    
    
    class Food{
        constructor(){
            this.calories = 350
            this.body = new Circle(tankmin + Math.random()*(tankmax-tankmin), tankmin + Math.random()*(tankmax-tankmin), 5, "white")
            
        }
        draw(){
            this.body.x = Math.min(Math.max(tankmin,this.body.x),tankmax)
            this.body.y = Math.min(Math.max(tankmin,this.body.y),tankmax)
            this.body.draw()
            this.calories -= .05
                this.body.radius*= .99975
            if(this.calories <= 0){
                this.marked = 1
            }
        }
        sdraw(){
            
            this.calories -= .05
                this.body.radius*= .99975
            if(this.calories <= 0){
                this.marked = 1
            }
        }
    }
    
    let animals = []
    for(let t= 0;t<10;t++){
        let f = new Animal()
//         animals.push(f)
    }
    
    let food = []
    for(let t= 0;t<20;t++){
        let f = new Food()
        food.push(f)
    }
        let foodtime = 0
        
        function addSlug(slugin){
            let j = 0
            while(true){
                j++
                if(j>20){
                    break
                }
                
              let a =  new Animal()
                  let b = {}
                  b.body = {x:0,y:0,radius:slugin.body.radius}
                  a.tails = []
                  b.tails = []
                  let keyz = Object.keys(slugin)
//                   console.log(keyz)
                  for(let t =0;t<keyz.length;t++){
                      if( keyz[t] == "canvas" ||  keyz[t] == "canvas_context"  ||  keyz[t] == "body" ){
                        }else{
                            if(keyz[t] == "body"){
                                continue
                            }
                            if(keyz[t] == "tails"){
                                a[keyz[t]] = []
                                b[keyz[t]] = []
                                for(let k = 0;k<slugin[keyz[t]].length;k++){
                                    a[keyz[t]][k] = new Tail(slugin[keyz[t]][k].a, slugin[keyz[t]][k].l, a)
                                }
                                for(let k = 0;k<slugin[keyz[t]].length;k++){
                                    b[keyz[t]][k] = {a:slugin[keyz[t]][k].a,l: slugin[keyz[t]][k].l}
                                }
                                continue
                            }
                            if(keyz[t] == "spines"){
                                a[keyz[t]] = []
                                b[keyz[t]] = []
                                for(let k = 0;k<slugin[keyz[t]].length;k++){
                                    a[keyz[t]][k] = new Spine(slugin[keyz[t]][k].a, slugin[keyz[t]][k].l, a)
                                }
                                for(let k = 0;k<slugin[keyz[t]].length;k++){
                                    b[keyz[t]][k] = {a:slugin[keyz[t]][k].a,l: slugin[keyz[t]][k].l}
                                }
                                continue
                            }
                            if(keyz[t] == "eyes"){
                                a[keyz[t]] = []
                                b[keyz[t]] = []
                                for(let k = 0;k<slugin[keyz[t]].length;k++){
                                    a[keyz[t]][k] = new Eye(slugin[keyz[t]][k].a, slugin[keyz[t]][k].l, a)
                                }
                                for(let k = 0;k<slugin[keyz[t]].length;k++){
                                    b[keyz[t]][k] = {a:slugin[keyz[t]][k].a,l: slugin[keyz[t]][k].l}
                                }
                                continue
                            }
                            if(keyz[t] == "armor"){
                                a[keyz[t]] = []
                                b[keyz[t]] = []
                                for(let k = 0;k<slugin[keyz[t]].length;k++){
                                    a[keyz[t]][k] = new Armor(slugin[keyz[t]][k].a, a, slugin[keyz[t]][k].l)
                                }
                                for(let k = 0;k<slugin[keyz[t]].length;k++){
                                    b[keyz[t]][k] = {a:slugin[keyz[t]][k].a,l: slugin[keyz[t]][k].l}
                                }
                                continue
                            }
                            
                      a[keyz[t]] = slugin[keyz[t]]
                      b[keyz[t]] = slugin[keyz[t]]
                            
                        }
                      
                    }
//                   a.held = 1
                  a.made = 0
                  a.marked = 0
                  a.calories = 700
                  a.id = 0
                  a.children = [a.id]
                  a.body.x = (Math.random()*320)+ 320
                  a.body.y = (Math.random()*640)+320
                  a.body.radius = slugin.body.radius
                  a.spinstep = 10
                  a.angle = Math.random()*Math.PI*2
                  a.health = slugin.maxhealth
                  
                  
//                   
//                   b.made = 0
//                   b.marked = 0
//                   b.calories = 700
//                   b.id = Math.random()
//                   b.children = [b.id]
//                   b.body.x = 640
//                   b.body.y = 640
//                   b.body.radius = slugin.body.radius
//                   b.spinstep = 10
//                   b.health = slugin.maxhealth
//                   
//                   console.log(a)
                  animals.push(a)
//                   console.log(b)
//                   exportJSON(b)
                  
                  

            }
            let j2 = 0
            while(true){
                j2++
                if(j2>20){
                    break
                }
              let a =  new Animal()
                  let b = {}
                  b.body = {x:0,y:0,radius:slugout.body.radius}
                  a.tails = []
                  b.tails = []
                  let keyz = Object.keys(slugout)
//                   console.log(keyz)
                  for(let t =0;t<keyz.length;t++){
                      if( keyz[t] == "canvas" ||  keyz[t] == "canvas_context"  ||  keyz[t] == "body" ){
                        }else{
                            if(keyz[t] == "body"){
                                continue
                            }
                            if(keyz[t] == "tails"){
                                a[keyz[t]] = []
                                b[keyz[t]] = []
                                for(let k = 0;k<slugout[keyz[t]].length;k++){
                                    a[keyz[t]][k] = new Tail(slugout[keyz[t]][k].a, slugout[keyz[t]][k].l, a)
                                }
                                for(let k = 0;k<slugout[keyz[t]].length;k++){
                                    b[keyz[t]][k] = {a:slugout[keyz[t]][k].a,l: slugout[keyz[t]][k].l}
                                }
                                continue
                            }
                            if(keyz[t] == "spines"){
                                a[keyz[t]] = []
                                b[keyz[t]] = []
                                for(let k = 0;k<slugout[keyz[t]].length;k++){
                                    a[keyz[t]][k] = new Spine(slugout[keyz[t]][k].a, slugout[keyz[t]][k].l, a)
                                }
                                for(let k = 0;k<slugout[keyz[t]].length;k++){
                                    b[keyz[t]][k] = {a:slugout[keyz[t]][k].a,l: slugout[keyz[t]][k].l}
                                }
                                continue
                            }
                            if(keyz[t] == "eyes"){
                                a[keyz[t]] = []
                                b[keyz[t]] = []
                                for(let k = 0;k<slugout[keyz[t]].length;k++){
                                    a[keyz[t]][k] = new Eye(slugout[keyz[t]][k].a, slugout[keyz[t]][k].l, a)
                                }
                                for(let k = 0;k<slugout[keyz[t]].length;k++){
                                    b[keyz[t]][k] = {a:slugout[keyz[t]][k].a,l: slugout[keyz[t]][k].l}
                                }
                                continue
                            }
                            if(keyz[t] == "armor"){
                                a[keyz[t]] = []
                                b[keyz[t]] = []
                                for(let k = 0;k<slugout[keyz[t]].length;k++){
                                    a[keyz[t]][k] = new Armor(slugout[keyz[t]][k].a, a, slugout[keyz[t]][k].l)
                                }
                                for(let k = 0;k<slugout[keyz[t]].length;k++){
                                    b[keyz[t]][k] = {a:slugout[keyz[t]][k].a,l: slugout[keyz[t]][k].l}
                                }
                                continue
                            }
                            
                      a[keyz[t]] = slugout[keyz[t]]
                      b[keyz[t]] = slugout[keyz[t]]
                            
                        }
                      
                    }
//                   a.held = 1
                  a.made = 0
                  a.marked = 0
                  a.calories = 700
                  a.id = 1
                  a.children = [a.id]
                  a.body.x = (Math.random()*320)+ 640
                  a.body.y = (Math.random()*640)+320
                  a.body.radius = slugout.body.radius
                  a.angle = Math.random()*Math.PI*2
                  a.spinstep = 10
                  a.health = slugout.maxhealth
                  
                  
//                   
//                   b.made = 0
//                   b.marked = 0
//                   b.calories = 700
//                   b.id = Math.random()
//                   b.children = [b.id]
//                   b.body.x = 640
//                   b.body.y = 640
//                   b.body.radius = slugout.body.radius
//                   b.spinstep = 10
//                   b.health = slugout.maxhealth
//                   
//                   console.log(a)
                  animals.push(a)
//                   console.log(b)
//                   exportJSON(b)
                  
                  

            }
        }
        
        function lineLine(line1, line2) {
    // Helper function to calculate the orientation of three points (p, q, r)
    function orientation(p, q, r) {
        let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
        if (val === 0) return 0; // Collinear
        return (val > 0) ? 1 : 2; // Clockwise or Counterclockwise
    }

    // Helper function to check if point q lies on the segment pr
    function onSegment(p, q, r) {
        return (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
                q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y));
    }

    // Extracting points from lines
    const p1 = line1.object, q1 = line1.target;
    const p2 = line2.object, q2 = line2.target;

    // Find the four orientations needed for general and special cases
    const o1 = orientation(p1, q1, p2); 
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    // General case: If the orientations differ, the lines intersect
    if (o1 !== o2 && o3 !== o4) return true;

    // Special cases:
    // Line1 and Line2 are collinear, and the points overlap
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;

    // Otherwise, no intersection
    return false;
}
let gcount = 0 

let graphing = 1
function smain(){
gcount++
if(keysPressed['k']){
graphing = 0
}
if(keysPressed['j']){
graphing = 1
}

if(gcount%1000 == 0 && graphing == 1){
updateGraphs()
}

    foodtime++
    
    if(foodtime > foodrate){ // 40
        foodtime = 0
        let f = new Food()
        food.push(f)
    }
    canvas_context.fillStyle = "#00000008"
// canvas_context.fillStyle = "#000000"

    if(keysPressed['v']){canvas_context.fillStyle = "#000000"
        
    }
    canvas_context.fillRect(0, 0, canvas.width, canvas.height)
    
    for(let t= 0;t<food.length;t++){
        food[t].sdraw()
    }
    for(let t= food.length-1;t>=0;t--){
        if(food[t].marked == 1){
//             ////console.log("f")
            food.splice(t,1)
        }
    }
    for(let t= animals.length-1;t>=0;t--){
        if(animals[t].marked == 1){
            animals.splice(t,1)
        }else  if(animals[t].health <= 0){
            animals.splice(t,1)
        }else  if(animals[t].calories <= 0){
            animals.splice(t,1)
        }
    }
    for(let t= 0;t<animals.length;t++){
        animals[t].live()
    }

}

let drumz = new Audio()
drumz.volume = .5
drumz.src = "drumz.mp3"

let mute = 0

let gcolors = ["red", "yellow", "#00ff00", "#00FFFF", "#0000ff", "#ff00ff", "#FFFFFF", "#AAFF55", "#FF00AA"]

let fr = 0
let graphs = []
let holotype = new Animal()
let ke = Object.keys(holotype)
for(let t =0;t<ke.length;t++){
if(typeof holotype[ke[t]] == "number"){
if(ke[t] == "angle"){
continue
}
if(ke[t] == "dangle"){
continue
}
if(ke[t] == "maturity"){
continue
}
if(ke[t] == "age"){
continue
}
if(ke[t] == "id"){
continue
}
if(ke[t] == "health"){
continue
}
if(ke[t] == "made"){
continue
}
if(ke[t] == "r"){
continue
}
if(ke[t] == "g"){
continue
}
if(ke[t] == "b"){
continue
}
if(ke[t] == "r2"){
continue
}
if(ke[t] == "b2"){
continue
}
if(ke[t] == "g2"){
continue
}
    let graph = new Graph(gcolors[fr])
    fr++
    graph.name = ke[t]
    graphs.push(graph)
}
}
console.log(graphs)

    let graph = new Graph("orange")
    graph.name = "size"
    graphs.push(graph)
    
    
    let graph2 = new Graph("gray")
    graph2.name = "population"
    graphs.push(graph2)
    
    let graph3 = new Graph("teal")
    graph3.name = "food rate"
    graphs.push(graph3)
    
    let graph4 = new Graph("purple")
    graph4.name = "tank size"
    graphs.push(graph4)
    let graph5 = new Graph("#aa4400")
    graph5.name = "food density"
    graphs.push(graph5)
    let graph6 = new Graph("#00aa44")
    graph6.name = "move speed"
    graphs.push(graph6)
    let graph7 = new Graph("#abcdef")
    graph7.name = "food pellets"
    graphs.push(graph7)
    let graph8 = new Graph("#123fea")
    graph8.name = "calories in food"
    graphs.push(graph8)
    let graph9 = new Graph("#90ff00")
    graph9.name = "weight"
    graphs.push(graph9)
    let graph10 = new Graph("#ff9900")
    graph10.name = "birth cost"
    graphs.push(graph10)

    function updateGraphs(){
//         return
//     for(let t= 0;t<graphs.length;t++){
//         let d = 0
//         
//             for(let k= 0;k<animals.length;k++){
//                     d+= animals[k][ke[t]]*100
//             }
//             d/= animals.length+1
//                 if(typeof holotype[ke[t]] == "number" && t < graphs.length-1){
//         graphs[t].update(d)
//         }
//     }
    
    if(true){
             let d = 0
        
            for(let k= 0;k<animals.length;k++){
                    d+= animals[k]["regen"]*100
            }
            graphs[0].name = "Average Regeneration"
            d/= animals.length+1
        graphs[0].update(d)
    }
    
    if(true){
             let d = 0
        
            for(let k= 0;k<animals.length;k++){
                    d+= animals[k]["maxhealth"]*100
            }
            graphs[1].name = "Average Maximum Health"
            d/= animals.length+1
        graphs[1].update(d)
    }
    if(true){
             let d = 0
        
            for(let k= 0;k<animals.length;k++){
                    d+= animals[k]["spincycleson"]*100
            }
            graphs[2].name = "Time Walking Curve"
            d/= animals.length+1
        graphs[2].update(d)
    }
    if(true){
             let d = 0
        
            for(let k= 0;k<animals.length;k++){
                    d+= animals[k]["spincyclesoff"]*100
            }
            graphs[3].name = "Time Walking Straight"
            d/= animals.length+1
        graphs[3].update(d)
    }
    if(true){
             let d = 0
        
            for(let k= 0;k<animals.length;k++){
                    d+= animals[k]["spinstep"]*100
            }
            d/= animals.length+1
            graphs[4].name = "Average Age"
        graphs[4].update(d)
    }
    if(true){
             let d = 0
        
            for(let k= 0;k<animals.length;k++){
                    d+= animals[k]["calories"]*100
            }
            graphs[5].name = "Average Animal Caloric Content"
            d/= animals.length+1
        graphs[5].update(d)
    }
    if(true){
             let d = 0
        
            for(let k= 0;k<animals.length;k++){
                    d+= animals[k]["spinrate"]*100
            }
            d/= animals.length+1
            graphs[6].name = "Average Turning Speed"
        graphs[6].update(d)
    }
    if(true){
             let d = 0
        
            for(let k= 0;k<animals.length;k++){
                    d+= animals[k]["metabolism"]*100
            }
            d/= animals.length+1
            graphs[7].name = "Average Metabolic Cost"
        graphs[7].update(d)
    }
    if(true){
             let d = 0
        
            for(let k= 0;k<animals.length;k++){
                    d+= animals[k].body.radius*100
            }
            d/= animals.length+1
            graphs[8].name = "Average Size"
        graphs[8].update(d)
    }
    if(true){
            graphs[9].name = "Total Population"
        graphs[9].update(animals.length)
    }
    if(true){
            graphs[10].name = "Food Spwan Rate"
        graphs[10].update(foodrate, -1)
    }
    if(true){
            graphs[11].name = "Tank Size History"
        graphs[11].update((tankmax+(tankmax-1280)) * (tankmax+(tankmax-1280)))
    }
    if(true){
            graphs[12].name = "Food Density History"
        graphs[12].update( ((1/foodrate))/ (((tankmax+(tankmax-1280)) * (tankmax+(tankmax-1280)))))
    }
    
    if(true){
             let d = 0
        
            for(let k= 0;k<animals.length;k++){
                    d+= animals[k].movespeed
            }
            d/= animals.length+1
            graphs[13].name = "Average Effective Move Speed"
        graphs[13].update(d)
    }
    if(true){
        graphs[14].update( food.length)
        
            }
    if(true){
             let d = 0
        
            for(let k= 0;k<food.length;k++){
                    d+= food[k].calories
            }
            d/= food.length+1
        graphs[15].update( d)
        
            }
            
    if(true){
             let d = 0
        
            for(let k= 0;k<animals.length;k++){
                    d+= animals[k].weight*100
            }
            graphs[16].name = "Average Weight"
            d/= animals.length+1
        graphs[16].update(d)
    }
    if(true){
             let d = 0
        
            for(let k= 0;k<animals.length;k++){
                    d+= animals[k].birthCost*100
            }
            d/= animals.length+1
            graphs[17].name = "Average Calories To Reproduce"
        graphs[17].update(d)
    }
    
    
//         let d = 0
//         
//             for(let k= 0;k<animals.length;k++){
//                     d+= animals[k].body.radius
//             }
//             
//             
//             d/= (animals.length)+1
//             
//     graphs[graphs.length-1].update(d)
    }
    
    function main() {    
    if(mute == 0){
    drumz.play()
        
    }else{
        
    drumz.pause()
    }
    let link1 = new LineOP(new Point(tankmin,tankmin), new Point(tankmin,tankmax), "red", 2)
    link1.draw()
    let link2 = new LineOP(new Point(tankmin,tankmax), new Point(tankmax,tankmax), "red", 2)
    link2.draw()
    let link3 = new LineOP(new Point(tankmax,tankmax), new Point(tankmax,tankmin), "red", 2)
    link3.draw()
    let link4 = new LineOP(new Point(tankmax,tankmin), new Point(tankmin,tankmin), "red", 2)
    link4.draw()
    
//         if(keysPressed['f']){
//             foodrate--
//             if(foodrate < 0){
//                 foodrate = 0
//             }
//         }
//         if(keysPressed['a']){
//             foodrate++
//             if(foodrate < 0){
//                 foodrate = 0
//             }
//         }
//         if(keysPressed['w']){
//             tankmax++
//             tankmin--
//         }
//         if(keysPressed['s']){
//             tankmax--
//             tankmin++
//         }
        
//         if(keysPressed['q']){
//             mutationRate *= 1.01
//             hugeMutationRate *= 1.01
//             colorMutationRate *= 1.01
//             smallMutationRate *= 1.01
//             if(smallMutationRate > .15){
//                 smallMutationRate = .15
//             }
//             if(hugeMutationRate > .1){
//                 hugeMutationRate = .1
//             }
//             if(mutationRate > .25){
//                 mutationRate  = .25
//             }
//             if(colorMutationRate > 1){
//                 colorMutationRate  = 1
//             }
//         }
//         if(keysPressed['e']){
//             mutationRate /= 1.01
//             hugeMutationRate /= 1.01
//             colorMutationRate /= 1.01
//             smallMutationRate /= 1.01
//             if(hugeMutationRate < .0001){
//                 hugeMutationRate = .0001
//             }
//             if(mutationRate < .05){
//                 mutationRate = .05
//             }
//             if(colorMutationRate < .1){
//                 colorMutationRate  = .1
//             }
//             if(smallMutationRate < .01){
//                 smallMutationRate  = .01
//             }
//         }
//         
        
        if(keysPressed['o']){
           
            keysPressed['o'] = false
            gamespeed++
            
        }
        if(keysPressed['l']){
                gamespeed= 0
        }
        if(keysPressed['p']){
            gamespeed--
            keysPressed['p'] = false
            if(gamespeed<0){
                gamespeed= 0
            }
        }
        if(keysPressed['m']){
            drumz.pause()
            mute = 1
        }
        if(keysPressed['p']){
            drumz.play()
            mute = 0
        }
        
    for(let t= 0;t<food.length;t++){
        food[t].draw()
    }
            for(let t= 0;t<animals.length;t++){
        animals[t].draw()
    }
    
    return
    
    
    
    swap++
    
    if(swap%2 == 0){
        
    for(let t =rps.length-1;t>=0;t--){
    for(let k =rps.length-1;k>=0;k--){
        rps[t][k].draw(t+(k*size))
          rps[t][k].attack()
    }
    }    for(let t =0;t<rps.length;t++){
    for(let k =0;k<rps.length;k++){
        rps[t][k].reset()
    }
    }
    }else  if(swap%2 == 1){
        
    for(let t =0;t<rps.length;t++){
    for(let k =0;k<rps.length;k++){
        rps[t][k].draw(t+(k*size))
          rps[t][k].attack()
    }
    }    for(let t =0;t<rps.length;t++){
    for(let k =0;k<rps.length;k++){
        rps[t][k].reset()
    }
    }
    }
    
    let sete = [0,0,0]
      for(let t =0;t<rps.length;t++){
    for(let k =0;k<rps.length;k++){
      
            sete[0]+=rps[t][k].rock
            sete[1]+=rps[t][k].paper
            sete[2]+=rps[t][k].scissors
          }
    }
    
    sete[0] = Math.round(sete[0])
    sete[1] = Math.round(sete[1])
    sete[2] = Math.round(sete[2])
    
    canvas_context.fillText(sete,1100, 50)
    
    
    
    return
    
     if(start == 0){
            canvas_context.fillStyle = "red"
            canvas_context.font = "30px comic sans ms"
//             canvas_context.fillText("Click to start, you will play as gid", 100, 100)
            
    }else{
        gid.draw()
    }
    
    
    
    return
    if(start == 2){
        
        wins[0]++
        ////console.log(wins, "Red/Green")
            canvas_context.fillText("You are victorious!", 100, 300)
            start = 1
            avey = new Avey()
        return
    }else if(start == 3){
        wins[1]++
        ////console.log(wins, "Red/Green")
            canvas_context.fillText("You have been defeated!", 100, 300)
            start = 1
            avey = new Avey()
        return
    }else if(start == 0){
        
            canvas_context.fillStyle = "red"
            
            canvas_context.font = "30px comic sans ms"
            
            
            canvas_context.fillText("Click to start, you will play as red", 100, 100)
            
            canvas_context.fillStyle = "#00ff00"

            canvas_context.fillText("Green will be AI against you", 100,200)
            
            canvas_context.fillStyle = "red"

            canvas_context.fillText("Capture 6 of 7 zones to win!", 100, 300)
        return
    }else if(start ==1){
        let rc = 0
        let gc = 0
        for(let t = 0;t<avey.linear.length;t++){
            if(avey.linear[t].castle == 1){
                if(avey.linear[t].owner == 0){
                    rc++
                }
                if(avey.linear[t].owner == 1){
                    gc++
                }
            }
        }
        if(gc == 6){
            start = 3
        }
        if(rc == 6){
            start = 2
        }
        
    canvas_context.clearRect(0, 0, canvas.width, canvas.height)
          if(avey.combat == 1 || avey.timec > 0 ){
           
       for(let t = 0;t<ships.length;t++){
           ships[t].draw()
          }
       for(let t = 0;t<ships.length;t++){
                if(ships[t].health <= 0 && ships[t].time <=0){
                    ships.splice(t,1)
                }else{
                    if(ships[t].health <= 0){
                        ships[t].pop()
                    }
                    
                }
          }
          if(avey.combat == 0){
              ////console.log(avey, ships)
              if(avey.markend == 1){
              ////console.log(avey.markend)
                  avey.markend = 0
                  if(ships.length>0){
                      
                  if(ships[0].owner == 0){
              ////console.log(avey.contest)
                        avey.contest.greenarmy = []
                        avey.contest.redarmy = []
                      for(let t =0;t<ships.length;t++){
                          
                          if(ships[t].owner == 0 && ships[t].po != 1){
                        avey.contest.redarmy.push(new Giy(0))
                        }
                        }
                  avey.contest.owner = 0
                        ships = []
                  
                    }else{
              ////console.log(avey.contest)
                        avey.contest.redarmy = []
                        avey.contest.greenarmy = []
                      for(let t =0;t<ships.length;t++){
                          if(ships[t].owner == 1&& ships[t].po != 1){
                        avey.contest.greenarmy.push(new Giy(0))
                            }
                    }
                  avey.contest.owner = 1
                        ships = []
                  
                    }

                    }else{
                        
                        avey.contest.redarmy = []
                        avey.contest.greenarmy = []
                        if(avey.contest.greenarmy.length == 0 && avey.contest.redarmy.length == 0){
                            
                  avey.contest.owner = -1
                        }

                    }              
                      }
              
          avey.timec--
            }else{
          
          
          
          
          
          avey.timec = 1
                
                
       for(let t = 0;t<ships.length;t++){
//            ships[t].draw()
          }
          let e = 0
       for(let t = 0;t<ships.length;t++){
           e+= ships[t].owner
          }
          //////console.log(e, ships)
          if(e == 0 || e == ships.length){
//               if(avey.combattimer <= 0){
              avey.combat = 0
              avey.markend = 1
//               }
            }
            }
            
          }else{
              
       avey.draw()

            }
    return
    }
    
    canvas_context.clearRect(0, 0, canvas.width, canvas.height)  
    
    
    g.draw()
    
    return
    if(keysPressed[' ']){
        canvas_context.drawImage(sporeball2, 0,0,sporeball2.width, sporeball2.height, 0,0,sporeball2.width, sporeball2.height)
        buff1 = canvas_context.getImageData(0,0,16,16)
    //console.time("Buffer")
    for(let t = 0;t<100000;t++){
        addImageDataAtPosition(buff1, Math.floor(Math.random()*300), Math.floor(Math.random()*720))
    }
    canvas_context.putImageData(destinationImageData, 0, 0)

    //console.timeEnd("Buffer")
    //console.time("imgDraw")
    for(let t = 0;t<100000;t++){
        canvas_context.drawImage(sporeball2, 0,0,sporeball2.width, sporeball2.height, 640+Math.floor(Math.random()*300), Math.floor(Math.random()*720),16,16)
    }
    
    //console.timeEnd("imgDraw")
    }
//     canvas_context.clearRect(0, 0, canvas.width, canvas.height)  // refreshes the image
    
    // Get the ImageData objects for the source and destination

// // Offsets for the position where you want to place the source image
// const offsetX = 50; // X position
// const offsetY = 50; // Y position
// 
// // Cache data array references for performance
// const sourceData = sourceImageData.data;
// const destData = destinationImageData.data;
// 
// // Define pixel byte positions (RGBA = 4 bytes)
// const sourceWidth4 = sourceWidth * 4;
// const destWidth4 = canvasWidth * 4;
// 
// // Start dmdain loop to merge source data into destination data
// for (let y = 0; y < sourceHeight; y++) {
//   // Precompute row start positions
//   const sourceRowStart = y * sourceWidth4;
//   const destRowStart = (y + offsetY) * destWidth4 + offsetX * 4;
// 
//   for (let x = 0; x < sourceWidth; x++) {
//     // Compute pixel start positions for source and destination
//     const sourcePixelIndex = sourceRowStart + x * 4;
//     const destPixelIndex = destRowStart + x * 4;
// 
//     // Directly copy RGBA values (no need for intermediary operations)
//     destData[destPixelIndex]     = sourceData[sourcePixelIndex];     // Red
//     destData[destPixelIndex + 1] = sourceData[sourcePixelIndex + 1]; // Green
//     destData[destPixelIndex + 2] = sourceData[sourcePixelIndex + 2]; // Blue
//     destData[destPixelIndex + 3] = sourceData[sourcePixelIndex + 3]; // Alpha
//   }
// }
// 
// // Put the modified image data back onto the canvas
// ctx.putImageData(destinationImageData, 0, 0);


    
    
    return
    
//         scanner.stretch(dt)    
        scanner.draw()    
    
    if(keysPressed[' ']){
        dtx+=.5
    }
    if(keysPressed['r']){
        dtx-=.5
    }
    let dt = new Point(500+dtx, 100)
    return
//     //////console.log(hand)
        hand.draw()
//     nock.draw()


    return
    
    
    stats =  []
    for(let t = 0;t<(Math.random()*1)+cn;t++){
        stats.push((Math.random()+.1)/1.1)
    }
    
    
    let ps =[]
    let zs = []
    for(let t= 0;t<stats.length;t++){
        let a = (t/stats.length)*2*Math.PI;
        let p = new Point(360+(Math.cos(this.a)*100), 360+(Math.sin(this.a)*100))
        ps.push(p)
        let z = new Point(360+(Math.cos(this.a)*100*stats[t]), 360+(Math.sin(this.a)*100*stats[t]))
        zs.push(z)
    }
    canvas_context.beginPath();
// set ctx styles
canvas_context.moveTo( ps[0].x, ps[0].y );

    for(let t= 0;t<stats.length;t++){
        canvas_context.lineTo(ps[t].x, ps[t].y)
    }
canvas_context.lineTo(  ps[0].x, ps[0].y  );
canvas_context.closePath(); // automatically moves back to bottom left corner
canvas_context.fillStyle = "white"
canvas_context.fill();




    canvas_context.beginPath();
// set ctx styles
canvas_context.moveTo( zs[0].x, zs[0].y );

    for(let t= 0;t<stats.length;t++){
        canvas_context.lineTo(zs[t].x, zs[t].y)
    }

canvas_context.lineTo(  zs[0].x, zs[0].y );
canvas_context.closePath(); // automatically moves back to bottom left corner

let grad = canvas_context.createRadialGradient(360,360, 0, 360,360, 100)
grad.addColorStop(.07, "#FF0000")
grad.addColorStop(.25, "#FFFF00")
grad.addColorStop(.47, "#00FF00")
grad.addColorStop(.53, "#00FFFF")
grad.addColorStop(.80, "#0000FF")
grad.addColorStop(.9, "#FF00FF")
grad.addColorStop(1, "#FF00FF")
canvas_context.fillStyle = grad
canvas_context.fill();




    for(let t= 0;t<stats.length;t++){
            let l = new LineOP(center, ps[t], "black", 2)
            l.draw()
    }
    for(let t= 0;t<11;t++){

            let ring = new CircleRing(360, 360, 100*(t/10), "black")
            ring.draw()
    }
    
    
    
    }
    if(false){
    
    let f = (1280/720)
//         canvas_context.drawImage(egg,0,0,1280,720, 624-(growrate*f), 344-growrate, (32+(growrate*2*f)) , 20+(growrate*.2))
        canvas_context.drawImage(egg,0,0,1280,720, -16+640-((growrate/40)*f), -9+360-(growrate/40), 32+((growrate/40)*f)*2, 20+(growrate/40)*2)
        
                 f = 1280/720
//         canvas_context.drawImage(egg2,0,0,1280,720, 0-(1280*((growrate-1)%20)), 0-(720*((growrate-1)%20)), (1*(1280*(growrate%20))), (1*(720*(growrate%20))))

        canvas_context.drawImage(egg2,0,0,1280,720,-growrate*f,-growrate,(1280+(growrate*2*f)) ,720+(growrate*2))        
        growrate*=1.01
        growrate += ((1280*25)-growrate)/3000
        growrate+= 1
//         growrate+=40
        if(growrate >= 1280*10){
            growrate = 10
        }
//         if(keysPressed[' ']){

//             
//    canvas_context.drawImage(pom, 0,0,pom.width,pom.height,0,0,720,720)
//    pix = canvas_context.getImageData(0,0,720,720)
//             return
//         }
//         canvas_context.putImageData(pix,0,0)
// //         canvas_context.clearRect(0, 0, canvas.width, canvas.height)  // refreshes the image
//         gamepadAPI.update() //checks for button presses/stick movement on the connected     
// //             pix = canvas_context.getImageData(0,0,720,720)
//  pix2 = canvas_context.getImageData(0,0,720,720)
// 
//         let d = pix.data
//         let d2 = pix2.data
//         let l = new LineOP(new Point(360,360), new Point(360,360))
//         for(let t= 0;t<d.length;t+=4){
//             let p=indexer(t)
//             l.target = p
// //             if(Math.random() < .001){
// //                 
// //             //////console.log(l)
// //             }
//             let a = l.angle()-Math.PI
//             let h = l.hypotenuse()
//             if(h <= 1360){
//                 
//             let k = new Point((Math.cos(this.a+(step/((h/360)+1)))*h)+360, (Math.sin(this.a+(step/((h/360)+1)))*h) +360)
// 
//             if(lf.isPointInside(k)){
//                             let pt = tout(Math.floor(k.x),Math.floor(k.y))
//                                     if(Math.random() < .001){ 
// //             //////console.log(t,pt)
//             }
//             if(pt%4 == 0){
//                 
//             d[t] = d2[pt]
//             d[t+1] = d2[pt+1]
//             d[t+2] = d2[pt+2]
//             d[t+3] =  255
//             }
//             }
//     
//             }else{
//                 
//             d[t] = 0
//             d[t+1] = 0
//             d[t+2] = 0
//             d[t+3] =  255
//             }
//         }
//         canvas_context.putImageData(pix,0,0)
    }

// })

