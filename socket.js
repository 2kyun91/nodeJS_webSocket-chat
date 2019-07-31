/**
 * 익스프레스(HTTP)와 웹소켓(WS)은 같은 포트를 공유할 수 있으므로 별도의 작업이 필요하지 않다.
 * 연결 후에는 웹 소켓 서버에 이벤트 리스너를 붙여준다.
 * 웹 소켓은 이벤트 기반으로 작동한다.
 * ws 패키지는 간단하게 웹 소켓을 사용하고자 할 때 좋다. 구현하고자 하는 서비스가 복잡한 경우에는 Socket.IO를 사용하는 것이 편하다.
 */
const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server({server});

    wss.on('connection', (ws, req) => { // 클라이언트가 서버와 웹 소켓 연결을 맺을 때 발생한다.
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // 클라이언트의 IP를 알아내는 유명한 방법으로 알아두고 있으면 편하다.
        
        console.log('새로운 클라이언트 접속', ip);
        
        ws.on('message', (message) => {
            console.log(message);
        });

        ws.on('error', (error) => {
            console.error(error);
        });

        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval);
        });

        /**
         * 웹 소켓 상태
         * - CONNECTING : 연결중
         * - OPEN : 열림, 이 때만 에러 없이 메시지를 보낼 수 있다.
         * - CLOSING : 닫는 중
         * - CLOSED : 닫힘
         * */
        const interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
                ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
            }
        }, 3000);
        ws.interval = interval;
    });
};