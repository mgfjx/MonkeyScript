// ==UserScript==
// @name         AoneBug翻译脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AoneBug翻译脚本
// @author       You
// @include      
// @match        https://work.aone.alibaba-inc.com/issue/*
// @match        https://aone.alibaba-inc.com/v2/bug/*
// @match        https://aone.alibaba-inc.com/v2/project/*/bug/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard

// ==/UserScript==

(function () {
    "use strict";

    console.log("AoneBug翻译油猴...");

    window.keyCodeObj = { keyCode: 0, time: (new Date()).valueOf() };
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (!e) {
            return;
        }
        let keyCode = e.keyCode;
        let currentTime = (new Date()).valueOf();
        let changeTime = (currentTime - window.keyCodeObj.time);
        if (keyCode == 17 && keyCode == window.keyCodeObj.keyCode && changeTime <= 300 && changeTime > 100) { //快速双击ctrl键
            console.log("keyCode: " + e.keyCode);
            showHideTranslatePage();
        }
        window.keyCodeObj.keyCode = keyCode;
        window.keyCodeObj.time = currentTime;
    };

    $("body").append(`
    <div class="xl_ab_bg">
    <div class="xl_ab_container">
      <div class="xl_ab_itemContainer xl_ab_itemContainer_1">
        <p class="xl_ab_item_title">BugID:</p>
        <div class="xl_ab_textContainer">
          <textarea class="xl_ab_query" placeholder="输入...""></textarea>
        </div>
        <div class="xl_ab_textContainer">
          <textarea class="xl_ab_result" placeholder="结果...""></textarea>
        </div>
    </div>
    <div class="xl_ab_itemContainer xl_ab_itemContainer_2">
        <p class="xl_ab_item_title">Root Cause:</p>
        <div class="xl_ab_textContainer">
          <textarea class="xl_ab_query" placeholder="输入...""></textarea>
        </div>
        <div class="xl_ab_textContainer">
          <textarea class="xl_ab_result" placeholder="结果...""></textarea>
        </div>
    </div>
    <div class="xl_ab_itemContainer xl_ab_itemContainer_3">
        <p class="xl_ab_item_title">Solution:</p>
        <div class="xl_ab_textContainer">
          <textarea class="xl_ab_query" placeholder="输入...""></textarea>
        </div>
        <div class="xl_ab_textContainer">
          <textarea class="xl_ab_result" placeholder="结果...""></textarea>
        </div>
    </div>
    <div class="xl_ab_itemContainer xl_ab_itemContainer_4">
        <p class="xl_ab_item_title">Test Suggestion:</p>
        <div class="xl_ab_textContainer">
          <textarea class="xl_ab_query" placeholder="输入...""></textarea>
        </div>
        <div class="xl_ab_textContainer">
          <textarea class="xl_ab_result" placeholder="结果...""></textarea>
        </div>
    </div>
    <div class="xl_result_container xl_ab_itemContainer">
        <textarea class="xl_result_textarea" placeholder="结果...""></textarea>
        <div class="xl_ab_translate_5" onselectstart="return false;">
          <svg t="1652258975242" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="1941" width="32" height="32">
            <path
              d="M704 202.666667a96 96 0 0 1 96 96v554.666666a96 96 0 0 1-96 96H213.333333A96 96 0 0 1 117.333333 853.333333V298.666667A96 96 0 0 1 213.333333 202.666667h490.666667z m0 64H213.333333A32 32 0 0 0 181.333333 298.666667v554.666666a32 32 0 0 0 32 32h490.666667a32 32 0 0 0 32-32V298.666667a32 32 0 0 0-32-32z"
              fill="#bfbfbf" p-id="1942"></path>
            <path
              d="M277.333333 362.666667m32 0l298.666667 0q32 0 32 32l0 0q0 32-32 32l-298.666667 0q-32 0-32-32l0 0q0-32 32-32Z"
              fill="#bfbfbf" p-id="1943"></path>
            <path
              d="M277.333333 512m32 0l298.666667 0q32 0 32 32l0 0q0 32-32 32l-298.666667 0q-32 0-32-32l0 0q0-32 32-32Z"
              fill="#bfbfbf" p-id="1944"></path>
            <path
              d="M277.333333 661.333333m32 0l170.666667 0q32 0 32 32l0 0q0 32-32 32l-170.666667 0q-32 0-32-32l0 0q0-32 32-32Z"
              fill="#bfbfbf" p-id="1945"></path>
            <path
              d="M320 138.666667h512A32 32 0 0 1 864 170.666667v576a32 32 0 0 0 64 0V170.666667A96 96 0 0 0 832 74.666667H320a32 32 0 0 0 0 64z"
              fill="#bfbfbf" p-id="1946"></path>
          </svg>
        </div>
      </div>
      <div class="xl_ab_loading">
        <svg t="1652326285802" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2081" width="20" height="20"><path d="M876.864 782.592c3.264 0 6.272-3.2 6.272-6.656 0-3.456-3.008-6.592-6.272-6.592-3.264 0-6.272 3.2-6.272 6.592 0 3.456 3.008 6.656 6.272 6.656z m-140.544 153.344c2.304 2.432 5.568 3.84 8.768 3.84a12.16 12.16 0 0 0 8.832-3.84 13.76 13.76 0 0 0 0-18.56 12.224 12.224 0 0 0-8.832-3.84 12.16 12.16 0 0 0-8.768 3.84 13.696 13.696 0 0 0 0 18.56zM552.32 1018.24c3.456 3.648 8.32 5.76 13.184 5.76a18.368 18.368 0 0 0 13.184-5.76 20.608 20.608 0 0 0 0-27.968 18.368 18.368 0 0 0-13.184-5.824 18.368 18.368 0 0 0-13.184 5.76 20.608 20.608 0 0 0 0 28.032z m-198.336-5.76c4.608 4.8 11.072 7.68 17.6 7.68a24.448 24.448 0 0 0 17.536-7.68 27.456 27.456 0 0 0 0-37.248 24.448 24.448 0 0 0-17.536-7.68 24.448 24.448 0 0 0-17.6 7.68 27.52 27.52 0 0 0 0 37.184z m-175.68-91.84c5.76 6.08 13.824 9.6 21.952 9.6a30.592 30.592 0 0 0 22.016-9.6 34.368 34.368 0 0 0 0-46.592 30.592 30.592 0 0 0-22.016-9.6 30.592 30.592 0 0 0-21.952 9.6 34.368 34.368 0 0 0 0 46.592z m-121.152-159.36c6.912 7.36 16.64 11.648 26.368 11.648a36.736 36.736 0 0 0 26.432-11.584 41.28 41.28 0 0 0 0-55.936 36.736 36.736 0 0 0-26.432-11.584 36.8 36.8 0 0 0-26.368 11.52 41.28 41.28 0 0 0 0 56zM12.736 564.672a42.88 42.88 0 0 0 30.784 13.44 42.88 42.88 0 0 0 30.784-13.44 48.128 48.128 0 0 0 0-65.216 42.88 42.88 0 0 0-30.72-13.44 42.88 42.88 0 0 0-30.848 13.44 48.128 48.128 0 0 0 0 65.216z m39.808-195.392a48.96 48.96 0 0 0 35.2 15.36 48.96 48.96 0 0 0 35.2-15.36 54.976 54.976 0 0 0 0-74.56 48.96 48.96 0 0 0-35.2-15.424 48.96 48.96 0 0 0-35.2 15.424 54.976 54.976 0 0 0 0 74.56zM168.32 212.48c10.368 11.008 24.96 17.408 39.68 17.408 14.592 0 29.184-6.4 39.552-17.408a61.888 61.888 0 0 0 0-83.84 55.104 55.104 0 0 0-39.616-17.408c-14.656 0-29.248 6.4-39.616 17.408a61.888 61.888 0 0 0 0 83.84zM337.344 124.8c11.52 12.16 27.712 19.264 43.968 19.264 16.256 0 32.448-7.04 43.968-19.264a68.672 68.672 0 0 0 0-93.184 61.248 61.248 0 0 0-43.968-19.264 61.248 61.248 0 0 0-43.968 19.264 68.736 68.736 0 0 0 0 93.184z m189.632-1.088c12.672 13.44 30.528 21.248 48.448 21.248s35.712-7.808 48.384-21.248a75.584 75.584 0 0 0 0-102.464A67.392 67.392 0 0 0 575.36 0c-17.92 0-35.776 7.808-48.448 21.248a75.584 75.584 0 0 0 0 102.464z m173.824 86.592c13.824 14.592 33.28 23.104 52.736 23.104 19.584 0 39.04-8.512 52.8-23.104a82.432 82.432 0 0 0 0-111.744 73.472 73.472 0 0 0-52.8-23.168c-19.52 0-38.912 8.512-52.736 23.168a82.432 82.432 0 0 0 0 111.744z m124.032 158.528c14.976 15.872 36.032 25.088 57.216 25.088 21.12 0 42.24-9.216 57.152-25.088a89.344 89.344 0 0 0 0-121.088 79.616 79.616 0 0 0-57.152-25.088c-21.184 0-42.24 9.216-57.216 25.088a89.344 89.344 0 0 0 0 121.088z m50.432 204.032c16.128 17.088 38.784 27.008 61.632 27.008 22.784 0 45.44-9.92 61.568-27.008a96.256 96.256 0 0 0 0-130.432 85.76 85.76 0 0 0-61.568-27.072c-22.848 0-45.44 9.984-61.632 27.072a96.192 96.192 0 0 0 0 130.432z" fill="#1296db" p-id="2082"></path></svg>
      </div>
    </div>
    `);

    window.inputtime = 0;

    function initData() {
        let url = window.location.href;
        console.log('url: ' + url);
        let res = url.indexOf('https://aone.alibaba-inc.com/v2');
        //新版Aone
        if (res == 0) {
            let bugIdTitle = $('.xl_ab_itemContainer_1 p').text();
            if (bugIdTitle.length <= 'BugID:'.length) { //说明翻译页面未打开过，需要再设置默认值
                let title = $('.workItemTitle--workitemTextInput--2V6YDlV').val();
                console.log('title: ' + title);
                if (title && title.length > 0) {
                    $('.xl_ab_itemContainer_1 .xl_ab_query').val(title);
                    translateText(title, (resultText) => {
                        $('.xl_ab_itemContainer_1').find('.xl_ab_result').val(resultText);
                        updateResult();
                    });
                }
                let budId = $($('.AttributeFormat--displayText--1Banb6j')[0]).text();
                if (budId && budId.length > 0) {
                    $('.xl_ab_itemContainer_1 p').text('BugID:' + budId);
                }
                $('.xl_ab_itemContainer_4').find('textarea').val('Test at latest version.');
            }
        } else { //旧版Anoe
            let bugIdTitle = $('.xl_ab_itemContainer_1 p').text();
            console.log('bugIdTitle: ' + bugIdTitle);
            if (bugIdTitle.length <= 'BugID:'.length) { //说明翻译页面未打开过，需要再设置默认值
                let title = $('.detail-content .next-card-title div span').text();
                console.log('title: ' + title);
                if (title && title.length > 0) {
                    $('.xl_ab_itemContainer_1 .xl_ab_query').val(title);
                    translateText(title, (resultText) => {
                        $('.xl_ab_itemContainer_1').find('.xl_ab_result').val(resultText);
                        updateResult();
                    });
                }
                let budId = $('.detail-basic-id').text();
                if (budId && budId.length > 0) {
                    $('.xl_ab_itemContainer_1 p').text('BugID:' + budId);
                }
                $('.xl_ab_itemContainer_4').find('textarea').val('Test at latest version.');
            }
        }
    }

    //判断是否隐藏翻译框
    function showHideTranslatePage() {
        console.log("执行showHideTranslatePage方法");
        let display = $(".xl_ab_bg").css("display");
        if (display == "none") {
            initData();
            $(".xl_ab_bg").css("display", "block");
        } else {
            $(".xl_ab_bg").css({ display: "none" });
        }
    }

    function showLoading(show) {
        if (show) {
            $('.xl_ab_loading').addClass('xl_ab_loading_animate')
        } else {
            $('.xl_ab_loading').removeClass('xl_ab_loading_animate');
        }     
    }

    //点击背景隐藏翻译框
    $(".xl_ab_bg").mousedown(() => {
        showHideTranslatePage();
    });

    //防止事件传递
    $(".xl_ab_container").on("click", () => {
        event.stopPropagation();
    });
    $(".xl_ab_container").mousedown(() => {
        event.stopPropagation();
    });

    $(".xl_ab_translate").mousedown(function () { $(this).find("path").attr("fill", "#ff0000"); });
    $(".xl_ab_translate").mouseup(function () {
        $(this).find("path").attr("fill", "#bfbfbf");
        console.log("mgfjz");
        let query = $(this).parent().find('.xl_ab_query').val();
        console.log(query);
        translateText(query, (resultText) => {
            $(this).parent().find('.xl_ab_result').val(resultText);
            updateResult();
        });
    });

    $(".xl_ab_translate_5").mousedown(function () { $(this).find("path").attr("fill", "#ff0000"); });
    //复制翻译结果到剪切板
    $(".xl_ab_translate_5").mouseup(function () {
        $(this).find("path").attr("fill", "#bfbfbf");
        GM_setClipboard($('.xl_result_textarea').val());
    });
    //更新结果
    function updateResult() {
        let budId = $('.detail-basic-id').text();
        let title = 'BugID:' + budId + ': ' + $('.xl_ab_itemContainer_1 .xl_ab_result').val();
        let rootCause = "Root Cause: " + $('.xl_ab_itemContainer_2 .xl_ab_result').val();
        let solution = "Solution: " + $('.xl_ab_itemContainer_3 .xl_ab_result').val();
        let testSuggestion = "Test Suggestion: " + $('.xl_ab_itemContainer_4 .xl_ab_result').val();
        let result = `${title}\n\n${rootCause}\n${solution}\n${testSuggestion}`;

        $('.xl_ab_itemContainer .xl_result_textarea').val(result);
    }

    $(".xl_ab_query").on("input propertychange", function () {
        var $this = $(this);
        let input = $this.val();
        window.inputtime = (new Date()).valueOf();
        if (window.interval) {
            clearInterval(window.interval);
            window.interval = undefined;
        }
        window.interval = setInterval(() => {
            let curremttime = (new Date()).valueOf();
            if (curremttime - window.inputtime > 1000) {
                clearInterval(window.interval);
                window.interval = undefined;
                translateText(input, (resultText) => {
                    $(this).parent().parent().find('.xl_ab_result').val(resultText);
                    updateResult();
                });
            }
        }, 200);
    });

    //翻译文本
    function translateText(query, callback) {
        if (!query || query.length == 0) {
            console.log("翻译文本为空");
            return;
        }
        console.log('开始翻译：' + query);
        let appid = '20220505001203855';
        let salt = '1231231';
        let appsecret = 'kgLnrss5MVpucE8LOON1';
        let signBefore = appid + query + salt + appsecret;
        let sign = CryptoJS.MD5(signBefore).toString();
        let to = 'en';

        showLoading(true);
        GM_xmlhttpRequest({
            method: "post",
            url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
            data: 'q=' + query + '&from=auto&to=' + to + '&appid=' + appid + '&salt=' + salt + '&sign=' + sign,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function (res) {
                if (res.status === 200) {
                    console.log('成功')
                    console.log(res.response);
                    let response = JSON.parse(res.response);
                    let trans_result = response["trans_result"];
                    if (!trans_result || trans_result.length == 0) {
                        console.log('result: ', firstItem);
                    } else {
                        let firstItem = trans_result[0];
                        callback(firstItem.dst);
                        console.log('result: ', firstItem);
                    }
                } else {
                    console.log('失败')
                    console.log(res)
                }
                showLoading(false);
            },
            onerror: function (err) {
                console.log('error')
                console.log(err)
            }
        });
    }

    GM_addStyle(`
    .xl_ab_bg {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgb(0, 0, 0, 0.8);
        z-index: 10000;
        display: none;
      }
      
      .xl_ab_container {
        /* text-align: center; */
        background-color: #fff;
        border-radius: 20px;
        /* width: 800px; */
        /* height: 600px; */
        margin: 60px 200px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 0;
        font-size: 14px;
      }
      
      .xl_ab_itemContainer {
        position: relative;
      }
      
      .xl_ab_itemContainer p {
        margin: 8px 10px;
      }
      
      .xl_ab_textContainer {
        width: 50%;
        height: 45px;
        float: left;
        text-align: center;
      }
      
      .xl_ab_textContainer textarea {
        width: calc(100% - 10px * 2);
        height: 40px;
        border-width: 0;
        resize: none;
        background-color: #e9e9e9;
        border-radius: 8px;
        border-width: 1px;
        border-color: rgb(213, 211, 211);
      }
      
      .xl_result_container {
        padding-top: 30px;
        position: relative;
        text-align: center;
      }
      
      .xl_result_container textarea {
        width: calc(100% - 10px * 2);
        height: 150px;
        border-width: 0;
        resize: none;
        background-color: #e9e9e9;
        border-radius: 8px;
        border-width: 1px;
        border-color: rgb(213, 211, 211);
      }
      
      .xl_ab_translate_5 {
        bottom: 8px;
        right: 15px;
        position: absolute;
        cursor: pointer;
      }
      
      .xl_ab_loading {
        top: 8px;
        right: 15px;
        width: 20px;
        height: 20px;
        position: absolute;
        display: none;
      }
      
      .xl_ab_loading_animate {
        animation:rotating 1.2s linear infinite;
        -webkit-animation: rotating 1.2s linear infinite;
        display: block;
      }
      
      @keyframes rotating{
        from{transform:rotate(0)}
        to{transform:rotate(360deg)}
      }
      `);
})();
