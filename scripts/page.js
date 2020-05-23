////  Page-scoped globals  ////

// Counters
let throwingItemIdx = 1;

// Size Constants
const FLOAT_1_WIDTH = 149;
const FLOAT_2_WIDTH = 101;
const FLOAT_SPEED = 2;
const PERSON_SPEED = 25;
const OBJECT_REFRESH_RATE = 50;  //ms
const SCORE_UNIT = 100;  // scoring is in 100-point units

// Size vars
let maxPersonPosX, maxPersonPosY;
let maxItemPosX;
let maxItemPosY;

// Global Window Handles (gwh__)
let gwhGame, gwhStatus, gwhScore;

// Global Object Handles
let player;
let paradeRoute;
let paradeFloat1;
let paradeFloat2;
let paradeTimer;
let collisionDetected;
let itemNumber = 1;
let score = 0;
let beadsCount = 0;
let candyCount = 0;

/*
 * This is a handy little container trick: use objects as constants to collect
 * vals for easier (and more understandable) reference to later.
 */
const KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  shift: 16,
  spacebar: 32
};

let createThrowingItemIntervalHandle;
let currentThrowingFrequency = 2000;

////  Functional Code  ////

// Main
$(document).ready( function() {
  setTimeout(function () {
    console.log("Ready!");

    maxItemPosX = $('.game-window').width() - 50;
    maxItemPosY = $('.game-window').height() - 40;
    // Set global handles (now that the page is loaded)
    gwhGame = $('#actualGame');
    gwhStatus = $('.status-window');
    gwhScore = $('#score-box');
    player = $('#player');  // set the global player handle
    paradeRoute = $("#paradeRoute");
    paradeFloat1 = $("#paradeFloat1");
    paradeFloat2 = $("#paradeFloat2");

    // Set global positions
    maxPersonPosX = $('.game-window').width() - player.width();
    maxPersonPosY = $('.game-window').height() - player.height();

    $(window).keydown(keydownRouter);
    
    // Periodically check for collisions
    setInterval( function() {
      checkCollisions();
    }, 100);

    startParade();

    createThrowingItemIntervalHandle = setInterval(createThrowingItem, currentThrowingFrequency);
  }, 3000);
  
});


function keydownRouter(e) {
  switch (e.which) {
    case KEYS.shift:
      break;
    case KEYS.spacebar:
      break;
    case KEYS.left:
    case KEYS.right:
    case KEYS.up:
    case KEYS.down:
      movePerson(e.which);
      break;
    default:
      console.log("Invalid input!");
  }
}

function checkCollisions() {
  if (willCollide(paradeFloat2, player, PERSON_SPEED, 0)) {
    collisionDetected = true;
  } else {
    collisionDetected = false;
  }
}

function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

