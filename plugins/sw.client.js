export default function () {
  console.log('INSTALLING SW')
  // Service workers
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw-push.js')
  }
}
