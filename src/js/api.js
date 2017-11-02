// ajax - tool
if(typeof String.prototype.endsWith !== 'function'){
    String.prototype.endsWith = function(suffix){
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
OSS_DOMAIN = 'oss-cn-hangzhou.aliyuncs.com';
OSS_IMG_DOMAIN = 'img.inotseeyou.com';
ROOT_URL = 'http://' + location.host + '/wap';
REST_BASE = 'http://' + location.host;
U = typeof(U) == 'undefined' ? {} : U;

HttpAjax = (function($){
    var noop = function(){
    };
    // ------------ init function -------------- //
    var ClassSpec = function(option){
        option = option || {};
        var self = this;
        self['retryInterval'] = option['retryInterval'] || 500;
        self['retryTimes'] = option['retryTimes'] || 3;
        self['lastCallTime'] = {};
        self['loading_tip'] = option['loading_tip'] || noop;
        self['before_call_var'] = option['before_call'] || noop;
        self['before_callback'] = option['before_callback'] || noop;
        self['after_callback'] = option['after_callback'] || noop;
        self['wrap_callback'] = function(url, data, callback, tries){
            callback = callback || noop;

            try{
                var str = url.replace(/(^|&)timestamp=([^&]*)(&|$)/g, '&').replace(/(^|&)sign=([^&]*)(&|$)/g, '&')
                    + '&data=' + JSON.stringify(data).replace(new RegExp('{|}|"|:', 'g'), '') + '&tries=' + tries;
                var now = (new Date()).getTime();
                self.lastCallTime[str] = self.lastCallTime[str] || 0;

                if(self.lastCallTime[str] && (now - self.lastCallTime[str]) < 1000){
                    return false;
                }else{
                    self.lastCallTime[str] = now;
                }
                self.before_call_var(url, data);
                return function(err, json){
                    self.before_callback(err, json);
                    var res = callback(err, json);
                    self.after_callback(err, json);
                    return res;
                }
            }catch(e){
                return callback;
            }
        };
        self['_getJson'] = function(url, callback, tries){
            var getJson = arguments.callee;
            tries = tries || self.retryTimes;
            callback && $.ajax({
                type: "get",
                url: url,
                success: function(json){
                    callback(null, json);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            getJson(url, callback, tries);
                        }, self.retryInterval);
                    }else{
                        callback(e, null);
                    }
                },
                contentType: "application/json",
                dataType: "json"
            });
        };
    };

    //------------------ Public Interface --------------//
    var iface = {
        url: function(uri){
            return ROOT_URL + uri;
        },
        setLoadingTip: function(loading_func){
            self['loading_tip'] = loading_func;
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
            tries = tries || this.retryTimes;
            var fallback = this.wrap_callback(url, {}, callback, tries);
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
                        }, this.retryInterval);
                    }else{
                        fallback(e, null);
                    }
                }
            })
        },
        postForm: function(url, data, callback, tries){
            var postJson = arguments.callee;
            tries = tries || this.retryTimes;
            var fallback = this.wrap_callback(url, data, callback, tries);
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
                        }, this.retryInterval);
                    }else{
                        fallback(e, null);
                    }
                },
                contentType: 'application/x-www-form-urlencoded'
            });
        },
        postJson: function(url, data, callback, tries){
            var postJson = arguments.callee;
            tries = tries || this.retryTimes;
            var fallback = this.wrap_callback(url, data, callback, tries);
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
                        }, this.retryInterval);
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
            callback = this.wrap_callback(url, data, callback, 1);
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
            tries = tries || this.retryTimes;
            var fallback = this.wrap_callback(url, data, callback, tries);
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
                        }, this.retryInterval);
                    }else{
                        fallback(e, null);
                    }
                },
                contentType: "application/x-www-form-urlencoded"
            });
        },
        getJson: function(url, callback, tries){
            var fallback = this.wrap_callback(url, {}, callback, tries);
            this._getJson(url, fallback, tries);
        }
    };

    //------------------ Return Class Instance ---------//
    // jquery style
    $.extend(ClassSpec.prototype, iface);
    // origin style
    // ClassSpec.prototype = iface;
    return ClassSpec;
})(jQuery);
U.ajax = (function(){
    var loading_tip = function(){
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

    return new HttpAjax({
        'retryInterval': 500,
        'retryTimes': 3,
        'loading_tip': loading_tip,
        'before_call': function(url, data){
            $loading_pop.push(loading_tip());
        },
        'before_callback': function(err, json){
            setTimeout(function(){
                $loading_pop.length && $loading_pop.pop().remove();
            }, 0);
        }
    });
})();
U.buildApiClient = (function($){
    var app_id = 1;
    var app_token = '';

    if(android){
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
        return REST_BASE + '/open/api?method=' + method + auth_params;
    }

    /**
     * @param rid
     * @param style string image/resize,m_fixed,h_100,w_100,m_fill,color_FF0000
     *      style/resize_w_640  => image/resize,w_640
     *      style/resize_128x128 => image/resize,w_128,h_128
     *      style/resize_20x20 => image/resize,w_20,h_20
     *      style/resize_1024x768 => image/resize,w_1024,h_768,limit_0/auto-orient,0/quality,q_90
     *  m_lfit:  等比缩放，限制在设定在指定w与h的矩形内的最大图片。(默认)
     m_mfit:  等比缩放，延伸出指定w与h的矩形框外的最小图片。
     m_fill:  固定宽高，将延伸出指定w与h的矩形框外的最小图片进行居中裁剪。
     m_pad:   固定宽高，缩略填充
     m_fixed: 固定宽高，强制缩略
     color_*: 当缩放模式选择为pad（缩略填充）时，可以选择填充的颜色(默认是白色)参数的填写方式：采用16进制颜色嘛表示，如#00FF00#（绿色）
     * @returns {*}
     */
    function rid2url(rid, style){
        style = style || 'style/resize_w_640';
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
            return 'http://' + bucket + OSS_IMG_DOMAIN + '/' + object;
        }else{
            return rid;
        }
    }

    return function(client, option){
        option = option || {};
        var auto_login = !!option['auto_login'];

        function callback_filter(cbf, no_auto_login){
            no_auto_login = !!no_auto_login;
            var callback = (no_auto_login || !auto_login) ? cbf : function(err, json){
                if(err && err.message.indexOf('未登录') >= 0){
                    var open_id = U.ajax.getUrlParam("open_id");
                    var sign = U.ajax.getUrlParam("sign");
                    var timestamp = U.ajax.getUrlParam("timestamp");
                    var url = ROOT_URL + '/view/login.html?';
                    if(open_id && sign && timestamp){
                        url = url + '&sign=' + sign + '&open_id=' + open_id + '&timestamp=' + timestamp;
                    }
                    if(location.pathname.indexOf('login.html') < 0){
                        location.href = url + '&success_cbf=' + encodeURIComponent(location.pathname + location.search + location.hash);
                    }
                    return;
                }
                cbf(err, json);
            };
            return function(err, json){
                if(err){
                    callback(err, json);
                }else{
                    if(json && typeof json['error_response'] != 'undefined'){
                        err = json['error_response'];
                    }

                    if(json && typeof json['response'] != 'undefined'){
                        json = json['response'];
                    }

                }
                callback(err, json);
            }
        }

        function setup_user_auth(user, callback){
            android.put('app.id', user['id']);
            android.put('app.token', user['api_token']);
            app_id = android.get('app.id') || '';
            app_token = android.get('app.token' || '');

            if(user['name'] && user['avatar']){
                android.put("app.user", user);
            }else{
                client.postJson(_url('user.info'), {'user_id': user['id']}, callback_filter(function(err, json){
                    if(!err && json){
                        android.put('app.user', json);
                        android.current_user(json);
                    }
                    callback && callback(err, json);
                }, true));
            }
        }

        function apiCall(method, data, callback){
            if(!callback){
                callback = data;
                data = {};
            }
            return client.postJson(_url(method), data, callback_filter(callback));
        }

        function genSimpleApi(method){
            return function(data, cbf){
                apiCall(method, data, cbf);
            }
        }

        return {
            apiUrl: _url,
            config: function(key, value){
                switch(key){
                    case 'auto_login':
                        auto_login = !!value;
                        break;
                }
                return this;
            },
            'oss': {
                rid2url: rid2url,
                upload: function(slot, cbf){
                    client.postJson(_url('checkpoint.upload'), {'slot': slot}, callback_filter(cbf));
                },
                uploadTempFile: function(slot, $form, callback){
                    slot = (slot % 7 + 1) || 1;
                    // $('body').append($form);
                    client.postJson(_url('checkpoint.upload'), {'slot': slot}, callback_filter(function(err, json){
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
                    client.postJson(_url('user.info'), {'user_id': uid}, callback_filter(function(err, user){
                        if(!uid && !err && user){
                            setup_user_auth(user);
                        }
                        callback(err, user);
                    }));
                },
                'loginWithToken': function(uid, token, cbf){
                    setup_user_auth({'id': uid, 'token': token}, cbf);
                },
                'loginWithOpenId': function(data, cbf){
                    var login_info = {
                        'login_name': data['open_id'],
                        'password': data['sign'],
                        'wechat_id': data['open_id'],
                        'device_id': data['timestamp']
                    };
                    client.postJson(_url('user.login'), login_info, callback_filter(function(err, user){
                        if(user && user['id'] && user['api_token']){
                            setup_user_auth(user);
                        }
                        cbf(err, user);
                    }))
                },
                'login': function(mobile, password, wechat_id, cbf){
                    var login_info = {'login_name': mobile, 'password': password};
                    if(!cbf){
                        cbf = wechat_id;
                    }else{
                        if(wechat_id){
                            login_info['wechat_id'] = wechat_id;
                        }
                    }

                    client.postJson(_url('user.login'), login_info, callback_filter(function(err, user){
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
                    cbf = cbf || function(){
                        location.href = 'login.html';
                    };
                    client.postJson(_url('user.logout'), meta, callback_filter(cbf, true));
                },
                'register': function(mobile, nick, password, inviteCode, inviteMobile, cbf){
                    client.postJson(_url('user.register'), {
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
                    client.postJson(_url('user.invite'), {
                        'mobile': mobile,
                        'nick': memo
                    }, callback_filter(cbf))
                },
                'update': function(user, cbf){
                    user['id'] = Math.round(Number(user['id']));
                    if(user['id']){
                        client.postJson(_url('user.update'), user, callback_filter(cbf));
                    }else{
                        cbf({
                            'message': '参数错误'
                        }, null);
                    }
                },
                'follows': function(uid, page, cbf){
                    if(!cbf){
                        cbf = page;
                        page = Math.round(Number(uid));
                        uid = 0;
                    }else{
                        page = Math.round(Number(page));
                    }

                    apiCall('user.follows', {uid: uid, 'page': page}, cbf);
                },
                'fans': function(uid, page, cbf){
                    page = Math.round(Number(page));
                    apiCall('user.fans', {uid: uid, 'page': page}, cbf);
                },
                'follow': function(uid, cbf){
                    apiCall('user.follow', {'user_id': uid}, cbf)
                },
                'isFollow': function(uid){
                    var follows = android.get('trip.api.user.follows');
                    return !!follows[uid]
                }
            },
            'traveller': {
                'info': function(id, cbf){
                    return apiCall('traveller.info', {'id': id}, function(err, json){
                        if(json['avatar']){
                            json['avatar'] = U.api.oss.rid2url(json['avatar']);
                        }
                        cbf(err, json);
                    });
                },
                'apply': function(data, cbf){
                    return apiCall('traveller.apply', data, cbf);
                },
                'follows': function(uid, page, cbf){
                    return apiCall('traveller.follows', {'uid': uid, 'page': page}, cbf);
                },
                'fans': function(uid, page, cbf){
                    return apiCall('traveller.fans', {'uid': uid, 'page': page}, cbf);
                }
            },
            'checkpoint': {
                'index': function(page, cbf){
                    return apiCall('checkpoint.index', {'page': page}, cbf);
                },
                'list': function(query, cbf){
                    query['group_id'] = query['group_id'] || 0;
                    client.postJson(_url('checkpoint.list'), query, callback_filter(function(err, json){
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
                        client.postJson(_url('checkpoint.update'), data, callback_filter(cbf));
                    }else{
                        client.postJson(_url('checkpoint.commit'), data, callback_filter(cbf));
                    }
                },
                'info': function(id, cbf){
                    client.postJson(_url('checkpoint.info'), {'id': id}, callback_filter(cbf));
                },
                'remove': function(id, cbf){
                    client.postJson(_url('checkpoint.remove'), {'id': id}, callback_filter(cbf));
                }
            },
            'feedback': function(message, cbf){
                client.postJson(_url('feedback.submit'), {
                    'user_name': '',
                    'contact': '',
                    'description': message
                }, callback_filter(cbf));
            },
            'ad': {
                'list': function(type, cbf){
                    client.postJson(_url('ad.list'), {'type': type}, callback_filter(cbf));
                }
            },
            'shop': {
                'product': {
                    'search': function(query, cbf){
                        query['type'] = query['type'] || 1001;
                        client.postJson(_url('product.search'), query, callback_filter(cbf));
                    },
                    'modify': function(data, cbf){
                        if(data['id']){
                            client.postJson(_url('product.modify'), data, callback_filter(cbf));
                        }else{
                            cbf({message: "参数错误"});
                        }
                    }
                },
                'order': {
                    'submit': genSimpleApi('order.submit'),
                    'list': genSimpleApi('order.list'),
                    'confirm': function(osn, cbf){
                        apiCall('order.confirm', {order_sn: osn}, cbf);
                    },
                    'refund': function(osn, cbf){
                        apiCall('order.refund', {order_sn: osn}, cbf);
                    },
                    'cancel': function(osn, cbf){
                        apiCall('order.cancel', {order_sn: osn}, cbf);
                    }
                }
            },
            'trac': {
                'sign': function(data, cbf){
                    client.postJson(_url('trac.api.signature'), data, callback_filter(cbf));
                },
                'list': function(query, cbf){
                    this.sign(query, callback_filter(function(err, json){
                        if(json && json['endpoints']){
                            client.jsonp(json['endpoints']['search'], {}, callback_filter(cbf));
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
                            client.jsonp(json['endpoints']['modify'], {}, callback_filter(cbf));
                        }
                    }))
                }
            },
            'apiCall': apiCall,
            'app': {
                'android': function(callback){
                    client.getJson(REST_BASE + '/android/triplint.json', function(err, json){
                        if(!err && json){
                            callback(json);
                        }
                    })
                }
            }
        };
    }
})(jQuery);

U.api = U.buildApiClient(U.ajax, {
    'auto_login': true
});

//todo auto rsync data
(function(api){
    (function(page){
        var callee = arguments.callee;
        api.user.follows(page, function(err, json){
            if(!err && json['follows'] && json['follows'].length){
                var follows = android.get('trip.api.user.follows') || {};
                var follow;
                for(var i = json['follows'].length; i--;){
                    follow = json['follows'][i];
                    follows[follow['follow_id']] = follow;
                }
                android.put('trip.api.user.follows', follows);
                callee(page + 1);
            }
        });
    })(1);
})(U.buildApiClient(new HttpAjax()));