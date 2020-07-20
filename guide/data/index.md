---
permalink: /guide/data/
title: "Data"
---

## Colors

<img class="block" src="{{page.permalink | append: 'colors.png' | relative_url}}" alt="color block"/>

The `colors` dataset has red-green-blue (RGB) values for eleven standard colors:
black, red, maroon, lime, green, blue, navy, yellow, fuchsia, aqua, and white
Each value is an integer in the range 0…255.

| Column    | Datatype | Value |
| --------- | -------- | ----- |
| name      | text     | color name |
| red       | integer  | red value (0…255) |
| green     | integer  | green value (0…255) |
| blue      | integer  | blue value (0…255) |

## Earthquakes

<img class="block" src="{{page.permalink | append: 'earthquakes.png' | relative_url}}" alt="earthquakes block"/>

This block provides a subset of US Geological Survey data on earthquakes from 2016.

| Column    | Datatype | Value |
| --------- | -------- | ----- |
| Time      | datetime | Universal Time Coordinates |
| Latitude  | number   | fractional degrees |
| Longitude | number   | fractional degrees |
| Depth_Km  | number   | depth in fractional kilometers |
| Magnitude | number   | Richter scale |

## Penguins

<img class="block" src="{{page.permalink | append: 'penguins.png' | relative_url}}" alt="penguins block"/>

FIXME

## Sequence

<img class="block" src="{{page.permalink | append: 'sequence.png' | relative_url}}" alt="sequence block"/>

FIXME

## User Data

<img class="block" src="{{page.permalink | append: 'user_data.png' | relative_url}}" alt="user data block"/>

FIXME
