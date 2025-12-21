System.register("chunks:///_virtual/button.ts",["./rollupPluginModLoBabelHelpers.js","cc"],(function(o){var n,e,t,l;return{setters:[function(o){n=o.inheritsLoose},function(o){e=o.cclegacy,t=o._decorator,l=o.Component}],execute:function(){var a;e._RF.push({},"dd43bQK7ypE758DJVgQk4OU","button",void 0);var c=t.ccclass;t.property,o("button",c("button")(a=function(o){function e(){return o.apply(this,arguments)||this}n(e,o);var t=e.prototype;return t.start=function(){try{PlayableSDK.onMute((function(){console.log("PlayableSDK onMute")})),PlayableSDK.onUnmute((function(){console.log("PlayableSDK onUnmute")})),PlayableSDK.onPause((function(){console.log("PlayableSDK onPause")})),PlayableSDK.onResume((function(){console.log("PlayableSDK onResume")}))}catch(o){console.log("PlayableSDK error",o)}},t.update=function(o){},t.onClick=function(){console.log("button onClick");try{PlayableSDK.download(),PlayableSDK.game_end()}catch(o){console.log("PlayableSDK error",o)}},e}(l))||a);e._RF.pop()}}}));

System.register("chunks:///_virtual/main",["./button.ts"],(function(){return{setters:[null],execute:function(){}}}));

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});