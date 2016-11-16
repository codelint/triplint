/**
 * Date: 2016/11/16
 * Time: 12:13
 * Author: Ray.Zhang <inotseeyou@foxmail.com>
 */

/**
 * For User Experience
 */
jQuery(function($){
    /**
     * 表单自动保存自动填充
     */
    (function($){
        function backup(elem){
            var $input = $(elem);
            if(android && $input.attr('name')){
                $input.attr('type') != 'file' && android.put(location.href + location.search + '#' + $input.attr('name'), $input.val());
            }
        }

        function restore(elem){
            var $input = $(elem);
            if(android && $input.attr('name')){
                var v = android.get(location.href + location.search + '#' + $input.attr('name'));
                v && $input.attr('type') != 'file' && $input.val('1').val(v);
            }
        }

        var $inputs = $('input');
        var $texts = $('textarea');
        var $selects = $('select');
        var elems = [];

        for(var i = $inputs.length; i--;){
            elems.push($inputs[i]);
        }
        for(i = $texts.length; i--;){
            elems.push($texts[i]);
        }
        for(i = $selects.length; i--;){
            elems.push($selects[i]);
        }
        for(i = elems.length; i--;){
            restore(elems[i])
        }
        setInterval(function(){
            for(var i = elems.length; i--;){
                backup(elems[i]);
            }
        });
    })($);
    /**
     * 根据路径参数自动填写form表单
     */
    (function($){
        if(location.search.length > 1){
            var params = location.search.substr(1).split('&');
            for(var i = params.length; i--;){
                var items = params[i].split('=');
                if(items.length > 1 && items[1]){
                    $('input[name="' + items[0] + '"].auto-fill').val('1').val(items[1]);
                    $('textarea[name="' + items[0] + '"].auto-fill').val('1').val(items[1]);
                    $('select[name="' + items[0] + '"].auto-fill').val('1').val(items[1]);
                }
            }
        }
    })($)
});