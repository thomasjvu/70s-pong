import Phaser from "phaser";

import Preload from "./scenes/Preload.js"
import TitleScreen from "./scenes/TitleScreen.js";
import Game from "./scenes/Game.js";
import GameBackground from "./scenes/GameBackground.js"
import GameOver from "./scenes/GameOver.js"

import * as SceneKeys from './consts/SceneKeys.js'

const config = {
    width: 800,
    height: 500,
    type: Phaser.AUTO,
    backgroundColor: "black",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            // debug: true
        },
    },
};

const game = new Phaser.Game(config);

game.scene.add(SceneKeys.TitleScreen, TitleScreen);
game.scene.add(SceneKeys.Game, Game);
game.scene.add(SceneKeys.GameBackground, GameBackground)
game.scene.add(SceneKeys.GameOver, GameOver)
game.scene.add(SceneKeys.Preload, Preload)

game.scene.start(SceneKeys.Preload)
// game.scene.start(SceneKeys.Game);
