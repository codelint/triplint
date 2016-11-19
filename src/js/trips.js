/**
 * Created by yQiu on 16-10-23.
 */

// 通过时间戳获取年月日十分秒
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

jQuery(function($){

    var group_id = U.ajax.getUrlParam("group_id");
    $('a.upload-btn').attr('href', 'upload.html?group_id=' + group_id);
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
     *      "comment_count":0
     *      "like":0
     *  }]
     */
    function init(callBack){
        var query = {
            "group_id": group_id,
            "page": 1,
            "pageSize": 10
        };
        U.api.checkpoint.list(query, function(err, json){
            if(err){
                android.alert(err.message);
            }else{
                // calculate array[].day
                if(json && json.length){
                    var minTime = (new Date()).getTime() / 1000;
                    json = _.sortBy(json, function(v){
                        if(v['create_time'] < minTime){
                            minTime = v['create_time'];
                        }
                        return v['create_time'];
                    });

                    _.each(json, function(v, k, arr){
                        v['day'] = Math.round((Number(v['create_time']) - minTime) / 86400 + 1);
                        arr[k] = v;
                    });
                }
                callBack(err, json);
            }

        });
    }

    /**
     * 初始化页面
     */
    init(function(err, data){

        if(err){
            android.alert(err.message);
            return;
        }

        if(data && data.length){
            // find father
            var father = false;

            data = _.each(data, function(v){
                if(!father){
                    father = v;
                }

                if(father['group_id'] == v['id']){
                    father = v;
                }
            });

            if(father){
                var title = father['comment'].substr(0,6);
                $('title').text(title);
                $('div.title').text(title);
            }

            var vm = new Vue({
                el: '#trip_items',
                data: {items: []},
                methods: {
                    // 查看图片
                    showImgs: function(event){
                        getPhotoItems(event.target.alt);
                    },
                    // 喜欢
                    like: function(index){
                        $.toast("后期开放此功能", "text");
                        // vm._data.items[index].like = ++(vm._data.items[index].like);
                    },
                    // 评论
                    comment: function(group_id){
                        location.href = 'trips.html?group_id=' + group_id;
                        // $.toast("后期开放此功能", "text");
                    }
                }
            });

            function getPhotoItems(initIndex){
                var len = vm._data.items.length, images = [];
                for(var i = 0; i < len; i++){
                    images.push({
                        image: (U.api.oss.rid2url(vm._data.items[i].photo, 'image/resize,w_1024,h_768')),
                        caption: vm._data.items[i].comment
                    });
                }
                ($.photoBrowser({
                    initIndex: (initIndex < 0) ? 0 : initIndex,
                    items: images
                })).open();
            }

            vm._data.items = data;
        }else{
            //todo no data process
        }

    });
});