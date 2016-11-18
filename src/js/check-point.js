/**
 * Created by yQiu on 16/11/8.
 */

jQuery(function ($) {
    new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue!'
        }
    });

    $("textarea[name=comment]").blur(function () {
        ($(this).val()) ? $(this).addClass("on") : $(this).removeClass("on");
    });
});