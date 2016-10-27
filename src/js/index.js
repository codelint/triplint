/**
 * Created by Qiu on 16-10-3.
 */

jQuery(function ($) {

    var vm = new Vue({
        el: '.list',
        data: {
            lists: [
                {
                    title: '六月在夏天又去了海边',
                    dateTime: '2016-10-03',
                    place: '韩国,南极',
                    day: 4,
                    browse: 2000,
                    by: '江湖小虾米',
                    img: '../images/1.jpg?oss_image_style=1024w',
                    portrait: '../images/img.jpg?oss_image_style=1024w'
                }, {
                    title: '六月在夏天又去了海边',
                    dateTime: '2016-10-03',
                    place: '韩国,南极',
                    day: 4,
                    browse: 2000,
                    by: '江湖小虾米',
                    img: '../images/img.jpg?oss_image_style=1024w',
                    portrait: '../images/1.jpg?oss_image_style=1024w'
                }, {
                    title: '六月在夏天又去了海边',
                    dateTime: '2016-10-03',
                    place: '韩国,南极',
                    day: 4,
                    browse: 2000,
                    by: '江湖小虾米',
                    img: '../images/1.jpg?oss_image_style=1024w',
                    portrait: '../images/img.jpg?oss_image_style=1024w'
                }, {
                    title: '六月在夏天又去了海边',
                    dateTime: '2016-10-03',
                    place: '韩国,南极',
                    day: 4,
                    browse: 2000,
                    by: '江湖小虾米',
                    img: '../images/img.jpg?oss_image_style=1024w',
                    portrait: '../images/1.jpg?oss_image_style=1024w'
                }
            ]
        }
    });
    var $leftMenu = $(".leftMenu");

    $(".barn").swiper({
        loop: true,
        autoplay: 2000,//可选选项，自动滑动
        pagination: '.swiper-pagination',// 分页
        autoHeight: true, //高度随内容变化
        autoplayDisableOnInteraction: false// 点击后继续滑动
    });

    $(".on-menu").click(function () {
        $leftMenu.css("left", "0");
        $leftMenu.addClass("on");
    });

    $(".leftMenu .t-mask-visible").click(function () {
        $leftMenu.removeClass("on");
        setTimeout(function () {
            $leftMenu.css("left", "-100%");
        }, 300);
    });

    $(".add").click(function () {
        alert("ok");
        // location.href = "http://192.168.1.106:8050/src/view/";
    });
});
