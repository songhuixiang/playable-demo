let Fs = require("fs");

let BallColors = {
    None: 0,
    DarkBlue: 1,
    LightBlue: 2,
    Green: 3,
    Purple: 4,
    Red: 5,
    Yellow: 6,
    Star: 7,
    Rainbow: 8,
    Stone: 9,
    Black: 10,
    White: 11,
    Orange: 12,
    Pink: 13,
};

let checkedColor = BallColors.DarkBlue;

const COL_MAX = 17;
const ROW_MAX = 41;
const FILE_PATH = `db://assets/configs/ball.json`;

let balls;
(function initBalls() {
    balls = [];
    for (let row = 0; row < ROW_MAX; row++) {
        let colMaxTmp = COL_MAX;
        if (row % 2 !== 0) {
            colMaxTmp = COL_MAX - 1;
        }
        for (let col = 0; col < colMaxTmp; col++) {
            balls.push({ row, col, color: BallColors.None });
        }
    }
})();

let bindingBalls;
(function initBindingBalls() {
    bindingBalls = {};
    for (let row = 0; row < ROW_MAX; row++) {
        let colMaxTmp = COL_MAX;
        if (row % 2 !== 0) {
            colMaxTmp = COL_MAX - 1;
        }
        for (let col = 0; col < colMaxTmp; col++) {
            let id = genID(row, col);
            bindingBalls[id] = `#${id}`;
        }
    }
})();

function getHexColor(ballColor) {
    switch (ballColor) {
        case BallColors.DarkBlue:
            return "#0000FF";
        case BallColors.LightBlue:
            return "#00BFFF";
        case BallColors.Green:
            return "#00FF00";
        case BallColors.Purple:
            return "#A020F0";
        case BallColors.Red:
            return "#FF0000";
        case BallColors.Yellow:
            return "#FFFF00";
        case BallColors.Star:
            return "#F8F8FF";
        case BallColors.None:
            return "#696969";
        case BallColors.Rainbow:
            return "#FFA500";
        case BallColors.Stone:
            return "#000000";
        case BallColors.Black:
            return "#000000";
        case BallColors.White:
            return "#ffffff";
        case BallColors.Orange:
            return "#DA5109";
        case BallColors.Pink:
            return "#E63A5E";
    }
}

function genID(row, col) {
    return `btn_${row}_${col}`;
}

function renderBalls() {
    let html = ``;
    let line = -1;
    for (let index = 0; index < balls.length; index++) {
        const ball = balls[index];
        const row = ball.row;
        const col = ball.col;
        if (line !== row) {
            if (index !== 0) {
                html += `</div>`;
            }
            if (row % 2 === 0) {
                html += `<div class="layout horizontal" style="margin:0px">`;
            } else {
                html += `<div class="layout horizontal" style="margin:0px 0px 0px 22px;">`;
            }
        }
        html += `<ui-button style="width: 44px; height:44px; -moz-border-radius:22px; -webkit-border-radius:22px; background:${getHexColor(
            ball.color
        )};" id=${genID(row, col)} data-enum-color=${ball.color}></ui-button>`;
        line = row;
    }
    return html;
}

let mousedown = false;

function ballAddClickListener(that) {
    for (let row = 0; row < ROW_MAX; row++) {
        let colMaxTmp = COL_MAX;
        if (row % 2 !== 0) {
            colMaxTmp = COL_MAX - 1;
        }
        for (let col = 0; col < colMaxTmp; col++) {
            that[`$${genID(row, col)}`].addEventListener("click", () => {
                that[`$${genID(row, col)}`].style.background = getHexColor(checkedColor);
                that[`$${genID(row, col)}`].dataset.enumColor = `${checkedColor}`;
                mousedown = !mousedown;
            });
            that[`$${genID(row, col)}`].addEventListener("mouseover", () => {
                if (mousedown === false) return;
                that[`$${genID(row, col)}`].style.background = getHexColor(checkedColor);
                that[`$${genID(row, col)}`].dataset.enumColor = `${checkedColor}`;
            });
        }
    }
}

function initOptions() {
    let html = "";
    for (const property in BallColors) {
        const value = BallColors[property];
        html += `<option value="${value}" style="background:${getHexColor(value)}">${property}</option>`;
    }
    return html;
}

exports.template = `
<div style="margin:50px"></div>
<div class="layout horizontal">
<ui-select id=select value="${checkedColor}" class="massive" style="background:${getHexColor(checkedColor)}">
    ${initOptions()}
</ui-select>
<div style="margin:0px 20px 0px 20px"></div>
<ui-button id=save class="massive">保存</ui-button>
<div style="margin:0px 20px 0px 20px"></div>
<ui-button id=clean class="massive">清除所有</ui-button>
</div>
<div style="margin:50px"></div>
<div class="layout vertical" style="overflow: -moz-scrollbars-vertical; overflow-y: scroll; height: 1000px">
${renderBalls()}
</div>
`;

exports.style = `
:host { margin: 5px; }
h2 { color: #f90; }
`;

exports.$ = { select: "#select", save: "#save", clean: "#clean", ...bindingBalls };

