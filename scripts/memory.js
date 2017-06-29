var memoryApp = {

  view : {


  },




  model : {
    gridData: [],

    buildGridData: function() {  // the grid function creates the data structor --
      var gridData = document.getElementsByTagName("td");
      var gridStructure = [];

      for(let i = 0; i < gridData.length; i++) {
        let location = gridData[i].id;
        gridStructure.push(new this.cellConstruct(location, false, ""));
      }
        this.gridData = gridStructure;
    },

    cellConstruct : function(location, guessed,letter) {
      this.location = location;
      this.guessed = guessed;
      this.letter = letter;
    },

    genLocation : function(gridSize) {// generates random location on the gameboad
      row = Math.floor(Math.random() * gridSize);
      col = Math.floor(Math.random() * gridSize);
      return row + "" + col;
    },

    --genCharCode : function() { //generates random charcode representing capital letter.
      return Math.floor(Math.random() * 26) + 65;
    },

    --genGrid : function(size) {
      var tableArea = getE("gamegrid");
      var gridSize = Math.sqrt(size);
      var cell;

      for(let i = 0; i < gridSize; i += 1) {
        let tableRow = tableArea.insertRow();
        for(let j = 0; j < gridSize; j +=1) {
          cell = tableRow.insertCell();
          cell.id = i + "" + j;
          cell.setAttribute("class", "hidden");
          //cell.innerHTML = String.fromCharCode(this.genCharCode());
          }
        }
      },

    markCells : function() {
      var usedLetters = [];
      for(let i = 0; i < this.gridData.length; i++) {
        do{
          let letter = this.genCharCode();
        }while(usedLetters.indexOf(letter) >= 0);

      }
    },

    checkIfMarked : function(location) {

    },

    checkLetter : function(letter) {
      for(let i = 0; i < this.gridData.length; i += 1) {
        if(letter === this.gridData[i].letter) {
          return true;
        }
      }
      return false;
    }
  };



  controller : {

  }

};
function getE(id) {
  return document.getElementById(id);
}

function selectionHandler() {
  var selector = getE("selector");
  var gridSize = selector.value;
  memoryApp.model.genGrid(gridSize);
  memoryApp.model.buildGridData();
}

function init() {
  var selector = getE("selector");
  selector.onchange = selectionHandler;
}

window.onload = init;
