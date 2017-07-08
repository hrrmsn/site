// *****************************
// * DEFINE MAGIC SQUARE CLASS *
// *****************************

// Create a magic square of size 'order' using the numbers 'startCountFrom' to 'startCountFrom + order^2 - 1'
function MagicSquare(order, startCountFrom) {
  if (order < 3) {
    alert("Order should be more than or equal 3. The magic square of order 2 does not exist.");
    throw new Error("Order should be more than or equal 3.");
  }
  this._order = order;
  this._startCountFrom = startCountFrom;
  this._magicSum = this._order * (this._order * this._order + 2 * this._startCountFrom - 1) / 2;

  this._matrix = [];
  this._initializeMatrix();

  this._generate();
}


MagicSquare.prototype.getMagicSum = function() {
  return this._magicSum;
}

MagicSquare.prototype.getOrder = function() {
  return this._order;
}

MagicSquare.prototype.getAt = function(y, x) {
  return this._matrix[y][x];
}


MagicSquare.prototype._initializeMatrix = function() {
  for (var i = 0; i < this._order; i++) {
    this._matrix.push([]);
  }
  for (var y = 0; y < this._order; y++) {
    for (var x = 0; x < this._order; x++) {
      this._matrix[y][x] = null;
    }
  }
}

MagicSquare.prototype._generate = function() {
  if (this._order % 4 === 0) {
    this._generateDoubleEvenOrderMagicSquare();
  } else if (this._order % 2 === 0) {
    this._generateSingleEvenOrderMagicSquare();
  } else {
    this._generateOddOrderMagicSquare(this._matrix, 0, 0, this._order, 0);
  }

  // add startCountFrom to the all matrix elements
  for (var y = 0; y < this._order; y++) {
    for (var x = 0; x < this._order; x++) {
      this._matrix[y][x] += this._startCountFrom;
    }
  }
}


MagicSquare.prototype._generateDoubleEvenOrderMagicSquare = function() {
  var unusedNumbers = [];
  var counter = 0;

  // put numbers to the right area
  for (var y = 0; y < this._order; y++) {
    for (var x = 0; x < this._order; x++) {
      if (this._areCellIndexesFromTheRightArea(y, x)) {
        this._matrix[y][x] = counter;
      } else {
        unusedNumbers.push(counter);
      }
      counter++;
    }
  }

  // put unused numbers to the wrong area
  var yCoordinate = unusedNumbers.length - 1;
  for (var y = 0; y < this._order; y++) {
    for (var x = 0; x < this._order; x++) {
      if (this._matrix[y][x] === null) {
        this._matrix[y][x] = unusedNumbers[yCoordinate--];
      }
    }
  }
}

MagicSquare.prototype._areCellIndexesFromTheRightArea = function(y, x) {
  var quarterSize = this._order / 4;

  var isMiddle = (quarterSize <= y) && (y < 3 * quarterSize);
  var isCenter = (quarterSize <= x) && (x < 3 * quarterSize);

  return isMiddle === isCenter;
}


MagicSquare.prototype._generateSingleEvenOrderMagicSquare = function() {
  this._createABCDSquares();
  this._swapTwoAreas();
}

MagicSquare.prototype._createABCDSquares = function() {
  var size = this._order / 2;
  var quarterOfOrderSquare = (this._order * this._order) / 4;
  var counter = 0;

  this._generateOddOrderMagicSquare(this._matrix, 0, 0, size, counter);

  counter += quarterOfOrderSquare;
  this._generateOddOrderMagicSquare(this._matrix, this._order / 2, this._order / 2, size, counter);

  counter += quarterOfOrderSquare;
  this._generateOddOrderMagicSquare(this._matrix, 0, this._order / 2, size, counter);

  counter += quarterOfOrderSquare;
  this._generateOddOrderMagicSquare(this._matrix, this._order / 2, 0, size, counter);
}

MagicSquare.prototype._swapTwoAreas = function() {
  var d = Math.floor(this._order / 4);
  var halfOfOrder = this._order / 2;

  for (var y = 0; y < halfOfOrder; y++) {
    var offset = y === d ? 1 : 0;
    // left area
    for (var x = offset; x < d + offset; x++) {
      this._swapTwoMatrixElements(this._matrix, y, x, y + halfOfOrder, x);
    }
    // right area
    for (var x = this._order - d + 1; x < this._order; x++) {
      this._swapTwoMatrixElements(this._matrix, y, x, y + halfOfOrder, x);
    }
  }
}

MagicSquare.prototype._swapTwoMatrixElements = function(matrix, firstY, firstX, secondY, secondX) {
  var temp = matrix[firstY][firstX];
  matrix[firstY][firstX] = matrix[secondY][secondX];
  matrix[secondY][secondX] = temp;
}


// use the Siamese method
MagicSquare.prototype._generateOddOrderMagicSquare = function(matrix, y0, x0, size, startNumber) {
  var counter = startNumber;
  var y = y0;
  var x = x0 + (size - 1) / 2;

  // start at the top middle
  matrix[y][x] = counter++;

  // fill other cells
  while (counter < size * size + startNumber) {
    // go diagonally
    var newY = y - 1;
    var newX = x + 1;

    // wrap around
    if (newY < y0) {
      newY += size;
    }
    if (newX === x0 + size) {
      newX -= size;
    }

    if (matrix[newY][newX] !== null) {
      // go down instead
      newY = y + 1;
      newX = x;
    }

    y = newY;
    x = newX;
    matrix[y][x] = counter++;
  }
}


// ===========================
// GLOBAL FUNCTION DEFINITIONS
// ===========================
var createMagicSquareHtmlTable = function(square) {
  var htmlTable = "<table>";
  for (var y = 0; y < square.getOrder(); y++) {
    htmlTable += "<tr>";
    for (var x = 0; x < square.getOrder(); x++) {
      htmlTable += "<td>" + square.getAt(y, x) + "</td>";
    }
    htmlTable += "</tr>";
  }
  htmlTable += "</table>";
  return htmlTable;
}

var createEmptyArray = function(size) {
  var array = [];
  for (var i = 0; i < size; i++) array[i] = 0;
  return array; 
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

  var startCountFromValue = document.getElementById("start-count-from").value;
  if (!startCountFromValue.match(/^-?[0-9]+$/)) {
    alert("Start from field value should be an integer number.");
    throw new Error("Start from field value should be an integer number.");
  }
  var startCountFrom = parseInt(startCountFromValue);

  var magicSquare = new MagicSquare(order, startCountFrom);

  // print
  document.getElementById("output").innerHTML = createMagicSquareHtmlTable(magicSquare);
  document.getElementById("magic-sum").innerHTML = "magic sum: ";
  document.getElementById("magic-sum").innerHTML += magicSquare.getMagicSum();
  var timeExecutionInSeconds = Math.round(((performance.now() - time) / 1000) * 1000) / 1000;
  document.getElementById("time-execution").innerHTML = "generated in " + timeExecutionInSeconds + " sec";  
}