function willCollide(o1, o2, o1_xChange, o1_yChange){
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

function isOrWillCollide(o1, o2, o1_xChange, o1_yChange){
  const o1D = { 'left': o1.offset().left + o1_xChange,
        'right': o1.offset().left + o1.width() + o1_xChange,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = { 'left': o2.offset().left,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top,
        'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  //console.log(o1D.left, o2D.right);
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
     // collision detected!
     return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max){
  return (Math.random() * (max - min)) + min;
}

function createThrowingItem(){
  if (itemNumber % 3 != 0) {
    document.getElementById('actualGame').insertAdjacentHTML('afterbegin', createItemDivString(itemNumber, "beads", "beads.png"));
  } else { 
    document.getElementById('actualGame').insertAdjacentHTML('afterbegin', createItemDivString(itemNumber, "candy", "candy.png"));
  }
  // need these, follows alligator
  document.getElementById("i-" + itemNumber).style.marginLeft = parseInt(paradeFloat2.css('left'));
  document.getElementById("i-" + itemNumber).style.marginTop = 225;
  updateThrownItemPosition(document.getElementById("i-" + itemNumber), itemNumber);
  ++itemNumber;
}

// throwingItemIdx - index of the item (a unique identifier)
// type - beads or candy
// imageString - beads.png or candy.png
function createItemDivString(itemIndex, type, imageString){
  return "<div id='i-" + itemIndex + "' class='throwingItem " + type + "'><img src='img/" + imageString + "'/></div>";
}

function updateThrownItemPosition(elementObj, itemIndex){
  // console.log($(elementObj));
  // console.log(player);
  let start = Date.now(); // remember start time
  let direction = Math.round(getRandomNumber(1, 6));
  let timer = setInterval(function() {
    // how much time passed from the start?
    let timePassed = Date.now() - start;
    let end = getRandomNumber(500, 2000);

    if (timePassed >= end) {
      clearInterval(timer); 
      return;
    }
  
    // draw the animation at the moment timePassed
    
    if (direction == 1) { // lower right
      elementObj.style.left = timePassed / 5 + 'px';
      elementObj.style.top = timePassed / 5 + 'px';
    } else if (direction == 2) { // lower left
      elementObj.style.left = -timePassed / 5 + 'px';
      elementObj.style.top = timePassed / 5 + 'px';
    } else if (direction == 3) { // upper right
      elementObj.style.left = timePassed / 5 + 'px';
      elementObj.style.top = -timePassed / 5 + 'px';
    } else if (direction == 4) { // upper left
      elementObj.style.left = -timePassed / 5 + 'px';
      elementObj.style.top = -timePassed / 5 + 'px';
    } else if (direction == 5) { // top
      elementObj.style.top = -timePassed / 5 + 'px';
    } else if (direction == 6) { // bot
      elementObj.style.top = timePassed / 5 + 'px';
    }

  
  }, 20);
  
  let type;
  if (itemIndex % 3 == 0) {
    type = "candy";
  } else {
    type = "beads";
  }

  graduallyFadeAndRemoveElement($( "#i-" + itemNumber ), elementObj, type);
}

function graduallyFadeAndRemoveElement(elementObj, thrown, type){
  //console.log(document.getElementById('score-box').innerHTML);
  //console.log(elementObj);
  //thrown.style.backgroundColor = 'red';
  let collected = false;
  let start = Date.now();
  let timer = setInterval(function(){
    let timePassed = Date.now() - start;

    if (timePassed >= 5000) {
      clearInterval(timer);
      let startFade = Date.now();
      let timerFade = setInterval(function(){
        let timerPassedFade = Date.now() - startFade;
        if (timerPassedFade >= 2000) {
          clearInterval(timerFade);
          return;
        }
        if (isColliding(player, $(elementObj))) {
          //console.log("collectingFadingElement");
          thrown.style.backgroundColor = 'yellow';
          collected = true;
          clearInterval(timerFade);
          thrown.style.backgroundColor = 'yellow';
          score += 100;
          document.getElementById('score-box').innerHTML = score;
          if (type == "beads") 
            beadsCount += 1;
          if (type == "candy")
            candyCount += 1;
          document.getElementById('beadsCounter').innerHTML = beadsCount;
          document.getElementById('candyCounter').innerHTML = candyCount;
        }
      });
      // Fade to 0 opacity over 2 seconds
      elementObj.fadeTo(2000, 0, function(){
        $(this).remove();
      });
      return;
    }

    if(isColliding(player, $(elementObj))) {
      //console.log("collecting");
      collected = true;
      clearInterval(timer);
      thrown.style.backgroundColor = 'yellow';
      elementObj.fadeTo(1000, 0, function(){
        $(this).remove();
      });
      score += 100;
      document.getElementById('score-box').innerHTML = score;
      if (type == "beads") 
        beadsCount += 1;
      if (type == "candy")
        candyCount += 1;
      document.getElementById('beadsCounter').innerHTML = beadsCount;
      document.getElementById('candyCounter').innerHTML = candyCount;
      return;
    }

  }, 20);  
}

function startParade(){
  console.log("Starting parade...");
  paradeTimer = setInterval( function() {
      if (!collisionDetected) {
        // (Depending on current position) update left value for each parade float
        let newPos1 = parseInt(paradeFloat1.css('left')) + FLOAT_SPEED;
        let newPos2 = parseInt(paradeFloat2.css('left')) + FLOAT_SPEED;
        if (newPos1 > 500) {
          newPos1 = -300;
          newPos2 = -150;
        }
        paradeFloat1.css('left', newPos1);
        paradeFloat2.css('left', newPos2);
    }
  }, OBJECT_REFRESH_RATE);
}

// Handle player movement events
function movePerson(arrow) {
  
  switch (arrow) {
    case KEYS.left: { // left arrow
      let newPos = parseInt(player.css('left'))-PERSON_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      if (!willCollide(player, paradeFloat2, -PERSON_SPEED, 0))
        player.css('left', newPos);
      break;
    }
    case KEYS.right: { // right arrow
      let newPos = parseInt(player.css('left'))+PERSON_SPEED;
      if (newPos > maxPersonPosX) {
        newPos = maxPersonPosX;
      }
      if (!willCollide(player, paradeFloat1, PERSON_SPEED, 0))
        player.css('left', newPos);
      break;
    }
    case KEYS.up: { // up arrow
      let newPos = parseInt(player.css('top'))-PERSON_SPEED;
      if (newPos < 0) {
        newPos = 0;
      }
      if (!willCollide(player, paradeFloat1, 0, -PERSON_SPEED) && !willCollide(player, paradeFloat2, 0, -PERSON_SPEED))
        player.css('top', newPos);
      break;
    }
    case KEYS.down: { // down arrow
      let newPos = parseInt(player.css('top'))+PERSON_SPEED;
      if (newPos > maxPersonPosY) {
        newPos = maxPersonPosY;
      }
      if (!willCollide(player, paradeFloat1, 0, +PERSON_SPEED) && !willCollide(player, paradeFloat2, 0, +PERSON_SPEED))
        player.css('top', newPos);
      break;
    }
  }
}

function showSettings() {
  document.getElementById("throwSpeed").value = currentThrowingFrequency;
  document.getElementById("settings").style.display = "block";
  document.getElementById("panel").style.display = "none";
}

function saveSettings() {
  temp = document.getElementById("throwSpeed").value;
  if (isNaN(temp) || temp < 100) {
    alert("Frequency must be a number greater than or equal to 100");
  } else {
    currentThrowingFrequency = temp;
    startNewInterval();
    document.getElementById("settings").style.display = "none";
    document.getElementById("panel").style.display = "inline-block";
  }
}

function discardSettings() {
  document.getElementById("settings").style.display = "none";
  document.getElementById("panel").style.display = "inline-block";
}

function startNewInterval() {
  clearInterval(createThrowingItemIntervalHandle);
  createThrowingItemIntervalHandle = setInterval(createThrowingItem, currentThrowingFrequency);
}

function splash() {
  setTimeout(function () {
    $('.splashScreen').hide();
  }, 3000);
}