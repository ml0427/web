var app = angular.module('app', []);

app.controller('controller', function($scope) {
	
});

// JavaScript code goes here
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// 球初始位置
var x = canvas.width / 2;
var y = canvas.height / 2;

// 位移量
var dx = 1;
var dy = -1;

// 球半徑
var ballRadius = 10;

// 反射板
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

// 鍵盤控制
var rightPressed = false;
var leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// 按下按鍵
function keyDownHandler(e) {
	console.log(e);
	if (e.key == "Right" || e.key == "ArrowRight") {
		rightPressed = true;
	} else if (e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = true;
	}
}

// 放開按鍵
function keyUpHandler(e) {
	console.log(e);
	if (e.key == "Right" || e.key == "ArrowRight") {
		rightPressed = false;
	} else if (e.key == "Left" || e.key == "ArrowLeft") {
		leftPressed = false;
	}
}

// 畫布邊界判斷
function isCanvasBottom() {
	return y + dy > canvas.height - ballRadius;
}
function isCanvasTop() {
	return y + dy < ballRadius;
}
function isCanvasRight() {
	return x + dx > canvas.width - ballRadius;
}
function isCanvasLeft() {
	return x + dx < ballRadius;
}

// 反射板邊界判斷
function isPaddleBottom() {
	return y + dy < canvas.height - ballRadius - paddleHeight;
}
function isPaddleTop() {
	return y + dy > canvas.height - ballRadius - paddleHeight - 30;
}
function isPaddleRight() {
	return x < paddleX + paddleWidth;
}
function isPaddleLeft() {
	return x > paddleX;
}

// 更新畫面
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	paddle();
	// 讀取保存的參數
	ctx.restore();
	ball();

	if (isCanvasLeft() || isCanvasRight()) {
		dx = -dx;
		ctx.fillStyle = getRandomColor();
		ctx.fill();
	}

	if (isCanvasBottom() || isCanvasTop()) {
		dy = -dy;
		ctx.fillStyle = getRandomColor();
		ctx.fill();
	}

	if (isPaddleLeft() && isPaddleRight() && isPaddleTop() && isPaddleBottom()) {
		if (isPaddleLeft() && isPaddleRight()) { // 板的水平範圍
			dy = -dy;
			ctx.fillStyle = getRandomColor();
			ctx.fill();
		}
		if (isPaddleTop() && isPaddleBottom()) {// 板的垂直範圍
			dx = -dx;
			ctx.fillStyle = getRandomColor();
			ctx.fill();
		}
	}

	// 反射板移動
	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 4;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= 4;
	}
	// 將現在參數保存
	ctx.save();
	x += dx;
	y += dy;
}
var interval = setInterval(draw, 5);

// 反射板
function paddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight - 30, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

// 球
function ball(ballColor) {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	// ctx.fillStyle = ballColor;
	ctx.fill();
	ctx.closePath();
}

// 隨機顏色
function getRandomColor() {
	var random = function() {
		return Math.floor(Math.random() * 256)
	};
	var out = "rgb(" + random() + "," + random() + "," + random() + ")";
	// console.log(out);
	return out;

}
