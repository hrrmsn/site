// *****************************
// * DEFINE MAGIC SQUARE CLASS *
// *****************************

function MagicSquare(order, startCountFrom) {
	this.order = order;
	this.startCountFrom = startCountFrom;
	this.magicSum = 0;

	this.matrix = [];
	this.initializeMatrix();
}

MagicSquare.prototype.initializeMatrix = function() {
	for (var i = 0; i < this.order; i++) {
		this.matrix.push([]);
	}
	for (var i = 0; i < this.order; i++) {
		for (var j = 0; j < this.order; j++) {
			this.matrix[i][j] = null;
		}
	}
}

MagicSquare.prototype.generate = function() {
	if (this.order % 4 === 0) {
		this.generateDoubleEvenOrderMagicSquare();
	} else if (this.order % 2 === 0) {
		this.generateSingleEvenOrderMagicSquare();
	} else {
		this.generateOddOrderMagicSquare(this.matrix, 0, 0, this.order, this.startCountFrom);
	}	
}

MagicSquare.prototype.generateDoubleEvenOrderMagicSquare = function() {
	var unusedNumbers = [];
	var counter = this.startCountFrom;

	// put numbers to the right area
	for (var i = 0; i < this.order; i++) {
		for (var j = 0; j < this.order; j++) {
			if (this.areCellIndexesFromTheRightArea(i, j)) {
				this.matrix[i][j] = counter;
			} else {
				unusedNumbers.push(counter);
			}
			counter++;
		}
	}

	// put unused numbers to the wrong area
	var indexI = unusedNumbers.length - 1;
	for (var i = 0; i < this.order; i++) {
		for (var j = 0; j < this.order; j++) {
			if (this.matrix[i][j] === null) {
				this.matrix[i][j] = unusedNumbers[indexI--];
			}
		}
	}
}

MagicSquare.prototype.areCellIndexesFromTheRightArea = function(indexI, indexJ) {
	var oneQuarterOrder = Math.floor(this.order / 4);
	var threeQuartersOrder = 3 * oneQuarterOrder;

	var topIRule = (indexI >= 0) && (indexI <= oneQuarterOrder - 1);
	var bottomIRule = (indexI >= threeQuartersOrder) && (indexI <= this.order - 1);
	var middleIRule = (indexI >= oneQuarterOrder) && (indexI <= threeQuartersOrder - 1);

	var leftJRule = (indexJ >= 0) && (indexJ <= oneQuarterOrder - 1);
	var rightJRule = (indexJ >= threeQuartersOrder) && (indexJ <= this.order - 1);
	var middleJRule = (indexJ >= oneQuarterOrder) && (indexJ <= threeQuartersOrder - 1);
		
	var topLeftAreaCase = topIRule && leftJRule;
	var topRightAreaCase = topIRule && rightJRule;
	var middleAreaCase = middleIRule && middleJRule;
	var bottomLeftAreaCase = bottomIRule && leftJRule;
	var bottomRightAreaCase = bottomIRule && rightJRule;

	return topLeftAreaCase || topRightAreaCase || middleAreaCase || bottomLeftAreaCase || bottomRightAreaCase;
}


MagicSquare.prototype.generateSingleEvenOrderMagicSquare = function() {
	this.createABCDSquares(this.startCountFrom);
	this.swapTwoAreas();
}

MagicSquare.prototype.createABCDSquares = function(startNumber) {
	var size = this.order / 2;
	var oneQuarterOfOrderSquare = (this.order * this.order) / 4;
	var startCountFrom = startNumber;

	// create A, B, C, D squares in cycle
	var alpha = 0;
	while (alpha <= 3 * Math.PI / 2) {
		this.generateOddOrderMagicSquare(this.matrix, Math.floor(Math.abs(Math.sin(alpha)) * (this.order / 2)), 
			Math.floor(Math.abs(Math.sin(alpha + Math.floor(alpha / Math.PI) * (Math.PI / 2))) * (this.order / 2)), 
			size, startCountFrom);
		alpha += Math.PI / 2;
		startCountFrom += oneQuarterOfOrderSquare;
	}
}

MagicSquare.prototype.swapTwoMatrixElements = function(matrix, indexIFirst, indexJFirst, indexISecond, indexJSecond) {
	var temp = matrix[indexIFirst][indexJFirst];
	matrix[indexIFirst][indexJFirst] = matrix[indexISecond][indexJSecond];
	matrix[indexISecond][indexJSecond] = temp;
}

MagicSquare.prototype.swapTwoAreas = function() {
	var d = Math.floor(this.order / 4);
	var x = d - 1;
	var halfOfOrder = this.order / 2;

	for (var i = 0; i < halfOfOrder; i++) {
		var offset = i === d ? 1 : 0;
		// left area
		for (var j = offset; j < d + offset; j++) {
			this.swapTwoMatrixElements(this.matrix, i, j, i + halfOfOrder, j);
		}
		// right area
		for (var j = this.order - x; j < this.order; j++) {
			this.swapTwoMatrixElements(this.matrix, i, j, i + halfOfOrder, j);
		}
	}
}


