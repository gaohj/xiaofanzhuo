from rest_framework import serializers
from .models import News,NewsCategory,Comment
from apps.xiaofanzhuoauth.serializers import UserSerializers
class NewsCategorySerializers(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = ('id', 'name')

#展示新闻的字段
class NewsSerializers(serializers.ModelSerializer):
    category = NewsCategorySerializers()
    author = UserSerializers()
    class Meta:
        model = News
        fields = ('id', 'title', 'desc', 'thumbnail', 'pub_time','category', 'author')

class CommentSerizlizer(serializers.ModelSerializer):
    author = UserSerializers()
    class Meta:
        model = Comment
        fields = ('id','content','author','pub_time')