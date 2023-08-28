# ButtonPanelVue

这是一个vite+vue3+electron开发的用于管理按钮的面板，目前主要用于管理执行bat脚本的执行（当前只支持bat脚本，后续再考虑集成其他脚本），一个bat脚本对应一个按钮，需要使用者在bat脚本中注意执行的路径，比如说a.bat调用了b.bat这个时候b.bat是相对于a.bat的路径而不是相对于该软件的安装目录的路径，所以需要在a.bat中先cd到a.bat的目录再执行相应的操作。

## 安装需要的依赖

```sh
npm install
```

### 开发时需要分别启动vue项目和electron项目，先启动vue项目再启动electron项目，注意：将main.js中的环境切换到dev环境，打包时切换到pro环境

```sh
npm run dev
npm run electron:start
```

### 打包electron项目

```sh
npm run electron:build
```
