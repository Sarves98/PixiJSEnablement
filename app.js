
let app;
let objectsList = {};
let dino, terrain;
let isGameStarted = false, jump = false, increaseY = 0;
let obstacleTimer, obstaclesList=[];
let hasCollided = true;
let player_score = 0
let scoreContainer;
let isFirstInstance = true;
let moon, moonIndex = 0;
let starSprite, cloudSprite;
let degrees;
let maxJumpHeight = 10;


window.onload = () => {
    app = new PIXI.Application({backgroundColor: 0x20214, width: 800, height: 600})
    document.getElementById("canvas-container").appendChild(app.view);
    app.stage.interactive = true;
    app.loader.add('spritesheet', "assets/sprites.png");
    app.loader.load(loadComplete);
}

const loadComplete = (event) => {
    player_score = 0;
    increaseY = 0;
    isGameStarted = false;
    jump = false;
    scoreContainer = new PIXI.Container();
    createAllSprites();
    displayResetIcon();
    displayHorizon();
    displayIdleTRex();
    throwObstaclesAtPlayer();
    generateAndDisplayMaxScore();
}

const displayMoon = () => {
    if(!moon || moon.x < -100){
        moon = new PIXI.Sprite(objectsList.moons[moonIndex % 7]);
        moon.x = 880;
        moon.y = 100;
        moonIndex++;
        app.stage.addChild(moon);
    }
}

const displayStars = () => {
    if(!starSprite || starSprite.x < -100){
        let index = getRandomInt(3);
        starSprite = new PIXI.Sprite(objectsList.stars[index]);
        starSprite.x = getRandomInt(850, 950);
        starSprite.y = getRandomInt(300, 100);
        app.stage.addChild(starSprite);
    }
}

const displayCloud = () => {
    if(!cloudSprite || cloudSprite.x < -100){
        cloudSprite = new PIXI.Sprite(objectsList.cloud);
        cloudSprite.x = getRandomInt(850, 950);
        cloudSprite.y = getRandomInt(300, 100);
        app.stage.addChild(cloudSprite);
    }
}

const displayResetIcon = () => {
    let resetSprite = new PIXI.Sprite(objectsList.reset);
    resetSprite.anchor.set(0.5);
    resetSprite.x = app.screen.width / 2;
    resetSprite.y = app.screen.height / 2;
    resetSprite.scale.x = 0.7;
    resetSprite.scale.y= 0.7;
    app.stage.addChild(resetSprite);
    resetSprite.interactive = true;
    resetSprite.buttonMode = true;
    resetSprite.on('pointerdown', (event) => {
        app.stage.removeChild(dino);
        displayTRex();
        startGame();
        isFirstInstance = false;
        app.stage.removeChild(resetSprite);
    })
}

const startGame = () => {
    isGameStarted = true;
    app.ticker.add(timerLoop);
}

