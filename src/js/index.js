/**
 * Created by Qiu on 16-10-3.
 */
var vue = new Vue({
    el: '.list',
    data: {
        lists: {}
    }
});

function setup_geo(lon, lat, index){
    typeof(BMap) != 'undefined' && (new BMap.Geocoder()).getLocation(new BMap.Point(lon, lat), function(result){
        if(result){
            vue._data.lists[index].place = result.address;
        }
    });
}

jQuery(function($){

    function loadBarData(callback){
        var user = android.current_user();
        if(!user){
            location.href = ROOT_URL + '/view/login.html?success_cbf=' + encodeURIComponent(location.pathname + location.search + location.hash);
        }

        var setup = function(err, json){
            var arr = [];
            var item;
            if(err){
                android.alert(err.message);
            }else if(json){
                for(var i = 0; i < json.length; i++){
                    item = json[i];
                    arr.push({
                        'src': U.api.oss.rid2url(item['image'], 'image/resize,w_1024,h_480,m_fill,color_FAF8EC'),
                        'href': item['link']
                    });
                }
                callback(err, arr);
            }
        };

        U.api.ad.list('index', function(err, json){
            if(json && json.length){
                setup(err, json);
            }else{
                var traveller_id = (user && Number(user['source']) > 0.01) ? user['source'] : user['id'];
                U.api.checkpoint.list({'group_id': 0, 'traveller_id': traveller_id}, function(err, json){
                    if(err){
                        android.alert(err.message);
                    }else{
                        json = _.each(json, function(v){
                            v['image'] = v['photo'];
                            v['link'] = ROOT_URL + '/view/trips.html?group_id=' + v['id'];
                        });
                        setup(err, json);
                    }
                });
            }
        });
    }

    /**
     *
     * @param callback
     */
    function loadData(callback){
//        callback([
//            {
//                title: '六月在夏天又去了海边',
//                dateTime: '2016-10-03',
//                place: '韩国,南极',
//                day: 4,
//                browse: 2000,
//                by: '江湖小虾米',
//                img: '../images/1.jpg?oss_image_style=1024w',
//                portrait: '../images/img.jpg?oss_image_style=1024w'
//            }
//        ]);
        U.api.checkpoint.list({'group_id': 0}, function(err, json){
            var arr = [];
            var checkpoint;
            if(json){

                for(var i = json.length; i--;){
                    checkpoint = json[i];
                    arr.push({
                        'id': checkpoint['id'],
                        'title': checkpoint['comment'],
                        'dateTime': (new Date(checkpoint['create_time'] * 1000).toString()),
                        'day': 4,
                        'browse': 0,
                        'by': checkpoint['user']['nick'],
                        'img': U.api.oss.rid2url(checkpoint['photo'], 'image/resize,w_1024,h_768'),
                        'portrait': U.api.oss.rid2url(checkpoint['user']['avatar'], 'image/resize,w_128,h_128'),
                        'place': checkpoint['mark'] || (checkpoint['longitude'] + ',' + checkpoint['latitude']),
                        'longitude': checkpoint['longitude'],
                        'latitude': checkpoint['latitude']
                    });
                }
                callback(err, arr);
            }
        })
    }

    loadData(function(err, data){
        if(err){
            alert(err.message);
            return;
        }

//        for (var i = 0; i < data.length; i++) {
//            setup_geo(data[i]['longitude'], data[i]['latitude'], i);
//        }
        vue._data.lists = data;
    });

    loadBarData(function(err, data){
        if(err){
            alert(err.message);
            return;
        }
        var len = data.length;
        var item;
        var $div;
        for(var i = 0; i < len; i++){
            item = data[i];
            $div = $('<div class="swiper-slide">' +
                '<a><img src="../images/img.jpg?oss_image_style=1024w_480h_4e_250-248-236bgc" alt=""></a>' +
                '</div>');
            $div.find('img').attr('src', item['src']);
            $div.find('a').attr('href', item['href']);
            $('div.swiper-wrapper').append($div);
        }
        $(".barn").swiper({
            loop: true,
            autoplay: 2000,//可选选项，自动滑动
            pagination: '.swiper-pagination',// 分页
            autoHeight: true, //高度随内容变化
            autoplayDisableOnInteraction: false// 点击后继续滑动
        });
    });

    $('leftMenu').length < 1 && U.ajax.ajaxHtml(U.ajax.url('/view/component/menu.html'), function(err, html){
        var $menu = $(html);
        $('body').append($menu);
        var user = android.get('user.current');

        function load_user_info(user){
            $menu.find('img.avatar').attr('src', U.api.oss.rid2url(user['avatar'], 'image/resize,w_128,h_128'));
            $menu.find('p.name').text(user['nick']);
            $menu.find('a[href="member.html"]').attr('href', 'member.html?uid=' + user['id']);
        }

        if(!user){
            U.api.user.info(user, function(err, user){
                if(!err && user && user['avatar']){
                    load_user_info(user);
                }
            })
        }else{
            load_user_info(user);
        }
        $menu.find('.t-mask-visible').click(function(){
            $menu.removeClass("on");
            setTimeout(function(){
                $menu.css("left", "-100%");
            }, 300);
        });
    });

    $(".on-menu").click(function(){
        $(".leftMenu").css("left", "0").addClass("on");
    });

    $(".add").click(function(){
        alert("ok");
        // location.href = "http://192.168.1.106:8050/src/view/";
    });
});
