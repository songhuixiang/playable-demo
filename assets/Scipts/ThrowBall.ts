import { _decorator, Component, ITriggerEvent, Material, MeshRenderer, SphereCollider } from "cc";
import { Ball, BALL_COLOR, BALL_STATE } from "./Ball";
import { gameEndEvent } from "./GameEvent";
const { ccclass, property } = _decorator;

export enum THROW_BALL_STATE {
    IDLE,
    MOVING,
}

@ccclass("ThrowBall")
export class ThrowBall extends Component {
    @property({ type: [Material] })
    materials: Material[] = []; // 新的材质数组

    private collidedCallback: (ball: Ball) => void;
    private color: BALL_COLOR;
    state: THROW_BALL_STATE;

    setColor(color: BALL_COLOR) {
        this.color = color;
        this.setMaterial(color);
    }

    getColor() {
        return this.color;
    }

    private setMaterial(color: BALL_COLOR) {
        let material: Material;
        switch (color) {
            case BALL_COLOR.DarkBlue:
                material = this.materials[0];
                break;
            case BALL_COLOR.Green:
                material = this.materials[1];
                break;
            case BALL_COLOR.Yellow:
                material = this.materials[2];
                break;
            case BALL_COLOR.Red:
                material = this.materials[3];
                break;
            case BALL_COLOR.Purple:
                material = this.materials[4];
                break;
        }
        const meshRenderer = this.node.getComponent(MeshRenderer);
        meshRenderer.material = material;
    }

    setCollidedCallback(collidedCallback: (collidedBall: Ball) => void) {
        this.collidedCallback = collidedCallback;
    }

    triggerEnable(enable: boolean) {
        let collider = this.node.getComponent(SphereCollider);
        if (enable) {
            collider.on("onTriggerEnter", this.onTriggerEnter, this);
        } else {
            collider.off("onTriggerEnter", this.onTriggerEnter, this);
        }
    }

    private onTriggerEnter(event: ITriggerEvent) {
        let ball = event.otherCollider.node.getComponent(Ball);
        if (ball.state !== BALL_STATE.NORMAL) return;
        if (this.state === THROW_BALL_STATE.IDLE) {
            gameEndEvent.emit();
            return;
        }
        // console.log("onTriggerEnter:", event);
        this.triggerEnable(false);
        this.collidedCallback && this.collidedCallback(ball);
    }

    update(deltaTime: number) {}
}
