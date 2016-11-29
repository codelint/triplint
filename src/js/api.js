// ajax - tool
if(typeof String.prototype.endsWith !== 'function'){
    String.prototype.endsWith = function(suffix){
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
OSS_DOMAIN = 'oss-cn-hangzhou.aliyuncs.com';
OSS_IMG_DOMAIN = 'img-cn-hangzhou.aliyuncs.com';
ROOT_URL = 'http://' + location.host + '/wap';
U = typeof(U) == 'undefined' ? {} : U;

U.ajax = (function($){
    var retryInterval = 500;
    var retryTimes = 3;
    var lastCallTime = {};
    var noop = function(){};

    var loading_tip = function (){
        var html = '<div id="">' +
            '<div class="weui-mask_transparent"></div>' +
            '<div class="weui-toast">' +
            '<i class="weui-loading weui-icon_toast"></i>' +
            '<p class="weui-toast__content">数据加载中</p>' +
            '</div></div></div>';
        var $html = $(html).hide();
        $('body').append($html);
        setTimeout(function(){
            $html.show();
        }, 0);
        return $html;
    };

    var $loading_pop = [];

    var before_call_var = function(url, data){
        $loading_pop.push(loading_tip());
    };

    var before_callback = function(err, json){
        setTimeout(function(){
            $loading_pop.length && $loading_pop.pop().remove();
        }, 0);
    };

    var after_callback = noop;

    function before_call(url, data, callback, tries){
        callback = callback || noop;

        try{
            var str = url.replace(/(^|&)timestamp=([^&]*)(&|$)/g, '&').replace(/(^|&)sign=([^&]*)(&|$)/g, '&')
                + '&data=' + JSON.stringify(data).replace(new RegExp('{|}|"|:','g'), '') + '&tries=' + tries;
            var now = (new Date()).getTime() ;
            lastCallTime[str] = lastCallTime[str] || 0;
            console.log(str);
            // console.log(str);
            // console.log('time: ' + (now - lastCallTime[str]));

            if(lastCallTime[str] && (now - lastCallTime[str]) < 1000){
                // console.log("Can't repeat call in 3 second: " + str);
                return false;
            }else{
                lastCallTime[str] = now;
            }
            before_call_var(url, data);
            return function(err, json){
                before_callback(err, json);
                var res = callback(err, json);
                after_callback(err, json);
                return res;
            }
        }catch(e){
            return callback;
        }
    }

    return {
        url: function(uri){
            return ROOT_URL + uri;
        },
        setLoadingTip: function(loading_func){
            loading_tip = loading_func;
        },
        getUrlParam: function(name, default_val){
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
                r = window.location.search.substr(1).match(reg);
            if(r !== null){
                return decodeURIComponent(r[2]);
            }else{
                return default_val || '';
            }
        },
        ajaxHtml: function(url, callback, tries){
            var ajaxHtml = arguments.callee;
            tries = tries || retryTimes;
            var fallback = before_call(url, {}, callback, tries);
            fallback && $.ajax({
                type: "get",
                url: url,
                success: function(html){
                    fallback(null, html);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            ajaxHtml(url, callback, tries);
                        }, retryInterval);
                    }else{
                        fallback(e, null);
                    }
                }
            })
        },
        postForm: function(url, data, callback, tries){
            var postJson = arguments.callee;
            tries = tries || retryTimes;
            var fallback = before_call(url, data, callback,tries);
            fallback && $.ajax({
                type: "post",
                url: url,
                data: data,
                success: function(json){
                    fallback(null, json);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            postJson(url, data, callback, tries);
                        }, retryInterval);
                    }else{
                        fallback(e, null);
                    }
                },
                contentType: 'application/x-www-form-urlencoded'
            });
        },
        postJson: function(url, data, callback, tries){
            var postJson = arguments.callee;
            tries = tries || retryTimes;
            var fallback = before_call(url, data, callback, tries);
            fallback && $.ajax({
                type: "post",
                url: url,
                data: JSON.stringify(data),
                success: function(json){
                    fallback(null, json);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            postJson(url, data, callback, tries);
                        }, retryInterval);
                    }else{
                        fallback(e, null);
                    }
                },
                contentType: "application/json",
                dataType: "json"
            });
        },
        jsonp: function(url, data, callback){
            // tries = tries || retryTimes;
            var cbfKey = 'callback' + (new Date()).getTime() + '';
            var $script = $('<script type="text/javascript"></script>');
            callback = before_call(url, data, callback, 1);
            if(!callback){
                return;
            }
            U.ajax.jsonp[cbfKey] = function(json){
                $script.remove();
                callback(null, json);
            };
            $script.attr('src', url + '&callback=U.ajax.jsonp.' + cbfKey);
            $('body').append($script);
        },
        postRawData: function(url, data, callback, tries){
            var postData = arguments.callee;
            tries = tries || retryTimes;
            var fallback = before_call(url, data, callback, tries);
            fallback && $.ajax({
                type: "post",
                url: url,
                data: data,
                success: function(json){
                    fallback(null, json);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            postData(url, data, callback, tries);
                        }, retryInterval);
                    }else{
                        fallback(e, null);
                    }
                },
                contentType: "application/x-www-form-urlencoded"
            });
        },
        getJson: function(url, callback, tries){
            var getJson = arguments.callee;
            tries = tries || retryTimes;
            var fallback = before_call(url, {}, callback, tries);
            fallback && $.ajax({
                type: "get",
                url: url,
                success: function(json){
                    fallback(null, json);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            getJson(url, callback, tries);
                        }, retryInterval);
                    }else{
                        fallback(e, null);
                    }
                },
                contentType: "application/json",
                dataType: "json"
            });
        }
    }
})(jQuery);

