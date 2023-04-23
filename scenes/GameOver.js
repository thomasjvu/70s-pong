import Phaser from "phaser";
import { TitleScreen } from "../consts/SceneKeys.js";
import { PressStart2P } from "../consts/Fonts.js";

export default class Gameover extends Phaser.Scene {
    constructor() {
        super("game-over");
    }
    /**
     *
     * @param {{ leftScore: Number, rightScore: Number}}
     */
    create(data) {
        console.dir(data);

        let titleText = "Game Over";

        if (data.leftScore > data.rightScore) {
            titleText = "You Win!";
        }

        this.add
            .text(400, 200, titleText, {
                fontFamily: PressStart2P,
                fontSize: 38,
            })
            .setOrigin(0.5);

        this.add.text(400, 300, "Press Space to Play Again", {
            fontFamily: PressStart2P,
        }).setOrigin(0.5)

        this.add.text(400, 420, `You: ${data.leftScore}, CPU: ${data.rightScore}`, {
            fontFamily: PressStart2P,
        }).setOrigin(0.5)

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(TitleScreen)
        })
    }
}
