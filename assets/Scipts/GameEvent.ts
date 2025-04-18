import { Vec3 } from "cc";
import { AUDIO_CLIP } from "./AudioController";
import { BALL_COLOR, Ball } from "./Ball";
import { Emitter } from "./Events";

export interface ThrowBallData {
    color: BALL_COLOR;
    worldPosition: Vec3;
}

const emitter = new Emitter();

export const launchBallEvent = emitter.createEvent<(touchPoint: Vec3) => void>();
export const equipBallEvent = emitter.createEvent<() => void>();
export const throwBallCollidedEvent = emitter.createEvent<(throwBall: ThrowBallData, collidedBall?: Ball) => void>();
export const shakeEffectEvent = emitter.createEvent<() => void>();
export const playAudioEvent = emitter.createEvent<(clip: AUDIO_CLIP) => void>();
export const getScoreEvent = emitter.createEvent<() => void>();
export const gameEndEvent = emitter.createEvent<() => void>();
export const showGuideLineEvent = emitter.createEvent<(touchPoint: Vec3) => void>();
export const hideGuideLineEvent = emitter.createEvent<() => void>();
export const ballColorChangeEvent = emitter.createEvent<(color: BALL_COLOR) => void>();
export const swapColorBallEvent = emitter.createEvent<() => void>();
