/**
 * Created by yQiu on 16-10-23.
 */
var vm;

function aaa(ints) {
    alert(ints);
}
jQuery(function ($) {
    function getData(callBack) {
        var data = [
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_11_8a34446f2824bb633ca6144018e82666.jpg',
                comment: '第1天',
                longitude: 23.03,
                latitude: 23.03,
                created_at: new Date().getTime()
            },
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_11_8a34446f2824bb633ca6144018e82666.jpg',
                comment: '第2天',
                longitude: 23.03,
                latitude: 23.03,
                created_at: new Date().getTime()
            },
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_11_8a34446f2824bb633ca6144018e82666.jpg',
                comment: '第3天',
                longitude: 23.03,
                latitude: 23.03,
                created_at: new Date().getTime()
            },
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_11_8a34446f2824bb633ca6144018e82666.jpg',
                comment: '第4天',
                longitude: 23.03,
                latitude: 23.03,
                created_at: new Date().getTime()
            },
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_11_8a34446f2824bb633ca6144018e82666.jpg',
                comment: '第5天',
                longitude: 23.03,
                latitude: 23.03,
                created_at: new Date().getTime()
            },
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_11_8a34446f2824bb633ca6144018e82666.jpg',
                comment: '第6天',
                longitude: 23.03,
                latitude: 23.03,
                created_at: new Date().getTime()
            },
            {
                photo: 'http://photos.breadtrip.com/photo_2016_10_11_8a34446f2824bb633ca6144018e82666.jpg',
                comment: '第7天',
                longitude: 23.03,
                latitude: 23.03,
                created_at: new Date().getTime()
            }
        ];
        callBack(false, data);
    }

    vm = new Vue({
        el: '#trip_items',
        data: {items: []}
    });

    getData(function (err, json) {
        vm._data.items = json;
    })
});