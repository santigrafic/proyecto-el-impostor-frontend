import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

let echo: any = null;

// ECHO PUSHER
/*export const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: 'eu',
    forceTLS: true,
});
*/
export function getEcho() {
    if (!echo) {
        echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: 'eu',
            forceTLS: true,
        });
    }

    return echo;
}

// ECHO PUSHER ABLY
/*export function getEcho() {
    if (!echo) {
        echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: 'eu',
            wsHost: 'realtime-pusher.ably.io',
            wsPort: 443,
            wssPort: 443,
            forceTLS: true,
            enabledTransports: ['ws', 'wss'],
        });
    }

    return echo;
}*/

// ECHO REVERB
/*const echo = new Echo({
    broadcaster: 'reverb',
    key: 'local',
    wsHost: 'localhost',
    wsPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws'],
});

export default echo;*/

// ECHO.JOIN
/*
import Echo from "laravel-echo";

const token = localStorage.getItem("token");

const echo = new Echo({
  broadcaster: "reverb",
  wsHost: window.location.hostname,
  wsPort: 8080,

  authEndpoint: "/broadcasting/auth",

  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
});

export default echo;
*/