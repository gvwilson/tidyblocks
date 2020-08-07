---
permalink: /authors/
title: "Authors"
---

{% for person in site.data.authors %}
<div class="author">
  <img src="{{ '/static/' | append: person.avatar | relative_url }}" alt="{{person.name}}" />
  <h2 id="person.slug">{% if person.link %}<a href="{{ person.link }}">{% endif %}{{ person.name }}{% if person.link %}</a>{% endif %}</h2>
  <p>{{person.bio}}</p>
</div>
{% endfor %}

<h2>Other Contributors</h2>

<p><a href="http://dermitmaria.com/">Maria Dermit</a>: translation to Español.</p>
<p><a href="http://samarelsheikh.com/">Samar Elsheikh</a>: translation to اَلْعَرَبِيَّةُ.</p>
