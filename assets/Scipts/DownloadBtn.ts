import { _decorator, Component } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DownloadBtn")
export class DownloadBtn extends Component {
    start() {}

    click() {
        try {
            PlayableSDK.game_end();
            PlayableSDK.download();
        } catch (error) {
            console.warn(error);
        }
    }
}
