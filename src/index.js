import * as PIXI from 'pixi.js';
import Bump from 'bump.js';

import Player from './Player.js';
import Alien from './Alien.js';
import controller from './controller.js';
import setInfoMessages from './setInfoMessages.js';

const bump = new Bump(PIXI);

let renderer = PIXI.autoDetectRenderer(1000, 500);
renderer.backgroundColor = 0x897A20;
document.body.appendChild(renderer.view);

let stage = new PIXI.Container(); //Main stage container

let startPage = new PIXI.Container(); //Pause/Menu stage
stage.addChild(startPage);

let gameScene = new PIXI.Container(); //Game stage
gameScene.visible = false;
stage.addChild(gameScene);

let player, aliens = [], bullets = []; //Entities
let message = new PIXI.Text();
let state, loopNumber = 0;

setup();

function setup() {
  gameScene.interactive = true;
  player = new Player(renderer, gameScene, bullets);
  setInfoMessages(startPage, message, renderer);
  controller(togglePause);
  state = start;
  gameLoop();
}

function gameLoop() {
  requestAnimationFrame(gameLoop); //Loop this function at 60 frames per second
  state();
  renderer.render(stage);
}

function play() {
  player.move();

  for (let alien of aliens) {
    if (bump.hit(player, alien)) {
      message.text = "Game over";
      showPauseScene();
      restart();
    }
    for (let bullet of bullets) {
      if (bump.hit(bullet, alien)) {
        alien.destroy();
        bullet.destroy();
      }
      else {
        bullet.move();
      }
    }
    if (alien.visible) {
        alien.move();
    }
  }

  if (loopNumber === 100) {
    new Alien(renderer, gameScene, aliens);
    loopNumber = 0;
  }
  loopNumber++;
}

function pause() {}
function start() {}

function togglePause() {
  if (state === play) {
    showPauseScene();
  }
  else if (state === pause || state === start) {
    showGameScene();
  }
}

function restart() {
  player.restart();
  for (let i=aliens.length; i--; i>=0) {
    aliens[i].destroy();
  }
}

function showGameScene() {
  state = play;
  gameScene.visible = true;
  startPage.visible = false;
}

function showPauseScene() {
  state = pause;
  gameScene.visible = false;
  startPage.visible = true;
}