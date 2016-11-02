/**
 * Created by Qiu on 16-10-3.
 */

jQuery(function($){

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
        U.api.checkpoint.list({'group_id' : 0}, function(err, json){
            var arr = [];
            var checkpoint;
            if(json){
                for(var i = json.length; i--;){
                    alert(JSON.stringify(json));
                    checkpoint = json[i];
                    arr.push({
                        'title': checkpoint['comment'],
                        'dateTime': checkpoint['created_at'],
                        'day': 4,
                        'browse': 0,
                        'by': checkpoint['user_id'],
                        'img': checkpoint['photo'],
                        'portrait': checkpoint['photo'],
                        'place': checkpoint['longitude'] + ',' + checkpoint['latitude']
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
        new Vue({
            el: '.list',
            data: {
                lists: data
            }
        })
    });

    var $leftMenu = $(".leftMenu");

    $(".barn").swiper({
        loop: true,
        autoplay: 2000,//可选选项，自动滑动
        pagination: '.swiper-pagination',// 分页
        autoHeight: true, //高度随内容变化
        autoplayDisableOnInteraction: false// 点击后继续滑动
    });

    $(".on-menu").click(function(){
        $leftMenu.css("left", "0");
        $leftMenu.addClass("on");
    });

    $(".leftMenu .t-mask-visible").click(function(){
        $leftMenu.removeClass("on");
        setTimeout(function(){
            $leftMenu.css("left", "-100%");
        }, 300);
    });

    $(".add").click(function(){
        alert("ok");
        // location.href = "http://192.168.1.106:8050/src/view/";
    });
});
