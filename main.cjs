const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const Datastore = require('nedb');
const path = require('path');

const db = {
  members: new Datastore({
    filename: path.join(app.getPath('userData'), 'members.db'),
    autoload: true,
  }),
  plans: new Datastore({
    filename: path.join(app.getPath('userData'), 'plans.db'),
    autoload: true,
  }),
  payments: new Datastore({
    filename: path.join(app.getPath('userData'), 'payments.db'),
    autoload: true,
  }),
  checkins: new Datastore({
    filename: path.join(app.getPath('userData'), 'checkins.db'),
    autoload: true,
  }),
};

function createWindow() {
  splash = new BrowserWindow({
    width: 590,
    height: 590,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });

  splash.loadFile(path.join(__dirname, 'splash.html'));

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    icon: path.join(__dirname, '/dist/assets/logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
    },
  });
  // Menu.setApplicationMenu(null);
  // mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  setTimeout(async () => {
    splash.destroy();
    mainWindow.show();
  }, 3000);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

['members', 'plans', 'payments', 'checkins'].forEach((entity) => {
  ipcMain.handle(`${entity}-find`, (_, query) => {
    return new Promise((resolve, reject) => {
      db[entity].find(query, (err, docs) =>
        err ? reject(err) : resolve(docs),
      );
    });
  });

  ipcMain.handle(`${entity}-insert`, (_, doc) => {
    return new Promise((resolve, reject) => {
      db[entity].insert(doc, (err, newDoc) =>
        err ? reject(err) : resolve(newDoc),
      );
    });
  });

  ipcMain.handle(`${entity}-update`, (_, id, update) => {
    return new Promise((resolve, reject) => {
      db[entity].update({ id }, { $set: update }, {}, (err, num) =>
        err ? reject(err) : resolve(num),
      );
    });
  });

  ipcMain.handle(`${entity}-remove`, (_, id) => {
    return new Promise((resolve, reject) => {
      db[entity].remove({ id }, {}, (err, num) =>
        err ? reject(err) : resolve(num),
      );
    });
  });
});
