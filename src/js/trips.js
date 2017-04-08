/**
 * Created by yQiu on 16-10-23.
 */

// 通过时间戳获取年月日时分秒
function getDateTime(time, type){
    time = new Date((isNaN(time)) ? time : parseInt(time));
    if(type == "y")
        return time.getFullYear();
    else if(type == "m")
        return (time.getMonth()) + 1;
    else if(type == "d")
        return time.getDate();
    else if(type == "h")
        return time.getHours();
    else if(type == "M")
        return time.getMinutes();
}

function getRect(ele){
    var inHeight = window.innerHeight,
        rect = ele.getBoundingClientRect();

    rect.isVisible = rect.top - inHeight < 0;  // 是否在可视区域
    rect.isBottom = rect.bottom - inHeight <= 0;
    return rect;
}

jQuery(function($){
    var page_size = 10;
    var group_id = U.ajax.getUrlParam("group_id"), uid = U.ajax.getUrlParam("uid");
    $('a.upload-btn').attr('href', 'checkpoint.html?group_id=' + group_id);
    /**
     * @param callBack function(err, data)
     *  data : array [{
     *      "id": 1,
     *      "group_id": 1,
     *      "day":1,
     *      "timeline":"12:30",
     *      "dateline":"10月8日",
     *      "comment":"",
     *      "longitude":0.0,
     *      "latitude":0.0,
     *      "location" : "",
     *      "comment_count":0
     *      "like":0
     *  }]
     */
    var minTime = (new Date()).getTime() / 1000;
    var vshow = {};

    function query(query, callBack){
        if(!callBack){
            callBack = query;
            query = {
                "group_id": group_id,
                "page": 1,
                "psize": page_size
            };
        }

        query['group_id'] = group_id;

        U.api.checkpoint.list(query, function(err, json){
            if(err){
                android.alert(err.message);
            }else{
                // calculate array[].day
                if(json && json.length){
                    json = _.sortBy(json, function(v){
                        if(v['create_time'] < minTime){
                            minTime = v['create_time'];
                        }
                        return v['create_time'];
                    });

                    _.each(json, function(v, k, arr){
                        v['day'] = Math.floor((Number(v['create_time'])+28800)/86400) - Math.floor((minTime+28800)/86400) + 1;
                        v['dayshow'] = !vshow[v['day']];
                        vshow[v['day']] = vshow[v['day']] || 1;
//                        v['day'] = v['create_time'];
                        v['location'] = v['mark'] || (v['longitude'] + ',' + v['latitude']);
                        if(Number(v['altitude']) > 0){
                            v['location'] += '(' + Math.round(Number(v['altitude'])) + '米)';
                        }
                        v['htmlComment'] = WikiEngine.toHtml(v['comment']);
                        arr[k] = v;
                    });
                }
                callBack(err, json, query);
            }

        });
    }

    /**
     * 初始化页面
     */
    var loadData = (function(){

        var father = false;

        return function loadData(err, data, query){
            if(err){
                android.alert(err.message);
                return;
            }

            if(data && data.length){
                // find father
                data = _.each(data, function(v){
                    if(!father){
                        father = v;
                    }

                    if(father['group_id'] == v['id']){
                        father = v;
                    }
                });

                data = _.filter(data, function(v){
                    return father['id'] != v['id'];
                });

                if(father){
                    var title = father['comment'];
                    $('title').text(title);
                    $('div.title').text(title);
                    new Vue({
                        el: 'div.banner',
                        data: {father: father}
                    })
                }

                var $elem = $('div.sample.item-list').clone().removeClass('sample');
                $elem.attr('id', 'div-' + (new Date()).getTime());
                if(data.length){
                    $('a.load-btn').attr('page', query['page'] + 1);
                }else{
                    $('a.load-btn').hide();
                }

                $('section.trip-wps').append($elem);

                var vm = new Vue({
                    el: '#' + $elem.attr('id'),
                    data: {
                        group_id: group_id,
                        user : android.user(),
                        items: data
                    },
                    methods: {
                        // 查看图片
                        showImgs: function(event){
                            getPhotoItems(event.target.alt);
                        },
                        // 喜欢
                        edit: function(checkpoint){
                            // $.toast("后期开放此功能", "text");
                            location.href = 'checkpoint.html?id=' + checkpoint['id'];
                            // vm._data.items[index].like = ++(vm._data.items[index].like);
                        },
                        // 评论
                        detail: function(checkpoint){
                            location.href = 'trips.html?group_id=' + checkpoint['id'];
                            // $.toast("后期开放此功能", "text");
                        },
                        'remove': function(checkpoint){
                            if(confirm('确定要删除么？')){
                                U.api.checkpoint.remove(checkpoint['id'], function(err, json){
                                    if(err){
                                        alert(err.message);
                                    }else{
                                        alert(json['message']);
                                        $('#checkpoint-div-' + checkpoint['id']).remove();
                                    }
                                });
                            }
                        }
                    }
                });

                function getPhotoItems(initIndex){
                    var len = vm._data.items.length, images = [];
                    for(var i = 0; i < len; i++){
                        images.push({
                            image: (U.api.oss.rid2url(vm._data.items[i].photo, 'style/resize_1024x768')),
                            caption: vm._data.items[i].comment
                        });
                    }
                    ($.photoBrowser({
                        initIndex: (initIndex < 0) ? 0 : initIndex,
                        items: images
                    })).open();
                }

//                vm._data.items = data;
            }else{
                //todo no data process
            }
        };
    })();

    query(loadData);

    $('a.load-btn').click(function(){
        query({
            page: Math.round(Number($('a.load-btn').attr('page'))),
            psize: page_size
        }, loadData);
    });

    var EventUtil = {
        addHandler: function(element, type, handler){
            if(element.addEventListener){
                element.addEventListener(type, handler, false);
            }else if(element.attachEvent){
                element.attachEvent("on" + type, handler);
            }else{
                element["on" + type] = handler;
            }
        }
    };
    var canAutoQuery = true;
    EventUtil.addHandler(window, "scroll", function(){
        var rect = getRect(document.body);
        var $loadBtn = $('a.load-btn');
        if(canAutoQuery && $loadBtn.css('display') != 'none' && rect.isBottom){
            canAutoQuery = false;
            var queryData = {
                page: Math.round(Number($loadBtn.attr('page'))),
                psize: page_size
            };
            query(queryData, function(err, json){
                loadData(err, json, queryData);
                setTimeout(function(){
                    canAutoQuery = true;
                }, 10000);
            });
        }
        return true;
    });

    var user = android.get('user.current');
    if(user && user['traveller']){
        $('#upload-a').show();
    }
});