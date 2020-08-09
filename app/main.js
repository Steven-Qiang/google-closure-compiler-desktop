/*
 * @Author: 强某人
 * @Date: 2020-08-08 20:45:33 
 */

const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
let mainWindow = null;

const windowOpt = {
  width: 1200,
  height: 800,
  // maxWidth: 800,
  // maxHeight: 600,
  // resizable: false,
  frame: false,

  title: "Google Closure Compiler Desktop",
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: true,
  }
};
async function createWindow() {
  // Create the browser window.
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  mainWindow = new BrowserWindow({
    ...windowOpt
  });

  // loadingwindow.hide();

  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    process.exit()
  })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// app.on("ready", () => {

//   loadingwindow = new BrowserWindow({
//     ...windowOpt
//   })

//   loadingwindow.loadFile('loading.html') // To load the activity loader html file
//   loadingwindow.show();

// })

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  await createWindow();
  await setApplicationMenu();

  app.on('activate', async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



async function setApplicationMenu() {
  const template = [
    {
      label: '窗口',
      role: 'window',
      submenu: [
        {
          label: '最小化',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: '关闭',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '刷新',
          accelerator: 'CmdOrCtrl+R',
          click(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload();
          }
        },
        {
          label: '调试',
          accelerator: (() => {
            if (process.platform == 'darwin')
              return 'Alt+Command+I';
            else
              return 'Ctrl+Shift+I';
          })(),
          click(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.toggleDevTools();
          }
        },
      ]
    },
    {
      label: '帮助',
      role: 'help',
      submenu: [
        {
          label: 'What is the Closure Compiler',
          click() {
            shell.openExternal('https://developers.google.com/closure/compiler')
          }
        },
        {
          label: 'Closure Compiler Compilation Levels',
          click() {
            shell.openExternal('https://developers.google.com/closure/compiler/docs/compilation_levels')
          }
        },
        {
          label: 'Author Github Index',
          click() {
            shell.openExternal('https://github.com/qiangmouren')
          }
        },
      ]
    },
  ];


  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

}
