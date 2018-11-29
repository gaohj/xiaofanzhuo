function Index() {
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

Index.prototype.listenLoadMoreEvent = function () {
    var self = this;
    var loadBtn = $("#load-more-btn");
    loadBtn.click(function () {
        xfzajax.get({
            'url': '/news/list/',
            'data':{
                'p': self.page,
                'category_id': self.category_id
            },
            'success': function (result) {
                if(result['code'] === 200){
                    var newses = result['data'];
                    if(newses.length > 0){
                        var tpl = template("news-item",{"newses":newses});

                        var ul = $(".list-inner-group");
                        ul.append(tpl);
                        self.page += 1;
                    }else{
                        loadBtn.hide();
                    }
                }
            }
        });
    });
};

Index.prototype.listenCategorySwitchEvent = function () {
    var self = this;
    var tabGroup = $(".list-tab");
    tabGroup.children().click(function () {
        // this：代表当前选中的这个li标签
        var li = $(this);
        var category_id = li.attr("data-category");
        var page = 1;
        xfzajax.get({
            'url': '/news/list/',
            'data': {
                'category_id': category_id,
                'p': page
            },
            'success': function (result) {
                if(result['code'] === 200){
                    var newses = result['data'];
                    var tpl = template("news-item",{"newses":newses});
                    // empty：可以将这个标签下的所有子元素都删掉
                    var newsListGroup = $(".list-inner-group");
                    newsListGroup.empty();
                    newsListGroup.append(tpl);
                    self.page = 2;
                    self.category_id = category_id;
                    li.addClass('active').siblings().removeClass('active');
                    self.loadBtn.show();
                }
            }
        });
    });
};

Index.prototype.run = function () {
    var self = this;
    self.listenLoadMoreEvent();
    self.listenCategorySwitchEvent();
};

$(function () {
    var index = new Index();
    index.run();
});