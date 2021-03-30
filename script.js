//load boards
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

  //create variables
  var timer;
  var timeRemaining;
  var lives;
  var selectedNum;
  var selectedTile;
  var disableSelect;

  window.onload = function(){
      // runs startGame function when button is clicked
        id("start-btn").addEventListener("click", startGame);

      //add event listener to the numbers
      for (let i = 0 ; i < id("number-container").children.length; i++){
        id("number-container").children[i].addEventListener("click", function(){
          //if selecting is not disabled
          if(!disableSelect){
            //if number is already selected
            if(this.classList.contains("selcted")){
              // remove the selection
              this.classList.remove("selected");
              selectedNum=null;
              }
              else{
                //when we select a number - deselect all other numbers 
                for ( let i=0; i < 9 ; i++){
                  id("number-container").children[i].classList.remove("selected");
                }

                //update the selectedNum var with the selected number
                this.classList.add("selected");
                selectedNum=this;
                updateMove();
              }
            }
          });
      }
  }

function startGame() {
    //choose difficulty
    var board;
    if (id("diff-1").checked) board=easy[0];
    else if (id("diff-2").checked) board=medium[0];
    else board=hard[0];

   // set lives to 5 and enable selecting numbers and tiles
   lives=5;
   disableSelect = false;
   id("lives").textContent= "Lives Remaining: " +lives;
   
   //create board based on difficulty
   generateBoard(board); 

   //start the timer
   startTimer();

   //show the number-container
   id("number-container").classList.remove("hidden");



   //set theme based on user selection
   if (id("theme-1").checked){
     qs("body").classList.remove("dark");
   }
   else{
    qs("body").classList.add("dark");
   }
}

function startTimer() {
  //set time remaining based on user selection
if (id("time-1").checked) timeRemaining = 180;
else if (id("time-2").checked) timeRemaining = 300;
else timeRemaining = 600;

//set timer for first second
  id("timer").textContent = timeConversion(timeRemaining);

//set timer to update every second
timer = setInterval(function(){
  timeRemaining--;

  //end the game when time ends
  if (timeRemaining === 0) endGame();
  id("timer").textContent = timeConversion(timeRemaining);},1000);

}
  
//display time in mm:ss format
function timeConversion(time) {
  let minutes = Math.floor(time /60);
  if(minutes < 10 ) minutes = "0" + minutes;

  let seconds = time % 60;
  if (seconds<10) seconds = "0" + seconds;

  return minutes + ":" + seconds;

}


function generateBoard(board) {
    //clear previous board
    clearPrevious();
    
    let idCount=0;
    //create the tiles
    for (let i = 0; i < 81; i++) {
        //create new paragraph element
        let tile= document.createElement("p");
        //if tile is not supposed to be blank:
        if (board.charAt(i) != "-"){
            tile.textContent= board.charAt(i);
        }
        else{
            //add click event listener to tile
            tile.addEventListener("click", function(){
              //if selecting is not disabled
              if(!disableSelect){
                //if the tile is already selected
                if(tile.classList.contains("selected")){
                  //remove the selection
                  tile.classList.remove("selected");
                  selectedTile = null;
                }
                else{
                  //deselect all other tiles
                  for(let i=0; i < 81; i++){
                    qsa(".tile")[i].classList.remove("selected");
                  }
                  
                  //add selection and update variable
                  tile.classList.add("selected");
                  selectedTile=tile;
                  updateMove();

                }
              }
            });
        }
        
        //assign tile id
        tile.id=idCount;
        
        //increment tile id for the next tile
        idCount++;

        //add a class to all tiles
        tile.classList.add("tile");

        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)){
            tile.classList.add("bottomBorder");
        }

        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6){
            tile.classList.add("rightBorder");
        }

        //add tiles to the board
        id("board").appendChild(tile);    
    }
}

function updateMove() {
  //if a tile and a number is selceted
  if(selectedTile && selectedNum) //checks if both are not null
  {
    //set the tile to the correct number
    selectedTile.textContent = selectedNum.textContent;
    // if selected num is corresponding to solution key
    if(checkCorrect(selectedTile)){
      //deselect the tiles
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");

      //clear the selected variables
      selectedNum = null;
      selectedTile = null;

      //check if all the board is completed
      if (checkDone()) {
        endGame();}
    }
    //if the number doesn't match the solution key:
    else {
      //disable selecting new numbers for 1 second
      disableSelect=true;
      //turn the tile color to red
      selectedTile.classList.add("incorrect");
      //set it to 1 second
      setTimeout(function(){
        //decrease lives by 1
        lives--;
        //and if no lives left - end the game
        if(lives===0){ endGame();}
        
        else{
        //if there are still lives left
          id("lives").textContent = "Lives Remaining" +" "+ lives;
        //re-enable selecting nums and tile
          disableSelect = false;
        }
        //remove red color from tile and remove the selection of num and tile
          selectedTile.classList.remove("incorrect");
          selectedTile.classList.remove("selected");
          selectedNum.classList.remove("selected");

          //clear the tile text and the variables
          selectedTile.textContent="";
          selectedTile = null;
          selectedNum = null;
      }, 1000);
    }
  }
}

function checkDone() {
  let tiles = qsa(".tile");

  for (let i=0; i < tiles.length; i++){
    if (tiles[i].textContent=== "") return false;
  }
  return true;
}


function endGame() {
  //disable moves and stop the timer
  disableSelect = true;
  clearTimeout(timer);

  //display win or loss message
  if(lives === 0 || timeRemaining === 0){
    id("lives").textContent= "Game over!";
  }
  else{
    id("lives").textContent= "Congratulations You won!!";
  }

}

function checkCorrect(tile) {
  //set solution based on difficulty selection
  if (id("diff-1").checked) solution = easy[1];
  else if (id("diff-2").checked) solution = medium[1];
  else solution = hard[1];

  //check if the number in tile is correct
  if (solution.charAt(tile.id)===tile.textContent) return true;
  else return false;
}

function  clearPrevious(){
  //access all tiles
    let tiles=qsa(".tile");

    //clear tiles
    for (let i= 0; i < tiles.length; i++){
      tiles[i].remove();
    }

      //clear timer
      if(timer) clearTimeout(timer);

      //de-select numbers
      for (let i =0; i<id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");   
      }

     //clear selected variables
     selectedTile=null;
     selectedNum=null;
    }



// helper functions
  function id(id) {
    return document.getElementById(id);
  }

  function qs(selector){
    return document.querySelector(selector);
}

function qsa(selector){
  return document.querySelectorAll(selector);
}