
function NewsList() {
    var self = this;
    self.page = 2;
    self.category_id = 0;
    self.loadBtn = $("#load-more-btn");
    template.defaults.imports.timeSince =  function (dateValue)
    {
        var date = new Date(dateValue)
        var datets = date.getTime() //毫秒
        var nowts = (new Date()).getTime()
        var timestamp = (nowts-datets)/1000 //得到的是秒
        if(timestamp < 60) {
            return '刚刚';
        }else if(timestamp >= 60 && timestamp < 60*60 ){
            minutes = parseInt(timestamp/60)
             return  minutes+'分钟前'
        }
        else if(timestamp >= 60*60 && timestamp < 60*60*24){
             hours = parseInt(timestamp/60/60)
             return hours + '小时前'
        }

        else if(timestamp >= 60*60*24 && timestamp < 60*60*24*30){
             days = parseInt((timestamp/60/60/24))
             return days + '天前'
        }
        else {
             var year = date.getFullYear()
             var month = date.getMonth()
             var day = date.getDate()
             var hour = date.getHours()
             var minute = date.getMinutes()
             return year+'/'+month+'/'+day+''+hour+':'+minute;
        }



    }
}

NewsList.prototype.listenSubmitEvent = function () {
    var submitBtn = $('.submit-btn');
    var textarea = $("textarea[name='comment']");
    submitBtn.click(function () {
        var content = textarea.val();
        var news_id = submitBtn.attr('data-news-id');
        console.log(news_id)
        xfzajax.post({
            'url': '/news/public_comment/',
            'data':{
                'content': content,
                'news_id': news_id
            },
            'success': function (result) {
                console.log(result['data']);
                if(result['code'] === 200){
                    var comment = result['data'];
                    var tpl = template('comment-item',{"comment":comment});

                    var commentListGroup = $(".comment-list");
                    commentListGroup.prepend(tpl);
                    window.messageBox.showSuccess('评论发表成功！');
                    textarea.val("");
                }else{
                    window.messageBox.showError(result['message']);
                }
            }
        });
    });
};

NewsList.prototype.run = function () {
    this.listenSubmitEvent();
};


$(function () {
    var newsList = new NewsList();
    newsList.run();
});