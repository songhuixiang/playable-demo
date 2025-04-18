import { _decorator, Component, screen, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AdaptScreen")
export class AdaptScreen extends Component {
    @property(UITransform)
    target: UITransform = null;

    start() {
        screen.on("window-resize", this.onWindowResize, this);
        // screen.on("orientation-change", this.onOrientationChange, this);
        screen.on("fullscreen-change", this.onFullScreenChange, this);
        this.target.width = screen.windowSize.width;
        this.target.height = screen.windowSize.height;
    }

    onDestroy() {
        // Unregister event listeners when the component is destroyed
        screen.off("window-resize", this.onWindowResize, this);
        // screen.off("orientation-change", this.onOrientationChange, this);
        screen.off("fullscreen-change", this.onFullScreenChange, this);
    }

    onWindowResize(width: number, height: number) {
        console.log("Window resized:", width, height);
        this.setSize(width, height);
    }

    // onOrientationChange(orientation: number) {
    //     if (orientation === macro.ORIENTATION_LANDSCAPE_LEFT || orientation === macro.ORIENTATION_LANDSCAPE_RIGHT) {
    //         console.log("Orientation changed to landscape:", orientation);
    //     } else {
    //         console.log("Orientation changed to portrait:", orientation);
    //     }
    // }

    onFullScreenChange(width: number, height: number) {
        console.log("Fullscreen change:", width, height);
        this.setSize(width, height);
    }

    setSize(width: number, height: number) {
        this.target.width = width;
        this.target.height = height;
    }

    update(deltaTime: number) {}
}
