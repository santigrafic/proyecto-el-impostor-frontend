import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: 'local',
    wsHost: 'localhost',
    wsPort: 8080,
    forceTLS: false,
    enabledTransports: ['ws'],
});

export default echo;

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