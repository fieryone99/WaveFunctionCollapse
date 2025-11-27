let grid;
let numCellsAcross;
let numCellsDown = numCellsAcross;
let cellWidth = 12;
let cellHeight = cellWidth;

let totalPieces = [
  [2,2,1,1],//     L
  [2,1,2,1],//     |
  [2,2,2,1],//     T
  [1,1,1,1],//     . 
  [2,2,2,2]//      +
];

let pieces =[];

let unchangedIterations = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  numCellsAcross = floor(width/cellWidth);
  numCellsDown = floor(height/cellHeight);
  
  setUpPage();
}

function draw() {
  background(0);
  stroke(255);

  let minPossiblePieces = 100;
  let cellsWithMinPossible = [];

  for (let i = 0; i < numCellsAcross; i++) {
    for (let j = 0; j < numCellsDown; j++) {
      //show evbery cell
      //circle(i * cellWidth + cellWidth/2, j * cellHeight + cellHeight/2, 3);
      if (grid[i][j].edges[0] == 2) {
        line(i * cellWidth + cellWidth/2, j * cellHeight + cellHeight/2, i * cellWidth + cellWidth/2, j * cellHeight);
      }
      if (grid[i][j].edges[1] == 2) {
        line(i * cellWidth + cellWidth/2, j * cellHeight + cellHeight/2, i * cellWidth + cellWidth, j * cellHeight + cellHeight/2);
      }
      if (grid[i][j].edges[2] == 2) {
        line(i * cellWidth + cellWidth/2, j * cellHeight + cellHeight/2, i * cellWidth + cellWidth/2, j * cellHeight + cellHeight);
      }
      if (grid[i][j].edges[3] == 2) {
        line(i * cellWidth + cellWidth/2, j * cellHeight + cellHeight/2, i * cellWidth, j * cellHeight + cellHeight/2);
      }
    }
  }
  for (let i = 0; i < numCellsAcross; i++) {
    for (let j = 0; j < numCellsDown; j++) {
      if (grid[i][j].set == false) { 
      //do entropy stuff
      let currentEdges = grid[i][j].edges;
      let numPossiblePieces = 0;

      for (let p = 0; p < pieces.length; p++) {
        for (let o = 0; o < 4; o++) {
          //for every piece in every orientation
          let testPiece = cycleOrientation(pieces[p], o);

          let matching = true;
          //does it match or have the possibilty to match withnull edges
          for (let e = 0; e < 4; e++) {
            //console.log(currentEdges[e], testPiece[e]);
            if ((currentEdges[e] == testPiece[e]) || (currentEdges[e] == 0)) {
              //matches
            } else {
              //does not match
              matching = false;
              //console.log(currentEdges, testPiece);
            }
          }
          
          if (matching == true) {
            numPossiblePieces++;
            //console.log(currentEdges, testPiece);
          }
        }
      }//end of loop for checking pieces
      if (numPossiblePieces < minPossiblePieces) {
        minPossiblePieces = numPossiblePieces;
        cellsWithMinPossible = [];
        cellsWithMinPossible.push([i,j]);

      } else if (numPossiblePieces == minPossiblePieces) {
        cellsWithMinPossible.push([i,j]);
      }
    }
  }
}
  let pickedCellCoordinates = random(cellsWithMinPossible);
  try {
  let pickedCell = grid[pickedCellCoordinates[0]][pickedCellCoordinates[1]];
  let possiblePieces = [];

  for (let p = 0; p < pieces.length; p++) {
        for (let o = 0; o < 4; o++) {
          //for every piece in every orientation
          let testPiece = cycleOrientation(pieces[p], o);

          let matching = true;
          //does it match or have the possibilty to match withnull edges
          for (let e = 0; e < 4; e++) {
            if ((pickedCell.edges[e] == testPiece[e]) || (pickedCell.edges[e] == 0)) {
              //matches
            } else {
              //does not match
              matching = false;
            }
          }
          
          if (matching == true) {
            possiblePieces.push(testPiece);
          }
        }
      }
    updateCellAndNeighbours(pickedCellCoordinates[0], pickedCellCoordinates[1], random(possiblePieces));
  }catch {
    setUpPage();
  }
}

function updateCellAndNeighbours(x, y, piece) {
  //console.log(piece);
  grid[x][y].edges = piece;
  grid[x][y].set = true;

  try {
  if (x > 0) {
  grid[x-1][y].edges[1] = grid[x][y].edges[3]; //match right edge of left neighbour to left edge of the updated cell
  }
  if (x < numCellsAcross-1) {
  grid[x+1][y].edges[3] = grid[x][y].edges[1]; //match left edge of right neighbour to right edge of teh updated cell
  }
  if (y > 0) {
  grid[x][y-1].edges[2] = grid[x][y].edges[0];
  }
  if (y < numCellsDown-1) { 
  grid[x][y+1].edges[0] = grid[x][y].edges[2];
  }
} catch {
    setUpPage();
}
}

function setUpPage() {
  grid = create2DArray(numCellsAcross, numCellsDown);
  pieces = [];
  for (let p = 0; p < totalPieces.length; p++) {
    if (random() < 0.5) {
      pieces.push(totalPieces[p]);
    }
  }
  if (pieces == []) {
    pieces.push([2,2,1,1]);
    pieces.push([2,1,2,1]);

  }
  console.log(pieces);

  let selectedPiece = pieces[floor(random(pieces.length))];
  while (selectedPiece == [1,1,1,1]) {
    selectedPiece = pieces[floor(random(pieces.length))];
  }
  let selectedRotation = floor(random(4));
  let seedPiece = cycleOrientation(selectedPiece, selectedRotation);

  let seedX = floor(random(numCellsAcross));
  let seedY = floor(random(numCellsDown));

  updateCellAndNeighbours(seedX, seedY, seedPiece);
}

function cycleOrientation(piece = [], step) {
  newPiece = [];

  for (let s = 0; s < 4; s++) {
    newPiece[(s + step)%4] = piece[s];
  }

  return newPiece;

}

function create2DArray(x, y) {
  let newArray = [];
  for (let i = 0; i < x; i++) {
    newArray[i] = [];
    for (let j = 0; j < y; j++) {
      newArray[i][j] = new Cell([0,0,0,0], false);
    }
  }
  return newArray;
}