import { _decorator, Color, Component, CurveRange, GradientRange, Line, v2, Vec3 } from "cc";
import { BALL_COLOR, convert2CCColor } from "./Ball";
const { ccclass, property } = _decorator;

@ccclass("GuideLine")
export class GuideLine extends Component {
    @property(Line)
    line: Line = null;

    private gradientRange: GradientRange = null;
    private curveRange: CurveRange = null;
    private tileUnit: number = 12 / 5.410973964074998;

    start() {
        this.gradientRange = new GradientRange();
        this.gradientRange.mode = GradientRange.Mode.Color;
        this.gradientRange.color = Color.WHITE;
        this.line.color = this.gradientRange;

        this.curveRange = new CurveRange();
        this.curveRange.mode = CurveRange.Mode.Constant;
        this.curveRange.constant = 0.5;
        this.line.width = this.curveRange;
    }

    drawLine(color: BALL_COLOR, startPos: Vec3, endPos: Vec3) {
        this.node.active = true;
        this.line.positions = [startPos, endPos];
        this.gradientRange.color = convert2CCColor(color);
        this.line.color = this.gradientRange;

        const length = startPos.clone().subtract(endPos).length();
        this.line.tile = v2(Math.floor(length * this.tileUnit), 1);
    }
}