const createAllSprites = () => {
    let spritesList = new PIXI.BaseTexture.from(app.loader.resources['spritesheet'].url);
    objectsList.idleDino = new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["trex-set"].constituents.idle1["start-x"],SPRITESHEET_DATA.sprites["trex-set"].constituents.idle1["start-y"],SPRITESHEET_DATA.sprites["trex-set"].constituents.idle1.width, SPRITESHEET_DATA.sprites["trex-set"].constituents.idle1.height))
    objectsList.dinoWalk = [
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["trex-set"].constituents.walk1["start-x"],SPRITESHEET_DATA.sprites["trex-set"].constituents.walk1["start-y"],SPRITESHEET_DATA.sprites["trex-set"].constituents.walk1.width, SPRITESHEET_DATA.sprites["trex-set"].constituents.walk1.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["trex-set"].constituents.walk2["start-x"],SPRITESHEET_DATA.sprites["trex-set"].constituents.walk2["start-y"],SPRITESHEET_DATA.sprites["trex-set"].constituents.walk2.width, SPRITESHEET_DATA.sprites["trex-set"].constituents.walk2.height))
    ]
    objectsList.horizon = new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["horizon"]["start-x"],SPRITESHEET_DATA.sprites["horizon"]["start-y"],SPRITESHEET_DATA.sprites["horizon"].width, SPRITESHEET_DATA.sprites["horizon"].height))
    objectsList.cactii = [
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["cactus-small-set"].constituents.cactus1["start-x"],SPRITESHEET_DATA.sprites["cactus-small-set"].constituents.cactus1["start-y"],SPRITESHEET_DATA.sprites["cactus-small-set"].constituents.cactus1.width, SPRITESHEET_DATA.sprites["cactus-small-set"].constituents.cactus1.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["cactus-small-set"].constituents.cactus2["start-x"],SPRITESHEET_DATA.sprites["cactus-small-set"].constituents.cactus2["start-y"],SPRITESHEET_DATA.sprites["cactus-small-set"].constituents.cactus2.width, SPRITESHEET_DATA.sprites["cactus-small-set"].constituents.cactus2.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["cactus-small-set"].constituents.cactus3["start-x"],SPRITESHEET_DATA.sprites["cactus-small-set"].constituents.cactus3["start-y"],SPRITESHEET_DATA.sprites["cactus-small-set"].constituents.cactus3.width, SPRITESHEET_DATA.sprites["cactus-small-set"].constituents.cactus3.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["cactus-large-set"].constituents.cactus1["start-x"],SPRITESHEET_DATA.sprites["cactus-large-set"].constituents.cactus1["start-y"],SPRITESHEET_DATA.sprites["cactus-large-set"].constituents.cactus1.width, SPRITESHEET_DATA.sprites["cactus-large-set"].constituents.cactus1.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["cactus-large-set"].constituents.cactus2["start-x"],SPRITESHEET_DATA.sprites["cactus-large-set"].constituents.cactus2["start-y"],SPRITESHEET_DATA.sprites["cactus-large-set"].constituents.cactus2.width, SPRITESHEET_DATA.sprites["cactus-large-set"].constituents.cactus2.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["cactus-large-set"].constituents.cactus3["start-x"],SPRITESHEET_DATA.sprites["cactus-large-set"].constituents.cactus3["start-y"],SPRITESHEET_DATA.sprites["cactus-large-set"].constituents.cactus3.width, SPRITESHEET_DATA.sprites["cactus-large-set"].constituents.cactus3.height)),
    ]
    objectsList.Pterodactyl = [
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["pterodactyl-set"].constituents["fly-down"]["start-x"],SPRITESHEET_DATA.sprites["pterodactyl-set"].constituents["fly-down"]["start-y"],SPRITESHEET_DATA.sprites["pterodactyl-set"].constituents["fly-down"].width, SPRITESHEET_DATA.sprites["pterodactyl-set"].constituents["fly-down"].height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["pterodactyl-set"].constituents["fly-up"]["start-x"],SPRITESHEET_DATA.sprites["pterodactyl-set"].constituents["fly-up"]["start-y"],SPRITESHEET_DATA.sprites["pterodactyl-set"].constituents["fly-up"].width, SPRITESHEET_DATA.sprites["pterodactyl-set"].constituents["fly-up"].height))
    ]
    objectsList.gameOverDino = new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["trex-set"].constituents.gameOverDino["start-x"],SPRITESHEET_DATA.sprites["trex-set"].constituents.gameOverDino["start-y"],SPRITESHEET_DATA.sprites["trex-set"].constituents.gameOverDino.width, SPRITESHEET_DATA.sprites["trex-set"].constituents.gameOverDino.height));
    objectsList.gameOver = new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["game-over"]["start-x"],SPRITESHEET_DATA.sprites["game-over"]["start-y"],SPRITESHEET_DATA.sprites["game-over"].width, SPRITESHEET_DATA.sprites["game-over"].height))
    objectsList.numbers = [
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["numbers"].constituents[0]["start-x"],SPRITESHEET_DATA.sprites["numbers"].constituents[0]["start-y"],SPRITESHEET_DATA.sprites["numbers"].constituents[0].width, SPRITESHEET_DATA.sprites["numbers"].constituents[0].height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["numbers"].constituents[1]["start-x"],SPRITESHEET_DATA.sprites["numbers"].constituents[1]["start-y"],SPRITESHEET_DATA.sprites["numbers"].constituents[1].width, SPRITESHEET_DATA.sprites["numbers"].constituents[1].height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["numbers"].constituents[2]["start-x"],SPRITESHEET_DATA.sprites["numbers"].constituents[2]["start-y"],SPRITESHEET_DATA.sprites["numbers"].constituents[2].width, SPRITESHEET_DATA.sprites["numbers"].constituents[2].height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["numbers"].constituents[3]["start-x"],SPRITESHEET_DATA.sprites["numbers"].constituents[3]["start-y"],SPRITESHEET_DATA.sprites["numbers"].constituents[3].width, SPRITESHEET_DATA.sprites["numbers"].constituents[3].height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["numbers"].constituents[4]["start-x"],SPRITESHEET_DATA.sprites["numbers"].constituents[4]["start-y"],SPRITESHEET_DATA.sprites["numbers"].constituents[4].width, SPRITESHEET_DATA.sprites["numbers"].constituents[4].height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["numbers"].constituents[5]["start-x"],SPRITESHEET_DATA.sprites["numbers"].constituents[5]["start-y"],SPRITESHEET_DATA.sprites["numbers"].constituents[5].width, SPRITESHEET_DATA.sprites["numbers"].constituents[5].height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["numbers"].constituents[6]["start-x"],SPRITESHEET_DATA.sprites["numbers"].constituents[6]["start-y"],SPRITESHEET_DATA.sprites["numbers"].constituents[6].width, SPRITESHEET_DATA.sprites["numbers"].constituents[6].height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["numbers"].constituents[7]["start-x"],SPRITESHEET_DATA.sprites["numbers"].constituents[7]["start-y"],SPRITESHEET_DATA.sprites["numbers"].constituents[7].width, SPRITESHEET_DATA.sprites["numbers"].constituents[7].height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["numbers"].constituents[8]["start-x"],SPRITESHEET_DATA.sprites["numbers"].constituents[8]["start-y"],SPRITESHEET_DATA.sprites["numbers"].constituents[8].width, SPRITESHEET_DATA.sprites["numbers"].constituents[8].height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["numbers"].constituents[9]["start-x"],SPRITESHEET_DATA.sprites["numbers"].constituents[9]["start-y"],SPRITESHEET_DATA.sprites["numbers"].constituents[9].width, SPRITESHEET_DATA.sprites["numbers"].constituents[9].height)),
    ];
    objectsList.dinoDuck = [
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["trex-set"].constituents.duck1["start-x"],SPRITESHEET_DATA.sprites["trex-set"].constituents.duck1["start-y"],SPRITESHEET_DATA.sprites["trex-set"].constituents.duck1.width, SPRITESHEET_DATA.sprites["trex-set"].constituents.duck1.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["trex-set"].constituents.duck2["start-x"],SPRITESHEET_DATA.sprites["trex-set"].constituents.duck2["start-y"],SPRITESHEET_DATA.sprites["trex-set"].constituents.duck2.width, SPRITESHEET_DATA.sprites["trex-set"].constituents.duck2.height)),
    ]
    objectsList.hi = new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["hi"]["start-x"],SPRITESHEET_DATA.sprites["hi"]["start-y"],SPRITESHEET_DATA.sprites["hi"].width, SPRITESHEET_DATA.sprites["hi"].height));
    objectsList.reset = new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites["reset"]["start-x"],SPRITESHEET_DATA.sprites["reset"]["start-y"],SPRITESHEET_DATA.sprites["reset"].width, SPRITESHEET_DATA.sprites["reset"].height));
    objectsList.moons = [
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites.moons.constituents.moon1["start-x"],SPRITESHEET_DATA.sprites.moons.constituents.moon1["start-y"],SPRITESHEET_DATA.sprites.moons.constituents.moon1.width, SPRITESHEET_DATA.sprites.moons.constituents.moon1.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites.moons.constituents.moon2["start-x"],SPRITESHEET_DATA.sprites.moons.constituents.moon2["start-y"],SPRITESHEET_DATA.sprites.moons.constituents.moon2.width, SPRITESHEET_DATA.sprites.moons.constituents.moon2.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites.moons.constituents.moon3["start-x"],SPRITESHEET_DATA.sprites.moons.constituents.moon3["start-y"],SPRITESHEET_DATA.sprites.moons.constituents.moon3.width, SPRITESHEET_DATA.sprites.moons.constituents.moon3.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites.moons.constituents.moon4["start-x"],SPRITESHEET_DATA.sprites.moons.constituents.moon4["start-y"],SPRITESHEET_DATA.sprites.moons.constituents.moon4.width, SPRITESHEET_DATA.sprites.moons.constituents.moon4.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites.moons.constituents.moon5["start-x"],SPRITESHEET_DATA.sprites.moons.constituents.moon5["start-y"],SPRITESHEET_DATA.sprites.moons.constituents.moon5.width, SPRITESHEET_DATA.sprites.moons.constituents.moon5.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites.moons.constituents.moon6["start-x"],SPRITESHEET_DATA.sprites.moons.constituents.moon6["start-y"],SPRITESHEET_DATA.sprites.moons.constituents.moon6.width, SPRITESHEET_DATA.sprites.moons.constituents.moon6.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites.moons.constituents.moon7["start-x"],SPRITESHEET_DATA.sprites.moons.constituents.moon7["start-y"],SPRITESHEET_DATA.sprites.moons.constituents.moon7.width, SPRITESHEET_DATA.sprites.moons.constituents.moon7.height))
    ];
    objectsList.stars = [
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites.stars.constituents.star1["start-x"],SPRITESHEET_DATA.sprites.stars.constituents.star1["start-y"],SPRITESHEET_DATA.sprites.stars.constituents.star1.width, SPRITESHEET_DATA.sprites.stars.constituents.star1.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites.stars.constituents.star2["start-x"],SPRITESHEET_DATA.sprites.stars.constituents.star2["start-y"],SPRITESHEET_DATA.sprites.stars.constituents.star2.width, SPRITESHEET_DATA.sprites.stars.constituents.star2.height)),
        new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites.stars.constituents.star3["start-x"],SPRITESHEET_DATA.sprites.stars.constituents.star3["start-y"],SPRITESHEET_DATA.sprites.stars.constituents.star3.width, SPRITESHEET_DATA.sprites.stars.constituents.star3.height))
    ];

    objectsList.cloud = new PIXI.Texture(spritesList, new PIXI.Rectangle(SPRITESHEET_DATA.sprites.cloud["start-x"],SPRITESHEET_DATA.sprites.cloud["start-y"],SPRITESHEET_DATA.sprites.cloud.width, SPRITESHEET_DATA.sprites.cloud.height))
}

