self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(e) {
  var title = '🕌 مسجد آقا منیر';
  var body = '';
  try {
    var p = e.data.json();
    if (p.notification && p.notification.title) title = p.notification.title;
    else if (p.data && p.data.title) title = p.data.title;
    if (p.notification && p.notification.body) body = p.notification.body;
    else if (p.data && p.data.body) body = p.data.body;
  } catch(err) {
    try { body = e.data.text(); } catch(e2) {}
  }
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
