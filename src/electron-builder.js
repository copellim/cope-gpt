const builder = require("electron-builder");

builder.build({
  targets: builder.Platform.WINDOWS.createTarget(),
  config: {
    appId: "com.example.myapp",
    productName: "MyApp",
    directories: {
      output: "dist",
    },
    win: {
      icon: "build/icon.ico",
    },
    files: ["dist/cope-gpt/**/*"],
  },
});
