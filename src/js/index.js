/**
 * Created by Qiu on 16-10-3.
 */
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

        var setup = function(err, json){
            var arr = [];
            var item;
            if(err){
                android.alert(err.message);
            }else if(json){
                for(var i = 0; i < json.length; i++){
                    item = json[i];
                    arr.push({
                        'src': U.api.oss.rid2url(item['image'], 'style/index_bar_photo'),
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
        var data = [];

        function push(list){
            var checkpoint;
            if(list){
                for(var i = list.length; i--;){
                    checkpoint = list[i];
                    data.push({
                        'id': checkpoint['id'],
                        'title': checkpoint['comment'],
                        'dateTime': (new Date(checkpoint['create_time'] * 1000).toString()),
                        'day': 4,
                        'browse': 0,
                        'by': checkpoint['user']['nick'],
                        'user_id': checkpoint['user_id'],
                        'img': U.api.oss.rid2url(checkpoint['photo'], 'style/index_checkpoint_photo'),
                        'portrait': U.api.oss.rid2url(checkpoint['user']['avatar'], 'style/menu_avatar'),
                        'place': checkpoint['mark'] || (checkpoint['longitude'] + ',' + checkpoint['latitude']),
                        'longitude': checkpoint['longitude'],
                        'latitude': checkpoint['latitude']
                    });
                }
            }
        }

        U.api.checkpoint.index(1, function(err, json){
            push(json);
            if(data.length > 0){
                callback(err, data);
            }else{
                U.api.traveller.follows(1, function(err, json){
                    if(json && json['follows'] && json['follows'].length){
                        var item = json['follows'][0];
                        U.api.checkpoint.list({
                            'traveller_id': item['follow_id']
                        }, function(err, json){
                            push(json);
                            callback(err, data);
                        })
                    }else{
                        callback(err, data);
                    }
                });
            }
        })
    }

    /**
     *
     * @param callback function(err, data)
     * @callback.data object {
     *      'title': '用户推荐'
     *      'travellers':
     *      [
     *          {'id': 123, 'avatar': 'oss://...', 'summary': '...', 'fansCount': 0, 'photosCount': 0}
     *      ]
     *  }
     */
    var travellers = {};

    function loadTravellerData(callback){
        var user = android.current_user();
        var travellerData = {
            'title': '行者无疆',
            'travellers': []
        };

        //mock the travellers' data
//        travellerData['travellers'] = [
//            {
//                'id': 123,
//                'avatar': U.api.oss.rid2url(user['avatar']),
//                'summary': 'hello world',
//                'fansCount': 0,
//                'photosCount': 0,
//                'photos': [
//                    'http://star.kuwo.cn/star/starheads/160/61/54/2102134023.jpg',
//                    "http://star.kuwo.cn/star/starheads/160/54/38/535904482.jpg",
//                    "http://star.kuwo.cn/star/starheads/160/10/94/745334819.jpg"
//                ]
//            },
//            {
//                'id': 123,
//                'avatar': U.api.oss.rid2url(user['avatar']),
//                'summary': 'hello world',
//                'fansCount': 0,
//                'photosCount': 0,
//                'photos': [
//                    'http://star.kuwo.cn/star/starheads/160/61/54/2102134023.jpg',
//                    "http://star.kuwo.cn/star/starheads/160/54/38/535904482.jpg",
//                    "http://star.kuwo.cn/star/starheads/160/10/94/745334819.jpg"
//                ]
//            }
//        ];
//        callback(false, travellerData);

        //todo get the real traveller data
        U.api.traveller.fans(user['source'], 1, function(err, json){
            if(json && json['fans']){
                _.each(json['fans'], function(v, k){
                    var user = {
                        'id': v['user_id'],
                        'nick': v['user_nick'],
                        'summary': '...',
                        'avatar': U.api.oss.rid2url(v['user_avatar']),
                        'photosCount': 0,
                        'fansCount': 0,
                        'photos': [
                            ROOT_URL + '/images/logo.png',
                            ROOT_URL + '/images/logo.png',
                            ROOT_URL + '/images/logo.png'
                        ]
                    };
                    if(!travellers[user['id']] && !U.api.user.isFollow(user['id'])){
                        travellers[user['id']] = user;
                        travellerData['travellers'].push(user)
                    }
                });
                callback(false, travellerData);
            }
        });

    }

    loadData(function(err, data){
        if(err){
            alert(err.message);
            return;
        }

//        for (var i = 0; i < data.length; i++) {
//            setup_geo(data[i]['longitude'], data[i]['latitude'], i);
//        }
        new Vue({
            el: '.list',
            data: {
                lists: data
            },
            methods: {
                showMember: function(item, event){
                    if(event){
                        event.preventDefault()
                    }
                    location.href = "member.html?uid=" + item['user_id'];
                    return false;
                }
            }
        });
//        vue._data.lists = data;
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

    loadTravellerData(function(err, data){
        if(err){
            return;
        }
        new Vue({
            el: '#user-recommend-div',
            data: data,
            mounted: function(){
                if(data['travellers'] && data['travellers'].length > 0){
                    $('#user-recommend-div').removeClass('hide');
//                    $('#user-recommend-div').addClass('hide');
                    (function(next, traveller, index, travellers){
                        var callee = arguments.callee;
                        U.api.traveller.info(traveller['id'], function(err, json){
                            if(json){
                                var $el = $('#traveller-' + traveller['id']);
                                var $ul = $el.find("ul");
                                $ul.empty();
                                var checkpoints = json['checkpoints'];
                                _.each(checkpoints, function(checkpoint){
                                    $ul.append($("<li><img src='"+U.api.oss.rid2url(checkpoint['photo'], 'style/resize_256x256')+"'></li>"));
                                });
                                $el.find(".user-list").width($(".list").eq(0).width());
                                $el.find("li").height($el.find("li").eq(0).width());
                            }
                            index += 1;
                            if(index < travellers.length){
                                callee(next, travellers[index], index, travellers);
                            }else{
                                next();
                            }
                        });
                    })(function(next, traveller){

                    }, data['travellers'][0], 0, data['travellers']);

                }else{
                    $('#user-recommend-div').addClass('hide');
                }
            },
            methods: {
                followUser : function(traveller){
                    U.api.user.follow(traveller['id'], function(err, json){
                        if(err){
                            android.alert(err.message);
                        }else{
                            android.alert('关注成功');
                        }
                    });
                }
            }
        });
    });

    $(".add").click(function(){
        alert("ok");
        // location.href = "http://192.168.1.106:8050/src/view/";
    });

    var user = android.current_user();
    if(user['traveller']){
        $('#upload-a').show();
    }

    // calc height
//    function calcWH(){
//        $(".user-list").width($(".list").eq(0).width());
//        $(".recommend-user-wrap li").height($(".recommend-user-wrap li").eq(0).width());
//    }
//
//    calcWH();
//    $("html,body").resize(calcWH);
});
