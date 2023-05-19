import { RemoveVisibilityEventListener, VisibilityChangeEvent } from "./types"

const noop = () => {}

export function visibilitychange (hide: VisibilityChangeEvent = noop, show: VisibilityChangeEvent = noop): RemoveVisibilityEventListener {
  const win = window
  let hidden = false
  let hiddenPropName = ''
  const eventListener: VisibilityChangeEvent[] = []

  if (typeof document.hidden !== 'undefined') {
    hiddenPropName = 'hidden'
  } else if (typeof document.mozHidden !== 'undefined') {
    hiddenPropName = 'mozHidden'
  } else if (typeof document.msHidden !== 'undefined') {
    hiddenPropName = 'msHidden'
  } else if (typeof document.webkitHidden !== 'undefined') {
    hiddenPropName = 'webkitHidden'
  }

  function onHidden () {
    if (!hidden) {
      hidden = true
      hide()
    }
  }
  // In order to adapt the most of platforms the onshow API.
  function onShown () {
    if (hidden) {
      hidden = false
      show()
    }
  }

  if (hiddenPropName) {
    const changeList = [
      'visibilitychange',
      'mozvisibilitychange',
      'msvisibilitychange',
      'webkitvisibilitychange',
      'qbrowserVisibilityChange'
    ]
    const callback = function (event) {
      let visible = document[hiddenPropName]
      // QQ App
      visible = visible || event['hidden']
      if (visible) {
        onHidden()
      } else {
        onShown()
      }
    }
    for (let i = 0; i < changeList.length; i++) {
      document.addEventListener(changeList[i], callback)
      eventListener.push(() => {
        document.removeEventListener(changeList[i], callback)
      })
    }
  } else {
    win.addEventListener('blur', onHidden)
    win.addEventListener('focus', onShown)
    eventListener.push(() => {
      win.removeEventListener('blur', onHidden)
    })
    eventListener.push(() => {
      win.removeEventListener('focus', onShown)
    })
  }

  if (navigator.userAgent.indexOf('MicroMessenger') > -1) {
    win.onfocus = onShown
    eventListener.push(() => {
      win.onfocus = null
    })
  }

  if ('onpageshow' in window && 'onpagehide' in window) {
    win.addEventListener('pagehide', onHidden)
    win.addEventListener('pageshow', onShown)
    eventListener.push(() => {
      win.removeEventListener('pagehide', onHidden)
    })
    eventListener.push(() => {
      win.removeEventListener('pageshow', onShown)
    })
    // Taobao UIWebKit
    document.addEventListener('pagehide', onHidden)
    document.addEventListener('pageshow', onShown)
    eventListener.push(() => {
      document.removeEventListener('pagehide', onHidden)
    })
    eventListener.push(() => {
      document.removeEventListener('pageshow', onShown)
    })
  }

  return () => {
    eventListener.forEach(e => e())
  }
}