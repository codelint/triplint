/**
 * Created by Qiu on 16-10-9.
 */
jQuery(function($){
    var uid = U.ajax.getUrlParam('uid');
    U.api.user.info(uid, function(err, user){
        if(err){
            android.alert(err.message);
        }else{
            var currentUser = android.current_user();
            var $avatar = $('img.avatar');
            $avatar.attr('src', U.api.oss.rid2url(user['avatar'], 'image/resize,w_128,h_128&timestamp=' + (new Date()).getTime()));
            $('p.name').text(user['nick']);

            var $file = $('input[name="file"]');
            $file.css('width', $avatar.width())
                .css('height', $avatar.height())
                .css('z-index', 1);
            $file.css('left', $avatar.offset()['left']);
            $file.css('top', $avatar.offset()['top']);
            currentUser['id'] == user['id'] && $file.change(function(){
                upload_file(user['id']);
            })
        }
    });

    /**
     *
     * @param callback
     */
    function loadData(callback){
        U.api.checkpoint.list({"traveller_id": uid, "group_id": 0}, function(err, json){
            var arr = [];
            var checkpoint;
            if(json){
                for(var i = json.length; i--;){
                    checkpoint = json[i];
                    arr.push({
                        'id': checkpoint['id'],
                        'title': checkpoint['comment'],
                        'dateTime': checkpoint['created_at'],
                        'day': 4,
                        'browse': 0,
                        'by': checkpoint['user']['nick'],
                        'img': U.api.oss.rid2url(checkpoint['photo'], 'image/resize,w_1024,h_768'),
                        'portrait': U.api.oss.rid2url(checkpoint['user']['avatar'], 'image/resize,w_128,h_128'),
                        'place': checkpoint['longitude'] + ',' + checkpoint['latitude']
                    });
                }
                callback(err, arr);
            }
        })
    }

    function upload_file(uid){
        U.api.oss.upload(5, function(err, json){
            if(err){
                android.alert(err.message);
            }else{
                var postData = json['data']['post'];
                var $form = $('#oss-upload-form');
                $form.attr('action', 'http://' + postData['host'] + '/');
                $('input[name="success_action_redirect"]').val(ROOT_URL + '/view/oss_upload_success.html');
                var $file = $form.find('input[type="file"]');
                if(!$file.val()){
                    return;
                }
                $form.find('input[name="OSSAccessKeyId"]').val(postData['accessid']);
                $form.find('input[name="policy"]').val(postData['policy']);
                $form.find('input[name="Signature"]').val(postData['signature']);
                $form.find('input[name="key"]').val(postData['object']);

                $('input[name="file"]').css('z-index', -1);
                U.api.oss.uploadSuccessCallback = (function(info){
                    return function(){
                        // $('img.avatar').attr('src', U.api.oss.rid2url(info['rid'], 'image/resize,w_128,h_128'));
                        info['rid'] && U.api.user.update({
                            'id': uid,
                            'avatar': info['rid']
                        }, function(err, json){
                            $('input[name="file"]').css('z-index', 1);
                            if(err){
                                android.alert(err.message);
                            }else{
                                $('img.avatar').attr('src', U.api.oss.rid2url(json['avatar'], 'image/resize,w_128,h_128&timestamp=' + (new Date()).getTime()));
                            }
                        })
                    }
                })(json['data']);
                $form.submit();

            }
        });
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
        });

    });
});