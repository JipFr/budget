export default function () {
  // Service workers
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw-push.js')
  }
}
