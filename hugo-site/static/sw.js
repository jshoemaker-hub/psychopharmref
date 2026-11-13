/* PsychoPharmRef service worker: offline reading for the installed app.

   Rules, chosen so clinical content is never served stale when online:
   - Pages (HTML navigations), fragments, JSON and any unversioned file:
     network first; the cached copy is used only when the network fails.
   - CSS/JS with a ?v= cache-bust string: cache first. A new ?v= is a new URL,
     so a deploy that bumps the version is picked up on the next load.
   - Images and fonts: cached copy right away, refreshed in the background.
   - Other sites (analytics, CDNs, Supabase, Formspree) and non-GET requests
     are not touched.
   Bump VERSION to drop every cached copy (e.g. after a large restructure). */
'use strict';

var VERSION = 'ppr-20261112a';
var PAGES = VERSION + '-pages';
var ASSETS = VERSION + '-assets';
var OFFLINE_URL = '/offline.html';
var PRECACHE = [OFFLINE_URL, '/favicon-192.png', '/site.webmanifest'];
var MAX_PAGES = 150;
var MAX_ASSETS = 400;

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(PAGES)
      .then(function (cache) { return cache.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          if (k.indexOf('ppr-') === 0 && k.indexOf(VERSION) !== 0) return caches.delete(k);
          return null;
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

function trim(cacheName, max) {
  return caches.open(cacheName).then(function (cache) {
    return cache.keys().then(function (keys) {
      if (keys.length <= max) return null;
      return Promise.all(keys.slice(0, keys.length - max).map(function (k) { return cache.delete(k); }));
    });
  });
}

function put(cacheName, request, response, max) {
  if (!response || response.status !== 200 || response.type !== 'basic') return;
  var copy = response.clone();
  caches.open(cacheName)
    .then(function (cache) { return cache.put(request, copy); })
    .then(function () { return trim(cacheName, max); })
    .catch(function () {});
}

function networkFirst(request, cacheName, max, fallbackUrl) {
  return fetch(request)
    .then(function (response) {
      put(cacheName, request, response, max);
      return response;
    })
    .catch(function () {
      return caches.match(request)
        .then(function (hit) { return hit || caches.match(request, { ignoreSearch: true }); })
        .then(function (hit) {
          if (hit) return hit;
          if (fallbackUrl) return caches.match(fallbackUrl);
          return Response.error();
        });
    });
}

function cacheFirst(request, cacheName, max) {
  return caches.match(request).then(function (hit) {
    if (hit) return hit;
    return fetch(request).then(function (response) {
      put(cacheName, request, response, max);
      return response;
    });
  });
}

function staleWhileRevalidate(request, cacheName, max) {
  return caches.match(request).then(function (hit) {
    var refresh = fetch(request).then(function (response) {
      put(cacheName, request, response, max);
      return response;
    }).catch(function () { return hit || Response.error(); });
    return hit || refresh;
  });
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;
  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/sw.js') return;
  // The home page preloads the newsroom feed (<link rel=preload>). A worker
  // answering it makes Chrome discard the preload and fetch twice, so leave it
  // to the browser.
  if (url.pathname === '/news/index.json') return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGES, MAX_PAGES, OFFLINE_URL));
    return;
  }
  if (/\.(css|js)$/.test(url.pathname) && url.searchParams.has('v')) {
    event.respondWith(cacheFirst(request, ASSETS, MAX_ASSETS));
    return;
  }
  if (/\.(png|jpe?g|gif|webp|svg|ico|woff2?|ttf|otf)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, ASSETS, MAX_ASSETS));
    return;
  }
  event.respondWith(networkFirst(request, PAGES, MAX_PAGES, null));
});