const displayTRex = () => {
    dino = new PIXI.AnimatedSprite(objectsList.dinoWalk);
    dino.anchor.set(0.5);
    dino.loop = true;
    dino.animationSpeed = 0.175;
    dino.x = 100;
    dino.y = 460;
    dino.scale.x = 0.7;
    dino.scale.y= 0.7;
    dino._name="dinoWalk"
    app.stage.addChild(dino);
    dino.play();
}

const displayIdleTRex = () => {
    dino = new PIXI.Sprite(objectsList.idleDino);
    dino.anchor.set(0.5);
    dino.x = 100;
    dino.y = 460;
    dino.scale.x = 0.7;
    dino.scale.y= 0.7;
    dino._name="dinoIdle"
    app.stage.addChild(dino);
}

const performDuckAction = () => {
    if(dino._name === "dinoDuck")
        return;
    app.stage.removeChild(dino);
    dino = new PIXI.AnimatedSprite(objectsList.dinoDuck);
    dino._name="dinoDuck"
    dino.anchor.set(0.5);
    dino.loop = true;
    dino.animationSpeed = 0.175;
    dino.x = 100;
    dino.y = 480;
    dino.scale.x = 0.7;
    dino.scale.y= 0.7;
    app.stage.addChild(dino);
    dino.play();
}


