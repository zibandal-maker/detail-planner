// Detailing Log — Service Worker
// 앱 셸을 캐시해 오프라인에서도 구동. 데이터는 IndexedDB(SW 무관).
var CACHE = 'detaillog-v1';
var SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // 동일 출처(앱 셸): 캐시 우선, 네트워크 폴백 후 캐시 갱신
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(function (cached) {
        var net = fetch(req).then(function (res) {
          if (res && res.status === 200) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        }).catch(function () { return cached; });
        return cached || net;
      })
    );
    return;
  }

  // 외부(날씨 API, 지도, CDN): 네트워크 우선, 실패 시 캐시 폴백
  e.respondWith(
    fetch(req).then(function (res) {
      if (res && res.status === 200 && (url.href.indexOf('unpkg.com') > -1 || url.href.indexOf('cdnjs') > -1)) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () { return caches.match(req); })
  );
});
