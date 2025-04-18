import { _decorator, Component, Node, tween } from "cc";
import { gameEndEvent, playAudioEvent } from "./GameEvent";
import { AUDIO_CLIP } from "./AudioController";
const { ccclass, property } = _decorator;

@ccclass("UIController")
export class UIController extends Component {
    @property({ type: Node })
    downloadView: Node = null;

    @property({ type: Node })
    downloadBtn: Node = null;

    start() {
        gameEndEvent.on(() => {
            this.downloadBtn.active = false;
            this.downloadView.active = true;
            setTimeout(() => {
                playAudioEvent.emit(AUDIO_CLIP.win);
            }, 1000 * 0.2);
        });
    }

    update(deltaTime: number) {}
}
