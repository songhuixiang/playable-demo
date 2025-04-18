import { _decorator, CCFloat, Component, Node, tween, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BreathEffect")
export class BreathEffect extends Component {
    @property({ type: Node })
    targetNode: Node = null; // 目标节点

    @property({ type: CCFloat })
    duration: number = 1; // 动画持续时间

    @property({ type: CCFloat })
    scaleFactor: number = 0.1; // 缩放因子

    start() {
        // 启动呼吸动画
        this.breath();
    }

    breath() {
        // 创建缩放动画
        const scaleUp = tween(this.targetNode).to(
            this.duration / 2,
            { scale: new Vec3(1 + this.scaleFactor, 1 + this.scaleFactor, 1) },
            { easing: "sineInOut" }
        );
        const scaleDown = tween(this.targetNode).to(this.duration / 2, { scale: new Vec3(1, 1, 1) }, { easing: "sineInOut" });

        // 循环播放缩放动画
        tween(this.targetNode).sequence(scaleUp, scaleDown).repeatForever().start();
    }
}
