import { _decorator, CCFloat, Component, Node, tween, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LeftRightMovement")
export class LeftRightMovement extends Component {
    @property({ type: CCFloat })
    distance: number = 100; // 左右移动的距离

    @property({ type: CCFloat })
    duration: number = 2; // 每次移动的持续时间

    start() {
        // 启动左右移动动画
        this.moveLeftAndRight();
    }

    moveLeftAndRight() {
        // 创建左右移动动画序列
        tween(this.node)
            .repeatForever(
                tween()
                    .by(this.duration, { position: new Vec3(this.distance, 0, 0) }) // 向右移动 distance
                    .by(this.duration, { position: new Vec3(-this.distance, 0, 0) }) // 向左移动 distance
            )
            .start();
    }
}
