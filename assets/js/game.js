
const LOGICAL_WIDTH = 240;
const LOGICAL_HEIGHT = 240;
const RES = 3;
const CPU_TURN = 'cpu';
const PLAYER_TURN = 'player';
const POINTER_TAP = 'pointertap';
// Resize function
function resizeHandler() {
    const W = Math.max(window.innerWidth, document.documentElement.clientWidth);
    const H = Math.max(window.innerHeight, document.documentElement.clientHeight);
    const SCALE_FATOR = Math.min(W / LOGICAL_WIDTH, H / LOGICAL_HEIGHT);
    const NEW_WIDTH = Math.ceil(LOGICAL_WIDTH * SCALE_FATOR);
    const NEW_HEIGHT = Math.ceil(LOGICAL_HEIGHT * SCALE_FATOR);
    app.renderer.resize(NEW_WIDTH, NEW_HEIGHT);
    app.stage.scale.set(SCALE_FATOR);
}


let Application = PIXI.Application;
let Container = PIXI.Container;
let Graphics = PIXI.Graphics;
let Sprite = PIXI.Sprite;
let Text = PIXI.Text;

let background, player, cpu, scoreContainer, scoreTitle;
let alpha = 0;
let moveTo;
let moveToX;
let moveToY;
let round = 0;
let score = 0;
let cpuScore = 0;
let cpuTurn = 0;
let cpuGameBoard = null;
let cpuGameBoardText = null;
let playerTurn = 0;
let playerScore = 0;
let playerGameBoard = null;
let playerGameBoardText = null;
let gameTurn = PLAYER_TURN;
let gameBoarTurn = null;
let gamePlace = [];
let gamePlaceText = [];
let defendCharacter = new Array();
let endBackground;
let pointConsecutive;

let app = new Application({
    width: LOGICAL_WIDTH,
    height: LOGICAL_HEIGHT,
    antialias: true,
    resolution: 1 || window.devicePixelRatio,
    autoResize: true
});
// document.body.appendChild(app.view);
// Get id Canvas from html
document.getElementById("game").appendChild(app.view);
let gameScene = new Container();
app.stage.addChild(gameScene);

// Position of Number Place, Ball, Miss Ball, Background
let tapPosition = {
    "place_1": {
        "position": {
            "click": 1,
            "ball": {
                x: 35,
                y: 45,
                x_over: -11,
                y_over: -11
            }
        },
        "background": "0x000000",
        "opacity": 0.2,
        "width": 58,
        "height": 48,
        "x": 33,
        "y": 44,
        "title": {
            text: '1',
            x: 55,
            y: 55
        }
    },
    "place_2": {
        "position": {
            "click": 2,
            "ball": {
                x: 110,
                y: 45,
                x_over: 110,
                y_over: -10
            }
        },
        "background": "0xFFFFFF",
        "opacity": 0.2,
        "width": 58,
        "height": 48,
        "x": 91,
        "y": 44,
        "title": {
            text: '2',
            x: 112,
            y: 55
        }
    },
    "place_3": {
        "position": {
            "click": 3,
            "ball": {
                x: 170,
                y: 45,
                x_over: 251,
                y_over: -10
            }
        },
        "background": "0x000000",
        "opacity": 0.2,
        "width": 58,
        "height": 48,
        "x": 149,
        "y": 44,
        "title": {
            text: '3',
            x: 170,
            y: 55
        }
    },
    "place_4": {
        "position": {
            "click": 4,
            "ball": {
                x: 40,
                y: 95,
                x_over: 0,
                y_over: 75
            }
        },
        "background": "0xFFFFFF",
        "opacity": 0.2,
        "width": 58,
        "height": 48,
        "x": 33,
        "y": 92,
        "title": {
            text: '4',
            x: 55,
            y: 102
        }
    },
    "place_5": {
        "position": {
            "click": 5,
            "ball": {
                x: 110,
                y: 95
            }
        },
        "background": "0x000000",
        "opacity": 0.2,
        "width": 58,
        "height": 48,
        "x": 91,
        "y": 92,
        "title": {
            text: '5',
            x: 112,
            y: 102
        }
    },
    "place_6": {
        "position": {
            "click": 6,
            "ball": {
                x: 180,
                y: 95,
                x_over: 210,
                y_over: 75
            }
        },
        "background": "0xFFFFFF",
        "opacity": 0.2,
        "width": 58,
        "height": 48,
        "x": 149,
        "y": 92,
        "title": {
            text: '6',
            x: 170,
            y: 102
        }
    }
};

