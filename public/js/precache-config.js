var SWPrecache = require('sw-precache-webpack-plugin');

module.exports = {
    navigateFallback: '/',
    stripPrefix: 'public',
    root: 'public/',
    plugins : [
        new SWPrecache({
            cacheId: 'herbeat-cache-v2',
            filename: 'service-worker2.js',
            staticFileGlobs: [
                'public/**.html',
                'public/**.js',
                'public/**.css',
                'public/img/**.*',
                'public/manifest.json'
            ],
            stripPrefix: 'public/assets/',
            mergeStaticsConfig: true
        })
    ]
}