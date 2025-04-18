import { _decorator, Camera, Component, geometry, instantiate, Node, PhysicsSystem, UITransform, v3, Vec3 } from "cc";
import { AUDIO_CLIP } from "./AudioController";
import { Ball, BALL_COLOR } from "./Ball";
import {
    ballColorChangeEvent,
    equipBallEvent,
    hideGuideLineEvent,
    launchBallEvent,
    playAudioEvent,
    showGuideLineEvent,
    swapColorBallEvent,
    throwBallCollidedEvent,
} from "./GameEvent";
import { GameManager } from "./GameManager";
import { GuideLine } from "./GuideLine";
import { THROW_BALL_STATE, ThrowBall } from "./ThrowBall";
import { getRandomElement } from "./Utils";
const { ccclass, property } = _decorator;

const randomBalls = [BALL_COLOR.DarkBlue, BALL_COLOR.Yellow, BALL_COLOR.Red];
let throwBalls = [BALL_COLOR.DarkBlue, BALL_COLOR.Yellow, BALL_COLOR.Red, BALL_COLOR.Yellow, BALL_COLOR.Yellow];

@ccclass("Thrower")
export class Thrower extends Component {
    @property(Node)
    throwBallTemplate: Node = null;

    throwBall: ThrowBall = null;

    @property(GameManager)
    gameManager: GameManager = null;

    @property({ type: Camera })
    mainCamera: Camera = null; // 相机组件

    @property({ type: UITransform })
    uiTransform: UITransform = null;

    @property(GuideLine)
    guideLine: GuideLine = null;

    readonly SPEED: number = 40; // 移动速度（单位/秒）

    private moving = false;

    private direction: Vec3 = new Vec3(); // 运动方向

    private throwBallScreenPosition: Vec3 = null; // 球在屏幕上的位置

    private guideLineVisible = false;

    // private throwBall: ThrowBall;

    start() {
        this.init();
        this.equipBall();
        launchBallEvent.on((touchPoint) => {
            if (this.throwBall.node.active === false) return;
            if (this.moving) return;
            this.launch(touchPoint);
        });
        equipBallEvent.on(() => {
            this.equipBall();
        });
        showGuideLineEvent.on((touchPoint) => {
            if (this.guideLineVisible) return;
            this.drawGuideLine(touchPoint);
        });
        hideGuideLineEvent.on(() => {
            if (this.guideLineVisible === false) return;
            this.eraseGuideLine();
        });
        swapColorBallEvent.on(() => {
            this.swapColor();
        });
    }

    init() {
        this.throwBall = instantiate(this.throwBallTemplate).getComponent(ThrowBall);
        this.throwBall.node.parent = this.node;
        this.throwBall.node.scale = v3(this.gameManager.BALL_NODE_SIZE, this.gameManager.BALL_NODE_SIZE, this.gameManager.BALL_NODE_SIZE);
        this.throwBall.setCollidedCallback((collidedBall) => {
            this.handleCollided(this.throwBall, collidedBall);
        });
    }

    getRandomColor(exclude?: BALL_COLOR): BALL_COLOR {
        const array = [BALL_COLOR.DarkBlue, BALL_COLOR.Red, BALL_COLOR.Yellow];
        return getRandomElement(array, exclude);
    }

    swapColor() {
        if (this.throwBall.state !== THROW_BALL_STATE.IDLE) return;
        const _color = this.getRandomColor(this.throwBall.getColor());
        this.throwBall.setColor(_color);
        ballColorChangeEvent.emit(_color);
    }

    equipBall() {
        this.throwBall.node.active = true;
        this.throwBall.state = THROW_BALL_STATE.IDLE;
        this.throwBall.node.setPosition(this.gameManager.getThrowerPosition());
        // let meshRenderer = this.throwBall.getComponent(MeshRenderer);
        // let _color = throwBalls.shift();
        // if (_color === undefined) {
        //     _color = random.pick(randomBalls);
        // }
        // meshRenderer.getMaterialInstance(0).setProperty("mainColor", convert2CCColor(_color));
        const _color = this.getRandomColor(this.throwBall.getColor());
        this.throwBall.setColor(_color);
        this.throwBall.triggerEnable(true);
        ballColorChangeEvent.emit(_color);
    }

