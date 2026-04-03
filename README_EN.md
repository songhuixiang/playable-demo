<p align="center">
  <img src="icon.png" width="25%">
</p>

> 🇨🇳 For Chinese users, please refer to [README.md](./README.md) for the Chinese version.

# Bingo Playable Ads Builder

## Make Ad Development Easier and More Efficient

Bingo is a cross-platform desktop application specifically designed for advertising developers, helping you quickly build, test, and publish cross-platform Playable ads. Whether you're targeting Facebook, Unity, AppLovin, or other mainstream advertising platforms, Bingo provides you with a one-stop solution.

## Table of Contents

- [Core Values](#core-values)
- [UI Showcase](#ui-showcase)
- [System Requirements](#system-requirements)
- [Get Bingo](#get-bingo)
- [Prerequisites: SDK Integration](#prerequisites-sdk-integration)
- [Quick Start](#quick-start)
- [Image Compression](#image-compression)
- [Important Configuration Notes](#important-configuration-notes)
- [Example Build Results](#example-build-results)
- [Contact Us](#contact-us)

## Core Values

✅ **Multi-platform Coverage** - Built-in SDKs for 14 mainstream ad platforms, one build outputs all channel assets with no repeated development

   - AppLovin, BIGO, Chartboost, Facebook, Google
   - ironSource, Liftoff, Mintegral, Moloco, PureHTML
   - Tencent, TikTok, Unity, Vungle

✅ **Extreme Package Compression** - Built-in WebP image compression engine with Base122 encoding (reduces data expansion from ~33% with Base64 to ~14%), helping your ads easily meet platform file size limits

✅ **Zero Setup** - No complex build environment required, ready to use after installation; with SDK integrated, 4 steps take you from Cocos Creator to cross-platform ad assets

✅ **Real-time Local Preview** - Built-in preview function to verify ad interaction and cross-channel compatibility before building, reducing costly re-submission cycles

✅ **Simplified Professional Interface** - Supports Chinese/English switching and light/dark themes; platform specs and testing tools accessible on one screen, reducing learning and maintenance overhead

## UI Showcase

![Main Interface](主界面截图.png "Bingo Main Interface")

_Simple and intuitive main interface, supports light/dark themes and Chinese/English language switching, one-click ad building_

![Product Management](产品管理界面.png "Product Management Interface")
_Efficiently manage multiple ad projects_

-   **Add Product**: Quickly import new ad projects and easily manage multiple projects
-   **Delete Product**: Remove unnecessary projects with one click to keep your workspace tidy
-   **Product Settings**: Customize product name, alias, and platform URL

![Ad Channel Material Specs](广告渠道素材规范.png "Ad Channel Material Specs Interface")
_Clear overview of ad channel material specifications_

-   **Platform Requirements**: Display material specs for major ad platforms, including file size limits and format requirements
-   **Testing Tools**: Provide links to testing tools for each platform for quick ad material validation
-   **App Preview**: Support previewing ad effects in the test app

## System Requirements

✅ Supports Windows and macOS operating systems (only supports Apple Silicon M1/M2/M3/M4 chips)  
✅ Supports Cocos Creator versions:
   - 2.4.11 and above
   - 3.8.0 and above

✅ Full support for 2D and 3D game development  
✅ Fully compatible with all Cocos Creator feature modules

## Get Bingo

### Trial Version

[Get GitHub Trial Version](https://github.com/songhuixiang/playable-demo/releases) - Download the latest trial version to experience new features first

### Full Version

[Get Bingo App Now](https://store.cocos.com/app/detail/7593) - Go to Cocos Store to purchase and download

> 💡 **Version Update Notice**: Due to the lengthy review process on Cocos Store, the store version may have some delay. If you find that the store version is not the latest, you can proceed with the purchase and then contact us via email (458264325@qq.com) or WeChat with your payment receipt screenshot to receive the same latest version as the trial version.

## Prerequisites: SDK Integration

Before using Bingo to build ads, you need to integrate [PlayableSDK.d.ts](./PlayableSDK.d.ts) into your Cocos Creator project. **This step must be completed during game development.** Once the SDK is integrated, your ads will be able to redirect to the app store and respond to platform audio/pause controls.

### Core Interfaces

#### 1. `download()` - Redirect to App Store
Call this method when the user clicks the download button (CTA) or end card to trigger app store redirect.

#### 2. `game_end()` - Game End Notification
Must be called when the game ends (whether win or lose).

> ⚠️ **Important**: Some ad platforms (like Mintegral, Vungle) **require** this method to be called, otherwise it may cause abnormal ad behavior or inaccurate statistics.

#### 3. `channel` - Get Current Channel (Read-only)
Get the current advertising channel, can be used to implement channel-specific logic:

```typescript
if (PlayableSDK.channel === 'Facebook') {
    // Facebook specific logic
} else if (PlayableSDK.channel === 'TikTok') {
    // TikTok specific logic
}
```

### Lifecycle Callback Interfaces

#### 4. `onMute(callback)` / `onUnmute(callback)` - Audio Control
Register mute/unmute callback functions to respond to platform audio control requests.

#### 5. `onPause(callback)` / `onResume(callback)` - Pause/Resume
Register pause/resume callback functions. These callbacks are triggered in the following scenarios:

| Callback | Trigger Scenarios |
|----------|-------------------|
| `onPause` | User clicks download button to go to store, ad goes to background, ad loses focus |
| `onResume` | User returns from store, ad returns to foreground, ad regains focus |

**Best Practices**:
- In `onPause`, pause game animations, sound effects, and timers
- In `onResume`, restore game state, or consider showing the end card directly

### Complete Example

```typescript
PlayableSDK.onMute(() => {
    AudioManager.muteAll();
});

PlayableSDK.onUnmute(() => {
    AudioManager.unmuteAll();
});

PlayableSDK.onPause(() => {
    GameManager.pause();
});

PlayableSDK.onResume(() => {
    GameManager.resume();
});
```

## Quick Start

After completing SDK integration, just 4 steps to build your playable ads:

### Step 1: Build Project in Cocos Creator

1. Open your Cocos Creator project
2. Select menu "Project" → "Build"
3. Choose "Web Mobile" as the target platform
4. ⚠️ **Important**: Make sure NOT to check the "MD5 Cache" option (see [Build Configuration Precautions](#build-configuration-precautions))
5. Click "Build" button and wait for completion

### Step 2: Configure Project Paths

1. Open Bingo application
2. Click "Select" button to choose the `web-mobile` directory generated in the previous step
3. Click "Select" button to specify the output directory (built ad files will be saved here)

### Step 3: Configure Product Information

1. Click the "Settings" button next to the product to open the product management interface
2. Add or select your product
3. Configure the Apple Store and Google Play store links for your product (used for ad redirects)

### Step 4: Select Channels and Build

1. Check the target ad platforms in the channel list (multiple selection supported)
2. Choose image compression mode as needed:
   - **No Compression**: Keep original quality
   - **Lossless Compression**: Convert to WebP format with no quality loss
   - **Lossy Compression**: Adjustable quality parameter for smaller package size
3. Click the "Build" button
4. After building, check the generated ad files in the output directory

> 💡 **Tip**: Some channels (like Facebook, Google, TikTok) output ZIP packages, while others output single HTML files.

## Image Compression

Bingo has a powerful built-in image compression engine that effectively reduces ad package size, helping you meet file size limits of various platforms.

### Compression Mode Comparison

| Mode | Technology | Compression Rate | Quality Impact | Recommended For |
|------|------------|------------------|----------------|-----------------|
| No Compression | Keep original format | None | No loss | Package already meets requirements, pursuing original quality |
| Lossless | PNG/JPG → WebP | ~20-40% | No loss | Balance between quality and size |
| Lossy | WebP + Quality Control | ~50-80% | Slight loss | Need extreme compression to meet platform limits |

### Lossy Compression Quality Parameter

When using lossy compression, you can adjust the quality parameter (1-100) via the slider:

- **100%**: Highest quality, lower compression rate
- **50%** (Recommended): Balance between quality and size
- **1%**: Smallest size, significant quality loss

### Smart Optimization

Bingo automatically compares file sizes before and after compression:
- If compressed size is **smaller**, use the compressed version
- If compressed size is **larger**, automatically keep the original

This ensures compression is always beneficial and won't increase package size. Additionally, Bingo uses **Base122 encoding** to embed game assets, reducing data expansion from ~33% (Base64) to ~14%, further shrinking the final file size.

## Important Configuration Notes

### Build Configuration Precautions

**⚠️ Important Notice: When building your project with Cocos Creator, please make sure NOT to check the "MD5 Cache" option**

<img src="MD5_cache.png" alt="MD5 Cache Configuration" title="Do not check MD5 Cache option when building" width="60%">

Checking MD5 Cache can cause playable ads to malfunction on certain platforms because:
- MD5 caching changes the naming convention of resource files
- Some ad platforms have strict requirements for file names
- May cause resource loading failures or path errors

**Correct approach:** Ensure the "MD5 Cache" option remains unchecked in the build settings.

### Platform Testing Precautions

**⚠️ Compatibility Issue with `document.write()`**

Some users may encounter issues where playable ads fail to display properly when testing on platform tools like AppLovin. This is typically caused by modern browsers (Chrome 55+) imposing stricter restrictions on the `document.write()` method, which may trigger `Violation` warnings in the console.

**Solutions:**
- Open the platform testing tool in **Chrome Incognito Mode** (Ctrl/Cmd + Shift + N)—this usually resolves the display issue
- Try using a different browser for testing (e.g., Safari), as different browsers have varying levels of restrictions on `document.write()`
- If the ad doesn't display in platform testing tools, try opening the HTML file directly in your local browser for testing

**⚠️ Errors Caused by Chrome Extension Injection**

When previewing playable ads locally in regular Chrome mode, you may see console errors like:

```
TypeError: Cannot read properties of null (reading 'getAssembler')
    at inject.js:1
```

The `inject.js` at the bottom of the call stack is a **script injected by a browser extension**, not a bug in your playable ad. Certain extensions (e.g., performance monitors, ad analytics tools) inject nodes into the page, causing the Cocos engine to throw this error. **This error does not affect actual gameplay.** Real users viewing ads inside Facebook/Instagram or other platform WebViews have no browser extensions, so they will never encounter this issue.

**Solution:** Preview in **Chrome Incognito Mode** (Ctrl/Cmd + Shift + N). Incognito mode disables all extensions by default, giving you a clean test environment that matches real ad delivery conditions.

## Example Build Results

[View Playable Ad Examples Generated by Bingo](./build/playables) - These are cross-platform ad materials generated by the Bingo tool

## Contact Us

If you have any questions or feedback, feel free to contact me via:

-   email: 458264325@qq.com
-   WeChat

    <img src="wechat.jpg" alt="WeChat" title="WeChat" style="width: 25%;">