const timerLoop = (delta) => {
    if(dino.play)
        dino.play();
    if(!hasCollided){
        if(isGameStarted){
            let collidedX = dino.x;
            let collidedY = dino.y;
            if(dino._name === "dinoDuck")
                collidedY = collidedY - 50;
            else 
                collidedY = collidedY - 32;
            app.stage.removeChild(dino);
            dino = new PIXI.Sprite(objectsList.gameOverDino);
            dino.x = collidedX - 30;
            dino.y = collidedY;
            dino.scale.x = 0.7;
            dino.scale.y= 0.7;
            app.stage.addChild(dino);
            isGameStarted = false
            displayGameOver();
            app.ticker.remove();
            let highScore = localStorage.getItem("highScore");
            if(highScore < player_score)
                localStorage.setItem("highScore", player_score);
        }
        return
    }
    player_score++;
    let scoreSpriteArray = generatePlayerScore();
    displayPlayerScore(scoreSpriteArray, scoreContainer, 700)

    terrain.tilePosition.x -= (delta * 8)

    dino.y += increaseY;
    if(degrees != 0){
        degrees -= 3;
        increaseY = generateSineWave(degrees, maxJumpHeight);
    }
    if(dino.y >= 460){
        increaseY = 0;
        degrees = 0;
        if(dino._name === "dinoIdle"){
            dino.y = 460;
            app.stage.removeChild(dino);
            displayTRex();
        }
    }

    updateObstacles();
    displayStars();
    starSprite.x -= 0.9;
    displayMoon();
    moon.x -= 1;
    displayCloud();
    cloudSprite.x -= 1.1;
}

