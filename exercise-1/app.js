// Create a new PIXI Application
const app = new PIXI.Application({width: 720, height: 480, antialias: true});

// Add the application to the document body
document.body.appendChild(app.view);

//Set interactive to true
app.stage.interactive = true;

//Add the sprites needed
let wolfSprite = PIXI.Sprite.from('wolf2.png');

let moonSprite = PIXI.Sprite.from('moon.png');

let bgspaceSprite = PIXI.Sprite.from('night.jpeg');

let nebulaSprite = PIXI.Sprite.from('space.jpeg');

bgspaceSprite.anchor.set(0.5);
bgspaceSprite.x = app.screen.width / 2;
bgspaceSprite.y = app.screen.height / 2;

//Fix the sprites in their position
moonSprite.anchor.set(0.5);
wolfSprite.anchor.set(0.5);
nebulaSprite.anchor.set(0.5);

wolfSprite.scale.x = 0.25;
wolfSprite.scale.y = 0.25;
wolfSprite.position.x = app.screen.width/3;
wolfSprite.position.y = app.screen.height-70;

moonSprite.scale.x = 0.25;
moonSprite.scale.y = 0.25;
moonSprite.position.x = app.screen.width/2;
moonSprite.position.y = app.screen.height/2;

app.stage.addChild(bgspaceSprite);
app.stage.addChild(moonSprite);

let container = new PIXI.Container();
container.x = app.screen.width / 2;
container.y = app.screen.height;
container.addChild(nebulaSprite);
container.mask = wolfSprite;

app.stage.addChild(container);
app.stage.addChild(wolfSprite);

let scaleValue = 0.001;

app.ticker.add((delta) => {
    bgspaceSprite.scale.x += scaleValue;
    bgspaceSprite.scale.y += scaleValue;
    nebulaSprite.rotation += 0.01;

    if(bgspaceSprite.scale.x <= 0.65)
        scaleValue = 0.001
})

app.stage.on('pointertap', () => {
    scaleValue = scaleValue * -1;
});
