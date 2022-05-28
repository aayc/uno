import Phaser from 'phaser';
import { initGame } from "../logic/uno"

export default class Uno extends Phaser.Scene {
  constructor() {
    super('Uno');
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.atlas('cards', 'assets/atlas/uno-front.png', "assets/atlas/uno-front.json")
  }

  create() {
    var frames = this.textures.get('cards').getFrameNames();
    var state = initGame()

    var x = 100;
    var y = 100;

    for (const card of state.draw_pile)
    {
        const cardImage = this.add.image(x, y, 'cards', card.face + card.color)
        cardImage.displayHeight = 200
        cardImage.displayWidth = 150
        cardImage.setInteractive();

        x += 4;
        y += 4;
    }


    this.input.on('gameobjectdown', function (this: any, pointer: any, gameObject: any) {

      //  Will contain the top-most Game Object (in the display list)
      this.tweens.add({
          targets: gameObject,
          x: { value: 1100, duration: 1500, ease: 'Power2' },
          y: { value: 500, duration: 500, ease: 'Bounce.easeOut', delay: 150 }
      });

  }, this);
  }
}
