/**
 * Created by yQiu on 16-10-23.
 */

// 通过时间戳获取年月日十分秒
function getDataTime(time, type) {
    time = new Date((isNaN(time)) ? time : parseInt(time));
    if (type == "y")
        return time.getFullYear();
    else if (type == "m")
        return (time.getMonth()) + 1;
    else if (type == "d")
        return time.getDate();
    else if (type == "h")
        return time.getHours();
    else if (type == "M")
        return time.getMinutes();
}

jQuery(function ($) {
    var vm;

    function getData(callBack) {
        var query = {
            "group_id": U.ajax.getUrlParam("groupid"),
            "page": 1,
            "pageSize": 10
        };
        U.api.checkpoint.list(query, function (err, json) {
            callBack(err, json);
        });
    }

    function getPhotoItems(initIndex) {
        var len = vm._data.items.length, images = [];
        for (var i = 0; i < len; i++) {
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

    vm = new Vue({
        el: '#trip_items',
        data: {items: []},
        methods: {
            // 查看图片
            showImgs: function (event) {
                getPhotoItems(event.target.alt);
            },
            // 喜欢
            like: function (index) {
                $.toast("后期开放此功能", "text");
                // vm._data.items[index].like = ++(vm._data.items[index].like);
            },
            // 评论
            comment: function () {
                $.toast("后期开放此功能", "text");
            }
        }
    });

    getData(function (err, json) {
        vm._data.items = json;
    });
});