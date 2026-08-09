self.addEventListener('install', function(e) { console.log('[SW] installing'); self.skipWaiting(); });
self.addEventListener('activate', function(e) { console.log('[SW] activated'); e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(e) {
  console.log('[SW] PUSH RECEIVED');
  var title = '🕌 مسجد آقا منیر';
  var body = 'پیام جدید';
  if (e.data) {
    try {
      var d = e.data.json();
      if (d.notification && d.notification.title) title = d.notification.title;
      else if (d.data && d.data.title) title = d.data.title;
      if (d.notification && d.notification.body) body = d.notification.body;
      else if (d.data && d.data.body) body = d.data.body;
    } catch(err) { try { body = e.data.text(); } catch(e2) {} }
  }
  console.log('[SW] showing:', title, body);
  e.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: 'https://i.ibb.co/S2b6YjQ/unnamed.jpg',
      badge: 'https://i.ibb.co/S2b6YjQ/unnamed.jpg',
      dir: 'rtl',
      lang: 'fa',
      vibrate: [200, 100, 200, 100, 200]
    })
  );
});

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
