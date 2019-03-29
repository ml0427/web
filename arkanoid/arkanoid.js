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
var dx = 2;
var dy = -2;

// 球半徑
var ballRadius = 10;

// 反射板
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

// 鍵盤控制
var rightPressed = false;
var leftPressed = false;

// 磚塊
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (var r = 0; r < brickRowCount; r++) {
		bricks[c][r] = {
			x : 0,
			y : 0,
			status : 1
		};
	}
}

// 得分
var scores = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

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

// 滑鼠
function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;
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
	// 反射板
	paddle();
	// 磚塊
	brick();
	// 計分
	score();
	// 讀取保存的參數
	ctx.restore();
	// 球
	ball();
	// 磚塊碰撞判斷
	collisionDetection();
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

	requestAnimationFrame(draw);
}
draw();

// 碰撞檢測
function collisionDetection() {

	// 邊界
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

	// 磚塊
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.status == 1) {
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy;
					b.status = 0;
					scores++;
				}
			}
		}
	}

	// 反射板
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
}

// 分數
function score() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: " + scores, 8, 20);
}

// 磚塊
function brick() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
				var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
				var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

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
	ctx.fill();
	ctx.closePath();
}

// 隨機顏色
function getRandomColor() {
	var random = function() {
		return Math.floor(Math.random() * 256)
	};
	var out = "rgb(" + random() + "," + random() + "," + random() + ")";
	return out;
}
