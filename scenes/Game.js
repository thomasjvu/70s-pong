import Phaser from "phaser";

import * as Colors from "../consts/Colors.js";
import { GameBackground, GameOver } from "../consts/SceneKeys.js";
import * as AudioKeys from "../consts/AudioKeys";

import { PressStart2P } from "../consts/Fonts.js";

const gameState = {
    running: "running",
    playerWon: "player-won",
    cpuWon: "cpu-won",
};

class Game extends Phaser.Scene {
    init() {
        this.gameState = gameState.running;
        this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0);

        this.leftScore = 0;
        this.rightScore = 0;
    }

    preload() {}

    create() {
        // create background
        this.scene.run(GameBackground);
        this.scene.sendToBack(GameBackground);

        // create world
        this.physics.world.setBounds(-100, 0, 1000, 500);

        // create ball
        this.ball = this.add.circle(400, 250, 10, Colors.White, 1);
        this.physics.add.existing(this.ball);
        this.ball.body.setCircle(10, 0, 0);
        this.ball.body.setBounce(1, 1);
        this.ball.body.setMaxSpeed(2000)

        // world physics
        this.ball.body.setCollideWorldBounds(true, 1, 1);
        this.ball.body.onWorldBounds = true
        this.physics.world.on('worldbounds', this.handleBallWorldBoundsCollision, this)

        // create player paddle
        this.paddleLeft = this.add.rectangle(50, 250, 20, 100, Colors.White, 1);
        this.physics.add.existing(this.paddleLeft, true);
        this.physics.add.collider(this.paddleLeft, this.ball, this.handlePaddleBallCollision, undefined, this);

        // create CPU paddle
        this.paddleRight = this.add.rectangle(750, 250, 20, 100, Colors.White, 1);
        this.physics.add.existing(this.paddleRight, true);
        this.physics.add.collider(this.paddleRight, this.ball, this.handlePaddleBallCollision, undefined, this);

        // create scoreboard
        const scoreStyle = {
            fontSize: 24,
            fontFamily: PressStart2P,
        };

        this.leftScoreLabel = this.add.text(300, 125, `YOU: ${this.leftScore}`, scoreStyle).setOrigin(0.5, 0.5);

        this.rightScoreLabel = this.add.text(500, 375, `CPU: ${this.rightScore}`, scoreStyle).setOrigin(0.5, 0.5);

        // add input controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // add ball
        this.time.delayedCall(1000, () => {
            this.resetBall();
        });
    }

    update() {
        if (this.paused || this.gameState !== gameState.running) {
            return;
        }

        this.processPlayerInput();
        this.updateAI();
        this.checkScore();
    }

    processPlayerInput() {
        /** @type {Phaser.Physics.Arcade.StaticBody} */
        const body = this.paddleLeft.body;

        if (this.cursors.up.isDown) {
            this.paddleLeft.y -= 10;
            body.updateFromGameObject();
            // Add Pseudo World Boundaries
            // if (this.paddleLeft.y >= 50) {
            //     this.paddleLeft.y = 50
            // }
        } else if (this.cursors.down.isDown) {
            this.paddleLeft.y += 10;
            body.updateFromGameObject();
            // Add Pseudo World Boundaries
            // if (this.paddleLeft.y >= 50) {
            //     this.paddleLeft.y = 50
            // }
        }
    }

    checkScore() {
        const x = this.ball.x;
        const leftBounds = -30;
        const rightBounds = 830;

        if (x >= leftBounds && x <= rightBounds) {
            return;
        }

        // score on right side
        if (this.ball.x < -30) {
            this.incrementRightScore();
        }
        // score on left side
        else if (this.ball.x > 830) {
            this.incrementLeftScore();
        }

        const maxScore = 5;
        // player wins
        if (this.leftScore >= maxScore) {
            console.log("player wins");
            this.gameState = gameState.playerWon;
        }
        // CPU wins
        if (this.rightScore >= maxScore) {
            console.log("cpu wins");
            this.gameState = gameState.cpuWon;
        }

        if (this.gameState === gameState.running) {
            this.resetBall();
        } else {
            this.physics.world.remove(this.ball.body);

            this.scene.stop(GameBackground);

            // Show gameover scene
            this.scene.start(GameOver, {
                leftScore: this.leftScore,
                rightScore: this.rightScore,
            });
        }
    }

    handlePaddleBallCollision(paddle, ball) {
        this.sound.play(AudioKeys.PongBeep);

        /** @type {Phaser.Physics.Arcade.Body} */
        const body = this.ball.body
        const vel = this.ball.body.velocity
        vel.x *= 1.25
        vel.y *= 1.25

        body.setVelocity(vel.x, vel.y)
    }

    handleBallWorldBoundsCollision(body, up, down, left, right) {

        // disallow
        if (left || right) return

        this.sound.play(AudioKeys.PongPlop);
    }

    updateAI() {
        const diff = this.ball.y - this.paddleRight.y;

        if (Math.abs(diff) < 10) {
            return;
        }

        // AI Config
        const aiSpeed = 10;
        if (diff < 0) {
            // ball is above the paddle
            this.paddleRightVelocity.y = -aiSpeed;
            if (this.paddleRightVelocity.y < -10) {
                this.paddleRightVelocity.y = -10;
            }
        } else if (diff > 0) {
            // ball is below the paddle
            this.paddleRightVelocity.y = aiSpeed;
            if (this.paddleRightVelocity.y > 10) {
                this.paddleRightVelocity.y = 10;
            }
        }

        this.paddleRight.y += this.paddleRightVelocity.y;
        this.paddleRight.body.updateFromGameObject();
    }

    incrementLeftScore() {
        this.leftScore += 1;
        this.leftScoreLabel.text = `You: ${this.leftScore}`;
    }

    incrementRightScore() {
        this.rightScore += 1;
        this.rightScoreLabel.text = `CPU: ${this.rightScore}`;
    }

    resetBall() {
        this.ball.setPosition(400, 250);

        let angle = Phaser.Math.Between(0, 360);

        if (angle >= 90 || angle <= 270) {
            angle = Phaser.Math.Between(0, 360);
        }

        const vec = this.physics.velocityFromAngle(angle, 300);

        this.ball.body.setVelocity(vec.x, vec.y);
    }
}

export default Game;
