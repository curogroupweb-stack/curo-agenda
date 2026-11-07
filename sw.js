// CURO Agenda: recibe los avisos aunque la agenda esté cerrada.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { cuerpo: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'CURO Agenda', {
    body: d.cuerpo || 'Tenés tareas por vencer.',
    icon: '/icono-192.png',
    badge: '/icono-192.png',
    tag: d.etiqueta || 'curo-agenda',
    renotify: true,
    requireInteraction: true,
    data: { url: '/' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const v of ventanas) { if ('focus' in v) return v.focus(); }
    return self.clients.openWindow('/');
  })());
});
