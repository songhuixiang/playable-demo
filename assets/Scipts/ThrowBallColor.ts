import { _decorator, Component, MeshRenderer } from "cc";
import { BALL_COLOR, convert2CCColor } from "./Ball";
import { ballColorChangeEvent } from "./GameEvent";
const { ccclass, property } = _decorator;

@ccclass("ThrowBallColor")
export class ThrowBallColor extends Component {
    start() {
        ballColorChangeEvent.on((color) => {
            this.setColor(color);
        });
    }

    setColor(color: BALL_COLOR) {
        let meshRenderer = this.getComponent(MeshRenderer);
        meshRenderer.getMaterialInstance(0).setProperty("mainColor", convert2CCColor(color));
    }
}
