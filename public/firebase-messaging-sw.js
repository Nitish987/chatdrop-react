importScripts('https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/10.2.0/firebase-messaging.js')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../firebase-messaging-sw.js');
}