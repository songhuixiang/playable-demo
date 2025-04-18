import { _decorator, Component, misc, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CameraController")
export class CameraController extends Component {
    @property(Node)
    target: Node = null; // 摄像机的目标点

    @property
    radius: number = 20; // 圆的半径

    @property
    speed: number = 60; // 圆周运动的速度（角度每秒）

    private angle: number = 0; // 初始角度

    start() {
        // 设置摄像机的初始位置
        this.updateCameraPosition();
    }

    update(dt: number) {
        // 更新角度
        this.angle += this.speed * dt;

        // 保证角度在0~360度之间
        this.angle %= 360;

        // 根据角度更新摄像机位置
        this.updateCameraPosition();
    }

    updateCameraPosition() {
        // 计算摄像机位置
        let radian = misc.degreesToRadians(this.angle);
        let x = this.target.position.x + this.radius * Math.cos(radian);
        // let y = this.target.position.y + this.radius;
        // let y = this.target.position.y - this.radius;
        let y = this.target.position.y;
        let z = this.target.position.z + this.radius * Math.sin(radian);

        // 设置摄像机位置
        this.node.setPosition(x, y, z);

        // 摄像机看向目标点
        this.node.lookAt(this.target.position);
    }
}
