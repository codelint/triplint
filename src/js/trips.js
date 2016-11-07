/**
 * Created by yQiu on 16-10-23.
 */

// 通过时间戳获取年月日十分秒
function getDataTime(time, type) {
    time = new Date(parseInt(time));
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
    var user = android.get('user.current');
    var traveller_id = (user && Number(user['source']) > 0.01) ? user['source'] : user['id'];

    function getData(callBack) {
        var data = [
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_11_8a34446f2824bb633ca6144018e82666.jpg',
                comment: '一场说走就走的旅行',
                longitude: 23.03,
                latitude: 23.03,
                like: 10,
                comment_count: 10,
                created_at: new Date().getTime()
            },
            {
                photo: 'http://triplint.localhost:8060/wap/images/img.jpg',
                comment: '一场说走就走的旅行',
                longitude: 23.03,
                latitude: 23.03,
                like: 11,
                comment_count: 11,
                created_at: new Date().getTime()
            },
            {
                photo: 'http://triplint.localhost:8060/wap/images/1.jpg',
                comment: '一场说走就走的旅行',
                longitude: 23.03,
                latitude: 23.03,
                like: 22,
                comment_count: 22,
                created_at: new Date().getTime()
            },
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_17_c0b09b3c62d0918186896e6701abf2be.jpg',
                comment: '一场说走就走的旅行',
                longitude: 23.03,
                latitude: 23.03,
                like: 33,
                comment_count: 33,
                created_at: new Date().getTime()
            }
        ];

        var query = {
            "traveller_id": traveller_id,
            "group_id": 0,
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
                image: (U.api.oss.rid2url(vm._data.items[i].photo)),
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
        console.log(err);
        console.log(json);
        vm._data.items = json;
    });
});