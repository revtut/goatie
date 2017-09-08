View.prototype.constructor = View;
View.prototype.resizeCanvas = resizeCanvas;
View.prototype.drawGoat = drawGoat;

function test() {
    console.log(world);
    for(var i = 0; i < world.goats.length; i++) {
        view.drawGoat(world.goats[i]);
    }
}

function View(world) {
    this.canvas = document.getElementById("board");
    this.context = this.canvas.getContext("2d");
    this.world = world;
}

/**
 * Function to resize the canvas
 */
function resizeCanvas() {
    console.log('Resizing the canvas');

    // Resize Canvas
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;

    test();
}

/**
 * Draw a goat in the canvas
 */
function drawGoat(goat) {
    var xFactor = this.canvas.width / this.world.width;
    var yFactor = this.canvas.height / this.world.height;



    this.context.beginPath();
    this.context.arc(goat.x * xFactor, goat.y * yFactor, goat.size * yFactor * xFactor, 0, 2 * Math.PI, true);
    this.context.fillStyle = goat.getColor();
    this.context.fill();
}
