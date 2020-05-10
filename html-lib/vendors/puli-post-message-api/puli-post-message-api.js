window.PuliPostMessageAPIInited = false

function PuliPostMessageAPI(options) {
  if (window.PuliPostMessageAPIInited === true) {
    throw new Error('PuliPostMessageAPI was loaded.')
  }
  window.PuliPostMessageAPIInited = true
  
  let pageName = location.href.slice(location.href.lastIndexOf('/') + 1)
  
  options = options ? options : {}
  let manuallyReady = typeof(options.manuallyReady) === 'boolean' ? options.manuallyReady : false
  //console.log(manuallyReady, pageName)
  /**
   * 開啟視窗的呼叫者
   * @type type
   */
  let opener
  if (window.opener) {
    opener = window.opener
  }
  else if (window.parent && window.parent !== window) {
    opener = window.parent
  }

  let docReady = function (fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
      // call on next available tick
      setTimeout(fn, 1);
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }
  
  if (opener && manuallyReady === false) {
    docReady(function () {
      //console.log('auto ready', manuallyReady, pageName)
      _sendReadyMessage()
    })
  }
  
  let _sendReadyMessage = function () {
    //console.log('ready', location.href.slice(location.href.lastIndexOf('/') + 1))
    if (_isSentReadyMessage === true) {
      return false
    }
    _isSentReadyMessage = true
    
    if (opener) {
      opener.postMessage({
        eventName: 'ready',
        url: location.href
      }, '*')
    }
    //console.log('ready', pageName)
  }
  
  let _isSentReadyMessage = false
  let _receiverReadyList = {}
  let _receiverWaitList = {}
  let _receiverSendWaitList = {}
  
  // -----------------------
  
  let _receiverElementList = {}
  
  let _AddSendWait = function (url) {
    if (Array.isArray(_receiverSendWaitList[url]) === false) {
      _receiverSendWaitList[url] = []
    }
    
    return new Promise(function (resolve, reject) {
      _receiverSendWaitList[url].push(function () {
        resolve(true)
      })
      
      //console.log(_receiverSendWaitList[url].length, url)
      if (_receiverSendWaitList[url].length === 1) {
        _receiverSendWaitList[url][0]()
      }
    })
  }
  
  let _ExecuteNextSendWait = function (url) {
    _receiverSendWaitList[url].shift()
    //console.log('_ExecuteNextSendWait', url)
    if (_receiverSendWaitList[url].length > 0) {
      setTimeout(function () {
        _receiverSendWaitList[url][0]()
      }, 0)
    }
  }
  
  let sleep = function (ms) {
    ms = ms ? ms : 100
    
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(true)
      }, ms)
    })
  }
  
  // ---------------------------
  let popupCenterRedirect = function (url, ratio, title) {

    ratio = (typeof(ratio) === 'number') ? ratio : 0.8
    title = (typeof(title) === 'string') ? title : '_blank'

    var w = screen.availWidth * ratio
    var h = screen.availHeight * ratio

    w = (w < 300) ? 300 : w
    h = (h < 300) ? 300 : h

    var userAgent = navigator.userAgent
    var mobile = function () {
      return /\b(iPhone|iP[ao]d)/.test(userAgent) ||
              /\b(iP[ao]d)/.test(userAgent) ||
              /Android/i.test(userAgent) ||
              /Mobile/i.test(userAgent)
    }
    var screenX = typeof window.screenX !== 'undefined' ? window.screenX : window.screenLeft
    var screenY = typeof window.screenY !== 'undefined' ? window.screenY : window.screenTop
    var outerWidth = typeof window.outerWidth !== 'undefined' ? window.outerWidth : document.documentElement.clientWidth
    var taskbarHeight = 22
    var outerHeight = typeof window.outerHeight !== 'undefined' ? window.outerHeight : document.documentElement.clientHeight - taskbarHeight
    var targetWidth = mobile() ? null : w
    var targetHeight = mobile() ? null : h
    var V = screenX < 0 ? window.screen.width + screenX : screenX
    var left = parseInt(V + (outerWidth - targetWidth) / 2, 10)
    var right = parseInt(screenY + (outerHeight - targetHeight) / 2.5, 10)

    var features = []
    if (targetWidth !== null) {
      features.push('width=' + targetWidth);
    }
    if (targetHeight !== null) {
      features.push('height=' + targetHeight);
    }
    features.push('left=' + left)
    features.push('top=' + right)

    var newWindow = window.open('', title, features.join(','))

    newWindow.document.write(`<script>window.moveTo(${left}, ${right});window.resizeTo(${targetWidth}, ${targetHeight})</script>`)
    newWindow.document.write(`<script>location.href="${url}"</script>`)

    if (window.focus) {
      newWindow.focus()
    }
    return newWindow
  }
  
  // ---------------------------
  let urlRedirect = {}
  
  let filterURLRedirect = function (url) {
    return (typeof(urlRedirect[url]) === 'string') ? urlRedirect[url] : url
  }
  
  let send = async function (url, data, options) {
    url = new URL(url, document.baseURI).href
    url = filterURLRedirect(url)
    
    //console.log('send ==================================')
    await _AddSendWait(url)
    
    options = options ? options : {}
    let {eventType, callback, newWindow} = options
    eventType = eventType ? eventType : '_default'
    //console.log(options)
    
    let mode = 'iframe'
    if (options && options.mode) {
      mode = options.mode
    }
    
    
    let autoClose = false
    if (options) {
      if (options.autoClose === true) {
        autoClose = options.autoClose
      }
      else if (typeof(options.autoClose) === 'undefined'
          && options.mode === 'popup') {
        autoClose = false
      }
    }
    
    // ---------------
    
    if (mode === 'popup' && newWindow === true && _receiverElementList[url]) {
      delete _receiverReadyList[url]
      delete _receiverElementList[url]
    }
    else if (autoClose === true && _receiverElementList[url]) {
      if (mode === 'iframe') {
        let element = document.querySelector(`iframe[data-url="${url}"]`)
        //console.log(element)
        if (element !== null) {
          element.parentNode.removeChild(element)
        }
        //alert('有刪除嗎？')
      }
      else if (mode === 'popup') {
        _receiverElementList[url].close()
      }
      
      delete _receiverReadyList[url]
      delete _receiverElementList[url]
      //await sleep(3000)
    }
    
    let receiver
    let receiverElement
    if (_receiverElementList[url]) {
      //console.log('從cache')
      receiver = _receiverElementList[url]
    }
    else if (mode === 'iframe') {
      //console.log('iframe')
      receiverElement = document.querySelector(`iframe[data-url="${url}"]`)
      if (receiverElement === null) {
        receiverElement = document.createElement("iframe"); 
        receiverElement.style.display = 'none'
        receiverElement.src = url
        //console.log(url)
        receiverElement.setAttribute('data-url', url)
        document.body.appendChild(receiverElement)
      }
    }
    else if (mode === 'popup') {
      let target = undefined
      if (options && options.target) {
        target = options.target
      }
      let features = undefined
      if (options && options.features) {
        features = options.features
      }
      
      if (typeof(features) === 'number' && features <= 1) {
        receiver = popupCenterRedirect(url, features)
      }
      else {
        receiver = window.open(url, target, features)
      }
    }
    
    // ----------------
    
    // ---------------
    let getReceiver = function () {
      if (!receiver && mode === 'iframe') {
        receiver = receiverElement.contentWindow
      } 
      return receiver
    }
    
    //console.log(eventType)
    let result 
    let redirectedURL
    try {
      result = await _sendToReceiver(getReceiver, url, eventType, data)
    }
    catch (e) {
      redirectedURL = e
      autoClose = true
      //console.log(e)
      //return await this.send(e, data, options)
    }
    
    // ---------------
    
    if (autoClose === true) {
      if (mode === 'iframe') {
        if (receiverElement) {
          receiverElement.parentNode.removeChild(receiverElement)
        }
      }
      else {
        receiver.close()
      }
      delete _receiverReadyList[url]
      delete _receiverElementList[url]
    }
    else {
      if (!_receiverElementList[url]) {
        _receiverElementList[url] = receiver
      }
    }
    
    if (!redirectedURL) {
      if (typeof(callback) === 'function') {
        callback(result)
      }

      return result
    }
    else {
      //delete _receiverReadyList[url]
      //delete _receiverElementList[url]
      //console.log('redirectURL', url)
      await sleep(1000)
      return await send(redirectedURL, data, options)
    }
  }
  
  // -----------------------
  
  let _sendToReceiver = async function (getReceiver, url, eventType, data, options) {
    //console.log('_waitReceiverReady', url)
    let redirectedURL = await _waitReceiverReady(url)
    //console.log('等到了', redirectedURL)
    if (typeof(redirectedURL) === 'string') {
      throw redirectedURL
    }
    
    let receiver = getReceiver()
    //console.log(receiver)
    //console.log({sender: location.href, receiver: url} )
    let postMessageData = {
      eventName: 'send',
      eventType: eventType,
      data: data,
      url: location.href
    }
    //console.log('queue', url)
    return new Promise(function (resolve, reject) {
      //receiver.postMessage(postMessageData, '*')
      receiver.postMessage(postMessageData, url)
      
      //console.log('return queue')
      _pushReceiverReturnQueue(url, function (result) {
        //console.log('queue callback')
        resolve(result)
      })
      
      /*
      try {
        receiver.postMessage(postMessageData, url)
      }
      catch (e) {
        console.log('替代方案')
        receiver.postMessage(postMessageData, '*')
      }
       */
      
    })
    
  }
  
  let _receiverReturnQueue = {}
  
  let _pushReceiverReturnQueue = function (url, callback) {
    if (!_receiverReturnQueue[url]) {
      _receiverReturnQueue[url] = []
    }
    if (_receiverReturnQueue[url].indexOf(callback) === -1) {
      _receiverReturnQueue[url].push(callback)
    }
  }
  
  
  // ------------------------
  
  let _messageHandler = function (event) {
    //console.log(event, location.href.slice(location.href.lastIndexOf('/') + 1))
    if (typeof(event.data) !== 'object'
            || !event.data.eventName) {
      return false
    }
    let eventName = event.data.eventName
    let data = event.data.data
    let url = event.data.url
    let eventType  = event.data.eventType
    
    //console.log(eventName, data, url, pageName)
    
    //let origin = event.origin
    let source = event.source
    //let url = event.source.location.href
    
    if (eventName === 'return') {
      _returnEventHandler(url, data)
    }
    else if (eventName === 'send') {
      _sendEventHandler(source, url, eventType, data)
    }
    else if (eventName === 'ready') {
      _readyEventHandler(url)
    }
    else if (eventName === 'error') {
      _errorEventHandler(url, event.data.message)
    }
  }
  
  let _returnEventHandler = function (url, data) {
    //console.log('_returnEventHandler')
    if (Array.isArray(_receiverReturnQueue[url]) === false) {
      return false
    }

    _receiverReturnQueue[url].forEach(function (callback) {
      if (typeof(callback) !== 'function') {
        return false
      }
      callback(data)
    })

    // 清空呼叫的資料
    _receiverReturnQueue[url] = []
    _ExecuteNextSendWait(url)
    return true
  }
  
  let _sendEventHandler = async function (source, origin, eventType, input) {
    let result
    
    //console.log(_receiveHandler, pageName)
    if (typeof(_receiveHandler[eventType]) === 'function') {
      result = await _receiveHandler[eventType](input)
    }
    else {
      //console.log(typeof(_receiveHandler[eventType]), pageName)
      source.postMessage({
        eventName: 'error',
        message: `sender's eventType is not found: ` + eventType,
        url: location.href
      }, origin)
      return false
    }
    
    source.postMessage({
      eventName: 'return',
      data: result,
      url: location.href
    }, origin)
  }
  
  let _readyEventHandler = function (origin) {
    
    // 如果沒有對應上的，那是不是要自動變更啊？
    //console.log(_receiverWaitList[origin], origin, pageName)
    if (typeof(_receiverWaitList[origin]) === 'function') {
      _receiverReadyList[origin] = true
      _receiverWaitList[origin]()
      delete _receiverWaitList[origin]
    }
    else {
      // 搜尋一個還沒呼叫的網址
      for (let o in _receiverWaitList) {
        //console.log('還沒呼叫，有待更名', o)
        
        //_receiverReadyList[o] = true
        //urlRedirect[o] = origin
        
        // 正常呼叫
        let waitCallback = _receiverWaitList[o]
        //_receiverWaitList[origin] = _receiverWaitList[o]
        //_receiverReadyList[o] = true
        urlRedirect[o] = origin
        
        
        //_receiverWaitList[o]
        delete _receiverWaitList[o]
        waitCallback(origin)
        return false
      }
    }
  }
  
  let _errorEventHandler = function (url, message) {
    console.error(message, pageName)
    
    // 清空呼叫的資料
    _receiverReturnQueue[url] = []
    _ExecuteNextSendWait(url)
    return true
  }
  
  let _waitReceiverReady = function (url) {
    //console.log(_receiverReadyList[url], _receiverWaitList[url])
    if (_receiverReadyList[url] === true) {
      return true
    }
    
    return new Promise(function (resolve, reject) {
      _receiverWaitList[url] = function (redirectedURL) {
        if (redirectedURL) {
          resolve(redirectedURL)
        }
        else {
          resolve(true)
        }
      }
      //console.log(_receiverReadyList[url], _receiverWaitList[url], url)
    })
  }
  
  window.addEventListener("message", _messageHandler, true)
  
  // -----------------------
  
  
  // -----------------------
  
  let _receiveHandler = {}
  
  let addReceiveListener = function (eventType, callback) {
    //console.log('來', pageName)
    if (typeof(eventType) === 'function' && !callback) {
      callback = eventType
      eventType = '_default'
    }
    else if (typeof(callback) !== 'function') {
      //console.log('沒能設定', pageName)
      return false
    }
    
    _receiveHandler[eventType] = callback
    //console.log(_receiveHandler, pageName)
  }
  
  let removeReceiveListener = function (eventType, callback) {
    if (typeof(eventType) === 'function' && !callback) {
      callback = eventType
      eventType = '_default'
    }
    
    if (typeof(callback) !== 'function'
            || !_receiveHandler[eventType]) {
      return false
    }
    
    delete _receiveHandler[eventType]
  }
  
  let ready = function () {
    _sendReadyMessage()
  }
  
  // -------------------------------
  
  return {
    send: send,
    addReceiveListener: addReceiveListener,
    removeReceiveListener: removeReceiveListener,
    ready: ready
  }
}