// Action of Player & CPU
let defendImage = {
    cpu_1: { url: 'assets/images/cpu/gk_left_up.png', x: 30, y: 40 },
    cpu_2: { url: 'assets/images/cpu/gk_center_up.png', x: 100, y: 40 },
    cpu_3: { url: 'assets/images/cpu/gk_right_up.png', x: 135, y: 40 },
    cpu_4: { url: 'assets/images/cpu/gk_left_down.png', x: 30, y: 105 },
    cpu_5: { url: 'assets/images/cpu/gk_center_down.png', x: 100, y: 80 },
    cpu_6: { url: 'assets/images/cpu/gk_right_down.png', x: 135, y: 105 },
    player_1: { url: 'assets/images/player/gk_left_up.png', x: 30, y: 40 },
    player_2: { url: 'assets/images/player/gk_center_up.png', x: 100, y: 40 },
    player_3: { url: 'assets/images/player/gk_right_up.png', x: 135, y: 40 },
    player_4: { url: 'assets/images/player/gk_left_down.png', x: 30, y: 105 },
    player_5: { url: 'assets/images/player/gk_center_down.png', x: 100, y: 80 },
    player_6: { url: 'assets/images/player/gk_right_down.png', x: 135, y: 105 },
};

// Set position
function setPosition(elm, x, y) {
    elm.x = x;
    elm.y = y;
}

// Add text for game
function addText(text, options, x, y, parent = gameScene) {
    let textStyle = new PIXI.TextStyle(options);
    let element = new Text(text, textStyle);
    setPosition(element, x, y);
    if (options.align === 'right') {
        element.anchor.x = 1;
    }
    parent.addChild(element);

    return element;
}

// Add Graphic for game
function addGraphic(color, opacity, x, y, width, height, parent = gameScene) {
    let element = new Graphics();
    element.beginFill(color, opacity);
    element.drawRect(x, y, width, height);
    element.endFill();
    parent.addChild(element);

    return element;
}

// Add Image for game
function addImage(url, x = 0, y = 0, opacity = 1, parent = gameScene) {
    let element = Sprite.fromImage(url);
    setPosition(element, x, y);

    if (opacity !== 1) {
        element.alpha = opacity;
    }

    parent.addChild(element);

    return element;
}

// Clear
function clear() {
    gameScene.removeChildren();
}

setup();

// SETUP: Create backgroud + Create start button + animation
function setup() {
    // Create background
    pointConsecutive = 0;
    background = addImage('assets/images/share/title_background.jpg');
    background.width = LOGICAL_WIDTH;
    background.height = LOGICAL_HEIGHT;

    // Create start button + animation
    addGraphic(0x000000, 0.75, 0, 180, 240, 49);
    let beginBtn = addImage('assets/images/share/start_label.png', LOGICAL_WIDTH / 2, 222, 0);
    beginBtn.anchor.set(0.5, 1)
    beginBtn.buttonMode = true;
    beginBtn.interactive = true;
    beginBtn.scale.set(0.3)

    let showButton = function () {
        beginBtn.alpha = alpha;
        alpha = alpha < 1 ? alpha + 0.015 : 0;
    };

    beginBtn.on(POINTER_TAP, function () {
        app.ticker.remove(showButton);
        waitingMatch();
    });
    round = 0;
    score = 0;
    app.ticker.add(showButton);

    // Set resize on device
    resizeHandler();

    // listen to resize event
    window.addEventListener("resize", resizeHandler);
}

// Reset next Stage
function resetNextStage() {
    round += 1;
    cpuTurn = 0;
    playerTurn = 0;
    cpuScore = 0;
    playerScore = 0;
    cpuGameBoard = null;
    playerGameBoard = null;
}

