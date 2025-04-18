import { _decorator, Component, Node, Quat } from "cc";
const { ccclass, property } = _decorator;

@ccclass("RotateAroundParent")
export class RotateAroundParent extends Component {
    @property(Node)
    parentNode: Node = null; // 父节点

    @property(Node)
    childNode: Node = null; // 子节点

    @property
    rotationSpeed: number = 60; // 旋转速度（度/秒）

    private quat: Quat = new Quat(); // 创建一个四元数用于旋转

    update(dt: number) {
        // 计算旋转角度
        let rotationAngle = this.rotationSpeed * dt;

        // 将旋转角度转换为四元数
        Quat.fromEuler(this.quat, 0, rotationAngle, 0);

        // 将四元数应用到父节点的旋转上
        let parentRotation = Quat.clone(this.parentNode.rotation);
        Quat.multiply(parentRotation, this.quat, parentRotation);
        this.parentNode.rotation = parentRotation;

        // 让子节点保持不动
    }
}
