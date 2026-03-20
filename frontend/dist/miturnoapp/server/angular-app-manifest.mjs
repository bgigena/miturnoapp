
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "route": "/"
  },
  {
    "renderMode": 0,
    "route": "/login"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-FKK44FXH.js"
    ],
    "route": "/provider"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-FKK44FXH.js"
    ],
    "route": "/provider/dashboard"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-SIHOSCUM.js"
    ],
    "route": "/customer"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-SIHOSCUM.js"
    ],
    "route": "/customer/dashboard"
  },
  {
    "renderMode": 0,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 5161, hash: '94e989cbf3c03bd7b0ef78bb8fcfb4599a8459473989b65f51fbabe7f4b45a31', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1050, hash: 'cd192dadb3a233845162cc5acb10956c8670a8dcbacb57bb033f3be9acf5371e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-INEZUH72.css': {size: 50469, hash: 'M4XBGLR+a+Q', text: () => import('./assets-chunks/styles-INEZUH72_css.mjs').then(m => m.default)}
  },
};
