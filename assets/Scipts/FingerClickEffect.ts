import { _decorator, CCFloat, Component, Node, tween, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("FingerClickEffect")
export class FingerClickEffect extends Component {
    @property({ type: CCFloat })
    duration: number = 0.5; // 单次动画持续时间

    @property({ type: CCFloat })
    scaleFactor: number = 1.2; // 放大缩小的比例

    start() {
        this.startClickEffect();
    }

    startClickEffect() {
        let r = 0.4;
        // 创建放大缩小动画
        tween(this.node)
            .to(this.duration, { scale: new Vec3(this.scaleFactor * r, this.scaleFactor * r, this.scaleFactor * r) })
            .to(this.duration, { scale: new Vec3(r, r, r) })
            .union()
            .repeatForever()
            .start();

        let angle = 10;
        // 创建旋转动画
        tween(this.node)
            .by(this.duration, { eulerAngles: new Vec3(0, 0, angle) })
            .by(this.duration, { eulerAngles: new Vec3(0, 0, -angle) })
            .union()
            .repeatForever()
            .start();
    }
}
