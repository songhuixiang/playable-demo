import { _decorator, CCFloat, Component, Node, tween, Vec3 } from "cc";
import { shakeEffectEvent } from "./GameEvent";
const { ccclass, property } = _decorator;

@ccclass("ShakeEffect")
export class ShakeEffect extends Component {
    @property({ type: Node })
    targetNode: Node = null; // 目标节点

    @property({ type: CCFloat })
    duration: number = 0.2; // 抖动持续时间

    @property({ type: CCFloat })
    strength: number = 0.1; // 抖动强度

    protected start(): void {
        shakeEffectEvent.on(() => {
            this.shake();
        });
    }

    shake() {
        // 使用 tween 创建抖动效果
        tween(this.targetNode)
            .by(this.duration, { position: new Vec3(0, this.strength, 0) }, { easing: "sineInOut" })
            .by(this.duration, { position: new Vec3(0, -this.strength * 2, 0) }, { easing: "sineInOut" })
            .by(this.duration, { position: new Vec3(0, this.strength, 0) }, { easing: "sineInOut" })
            .start();
    }
}
