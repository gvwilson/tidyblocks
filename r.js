/**
 * Creating a R generator 
 * This code will not be evaluated 
 * But can be used to print text to code
 * The following code was copied from Python
 * This must be fixed to follow R syntax for evaluation
 */
 
'use strict';

goog.provide('Blockly.R');
goog.require('Blockly.Generator');


/**
 * R code generator.
 * @type {!Blockly.Generator}
 */
Blockly.R = new Blockly.Generator('R');

/**
 * FIXME
 * List of illegal variable names.
 */
 
 
Blockly.R.addReservedWords(
);

/**
 * FIXME
 * Order of operation ENUMs.
 */
Blockly.R.ORDER_ATOMIC = 0;            // 0 "" ...
Blockly.R.ORDER_COLLECTION = 1;        // tuples, lists, dictionaries
Blockly.R.ORDER_STRING_CONVERSION = 1; // `expression...`
Blockly.R.ORDER_MEMBER = 2.1;          // . []
Blockly.R.ORDER_FUNCTION_CALL = 2.2;   // ()
Blockly.R.ORDER_EXPONENTIATION = 3;    // **
Blockly.R.ORDER_UNARY_SIGN = 4;        // + -
Blockly.R.ORDER_BITWISE_NOT = 4;       // ~
Blockly.R.ORDER_MULTIPLICATIVE = 5;    // * / // %
Blockly.R.ORDER_ADDITIVE = 6;          // + -
Blockly.R.ORDER_BITWISE_SHIFT = 7;     // << >>
Blockly.R.ORDER_BITWISE_AND = 8;       // &
Blockly.R.ORDER_BITWISE_XOR = 9;       // ^
Blockly.R.ORDER_BITWISE_OR = 10;       // |
Blockly.R.ORDER_RELATIONAL = 11;       // in, not in, is, is not,
                                            //     <, <=, >, >=, <>, !=, ==
Blockly.R.ORDER_LOGICAL_NOT = 12;      // not
Blockly.R.ORDER_LOGICAL_AND = 13;      // and
Blockly.R.ORDER_LOGICAL_OR = 14;       // or
Blockly.R.ORDER_CONDITIONAL = 15;      // if else
Blockly.R.ORDER_LAMBDA = 16;           // lambda
Blockly.R.ORDER_NONE = 99;             // (...)

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array.<!Array.<number>>}
 */
