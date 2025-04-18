import { Component, JsonAsset, Node, Quat, _decorator, instantiate, v3 } from "cc";
import { BALL_COLOR, Ball, GRID } from "./Ball";
import { ThrowBallData, equipBallEvent, shakeEffectEvent, throwBallCollidedEvent } from "./GameEvent";
import { GameManager } from "./GameManager";
import { customIncludes, distanceBetweenPoints } from "./Utils";
const { ccclass, property } = _decorator;

const directionsOdd = [
    [-1, 0], // 上左
    [-1, 1], // 上右
    [0, -1], // 左
    [0, 1], // 右
    [1, 0], // 下左
    [1, 1], // 下右
];

const directionsEven = [
    [-1, -1], // 上左
    [-1, 0], // 上右
    [0, -1], // 左
    [0, 1], // 右
    [1, -1], // 下左
    [1, 0], // 下右
];

interface IBallConfig {
    row: number;
    col: number;
    color: BALL_COLOR;
}

@ccclass("BallManager")
export class BallManager extends Component {
    @property(Node)
    ballTemplate: Node = null;

    @property(GameManager)
    gameManager: GameManager = null;

    @property(JsonAsset)
    ballConfigJson: JsonAsset = null!;

    ballConfigData: IBallConfig[];

    balls: Ball[] = [];

    start() {
        this.ballConfigData = this.ballConfigJson.json.balls!;
        this.drawBalls();
        throwBallCollidedEvent.on((throwBall, collidedball) => {
            shakeEffectEvent.emit();
            this.placeBall(throwBall, collidedball);
        });
    }

    getNeighbors(row: number, col: number): Ball[] {
        const neighbors: Ball[] = [];
        const directions = row % 2 === 0 ? directionsEven : directionsOdd;
        for (const [dx, dy] of directions) {
            let newRow = row + dx;
            if (newRow < 0) continue;
            let newCol = col + dy;
            if (newCol < 0) newCol = this.gameManager.BALL_COUNT - 1;
            if (newCol > this.gameManager.BALL_COUNT - 1) newCol = 0;
            let ball = this.getBall(newRow, newCol);
            if (ball) {
                neighbors.push(ball);
            }
        }
        return neighbors;
    }

    getFreePlaces(row: number, col: number): GRID[] {
        const freePlaces: GRID[] = [];
        const directions = row % 2 === 0 ? directionsEven : directionsOdd;
        for (const [dx, dy] of directions) {
            let newRow = row + dx;
            if (newRow < 0) continue;
            let newCol = col + dy;
            if (newCol < 0) newCol = this.gameManager.BALL_COUNT - 1;
            if (newCol > this.gameManager.BALL_COUNT - 1) newCol = 0;
            let ball = this.getBall(newRow, newCol);
            if (!ball) {
                freePlaces.push({ row: newRow, col: newCol });
            }
        }
        return freePlaces;
    }

    getTopPlaces() {
        const topPlaces: GRID[] = [];
        for (let col = 0; col < this.gameManager.BALL_COUNT; col++) {
            topPlaces.push({ row: 0, col });
        }
        return topPlaces;
    }

    placeBall(throwBall: ThrowBallData, collidedball?: Ball) {
        let tempDis = Number.MAX_SAFE_INTEGER;
        let grid: GRID;
        let freePlaces: GRID[];
        if (collidedball) {
            freePlaces = this.getFreePlaces(collidedball.row, collidedball.col);
        } else {
            freePlaces = this.getTopPlaces();
        }
        let node = new Node();
        node.setParent(this.node);
        for (let index = 0; index < freePlaces.length; index++) {
            const element = freePlaces[index];
            let position = this.gameManager.grid2Position(element.row, element.col);
            node.position = position;
            let wp = node.worldPosition;
            let dis = distanceBetweenPoints(throwBall.worldPosition, wp);
            if (dis < tempDis) {
                tempDis = dis;
                grid = element;
            }
        }
        node.destroy();
        this.drawBall(grid.row, grid.col, throwBall.color);
        this.checkBallsRemoval(grid.row, grid.col);
        equipBallEvent.emit();
    }

    checkBallsRemoval(row: number, col: number) {
        const sameColorBalls = this.findSameColorBalls(row, col);
        if (sameColorBalls.length >= 3) {
            for (let index = 0; index < sameColorBalls.length; index++) {
                const ball = sameColorBalls[index];
                ball.handleBlast(index);
            }
            this.removeBalls(sameColorBalls);

            const suspendedBalls = this.findSuspendedBalls();
            if (suspendedBalls.length >= 1) {
                for (let index = 0; index < suspendedBalls.length; index++) {
                    const ball = suspendedBalls[index];
                    ball.handleFalling(index);
                }
                this.removeBalls(suspendedBalls);
            }
        }
    }

    removeBalls(removeBalls: Ball[]) {
        this.balls = this.balls.filter((item) => !customIncludes(removeBalls, item));
    }

    resetVisited() {
        for (let index = 0; index < this.balls.length; index++) {
            const ball = this.balls[index];
            ball.visited = false;
        }
    }