// Waiting Match
function waitingMatch() {
    clear();
    resetNextStage();
    // create main background
    background = addImage('assets/images/share/main_background.jpg');
    background.width = LOGICAL_WIDTH
    background.height = LOGICAL_HEIGHT
    // add background white transpate
    addGraphic(0xFFFFFF,0.3, 0, 0, 240, 240);

    // Create score
    scoreContainer = addGraphic(0x000000, 0.4, 0, 0, 240, 30);
    scoreTitle = addText('SCORE', {
        fontFamily: 'Arial',
        fontSize: 80,
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 20,
    }, 10, 2, scoreContainer);
    scoreTitle.scale.set(0.25);
    let scoreNumber = addText(score, {
        width: 80,
        align: 'right',
        fontSize: 80,
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 20
    }, 230, 2, scoreContainer);
    scoreNumber.scale.set(0.25)

    // Create character name
    let nameContainer = addGraphic(0x000000, 0.6, 0, 50, 240, 60);
    let playerName = addImage('assets/images/share/player.png', -50, 60)
    playerName.scale.set(0.25)
    let cpuName = addImage('assets/images/share/cpu.png', 240, 60)
    cpuName.scale.set(0.25)

    // Create character
    let vsContainer = addGraphic(0x000000, 1, 0, 164, 240, 0);
    let vsImg = addImage('assets/images/share/vs.png', 90, 144, 0);
    vsImg.width = 67;
    vsImg.height = 41;
    player = addImage('assets/images/share/vs_player_hd.png', -78, 74);
    player.scale.set(0.08)
    cpu = addImage('assets/images/share/vs_cpu_hd.png', 240, 81);
    cpu.scale.set(0.08)

    // Animation Fadeout game
    let fadeOutElm = function () {
        nameContainer.alpha = 0;
        playerName.alpha = 0;
        cpuName.alpha = 0;
        scoreContainer.alpha = 0;
        scoreTitle.alpha = 0;
        scoreNumber.alpha = 0;

        if (player.x >= -90 || cpu.x < 240) {
            player.x -= 3;
            cpu.x += 3;
        }
        if (playerName.x >= -90 || cpuName.x < 240) {
            playerName.x -= 3;
            cpuName.x += 3;
        }

        if (vsContainer.alpha > 0) {
            vsContainer.alpha -= 0.03;
        } else {
            app.ticker.remove(fadeOutElm);
            renderPlay();
        }

        if (vsContainer.graphicsData[0].shape.width > 8) {
            vsContainer.graphicsData[0].shape.width -= 8;
            vsContainer.x += 4;
            vsImg.width += 6;
            vsImg.x -= 3;
            vsImg.height -= 4.1;
        } else {
            vsImg.alpha = 0;
        }

        if (vsContainer.graphicsData[0].shape.height < 240) {
            vsContainer.graphicsData[0].shape.height += 20;
            vsContainer.y -= 15;
        }
    };
    // Animation FadeIn game
    let fadeInElm = function () {
        if (player.x < 0) {
            player.x += 2;
        }

        if (cpu.x > 162) {
            cpu.x -= 2;
        }
        if (playerName.x < 80) {
            playerName.x += 1.5;
        }

        if (cpuName.x > 190) {
            cpuName .x -= 1.2;
        }

        if (vsContainer.graphicsData[0].shape.height < 50) {
            vsContainer.y -= 1.25;
            vsContainer.graphicsData[0].shape.height += 2.5;
            vsImg.alpha = 1;
            vsImg.width += 2;
            vsImg.x -= 1;
            vsImg.height += 2;
            vsImg.y -= 1;
        }

        if (vsContainer.graphicsData[0].shape.height === 50 && vsImg.width >= 67 && vsImg.height > 40) {
            vsImg.width -= 2;
            vsImg.x += 1;
            vsImg.height -= 2;
            vsImg.y += 1;
        }

        if (vsContainer.graphicsData[0].shape.height === 50 && vsImg.width < 67 && vsImg.height < 41) {
            app.ticker.remove(fadeInElm);
            setTimeout(function () {
                app.ticker.add(fadeOutElm);
            }, 1500);
        }
    };

    app.ticker.add(fadeInElm);
}

// Random Miss or Goal
function randMissOrGoal() {
    return Math.random() > 0.2;
}

// Random CPU Place
function randCpuPlace() {
    return Math.floor((Math.random() * 6) + 1);
}

