var tVol = 0;
var dots_0 = [];
var dots_1 = [];
var dots_2 = [];
var push_array = true;
var particles = 200;
var col1, col2;
var cc = 0;
var rad = 0;
var dnagrow = 4.75;
var dnaswitch = true;

// set up audio context
var audioContext = (window.AudioContext || window.webkitAudioContext);
// create audio class
if (audioContext) {
  // Web Audio API is available.
  var audioAPI = new audioContext();
} else {
  // Web Audio API is not available. Ask the user to use a supported browser.
  alert("Oh nos! It appears your browser does not support the Web Audio API, please upgrade or use a different browser");
}

// variables - CHANGE AMOUNT IN UINT ARRAY FOR HIGHER RESOLUTION -> ALSO CHANGE FFT SIZE BELOW
var analyserNode,
    frequencyData = new Uint8Array(256);
const screen = document.querySelector('#screen');


// create an audio API analyser node and connect to source CHANGE FFT SIZE HERE
function createAnalyserNode(audioSource) {
  analyserNode = audioAPI.createAnalyser();
  analyserNode.fftSize = 512;
  audioSource.connect(analyserNode);
}

// constantly picking up mic data
function animate() {
  requestAnimationFrame(animate);
  analyserNode.getByteFrequencyData(frequencyData);
  analyse();
}

// getUserMedia success callback -> pipe audio stream into audio API
var gotStream = function(stream) {
  // Create an audio input from the stream.
  var audioSource = audioAPI.createMediaStreamSource(stream);
  createAnalyserNode(audioSource);
  animate();
}

// pipe in analysing to getUserMedia
navigator.mediaDevices.getUserMedia({ audio: true, video: false })
  .then(gotStream);

function analyse() {
  //resets tVol for each tick
  tVol = 0;
  var i = 0;
  col1 = 'rgba('
  col2 = 'rgba('
  frequencyData.forEach(function(el) {
    //get totalVolume by picking loudest freq band
    if (el > tVol) { tVol = el };
    if (i == 10) { col1 += el +',' }
    if (i == 60) { col1 += el +',' }
    if (i == 110) { col1 += el +',' }
    if (i == 100) { col2 += el +',' }
    if (i == 10) { col2 += el +',' }
    if (i == 80) { col2 += el +',' }
    i++;
  })
  col1 +='1)';
  col2 +='1)';
}


// #################################################


function initCanvas(canvas){
  var ctx = canvas.getContext('2d');
  $('#primary-canvas').attr('width',window.width);
  $('#primary-canvas').attr('height',window.height);
  return ctx;
}

function createBuffer(context, width, height){
  //var buffer = document.createElement('canvas');
  context.width = width;
  context.height = height;
  var ctx = context.getContext('2d');
  return ctx;
}

function drawCanvas(ctx_source, ctx_target, canvasWidth, canvasHeight) {
    var image = ctx_source.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_target.putImageData(image, 0, 0);
    return true;
}

function clearCanvas(ctx, color, w, h) {
  ctx.fillStyle=color;
  ctx.fillRect(0,0,w,h);
}



// ############################################################

