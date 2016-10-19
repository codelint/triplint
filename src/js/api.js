// ajax - tool
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

U = typeof(U) == 'undefined' ? {} : U;

U.ajax = (function($){
    var retryInterval = 500;
    var retryTimes = 3;

    return {
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

    function _url(method){
        return '/open/api?method=' + method;
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

    return {
        apiUrl: _url,
        'feedback' : function (message, cbf){
            U.ajax.postJson(_url('feedback.submit'), {
                'user_name' : '',
                'contact': '',
                'description': message
            }, callback_filter(cbf));
        }
    }
})();