// JavaScript code goes here
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 1;
var dy = -1;

var ballRadius = 10;

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBall(get_random_color());
	}
	if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
		dy = -dy;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBall(get_random_color());
	}

	x += dx;
	y += dy;
}
setInterval(draw, 1);

function drawBall(color) {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function get_random_color() {
	var random = function() {
		return Math.floor(Math.random() * 256)
	};
	var out = "rgb(" + random() + "," + random() + "," + random() + ")";
	console.log(out);
	return out;

}
