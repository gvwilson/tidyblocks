Blockly.defineBlocksWithJsonArray([
{
  type: "transform_sort",
  message0: "Sort %1 descending %2",
  args0: [
    {
      type: "field_input",
      name: "MULTIPLE_COLUMNS",
      text: "column, column"
    },
    {
      type: "field_checkbox",
      name: "DESCENDING",
      checked: false
    }
  ],
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  style: "transform_blocks",
  extensions: ['validate_MULTIPLE_COLUMNS'],
  tooltip: "",
  helpUrl: ""
}
])