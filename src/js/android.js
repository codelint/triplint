android = (function(){
    var token = '';

    if(typeof(android) != 'undefined'){
        android.get = function(key){
            return JSON.parse(android._get(key) || '""');
        };
        android.put = function(k, v){
            return android._put(k, JSON.stringify(v));
        };
        return android;
    }

    function noop(){
        //todo
    }

    return {
        // 获取版本
        version: function(){
            return "1.0";
        },
        // 获取应用名称
        app_name: function(){
            return 'triplint';
        },
        // 获得存储值
        "get": function(key){
            return JSON.parse(sessionStorage[key] || '""');
        },
        "_get": function(key){
            return sessionStorage[key];
        },
        // 设置固定存储值
        "put": function(key, value){
            if(Object.prototype.toString.call(value) !== '[object Undefined]'){
                sessionStorage[key] = JSON.stringify(value);
            }
        },
        "_put": function(key, value){
            sessionStorage[key] = value;
        },
        // 获得gps地址
        "gps": (function(){
            function getGps(callback){
                if((typeof(BMap) != 'undefined')){
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function(r){
                        if(this.getStatus() == BMAP_STATUS_SUCCESS){
                            if(callback){
                                callback(r.point.lng, r.point.lat);
                            }
                        }
                    }, {enableHighAccuracy: true});
                }
            }

            var longitude = 0.0;
            var latitude = 0.0;

            getGps(function(lon, lat){
                longitude = Number(lon);
                latitude = Number(lat);
            });

            return function(callback){
                getGps(callback);
                return longitude + ',' + latitude;
            }
        })(),
        // 用浏览器打开地址
        "open_url": function(url){
            location.href = url;
        },
        // alert 你懂的
        "alert": function(msg, confirm_txt){
            confirm_txt = confirm_txt || '确认';
            if(jQuery){
                var $weui = jQuery('<div class="js_dialog" id="iosDialog2">' +
                    '<div class="weui-mask"></div>' +
                    '<div class="weui-dialog">' +
                    '<div class="weui-dialog__bd">...</div>' +
                    '<div class="weui-dialog__ft"><a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">确认</a></div>' +
                    '</div>' +
                    '</div>');
                $weui.find('.weui-dialog__bd').html(msg);
                $weui.find('a').text(confirm_txt).click(function(){
                    $weui.remove();
                });
                $('body').append($weui);
                $weui.show();
            }else{
                alert(msg);
            }
        },
        // 应用后台任务提示
        "notify": function(title, msg){
            //todo
            alert(title + ": " + msg);
        },
        "uploadAvatar": function(isStylist){
            return false;
        },
        "token": function(_token){
            if(_token){
                token = _token;
            }
            return token;
        }
    }
})();
