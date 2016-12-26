import Socket from 'socket.io-client';
import Sails from 'sails.io.js';

// Instantiate the socket client (`io`)
let io = Sails(Socket),
    socket = io.socket;

// CONFIGURATIONS
// Disable all socket logs
// io.sails.environment = "production";

// Disable auto connection
io.sails.reconnection = true;
// io.sails.autoConnect = false;
// if (!io.socket.isConnected())
//     io.sails.connect(null, {forceNew: true});

((oldOnFunction)=>{
    // MUST BE WRITE LIKE OLD JAVASCRIPT function CANT BE ()=>{}
    // IT THROWS TypeError: Cannot read property '#<Object>' of undefined
    socket.on = function(evName, fn, turnSocketOff) {
        if (turnSocketOff) {
            // add listener when route changes
            document.addEventListener('turbolinks:load', () => {
                // remove listener when route changes
                document.removeEventListener('turbolinks:load', () => {});
                // remove the socket listener or turn the socket off
                turnSocketOff();
            });
        }
        oldOnFunction.apply(this, arguments);
    }
})(socket.on);

// socket.get = (url, data, cb) => {
// console.log('get?')
//     // `data` is optional
//     if (typeof data === 'function') {
//         cb = data;
//         data = {};
//     }
//
//
//
//     return socket.request({
//         method: 'get',
//         params: data,
//         url: url
//     }, cb);
// }

export default socket;

// Expose connected `socket` instance globally so that it's easy
// to experiment with from the browser console while prototyping.
// window.socket = socket;
