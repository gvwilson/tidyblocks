<div id="colors">
<h3>Colors</h3>

<img class="block" src="{{ './data_colors.svg' | relative_url }}" alt="color block"/>

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

<div id="earthquakes">
<h3>Earthquakes</h3>

<img class="block" src="{{ './data_earthquakes.svg' | relative_url }}" alt="earthquakes block"/>

This block provides a subset of US Geological Survey data on earthquakes from 2016.

| Column    | Datatype    | Value |
| --------- | ----------- | ----- |
| Time      | datetime    | Universal Time Coordinates |
| Latitude  | number      | fractional degrees |
| Longitude | number      | fractional degrees |
| Depth_Km  | number (km) | depth in fractional kilometers |
| Magnitude | number      | Richter scale |

</div>

<div id="penguins">
<h3>Penguins</h3>

<img class="block" src="{{ './data_penguins.svg' | relative_url }}" alt="penguins block"/>

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

<div id="sequence">
<h3>Sequence</h3>

<img class="block" src="{{ './data_sequence.svg' | relative_url }}" alt="sequence block"/>

Create a sequence of numbers from 1 to N inclusive.

- **name**: The name of the column holding the values.
- **range**: The upper limit of the range.
</div>

<div id="spotify">
<h3>Spotify</h3>

<img class="block" src="{{ './data_spotify.svg' | relative_url }}" alt="spotify block"/>

| Column            |
| ----------------- |
| track_name |
| track_artist |
| track_popularity |
| track_album_name |
| track_album_release_date |
| playlist_name |
| playlist_genre |
| playlist_subgenre |
| danceability |
| energy |
| key |
| loudness |
| mode |
| speechiness |
| acousticness |
| instrumentalness |
| liveness |
| valence |
| tempo |
| duration_ms |

</div>

<div id="user">
<h3>User Data</h3>

<img class="block" src="{{ './data_user.svg' | relative_url }}" alt="user data block"/>

Use a previously-loaded dataset.

- *drop down*: Select dataset by name.
</div>