MagicSquare.prototype.generateOddOrderMagicSquare = function(matrix, indexIStart, indexJStart, size, startNumber) {
	var counter = startNumber;
	var indexI = indexIStart;
	var indexJ = Math.floor(size / 2) + indexJStart;

	// set one to the top middle cell 
	matrix[indexI][indexJ] = counter++;

	// fill other cells
	while (counter < size * size + startNumber) {
		if (indexI === indexIStart && indexJ === indexJStart + size - 1) {
			indexI++;
		} else if (indexI === indexIStart && indexJ < indexJStart + size - 1) {
			indexI = indexIStart + size - 1;
			indexJ++;
		} else if (indexI > indexIStart && indexJ === indexJStart + size - 1) {
			indexI--;
			indexJ = indexJStart;
		} else if (matrix[indexI - 1][indexJ + 1] !== null) {
			indexI++;
		} else {
			indexI--;
			indexJ++;
		}
		matrix[indexI][indexJ] = counter++;
	}
}

MagicSquare.prototype.isMagic = function() {
	this.magicSum = this.order * (this.order * this.order + 2 * this.startCountFrom - 1) / 2;

	var horizontalSums = this.createEmptyArray(this.order);
	var verticalSums = this.createEmptyArray(this.order);
	var mainDiagonalSum = 0, minorDiagonalSum = 0;
	for (var i = 0; i < this.order; i++) {
		for (var j = 0; j < this.order; j++) {
			horizontalSums[i] += this.matrix[i][j];
			verticalSums[j] += this.matrix[i][j];
			if (i === j) mainDiagonalSum += this.matrix[i][j];
			if (i + j === this.order - 1) minorDiagonalSum += this.matrix[i][j];
		}
	}

	var validSumsNumber = 0;
	for (var i = 0; i < this.order; i++) {
		if (horizontalSums[i] === this.getMagicSum() && verticalSums[i] === this.getMagicSum()) validSumsNumber += 2;
	}
	if (mainDiagonalSum === this.getMagicSum() && minorDiagonalSum === this.getMagicSum()) validSumsNumber += 2;
	return validSumsNumber === 2 * (this.order + 1);
}

MagicSquare.prototype.createHtmlTable = function() {
	var htmlTable = "<table>";
	for (var i = 0; i < this.order; i++) {
		htmlTable += "<tr>";
		for (var j = 0; j < this.order; j++) {
			htmlTable += "<td>" + this.matrix[i][j] + "</td>";
		}
		htmlTable += "</tr>";
	}
	htmlTable += "</table>";
	return htmlTable;
}

MagicSquare.prototype.createEmptyArray = function(size) {
	var array = [];
	for (var i = 0; i < size; i++) array[i] = 0;
	return array;
}

MagicSquare.prototype.getMagicSum = function() {
	return this.magicSum;
}


// ===========================
// GLOBAL FUNCTION DEFINITIONS
// ===========================

// test method
var checkValidity = function() {
	var counter = 0;
	for (var i = 3; i < 23; i++) {
		for (var j = -9; j < 11; j++) {
			var testMagicSquare = new MagicSquare(i, j);
			testMagicSquare.generate();
			if (testMagicSquare.isMagic()) counter++;
		}
	}
	return counter === 400;
}

// main method
var generateMagicSquare = function() {
	var time = performance.now();

	var orderValue = document.getElementById("order").value;
	if (!orderValue.match(/^[0-9]+$/)) {
		alert("Order should be a positive number.");
		throw new Error("Order should be a positive number.");
	}

	var order = parseInt(orderValue);
	if (order < 3) {
		alert("Order should be more than or equal 3. The magic square of order 2 does not exist.");
		throw new Error("Order should be more than or equal 3.");
	}

	var startCountFromValue = document.getElementById("start-count-from").value;
	if (!startCountFromValue.match(/^-?[0-9]+$/)) {
		alert("Field value should be an integer number.");
		throw new Error("Start count from field value should be an integer number.");
	}
	var startCountFrom = parseInt(startCountFromValue);

	var magicSquare = new MagicSquare(order, startCountFrom);
	magicSquare.generate();

	// print
	document.getElementById("output").innerHTML = magicSquare.createHtmlTable();
	document.getElementById("is-magic").innerHTML = "is magic: " + magicSquare.isMagic();
	document.getElementById("magic-sum").innerHTML = "magic sum: ";
	document.getElementById("magic-sum").innerHTML += magicSquare.isMagic() ? magicSquare.getMagicSum() : "undefined";
	document.getElementById("validity-check").innerHTML = "validity check: <font color=red>failure</font>";
	if (checkValidity()) {
		document.getElementById("validity-check").innerHTML = "validity check: <font color=green>success</font>";
	}
	var timeExecutionInSeconds = Math.round(((performance.now() - time) / 1000) * 1000) / 1000;
	document.getElementById("time-execution").innerHTML = "generated in " + timeExecutionInSeconds + " sec";	
}
