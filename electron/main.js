// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow,ipcMain,Menu } = require('electron')
const path = require('path')
const {spawn} = require('node:child_process')
const sqlite3 = require('sqlite3').verbose();

//process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true; // 关闭控制台的警告
 
const createWindow = async ()=> {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname,'../icons/icons/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname,'preload.js')
    }
  })

  /**
   * 执行cmd文件
   */
  ipcMain.on('call-cmd', (event, filePath) => {
    const bat = spawn('cmd.exe', ['/c',filePath]);
    bat.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    bat.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    bat.on('exit', (code) => {
      console.log(`Child exited with code ${code}`);
    });
  })

  /**
   * 按钮组
   */
  ipcMain.handle('ButtonGroup-select', () => {
    return new Promise((resolve, reject)=>{
      db.all('SELECT * FROM button_group', function(err, rows) {
        if (err) {
          reject(err)
        }else {
          resolve(rows)
        }
      });
    })
  })
  ipcMain.on('ButtonGroup-insert', (event, buttonGroup) => {
    db.run("INSERT INTO button_group (name, create_time) VALUES (?, datetime('now','localtime'))", [buttonGroup.name], function(err) {
      if (err) {
        console.log(err);
      }
    });
  })
  ipcMain.on('ButtonGroup-update', (event, buttonGroup) => {
    db.run('update button_group set name=? where id=?', [buttonGroup.name, buttonGroup.id], function(err) {
      if (err) {
        console.log(err);
      }
    });
  })
  ipcMain.on('ButtonGroup-delete', (event, id) => {
    db.run('delete from button_group where id=?', [id], function(err) {
      if (err) {
        console.log(err);
      }
    });
  })

  /**
   * 按钮
   */
  ipcMain.handle('Button-select', (event,buttonGroupId) => {
    return new Promise((resolve, reject)=>{
      db.all('SELECT * FROM button where button_group_id=?',[buttonGroupId], function(err, rows) {
        if (err) {
          reject(err)
        }else {
          resolve(rows)
        }
      });
    })
  })
  ipcMain.on('Button-insert', (event, button) => {
    db.run("INSERT INTO button (name, url,button_group_id,create_time) VALUES (?,?,?,datetime('now','localtime'))", [button.name,button.url,button.buttonGroupId], function(err) {
      if (err) {
        console.log(err);
      }
    });
  })
  ipcMain.on('Button-update', (event, button) => {
    db.run('update button set name=?, url=? where id=?', [button.name, button.url,button.id], function(err) {
      if (err) {
        console.log(err);
      }
    });
  })
  ipcMain.on('Button-delete', (event, id) => {
    db.run('delete from button where id=?', [id], function(err) {
      if (err) {
        console.log(err);
      }
    });
  })
 
  // 加载 index.html
  let env = "pro"
  if(env == "dev"){
    mainWindow.loadURL("http://localhost:8888/")
  }else if(env == "pro"){
    mainWindow.loadFile(path.resolve(__dirname, '../dist/index.html'))
  }

  Menu.setApplicationMenu(null)
 
  // 打开开发工具
  //mainWindow.webContents.openDevTools()
}

let db = new sqlite3.Database('./database.db',function(){
  db.run('CREATE TABLE IF NOT EXISTS button_group (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT, create_time datetime)');
  db.run('CREATE TABLE IF NOT EXISTS button (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT, url text,button_group_id Integer,create_time datetime)',function(){
    app.whenReady().then(() => {
      createWindow()
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
    })
  
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') app.quit()
    })
  });
})