exports.ready = async function () {
    ballAddClickListener(this);

    Editor.assetdb.queryAssets(FILE_PATH, "json", (err, results) => {
        if (results.length > 0) {
            try {
                let config = Fs.readFileSync(Editor.url(FILE_PATH, "utf8"));
                let balls = JSON.parse(config).balls;
                for (let index = 0; index < balls.length; index++) {
                    const ball = balls[index];
                    this[`$${genID(ball.row, ball.col)}`].style.background = getHexColor(ball.color);
                    this[`$${genID(ball.row, ball.col)}`].dataset.enumColor = `${ball.color}`;
                }
            } catch (error) {
                Editor.error(error);
            }
        } else {
            let data = { balls: [] };
            Editor.assetdb.createOrSave(FILE_PATH, JSON.stringify(data, undefined, 2), (err, results) => {
                Editor.log("create " + FILE_PATH);
            });
        }
    });

    this.$select.addEventListener("confirm", (option) => {
        let value = option.detail.value - 0;
        checkedColor = value;
        this.$select.style.background = getHexColor(checkedColor);
    });

    this.$clean.addEventListener("confirm", (option) => {
        for (let row = 0; row < ROW_MAX; row++) {
            let colMaxTmp = COL_MAX;
            if (row % 2 !== 0) {
                colMaxTmp = COL_MAX - 1;
            }
            for (let col = 0; col < colMaxTmp; col++) {
                this[`$${genID(row, col)}`].style.background = getHexColor(BallColors.None);
                this[`$${genID(row, col)}`].dataset.enumColor = `${BallColors.None}`;
            }
        }
    });

    this.$save.addEventListener("confirm", () => {
        let data = { balls: [] };
        for (let row = 0; row < ROW_MAX; row++) {
            let colMaxTmp = COL_MAX;
            if (row % 2 !== 0) {
                colMaxTmp = COL_MAX - 1;
            }
            for (let col = 0; col < colMaxTmp; col++) {
                let color = this[`$${genID(row, col)}`].dataset.enumColor;
                if (color - 0 !== BallColors.None) {
                    data.balls.push({ row, col, color: color - 0 });
                }
            }
        }
        Editor.assetdb.createOrSave(FILE_PATH, JSON.stringify(data, undefined, 2), (err, results) => {
            Editor.log("save successful");
        });
    });
};
// panel/index.js, this filename needs to match the one registered in package.json
// Editor.Panel.define({
//     // css style for panel
//     style: `
//     :host { margin: 5px; }
//     h2 { color: #f90; }
//   `,

//     // html template for panel
//     template: `
// 	<div style="margin:50px"></div>
//     <div class="layout horizontal">
// 	<ui-select id=select value="${checkedColor}" class="massive" style="background:${getHexColor(checkedColor)}">
// 		${initOptions()}
// 	</ui-select>
// 	<div style="margin:0px 20px 0px 20px"></div>
// 	<ui-button id=save class="massive">保存</ui-button>
// 	<div style="margin:0px 20px 0px 20px"></div>
// 	<ui-button id=clean class="massive">清除所有</ui-button>
// 	</div>
// 	<div style="margin:50px"></div>
//     <div class="layout vertical" style="overflow: -moz-scrollbars-vertical; overflow-y: scroll; height: 1000px">
//     ${renderBalls()}
//     </div>
//   `,

//     // element and variable binding
//     $: { select: "#select", save: "#save", clean: "#clean", ...bindingBalls },

//     // method executed when template and styles are successfully loaded and initialized
//     ready() {
//         ballAddClickListener(this);

//         Editor.assetdb.queryAssets(FILE_PATH, "json", (err, results) => {
//             if (results.length > 0) {
//                 try {
//                     let config = Fs.readFileSync(Editor.url(FILE_PATH, "utf8"));
//                     let balls = JSON.parse(config).balls;
//                     for (let index = 0; index < balls.length; index++) {
//                         const ball = balls[index];
//                         this[`$${genID(ball.row, ball.col)}`].style.background = getHexColor(ball.color);
//                         this[`$${genID(ball.row, ball.col)}`].dataset.enumColor = `${ball.color}`;
//                     }
//                 } catch (error) {
//                     Editor.error(error);
//                 }
//             } else {
//                 let data = { balls: [] };
//                 Editor.assetdb.createOrSave(FILE_PATH, JSON.stringify(data, undefined, 2), (err, results) => {
//                     Editor.log("create " + FILE_PATH);
//                 });
//             }
//         });

//         this.$select.addEventListener("confirm", (option) => {
//             let value = option.detail.value - 0;
//             checkedColor = value;
//             this.$select.style.background = getHexColor(checkedColor);
//         });

//         this.$clean.addEventListener("confirm", (option) => {
//             for (let row = 0; row < ROW_MAX; row++) {
//                 let colMaxTmp = COL_MAX;
//                 if (row % 2 !== 0) {
//                     colMaxTmp = COL_MAX - 1;
//                 }
//                 for (let col = 0; col < colMaxTmp; col++) {
//                     this[`$${genID(row, col)}`].style.background = getHexColor(BallColors.None);
//                     this[`$${genID(row, col)}`].dataset.enumColor = `${BallColors.None}`;
//                 }
//             }
//         });

//         this.$save.addEventListener("confirm", () => {
//             let data = { balls: [] };
//             for (let row = 0; row < ROW_MAX; row++) {
//                 let colMaxTmp = COL_MAX;
//                 if (row % 2 !== 0) {
//                     colMaxTmp = COL_MAX - 1;
//                 }
//                 for (let col = 0; col < colMaxTmp; col++) {
//                     let color = this[`$${genID(row, col)}`].dataset.enumColor;
//                     if (color - 0 !== BallColors.None) {
//                         data.balls.push({ row, col, color: color - 0 });
//                     }
//                 }
//             }
//             Editor.assetdb.createOrSave(FILE_PATH, JSON.stringify(data, undefined, 2), (err, results) => {
//                 Editor.log("save successful");
//             });
//         });
//     },

//     // register your ipc messages here
//     messages: {
//         "ball-config:hello"(event) {
//             this.$label.innerText = "Hello!";
//         },
//         "ball-config:mainSendData"(event) {
//             Editor.log("mainSendData");
//         },
//     },
// });
