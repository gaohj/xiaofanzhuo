from django import forms
from apps.forms import AllForm

class PublicCommentForm(forms.Form,AllForm):
    content = forms.CharField()
    news_id = forms.IntegerField()

