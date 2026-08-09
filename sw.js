importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDT0sQ_ZcT_Jl9_vvjgsgVojP_TCCLaEFM",
  authDomain: "masjed-a6505.firebaseapp.com",
  projectId: "masjed-a6505",
  storageBucket: "masjed-a6505.firebasestorage.app",
  messagingSenderId: "23821410712",
  appId: "1:23821410712:web:1789bb8cc4659377544bed"
});

var fbMessagingSW = firebase.messaging();

fbMessagingSW.onBackgroundMessage(function(payload) {
  var n = payload.notification || {};
  var d = payload.data || {};
  var title = n.title || d.title || '🕌 مسجد آقا منیر';
  var body = n.body || d.body || '';
  self.registration.showNotification(title, {
    body: body,
    icon: 'https://i.ibb.co/S2b6YjQ/unnamed.jpg',
    badge: 'https://i.ibb.co/S2b6YjQ/unnamed.jpg',
    dir: 'rtl',
    lang: 'fa',
    vibrate: [200, 100, 200, 100, 200]
  });
});

self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type: 'window'}).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.includes('masjed') && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
