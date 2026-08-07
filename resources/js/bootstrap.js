import axios from "axios";

window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] =
    "XMLHttpRequest";

// Laravel publishes a fresh encrypted XSRF-TOKEN cookie for web requests.
// Axios reads that cookie for every request, so the token remains valid after
// login/logout session regeneration during Inertia SPA navigation.
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;
