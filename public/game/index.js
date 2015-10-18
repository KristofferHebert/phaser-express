var CONFIG = {
    screen: {
      w: 600,
      h: 850,
    },
    margin: {
        up: 120,
        down: 130,
        left: 76,
        right: 76
    },
    player : {
        speed: 5
    }
}

var game = new Phaser.Game(CONFIG.screen.w, CONFIG.screen.h, Phaser.AUTO, 'game', {
  preload: preload,
  create: create,
  update: update
})

var effects = {}

function preload() {
  console.log("PRELOAD")

  game.load.spritesheet('player', '/game/spaceman.png', 16, 16)
  game.load.spritesheet('redpotion', '/game/red-potion.png', 32, 32)
  game.load.spritesheet('greenpotion', '/game/green-potion.png', 32, 32)
  game.load.spritesheet('yellowpotion', '/game/yellow-potion.png', 32, 32)

  game.load.atlas('breakout', '/game/games/breakout/breakout.png', 'game/games/breakout/breakout.json')

  game.load.image('bg', '/game/bg.gif')

  //  Firefox doesn't support mp3 files, so use ogg
  game.load.audio('music', ['/game/main.mp3', '/game/main.ogg'])
  game.load.audio('getpotion',['/game/coin.wav'])
}

var player
var potions

var score = 0

var scoreText
var livesText
var timeText

var playTime = 2 //in minutes
var currentTime = "1:00"

var potionTypes = ["green", "yellow", "red"]

var potiongetsound
var s
var music

var potion

function generatePotions(potion){
    for (var i = 0; i < 10; i++) {
      var num = getRandomInt(1, 2)
      var minX = CONFIG.margin.left
      var maxX = CONFIG.screen.w - CONFIG.margin.left
      var randomX = getRandomInt(minX, maxX)
      var minY = CONFIG.margin.up
      var maxY = CONFIG.screen.h - CONFIG.margin.down
      var randomY = getRandomInt(minY, maxY)
      var potionType = potionTypes[num - 1] + 'potion'

      potion = potions.create(randomX, randomY, potionType)
      potion.body.bounce.set(1)
      potion.body.immovable = true
      potion.type = potionTypes[num - 1]
    }

    potion = potions.create(randomX, randomY, 'redpotion')
    potion = potions.create(randomX, randomY, 'redpotion')
    potion = potions.create(randomX, randomY, 'redpotion')

    return potion
}

function create() {
  console.log("CREATE")

  game.physics.startSystem(Phaser.Physics.ARCADE)
  game.add.tileSprite(0, 0, 600, 850, 'bg')

  game.stage.backgroundColor = '#000000'

  //play music
  music = game.add.audio('music', true)
  music.loop = true
  music.play()
  music.volume -= 0.5

  potiongetsound = game.add.audio('getpotion', true)

  // NOTE: Drug Setup
  potions = game.add.group()
  potions.enableBody = true
  potions.physicsBodyType = Phaser.Physics.ARCADE

  generatePotions(potion)


  // NOTE: Player Setup
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'player', 1)

  left = player.animations.add('left', [8, 9], 10, true)
  right = player.animations.add('right', [1, 2], 10, true)
  player.animations.add('up', [11, 12, 13], 10, true)
  player.animations.add('down', [4, 5, 6], 10, true)

  left.enableUpdate = true
  right.enableUpdate = true

  game.physics.enable(player, Phaser.Physics.ARCADE)
  player.body.collideWorldBounds = true
  player.body.bounce.set(1)

  player.anchor.setTo(0.5, 0.5)

  player.scale.setTo(4, 4)

  // NOTE: Score Text Setup

  scoreText = game.add.text(20, 805, 'score: 0', {
    font: "20px Arial",
    fill: "#ffffff",
    align: "left"
  })

  startTimer(60 * playTime)

  timeText = game.add.text(460, 805, 'Time Left ' + currentTime, {
    font: "20px Arial",
    fill: "#ffffff",
    align: "center"
  })

  endgameText = game.add.text(game.world.centerX, 400, '- Start Moving! -', {
    font: "40px Arial",
    fill: "#ffffff",
    align: "center"
  })
  endgameText.anchor.setTo(0.5, 0.5)
  startTimer(60 * playTime)

}

/**
  Return random Color
*/
function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('')
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

var moving = false

function update() {
  // Check is left and is in bound
  // console.log(player.x)
  // console.log(player.y)
  // player.body.velocity.set(0)

  moving = false

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && player.x > CONFIG.margin.left) {
    player.x -= CONFIG.player.speed
    player.play('left')
    moving = true
} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && player.x < CONFIG.screen.w - CONFIG.margin.right) {
    player.x += CONFIG.player.speed
    player.play('right')
    moving = true
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && player.y > CONFIG.margin.up) {
    player.y -= CONFIG.player.speed
    player.play('up')
    moving = true
} else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && player.y < CONFIG.screen.h - CONFIG.margin.down) {
    player.y += CONFIG.player.speed
    player.play('down')
    moving = true
  }

  if (moving) {
    playerMoved()
  } else {
    player.animations.stop()
  }

  game.physics.arcade.overlap(player, potions, playerHitpotion, null, this)

  //timeText.text = 'Time Left: ' + currentTime

}

function gameOver() {
  console.log('Called gameOver')
  // endgameText.text = "- Game Over! -"
  // endgameText.visible = true

  // TODO: add end of game shit


}

function playerHitpotion(_player, _potion) {

  effects[_potion.type]()
  _potion.kill()

  score += 10

  scoreText.text = 'score: ' + score
  potiongetsound.play()

  //  Are they any potions left?
  if (potions.countLiving() === 0) {
    //  New level starts
    score += 1000
    scoreText.text = 'score: ' + score
    // introText.text = '- Next Level -'

    //  And bring the potions back from the dead :)
    //potions.callAll('revive')
    generatePotions(potion)
  }
}

// Drug Effects



effects = {
    "red": function red() {
      CONFIG.player.speed = 3
    },
    "yellow": function yellow() {

      CONFIG.player.speed = (CONFIG.player.speed > 4) ? CONFIG.player.speed -= 1 : 1

    },
    "green": function green() {
      CONFIG.player.speed *= 1.5
    }
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function playerMoved() {
  endgameText.visible = false
}

var outOfTime = false
// timer function
function startTimer(duration) {
  var timer = duration,
    minutes, seconds

  setInterval(function() {
    if (!outOfTime) {
      console.log("RUNNING!!")
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10)

      minutes = minutes < 10 ? "0" + minutes : minutes
      seconds = seconds < 10 ? "0" + seconds : seconds

      currentTime = minutes + ":" + seconds

      if (--timer < 0) {
        // timer = duration
        console.log("done!")
        outOfTime = true
        gameOver()
      }
    }
  }, 1000)
  // }, 1000)
}
