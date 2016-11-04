// ajax - tool
if(typeof String.prototype.endsWith !== 'function'){
    String.prototype.endsWith = function(suffix){
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
OSS_DOMAIN = 'oss-cn-hangzhou.aliyuncs.com';
OSS_IMG_DOMAIN = 'img-cn-hangzhou.aliyuncs.com';
U = typeof(U) == 'undefined' ? {} : U;

U.ajax = (function($){
    var retryInterval = 500;
    var retryTimes = 3;

    return {
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
            $.ajax({
                type: "get",
                url: url,
                success: function(html){
                    callback(null, html);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            ajaxHtml(url, callback, tries);
                        }, retryInterval);
                    }else{
                        callback(e, null);
                    }
                }
            })
        },
        postForm: function(url, data, callback, tries){
            var postJson = arguments.callee;
            tries = tries || retryTimes;
            $.ajax({
                type: "post",
                url: url,
                data: data,
                success: function(json){
                    callback(null, json);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            postJson(url, data, callback, tries);
                        }, retryInterval);
                    }else{
                        callback(e, null);
                    }
                },
                contentType: 'application/x-www-form-urlencoded'
            });
        },
        postJson: function(url, data, callback, tries){
            var postJson = arguments.callee;
            tries = tries || retryTimes;
            $.ajax({
                type: "post",
                url: url,
                data: JSON.stringify(data),
                success: function(json){
                    callback(null, json);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            postJson(url, data, callback, tries);
                        }, retryInterval);
                    }else{
                        callback(e, null);
                    }
                },
                contentType: "application/json",
                dataType: "json"
            });
        },
        postRawData: function(url, data, callback, tries){
            var postData = arguments.callee;
            tries = tries || retryTimes;
            $.ajax({
                type: "post",
                url: url,
                data: data,
                success: function(json){
                    callback(null, json);
                },
                error: function(e){
                    tries--;
                    if(tries > 0){
                        setTimeout(function(){
                            postData(url, data, callback, tries);
                        }, retryInterval);
                    }else{
                        callback(e, null);
                    }
                },
                contentType: "application/x-www-form-urlencoded"
            });
        },
        getJson: function(url, callback, tries){
            var getJson = arguments.callee;
            tries = tries || retryTimes;
            $.ajax({
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
                        }, retryInterval);
                    }else{
                        callback(e, null);
                    }
                },
                contentType: "application/json",
                dataType: "json"
            });
        }
    }
})(jQuery);

U.api = (function(){

    var app_id = 1;
    var app_token = '';

    if(android){
        app_id = android.get('app.id') || '';
        app_token = android.get('app.token' || '');
    }

    function setup_user_auth(user){
        android.put('app.id', user['id']);
        android.put('app.token', user['api_token']);
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
        return function(err, json){
            if(err){
                cbf(err, json);
            }else{
                if(json && json['error_response']){
                    err = json['error_response'];
                }

                if(json && json['response']){
                    json = json['response'];
                }
            }
            cbf(err, json);
        }
    }

    function rid2url(rid, style){
        style = style || '';
        rid += style.indexOf('@') < 0 ? ('@' + style) : style;
        if(rid.indexOf('oss://') == 0){
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
            rid2url: rid2url
        },
        'user': {
            'login': function(mobile, password, cbf){
                U.ajax.postJson(_url('user.login'), {'login_name': mobile, 'password': password}, callback_filter(function(err, user){
                    if(user && user['id'] && user['api_token']){
                        setup_user_auth(user);
                    }
                    cbf(err, user);
                }))
            }
        },
        'checkpoint': {
            'list': function(query, cbf){
                U.ajax.postJson(_url('checkpoint.list'), query, callback_filter(function(err, json){
//                    if(json && json.length > 0){
//                        for(var i = json.length; i --;){
//                            json[i]['photo'] = rid2url(json[i]['photo']);
//                        }
//                    }
                    cbf(err, json);
                }));
            }
        },
        'feedback': function(message, cbf){
            U.ajax.postJson(_url('feedback.submit'), {
                'user_name': '',
                'contact': '',
                'description': message
            }, callback_filter(cbf));
        }
    }
})();