
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/provider"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-OWNQGLTU.js"
    ],
    "route": "/provider/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/customer"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-GQ4KNYRW.js"
    ],
    "route": "/customer/dashboard"
  },
  {
    "renderMode": 2,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 4615, hash: '54a3f740c75eb5e4429291feb900b5ba3983c5b0992b46a5980cdad89d1f2705', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1104, hash: 'd9b0fea488e82ca897015c9746db72de48f55c18a683f4d887b4479f1f088e6a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'customer/dashboard/index.html': {size: 24095, hash: '9d18011811b79a8cecee888b344c925b97eb833330979f939361a121e563b181', text: () => import('./assets-chunks/customer_dashboard_index_html.mjs').then(m => m.default)},
    'provider/index.html': {size: 23942, hash: '097a498131b17c10e85327b1aeae7c1cfc4418b5e7565339c1d58ae24b9548e8', text: () => import('./assets-chunks/provider_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 70808, hash: 'a00db8780401291456bed44553408d9953dd4fc401e42d0b38c5385354ce598d', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'customer/index.html': {size: 23942, hash: '097a498131b17c10e85327b1aeae7c1cfc4418b5e7565339c1d58ae24b9548e8', text: () => import('./assets-chunks/customer_index_html.mjs').then(m => m.default)},
    'provider/dashboard/index.html': {size: 88834, hash: '3aa8d651d21ef88dc2dd3de40d958bbfae3c9ff120a525736eade26efab901c9', text: () => import('./assets-chunks/provider_dashboard_index_html.mjs').then(m => m.default)},
    'styles-NZZGWTD3.css': {size: 43557, hash: 'LXiKeDLesy4', text: () => import('./assets-chunks/styles-NZZGWTD3_css.mjs').then(m => m.default)}
  },
};
