/**
 * PlayableSDK interface for interactive advertisements
 */
declare const PlayableSDK: {
    /**
     * Triggers the download action when user clicks the download button
     * 当用户点击下载按钮时调用此方法
     */
    download: () => void;

    /**
     * Must be called when the game ends (either win or lose)
     * 当游戏结束时（无论胜利或失败）必须调用此方法
     */
    game_end: () => void;
};