    handleCollided(throwBall: ThrowBall, collidedBall?: Ball) {
        this.moving = false;
        setTimeout(() => {
            let worldPos = throwBall.node.worldPosition;
            this.throwBall.node.active = false;
            throwBallCollidedEvent.emit({ color: throwBall.getColor(), worldPosition: worldPos }, collidedBall);
        });
    }

    drawGuideLine(endPoint: Vec3) {
        // console.log("handle guidle line");
        if (!this.throwBallScreenPosition) {
            this.throwBallScreenPosition = this.mainCamera.worldToScreen(this.throwBall.node.worldPosition);
        }
        const startPoint = v3(this.throwBallScreenPosition.x, this.throwBallScreenPosition.y, 0);
        const direction = endPoint.subtract(startPoint).normalize();

        const outRay = new geometry.Ray(
            this.throwBall.node.worldPosition.x,
            this.throwBall.node.worldPosition.y,
            this.throwBall.node.worldPosition.z,
            direction.x,
            direction.y,
            direction.z
        );
        const mask = 1 << 1;
        const maxDistance = 100000;
        const queryTrigger = false;
        // if (PhysicsSystem.instance.sweepSphereClosest(outRay, this.throwBall.node.scale.x, mask, maxDistance, queryTrigger)) {
        if (PhysicsSystem.instance.raycastClosest(outRay, mask, maxDistance, queryTrigger)) {
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            const hitPoint = raycastClosestResult.hitPoint;
            // const hitNormal = raycastClosestResult.hitNormal;
            // const collider = raycastClosestResult.collider;
            // const distance = raycastClosestResult.distance;
            // console.log("collider ", collider);
            // console.log("distance ", distance);
            this.guideLine.drawLine(this.throwBall.getColor(), this.throwBall.node.worldPosition, hitPoint);
            this.guideLineVisible = true;
        }
    }

    eraseGuideLine() {
        this.guideLine.node.active = false;
        this.guideLineVisible = false;
    }

    launch(endPoint: Vec3) {
        if (!this.throwBallScreenPosition) {
            this.throwBallScreenPosition = this.mainCamera.worldToScreen(this.throwBall.node.worldPosition);
        }
        const startPoint = v3(this.throwBallScreenPosition.x, this.throwBallScreenPosition.y, 0);
        if (endPoint.y - startPoint.y < -30) return;
        this.direction = endPoint.subtract(startPoint).normalize();

        this.moving = true;
        this.throwBall.state = THROW_BALL_STATE.MOVING;
        playAudioEvent.emit(AUDIO_CLIP.shoot);
    }

    // checkToTop() {
    //     if (
    //         this.throwBall.node.position.y >= 0 &&
    //         this.throwBall.node.position.x <= this.gameManager.MAX_X &&
    //         this.throwBall.node.position.x >= this.gameManager.MIN_X
    //     ) {
    //         // 到达顶部
    //         this.handleCollided(this.throwBall);
    //         return true;
    //     }
    //     return false;
    // }

    checkOutTower() {
        if (
            this.throwBall.node.position.y >= 0 ||
            this.throwBall.node.position.x > this.gameManager.MAX_X * 2 ||
            this.throwBall.node.position.x < this.gameManager.MIN_X * 2
        ) {
            this.moving = false;
            this.equipBall();
            return true;
        }
        return false;
    }

    update(dt: number) {
        if (this.moving === false) return;

        // 计算每帧移动的距离
        const distanceToMove = this.SPEED * dt;

        // 计算下一帧的位置并设置物体位置
        this.throwBall.node.position = this.throwBall.node.position.add(this.direction.clone().multiplyScalar(distanceToMove));

        if (this.checkOutTower()) return;
        // this.checkToTop();
    }
}
