import "../css/style.css";
import "core-js/stable";
import "regenerator-runtime/runtime";

// const $ = require("jquery")
// // jquery
// $.ajaxSetup({
//     complete: function (XMLHttpRequest, textStatus) {
//         var res = XMLHttpRequest.responseText;
//         try {
//             var data = JSON.parse(res);
//             if (res.errorCode == 401) {
//                 //登录信息过期,请重新登录
//                 setTimeout(function () {
//                     window.location.href = "/#login";
//                 }, 3000)
//             }
//         } catch (e) {

//         }
//     }
// });