// Render Lose
function renderLose() {
    clear();
    gameScene.addChild(background);
    let overImg = addImage('assets/images/share/gameover.png', 2.5, 0);
    overImg.scale.set(0.245)
    addImage('assets/images/share/background_top.png');
    gameScene.addChild(scoreContainer);
    gameScene.addChild(scoreTitle);
    let scoreRenderLose = addText(score, {
        width: 80,
        align: 'right',
        fontSize: 86,
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 20
    }, 230, 2);
    scoreRenderLose.scale.set(0.245)
    let loseImg = addImage('assets/images/share/youlose.png', -193, 75);
    loseImg.scale.set(0.245);
    let moveLoseImg = function () {
        if (loseImg.x < 7.5) {
            loseImg.x += 2;
        } else {
            app.ticker.remove(moveLoseImg);
            setTimeout(function () {
                let moveOverImg = function () {
                    if (overImg.y < 75) {
                        overImg.y += 2;
                        loseImg.x += 10;
                    } else {
                        app.ticker.remove(moveOverImg);
                        setTimeout(function () {
                            clear();
                            gameScene.addChild(background);
                            endBackground = addImage('assets/images/share/end_background.png', -20, -5);
                            endBackground.width = LOGICAL_WIDTH
                            endBackground.height = LOGICAL_HEIGHT
                            endBackground.x = 0;
                            endBackground.y = 0;
                            let score_end = addText(score, {
                                width: 80,
                                align: 'right',
                                fontWeight: 'bold',
                                fontSize: 80,
                                fill: '#000000',
                            }, 210, 101);
                            score_end.scale.set(0.25)
                            let continueImg = addImage('assets/images/share/continue_label.png', 55, 190, 0);
                            continueImg.interactive = true;
                            continueImg.buttonMode = true;
                            continueImg.scale.set(0.25)
                            alpha = 0;
                            let continueChangeAlpha = function () {
                                continueImg.alpha = alpha;
                                alpha = alpha < 1 ? alpha + 0.015 : 0;
                            };
                            continueImg.on(POINTER_TAP, function () {
                                app.ticker.remove(continueChangeAlpha);
                                setup();
                            });
                            app.ticker.add(continueChangeAlpha);
                        }, 1000);
                    }
                };
                app.ticker.add(moveOverImg);
            }, 500);
        }
    };
    app.ticker.add(moveLoseImg);
}

// Render next
function renderNext() {
    clear();
    if ((playerScore - cpuScore) > 0) {
        // gameScene.addChild(background);
        // setTimeout(()=>{
        //     let stageImg = addImage('assets/images/share/nextstage.png', 3.5, 50);
        //     stageImg.scale.set(0.25);
        //     setTimeout(()=>{
        //         let winImg = addImage('assets/images/share/youwin.png', -193, 90);
        //         winImg.scale.set(0.25);
        //     },1750)
        // },1000)
        gameScene.addChild(background);
        let stageImg = addImage('assets/images/share/nextstage.png', 3.5, 50);
        stageImg.scale.set(0.245);
        addImage('assets/images/share/background_top.png');
        gameScene.addChild(scoreContainer);
        gameScene.addChild(scoreTitle);

        let score_next = addText(score, {
            width: 80,
            align: 'right',
            fontSize: 80,
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 10
        }, 230, 2);
        score_next.scale.set(0.25)
        let winImg = addImage('assets/images/share/youwin.png', -193, 90);
        winImg.scale.set(0.245);
        let moveWinImg = function () {
            if (winImg.x < 24) {
                winImg.x += 2;
            } else {
                app.ticker.remove(moveWinImg);
                setTimeout(function () {
                    let moveStageImg = function () {
                        if (stageImg.y < 90) {
                            stageImg.y += 1.5;
                            winImg.x += 10;
                        } else {
                            app.ticker.remove(moveStageImg);
                            setTimeout(function () {
                                waitingMatch();
                            }, 1000);
                        }
                    };
                    app.ticker.add(moveStageImg);
                }, 500);
            }
        };
        app.ticker.add(moveWinImg);
    } else {
        renderLose();
    }
}

