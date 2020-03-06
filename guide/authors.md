---
permalink: /authors/
title: "Authors"
---

{% for person in site.data.authors %}
<div class="author">
  <img src="{{ '/static/' | append: person.avatar | relative_url }}" alt="{{person.name}}" />
  <h2>{% if person.link %}<a href="{{ person.link }}">{% endif %}{{ person.name }}{% if person.link %}</a>{% endif %}</h2>
  <p>{{person.bio}}</p>
</div>
{% endfor %}
