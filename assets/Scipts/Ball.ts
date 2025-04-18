import { _decorator, Color, color, Component, Material, MeshRenderer, RigidBody } from "cc";
import { AUDIO_CLIP } from "./AudioController";
import { getScoreEvent, playAudioEvent } from "./GameEvent";
const { ccclass, property } = _decorator;

export const enum BALL_COLOR {
    None = 0,
    DarkBlue,
    LightBlue,
    Green,
    Purple,
    Red,
    Yellow,
    Star,
    Rainbow,
    Stone,
    Black,
    White,
    Orange,
    Pink,
}

export function convert2CCColor(ball_color: BALL_COLOR) {
    switch (ball_color) {
        case BALL_COLOR.DarkBlue:
            return color(42, 59, 215);
        case BALL_COLOR.Green:
            return Color.GREEN;
        case BALL_COLOR.LightBlue:
            return color(135, 206, 235);
        case BALL_COLOR.Purple:
            return color(126, 35, 223);
        case BALL_COLOR.Red:
            return color(209, 63, 57);
        case BALL_COLOR.Yellow:
            return color(199, 142, 57);
        case BALL_COLOR.White:
            return color(255, 141, 26);
        case BALL_COLOR.Orange:
            return color(238, 105, 26);
        case BALL_COLOR.Pink:
            return color(238, 82, 107);
        default:
            return Color.WHITE;
    }
}

export interface GRID {
    row: number;
    col: number;
}

export enum BALL_STATE {
    NORMAL,
    FALLING,
    BLAST,
}

@ccclass("Ball")
export class Ball extends Component {
    @property({ type: [Material] })
    materials: Material[] = []; // 新的材质数组

    color: BALL_COLOR;
    row: number;
    col: number;
    visited: boolean;
    connectedToTop: boolean;
    state: BALL_STATE = BALL_STATE.NORMAL;
    searchIndex: number;

    init(color: BALL_COLOR, row: number, col: number) {
        this.color = color;
        this.row = row;
        this.col = col;
        this.setMaterial(this.color);
    }

    setMaterial(color: BALL_COLOR) {
        let material: Material;
        switch (color) {
            case BALL_COLOR.DarkBlue:
                material = this.materials[0];
                break;
            case BALL_COLOR.Green:
                material = this.materials[1];
                break;
            case BALL_COLOR.Yellow:
                material = this.materials[2];
                break;
            case BALL_COLOR.Red:
                material = this.materials[3];
                break;
            case BALL_COLOR.Purple:
                material = this.materials[4];
                break;
        }
        const meshRenderer = this.node.getComponent(MeshRenderer);
        meshRenderer.material = material;
    }

    handleBlast(searchIndex: number) {
        this.state = BALL_STATE.BLAST;
        this.searchIndex = searchIndex;
        setTimeout(() => {
            let body = this.getComponent(RigidBody);
            body.type = RigidBody.Type.DYNAMIC;
            getScoreEvent.emit();
            if (this.searchIndex % 3 == 0) {
                playAudioEvent.emit(AUDIO_CLIP.hit);
            }
        }, this.searchIndex * 1000 * 0.02);
    }

    handleFalling(searchIndex: number) {
        this.state = BALL_STATE.FALLING;
        this.searchIndex = searchIndex;
        setTimeout(() => {
            let body = this.getComponent(RigidBody);
            body.type = RigidBody.Type.DYNAMIC;
            getScoreEvent.emit();
        }, this.searchIndex * 1000 * 0.02);
    }

    update(dt: number) {
        if (this.state === BALL_STATE.BLAST) {
            if (this.node.position.y < -30) {
                this.node.destroy();
            }
        } else if (this.state === BALL_STATE.FALLING) {
            if (this.node.position.y < -30) {
                this.node.destroy();
            }
        }
    }
}
