/**
 * Created by Qiu on 16-10-9.
 */
jQuery(function($){
    /**
     * menu setting
     */
    var closeMenu = function(){};
    var openMenu = function(){
        $(".leftMenu").css("left", "0").addClass("on");
    };

    $('leftMenu').length < 1 && U.ajax.ajaxHtml(U.ajax.url('/view/component/menu.html'), function(err, html){
        var $menu = $(html);
        $('body').append($menu);
        var user = android.get('user.current');

        function load_user_info(user){
            $menu.find('img.avatar').attr('src', U.api.oss.rid2url(user['avatar'], 'style/resize_128x128'));
            $menu.find('p.name').text(user['nick']);
            $menu.find('a[href="member.html"]').attr('href', 'member.html?uid=' + user['id']);
            if(user['traveller']){
                $menu.find('.traveller-on').removeClass('traveller-on');
            }
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

        closeMenu = function(){
            $menu.removeClass("on");
            setTimeout(function(){
                $menu.css("left", "-100%");
            }, 300);
        };
        $menu.find('.t-mask-visible').click(closeMenu);
        if(android && !android['menu']){
            android['menu'] = openMenu;
            $(".on-menu").click(openMenu);
        }
    });

    android && android['menu'] && $(".on-menu").click(android['menu']);

    $("div.logout a").click(function(){
        U.api.user.logout(function(err, json){
            if(err){
                android.alert(err.message);
            }else{
                location.href = 'index.html';
            }
        });
    });
    /**
     * traveller setting
     */
    (function(user){
        if(user && user['traveller']){
            $('.traveller-on').removeClass('traveller-on');
        }
    })(android && android.get('user.current'));
});