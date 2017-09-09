TimeTicker.prototype.constructor = TimeTicker;
TimeTicker.prototype.updateEntities = updateEntities;
TimeTicker.prototype.updateCells = updateCells;
TimeTicker.prototype.updateGoats = updateGoats;
TimeTicker.prototype.updateGoatCoordinates = updateGoatCoordinates;
TimeTicker.prototype.updateGoatFood = updateGoatFood;
TimeTicker.prototype.checkDead = checkDead;

function TimeTicker(world, view) {
    this.world = world;
    this.view = view;
    this.lastTimestamp = null;
}

/**
 * Update the entities
 */
function updateEntities(timestamp) {
    if (!this.lastTimestamp) {
        this.lastTimestamp = timestamp;
    }

    var elapsedTime = (timestamp - this.lastTimestamp) / 1000;

    this.updateCells(elapsedTime);
    this.updateGoats(elapsedTime);

    this.view.drawWorld();

    this.lastTimestamp = timestamp;
    window.requestAnimationFrame(this.updateEntities.bind(this));
}

/**
 * Update the cells food
 * @param elapsedTime elapsed time since last update
 */
function updateCells(elapsedTime) {
    var cell;

    for (var i = 0; i < this.world.cells.length; i++) {
        cell = this.world.cells[i];

        cell.food += cell.growthFactor * elapsedTime;
        if (cell.food >= CELL_MAXIMUM_FOOD) {
            cell.food = CELL_MAXIMUM_FOOD;
        }
    }
}

/**
 * Update the goats coordinates
 * @param elapsedTime elapsed time since last update
 */
function updateGoats(elapsedTime) {
    var goat, goatCell, goatKnowledgeCell;

    for (var i = 0; i < this.world.goats.length; i++) {
        goat = this.world.goats[i];
        goatCell = this.world.getCell(goat.x, goat.y);

        // Update knowledge
        goatKnowledgeCell = goat.getKnowledgeCell(goatCell.id);
        goatKnowledgeCell.cellType = goatCell.cellType;
        goatKnowledgeCell.food = goatCell.food;

        this.updateGoatCoordinates(elapsedTime, goat, goatCell);
        this.updateGoatFood(elapsedTime, goat, goatCell);
        this.checkDead(goat);
    }
}

/**
 * Update the goat coordinates
 * @param elapsedTime elapsed time since last update
 * @param goat goat that is being updated
 * @param goatCell cell where the goat is
 */
function updateGoatCoordinates(elapsedTime, goat, goatCell) {
    // Cell
    goat.currentCell = goatCell;

    // Calculate X
    if (goat.targetX > goat.x) {
        goat.x += goat.speed * goatCell.speedFactor * elapsedTime;
        if (goat.x > goat.targetX) {
            goat.x = goat.targetX;
        }
    } else {
        goat.x -= goat.speed * goatCell.speedFactor * elapsedTime;
        if (goat.x < goat.targetX) {
            goat.x = goat.targetX;
        }
    }

    // Calculate Y
    if (goat.targetY > goat.y) {
        goat.y += goat.speed * goatCell.speedFactor * elapsedTime;
        if (goat.y > goat.targetY) {
            goat.y = goat.targetY;
        }
    } else {
        goat.y -= goat.speed * goatCell.speedFactor * elapsedTime;
        if (goat.y < goat.targetY) {
            goat.y = goat.targetY;
        }
    }
}

/**
 * Update the goat food
 * @param elapsedTime elapsed time since last update
 * @param goat goat that is being updated
 * @param goatCell cell where the goat is
 */
function updateGoatFood(elapsedTime, goat, goatCell) {
    goat.food -= goat.hungrySpeed * elapsedTime;

    if (goat.food >= goat.maximumFood) {
        return;
    }

    // No food in the cell
    if (goatCell.food <= 0) {
        return;
    }

    var goatMouthSpace = goat.eatSpeed * elapsedTime;
    var goatStomachSpace = goat.maximumFood - goat.food;

    if(goatStomachSpace < goatMouthSpace) {
        goatMouthSpace = goatStomachSpace;
    }

    if(goatCell.food < goatMouthSpace){
        goat.food += goatCell.food;
        goatCell.food = 0;
    } else {
        goatCell.food -= goatMouthSpace;
        goat.food += goatMouthSpace;
    }
}

/**
 * Check if goat dies
 * @param goat goat to check
 */
function checkDead(goat) {
    if (goat.food <= 0) {
        this.world.goats.splice(this.world.goats.indexOf(goat), 1);
        console.log("Goats remaining: " + this.world.goats.length);
    }
}
