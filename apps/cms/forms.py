#encoding: utf-8
from apps.forms import AllForm
from django import forms
from apps.news.models import News
from apps.course.models import Course
class EditNewsCategoryForm(forms.Form):
    pk = forms.IntegerField(error_messages={"required":"必须传入分类的id！"})
    name = forms.CharField(max_length=100)


class WriteNewsForm(forms.ModelForm,AllForm):
    category = forms.IntegerField()
    class Meta:
        model = News
        exclude = ['category','author','pub_time']


class EditNewsForm(forms.ModelForm,AllForm):
    category = forms.IntegerField()
    pk = forms.IntegerField()
    class Meta:
        model = News
        exclude = ['category','author','pub_time']

#在写form表单的时候 采取的是 model form  根据数据模型字段来创建表单

class PubCourseForm(forms.ModelForm,AllForm):
    category_id = forms.IntegerField()  #这两个需要从分类表和 教师表中取出来
    teacher_id = forms.IntegerField()
    class Meta:
        model = Course  #指定模型的名称
        exclude = ("category",'teacher') #指定排除的字段