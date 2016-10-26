/**
 * Created by yQiu on 16-10-23.
 */

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
    function getData(callBack) {
        var data = [
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_11_8a34446f2824bb633ca6144018e82666.jpg',
                comment: '一场说走就走的旅行',
                longitude: 23.03,
                latitude: 23.03,
                created_at: new Date().getTime()
            },
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_11_8a34446f2824bb633ca6144018e82666.jpg',
                comment: '一场说走就走的旅行',
                longitude: 23.03,
                latitude: 23.03,
                created_at: new Date().getTime()
            },
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_11_8a34446f2824bb633ca6144018e82666.jpg',
                comment: '一场说走就走的旅行',
                longitude: 23.03,
                latitude: 23.03,
                created_at: new Date().getTime()
            },
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_11_8a34446f2824bb633ca6144018e82666.jpg',
                comment: '一场说走就走的旅行',
                longitude: 23.03,
                latitude: 23.03,
                created_at: new Date().getTime()
            }
        ];
        // U.ajax.getJson("", callBack(false, data));
        callBack(false, data);
    }

    var vm = new Vue({
        el: '#trip_items',
        data: {items: []}
    });

    getData(function (err, json) {
        vm._data.items = json;
    });


});