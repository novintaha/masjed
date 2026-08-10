// Service Worker مسجد - نسخه ۴۰
// caching صوت اذان برای پخش آفلاین

var CACHE_NAME = 'masjed-cache-v40';
var AZAN_URLS = [
  'https://archive.org/download/adhan.notifications/Mishary_Rashid_al_Afasy_Fajr_Adhan.mp3',
  'https://archive.org/download/adhan.notifications/Ahmed_al_Imadi_Adhan.mp3',
  'https://archive.org/download/adhan.notifications/Nasser_al_Qatami_Adhan.mp3'
];

// نصب SW - precache کردن صوت اذان
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(AZAN_URLS).then(function() {
        return self.skipWaiting();
      }).catch(function(err) {
        console.log('Cache failed:', err);
        return self.skipWaiting();
      });
    })
  );
});

// فعال‌سازی SW
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Cache اول، سپس Network (برای صوت اذان و ادعیه)
self.addEventListener('fetch', function(event) {
  var url = event.request.url;
  
  // کش صوت اذان و صوت ادعیه
  if (url.indexOf('archive.org') !== -1 || url.indexOf('adhan') !== -1) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(response) {
          if (!response || response.status !== 200) return response;
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }
  
  // FCM و فایل‌های محلی را عبور بده
  if (url.indexOf('googleapis') !== -1 || url.indexOf('firebase') !== -1 || url.indexOf('fcm') !== -1) {
    return;
  }
});

// مدیریت پیام‌های FCM در پس‌زمینه
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

var messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  var n = payload.notification || {};
  var title = n.title || '🕌 مسجد آقا منیر';
  var options = {
    body: n.body || '',
    icon: 'https://i.ibb.co/S2b6YjQ/unnamed.jpg',
    badge: 'https://i.ibb.co/S2b6YjQ/unnamed.jpg',
    vibrate: [200, 100, 200, 100, 200],
    dir: 'rtl',
    lang: 'fa'
  };
  self.registration.showNotification(title, options);
});
