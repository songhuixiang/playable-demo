import { _decorator, Component, misc, Node, v3, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
    @property(Node)
    tower: Node = null;

    private readonly BALL_SIZE = 1;
    readonly BALL_COUNT = 25;
    readonly BALL_NODE_SIZE = this.BALL_SIZE * 1.08;

    private readonly EVEN_POINTS: Vec3[] = [];
    private readonly ODD_POINTS: Vec3[] = [];

    private readonly ROW_SPACE: number = Math.sin(misc.degreesToRadians(60)) * this.BALL_SIZE;

    MIN_X: number = Number.MAX_SAFE_INTEGER;
    MAX_X: number = Number.MIN_SAFE_INTEGER;

    start() {
        this.createPoints(this.EVEN_POINTS);
        this.createPoints(this.ODD_POINTS, true);
    }

    grid2Position(row: number, col: number): Vec3 {
        let points = row % 2 === 0 ? this.EVEN_POINTS : this.ODD_POINTS;
        let position = Vec3.clone(points[col]);
        return v3(position.x, position.y - row * this.ROW_SPACE, position.z);
    }

    getThrowerPosition() {
        return this.grid2Position(22, 0).add(v3(0, 1, 0));
    }

    private setTowerSize(radius: number) {
        let towerSize = (radius - this.BALL_SIZE / 2) * 2;
        this.tower.scale = v3(towerSize, towerSize * 2, towerSize);
    }

    private getRadius() {
        let n = this.BALL_COUNT; // 等分数量
        let distance = this.BALL_SIZE; // 分割点间距
        // 计算等分角
        let angle = 360 / n;

        // 将角度转换为弧度
        let radians = misc.degreesToRadians(angle);

        // 计算夹角的余弦值
        let cosC = Math.cos(radians);

        // 计算半径的平方
        let radiusSquare = (2 * (distance / 2) ** 2) / (1 - cosC);

        // 计算半径
        let radius = Math.sqrt(radiusSquare);
        // console.log("半径为:", radius);
        return radius;
    }

    private createPoints(points: Vec3[], odd = false) {
        // 定义圆心坐标和半径
        let center = v3(0, 0, 0);
        let radius = this.getRadius();
        this.setTowerSize(radius);

        // 定义等分数量
        let n = this.BALL_COUNT;

        // 计算角度增量
        let angleIncrement = 360 / n;

        let offset = 0;
        if (odd) {
            offset = angleIncrement / 2;
        }

        // 计算每个分割点的坐标
        for (let i = 0; i < n; i++) {
            // 计算当前角度
            let angle = (i + 0.5) * angleIncrement - offset;

            // 将角度转换为弧度
            let radians = misc.degreesToRadians(angle);

            // 计算分割点的坐标
            let x = center.x + radius * Math.cos(radians);
            let y = center.y;
            let z = center.z + radius * Math.sin(radians);

            if (x < this.MIN_X) {
                this.MIN_X = x;
            }
            if (x > this.MAX_X) {
                this.MAX_X = x;
            }
            // 将坐标添加到数组中
            points.push(v3(x, y, z));
        }

        points.reverse();

        this.initBallPlace(points);

        // 打印每个分割点的坐标;
        // for (let i = 0; i < points.length; i++) {
        //     console.log(`Point ${i + 1}: (${points[i].x}, ${points[i].y}, ${points[i].z})`);
        // }

        return points;
    }

    private initBallPlace(arr: any[], place = 0) {
        let n = 7 + place;
        for (let i = 0; i < n; i++) {
            let lastItem = arr.pop();
            arr.unshift(lastItem);
        }
    }
}
