var memoryApp = {

  view : {
    displayLetter : function(letter, location) {
      var cell = getE(location);
      cell.innerHTML = letter;
    },

    displayFlip : function(id) {
      var cell = getE(id);
      cell.setAttribute("class", "flipped");
    },

    displayHidden : function(id) {
      var cell = getE(id);
      cell.setAttribute("class", "hidden");
    },

    printOutput : function(txt) {
      var output = getE("output");
      output.innerHTML = txt;
    }
  },

  model : {
    gridState : [],
    matchesFound : 0, //  not necassary

    countFlipped : function() { // returns number of cards flipped on gameboard
      var flipped = 0;
      for( let i = 0; i < this.gridState.length; i += 1 ) {
        if(this.gridState[i].guessed) {
          flipped ++;
        }
      }
      return flipped;
    },

    isMatch : function() {
      var flippedNumbers = [];
      var grid = this.gridState;

      for( let i = 0; i < grid.length; i += 1 ) {
        if(grid[i].guessed) {
          flippedNumbers.push(grid[i]);
        }
      }
        if(flippedNumbers[0].letter === flippedNumbers[1].letter) {
          flippedNumbers.map(this.markFound);
          return true;
        }
        else{
          return false;
        }
    },

    markFound: function(cell) {
      console.log(cell);
      cell.found = true;
    },

    isWon : function() {
      var neededToWin = this.gridState.length / 2;
      if(this.matchesFound === neededToWin) {
        return true;
      }
      else{
        return false;
      }
    },

    /*gridGeneration: {

      buildGridData: function() {  // the grid function creates the data structor --
        var gridData = document.getElementsByTagName("td");
        var gridStructure = [];

        for(let i = 0; i < gridData.length; i++) {
          let location = gridData[i].id;
          gridStructure.push(new this.cellConstruct(location, false, ""));
        }
          memoryApp.model.gridState = gridStructure;
      },

      cellConstruct : function(location, guessed,letter) {
        this.location = location;
        this.guessed = guessed;
        this.letter = letter;
        this.found = false;
      },

      genGrid : function(size) {
        var tableArea = getE("gamegrid");
        var gridSize = Math.sqrt(size);
        var cell;

        for(let i = 0; i < gridSize; i += 1) {
          let tableRow = tableArea.insertRow();
          for(let j = 0; j < gridSize; j +=1) {
            cell = tableRow.insertCell();
            cell.id = i + "" + j;
            cell.setAttribute("class", "hidden");
            }
          }
      }
    }, // end of gridGeneration object

    gridPopulation : {

      genLocationList : function(gridSize){
        var loc = "";
        var locationList = [];
        gridSize = Math.sqrt(gridSize);

        for( let i = 0; i < gridSize; i += 1) {
          let row = i;
          for( let j = 0; j < gridSize; j += 1) {
            let col = j;
          loc = col + "" + row;
          locationList.push(loc);
          }
        }
        return locationList;
      },

      genNumberList : function(gridSize) {
        var numberList = [];
        gridSize = gridSize / 2;

        for( i = 1; i <= gridSize; i += 1) {
          numberList.push(i);
        }
        return numberList;
      },

      getRandomIndex : function(array) { // returns a random index between 0 and last position of array.
        return Math.floor(Math.random() * array.length);
      },

      genMatch : function(locations, numbers) {
        var that = this;

        var makeMatch = function() {
        var match = {loc1: "", loc2: "", letter: ""};
        var index = that.getRandomIndex(locations);
          match.loc1 = locations[index];
          locations.splice(index, 1);
          //console.log(locations);
          index = that.getRandomIndex(locations);
          match.loc2 = locations[index];
          locations.splice(index, 1);
          //console.log(locations);
          index = that.getRandomIndex(numbers);
          match.letter = numbers[index];
          numbers.splice(index, 1);
          //console.log(numbers);

        return match;
        }
        return makeMatch();
      },

      populateGrid : function(gridSize) {
        locationList = this.genLocationList(gridSize);
        numberList = this.genNumberList(gridSize);
        for (let i = 0; i < gridSize / 2; i += 1) {
          let match = this.genMatch(locationList, numberList);
          let letter = match.letter;
          this.markLetter(match.loc1, letter);
          this.markLetter(match.loc2, letter);
          //console.log(letter + ", " + match.loc1 + ", " + match.loc2);
        }
      },

      markLetter(location, letter) {
        var grid = memoryApp.model.gridState;
        for(let i = 0; i < grid.length; i += 1) {
          if(grid[i].location === location) {
            grid[i].letter = letter;
            memoryApp.view.displayLetter(letter, location);
          }
        }
      },

    }//end of gridPopulationObject */

  }, // end of model object

  controller : {
    getCellObject : function(cellLocation) {
      var grid = memoryApp.model.gridState;
      for( let i = 0; i < grid.length; i += 1) {
        //console.log(grid[i].location);
        if(cellLocation === grid[i].location) {
          return grid[i]; // returns cell object
        }
      }
        console.log("error at getCellObject --> invalid location passed");
    },

    processGuess(cellLocation) {
      var cellObject = this.getCellObject(cellLocation);
      console.log(cellObject);
      var matchesFound = memoryApp.model.matchesFound;
      console.log("matchesFound: " + matchesFound);

      memoryApp.view.displayFlip(cellLocation);
      cellObject.guessed = true;

      if(memoryApp.model.countFlipped() > 1) {
        if(memoryApp.model.isMatch()) {
          memoryApp.view.printOutput("Got One!");
          matchesFound ++;
          this.checkWin();
        }
        else{

          setTimeout(this.hideAll(), 3000);
          memoryApp.view.printOutput("Bad Guess");
        }
      }
    },

    checkWin : function() {
      if(memoryApp.model.isWon()) {
        if(confirm("You won! wanna play again")){
          this.resetGame();
        }
      }
    },

    hideAll : function() {
      var grid = memoryApp.model.gridState;
      for(let i = 0; i < grid.length; i += 1) {
        if(grid[i].guessed) {
          grid[i].guessed = false;
          memoryApp.view.displayHidden(grid[i].location);
        }
      }
    },

  }
};// end of memoryApp object


function getE(id) {
  return document.getElementById(id);
}

function selectionHandler() {
  var selector = getE("selector");
  var gridSize = selector.value;
  memoryApp.model.gridGeneration.genGrid(gridSize);
  memoryApp.model.gridGeneration.buildGridData();
  memoryApp.model.gridPopulation.populateGrid(gridSize);
  initClickGrid();
}

function initClickGrid() {
  var grid  = document.getElementsByTagName("td");
  console.log(grid);
  for( let i = 0; i < grid.length; i += 1 ) {
    grid[i].onclick = function() {
      memoryApp.controller.processGuess(this.id);
    }
  }
}

function init() {
  var selector = getE("selector");
  selector.onchange = selectionHandler;
}

window.onload = init;
