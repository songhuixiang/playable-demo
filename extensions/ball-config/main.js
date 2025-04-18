"use strict";

module.exports = {
    methods: {
        receiveMessage() {
            console.log("Received a message");
			Editor.Panel.open("ball-config.default");
        },
    },

    load() {
        // execute when package loaded
    },

    unload() {
        // execute when package unloaded
    },

    // register your ipc messages here
    messages: {
        open() {
            // open entry panel registered in package.json
            Editor.Panel.open("ball-config");
            Editor.log("open ball config");
        },
        "say-hello"() {
            Editor.log("Hello World!");
            // send ipc message to panel
            Editor.Ipc.sendToPanel("ball-config", "ball-config:hello");
        },
        clicked() {
            Editor.log("Button clicked!");
        },
        panelRequestData() {
            Editor.log("panelRequestData");
            Editor.Ipc.sendToPanel("ball-config", "ball-config:mainSendData");
        },
    },
};
