import { config as dotenvConfig } from 'dotenv';
import { app } from 'electron';
import { Logger } from './logger';
import { Tray } from './tray';
import { WindowManager } from './windowManager';
import { WebServer } from './webServer';
import { Ipc } from './ipc';

Logger.getInstance().init();

dotenvConfig({ path: '../../.env' });

const gotTheLock = app.requestSingleInstanceLock();

const windowManager = WindowManager.getInstance();

if (gotTheLock) {
  app.on('ready', () => {
    console.log('app ready');
    Ipc.getInstance();
    Tray.getInstance().init();
    windowManager.showWindow();
    WebServer.getInstance().init();
  });
  app.on('window-all-closed', function () {
    console.log('app all window closed');
    app?.dock?.hide();
  });
  app.on('activate', () => {
    console.log('app activate');
    windowManager.showWindow();
  });
  app.on('second-instance', () => {
    console.warn('app second instance emit');
    windowManager.handleSecondInstance();
  });
} else {
  app.quit();
}
