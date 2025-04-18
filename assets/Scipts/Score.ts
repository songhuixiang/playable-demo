import { _decorator, Component, Label } from "cc";
import { gameEndEvent, getScoreEvent } from "./GameEvent";
const { ccclass, property } = _decorator;

@ccclass("Score")
export class Score extends Component {
    @property({ type: Label })
    scoreLabel: Label = null; // 遮罩节点

    score = 0;

    start() {
        this.scoreLabel.string = this.score.toString(); // 初始化分数为0
        getScoreEvent.on(() => {
            this.score++;
            this.scoreLabel.string = this.score.toString();
            if (this.score === 93) {
                gameEndEvent.emit();
            }
        });
    }

    update(deltaTime: number) {}
}