// Render score board
function renderScoreBoard(isGoal) {
    if (playerGameBoard !== null && gameTurn === CPU_TURN) {
        gameScene.addChild(playerGameBoard);
    }

    if (cpuGameBoard !== null && gameTurn === PLAYER_TURN) {
        gameScene.addChild(cpuGameBoard);
    }

    if (playerTurn === cpuTurn) {
        gameScene.removeChild(playerGameBoard);
        gameScene.removeChild(cpuGameBoard);
    }

    if (isGoal !== null) {
        let ico = isGoal ? 'assets/images/share/o.png' : 'assets/images/share/x.png';
        if (gameTurn === 'player') {
            playerGameBoard = addImage(ico, 189, 206.5);
            playerGameBoard.width = 8;
            playerGameBoard.height = 8;
        } else {
            cpuGameBoard = addImage(ico, 189, 223);
            cpuGameBoard.width = 8;
            cpuGameBoard.height = 8;
        }
    }

    gameScene.removeChild(gameBoarTurn);
    gameBoarTurn = addText(playerTurn === cpuTurn ? playerTurn + 1 : playerTurn, {
        align: 'right',
        fontWeight: 'bold',
        fontSize: 40,
        fill: '#000000'
    }, 196.5, 191);
    gameBoarTurn.scale.set(0.25)

    gameScene.removeChild(playerGameBoardText);
    playerGameBoardText = addText(playerScore, {
        fontWeight: 'bold',
        fontSize: 47,
        fill: '#FF0000'
    }, 218, 204);
    playerGameBoardText.scale.set(0.25);

    gameScene.removeChild(cpuGameBoardText);
    cpuGameBoardText = addText(cpuScore, {
        fontWeight: 'bold',
        fontSize: 47,
        fill: '#FF0000'
    }, 218, 220);
    cpuGameBoardText.scale.set(0.25);
}

// Render miss
function renderMiss() {
    renderScoreBoard(false);
    let missImg = addImage('assets/images/share/miss.png', 40, 50);
    missImg.scale.set(0.25)
    let swap = false;
    let moveMissImg = function () {
        if (missImg.x < 50 && !swap) {
            setPosition(missImg, missImg.x + 0.6, missImg.y + 0.6);
        } else {
            swap = true;
        }

        if (missImg.x > 40 && swap) {
            setPosition(missImg, missImg.x - 0.6, missImg.y + 0.6);
        } else {
            swap = false;
        }

        if (missImg.y >= 80) {
            app.ticker.remove(moveMissImg);
        }
    };

    app.ticker.add(moveMissImg);

    if (gameTurn === 'player') {
        let playerMiss = addImage('assets/images/player/miss_player.png', -98, 134);
        playerMiss.scale.set(0.1);
        let movePlayer = function () {
            if (playerMiss.x < 10) {
                playerMiss.x += 4;
            } else {
                app.ticker.remove(movePlayer);
            }
        };
        app.ticker.add(movePlayer);
    }
    if (gameTurn === PLAYER_TURN ){
        pointConsecutive = 0;
    }
    if (gameTurn === CPU_TURN ){
        // pointConsecutive = 0;
    }
}

// Render goal
function renderGoal() {
    if (gameTurn === 'player') {
        playerScore += 1;
        pointConsecutive += 1;
        score += pointConsecutive*100;
    } else {
        cpuScore += 1;
    }

    renderScoreBoard(true);

    if (gameTurn === 'player') {
        let playerMiss = addImage('assets/images/player/goal_player.png', 100, 240);
        playerMiss.scale.set(0.147);
        let movePlayer = function () {
            if (playerMiss.y > 84) {
                playerMiss.y -= 6;
            } else {
                app.ticker.remove(movePlayer);
            }
        };
        app.ticker.add(movePlayer);
    }

    let goalImg = addImage('assets/images/share/goal.png', -40, 80);
    goalImg.scale.set(0.25);
    let moveGoalImg = function () {
        if (goalImg.x < 40) {
            goalImg.x += 1.5;
        } else {
            app.ticker.remove(moveGoalImg);
        }
    };

    app.ticker.add(moveGoalImg);
}

