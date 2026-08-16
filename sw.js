var CACHE = 'masjed-v92';
var SHELL = ['./', './index.html', './duas-data.js', './manifest.json'];
var AZAN_CACHE = ['https://archive.org/download/adhan.notifications/Mishary_Rashid_al_Afasy_Fajr_Adhan.mp3'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      var jobs = SHELL.map(function(u){ return cache.add(u).catch(function(){}); });
      AZAN_CACHE.forEach(function(u){ jobs.push(cache.add(u).catch(function(){})); });
      return Promise.all(jobs);
    }).then(function(){ return self.skipWaiting(); })
  );
});
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.filter(function(n){ return n !== CACHE; }).map(function(n){ return caches.delete(n); }));
    }).then(function(){ return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  var url = e.request.url;
  if (url.indexOf('hadiths.json') !== -1) return;
  if (url.indexOf('googleapis.com') !== -1 || url.indexOf('firebase') !== -1 || url.indexOf('gstatic.com') !== -1) return;
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(function(res) {
        var clone = res.clone(); caches.open(CACHE).then(function(c){ c.put('./index.html', clone); });
        return res;
      }).catch(function() { return caches.match('./index.html'); })
    );
    return;
  }
  if (url.indexOf(self.location.origin) === 0 || url.indexOf('archive.org') !== -1 ||
      url.indexOf('fonts.gstatic') !== -1 || url.indexOf('ibb.co') !== -1) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        if (cached) return cached;
        return fetch(e.request).then(function(res) {
          if (res && res.status === 200) { var clone = res.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, clone); }); }
          return res;
        }).catch(function(){ return caches.match(e.request); });
      })
    );
  }
});

importScripts('./firebase-app-compat.js');
importScripts('./firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: "AIzaSyDT0sQ_ZcT_Jl9_vvjgsgVojP_TCCLaEFM",
  authDomain: "masjed-a6505.firebaseapp.com",
  projectId: "masjed-a6505",
  storageBucket: "masjed-a6505.firebasestorage.app",
  messagingSenderId: "23821410712",
  appId: "1:23821410712:web:1789bb8cc4659377544bed"
});
firebase.messaging().onBackgroundMessage(function(payload) {
  var n = payload.notification || {};
  self.registration.showNotification(n.title || '🕌 سامانه جامع اطلاع رسانی مساجد', {
    body: n.body || '', icon: 'https://i.ibb.co/S2b6YjQ/unnamed.jpg',
    badge: 'https://i.ibb.co/S2b6YjQ/unnamed.jpg', vibrate: [200,100,200,100,200], dir: 'rtl', lang: 'fa'
  });
});
