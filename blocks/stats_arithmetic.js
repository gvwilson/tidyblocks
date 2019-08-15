Blockly.defineBlocksWithJsonArray([
        {
        "type": "stats_arithmetic",
        "message0": "%1 %2 %3",
        "args0": [
          {
            "type": "input_value",
            "name": "A"
          },
          {
            "type": "field_dropdown",
            "name": "OP",
            "options": [
              ["+", "ADD"],
              ["-", "MINUS"],
              ["\u00D7", "MULTIPLY"],
              ["\u00F7", "DIVIDE"]
            ]
          },
          {
            "type": "input_value",
            "name": "B"
          }
        ],
        "inputsInline": true,
        "output": "String",
        "style": "stats_blocks",
        "helpUrl": ""
      }
    
    ]);