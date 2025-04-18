import { _decorator, Component } from "cc";
import { swapColorBallEvent } from "./GameEvent";
const { ccclass, property } = _decorator;

@ccclass("SwapColor")
export class SwapColor extends Component {
    swap() {
        swapColorBallEvent.emit();
    }
}
