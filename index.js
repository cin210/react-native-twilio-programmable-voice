import {
    NativeModules,
    NativeEventEmitter,
    Platform,
} from 'react-native'

const ANDROID = 'android'
const IOS = 'ios'

const TwilioVoice = NativeModules.RNTwilioVoice

const NativeAppEventEmitter = new NativeEventEmitter(TwilioVoice)

const _eventHandlers = {
    deviceReady: new Map(),
    deviceNotReady: new Map(),
    deviceDidReceiveIncoming: new Map(),
    connectionDidConnect: new Map(),
    connectionDidDisconnect: new Map(),
    //android specific
    phoneCallStarted: new Map(),
    phoneCallEnded: new Map(),
    proximity: new Map(),
    wiredHeadset: new Map(),
    //iOS specific
    callRejected: new Map(),
}

const Twilio = {
    // initialize the library with Twilio access token
    // return {initialized: true} when the initialization started
    // Listen to deviceReady and deviceNotReady events to see whether
    // the initialization succeeded
    async initWithToken(token) {
        const result = await TwilioVoice.initWithAccessToken(token)
        // native react promise present only for Android
        // iOS initWithAccessToken doesn't return
        if (Platform.OS === IOS) {
            return {
                initialized: true,
            }
        }
        return result
    },
    initWithTokenUrl(url) {
        if (Platform.OS === IOS) {
            TwilioVoice.initWithAccessTokenUrl(url)
        }
    },
    connect(params = {}) {
        TwilioVoice.connect(params)
    },
    disconnect() {
        TwilioVoice.disconnect()
    },
    accept() {
        if (Platform.OS === IOS) {
            return
        }
        TwilioVoice.accept()
    },
    reject() {
        if (Platform.OS === IOS) {
            return
        }
        TwilioVoice.reject()
    },
    ignore() {
        if (Platform.OS === IOS) {
            return
        }
        TwilioVoice.ignore()
    },
    setMuted(isMuted) {
        TwilioVoice.setMuted(isMuted)
    },
    setSpeakerPhone(value) {
        TwilioVoice.setSpeakerPhone(value)
    },
    isHeadphonesConnected() {
        return TwilioVoice.getIsHeadphonesConnected()
    },
    sendDigits(digits) {
        TwilioVoice.sendDigits(digits)
    },
    requestPermissions(senderId) {
        if (Platform.OS === ANDROID) {
            TwilioVoice.requestPermissions(senderId)
        }
    },
    getActiveCall() {
        return TwilioVoice.getActiveCall()
    },
    configureCallKit(params = {}) {
        if (Platform.OS === IOS) {
            TwilioVoice.configureCallKit(params)
        }
    },
    unregister() {
        if (Platform.OS === IOS) {
            TwilioVoice.unregister()
        }
    },
    addDeviceReadyListener(handler) {
        this.addEventListener('deviceReady', handler)
    },
    removeDeviceReadyListener(handler) {
        this.removeEventListener('deviceReady', handler)
    },
    addDeviceNotReadyListener(handler) {
        this.addEventListener('deviceNotReady', handler)
    },
    removeDeviceNotReadyListener(handler) {
        this.removeEventListener('deviceNotReady', handler)
    },
    addReceiveIncomingListener(handler) {
        this.addEventListener('deviceDidReceiveIncoming', handler)
    },
    removeReceiveIncomingListener(handler) {
        this.removeEventListener('deviceDidReceiveIncoming', handler)
    },
    addConnectionConnectListener(handler) {
        this.addEventListener('connectionDidConnect', handler)
    },
    removeConnectionConnectListener(handler) {
        this.removeEventListener('connectionDidConnect', handler)
    },
    addCallRejectedListener(handler) {
        this.addEventListener('callRejected', handler)
    },
    removeCallRejectedListener(handler) {
        this.removeEventListener('callRejected', handler)
    },
    addEventListener(type, handler) {
        if (_eventHandlers[type].has(handler)) {
            return
        }
        _eventHandlers[type].set(handler, NativeAppEventEmitter.addListener(type, rtn => { handler(rtn) }))
    },
    removeEventListener(type, handler) {
        if (!_eventHandlers[type].has(handler)) {
            return
        }
        _eventHandlers[type].get(handler).remove()
        _eventHandlers[type].delete(handler)
    }
}

export default Twilio
