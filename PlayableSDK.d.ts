/**
 * 支持的广告渠道枚举
 * Supported advertising channels
 */
declare enum CHANNEL {
    AppLovin = "AppLovin",
    BIGO = "BIGO",
    Chartboost = "Chartboost",
    Facebook = "Facebook",
    Google = "Google",
    ironSource = "ironSource",
    Liftoff = "Liftoff",
    Mintegral = "Mintegral",
    Moloco = "Moloco",
    PureHTML = "PureHTML",
    Tencent = "Tencent",
    TikTok = "TikTok",
    Unity = "Unity",
    Vungle = "Vungle",
}

/**
 * PlayableSDK interface for interactive advertisements
 */
declare const PlayableSDK: {
    /**
    * 获取当前运行的广告渠道
    * Get the current advertising channel
    */
    readonly channel: CHANNEL;

    /**
     * Triggers the app store redirect when user interacts with download CTAs (Call-To-Action buttons)
     * or end card. This method should be called in scenarios such as:
     * - User clicks the download/install button
     * - User clicks CTA on the end card
     * - Any interaction that should lead to app installation
     * 
     * Note: When this method is called, the game should handle the pause state appropriately
     * as the user will be redirected to the app store. The SDK will automatically trigger
     * the onPause callback when leaving the playable ad.
     * 
     * 当用户与下载按钮（CTA）或结束卡片交互时触发应用商店跳转。在以下场景中调用此方法：
     * - 用户点击下载/安装按钮时
     * - 用户点击结束卡片上的 CTA 按钮时
     * - 任何应该引导到应用安装的交互时
     * 
     * 注意：调用此方法时，游戏应该正确处理暂停状态，因为用户将被重定向到应用商店。
     * SDK 会在离开试玩广告时自动触发 onPause 回调。
     */
    download: () => void;

    /**
     * Must be called when the game ends (either win or lose) or when the end card is presented.
     * This is a critical lifecycle event required by certain ad networks (e.g., Mintegral, Vungle).
     * Failing to call this method may result in incorrect ad behavior or metrics.
     * 
     * 当游戏结束时（无论胜利或失败）或展示结束卡片时必须调用此方法。
     * 这是一个关键的生命周期事件，某些广告平台（如 Mintegral、Vungle）强制要求调用。
     * 如果没有正确调用此方法可能导致广告行为或统计指标异常。
     */
    game_end: () => void;

    /**
     * Register a callback function that will be called when the playable needs to be muted
     * 注册一个回调函数，当需要静音时SDK会调用此函数
     * @param callback The function to be called when mute is required
     */
    onMute: (callback: () => void) => void;

    /**
     * Register a callback function that will be called when the playable can play sounds
     * 注册一个回调函数，当可以播放声音时SDK会调用此函数
     * @param callback The function to be called when unmute is allowed
     */
    onUnmute: (callback: () => void) => void;

    /**
     * Register a callback function that will be called when the playable needs to pause.
     * This event is triggered in scenarios such as:
     * - User clicks the download/install button (redirecting to app store)
     * - Ad container is sent to background
     * - Ad loses visibility or focus
     * 
     * Best Practices:
     * - Pause all game animations and sounds
     * - Stop game timers and physics simulations
     * - Save game state if necessary
     * 
     * 注册一个回调函数，当需要暂停时SDK会调用此函数。
     * 此事件在以下场景中触发：
     * - 用户点击下载/安装按钮（跳转到应用商店时）
     * - 广告容器进入后台时
     * - 广告失去可见性或焦点时
     * 
     * 最佳实践：
     * - 暂停所有游戏动画和声音
     * - 停止游戏计时器和物理模拟
     * - 必要时保存游戏状态
     * 
     * @param callback The function to be called when pause is required
     */
    onPause: (callback: () => void) => void;

    /**
     * Register a callback function that will be called when the playable needs to resume.
     * This event is triggered in scenarios such as:
     * - User returns from app store
     * - Ad container returns to foreground
     * - Ad regains visibility or focus
     * 
     * Best Practices:
     * - Resume game animations and sounds
     * - Restart game timers and physics simulations
     * - Restore game state if necessary
     * - Consider showing end card if returning from app store
     * 
     * 注册一个回调函数，当需要恢复时SDK会调用此函数。
     * 此事件在以下场景中触发：
     * - 用户从应用商店返回时
     * - 广告容器返回前台时
     * - 广告重新获得可见性或焦点时
     * 
     * 最佳实践：
     * - 恢复游戏动画和声音
     * - 重启游戏计时器和物理模拟
     * - 必要时恢复游戏状态
     * - 考虑在从应用商店返回时显示结束卡片
     * 
     * @param callback The function to be called when resume is required
     */
    onResume: (callback: () => void) => void;
};