Blockly.R.ORDER_OVERRIDES = [
  // (foo()).bar -> foo().bar
  // (foo())[0] -> foo()[0]
  [Blockly.R.ORDER_FUNCTION_CALL, Blockly.R.ORDER_MEMBER],
  // (foo())() -> foo()()
  [Blockly.R.ORDER_FUNCTION_CALL, Blockly.R.ORDER_FUNCTION_CALL],
  // (foo.bar).baz -> foo.bar.baz
  // (foo.bar)[0] -> foo.bar[0]
  // (foo[0]).bar -> foo[0].bar
  // (foo[0])[1] -> foo[0][1]
  [Blockly.R.ORDER_MEMBER, Blockly.R.ORDER_MEMBER],
  // (foo.bar)() -> foo.bar()
  // (foo[0])() -> foo[0]()
  [Blockly.R.ORDER_MEMBER, Blockly.R.ORDER_FUNCTION_CALL],

  // not (not foo) -> not not foo
  [Blockly.R.ORDER_LOGICAL_NOT, Blockly.R.ORDER_LOGICAL_NOT],
  // a and (b and c) -> a and b and c
  [Blockly.R.ORDER_LOGICAL_AND, Blockly.R.ORDER_LOGICAL_AND],
  // a or (b or c) -> a or b or c
  [Blockly.R.ORDER_LOGICAL_OR, Blockly.R.ORDER_LOGICAL_OR]
];

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.R.init = function(workspace) {
  /**
   * Empty loops or conditionals are not allowed in R.
   */
  Blockly.R.PASS = this.INDENT + 'pass\n';
  // Create a dictionary of definitions to be printed before the code.
  Blockly.R.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.R.functionNames_ = Object.create(null);

  if (!Blockly.R.variableDB_) {
    Blockly.R.variableDB_ =
        new Blockly.Names(Blockly.R.RESERVED_WORDS_);
  } else {
    Blockly.R.variableDB_.reset();
  }

  Blockly.R.variableDB_.setVariableMap(workspace.getVariableMap());

  var defvars = [];
  // Add developer variables (not created or named by the user).
  var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
  for (var i = 0; i < devVarList.length; i++) {
    defvars.push(Blockly.R.variableDB_.getName(devVarList[i],
        Blockly.Names.DEVELOPER_VARIABLE_TYPE) + ' = None');
  }

  // Add user variables, but only ones that are being used.
  var variables = Blockly.Variables.allUsedVarModels(workspace);
  for (var i = 0; i < variables.length; i++) {
    defvars.push(Blockly.R.variableDB_.getName(variables[i].getId(),
        Blockly.Variables.NAME_TYPE) + ' = None');
  }

  Blockly.R.definitions_['variables'] = defvars.join('\n');
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.R.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var imports = [];
  var definitions = [];
  for (var name in Blockly.R.definitions_) {
    var def = Blockly.R.definitions_[name];
    if (def.match(/^(from\s+\S+\s+)?import\s+\S+/)) {
      imports.push(def);
    } else {
      definitions.push(def);
    }
  }
  // Clean up temporary data.
  delete Blockly.R.definitions_;
  delete Blockly.R.functionNames_;
  Blockly.R.variableDB_.reset();
  var allDefs = imports.join('\n') + '\n\n' + definitions.join('\n\n');
  return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.R.scrubNakedValue = function(line) {
  return line + '\n';
};

/**
 * Encode a string as a properly escaped R string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} R string.
 * @private
 */
Blockly.R.quote_ = function(string) {
  // Can't use goog.string.quote since % must also be escaped.
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n');

  // Follow the CR behaviour of repr() for a non-byte string.
  var quote = '\'';
  if (string.indexOf('\'') !== -1) {
    if (string.indexOf('"') === -1) {
      quote = '"';
    } else {
      string = string.replace(/'/g, '\\\'');
    }
  };
  return quote + string + quote;
};

/**
 * Common tasks for generating R from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The R code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} R code with comments and subsequent blocks added.
 * @private
 */
Blockly.R.scrub_ = function(block, code, opt_thisOnly) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    comment = Blockly.utils.wrap(comment, Blockly.R.COMMENT_WRAP - 3);
    if (comment) {
      if (block.getProcedureDef) {
        // Use a comment block for function comments.
        commentCode += '"""' + comment + '\n"""\n';
      } else {
        commentCode += Blockly.R.prefixLines(comment + '\n', '# ');
      }
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.R.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.R.prefixLines(comment, '# ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = opt_thisOnly ? '' : Blockly.R.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Gets a property and adjusts the value, taking into account indexing, and
 * casts to an integer.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @return {string|number}
 */
Blockly.R.getAdjustedInt = function(block, atId, opt_delta, opt_negate) {
  var delta = opt_delta || 0;
  if (block.workspace.options.oneBasedIndex) {
    delta--;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  var atOrder = delta ? Blockly.R.ORDER_ADDITIVE :
      Blockly.R.ORDER_NONE;
  var at = Blockly.R.valueToCode(block, atId, atOrder) || defaultAtIndex;

  if (Blockly.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = parseInt(at, 10) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = 'int(' + at + ' + ' + delta + ')';
    } else if (delta < 0) {
      at = 'int(' + at + ' - ' + -delta + ')';
    } else {
      at = 'int(' + at + ')';
    }
    if (opt_negate) {
      at = '-' + at;
    }
  }
  return at;
};
