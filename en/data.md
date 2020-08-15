<div id="colors" markdown="1">
### Colors

<img class="block" src="{{ 'en/img/data_colors.svg' | relative_url }}" alt="color block"/>

The `colors` dataset has red-green-blue (RGB) values for eleven standard colors:
black, red, maroon, lime, green, blue, navy, yellow, fuchsia, aqua, and white
Each value is an integer in the range 0…255.

| Column    | Datatype        | Value       |
| --------- | --------------- | ----------- |
| name      | text            | color name  |
| red       | integer (0…255) | red value   |
| green     | integer (0…255) | green value |
| blue      | integer (0…255) | blue value  |

</div>

<div id="earthquakes" markdown="1">
### Earthquakes

<img class="block" src="{{ 'en/img/data_earthquakes.svg' | relative_url }}" alt="earthquakes block"/>

This block provides a subset of US Geological Survey data on earthquakes from 2016.

| Column    | Datatype    | Value |
| --------- | ----------- | ----- |
| Time      | datetime    | Universal Time Coordinates |
| Latitude  | number      | fractional degrees |
| Longitude | number      | fractional degrees |
| Depth_Km  | number (km) | depth in fractional kilometers |
| Magnitude | number      | Richter scale |

</div>

<div id="penguins" markdown="1">
### Penguins

<img class="block" src="{{ 'en/img/data_penguins.svg' | relative_url }}" alt="penguins block"/>

| Column            | Datatype    | Value |
| ----------------- | ----------- | ----- |
| species           | text        | type of penguin |
| island            | text        | where penguin was found |
| bill_length_mm    | number (mm) | length of bill |
| bill_depth_mm     | number (mm) | depth of bill |
| flipper_length_mm | number (mm) | length of flippers |
| body_mass_g       | number (g)  | mass |
| sex               | text        | sex |

</div>

<div id="sequence" markdown="1">
### Sequence

<img class="block" src="{{ 'en/img/data_sequence.svg' | relative_url }}" alt="sequence block"/>

Create a sequence of numbers from 1 to N inclusive.

- **name**: The name of the column holding the values.
- **range**: The upper limit of the range.
</div>

<div id="user" markdown="1">
### User Data

<img class="block" src="{{ 'en/img/data_user.svg' | relative_url }}" alt="user data block"/>

Use a previously-loaded dataset.

- *drop down*: Select dataset by name.
</div>
