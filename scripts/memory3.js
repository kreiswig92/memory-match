Array.prototype.allValuesSame = function() {

    for(var i = 1; i < this.length; i++)
    {
        if(this[i] !== this[0])
            return false;
    }

    return true;
}

var memoryApp = (function () {
  var api = {};

  var view = {
    displayMark : function(mark, location) {
      var cell = getE(location);
      cell.innerHTML = "<span>" + mark + "</span>";
    },

    displayFlip : function(id) {
      var cell = getE(id);
      cell.setAttribute("class", "flipped");
    },

    displayHidden : function(id) {
      var cell = getE(id);
      cell.setAttribute("class", "hidden");
    },

    displayHover : function(id) {
      var cellObject = model.getCellObject(id);
      var cell = getE(id);
      if(model.countDisplayed() < 2) {
      if(cellObject.displayed) {
        cell.setAttribute("class", "flippedHov");
      }
      else{
        cell.setAttribute("class", "hiddenHov");
      }
    }
    },

    removeHover : function(id) {
      var cellObject = model.getCellObject(id);
      var cell = getE(id);
      if(cellObject.displayed){
        cell.setAttribute("class", "flipped");
      }
      else{
        if(model.countDisplayed() > 1) {
          setTimeout(function(){cell.setAttribute("class", "hidden");}, 800);
        }
        else{
          cell.setAttribute("class", "hidden");
        }
      }
    },

    printOutput : function(txt) {
      var output = getE("output");
      output.innerHTML = txt;
      setTimeout(function() {output.innerHTML = ''}, 800);
    }
  };

  var model = {
    gridstate : [],
    displayedMarks : [],
    found : 0,


    displayCell : function(cell) {
      var location = cell.location;
      this.displayedMarks.push(cell.mark);
      view.displayFlip(location);
      cell.displayed = true;

      if(this.displayedMarks.length > 1) {
        this.checkMatch();
      }

    },

    countDisplayed : function() {
      return this.displayedMarks.length;
    },

    undisplayCells : function() {

      var grid = this.gridState;
      var that = this;

      for(let i = 0; i < grid.length; i += 1) {
        if(grid[i].mark === this.displayedMarks[0] || grid[i].mark === this.displayedMarks[1]) {
          grid[i].displayed = false;
          setTimeout(function(){
                                view.displayHidden(grid[i].location);
                                that.displayedMarks = []
                                }, 800);
        }
      }
    },

    checkMatch : function() {
      if (this.displayedMarks.allValuesSame()){
        view.printOutput("got one!");
        this.removeClickState();
        this.displayedMarks = [];
        this.found ++;
      }
      else {
        this.undisplayCells();
        view.printOutput("Nope...");
      }
    },

    removeClickState : function() {
      for(let i = 0; i < this.gridState.length; i += 1 ) {
        if(this.gridState[i].displayed) {
          let location = this.gridState[i].location;
          let cell = getE(location);
          cell.onclick = null;
        }
      }
    },

    getCellObject : function(cellLocation) {
      var grid = this.gridState;

      for( let i = 0; i < grid.length; i += 1 ) {
        if(grid[i].location === cellLocation) {
          return grid[i];
        }
      }
      console.log("error at getCellObject --> invalid location passed");
    },

    isWon() {
      if(this.found === this.gridState.length / 2) {
        return true;
      }
      return false;
    },

    gridGeneration: {

      buildGridData: function() {  // the grid function creates the data structor --
        var gridData = document.getElementsByTagName("td");
        var gridStructure = [];
        model.displayedMarks = [];
        model.found = 0;

        for(let i = 0; i < gridData.length; i++) {
          let location = gridData[i].id;
          gridStructure.push(new this.cellConstruct(location, ""));
        }
          model.gridState = gridStructure;
      },

      cellConstruct : function(location, mark) {
        this.location = location;
        this.mark = mark;
        this.displayed = false;
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

      genLocationList : function() {
        var grid = document.getElementsByTagName("td");
        var locationList = [];
        for (let i = 0; i < grid.length; i += 1) {
          locationList.push(grid[i].id);
        }
        return locationList;
      },

      genNumberList : function() { // generates numbers to mark
        var grid = document.getElementsByTagName("td");
        var numberList = [];
        gridSize = grid.length / 2;

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
        var match = {loc1: "", loc2: "", mark: ""};
        var index = that.getRandomIndex(locations);
          match.loc1 = locations[index];
          locations.splice(index, 1);
          //console.log(locations);
          index = that.getRandomIndex(locations);
          match.loc2 = locations[index];
          locations.splice(index, 1);
          //console.log(locations);
          index = that.getRandomIndex(numbers);
          match.mark = numbers[index];
          numbers.splice(index, 1);
          //console.log(numbers);

        return match;
      };
        return makeMatch();
      },

      populateGrid : function(gridSize) {
        var locationList = this.genLocationList();
        var numberList = this.genNumberList();
        for (let i = 0; i < gridSize / 2; i += 1) {
          let match = this.genMatch(locationList, numberList);
          let mark = match.mark;
          this.placeMark(match.loc1, mark);
          this.placeMark(match.loc2, mark);
          //console.log(mark + ", " + match.loc1 + ", " + match.loc2);
        }
      },

      placeMark(location, mark) {
        var grid = model.gridState;
        for(let i = 0; i < grid.length; i += 1) {
          if(grid[i].location === location) {
            grid[i].mark = mark;
            view.displayMark(mark, location);
          }
        }
      },

    }//end of gridPopulationObject
  };

  var controller = {
    processGuess : function(cellLocation) {
      var cellObject = model.getCellObject(cellLocation);

        if(!cellObject.displayed && model.countDisplayed() < 2){
          model.displayCell(cellObject);

          if(model.isWon()) {
            this.restartGame();
          }
        }

    },

    restartGame : function() {
      var table = getE("gamegrid")
      if(confirm("you got them all! wanna play again")) {
        selectionHandler();
      }
    }
  };

  function getE(id) {
    return document.getElementById(id);
  }

  function selectionHandler() {
    var selector = getE("selector");
    var gridSize = selector.value;
    var table = getE("gamegrid")
    table.innerHTML = '';

    model.gridGeneration.genGrid(gridSize);
    model.gridGeneration.buildGridData();
    model.gridPopulation.populateGrid(gridSize);
    initClickGrid();
  }

  function init() {
    var selector = getE("selector");
    selector.onchange = selectionHandler;
  }

  function initClickGrid() {
    var grid  = document.getElementsByTagName("td");
    //console.log(grid);
    for( let i = 0; i < grid.length; i += 1 ) {
      grid[i].onclick = function() {
        controller.processGuess(this.id);
      };
      grid[i].onmouseover = function() {
        view.displayHover(this.id);
      };
      grid[i].onmouseout = function() {
        view.removeHover(this.id);
      };
    }
  }

  api.init = init;
  return api;
}());



window.onload = memoryApp.init;
