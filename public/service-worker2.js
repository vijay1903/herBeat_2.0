/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [
  ['/'],
  ['/dashboard'],
  ['/profile'],
  ['/settings'],
  ["/controllers/dashboardController.js","9b5599f2de77ce77077995f6e2df1cb8"],["/controllers/forgotController.js","646bdfda7e84c8bb4d702d7ad0f38b77"],["/controllers/profileController.js","79082b66b9f476cd939e0797a39512d9"],["/css/custom.css","7bf3693cf2be7db42d3dd118bbf41add"],["/css/jquery.datetimepicker.min.css","45ba3fa7fdd6910d9dfcbd6bacc1ce22"],["/css/new-age.css","a2722167d1d2334016d2bea5ccf24c81"],["/css/new-age.min.css","da40b375f6fb31528cd6e7fae9de77ee"],["/css/sb-admin.css","553e58c91a0691d1e46dc183ae9f2144"],["/css/sb-admin.min.css","2f071c6058c670deb2bd7a8e4fefa611"],["/gulpfile.js","28ca34a7d9788528ec9745e148a9bad5"],["/img/Login_Background.png","197f152e04d53c8d7cf7bef24096af7d"],["/img/bg-cta.jpg","36ddbb2de498313fdacd1b2a64eb8363"],["/img/bg-pattern.png","3c6467278a66af3216348e8588a69062"],["/img/demo-screen-1.jpg","82bcf3c843c811de878424e8d8307250"],["/img/distance.jpg","5659c72e9d3194cd4ca20bfb0d9a2139"],["/img/heart.png","fe4adba5f1825dc9919b53ea4bfbcd70"],["/img/heartrate.gif","da1415eaa668d70dedf13d0f72939354"],["/img/icon_facebook.png","65f80db8b04f032915eecafe16716bfd"],["/img/icon_google.png","b63ad4034e043afb2bb31f64cc4988f1"],["/img/icon_twitter.png","398501d37c270611c8a1103db49c91de"],["/img/logo.png","a4883f56c72b98ed10e009b625c089d3"],["/img/sitting.png","92c90349536b4c6924bd8ff79ab27946"],["/img/standing.jpg","740a3f711c809caeecc791380208e59e"],["/img/steps.png","df524df700619f4b19fd5927eeb4dced"],["/img/walking.jpg","9b77557b1a5697c93eac2692353d663d"],["/img/walking.png","b429d0f27fed51da351f6eee2c04b67f"],["/js/app.js","4c307b2be09bed67332201d5fb31108d"],["/js/custom.js","84dcb19b4119d1cb20b5c7d197ee8092"],["/js/datepair.min.js","1ef365c88dedad9b29a9e06965b0f971"],["/js/firebase.js","4f0b51f6b4a6e719d0bf997cc914c3c7"],["/js/jquery.datepair.min.js","94fed3ea89e9f313f969c71ebd7ec95e"],["/js/moment.js","6e8b1c5371d352f3043a91a4a31badb8"],["/js/new-age.min.js","9fd3637c22238480f4d199585a9b2174"],["/js/precache-config.js","da1699fb9364f68560894de33e174cf5"],["/js/sb-admin-charts.js","90407daef333e32e2e3341d9b32a34f5"],["/js/sb-admin-charts.min.js","871855af11b60c9c9a5969f589d65286"],["/js/sb-admin-datatables.js","cf2bdea415780c215c596dfa5b85d15c"],["/js/sb-admin-datatables.min.js","0d54d87e9e11d64617fa44f60781119d"],["/js/sb-admin.js","659fd3cf1ab19166fc1e4db9e62327a6"],["/js/sb-admin.min.js","70fc60830a3fea81ab1b2e19de24966d"],["/js/sw.js","7cd4581d5caedf1415f429c80fa17cd0"],["/manifest.json","be817d5402d70dc0e07b6e8263dbc391"],["/service-worker.js","deedd99b94c3320a91905575d103883e"],["/vendor/angular-1.4.9/angular-animate.js","6a0217f7dd7924a5e59eaf22c0bbf5ea"],["/vendor/angular-1.4.9/angular-animate.min.js","9c53961c6e16c5fdd3e1564e66167339"],["/vendor/angular-1.4.9/angular-animate.min.js.map","03b91dbc9b7e1c3a3f7e4e4e9c9d0b05"],["/vendor/angular-1.4.9/angular-aria.js","be71a0a76f1cb52a6386192c5b51107b"],["/vendor/angular-1.4.9/angular-aria.min.js","b91fe09801364ffa012b7827d938bc03"],["/vendor/angular-1.4.9/angular-aria.min.js.map","a4d5d355a065c27370cc0ecc3d001464"],["/vendor/angular-1.4.9/angular-cookies.js","d64b3be2a1deb54ee501f07cd36d9730"],["/vendor/angular-1.4.9/angular-cookies.min.js","cf2f7ed8db4dde7c20502490f517ff91"],["/vendor/angular-1.4.9/angular-cookies.min.js.map","8f8c485ea32ed8bafb3e51e88db4130c"],["/vendor/angular-1.4.9/angular-csp.css","5d7bf1728c2447221cad6c6263557306"],["/vendor/angular-1.4.9/angular-loader.js","8123d0df1a9b22d4dc1ef86ed933ebd7"],["/vendor/angular-1.4.9/angular-loader.min.js","908995c20ba92b98d71c2a3d7a6fef5d"],["/vendor/angular-1.4.9/angular-loader.min.js.map","417396feef3102d23d35e1fedd73a6f2"],["/vendor/angular-1.4.9/angular-message-format.js","e9e71e0e35fc20c8945604df6784287b"],["/vendor/angular-1.4.9/angular-message-format.min.js","c526d235bc40ed5eb491875e1d778194"],["/vendor/angular-1.4.9/angular-message-format.min.js.map","fe097f36213f21a96b8d91873be36496"],["/vendor/angular-1.4.9/angular-messages.js","3bfe875a412a2ccae82fbba365a1a010"],["/vendor/angular-1.4.9/angular-messages.min.js","8e9e9ff2c2610853ba9ad83dd5797f4f"],["/vendor/angular-1.4.9/angular-messages.min.js.map","19dad3dfcd4b13f1d11c256cfb6dcea0"],["/vendor/angular-1.4.9/angular-mocks.js","60ac11e1fe3e0985d8c87ef3a00e7dc4"],["/vendor/angular-1.4.9/angular-resource.js","a0ac68af8f9d9f2f3cafed96752c988c"],["/vendor/angular-1.4.9/angular-resource.min.js","84297c4490f5fbece1fee6ee38af3595"],["/vendor/angular-1.4.9/angular-resource.min.js.map","b3554c6cdc09c88ac6ea1f6614c65616"],["/vendor/angular-1.4.9/angular-route.js","e027b53c39a88e3ef76459298b92740c"],["/vendor/angular-1.4.9/angular-route.min.js","0df4318ca766f554e047a7d0d939da29"],["/vendor/angular-1.4.9/angular-route.min.js.map","51c4413e2c99cd1bbc07dd9bc82323b7"],["/vendor/angular-1.4.9/angular-sanitize.js","1dc6414d69994fb3a6be94456901de39"],["/vendor/angular-1.4.9/angular-sanitize.min.js","a2b6e354a3c19855e04f6e19877333d7"],["/vendor/angular-1.4.9/angular-sanitize.min.js.map","354148194a622aa72335e846f7f49b45"],["/vendor/angular-1.4.9/angular-scenario.js","3105bae1fa4c7fecf19a1eb3514da3fa"],["/vendor/angular-1.4.9/angular-touch.js","3e9cbdb05758727cfd8d4d7828c05d84"],["/vendor/angular-1.4.9/angular-touch.min.js","8814f3969ef248fef11a032a119f4d9f"],["/vendor/angular-1.4.9/angular-touch.min.js.map","333a0474da17f9aa8526a13753f70f83"],["/vendor/angular-1.4.9/angular.js","9e75fabc0b1b629ec2283975719c5494"],["/vendor/angular-1.4.9/angular.min.js","9324788c75670e5a821cd5d2355f0754"],["/vendor/angular-1.4.9/angular.min.js.map","d74f62eb7a3dc61e4fccf29268535b23"],["/vendor/angular-1.4.9/errors.json","69318b31ee635919db50a72616ae8320"],["/vendor/angular-1.4.9/version.json","1310a07627f3b634e50dbca737f10bc5"],["/vendor/angular-1.4.9/version.txt","fd608f3cf9009e4cb89b731d0090d89f"],["/vendor/angular-chart/angular-chart.min.js","4865b47b88e201c2c2b1bc9efc35e6b1"],["/vendor/bootstrap/css/bootstrap-grid.css","5b8e85055bb8b4bf4ac7f4edddcf7ab7"],["/vendor/bootstrap/css/bootstrap-grid.min.css","c9654d9c891fe3e57fde9cd355a916a4"],["/vendor/bootstrap/css/bootstrap-reboot.css","b69603cbb0408fbad0ea399a67ef095d"],["/vendor/bootstrap/css/bootstrap-reboot.min.css","38e73bab749ee7eba9bed51d6982a19e"],["/vendor/bootstrap/css/bootstrap.css","c9919db426ef5de42afc3b68a64b0106"],["/vendor/bootstrap/css/bootstrap.min.css","8bf606b1a87b6284a8522d8dee144fda"],["/vendor/bootstrap/fonts/glyphicons-halflings-regular.eot","f4769f9bdb7466be65088239c12046d1"],["/vendor/bootstrap/fonts/glyphicons-halflings-regular.svg","89889688147bd7575d6327160d64e760"],["/vendor/bootstrap/fonts/glyphicons-halflings-regular.ttf","e18bbf611f2a2e43afc071aa2f4e1512"],["/vendor/bootstrap/fonts/glyphicons-halflings-regular.woff","fa2772327f55d8198301fdb8bcfc8158"],["/vendor/bootstrap/fonts/glyphicons-halflings-regular.woff2","448c34a56d699c29117adc64c43affeb"],["/vendor/bootstrap/js/bootstrap.bundle.js","98b1940b4651da6862ac11697ace3481"],["/vendor/bootstrap/js/bootstrap.bundle.js.map","1d446b0e668ececab31cd3cb5e137d4a"],["/vendor/bootstrap/js/bootstrap.bundle.min.js","cd3ac208f0038f8559d6c917585bca01"],["/vendor/bootstrap/js/bootstrap.bundle.min.js.map","c41626cedb5efebbfb7b18e140042613"],["/vendor/bootstrap/js/bootstrap.js","ce645263c46a2e4d5b8784eeb1915afc"],["/vendor/bootstrap/js/bootstrap.js.map","1659c6f13c0a9611a9ae186d99184f18"],["/vendor/bootstrap/js/bootstrap.min.js","46b549bdc90920f18a911f186b9dd75c"],["/vendor/bootstrap/js/bootstrap.min.js.map","97aa185a0946b2aae827ac35ea0bcabb"],["/vendor/bootstrap3/css/bootstrap.css","2a31dca112f26923b51676cb764c58d5"],["/vendor/bootstrap3/css/bootstrap.min.css","433db1e05cc47eff855703a5f2e19e21"],["/vendor/bootstrap3/fonts/glyphicons-halflings-regular.eot","f4769f9bdb7466be65088239c12046d1"],["/vendor/bootstrap3/fonts/glyphicons-halflings-regular.svg","89889688147bd7575d6327160d64e760"],["/vendor/bootstrap3/fonts/glyphicons-halflings-regular.ttf","e18bbf611f2a2e43afc071aa2f4e1512"],["/vendor/bootstrap3/fonts/glyphicons-halflings-regular.woff","fa2772327f55d8198301fdb8bcfc8158"],["/vendor/bootstrap3/fonts/glyphicons-halflings-regular.woff2","448c34a56d699c29117adc64c43affeb"],["/vendor/bootstrap3/js/bootstrap.js","fb81549ee2896513a1ed5714b1b1a0f0"],["/vendor/bootstrap3/js/bootstrap.min.js","5869c96cc8f19086aee625d670d741f9"],["/vendor/bootstrap4/css/bootstrap-grid.css","db438cff680b6d0c029f75647b4b138a"],["/vendor/bootstrap4/css/bootstrap-grid.css.map","622b296beb2afca293e90ab5ba6db14f"],["/vendor/bootstrap4/css/bootstrap-grid.min.css","2206c9fb0197956129137af662b31115"],["/vendor/bootstrap4/css/bootstrap-grid.min.css.map","a79533cec9980bfa1d99928dd3a81d53"],["/vendor/bootstrap4/css/bootstrap-reboot.css","cceed351e3a8401f573988a38e78d3a8"],["/vendor/bootstrap4/css/bootstrap-reboot.css.map","196fde56f0710e83886b21f5c7ee389e"],["/vendor/bootstrap4/css/bootstrap-reboot.min.css","e2b23d34f3fcc9ce074c942e76f25d61"],["/vendor/bootstrap4/css/bootstrap-reboot.min.css.map","dd0692f26351a6c9ef99e9b342a7da6b"],["/vendor/bootstrap4/css/bootstrap.css","82252d754417f95f7779be349acc6361"],["/vendor/bootstrap4/css/bootstrap.css.map","7f22dc40aa22dc514eaf73c8d619e8bd"],["/vendor/bootstrap4/css/bootstrap.min.css","ecbf078d9fdb0c47bf7c839772a72a3f"],["/vendor/bootstrap4/css/bootstrap.min.css.map","ea6c3c97d126f9996d7cc206f2df625b"],["/vendor/bootstrap4/js/bootstrap.bundle.js","ee08eb7f44335a3cf385e03d4406e4a5"],["/vendor/bootstrap4/js/bootstrap.bundle.js.map","1d446b0e668ececab31cd3cb5e137d4a"],["/vendor/bootstrap4/js/bootstrap.bundle.min.js","d70c474886678aebe3e9d91965dc8b62"],["/vendor/bootstrap4/js/bootstrap.bundle.min.js.map","c41626cedb5efebbfb7b18e140042613"],["/vendor/bootstrap4/js/bootstrap.js","c2cdb900858c3e63ce8cd9f69171d342"],["/vendor/bootstrap4/js/bootstrap.js.map","1659c6f13c0a9611a9ae186d99184f18"],["/vendor/bootstrap4/js/bootstrap.min.js","eb5fac582a82f296aeb74900b01a2fa3"],["/vendor/bootstrap4/js/bootstrap.min.js.map","97aa185a0946b2aae827ac35ea0bcabb"],["/vendor/charts/Chart.bundle.js","d18063fe5400e354e20bb3d2d34ce16a"],["/vendor/charts/Chart.bundle.min.js","857fc46bdca5bf534cf9ed111e732a01"],["/vendor/charts/Chart.js","b3c4f8661a73c6997c7f0aad0583a9db"],["/vendor/charts/Chart.min.js","f6c8efa65711e0cbbc99ba72997ecd0e"],["/vendor/datatables-plugins/dataTables.bootstrap.css","c8c97e927c305e8696af1dc0839f524a"],["/vendor/datatables-plugins/dataTables.bootstrap.js","24f79934c309c1b44c01bfd87a11c07c"],["/vendor/datatables-plugins/dataTables.bootstrap.min.js","0b47c89e21f255c1dd714c4acf7ff89c"],["/vendor/datatables-plugins/index.html","f3f5796209da14688e83d9e0afb93dd2"],["/vendor/datatables-responsive/dataTables.responsive.css","8fa6f4c97214a80551d5d64a3d0dc23a"],["/vendor/datatables-responsive/dataTables.responsive.js","11ce3e94e64e2857f52d140951bea9a8"],["/vendor/datatables-responsive/dataTables.responsive.scss","009d5e5bd8e23584fdb5d8d76ff9e435"],["/vendor/datatables/dataTables.bootstrap4.css","ee3e90e010022f123537d0d0d04f5351"],["/vendor/datatables/dataTables.bootstrap4.js","8711d173af9a9a3428a446e538e350b1"],["/vendor/datatables/jquery.dataTables.js","56e12259e461cb76524d81c030fe299a"],["/vendor/daterangepicker/daterangepicker.css","c9d158725fa8ab9e6f813f164027abe6"],["/vendor/daterangepicker/daterangepicker.js","da8560017609bff380f17a51a9d181da"],["/vendor/flot-tooltip/jquery.flot.tooltip.js","e3fd6c1235b3815ba217941710b547f5"],["/vendor/flot-tooltip/jquery.flot.tooltip.min.js","0b4ec94bbd1a4676cbf0cf7936cadb85"],["/vendor/flot-tooltip/jquery.flot.tooltip.source.js","4ed96a10de13bbbb65053f7ebf6cab32"],["/vendor/flot/excanvas.js","e5b3968f64661f1893cf740191e959c5"],["/vendor/flot/excanvas.min.js","ee9e3fee14270b7b27fcaa0e2cf2e042"],["/vendor/flot/jquery.colorhelpers.js","88e3b66abe16e03c573a0c969dde3f3c"],["/vendor/flot/jquery.flot.canvas.js","a8710d08b758015617c9518fcad90a69"],["/vendor/flot/jquery.flot.categories.js","b404141c778bcfa27d02f943352fbc4e"],["/vendor/flot/jquery.flot.crosshair.js","78077b855f710839538571453a245a33"],["/vendor/flot/jquery.flot.errorbars.js","73fcfdc8eb3b79de42e4e9a009749127"],["/vendor/flot/jquery.flot.fillbetween.js","84e8ec6c5278063e64ee6e574190303a"],["/vendor/flot/jquery.flot.image.js","2947d3bde8e2384bd85e3faf6f44c433"],["/vendor/flot/jquery.flot.js","89bc8ea971e99653717fa69a73d70bb4"],["/vendor/flot/jquery.flot.navigate.js","0fd6d20c90a468fd43d5573542cfab4b"],["/vendor/flot/jquery.flot.pie.js","62dbbef98865feaa20a7f936c56ab931"],["/vendor/flot/jquery.flot.resize.js","826b0d2739932ac103bf420dbadd048e"],["/vendor/flot/jquery.flot.selection.js","6e4a2701adaf2ace52c100aba5c3eace"],["/vendor/flot/jquery.flot.stack.js","76945205e6094cc16871aef9b27606d7"],["/vendor/flot/jquery.flot.symbol.js","ca6ad22013ca6285353f1cf0ed07b90e"],["/vendor/flot/jquery.flot.threshold.js","acee3dea7eab3e1637f64ee5fa5adb98"],["/vendor/flot/jquery.flot.time.js","6a49d955cbc76f5c2fecce8a185f6291"],["/vendor/flot/jquery.js","2073df88a429ccbe5dca5e2c40e742b4"],["/vendor/font-awesome/css/fa-brands.css","ef4b96231c1c8e5bc6d2018ff59ee62e"],["/vendor/font-awesome/css/fa-brands.min.css","e7771f7bdea7a420973e20cd173a1b19"],["/vendor/font-awesome/css/fa-regular.css","4dc9fb8af478dad580da0763c3bb2c4d"],["/vendor/font-awesome/css/fa-regular.min.css","b7a248c091ece954a64f4fde5dae801d"],["/vendor/font-awesome/css/fa-solid.css","f59b676f5ab1dca6ba71e7eba50cd004"],["/vendor/font-awesome/css/fa-solid.min.css","286b42d8d5ab6254c10c8cfbc00ce955"],["/vendor/font-awesome/css/fontawesome-all.css","0a2ed388e9c6ab831acb42c006aa91a3"],["/vendor/font-awesome/css/fontawesome-all.min.css","d61bfe9b56c13ecff5313ee3abb45e8b"],["/vendor/font-awesome/css/fontawesome.css","695883f214d9afb980d1fdc2fca6ee1a"],["/vendor/font-awesome/css/fontawesome.min.css","497c6efa3acaba85fb0a1b4f76b61bde"],["/vendor/font-awesome/fonts/FontAwesome.otf","0d2717cd5d853e5c765ca032dfd41a4d"],["/vendor/font-awesome/fonts/fontawesome-webfont.eot","674f50d287a8c48dc19ba404d20fe713"],["/vendor/font-awesome/fonts/fontawesome-webfont.svg","912ec66d7572ff821749319396470bde"],["/vendor/font-awesome/fonts/fontawesome-webfont.ttf","b06871f281fee6b241d60582ae9369b9"],["/vendor/font-awesome/fonts/fontawesome-webfont.woff","fee66e712a8a08eef5805a46892932ad"],["/vendor/font-awesome/fonts/fontawesome-webfont.woff2","af7ae505a9eed503f8b8e6982036873e"],["/vendor/font-awesome/less/_animated.less","b045fe8800c8f96593cac5227dc70262"],["/vendor/font-awesome/less/_bordered-pulled.less","d7ea7f8a7cdd50096d33e87e1ffa72e7"],["/vendor/font-awesome/less/_core.less","afc2d21306033cb43d322aad01824bcf"],["/vendor/font-awesome/less/_fixed-width.less","66841bce86bf73e79d8f0bff3d9cf7e5"],["/vendor/font-awesome/less/_icons.less","d046572e8c0e9e2485074e814499ed6e"],["/vendor/font-awesome/less/_larger.less","8fe52d3bf9e4dbb2000a108ca4e19a46"],["/vendor/font-awesome/less/_list.less","1d65d467e8bbae507fcd0a80945965b7"],["/vendor/font-awesome/less/_mixins.less","a7fa063476ba6db5346f7330ac3f0b41"],["/vendor/font-awesome/less/_rotated-flipped.less","96a02c0efee0dcc6e2b331ea69f5cc27"],["/vendor/font-awesome/less/_screen-reader.less","0f881617264587bef0df6ce92253ecea"],["/vendor/font-awesome/less/_stacked.less","deda57b8b5e6122615676d99e1115cb9"],["/vendor/font-awesome/less/_variables.less","a1649504fbbf63816a94f549b8d7e389"],["/vendor/font-awesome/less/fa-brands.less","074d982c5ca773385eb3fbe39776f738"],["/vendor/font-awesome/less/fa-regular.less","ba65ec7650db6c30f82aacab1c9a1c36"],["/vendor/font-awesome/less/fa-solid.less","cbdea7f3fa05d33c2b5cc1a531c62a58"],["/vendor/font-awesome/less/fontawesome.less","4277d67a10caca5e0af85e9a4e159a8d"],["/vendor/font-awesome/scss/_animated.scss","992453b341bee5e9d63562bdf68bf5da"],["/vendor/font-awesome/scss/_bordered-pulled.scss","7437104ba89f8110cf86ce53b8957f71"],["/vendor/font-awesome/scss/_core.scss","fe21fd26336da7258a399d4fdff54c1c"],["/vendor/font-awesome/scss/_fixed-width.scss","e52b0377dc3347ac4db3adf75485ad52"],["/vendor/font-awesome/scss/_icons.scss","f88c9987989634da1023a9e0011650c0"],["/vendor/font-awesome/scss/_larger.scss","dd70b195f23b6aa62debdbaab018a75b"],["/vendor/font-awesome/scss/_list.scss","07930141d534140cea5527018bdc726c"],["/vendor/font-awesome/scss/_mixins.scss","df40bc4d64a720dcb611b911b740b1f9"],["/vendor/font-awesome/scss/_rotated-flipped.scss","a74bcad45d849b2682f1778dfa11713f"],["/vendor/font-awesome/scss/_screen-reader.scss","fa45b2d8ef7113ee7893ea60d7976e6c"],["/vendor/font-awesome/scss/_stacked.scss","b4f1bb74796804022df72c8acd80797d"],["/vendor/font-awesome/scss/_variables.scss","f976ec259b801b584adc38ace360ce36"],["/vendor/font-awesome/scss/fa-brands.scss","01369c2ebab65e67bf3f55072b355d86"],["/vendor/font-awesome/scss/fa-regular.scss","6ba1e6b16cd3a9f912f427441040b5f8"],["/vendor/font-awesome/scss/fa-solid.scss","066de4821be12eedab33e3274d43dcb5"],["/vendor/font-awesome/scss/fontawesome.scss","8e82bc63f51287e51794bce055323b5a"],["/vendor/font-awesome/webfonts/fa-brands-400.eot","748ab466bee11e0b2132916def799916"],["/vendor/font-awesome/webfonts/fa-brands-400.svg","b032e14eac87e3001396ff597e4ec15f"],["/vendor/font-awesome/webfonts/fa-brands-400.ttf","7febe26eeb4dd8e3a3c614a144d399fb"],["/vendor/font-awesome/webfonts/fa-brands-400.woff","2248542e1bbbd548a157e3e6ced054fc"],["/vendor/font-awesome/webfonts/fa-brands-400.woff2","3654744dc6d6c37c9b3582b57622df5e"],["/vendor/font-awesome/webfonts/fa-regular-400.eot","b58f468f84168d61e0ebc1e1f423587c"],["/vendor/font-awesome/webfonts/fa-regular-400.svg","3929b3ef871fa90bbb4e77e005851e74"],["/vendor/font-awesome/webfonts/fa-regular-400.ttf","54f142e03adc6da499c2af4f54ab76fd"],["/vendor/font-awesome/webfonts/fa-regular-400.woff","f3dd4f397fbc5aaf831b6b0ba112d75c"],["/vendor/font-awesome/webfonts/fa-regular-400.woff2","33f727ccde4b05c0ed143c5cd78cda0c"],["/vendor/font-awesome/webfonts/fa-solid-900.eot","035a137af03db6f1af76a589da5bb865"],["/vendor/font-awesome/webfonts/fa-solid-900.svg","9bbbee00f65769a64927764ef51af6d0"],["/vendor/font-awesome/webfonts/fa-solid-900.ttf","b6a14bb88dbc580e45034af297c8f605"],["/vendor/font-awesome/webfonts/fa-solid-900.woff","6661d6b3521b4c480ba759e4b9e480c1"],["/vendor/font-awesome/webfonts/fa-solid-900.woff2","8a8c0474283e0d9ef41743e5e486bf05"],["/vendor/jquery-easing/jquery.easing.compatibility.js","ba0f90adf86e509dfabe178af9e726fc"],["/vendor/jquery-easing/jquery.easing.js","b55af8280cffdeaed8cc30b960f68878"],["/vendor/jquery-easing/jquery.easing.min.js","e2d41e5c8fed838d9014fea53d45ce75"],["/vendor/jquery-ui-daterangepicke/LICENSE.txt","30c1c523ea63815cb553c29e8771c933"],["/vendor/jquery-ui-daterangepicke/README.md","45af5b6f58f0deb24ea1f576147b7493"],["/vendor/jquery-ui-daterangepicke/bower.json","48cd53072d44f001d6127dbf7434c147"],["/vendor/jquery-ui-daterangepicke/jquery.comiseo.daterangepicker.css","33152fd26ae660b3875b68c9576bb9ff"],["/vendor/jquery-ui-daterangepicke/jquery.comiseo.daterangepicker.js","9cbcf70d0f2c3965b1ac79633098a33f"],["/vendor/jquery/jquery.js","6a07da9fae934baf3f749e876bbfdd96"],["/vendor/jquery/jquery.min.js","a09e13ee94d51c524b7e2a728c7d4039"],["/vendor/jquery/jquery.min.map","bae3c738b74dd89a555b7a54e4891608"],["/vendor/jquery/jquery.slim.js","450d478c0491cf0b2d365997faff70dd"],["/vendor/jquery/jquery.slim.min.js","99b0a83cf1b0b1e2cb16041520e87641"],["/vendor/jquery/jquery.slim.min.map","375e0272b0153d6871979c5ac2465321"],["/vendor/metisMenu/metisMenu.css","9ec48ac7744d0c6be131a5f7f92f0881"],["/vendor/metisMenu/metisMenu.js","cebf24900b252bd12d43046c99c6f85f"],["/vendor/metisMenu/metisMenu.min.css","bb3f6f86f3feb94b2ba7b43c9d315c54"],["/vendor/metisMenu/metisMenu.min.js","9d596cdad6a6e250ced46785d04adf4e"],["/vendor/morrisjs/morris.css","36e70bf949fcdb7d0fe55fc16ce86445"],["/vendor/morrisjs/morris.js","c33aff9ca10315c7f9a9aa320b69abba"],["/vendor/morrisjs/morris.min.js","fadac462637afd6cdc0cb0a0137629af"],["/vendor/raphael/raphael.js","e9b231a312b5e4cf81a3ad4be5383259"],["/vendor/raphael/raphael.min.js","1a032ef683f9ce4ccd105f87378163cc"],["/vendor/simple-line-icons/css/simple-line-icons.css","093ca662394ed698fdb5835e425d28dd"],["/vendor/simple-line-icons/fonts/Simple-Line-Icons.eot","f33df365d6d0255b586f2920355e94d7"],["/vendor/simple-line-icons/fonts/Simple-Line-Icons.svg","2fe2efe63441d830b1acd106c1fe8734"],["/vendor/simple-line-icons/fonts/Simple-Line-Icons.ttf","d2285965fe34b05465047401b8595dd0"],["/vendor/simple-line-icons/fonts/Simple-Line-Icons.woff","78f07e2c2a535c26ef21d95e41bd7175"],["/vendor/simple-line-icons/fonts/Simple-Line-Icons.woff2","0cb0b9c589c0624c9c78dd3d83e946f6"],["/vendor/simple-line-icons/less/simple-line-icons.less","60d5f2e6ea99a251cd82ef970972943e"],["/vendor/simple-line-icons/scss/simple-line-icons.scss","56d7e0f9aa611b932eb2a41649a2fd76"],["/views/dashboard.html","567d92f8c510eeb076b5fd4efb216015"],["/views/forgotpassword.html","0678b21ea81b6dcd1b1cab54f52bfec3"],["/views/index.html","bade121acdbce55e66348e785f201c07"],["/views/messaging.html","5726aafc73a7d5089fcc9b0da974055a"],["/views/profile.html","37386eb46dc8ebfe9a7547fb8485cf0e"],["/views/settings.html","ac039fd52ee85ab96b74779fa76e2290"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '/';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