// Render defend
function renderDefend(turn, defend, defendBall, attackBall, goal) {
    gameScene.removeChild(defend);
    defendCharacter[turn + '_' + defendBall].alpha = 1;

    addGraphic(0x000000, 0.5, 0, 0, 240, 240);
    setTimeout(function () {
        if (attackBall === defendBall || (attackBall !== 5 && !goal)) {
            renderMiss();
        } else {
            renderGoal();
        }

        setTimeout(function () {
            let nextStage = true;
            let closeBg1 = addGraphic(0x000000, 1, 0, 0, 0, 40);
            let closeBg2 = addGraphic(0x000000, 1, 240, 40, 0, 40);
            let closeBg3 = addGraphic(0x000000, 1, 0, 80, 0, 40);
            let closeBg4 = addGraphic(0x000000, 1, 240, 120, 0, 40);
            let closeBg5 = addGraphic(0x000000, 1, 0, 160, 0, 40);
            let closeBg6 = addGraphic(0x000000, 1, 240, 200, 0, 40);
            let subScore = Math.abs(playerScore - cpuScore);

            if (gameTurn === PLAYER_TURN) {
                gameTurn = CPU_TURN;
                playerTurn += 1;
            } else {
                gameTurn = PLAYER_TURN;
                cpuTurn += 1;
            }

            // console.log({
            //     game_turn: gameTurn,
            //     attack_ball: attackBall,
            //     defend_ball: defendBall,
            //     goal: goal,
            //     player_turn: playerTurn,
            //     cpu_turn: cpuTurn,
            //     player_score: playerScore,
            //     cpu_score: cpuScore,
            //     sub_score: subScore,
            // });

            if (playerTurn === cpuTurn
                && ((playerTurn < 5 && subScore > (5 - playerTurn)) || (playerTurn >= 5 && subScore > 0))
            ) {
                nextStage = false;
            }

            let next = function () {
                if (closeBg1.graphicsData[0].shape.width < 240) {
                    closeBg1.graphicsData[0].shape.width += 8;
                    closeBg2.graphicsData[0].shape.width += 8;
                    closeBg2.x -= 8;
                    closeBg3.graphicsData[0].shape.width += 8;
                    closeBg4.graphicsData[0].shape.width += 8;
                    closeBg4.x -= 8;
                    closeBg5.graphicsData[0].shape.width += 8;
                    closeBg6.graphicsData[0].shape.width += 8;
                    closeBg6.x -= 8;
                } else {
                    app.ticker.remove(next);
                    if (nextStage) {
                        renderPlay();
                    } else {
                        renderNext();
                    }
                }
            };
            app.ticker.add(next);
        }, 2000);
    }, 300);
}