$(document).ready(function() {

  //var StackBlur = require('stackblur-canvas');
  var canvas0 = document.getElementById('primary-canvas');
  var buffer1 = document.createElement('canvas');
  var buffer2 = document.createElement('canvas');
  var buffer3 = document.createElement('canvas');

  var ctx_0 = initCanvas(canvas0);

  var canvasWidth = $('canvas#primary-canvas').width();
  var canvasHeight = $('canvas#primary-canvas').height();

  var ctx_1 = createBuffer(buffer1, canvasWidth, canvasHeight); // bg buffer 1
  var ctx_2 = createBuffer(buffer2, canvasWidth, canvasHeight); // bg buffer 2
  var ctx_3 = createBuffer(buffer3, canvasWidth, canvasHeight); // foreground buffer

  //VIS SET

  function simpleEqualizer() {
    // copy buffer1 to buffer2 and rescale
    var xval = 0;
    var yval = 0;

    if (tVol > 200) {
      xval = Math.random() * 20 - 10;
      yval = Math.random() * 20 - 10;
    }

    var image = ctx_1.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_2.putImageData(image, xval, yval);
    //ctx_2.drawImage(image,-5,-5,canvasWidth+5,canvasHeight+5)
    //var dataURL = ctx_1.toDataURL();
    //ctx_2.drawImage(dataURL,-5,-5);

    clearCanvas(ctx_2, 'rgba(0,0,0,.1)', canvasWidth, canvasHeight);

    // init equalizer wave
    var mx, my, xstep;
    mx = canvasWidth / 4;
    my = canvasHeight / 2;
    xstep = (canvasWidth / 2) / (frequencyData.length/2 + 2);
    // we're only using the lower half of the frequency band.
    // best guess is that the mic records everything from 20 to 20000 hz.
    // everything above 10000 hz does not really contribute much to the music.


    ctx_1.beginPath();
    ctx_1.strokeStyle="#FFFFFF";
    ctx_1.moveTo(mx, my);

    var i = 0;
    frequencyData.forEach(function(el) {
      if (i < 128 && el > 0) { mx += xstep; ctx_1.lineTo(mx, my - el); }
      i++;
    });

    ctx_1.lineTo(mx+xstep, my);

    // copy back grom buffer2 to buffer1
    image = ctx_2.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_1.putImageData(image, 0, 0);
    ctx_1.stroke();

  }

  function simpleEqualizer2() {
    // copy buffer1 to buffer2 and rescale
    var xval = 0;
    var yval = 0;

    if (tVol > 200) {
      xval = Math.random() * 20 - 10;
      yval = Math.random() * 20 - 10;
    }

    var image = ctx_1.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_2.putImageData(image, xval, yval);
    //ctx_2.drawImage(image,-5,-5,canvasWidth+5,canvasHeight+5)
    //var dataURL = ctx_1.toDataURL();
    //ctx_2.drawImage(dataURL,-5,-5);

    clearCanvas(ctx_2, 'rgba(0,0,0,.1)', canvasWidth, canvasHeight);

    // init equalizer wave
    var mx, my, xstep;
    mx = canvasWidth / 10;
    my = canvasHeight / 1.75;
    xstep = (canvasWidth / 10 * 8) / (frequencyData.length/2 + 2);
    // we're only using the lower half of the frequency band.
    // best guess is that the mic records everything from 20 to 20000 hz.
    // everything above 10000 hz does not really contribute much to the music.


    ctx_1.beginPath();
    ctx_1.strokeStyle="#FFFFFF";
    if (tVol > 200) { ctx_1.lineWidth=10; } else { ctx_1.lineWidth=2; }
    ctx_1.moveTo(mx, my);

    var i = 0;
    frequencyData.forEach(function(el) {
      if (i < 128 && el > 0) { mx += xstep; ctx_1.lineTo(mx, my - el*2); }
      i++;
    });

    ctx_1.lineTo(mx+xstep, my);

    // copy back grom buffer2 to buffer1
    image = ctx_2.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_1.putImageData(image, 0, 0);
    ctx_1.stroke();

  }


  function barEqualizer() {
    // copy buffer1 to buffer2 and rescale
    var xval = 0;
    var yval = 0;

    if (tVol > 200) {
      xval = Math.random() * 50 - 25;
      yval = Math.random() * 50 - 25;
    }

    var image = ctx_1.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_2.putImageData(image, xval, yval);
    //ctx_2.drawImage(image,-5,-5,canvasWidth+5,canvasHeight+5)
    //var dataURL = ctx_1.toDataURL();
    //ctx_2.drawImage(dataURL,-5,-5);

    clearCanvas(ctx_2, 'rgba(0,0,0,.25)', canvasWidth, canvasHeight);

    // init equalizer wave
    var mx, my, xstep;
    mx = canvasWidth / 4;
    my = canvasHeight / 2;
    xstep = (canvasWidth / 2) / (frequencyData.length/2 + 2);
    // we're only using the lower half of the frequency band.
    // best guess is that the mic records everything from 20 to 20000 hz.
    // everything above 10000 hz does not really contribute much to the music.

    // copy back grom buffer2 to buffer1
    image = ctx_2.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_1.putImageData(image, 0, 0);

    var i = 0;
    frequencyData.forEach(function(el) {
      //if (i < 128 && el > 0) { mx += xstep; ctx_1.lineTo(mx, my - el); }
      if (i < 128 && el > 0) {
        ctx_1.beginPath();
        ctx_1.strokeStyle="#FFFFFF";
        ctx_1.lineWidth=2;
        ctx_1.setLineDash([4, 2]);
        ctx_1.moveTo(mx, my - el/2);
        ctx_1.lineTo(mx, my + el/2);
        ctx_1.stroke();
        mx += xstep;
      }
      i++;
    });

  }

  function circleEqualizer() {
    // copy buffer1 to buffer2 and rescale
    var xval = 0;
    var yval = 0;

    if (tVol > 200) {
      xval = Math.random() * 50 - 25;
      yval = Math.random() * 50 - 25;
    }

    var image = ctx_1.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_2.putImageData(image, xval, yval);
    //ctx_2.drawImage(image,-5,-5,canvasWidth+5,canvasHeight+5)
    //var dataURL = ctx_1.toDataURL();
    //ctx_2.drawImage(dataURL,-5,-5);

    clearCanvas(ctx_2, 'rgba(0,0,0,.5)', canvasWidth, canvasHeight);

    // init equalizer wave
    var rad = 0;

    // copy back grom buffer2 to buffer1
    image = ctx_2.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_1.putImageData(image, 0, 0);

    var i = 0;
    var rstep = (2*Math.PI)/128;

    frequencyData.forEach(function(el) {
      if (i < 128 && el > 0) {
        ctx_1.beginPath();
        ctx_1.strokeStyle="#FFFFFF";
        ctx_1.lineWidth=2;
        //ctx_1.setLineDash([4, 2]);

        var x1 = canvasWidth/2 + (canvasHeight/4-el/2) * Math.cos(rad)
        var y1 = canvasHeight/2 + (canvasHeight/4-el/2) * Math.sin(rad)
        var x2 = canvasWidth/2 + (canvasHeight/4+el/2) * Math.cos(rad)
        var y2 = canvasHeight/2 + (canvasHeight/4+el/2) * Math.sin(rad)
        ctx_1.moveTo(x1, y1);
        ctx_1.lineTo(x2, y2);

        ctx_1.stroke();
        rad += rstep;
      }
      i++;
    });

  }

  function circleEqualizer2() {
    // copy buffer1 to buffer2 and rescale
    var xval = 0;
    var yval = 0;

    if (tVol > 200) {
      xval = Math.random() * 100 - 50;
      yval = Math.random() * 100 - 50;
    }

    var image = ctx_1.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_2.putImageData(image, xval, yval);
    clearCanvas(ctx_2, 'rgba(0,0,0,.5)', canvasWidth, canvasHeight);

    // init equalizer wave
    var rad = 0;

    // copy back grom buffer2 to buffer1
    image = ctx_2.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_1.putImageData(image, 0, 0);


    var i = 0;
    var rstep = (2*Math.PI)/128;

    frequencyData.forEach(function(el) {
      if (i < 128 && el > 0) {
        ctx_1.beginPath();
        ctx_1.strokeStyle="#FFFFFF";
        ctx_1.lineWidth=2;
        //ctx_1.setLineDash([4, 2]);

        var x1 = canvasWidth/2 + (canvasHeight/4) * Math.cos(rad)
        var y1 = canvasHeight/2 + (canvasHeight/4) * Math.sin(rad)
        var x2 = canvasWidth/2 + (canvasHeight/4+el) * Math.cos(rad)
        var y2 = canvasHeight/2 + (canvasHeight/4+el) * Math.sin(rad)
        ctx_1.moveTo(x1, y1);
        ctx_1.lineTo(x2, y2);

        ctx_1.stroke();
        rad += rstep;
      }
      i++;
    });

  }

  function circleEqualizer2_2() {
    var xval = 0;
    var yval = 0;

    if (tVol > 200) {
      //xval = Math.random() * 1000 - 500;
      //yval = Math.random() * 1000 - 500;
    }


    // init equalizer wave
    var rad = 0;

    var i = 0;
    var rstep = (2*Math.PI)/128;
    //ctx_1.clearRect(0,0,canvasWidth,canvasHeight);
    clearCanvas(ctx_1, 'rgba(0,0,0,.15)', canvasWidth, canvasHeight);

    frequencyData.forEach(function(el) {
      if (i < 128 && el > 0) {
        ctx_1.beginPath();
        ctx_1.strokeStyle='hsl('+tVol+',100%,'+(50+(tVol/2.55)/2)+'%)';
        ctx_1.lineWidth=2;
        //ctx_1.setLineDash([4, 2]);

        var x1 = canvasWidth/2+xval + (canvasHeight/2.5) * Math.cos(rad)
        var y1 = canvasHeight/2+yval + (canvasHeight/2.5) * Math.sin(rad)
        var x2 = canvasWidth/2+xval + (canvasHeight/2.5+el*2) * Math.cos(rad)
        var y2 = canvasHeight/2+yval + (canvasHeight/2.5+el*2) * Math.sin(rad)
        var x3 = canvasWidth/2+xval + (canvasHeight/2.5) * Math.cos(rad)
        var y3 = canvasHeight/2+yval + (canvasHeight/2.5) * Math.sin(rad)
        var x4 = canvasWidth/2+xval + (canvasHeight/2.5-el/2.5) * Math.cos(rad)
        var y4 = canvasHeight/2+yval + (canvasHeight/2.5-el/2.5) * Math.sin(rad)

        ctx_1.moveTo(x1, y1);
        ctx_1.lineTo(x2, y2);
        ctx_1.stroke();

        ctx_1.beginPath();
        ctx_1.strokeStyle='hsl('+tVol+',100%,50%)';
        ctx_1.lineWidth=2;
        ctx_1.moveTo(x3, y3);
        ctx_1.lineTo(x4, y4);
        ctx_1.stroke();

        rad += rstep;
      }
      i++;
    });

    i = 0;
    rad = 0;
    frequencyData.forEach(function(el) {
      if (i < 128 && el > 0) {
        ctx_1.beginPath();
        ctx_1.strokeStyle='hsl(255,100%,100%)'; //'+tVol+'
        ctx_1.lineWidth=1;
        //ctx_1.setLineDash([4, 2]);

        var x1 = canvasWidth/2+xval + (canvasHeight/10+el/1.2) * Math.cos(rad);
        var y1 = canvasHeight/2+yval + (canvasHeight/10+el/1.2) * Math.sin(rad);

        ctx_1.beginPath();
        ctx_1.arc(x1, y1, 2, 0, 2 * Math.PI, false);
        ctx_1.fillStyle =   'hsl('+(255-tVol)+',100%,'+(50+(el/2.55)/2)+'%)';
        ctx_1.strokeStyle = 'hsl('+(255-tVol)+',100%,'+(50+(el/2.55)/2)+'%)';
        ctx_1.fill();

        rad += rstep;
      }
      i++;
    });



  }

  function circleEqualizer3() {
    // copy buffer1 to buffer2 and rescale
    var xval = 0;
    var yval = 0;

    if (tVol > 200) {
      xval = Math.random() * 50 - 25;
      yval = Math.random() * 50 - 25;
    }

    var image = ctx_1.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_2.putImageData(image, xval, yval);


    clearCanvas(ctx_2, 'rgba(0,0,0,.5)', canvasWidth, canvasHeight);

    // init equalizer wave
    var rad = 0;

    // copy back grom buffer2 to buffer1
    image = ctx_2.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_1.putImageData(image, 0, 0);

    var i = 0;
    var rstep = (2*Math.PI)/128;

    frequencyData.forEach(function(el) {
      if (i < 128 && el > 0) {
        ctx_1.beginPath();
        ctx_3.beginPath();
        ctx_1.strokeStyle="#0000FF";
        ctx_3.strokeStyle="#FFFFFF";
        ctx_1.lineWidth=3;
        ctx_3.lineWidth=1;
        //ctx_1.setLineDash([4, 2]);

        var x1 = canvasWidth/2 + (canvasHeight/4) * Math.cos(rad)
        var y1 = canvasHeight/2 + (canvasHeight/4) * Math.sin(rad)
        var x2 = canvasWidth/2 + (canvasHeight/4+el) * Math.cos(rad)
        var y2 = canvasHeight/2 + (canvasHeight/4+el) * Math.sin(rad)
        ctx_1.moveTo(x1, y1);
        ctx_1.lineTo(x2, y2);
        ctx_3.moveTo(x1, y1);
        ctx_3.lineTo(x2, y2);

        ctx_1.stroke();
        ctx_3.stroke();
        rad += rstep;
      }
      i++;
    });

    image = ctx_3.getImageData(0,0,canvasWidth,canvasHeight);
    ctx_0.putImageData(image, xval, yval);
    ctx_3.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  function worms() {
    if (tVol > 200) {
      //push_array = true;
      //dots_0.splice(0,particles);
    }

    // populate array if not initialized yet.
    var rad = 0;
    var rstep = (2*Math.PI)/particles;
    if (push_array) {
      for (var i = 0; i < particles; i++) {
        dots_0.push({
          x: canvasWidth/2 + (canvasHeight/10) * Math.cos(rad),
          y: canvasHeight/2 + (canvasHeight/10) * Math.sin(rad),
          ang: rad - .5 * Math.PI,
          spd: 5
        });
        rad += rstep;
      }
      push_array = false;
    }

    //var image = ctx_1.getImageData(0,0,canvasWidth,canvasHeight);
    //ctx_2.putImageData(image, 0, 0);
    //clearCanvas(ctx_2, 'rgba(0,0,0,.05)', canvasWidth, canvasHeight);

    //image = ctx_2.getImageData(0,0,canvasWidth,canvasHeight);
    //ctx_1.putImageData(image, 0, 0);
    clearCanvas(ctx_1, 'rgba(0,0,0,.1)', canvasWidth, canvasHeight);

    rad = 0;
    for (var i = 0; i < particles; i++) {

      ctx_1.beginPath();
      ctx_1.arc(dots_0[i].x, dots_0[i].y, 5, 0, 2 * Math.PI, false);
      if (dots_0[i].x <= canvasWidth/2){
        ctx_1.fillStyle = col1;
        ctx_1.fill();
        ctx_1.strokeStyle= col1;
      } else {
        ctx_1.fillStyle = col2;
        ctx_1.fill();
        ctx_1.strokeStyle= col2;
      }
      ctx_1.stroke();


      dots_0[i].ang += Math.random() * .2-.1;
      dots_0[i].spd += Math.random() * .2-.1;
      dots_0[i].x = dots_0[i].x + dots_0[i].spd * Math.cos(dots_0[i].ang);
      dots_0[i].y = dots_0[i].y + dots_0[i].spd * Math.sin(dots_0[i].ang);

      if (dots_0[i].x <= 0 || dots_0[i].x >= canvasWidth || dots_0[i].y <= 0 || dots_0[i].y >= canvasHeight) {
        dots_0[i].ang += Math.PI;
      }

      rad += rstep;
    }

  }

  function DNAEqualizer() {
    // copy buffer1 to buffer2 and rescale
    //dnagrow += .001;



    var steps = 100;
    var rstep = (2*Math.PI)/steps;

    var i = 0;
    frequencyData.forEach(function(el) {

      var x1 = canvasWidth/2 +i*dnagrow * Math.cos(rad);
      var y1 = canvasHeight/2 +i*dnagrow * Math.sin(rad);

      ctx_1.beginPath();
      ctx_1.arc(x1, y1, 1+i/8, 0, 2 * Math.PI, false);
      ctx_1.fillStyle =   'hsl('+i/(steps/255)+',100%,'+el/2.55+'%)';
      ctx_1.strokeStyle = 'hsl('+i/(steps/255)+',100%,'+el/2.55+'%)';
      ctx_1.fill();
      i++;
    });

    rad += rstep;
    cc ++;
    if (cc >= steps) {cc = 0; rad=0;}

    ctx_1.stroke();

  }

  // Init vis loop
  var vis = { };

  vis.update = function() {

    // ### FOREGROUND ANIMATIONS ###
    //simpleEqualizer();
    //simpleEqualizer2();
    //barEqualizer();
    //circleEqualizer();
    //circleEqualizer2();
    //circleEqualizer3();
    //worms();
    //DNAEqualizer();


    //DNAEqualizer();
    circleEqualizer2_2();

    return true;
  };

  vis.draw = function() {
    var draw = drawCanvas(ctx_2, ctx_0, canvasWidth, canvasHeight);
    var draw = drawCanvas(ctx_1, ctx_0, canvasWidth, canvasHeight);
  };

  vis.fps = 60;

  vis.run = function() {
    //if (vis.update()) { vis.draw(ctx_1, ctx_0); }
    if (vis.update()) { vis.draw(); }
  };

  // Start the vis loop
  vis._intervalId = setInterval(vis.run, 1000 / vis.fps);

});
