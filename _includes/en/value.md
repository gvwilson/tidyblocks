<div id="column">
<h3>Column</h3>

<img class="block" src="{{ './value_column.svg' | relative_url }}" alt="column block"/>

Specify the name of a single column in the data.

- **column**: The name of the column whose value is desired.
</div>

<div id="datetime">
<h3>Datetime</h3>

<img class="block" src="{{ './value_datetime.svg' | relative_url }}" alt="datetime block"/>

Specify a fixed date and time.

- **YYYY-MM-DD**: The 4-digit year, month, and day joined with dashes.
</div>

<div id="logical">
<h3>Logical</h3>

<img class="block" src="{{ './value_logical.svg' | relative_url }}" alt="logical block"/>

Select a constant logical value.

- *pulldown*: Select `true` or `false`.
</div>

<div id="number">
<h3>Number</h3>

<img class="block" src="{{ './value_number.svg' | relative_url }}" alt="number block"/>

Specify a fixed number.

- **number**: The desired number.
</div>

<div id="text">
<h3>Text</h3>

<img class="block" src="{{ './value_text.svg' | relative_url }}" alt="text block"/>

Specify a fixed text.
The value should *not* be quoted:
any single or double quotes provided will be included in the text.

- **text**: The desired text.
</div>

<div id="missing">
<h3>Missing Value</h3>

<img class="block" src="{{ './value_missing.svg' | relative_url }}" alt="missing value block"/>

The special value representing missing data.
</div>

<div id="rownum">
<h3>Row Number</h3>

<img class="block" src="{{ './value_rownum.svg' | relative_url }}" alt="row number block"/>

Generate the row number, starting from 1.
</div>

<div id="exponential">
<h3>Exponential Random Value</h3>

<img class="block" src="{{ './value_exponential.svg' | relative_url }}" alt="exponential random block"/>

Generate a random value from the exponential distribution with the rate parameter &lambda;.

- **rate**: the rate parameter.
</div>

<div id="normal">
<h3>Normal Random Variable</h3>

<img class="block" src="{{ './value_normal.svg' | relative_url }}" alt="normal random value block"/>

Generate a random value from the normal distribution with mean &mu; and standard deviation &sigma;.

-  **mean**: the center of the distribution.
-  **std dev**: the spread of the distribution.
</div>

<div id="uniform">
<h3>Uniform Random Variable</h3>

<img class="block" src="{{ './value_uniform.svg' | relative_url }}" alt="uniforn random value block"/>

Generate a random value from the uniform distribution across the given range.

-  **low**: the low end of the range.
-  **high**: the high end of the range.
</div>