    resetConnectedToTop() {
        for (let index = 0; index < this.balls.length; index++) {
            const ball = this.balls[index];
            ball.connectedToTop = false;
        }
    }

    // 广度优先搜索查找与指定位置泡泡相邻的相同颜色泡泡
    findSameColorBalls(row: number, col: number): Ball[] {
        this.resetVisited();
        const queue: Ball[] = [];
        const sameColorBalls: Ball[] = [];
        let ball = this.getBall(row, col);
        const startColor = ball.color;

        queue.push(ball); // 将起始泡泡加入队列
        ball.visited = true; // 标记起始泡泡为已访问

        while (queue.length > 0) {
            const currentBall = queue.shift(); // 取出队列中的泡泡
            sameColorBalls.push(currentBall); // 将当前泡泡加入结果集

            // 获取当前泡泡的相邻泡泡
            const neighbors = this.getNeighbors(currentBall.row, currentBall.col);
            for (const neighbor of neighbors) {
                if (!neighbor.visited && neighbor.color === startColor) {
                    queue.push(neighbor); // 将相邻且颜色相同的泡泡加入队列
                    neighbor.visited = true; // 标记为已访问
                }
            }
        }
        return sameColorBalls;
    }

    // 使用DFS搜索是否与顶部相连
    isConnectedToTop(ball: Ball): boolean {
        // 已经被访问过，返回 false
        if (ball.visited) return false;

        // 如果泡泡位于最顶上一行，返回 true
        if (ball.row === 0) return true;

        // 标记当前泡泡为已访问
        ball.visited = true;

        // 获取当前泡泡的相邻泡泡
        const neighbors = this.getNeighbors(ball.row, ball.col);

        // 递归搜索相邻泡泡
        for (const neighbor of neighbors) {
            if (this.isConnectedToTop(neighbor)) {
                ball.connectedToTop = true;
                return true;
            }
        }

        return false;
    }

    // 找出悬空泡泡
    findSuspendedBalls(): Ball[] {
        this.resetConnectedToTop();
        const suspendedBalls: Ball[] = [];

        for (let index = 0; index < this.balls.length; index++) {
            const ball = this.balls[index];
            if (ball.connectedToTop) continue;
            this.resetVisited();
            //不与顶部相连，加入悬空泡泡数组
            if (!this.isConnectedToTop(ball)) {
                suspendedBalls.push(ball);
            }
        }
        return suspendedBalls;
    }

    drawBall(row: number, col: number, color: BALL_COLOR) {
        let ballNode = instantiate(this.ballTemplate);
        ballNode.name = `Ball_${row}_${col}`;
        ballNode.scale = v3(this.gameManager.BALL_NODE_SIZE, this.gameManager.BALL_NODE_SIZE, this.gameManager.BALL_NODE_SIZE);
        ballNode.setParent(this.node);

        let position = this.gameManager.grid2Position(row, col);
        ballNode.setPosition(position);

        // 加载纹理资源
        // resources.load(`balls/${color}`, Texture2D, (err, texture) => {
        //     if (err) {
        //         console.error("Failed to load texture:", err);
        //         return;
        //     }
        //     let meshRenderer = ballNode.getComponent(MeshRenderer);
        //     meshRenderer.getMaterialInstance(0).setProperty("mainTexture", texture);
        // });

        let ball = ballNode.getComponent(Ball);
        ball.init(color, row, col);
        this.balls.push(ball);
    }

    drawBalls() {
        for (let index = 0; index < this.ballConfigData.length; index++) {
            const config = this.ballConfigData[index];
            this.drawBall(config.row, config.col, config.color);
        }
        // let rows = 2;
        // for (let row = 0; row < rows; row++) {
        //     for (let col = 0; col < this.gameManager.BALL_COUNT; col++) {
        //         let colors = [BALL_COLOR.DarkBlue, BALL_COLOR.LightBlue, BALL_COLOR.Yellow, BALL_COLOR.Orange, BALL_COLOR.Purple, BALL_COLOR.Pink];
        //         let ballColor = random.pick(colors);
        //         if (col === 0) {
        //             ballColor = BALL_COLOR.Red;
        //         }
        //         this.drawBall(row, col, ballColor);
        //     }
        // }
    }

    getBall(row: number, col: number): Ball {
        for (let index = 0; index < this.balls.length; index++) {
            const element = this.balls[index];
            if (element.row === row && element.col === col) {
                return element;
            }
        }
    }

    @property
    rotationSpeed: number = 60; // 旋转速度（度/秒）
    private quat: Quat = new Quat(); // 创建一个四元数用于旋转

    // update(dt: number) {
    //     // 计算旋转角度
    //     let rotationAngle = this.rotationSpeed * dt;

    //     // 将旋转角度转换为四元数
    //     Quat.fromEuler(this.quat, 0, rotationAngle, 0);

    //     // 将四元数应用到父节点的旋转上
    //     let parentRotation = Quat.clone(this.node.rotation);
    //     Quat.multiply(parentRotation, this.quat, parentRotation);
    //     this.node.rotation = parentRotation;
    // }
}