let updateObstacles = () => {
    obstaclesList = obstaclesList.filter(obstacle => obstacle.x > -200)
    obstaclesList.forEach(obstacle => {
        obstacle.x -= 8;
    })
    if(!obstacleTimer)
        obstacleTimer = setInterval(throwObstaclesAtPlayer, 2000)

    hasCollided = obstaclesList.every(obstacle => !performCollisionDetection(obstacle, dino))
}

let generateSineWave = (x, maxJumpHeight) => {
    return Math.ceil(Math.sin(x*Math.PI/180) * maxJumpHeight) 
}

const displayGameOver = () => {
    let gameOver = new PIXI.Sprite(objectsList.gameOver);
    gameOver.anchor.set(0.5);
    gameOver.x = app.screen.width / 2;
    gameOver.y = app.screen.height / 2;
    gameOver.scale.x = 0.7;
    gameOver.scale.y= 0.8;
    app.stage.addChild(gameOver);
}

const generatePlayerScore = () => {
    let scoreArray = separateDigitsOfScore(player_score);
    let scoreSpriteArray = [];
    scoreArray.forEach(scoreDigit => {
        scoreSpriteArray.push(objectsList.numbers[scoreDigit])
    })
    return scoreSpriteArray
}

const generateAndDisplayMaxScore = () => {
    let maxScore = localStorage.getItem("highScore");
    if(!maxScore)
        return;
    let hiSprite = new PIXI.Sprite(objectsList.hi);
    hiSprite.anchor.set(0.5);
    hiSprite.x = 500;
    hiSprite.y = 20
    hiSprite.scale.x = 0.7;
    hiSprite.scale.y= 0.7;
    app.stage.addChild(hiSprite);
    let maxScoreContainer = new PIXI.Container();
    if(!maxScore)
        return;
    let scoreArray = separateDigitsOfScore(parseInt(maxScore));
    let scoreSpriteArray = [];
    scoreArray.forEach(scoreDigit => {
        scoreSpriteArray.push(objectsList.numbers[scoreDigit])
    })
    displayPlayerScore(scoreSpriteArray,maxScoreContainer, 542);
}

const separateDigitsOfScore = (player_score) => {
    let scoreArray = [];
    let player_score_duplicate = player_score;
    while(player_score_duplicate > 0){
        let digit = player_score_duplicate % 10;
        player_score_duplicate = Math.trunc(player_score_duplicate/10);
        scoreArray.unshift(digit);
    }
    return scoreArray;
}

