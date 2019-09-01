---
layout: page
title: "The Team"
permalink: /team/
---

{% for person in site.authors %}
  <div class="bio">
    <img class="bio-img" src="{{ person.pic | relative_url }}" alt="{{ person.name }}" />
    <div class="bio-details">
      <h2>{% if person.link %}<a href="{{ person.link }}">{% endif %}{{ person.name }}{% if person.link %}</a>{% endif %}</h2>
      <p>{{person.bio}}</p>
    </div>
  </div>
{% endfor %}
