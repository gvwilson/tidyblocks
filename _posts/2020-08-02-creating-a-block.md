---
layout: post.liquid
title: "Creating a Block"
author: "Maya Gans"
date: "2020-08-02T12:00"
---

We love collaborators and welcome any PRs with new block ideas,
so this developer tutorial will walk you through creating your own statistical block.
All TidyBlocks blocks have three parts, which we will look at in turn:

1. The block UI: what the block looks like and what fields it includes
2. The generator code: how to extract what the user nests inside your block
3. The transform code: the actual instrcutions of what to do with what the user supplied inside your block

## Block UI

Inside the `blocks` folder you'll find JavaScript files with names corresponding to the names of the block categories.
We'll be going into `stats.js`

The function `Blockly.defineBlocksWithJsonArray` lets us use JSON to define a Blockly block.
Here's the definition of the one-sample t-test block:

```js
{
      type: 'stats_ttest_one',
      message0: MSG.stats_ttest_one.message0[language],
      args0: [],
      message1: MSG.stats_ttest_one.message1[language],
      args1: [
        {
          type: 'field_input',
          name: 'NAME',
          text: MSG.stats_ttest_one.args1_name[language]
        },
        {
          type: 'field_input',
          name: 'COLUMN',
          text: MSG.stats_ttest_one.args1_column[language]
        },
        {
          type: 'field_number',
          name: 'MEAN',
          value: 0.0
        }
      ],
      inputsInline: false,
      previousStatement: null,
      nextStatement: null,
      style: 'stats_blocks',
      tooltip: MSG.stats_ttest_one.tooltip[language],
      helpUrl: ''
    }
```

-   `type` is the name of our block `stats_ttest_one`.
    This name is how we connect the block UI to the code generator,
    and how we inform Blockly that we want to include it in our workspace.

-   `message` is the text we want to see on the block.
    Instead of writing "One-sample t-test" directly we look it up in a table called `MSG` higher up in the file
    so that we can customize blocks according to the user's preferred language.
    English is the only language supported so far, but we hope to add others soon.

-   `args0`: by not including anything here we skip a line between the block's name and its inputs.

-   `message1`: like `message`, this adds text to the block.
    The text in the lookup table is `'name %1 column %2 mean \u03BC %3',
    which means "name", a filler,, "column", another filler, "mean mu", and a final filler.

-   `args1`: this arrays specifies what goes into the three fillers in `message1`.
    -   `type` is the type of filler, such as `field_input` for a text input field or `field_number` for a numeric field.
    -   `name` is the field's name, which we will use in the code generator.
    -   `text`: the default text to display inside the field that the user will supply.
        We have chosen `name` as the default for the statistical output
        and `column` where the user should put the name of the column to perform the test on.
    -   `value`: if the field is a number, we supply a default value rather than default text.

-   `inputsInline`: allows the user to drag in blocks for the supplied args.
    This is set to false for this block, but other blocks allow users to do this.

-   `previousStatement` and `nextStatement`: are `false` because
    we *don't* want users to be able to add blocks to the left or right of this one.

-   `style`: each block family has a corresponding color palette defined in `blocks.js`.
    Since this is a stats block we give it the `stats_block` style.

-   `tooltip`: this is the text to appear on hover.
    Again, we look this up in a table so that we can internationalize it.

<div align="center">
  <img src="{{'/en/img/stats_ttest_one.svg' | relative_url}}" alt="One Sample T-Test Block UI"/>
</div>

## Generator 

Now we need to define a function to extract the user's inputs from the block's three fields:

```
  // One-sample two-sided t-test.
  Blockly.TidyBlocks['stats_ttest_one'] = (block) => {
    const name = block.getFieldValue('NAME')
    const column = block.getFieldValue('COLUMN')
    const mean = block.getFieldValue('MEAN')
    return `["@transform", "ttest_one", "${name}", "${column}", ${mean}]`
  }
```

`Blockly.TidyBlocks` holds all of the code generators, so we store our function there using its name.
For `name`, `column`, and `mean` we use `block.getFieldValue('NAME_OF_FIELD')` to get the user supplied values,
then include them in a JavaScript array with the strings `"@transform"`
(to indicate what family of blocks this one belongs to)
and `"ttest_one"` (to indicate precisely what type of block this is).
We have to return a stringified version of this array because Blockly requires code generators to return text;
we will discuss code generation in more detail in a later post.

## Transform

Our final component is a class that knows how to run our statistical test.
I actually reccomend thinking about this code prior to the  block's UI and generators
since you'll need to think about what values the user needs to input given the block type.
This class goes in `libs/transform.js`:

```
class TransformTTestOneSample extends TransformBase {
  constructor (label, colName, mean) {
    super('ttest_one', [], true, true)
    this.label = label
    this.colName = colName
    this.mean = mean
  }

  run (env, df) {
    env.appendLog('log', `${this.species} ${this.label}`)
    const samples = df.data.map(row => row[this.colName])
    const pValue = stats.tTest(samples, this.mean)
    env.setStats(this.label, pValue)
    return df
  }
}
```

`TransformTTestOneSample` takes the three fields stored in the JavaScript array
and uses the stats library to calculate the statistic using the data supplied by the previous stage in the pipeline.
We will talk more in a future post about the constructor and the `run` method of this class,
but the most important thing for now is that it stores the result in the environment `env`
so that the user interface can get it and display after the program finishes running.

## Conclusion

That's a lot to digest, but the good news is that it only has to be digested once:
almost all top-level blocks work the same way.
Digging under the hood to see how your block "knows" about prior blocks,
or how TidyBlocks figures out what pipeline your block is a not mandatory for creating a block, 
but if you're curious about that process we outline it in [the repository's README](https://github.com/tidyblocks/tidyblocks),
and we're always happy to answer questions.