const displayPlayerScore = (scoreSpriteArray, container, displayX) => {
    container.children.forEach(child => {
        container.removeChild(child);
    })
    scoreSpriteArray.forEach(scoreSprite => {
        let scoreDigitSprite = new PIXI.Sprite(scoreSprite);
        scoreDigitSprite.anchor.set(0.5);
        scoreDigitSprite.x = displayX;
        scoreDigitSprite.y = 20
        scoreDigitSprite.scale.x = 0.7;
        scoreDigitSprite.scale.y= 0.7;
        container.addChild(scoreDigitSprite);
        displayX += 20
    })
    app.stage.addChild(container);

}

const performCollisionDetection = (obstacle,dino) => {
    let obstacleBounds = obstacle.getBounds();
    let dinoBounds = dino.getBounds();
    let hasCollided;
    if(obstacleBounds.width > 50){
        hasCollided = obstacleBounds.x + obstacleBounds.width - 20 > dinoBounds.x && obstacleBounds.x < dinoBounds.x + dinoBounds.width - 20 && obstacleBounds.y + obstacleBounds.height - 10 > dinoBounds.y && obstacleBounds.y < dinoBounds.y + dinoBounds.height - 10;
    } else
        hasCollided = obstacleBounds.x + obstacleBounds.width -10 > dinoBounds.x && obstacleBounds.x < dinoBounds.x + dinoBounds.width -10 && obstacleBounds.y + obstacleBounds.height -5 > dinoBounds.y && obstacleBounds.y < dinoBounds.y + dinoBounds.height -5;
    return hasCollided;
}

function getRandomInt(max, min = 0) {
    return Math.floor(Math.random() * (max - min) + min);
}

const throwObstaclesAtPlayer = () => {
    if(getRandomInt(10) >= 1){
        let index = getRandomInt(8);
        let obstacle;
        if(index >= 6){
            obstacle = new PIXI.AnimatedSprite(objectsList.Pterodactyl);
            obstacle.loop = true;
            obstacle.animationSpeed = 0.1;
            obstacle.x = 850;
            obstacle.y = getRandomInt(410, 300);
            obstacle.scale.x = 0.7;
            obstacle.scale.y= 0.7;
            obstacle.play();
        }else {
            obstacle = new PIXI.Sprite(objectsList.cactii[index]);
            obstacle.x = 850;
            obstacle.y = 415;
            if(obstacle.height === 100)
                obstacle.y = 395;
        }
        app.stage.addChild(obstacle);
        obstaclesList = [...obstaclesList, obstacle];
    }
}

const displayHorizon = () => {
    terrain = new PIXI.TilingSprite(objectsList.horizon, SPRITESHEET_DATA.sprites["horizon"].width, SPRITESHEET_DATA.sprites["horizon"].height);
    terrain.position.set(0,475)
    app.stage.addChild(terrain);
}

const performJumpAction = () => {
    if (isGameStarted && increaseY === 0){
        app.stage.removeChild(dino);
        displayIdleTRex();
        degrees = 275;
        increaseY = generateSineWave(degrees, maxJumpHeight);
    }
}

window.addEventListener('keydown',e => {
    if(!isGameStarted)
        return;
    if((e.key === " " || e.key === "w" || e.key === "ArrowUp") && dino._name === "dinoWalk")
        performJumpAction()
    else if(e.key === "ArrowDown" && dino.y >= 460 )
        performDuckAction();
});

window.addEventListener('keyup',e => {
    if(e.key === "ArrowDown" && isGameStarted && dino.y >= 460){
        app.stage.removeChild(dino);
        displayTRex();
    }
});
window.addEventListener('click', performJumpAction());

window.addEventListener("visibilitychange", () => {
    if(obstacleTimer){
        clearInterval(obstacleTimer);
        obstacleTimer = 0;
    }
    else
        obstacleTimer = setInterval(throwObstaclesAtPlayer, 2000)
});