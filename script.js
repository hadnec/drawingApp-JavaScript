		// Hotkeys - Ctrl+Z,Ctrl+Shift+Z

		var isMouseDown=false;
		var canvas = document.createElement('canvas');
		var body = document.getElementsByTagName("body")[0];
		var ctx = canvas.getContext('2d');
		var tempObj;
		var currentPosition;
		var currentSize = 4;
		var currentSizeCopy = currentSize;
		var currentColor = "rgb(40,20,100)";
		var currentColorCopy = currentColor;
		var currentBg = "black";
		var beginX;
		var beginY;
		var endX;
		var endY;
		var beginToEndI;
		var tempImageData;
		var tempImageDataCashed=0;
		var saveObjNumber=0;
		var saveArray =[];

		// Start

		createCanvas();

		// Event listeners

		document.getElementById('canvasUpdate').addEventListener('click', function() {
			createCanvas();
		});
		document.getElementById('colorpicker').addEventListener('change', function() {
			currentColor = this.value;
			currentColorCopy = this.value;
		});
		document.getElementById('bgcolorpicker').addEventListener('change', function() {
			ctx.fillStyle = this.value;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			currentBg = ctx.fillStyle;
		});
		document.getElementById('controlSize').addEventListener('change', function() {
			currentSize = this.value;
			currentSizeCopy = this.value;
			document.getElementById("showSize").innerHTML = this.value;
		});
		document.getElementById('saveToImage').addEventListener('click', function() {
			downloadCanvas(this, 'canvas', 'masterpiece.png');
		}, false);
		document.getElementById('eraser').addEventListener('click', eraser);
		document.getElementById('drawPen').addEventListener('click', drawPen);
		document.getElementById('sqrFillTool').addEventListener('click', sqrFillTool);
		document.getElementById('sqrTool').addEventListener('click', sqrTool);
		document.getElementById('circleDraw').addEventListener('click', circleDraw);
		document.getElementById('lineDraw').addEventListener('click', lineDraw);
		document.getElementById('copyPs').addEventListener('click', copyPs);
		document.getElementById('clear').addEventListener('click', createCanvas);
		document.getElementById('save').addEventListener('click', save);
		document.getElementById('load').addEventListener('click', load);
		document.getElementById('clearCache').addEventListener('click', function() {
			saveObjNumber=0;
		});

		//Ctrl+Z and Ctrl+Shift+Z

		document.addEventListener('keydown', function(event) {
			if (event.ctrlKey && event.key === 'z') {
			 load();
			}
			if (event.ctrlKey && event.key === 'Z' && event.shiftKey) {
				prevLoad();
			   }
			});

		// Mouse listener

		canvas.addEventListener('mousedown', function() {mousedown(canvas, event);});
		canvas.addEventListener('mousemove',function() {mousemove(canvas, event);});
		canvas.addEventListener('mouseup',function() {mouseup(canvas, event);});

		//Create canvas

		function createCanvas() {
			canvas.id = "canvas";
			canvas.width = parseInt(document.getElementById("sizeX").value);
			canvas.height = parseInt(document.getElementById("sizeY").value);
			canvas.style.zIndex = 8;
			canvas.style.position = "absolute";
			canvas.style.border = "1px solid";
			ctx.fillStyle = currentBg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			body.appendChild(canvas);
			save();
		}

		//Download

		function downloadCanvas(link, canvas, filename) {
			link.href = document.getElementById(canvas).toDataURL();
			link.download = filename;
		}

		// Save to cache

		function save() {
			saveObjNumber++;
			tempObj=ctx.getImageData(0,0,canvas.width,canvas.height);
			saveArray[saveObjNumber]=tempObj;
		}

		// Load to cache

		function load() {
			saveObjNumber--;
			ctx.putImageData(saveArray[saveObjNumber],0,0);
		}

		// Previous to load

		function prevLoad() {
			saveObjNumber++;
			ctx.putImageData(saveArray[saveObjNumber],0,0);
		}

		// Eraser

		function eraser() {
			currentSize = 50;
			currentColor = currentBg;
			beginToEndI= 0;
		}

		// Pen

		function drawPen() {
			currentSize = currentSizeCopy;
			currentColor = currentColorCopy;
			beginToEndI= 0;
		}

		// Square

		function sqrFillTool() {
			beginToEndI= 1;
		}
		
		// Circle

		function circleDraw() {
			beginToEndI= 2;
		}

		// Empty square

		function sqrTool() {
			beginToEndI= 3;
		}

		// Line

		function lineDraw() {
			beginToEndI= 4;
		}		

		// Scissors

		function copyPs() {
			beginToEndI= 5;
		}

		// Mouse position

		function getMousePos(canvas, evt) {
			var rect = canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
		}

		// Mouse Down func

		function mousedown(canvas, evt) {
			var mousePos = getMousePos(canvas, evt);
			isMouseDown=true;
			currentPosition = getMousePos(canvas, evt);
			ctx.moveTo(currentPosition.x, currentPosition.y);
			ctx.strokeStyle = currentColor;
			ctx.beginPath();
			ctx.lineWidth  = currentSize;
			ctx.lineCap = "round";
			beginX=currentPosition.x;
			beginY=currentPosition.y;
			ctx.fillStyle = currentColor;
		}

		// Mouse move func +animation(not now ofc)

		function mousemove(canvas, evt) {
				if(isMouseDown){
					currentPosition = getMousePos(canvas, evt);
					// Shape anim
					switch (beginToEndI) {
					case 0 :
						ctx.fillStyle = currentColor;
						ctx.lineTo(currentPosition.x, currentPosition.y);
						ctx.stroke();
					  break;
					case 1:// Sqare
					 
					  break;
				    case 2: // Circale
					  
					break;
				    case 3: // Empty sqare
					  
				      break;
				    case 4:// Line
					  
				      break;
					case 5:// Sicissors
				
					  break;
					  // maybe Window.requestAnimationFrame()
				}
			}
		}

		// Mouse up func+ already paint in canvas

		function mouseup(canvas, evt) {
			currentPosition = getMousePos(canvas, evt);
			endX=currentPosition.x;
			endY=currentPosition.y;
			isMouseDown=false;

			// Shape
			ctx.fillStyle = currentColor;
			ctx.lineWidth = currentSize;
			switch (beginToEndI) {
				case 1:// Sqare
					ctx.fillRect(beginX,beginY,endX-beginX,endY-beginY);
				  break;
				case 2: // Circale
					ctx.arc((endX+beginX)/2, (endY+beginY)/2, (Math.abs(endX-beginX)+Math.abs(endY-beginY))/Math.PI, 0, 2 * Math.PI);
				  break;
				case 3: // Empty sqare
					ctx.rect(beginX,beginY,endX-beginX,endY-beginY);
				  break;
				case 4:// Line
					ctx.moveTo(beginX,beginY);
					ctx.lineTo(endX, endY);
				  break;
				case 5:// Sicirssors
					if (!tempImageDataCashed){
						tempImageData = ctx.getImageData(beginX,beginY,endX-beginX,endY-beginY);
						ctx.fillStyle = currentBg;
						ctx.fillRect(beginX,beginY,endX-beginX,endY-beginY);
						tempImageDataCashed=1;
					}else{
						ctx.putImageData(tempImageData, beginX, beginY);
						tempImageDataCashed=0;
					}
				  break;
			  }
			  ctx.stroke();
			  save();
		}
