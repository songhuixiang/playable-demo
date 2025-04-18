import { _decorator, AudioClip, AudioSource, Component, Node } from "cc";
import { playAudioEvent } from "./GameEvent";
const { ccclass, property } = _decorator;

export enum AUDIO_CLIP {
    shoot,
    blast,
    win,
    hit,
}

@ccclass("AudioController")
export class AudioController extends Component {
    @property(AudioSource)
    public audioSource: AudioSource = null!;

    @property(AudioClip)
    public shootClip: AudioClip = null!;

    @property(AudioClip)
    public blastClip: AudioClip = null!;

    @property(AudioClip)
    public winClip: AudioClip = null!;

    @property(AudioClip)
    public hitClip: AudioClip = null!;

    start() {
        playAudioEvent.on((clip) => {
            switch (clip) {
                case AUDIO_CLIP.shoot:
                    this.playOneShot(this.shootClip);
                    break;
                case AUDIO_CLIP.blast:
                    this.playOneShot(this.blastClip);
                    break;
                case AUDIO_CLIP.win:
                    this.playOneShot(this.winClip);
                    break;
                case AUDIO_CLIP.hit:
                    this.playOneShot(this.hitClip);
                    break;
            }
        });
    }

    playOneShot(clip: AudioClip) {
        this.audioSource.playOneShot(clip, 1);
    }

    update(deltaTime: number) {}
}
