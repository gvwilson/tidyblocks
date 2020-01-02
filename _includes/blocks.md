{% for block in this_group.blocks %}
<section id="{{block.slug}}">
<h2>{{block.name}}</h2>

{% assign image_path = '/pic/' | append: this_group.slug | append: '/' | append: block.slug | append: '.png' | relative_url %}
<p><img src="{{image_path}}" alt="{{block.name}}" /></p>

{% assign doc_path = this_group.slug | append: '/' | append: block.slug | append: '.md' %}
{% capture content %}{% include {{doc_path}} %}{% endcapture %}
{{content | markdownify}}

</section>
{% endfor %}
