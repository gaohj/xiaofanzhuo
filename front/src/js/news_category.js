function NewsCategory() {

};
//相当于创建一个类

//这里用来将方法执行
NewsCategory.prototype.run = function () {
    var self = this;
    self.listenAddCategoryEvent();
    self.listenEditCategoryEvent();
    self.listenDeleteCategoryEvent();
};
//跟我们 js  jquery  获取元素  绑定事件一样
NewsCategory.prototype.listenAddCategoryEvent = function () {
    var addBtn = $('#add-btn');
    addBtn.click(function () {
        xfzalert.alertOneInput({
            'title': '添加新闻分类',
            'placeholder': '请输入新闻分类',
            'confirmCallback': function (inpuValue) {
                xfzajax.post({
                    'url': '/cms/add_news_category/',
                    'data': {
                        'name': inpuValue
                    },
                    'success': function (result) {
                        if(result['code'] === 200){
                            console.log(result);
                            window.location.reload();
                        }else{
                            xfzalert.close();
                            window.messageBox.showError(result['message'])
                        }
                    }
                });
            }
        });
    });
};

NewsCategory.prototype.listenEditCategoryEvent = function () {
    var self = this;
    var editBtn = $(".edit-btn");
    editBtn.click(function () {
        var currentBtn = $(this);
        var tr = currentBtn.parent().parent();
        var pk = tr.attr('data-pk');
        var name = tr.attr('data-name');
        xfzalert.alertOneInput({
            'title': '修改分类名称',
            'placeholder': '请输入新的分类名称',
            'value': name,
            'confirmCallback': function (inputValue) {
                xfzajax.post({
                    'url': '/cms/edit_news_category/',
                    'data': {
                        'pk': pk,
                        'name': inputValue
                    },
                    'success': function (result) {
                        if(result['code'] === 200){
                            window.location.reload();
                        }else{
                            xfzalert.close();
                        }
                    }
                });
            }
        });
    });
};

NewsCategory.prototype.listenDeleteCategoryEvent = function () {
    var deleteBtn = $(".delete-btn");
    deleteBtn.click(function () {
        var currentBtn = $(this);
        var tr = currentBtn.parent().parent();
        var pk = tr.attr('data-pk');
        xfzalert.alertConfirm({
            'title': '您确定要删除这个分类吗？',
            'confirmCallback': function () {
                xfzajax.post({
                    'url': '/cms/delete_news_category/',
                    'data': {
                        'pk': pk
                    },
                    'success': function (result) {
                        if(result['code'] === 200){
                            window.location.reload();
                        }
                    }
                });
            }
        });
    });
};

//实例化一个  对象
$(function () {
    var category = new NewsCategory();

    category.run();
});