// HANA STAY · 예약현황 — Service Worker
const CACHE = 'hana-booking-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// 푸시 알림 수신
self.addEventListener('push', e => {
  let data = { title: '📅 새 예약', body: '예약현황을 확인하세요.', room: '', platform: '' };
  try { data = e.data.json(); } catch(err) {}

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    vibrate: [200, 100, 200],
    tag: 'hana-booking-' + (data.room || 'new'),
    renotify: true,
    data: { url: '/' },
    actions: [
      { action: 'open', title: '예약 확인' }
    ]
  };

  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 알림 클릭 시 앱 열기
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/');
    })
  );
});