U.api = (function($){

    var app_id = 1;
    var app_token = '';

    if(android){
        app_id = android.get('app.id') || '';
        app_token = android.get('app.token' || '');
    }

    function setup_user_auth(user){
        android.put('app.id', user['id']);
        android.put('app.token', user['api_token']);
        android.put("app.user", user);
        app_id = android.get('app.id') || '';
        app_token = android.get('app.token' || '');
    }

    function _url(method){
        var auth_params = '';
        if(app_id && app_token && typeof(CryptoJS) != 'undefined'){
            var now = ((new Date()).getTime() / 1000).toFixed();
            var signStr = 'app_id=' + app_id + '&method=' + method + '&secret=' + app_token + '&timestamp=' + now;
            var sign = CryptoJS.MD5(signStr);
            auth_params = '&app_id=' + app_id + '&timestamp=' + now + '&sign=' + sign;
        }
        return '/open/api?method=' + method + auth_params;
    }

    function callback_filter(cbf){
        var callback = function(err, json){
            if(err && err.message.indexOf('未登录') >= 0){
                location.href = ROOT_URL + '/view/login.html?success_cbf=' + encodeURIComponent(location.pathname + location.search + location.hash);
                return;
            }
            cbf(err, json);
        };
        return function(err, json){
            if(err){
                callback(err, json);
            }else{
                if(json && json['error_response']){
                    err = json['error_response'];
                }

                if(json && json['response']){
                    json = json['response'];
                }

            }
            callback(err, json);
        }
    }

    /**
     * @param rid
     * @param style string image/resize,m_fixed,h_100,w_100,m_fill,color_FF0000
     *  m_lfit:  等比缩放，限制在设定在指定w与h的矩形内的最大图片。(默认)
        m_mfit:  等比缩放，延伸出指定w与h的矩形框外的最小图片。
        m_fill:  固定宽高，将延伸出指定w与h的矩形框外的最小图片进行居中裁剪。
        m_pad:   固定宽高，缩略填充
        m_fixed: 固定宽高，强制缩略
        color_*: 当缩放模式选择为pad（缩略填充）时，可以选择填充的颜色(默认是白色)参数的填写方式：采用16进制颜色嘛表示，如#00FF00#（绿色）
     * @returns {*}
     */
    function rid2url(rid, style){
        style = style || 'image/resize,w_640';
        // rid += style.indexOf('@') < 0 ? ('@' + style) : style;

        if(rid && rid.indexOf('oss://') == 0){
            if(style.indexOf('@') == 0){
                rid += style;
            }else{
                rid += ('?x-oss-process=' + style);
            }
            rid = rid.substr(6);
            var bucket = rid.slice(0, rid.indexOf('/'));
            var object = rid.slice(rid.indexOf('/') + 1);
            return 'http://' + bucket + '.' + OSS_IMG_DOMAIN + '/' + object;
        }else{
            return rid;
        }
    }

    return {
        apiUrl: _url,
        'oss': {
            rid2url: rid2url,
            upload: function(slot, cbf){
                U.ajax.postJson(_url('checkpoint.upload'), {'slot': slot}, callback_filter(cbf));
            },
            uploadTempFile: function(slot, $form, callback){
                slot = (slot % 7 + 1) || 1;
                // $('body').append($form);
                U.ajax.postJson(_url('checkpoint.upload'), {'slot': slot}, callback_filter(function(err, json){
                    if(json && json['data'] && json['data']['post']){
                        var postData = json['data']['post'];
                        // var $form = $('#oss-upload-form');
//                        var $form = $('<form id="oss-upload-form">' +
//                            '<input type="file" name="file" class="form-control" id="fileInput" placeholder="选择文件"/>' +
//                        '</form>');
                        // $('body').append($form);
                        $form.attr('action', 'http://' + postData['host'] + '/');
                        $form.attr('method', 'post');
                        $form.attr('target', 'hidden_frame');
                        $form.attr('encrypt', 'multipart/form-data');
                        $form.attr('autocomplete', 'off');
                        if(!$form.find('iframe').length){
                            $form.append($('<iframe name="hidden_frame" id="hidden_frame" style="display: none"></iframe>'));
                        }
                        var $file = $form.find('input[type="file"]');
                        if($file.length == 0 || !$file.val()){
                            android.alert('未选择照片');
                        }
                        $form.append($('<input type="hidden" name="OSSAccessKeyId" value=""/>').val(postData['accessid']));
                        $form.append($('<input type="hidden" name="policy" value=""/>').val(postData['policy']));
                        $form.append($('<input type="hidden" name="Signature" value=""/>').val(postData['signature']));
                        $form.append($('<input type="hidden" name="key" value=""/>').val(postData['object']));
                        $form.append($('<input type="hidden" name="success_action_redirect" value=""/>').val(ROOT_URL + '/view/oss_upload_success.html'));

                        U.api.oss.uploadSuccessCallback = function(){
                            $form.remove();
                            callback(err, json);
                        };

                        $form.submit();
                    }else{
                        if(err){
                            android.alert(err.message);
                        }else{
                            android.alert('上传文件失败');
                        }
                    }
                }));
            }
        },
        'user': {
            'info': function(uid, callback){
                if(!callback){
                    callback = uid;
                    uid = uid || android.get('app.id');
                }
                uid = uid || 0;
                U.ajax.postJson(_url('user.info'), {'user_id': uid}, callback_filter(callback));
            },
            'login': function(mobile, password, cbf){
                U.ajax.postJson(_url('user.login'), {'login_name': mobile, 'password': password}, callback_filter(function(err, user){
                    if(user && user['id'] && user['api_token']){
                        setup_user_auth(user);
                    }
                    cbf(err, user);
                }))
            },
            'logout': function(meta, cbf){
                if(!cbf){
                    cbf = meta;
                    meta = {};
                }
                U.ajax.postJson(_url('user.logout'), meta, callback_filter(cbf));
            },
            'register': function(mobile, nick, password, inviteCode, inviteMobile, cbf){
                U.ajax.postJson(_url('user.register'), {
                    "mobile": mobile,
                    "nick": nick,
                    "password": password,
                    "inviteCode": inviteCode,
                    "inviteMobile": inviteMobile
                }, callback_filter(function(err, json){
                    cbf(err, json);
                }))
            },
            'invite': function(mobile, memo, cbf){
                if(!cbf){
                    cbf = memo;
                    memo = '';
                }
                U.ajax.postJson(_url('user.invite'), {
                    'mobile': mobile,
                    'nick': memo
                }, callback_filter(cbf))
            }
        },
        'traveller': {
            'apply': function(data, cbf){
                return U.ajax.postJson(_url('traveller.apply'), data, callback_filter(cbf));
            }
        },
        'checkpoint': {
            'list': function(query, cbf){
                U.ajax.postJson(_url('checkpoint.list'), query, callback_filter(function(err, json){
                    if(json && json.length > 0){
                        for(var i = json.length; i--;){
                            json[i]['create_time'] = Number(json[i]['create_time']);
                        }
                    }
                    cbf(err, json);
                }));
            },
            /**
             * @param data array {
                 "group_id": 1000000,
                 "resource": "oss://yue/image/1/tmp/checkpoint/hour/1.jpg",
                 "latitude": 23.04,
                 "longitude": 23.04,
                 "altitude": 123,
                 "create_time": 0,
                 "comment": "有一种鸟一生只降落一次"
             }
             * @param cbf
             */
            'commit': function(data, cbf){
                if(data['id']){
                    delete data['resource'];
                    U.ajax.postJson(_url('checkpoint.update'), data, callback_filter(cbf));
                }else{
                    U.ajax.postJson(_url('checkpoint.commit'), data, callback_filter(cbf));
                }
            },
            'info': function(id, cbf){
                U.ajax.postJson(_url('checkpoint.info'), {'id': id}, callback_filter(cbf));
            }
        },
        'feedback': function(message, cbf){
            U.ajax.postJson(_url('feedback.submit'), {
                'user_name': '',
                'contact': '',
                'description': message
            }, callback_filter(cbf));
        },
        'trac': {
            'sign': function(data, cbf){
                U.ajax.postJson(_url('trac.api.signature'), data, callback_filter(cbf));
            },
            'list': function(query, cbf){
                this.sign(query, callback_filter(function(err, json){
                    if(json && json['endpoints']){
                        U.ajax.jsonp(json['endpoints']['search'], {}, callback_filter(cbf));
                    }
                }))
            },
            'modify': function(query, cbf){
                query['id'] = Math.floor(Number(query['id'] || 0));
                if(!query['id']){
                    cbf({'message': 'lack of info'}, null);
                    return;
                }
                this.sign(query, callback_filter(function(err, json){
                    if(json && json['endpoints']){
                        U.ajax.jsonp(json['endpoints']['modify'], {}, callback_filter(cbf));
                    }
                }))
            }
        }
    }
})(jQuery);