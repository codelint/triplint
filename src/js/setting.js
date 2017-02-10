/**
 * Created by Qiu on 16-10-9.
 */
jQuery(function($){

    $('leftMenu').length < 1 && U.ajax.ajaxHtml(U.ajax.url('/view/component/menu.html'), function(err, html){
        var $menu = $(html);
        $('body').append($menu);
        var user = android.get('user.current');

        function load_user_info(user){
            $menu.find('img.avatar').attr('src', U.api.oss.rid2url(user['avatar'], 'style/resize_128x128'));
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

    $("div.logout a").click(function(){
        U.api.user.logout(function(err, json){
            if(err){
                android.alert(err.message);
            }else{
                location.href = 'index.html';
            }
        });
    })
});