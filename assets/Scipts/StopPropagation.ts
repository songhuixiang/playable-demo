import { _decorator, Component, EventTouch, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("StopPropagation")
export class StopPropagation extends Component {
    @property({ type: Node })
    maskNode: Node = null; // 遮罩节点

    onLoad() {
        // 在遮罩节点上添加点击事件监听器
        this.maskNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.maskNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.maskNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.maskNode.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDestroy() {
        // 移除遮罩节点上的点击事件监听器
        this.maskNode.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.maskNode.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.maskNode.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.maskNode.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {
        event.propagationStopped = true;
        try {
            PlayableSDK.game_end();
            PlayableSDK.download();
        } catch (error) {
            console.warn(error);
        }
    }

    onTouchMove(event: EventTouch) {
        event.propagationStopped = true;
    }

    onTouchEnd(event: EventTouch) {
        event.propagationStopped = true;
    }

    onTouchCancel(event: EventTouch) {
        event.propagationStopped = true;
    }
}
