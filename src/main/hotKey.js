import { app, globalShortcut, BrowserWindow } from 'electron'
const config = require('../main/localStorage')

let keyMap = {
  'previous': {
    name: '上一首',
    key: 'CmdOrCtrl + Left',
    func: function () {
      BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('previous')
        console.log('send pre')
      })
    }
  },
  'next': {
    name: '下一首',
    key: 'CmdOrCtrl + Right',
    func: function () {
      BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('next')
      })
    }
  },
  'pause or play': {
    name: '暂停 / 播放',
    key: 'CmdOrCtrl + P',
    func: function () {
      BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('pause or play')
      })
    }
  },
  'increase volume': {
    name: '增大音量',
    key: 'CmdOrCtrl + Up',
    func: function () {
      BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('increase volume')
      })
    }
  },
  'decrease volume': {
    name: '减小音量',
    key: 'CmdOrCtrl + Down',
    func: function () {
      BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('decrease volume')
      })
    }
  },
  'show or hide window': {
    name: '显示 / 隐藏窗口',
    key: 'CmdOrCtrl + H',
    func: function () {
      BrowserWindow.getAllWindows().forEach(i => {
        if (i.isVisible()) {
          i.hide()
        } else {
          i.show()
        }
      })
    }
  },
  'exit': {
    name: '退出',
    key: 'CmdOrCtrl + E',
    func: function () {
      BrowserWindow.getAllWindows().forEach(win => {
        win.close()
        win.destroy()
        win = null
      })
    }
  }
}

let defaultKeyMap = deepCopy(keyMap)

function deepCopy (obj) {
  var result = Array.isArray(obj) ? [] : {}
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = deepCopy(obj[key])
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}

function init () {
  keyMap = deepCopy(defaultKeyMap)
  let settings = config.default.getItem('keyMap')
  if (settings) {
    Object.keys(settings).forEach(set => {
      keyMap[set]['key'] = settings[set]['key']
    })
  }
}

function setHotKey () {
  init()
  let keys = []
  Object.keys(keyMap).forEach(key => {
    keys.push(keyMap[key])
  })
  keys.forEach(item => {
    globalShortcut.register(item['key'], item['func'])
  })
}

function start () {
  app.addListener('ready', () => {
    setHotKey()
  })
  app.addListener('window-all-closed', () => {
    globalShortcut.unregisterAll()
  })
}

export default start

export function resetHotKey () {
  globalShortcut.unregisterAll()
  setHotKey()
}

export function getkeyMap () {
  init()
  return keyMap
}

export function setGlobalKey (type, keys) {
  var status
  if (keys.length < 1 || keys[0].length <= 1) {
    status = 'FAIL'
  } else {
    try {
      globalShortcut.register(keys.join(' + '), () => {})
      if (globalShortcut.isRegistered(keys.join(' + ')) === true) {
        let tostoreSetting = {}
        keyMap[type]['key'] = keys.join(' + ')
        Object.keys(keyMap).forEach(k => {
          tostoreSetting[k] = {
            key: keyMap[k]['key']
          }
        })
        config.default.setItem('keyMap', tostoreSetting)
        status = 'SUCCESS'
      } else {
        status = '与 系统 / 其他程序 快捷键冲突'
      }
    } catch (e) {
      status = '快捷键没有设置完整'
    }
  }
  resetHotKey()
  return status
}

export function clearGlobalKey () {
  globalShortcut.unregisterAll()
}

export function DefaultKeySetting () {
  config.default.removeItem('keyMap')
  resetHotKey()
}

export function getMap () {
  let map = {
    17: 'CmdOrCtrl',
    32: 'Space',
    37: 'Left',
    38: 'Up',
    39: 'Right',
    40: 'Down',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    get 91 () {
      if (process.platform !== 'darwin') {
        return 'Super'
      } else {
        return 'Cmd'
      }
    }
  }
  return map
}
