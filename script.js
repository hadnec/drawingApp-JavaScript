		var isMouseDown=false;
		var canvas = document.createElement('canvas');
		var body = document.getElementsByTagName("body")[0];
		var ctx = canvas.getContext('2d');
		var linesArray = [];
		var currentSize = 4;
		var currentSizeCopy = 4;
		var currentColor = "rgb(40,20,100)";
		var currentColorCopy = "rgb(40,20,100)";
		var currentBg = "black";
		var beginX=0;
		var beginY=0;
		var endX=0;
		var endY=0;
		var beginToEndI=0;
		var currentPosition =0;

		//Запуск

		createCanvas();

		// Реакция на кнопки

		document.getElementById('canvasUpdate').addEventListener('click', function() {
			createCanvas();
			redraw();
		});
		document.getElementById('colorpicker').addEventListener('change', function() {
			currentColor = this.value;
			currentColorCopy = this.value;
		});
		document.getElementById('bgcolorpicker').addEventListener('change', function() {
			ctx.fillStyle = this.value;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			redraw();
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
		document.getElementById('sqrTool').addEventListener('click', sqrTool);
		document.getElementById('clear').addEventListener('click', createCanvas);
		document.getElementById('save').addEventListener('click', save);
		document.getElementById('load').addEventListener('click', load);
		document.getElementById('clearCache').addEventListener('click', function() {
			localStorage.removeItem("savedCanvas");
			linesArray = [];
		});

		// Рисовка

		function redraw() {
				for (var i = 1; i < linesArray.length; i++) {
					ctx.beginPath();
					ctx.moveTo(linesArray[i-1].x, linesArray[i-1].y);
					ctx.lineWidth  = linesArray[i].size;
					ctx.lineCap = "round";
					ctx.strokeStyle = linesArray[i].color;
					ctx.lineTo(linesArray[i].x, linesArray[i].y);
					ctx.stroke();
				}
		}

		// Реакция на мышь

		canvas.addEventListener('mousedown', function() {mousedown(canvas, event);});
		canvas.addEventListener('mousemove',function() {mousemove(canvas, event);});
		canvas.addEventListener('mouseup',function() {mouseup(canvas, event);});

		//Объявление

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
		}

		//Скачать

		function downloadCanvas(link, canvas, filename) {
			link.href = document.getElementById(canvas).toDataURL();
			link.download = filename;
		}

		// Сохранение

		function save() {
			localStorage.removeItem("savedCanvas");
			localStorage.setItem("savedCanvas", JSON.stringify(linesArray));
		}

		// Загрузка сохраненого

		function load() {
			if (localStorage.getItem("savedCanvas") != null) {
				linesArray = JSON.parse(localStorage.savedCanvas);
				var lines = JSON.parse(localStorage.getItem("savedCanvas"));
				for (var i = 1; i < lines.length; i++) {
					ctx.beginPath();
					ctx.moveTo(linesArray[i-1].x, linesArray[i-1].y);
					ctx.lineWidth  = linesArray[i].size;
					ctx.lineCap = "round";
					ctx.strokeStyle = linesArray[i].color;
					ctx.lineTo(linesArray[i].x, linesArray[i].y);
					ctx.stroke();
				}
			}
		}

		// Ластик

		function eraser() {
			currentSize = 50;
			currentColor = currentBg;
			beginToEndI= 0;
		}

		// Карандаш

		function drawPen() {
			currentSize = currentSizeCopy;
			currentColor = currentColorCopy;
			beginToEndI= 0;
		}

		//Квадрат

		function sqrTool() {
			beginToEndI= 1;
		}

		// Позиция мышки

		function getMousePos(canvas, evt) {
			var rect = canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
		}

		// На зажатие

		function mousedown(canvas, evt) {
			var mousePos = getMousePos(canvas, evt);
			isMouseDown=true;
			currentPosition = getMousePos(canvas, evt);
			ctx.moveTo(currentPosition.x, currentPosition.y)
			ctx.beginPath();
			ctx.lineWidth  = currentSize;
			ctx.lineCap = "round";
			ctx.strokeStyle = currentColor;
			beginX=currentPosition.x;
			beginY=currentPosition.y;
		}

		// На движение

		function mousemove(canvas, evt) {
				if(isMouseDown){
					currentPosition = getMousePos(canvas, evt);
					if (beginToEndI==0){
					ctx.lineTo(currentPosition.x, currentPosition.y);
					ctx.stroke();
					store(currentPosition.x, currentPosition.y, currentSize, currentColor);
					}
				}
		}

		// Сохранение данных

		function store(x, y, s, c) {
			var line = {
				"x": x,
				"y": y,
				"size": s,
				"color": c
			}
			linesArray.push(line);
		}

		// На отпуск

		function mouseup(canvas, evt) {
			currentPosition = getMousePos(canvas, evt);
			endX=currentPosition.x;
			endY=currentPosition.y;
			isMouseDown=false;
			store();

			//Формы
			switch (beginToEndI) {
				case 1://квадрат
					ctx.fillStyle = currentColorCopy;
					ctx.fillRect(beginX,beginY,endX-beginX,endY-beginY);
					ctx.stroke();
				  break;
				case 2:
				  
				  break;
			  }
		}