(function () {
    const canvas = document.querySelector('#game');
    const ctx = canvas.getContext('2d');    
    const global = {
        theme: new Audio('./audio/theme.mp3'),
        jumpSound: new Audio('./audio/jump.mp3'),
        damageSound: new Audio('./audio/damage.wav'),
        spawnSound: new Audio('./audio/spawn.mp3'),
        PLAYER_WIDTH: 155,
        PLAYER_HEIGHT: 77,
        PLAYER_START_X: 15,
        PLAYER_START_Y: canvas.height-80,
        PLAYER_JUMP_LIMIT: 40,
        INITIAL_FALL_SPEED: 1,
        INITIAL_JUMP_SPEED: 2,
        INITIAL_GAME_SPEED: 5,
        bgImg: new Image(),
        bgFrames: [],
        gameSpeed: 5,
        jumping: false,
        falling: false,
        jumpSpeed: 2,
        jumpAcceleration: .8,
        fallSpeed: 1,
        fallAcceleration: .3,
        cactus: [],
        clouds: [],
        cactiSpawnCounter: 0,
        cactiInterval: 200,
        playerImgCounter: 0,
        gameSpeedCounter: 0,
        cloudCounter: 0,
        gameScore: 0,
        isPlaying: false,
        gameOverMenu: false,
        splashPageOpen: true,
        sx: null,
        sy: null,
        sWidth: null,
        sHeight: null,
        dx: null,
        dy: null,
        dWidth: null,
        dHeight: null,
    }
    const handleSplashPageClick = () => {
        const splash = document.querySelector('.splash');
        splash.remove();
        global.isPlaying = true;
        global.theme.play();
        global.spawnSound.play();
        global.spawnSound.volume = .05;
        global.theme.loop = true;
        global.theme.volume = .05;
        global.splashPageOpen = false;
    }
    const generateSplashPage = () => {
        const splash = document.createElement('div');
        splash.classList.add('splash');
        const wrapper = document.querySelector('.wrapper');
        wrapper.appendChild(splash);
        splash.addEventListener('click', handleSplashPageClick);
    }

    
    if(window.innerWidth < 800 || window.innerHeight < 800) {
        const canvas = document.querySelector('#game');
        canvas.style.border = 'none';
        alert('This game is meant for devices with at least 800x800 screen resolution.')
    } else {
        generateSplashPage();


window.addEventListener('keydown', (e)=>{
    if(e.keyCode === 32 && player.y === global.PLAYER_START_Y && global.isPlaying) {
        global.jumping = true;
        global.jumpSound.volume = .1;
        global.jumpSound.play();
    }
})

class Player {
    constructor (x,y,width,height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = new Image();
        this.sprite.src = "./images/sprite-sheet.png";
    }

    draw () {
        let rl = global.rapidLegs;
        global.dWidth = this.width;
        global.dHeight = this.height;
        global.dx = this.x;    
        global. dy = this.y;
        if(this.y === global.PLAYER_START_Y) {
        if(global.isPlaying) global.playerImgCounter++;
        if(global.playerImgCounter < 3+rl) {
            global.sx = 10;
            global.sy = -4;
            global.sWidth = this.width;
            global.sHeight = this.height;
        } else if (global.playerImgCounter > 3 && global.playerImgCounter < 6) {
            global.sx = 193;
            global.sy = -1;
            global.sWidth = this.width;
            global.sHeight = this.height;
        } else if (global.playerImgCounter > 6 && global.playerImgCounter < 9) {
            global.sx = 387;
            global.sy = -5;
            global.sWidth = this.width + 7;
            global.sHeight = this.height + 7;
        } else if (global.playerImgCounter > 12 && global.playerImgCounter < 15) {
            global.sx = 5;
            global.sy = 72;
            global.sWidth = this.width + 5;
            global.sHeight = this.height + 5;
        } else if (global.playerImgCounter > 18 && global.playerImgCounter < 21) {
            global.sx = 199;
            global.sy = 76;
            global.sWidth = this.width - 5;
            global.sHeight = this.height - 5;
        } else if (global.playerImgCounter > 21 && global.playerImgCounter < 24) {
            global.sx = 403;
            global.sy = 83;
            global.sWidth = this.width - 7;
            global.sHeight = this.height - 7;
        } else if (global.playerImgCounter > 24 && global.playerImgCounter < 27) {
            global.sx = 6;
            global.sy = 165;
            global.sWidth = this.width - 5;
            global.sHeight = this.height - 5;
        } else if (global.playerImgCounter === 30) {
            global.playerImgCounter = 0;
        } 
        } else {
            global.sx = 10;
            global.sy = -4;
            global.sWidth = this.width;
            global.sHeight = this.height;
        } 
        ctx.drawImage(this.sprite, global.sx, global.sy, global.sWidth, global.sHeight, global.dx, global.dy, global.dWidth, global.dHeight)
    }

    move () {
        if(global.jumping && global.falling === false && global.isPlaying) { // player jumps

            if(this.y <= global.PLAYER_START_Y && player.y > global.PLAYER_JUMP_LIMIT) {
                this.y -= Math.floor(global.jumpSpeed)
                global.jumpSpeed += global.jumpAcceleration;
            }
            if(this.y <= global.PLAYER_JUMP_LIMIT) {
                global.jumping = false;
                global.falling = true;
                global.jumpSpeed = global.INITIAL_JUMP_SPEED;
            }
        } else if (global.falling && global.isPlaying) { // player falls
            if(this.y <= global.PLAYER_START_Y ) {
                this.y += global.fallSpeed;
                global.fallSpeed += global.fallAcceleration;
            }
            if(this.y >= global.PLAYER_START_Y) {
                global.fallSpeed = global.INITIAL_FALL_SPEED;
                this.y = global.PLAYER_START_Y;
                global.falling = false;
            }
        }
    }
}

class Desert {
    constructor (x) {
        this.x = x;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.speed = global.gameSpeed;
    }

    draw () {
        const img = global.bgImg;
        img.src = "./images/desert.png"
        ctx.drawImage(img,this.x,this.y);
    }

    move () {
        if(global.isPlaying)  this.x-=this.speed;
        if(this.x <= -640) {
            this.x = 640;
        }
    }
}

class Obstacle {
    constructor (x,y,width,height,type) {
        this.width = width;
        this.height = height;
        this.type = type;
        this.sprite = new Image();
        this.x = x;
        this.y = y-this.height;
    }

    draw () {
        if(this.type === "cactus") {
            this.sprite.src = `./images/cactus_${this.height}_${this.width}.png`
            ctx.drawImage(this.sprite,this.x,this.y)
        }
    }

    move () {
           if(global.isPlaying) this.x -= global.gameSpeed;
    }

    detectCollision (rect1,rect2) {
        let marginOfSafety = 40;
        if (
            rect1.x + marginOfSafety < rect2.x + rect2.width &&
            rect1.x + rect1.width - marginOfSafety > rect2.x  &&
            rect1.y + marginOfSafety < rect2.y + rect2.height &&
            rect1.height + rect1.y - marginOfSafety > rect2.y
          ) {
            // Collision detected!
            global.isPlaying = false;
            global.gameSpeed = global.INITIAL_GAME_SPEED;
          } 
    }
}

class Cloud {
    constructor (x,y) {
        this.x = x;
        this.y = y;
        this.sprite = new Image();
        this.src = generateRandomCloud();
    }

    draw () {
        ctx.save();
        ctx.globalAlpha = .5;
        this.sprite.src = this.src;
        ctx.drawImage(this.sprite, this.x, this.y);
        ctx.restore();
    }

    move () {
        if(global.isPlaying) this.x -= 3;
        if(this.x === -1000) {
            global.clouds.shift();
        }
    }
}

const generateRandomCloud = () => {
    const clouds = ["./images/cloud_40_170.png","./images/cloud_40_200.png","./images/cloud_80_100.png", "./images/cloud_80_150.png","./images/cloud_80_200.png"];
    const random = Math.floor(Math.random()*clouds.length);
    return clouds[random];
}

const detectGameOver = () => {
    if(global.isPlaying === false) {
        generateGameOverMenu();
    }
}

const generateGameOverMenu = () => {
    if(global.gameOverMenu === false && !global.splashPageOpen) {
        global.damageSound.play();
        global.damageSound.volume = .5;
        global.gameOverMenu = true;
        const canvasContainer = document.querySelector('.canvas-container');
        const gameOverContainer = document.createElement('div');
        gameOverContainer.classList.add('game-over-container');
        canvasContainer.appendChild(gameOverContainer);
        const scoreText = document.createElement('span');
        scoreText.classList.add('score-text');
        scoreText.innerText = `Score: ${global.gameScore}`
        gameOverContainer.appendChild(scoreText);
        const replayButton = document.createElement('button');
        replayButton.innerText = "Replay";
        replayButton.classList.add('replay-button');
        gameOverContainer.appendChild(replayButton)
        replayButton.addEventListener('click', handleReplayButtonClick)
    }
}

const handleReplayButtonClick = () => {
    const replayButton = document.querySelector('.replay-button');
    const gameOverContainer = document.querySelector('.game-over-container');
    gameOverContainer.remove();
    replayButton.removeEventListener('click', handleReplayButtonClick);
    global.gameScore = 0;
    restartGame();
}

const restartGame = () => {
    if(global.gameScore === 0) {
        player.y = global.PLAYER_START_Y;
        player.x = global.PLAYER_START_X;
        global.cactus = [];
        global.clouds = [];
        global.gameOverMenu = false;
        global.cactiSpawnCounter = 0;
        global.jumping = false;
        if(!global.isPlaying) {
            global.spawnSound.play();
            global.spawnSound.volume = .05;
            global.isPlaying = true;
        }
        
    }
}

const initParallax = () => {
    for(let i=0; i<2; i++) {
        if(i===0) {
            global.bgFrames.push(new Desert(0))
        } else if (i===1) {
            global.bgFrames.push(new Desert(640))
        }
    }
}

const generateRandomCloudAltitude = () => {
    const altitudes = [85,70,55,40,30,20,10];
    const random = Math.floor(Math.random()*altitudes.length);
    return altitudes[random];
}

const generateInitialClouds = () => {
    for(let i=0; i<4; i++) {
        if(i === 0) {
            global.clouds.push(new Cloud(100,generateRandomCloudAltitude()));
        } else if (i === 1) {
            global.clouds.push(new Cloud(300,generateRandomCloudAltitude()));
        } else if (i === 2) {
            global.clouds.push(new Cloud(500,generateRandomCloudAltitude()));
        } else if (i === 3) {
            global.clouds.push(new Cloud(710,generateRandomCloudAltitude()));
        }
    }
}

const generateClouds = () => {
    if(global.isPlaying)global.cloudCounter++;
    if(global.cloudCounter === 100 && global.isPlaying === true) {
        global.clouds.push(new Cloud(640,generateRandomCloudAltitude()));
        global.cloudCounter = 0;
    }
}

const incrementScore = () => {
    if(global.isPlaying) {
        global.gameScore++;
    }
}

const incrementGameSpeed = () => {
   global.gameSpeedCounter++;
   if(global.gameSpeedCounter >= 500) {
    global.gameSpeed++;
    global.gameSpeedCounter = 0;
   }
}

const generateScoreBoard = () => {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${global.gameScore}`, 10, 25)
}

const generateRandomObstacleWidth = () => {
    const widths = [40,50,60]
    const random = Math.floor(Math.random()*widths.length);
    return widths[random];
}

const generateRandomObstacleHeight = () => {
    const heights = [60, 120];
    const random = Math.floor(Math.random()*heights.length);
    return heights[random];
}

const generateRandomCactiInterval = () => {
    const intervals = [100, 125, 150, 175, 200, 225, 250];
    const random = Math.floor(Math.random()*intervals.length);
    return intervals[random];
}

const generateCacti = () => {
    if(global.isPlaying)global.cactiSpawnCounter++;
    if(global.cactiSpawnCounter === global.cactiInterval && global.isPlaying) {
        global.cactiSpawnCounter = 0;
        global.cactiInterval = generateRandomCactiInterval();
        global.cactus.push(new Obstacle(canvas.width,canvas.height,generateRandomObstacleWidth(),generateRandomObstacleHeight(), "cactus"));
    }
}
const player = new Player(global.PLAYER_START_X,global.PLAYER_START_Y,global.PLAYER_WIDTH,global.PLAYER_HEIGHT);
generateInitialClouds();
initParallax();

const animate = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    global.bgFrames.forEach((frame)=>{
        frame.draw();
        frame.move();
    });
    global.clouds.forEach((cloud)=>{
        cloud.draw();
        cloud.move();
    })
    generateClouds();
    generateScoreBoard();
    generateCacti();
    incrementScore();
    incrementGameSpeed();
    global.cactus.forEach((cacti)=>{
        cacti.draw();
        cacti.move();
        cacti.detectCollision(player,cacti)
    })
    player.draw();
    player.move();
    detectGameOver();
    window.requestAnimationFrame(animate);
}

window.onload = () => {
    animate();
}
    }
})()

