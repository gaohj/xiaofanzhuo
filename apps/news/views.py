from django.shortcuts import render
from .models import News,NewsCategory,Comment
from django.conf import settings
from utils import restful
from .serializers import NewsSerializers,CommentSerizlizer
from django.http import Http404
from .forms import PublicCommentForm
#from django.contrib.auth.decorators import login_required 只支持普通页面的跳转  ajax不支持
from django.contrib.auth.decorators import login_required
from apps.xiaofanzhuoauth.decorators import xiaofanzhuo_login_required
# Create your views here.
def index(request):
    count = settings.ONE_PAGE_NEWS_COUNT
    #newses = News.objects.order_by('-pub_time')[0:count]
    # newses = News.objects.all()[0:count]
    #提前一次外键查询不至于模板中进行 200次查询
    newses = News.objects.select_related('category','author').all()[0:count]
    categories = NewsCategory.objects.all()
    context = {
        'newses': newses,
        'categories': categories,
    }
    return render(request, 'news/index.html', context=context)

# 新闻列表
def news_list(request):
    # 通过p参数获取第几页
    # 查询字符串的格式是/news/list/?p=2
    page = int(request.GET.get('p',1))
    category_id = int(request.GET.get('category_id',0))#默认为0 不进行分类
    start = (page-1)*settings.ONE_PAGE_NEWS_COUNT
    # 0 1    2
    #  2 3    4
    #  4 5    6
    end = start + settings.ONE_PAGE_NEWS_COUNT
    #newses = News.objects.order_by('-pub_time')[start:end].values()
    #newses = News.objects.order_by('-pub_time')[start:end]

    if category_id == 0:
        newses = News.objects.all()[start:end]
        #newses = News.objects.select_related('category','author').all()[start:end]
    else:
        newses = News.objects.filter(category_id=category_id)[start:end]
    # for news in newses:
    #     print(news)
    serializer = NewsSerializers(newses,many=True)
    data = serializer.data
    return restful.result(data=data)

def news_detail(request,news_id):
    try:
        #news = News.objects.get(pk=news_id)
        #news = News.objects.select_related('category','author').get(pk=news_id)
        news = News.objects.select_related('category','author').prefetch_related('comments__author').get(pk=news_id)
        context = {
            'news':news
        }
        return render(request, 'news/news_detail.html', context=context)
    except News.DoesNotExist:
        raise Http404



#评论
@xiaofanzhuo_login_required
def public_comment(request):
    form = PublicCommentForm(request.POST)
    if form.is_valid():
        news_id = form.cleaned_data.get('news_id')
        content = form.cleaned_data.get('content')
        news = News.objects.get(pk=news_id)
        comment = Comment.objects.create(content=content, news=news, author=request.user)
        serizlize = CommentSerizlizer(comment)
        return restful.result(data=serizlize.data)
    else:
        return restful.paramerror(message=form.get_errors())

