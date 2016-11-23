/**
 * Created by Qiu on 16-10-9.
 */
jQuery(function ($) {
    var uid = U.ajax.getUrlParam('uid');
    U.api.user.info(uid, function (err, user) {
        if (err) {
            android.alert(err.message);
        } else {
            $('img.avatar').attr('src', U.api.oss.rid2url(user['avatar'], 'image/resize,w_128,h_128'));
            $('p.name').text(user['nick']);
        }
    });

    /**
     *
     * @param callback
     */
    function loadData(callback) {
        U.api.checkpoint.list({"traveller_id": uid, "group_id": 0}, function (err, json) {
            var arr = [];
            var checkpoint;
            if (json) {
                for (var i = json.length; i--;) {
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

    loadData(function (err, data) {
        if (err) {
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
});