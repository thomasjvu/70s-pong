import Phaser from "phaser";
import WebFontFile from './WebFontFile.js'

import { Game } from "../consts/SceneKeys.js"
import { PressStart2P } from "../consts/Fonts.js";
import * as AudioKeys from '../consts/AudioKeys.js'

export default class TitleScreen extends Phaser.Scene {

    constructor() {
        super('title-screen')
    }

    preload() {
        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    create() {
        const title = this.add.text(400, 200, "70's Pong", {
            fontFamily: PressStart2P,
            fontSize: '50px'
        });
        title.setOrigin(0.5, 0.5);

        this.add.text(400, 300, 'Press Space to Start', {
            fontFamily: PressStart2P,
        }).setOrigin(0.5, 0.5)

        this.input.keyboard.once('keydown-SPACE', () => {
            this.sound.play(AudioKeys.PongPlop)
            this.scene.start(Game)
        })
    }
}