// Render Play of Cpu & Player
function renderPlay() {
    clear();
    background.alpha = 1;
    gameScene.addChild(background);
    scoreContainer.alpha = 1;
    scoreTitle.alpha = 1;
    gameScene.addChild(scoreContainer);
    gameScene.addChild(scoreTitle);

    let scoreText = addText(score, {
        align: 'right',
        fontSize: 80,
        fill: '#FFFFFF',
        stroke: '#000000',
        strokeThickness: 20
    }, 230, 2);
    scoreText.scale.set(0.25);

    Object.keys(defendImage).forEach(function (index) {
        defendCharacter[index] = addImage(defendImage[index].url, defendImage[index].x, defendImage[index].y, 0);
    });

    Object.keys(tapPosition).forEach(function (index) {
        let position = addGraphic(
            tapPosition[index].background,
            tapPosition[index].opacity,
            tapPosition[index].x,
            tapPosition[index].y,
            tapPosition[index].width,
            tapPosition[index].height
        );
        position.interactive = true;
        position.buttonMode = true;
        position.on(POINTER_TAP, function () {
            app.ticker.remove(moveDefender);

            gamePlace.forEach(function (item) {
                gameScene.removeChild(item);
            });

            gamePlaceText.forEach(function (item) {
                gameScene.removeChild(item);
            });

            gameScene.removeChild(st);
            st = addImage('assets/images/' + gameTurn + '/kick_2.png', 64, 145);
            setTimeout(function () {
                gameScene.removeChild(st);
                st = addImage('assets/images/' + gameTurn + '/kick_3.png', 84, 145);

                let goal = randMissOrGoal();
                if (gameTurn === PLAYER_TURN) {
                    moveTo = tapPosition[index].position.click;
                    moveToX = !goal && moveTo !== 5 ? tapPosition[index].position.ball.x_over : tapPosition[index].position.ball.x;
                    moveToY = !goal && moveTo !== 5 ? tapPosition[index].position.ball.y_over : tapPosition[index].position.ball.y;
                } else {
                    moveTo = randCpuPlace();
                    moveToX = !goal && moveTo !== 5 ? tapPosition['place_' + moveTo].position.ball.x_over : tapPosition['place_' + moveTo].position.ball.x;
                    moveToY = !goal && moveTo !== 5 ? tapPosition['place_' + moveTo].position.ball.y_over : tapPosition['place_' + moveTo].position.ball.y;
                }

                let moveBall = function () {
                    if (moveTo === 1 && ball.x > moveToX && ball.y > moveToY) {
                        ball.x -= 5.5*0.6;
                        ball.y -= 11.5*0.6;
                        ball.scale.set(0.73);
                    } else if (moveTo === 2 && ball.x <= moveToX && ball.y > moveToY) {
                        if (ball.x !== moveToX) {
                            ball.x += 2*0.4;
                            ball.scale.set(0.73);
                        }
                        ball.y -= 30*0.37;
                    } else if (moveTo === 3 && ball.x < moveToX && ball.y > moveToY) {
                        ball.x += 13*0.4;
                        ball.y -= 25*0.4;
                        ball.scale.set(0.73);
                    } else if (moveTo === 4 && ball.x > moveToX && ball.y > moveToY) {
                        ball.x -= 10*0.4;
                        ball.y -= 14*0.4;
                        ball.scale.set(0.73);
                    } else if (moveTo === 5 && ball.x < moveToX && ball.y > moveToY) {
                        ball.x += 2;
                        ball.y -= 16;
                        ball.scale.set(0.73);
                    } else if (moveTo === 6 && ball.x < moveToX && ball.y > moveToY) {
                        ball.x += 10*0.5;
                        ball.y -= 10*0.5;
                        ball.scale.set(0.73);
                    } else {
                        app.ticker.remove(moveBall);
                        if (gameTurn === PLAYER_TURN) {
                            renderDefend('cpu', defend, randCpuPlace(), tapPosition[index].position.click, goal, ball);
                        } else {
                            renderDefend('player', defend, tapPosition[index].position.click, moveTo, goal, ball);
                        }
                    }
                };
                app.ticker.add(moveBall);
            }, 230);
        });

        gamePlace.push(position);
    });
    // Turn of Cpu & Player
    let defend = addImage(gameTurn === PLAYER_TURN ? 'assets/images/cpu/gk_def.png' : 'assets/images/player/gk_def.png', 90, 143);
    defend.anchor.y = 1
    let swap = false;
    let moveDefender = function () {

        if (defend.scale.y < 1.01 && !swap) {
            defend.scale.y += 0.001;

        } else {
            swap = true;
        }
        if (defend.scale.y > 0.98 && swap) {
            defend.scale.y -= 0.001;
        } else {
            swap = false;
        }


    };
    app.ticker.add(moveDefender);
    let st = addImage('assets/images/' + gameTurn + '/kick_1.png', 60, 145);
    let ball = addImage('assets/images/share/ball_1.png', 100, 195);
    ball.scale.set(0.9)

    let text;
    Object.keys(tapPosition).forEach(function (index) {
        if (gameTurn === CPU_TURN) {
            text = addText(tapPosition[index].title.text, {
                fontSize: 96,
                fill: '#FFFFFF',
                stroke: '#e5a328',
                // e5a328
                strokeThickness: 16
            }, tapPosition[index].title.x, tapPosition[index].title.y);
        }
        if (gameTurn === PLAYER_TURN) {
            text = addText(tapPosition[index].title.text, {
                fontSize: 96,
                fill: '#FFFFFF',
                stroke: '#ff5642',
                // e5a328
                strokeThickness: 16
            }, tapPosition[index].title.x, tapPosition[index].title.y);
        }
        text.scale.set(0.25)
        gamePlaceText.push(text);

    });

    // Create Board Score
    let score_board_game = addImage('assets/images/share/score_board.png', 142, 188);
    score_board_game.scale.set(0.235);
    renderScoreBoard(null);
}