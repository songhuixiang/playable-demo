declare const PlayableSDK: {
    download: () => {}; // Called download button method
    game_end: () => {}; // At the end of the game (when the game wins or fails), you should call the API game_end()
};
