import { _decorator, CCFloat, Component, Node, Quat, tween, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("TreasureBoxEffect")
export class TreasureBoxEffect extends Component {
    @property({ type: Node })
    treasureBox: Node = null; // 宝箱节点

    @property({ type: Node })
    openedBox: Node = null; // 宝箱节点

    @property({ type: Node })
    light1: Node = null; // 宝箱节点

    @property({ type: Node })
    lgith2: Node = null; // 宝箱节点

    @property({ type: CCFloat })
    duration: number = 1; // 动画持续时间

    @property({ type: CCFloat })
    jumpHeight: number = 100;

    start() {
        // 启动宝箱蹦出动画
        setTimeout(() => {
            this.bounceOut();
        });
    }

    bounceOut() {
        const startPos = this.treasureBox.position.clone(); // 记录宝箱初始位置
        const endPos = startPos.clone().add(new Vec3(0, this.jumpHeight, 0)); // 宝箱蹦出后的目标位置

        // 创建宝箱蹦出动画
        tween(this.treasureBox)
            .to(this.duration * 0.5, { position: endPos }, { easing: "sineOut" })
            .to(this.duration * 0.5, { position: startPos }, { easing: "bounceOut" })
            .call(() => {
                // openBoxEvent.emit();
                this.treasureBox.active = false;
                this.openedBox.active = true;
                this.lgith2.active = true;
                this.light1.active = true;
            })
            .start();
    }
}
