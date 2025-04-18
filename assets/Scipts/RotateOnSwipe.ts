import { _decorator, Color, Component, EventTouch, Node, Quat, Sprite, tween, v3, Vec2 } from "cc";
import { hideGuideLineEvent, launchBallEvent, showGuideLineEvent } from "./GameEvent";
const { ccclass, property } = _decorator;

@ccclass("RotateOnSwipe")
export class RotateOnSwipe extends Component {
    @property(Node)
    rotatingObject: Node = null; // 要旋转的物体节点

    @property(Node)
    towerBase: Node = null; // 要旋转的物体节点

    @property(Node)
    dragGuide: Node = null;

    @property(Node)
    tapGuide: Node = null;

    private isTouching: boolean = false; // 是否正在触摸
    private touchStartPos: Vec2 = Vec2.ZERO; // 触摸起始位置
    private isMoved = false;

    start() {
        // 监听触摸事件
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        // 记录触摸起始位置
        this.touchStartPos = event.getLocation();
        this.isTouching = true;
        this.isMoved = false;
        showGuideLineEvent.emit(v3(this.touchStartPos.x, this.touchStartPos.y, 0));
    }

    private quat: Quat = new Quat();
    onTouchMove(event: EventTouch) {
        if (!this.isTouching) return;
        this.isMoved = true;
        hideGuideLineEvent.emit();

        // 计算触摸移动的距离
        let delta = event.getLocation().subtract(this.touchStartPos);

        // 根据移动距离设置旋转角度
        let rotationAngle = delta.x * 0.2; // 调整旋转速度

        // 将旋转角度转换为四元数
        Quat.fromEuler(this.quat, 0, rotationAngle, 0);

        // 将四元数应用到父节点的旋转上
        let parentRotation = Quat.clone(this.rotatingObject.rotation);
        Quat.multiply(parentRotation, this.quat, parentRotation);
        this.rotatingObject.rotation = parentRotation;

        parentRotation = Quat.clone(this.towerBase.rotation);
        Quat.multiply(parentRotation, this.quat, parentRotation);
        this.towerBase.rotation = parentRotation;

        // 更新起始位置
        this.touchStartPos = event.getLocation();
    }

    onTouchEnd(event: EventTouch) {
        hideGuideLineEvent.emit();
        this.isTouching = false;
        if (this.isMoved === false) {
            if (this.dragGuide.isValid && this.dragGuide.active) return;
            const p = event.getLocation();
            launchBallEvent.emit(v3(p.x, p.y, 0));
            if (this.tapGuide.isValid) {
                tween(this.tapGuide.getComponent(Sprite))
                    .to(0.2, { color: new Color(255, 255, 255, 0) })
                    .call(() => {
                        this.tapGuide.destroy();
                    })
                    .start();
            }
        } else {
            if (this.dragGuide.isValid) {
                tween(this.dragGuide.getComponent(Sprite))
                    .to(0.2, { color: new Color(255, 255, 255, 0) })
                    .call(() => {
                        this.dragGuide.destroy();

                        this.tapGuide.active = true;
                        let tapSprite = this.tapGuide.getComponent(Sprite);
                        tapSprite.color = new Color(255, 255, 255, 0);
                        tween(tapSprite)
                            .to(0.2, { color: new Color(255, 255, 255, 255) })
                            .start();
                    })
                    .start();
            }
        }
    }
}
