/**
 * Created by Qiu on 16-10-9.
 */
jQuery(function ($) {
    var uid = U.ajax.getUrlParam('uid');
    U.api.user.info(uid, function (err, user) {
        if (err) {
            android.alert(err.message);
        } else {
            var currentUser = android.current_user();
            var $avatar = $('img.avatar');
            $avatar.attr('src', U.api.oss.rid2url(user['avatar'], 'style/resize_128x128&timestamp=' + (new Date()).getTime()));
            $('p.name').text(user['nick']);
            $('p.fanCount').text(user['fanCount'] || 0);
            $('p.followCount').text(user['followCount'] || 0);

            var $file = $('input[name="file"]');
            $file.css('width', $avatar.width())
                .css('height', $avatar.height())
                .css('z-index', 1);
            $file.css('left', $avatar.offset()['left']);
            $file.css('top', $avatar.offset()['top']);
            currentUser['id'] == user['id'] && $file.change(function () {
                upload_file(user['id']);
            })
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
                        'img': U.api.oss.rid2url(checkpoint['photo'], 'style/resize_1024x768'),
                        'portrait': U.api.oss.rid2url(checkpoint['user']['avatar'], 'style/resize_128x128'),
                        'place': checkpoint['mark'] || (checkpoint['longitude'] + ',' + checkpoint['latitude'])
                    });
                }
                callback(err, arr);
            }
        })
    }

    function upload_file(uid) {
        U.api.oss.upload(5, function (err, json) {
            if (err) {
                android.alert(err.message);
            } else {
                var postData = json['data']['post'];
                var $form = $('#oss-upload-form');
                $form.attr('action', 'http://' + postData['host'] + '/');
                $('input[name="success_action_redirect"]').val(ROOT_URL + '/view/oss_upload_success.html');
                var $file = $form.find('input[type="file"]');
                if (!$file.val()) {
                    return;
                }
                $form.find('input[name="OSSAccessKeyId"]').val(postData['accessid']);
                $form.find('input[name="policy"]').val(postData['policy']);
                $form.find('input[name="Signature"]').val(postData['signature']);
                $form.find('input[name="key"]').val(postData['object']);

                $('input[name="file"]').css('z-index', -1);
                U.api.oss.uploadSuccessCallback = (function (info) {
                    return function () {
                        // $('img.avatar').attr('src', U.api.oss.rid2url(info['rid'], 'style/resize_128x128'));
                        info['rid'] && U.api.user.update({
                            'id': uid,
                            'avatar': info['rid']
                        }, function (err, json) {
                            $('input[name="file"]').css('z-index', 1);
                            if (err) {
                                android.alert(err.message);
                            } else {
                                $('img.avatar').attr('src', U.api.oss.rid2url(json['avatar'], 'style/resize_128x128&timestamp=' + (new Date()).getTime()));
                            }
                        })
                    }
                })(json['data']);
                $form.submit();

            }
        });
    }

    var vm = new Vue({
        el: '#vm',
        data: {
            uid: uid,
            lists: [],
            editStart: false,
            topNavStyle: {background: 'rgba(73, 189, 202, 0)'}
        },
        methods: {
            handleScroll: function () {
                this.scrolled = window.scrollY;
                if (this.scrolled <= 100) {
                    this.topNavStyle.background = 'rgba(73, 189, 202, ' + this.scrolled * 0.01 + ')';
                }
            },
            edit: function () {
                this.editStart = !this.editStart;
            },
            remove: function (checkpoint) {
                var _thsi = this;
                $.modal({
                    title: "提示",
                    text: "确定要删除这个故事集吗",
                    buttons: [
                        {
                            text: "删除",
                            onClick: function () {
                                U.api.checkpoint.remove(checkpoint['id'], function (err, json) {
                                    if (err) {
                                        $.toast(err.message, 'text');
                                    } else {
                                        _thsi.lists.splice(_thsi.lists.indexOf(checkpoint), 1);
                                        $.toast(json['message'], 'text');
                                    }
                                });
                            }
                        },
                        {text: "取消", className: "default"}
                    ]
                });
            }
        },
        mounted: function () {
            window.addEventListener('scroll', this.handleScroll);
        }
    });

    loadData(function (err, data) {
        if (err) {
            alert(err.message);
            return;
        }
        vm._data.lists = data;
    });
});