import Phaser from "phaser";
import * as Colors from '../consts/Colors.js'

export default class GameBackground extends Phaser.Scene
{
    preload() {

    }

    create() {
        this.add.line(400, 250, 0, 0, 0, 500, Colors.White, 1).setLineWidth(3, 3)
        this.add.circle(400, 250, 30, Colors.White, 0).setStrokeStyle(5, Colors.White, 1)
    }

}
