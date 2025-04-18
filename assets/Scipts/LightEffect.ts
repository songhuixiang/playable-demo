import { _decorator, CCFloat, Component, Node, tween, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LightEffect")
export class LightEffect extends Component {
    @property({ type: Node })
    lightEffect: Node = null; // 光效节点

    @property({ type: CCFloat })
    rotationSpeed: number = 90; // 旋转速度，每秒旋转的角度

    start() {
        // 启动光效旋转动画
        this.rotateLight();
    }

    rotateLight() {
        // 创建光效旋转动画
        tween(this.lightEffect)
            .repeatForever(
                tween().by(1, { eulerAngles: new Vec3(0, 0, this.rotationSpeed) }) // 每秒旋转 rotationSpeed 度
            )
            .start();
    }
}
