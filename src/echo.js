import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const auth = JSON.parse(localStorage.getItem("auth"));
const token = auth?.token;

const echo = new Echo({
    broadcaster: "reverb",

    key: import.meta.env.VITE_REVERB_APP_KEY,

    wsHost: import.meta.env.VITE_REVERB_HOST || "127.0.0.1",

    wsPort: Number(import.meta.env.VITE_REVERB_PORT),

    wssPort: Number(import.meta.env.VITE_REVERB_PORT),

    forceTLS: import.meta.env.VITE_REVERB_SCHEME === "https",

    enabledTransports: ["ws", "wss"],
    authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",
    auth: {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    },
});

export default echo;