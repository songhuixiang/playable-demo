import { _decorator, Color, Component, MeshRenderer } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ColorObject")
export class ColorObject extends Component {
    @property(Color)
    color: Color = null;

    start() {
        let meshRenderer = this.getComponent(MeshRenderer);
        meshRenderer.getMaterialInstance(0).setProperty("mainColor", this.color);
    }

    update(deltaTime: number) {}
}
