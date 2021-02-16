/**
 * $File: grammar.js $
 * $Date: 2021-01-13 20:59:33 $
 * $Revision: $
 * $Creator: Jen-Chieh Shen $
 * $Notice: See LICENSE.txt for modification and distribution information
 *                   Copyright © 2021 by Shen, Jen-Chieh $
 */

const PREC = {
  COMMENT: 1, // Prefer comments over regexes
  STRING: 2,  // In a string, prefer string characters over comments

  COMMA: -1,
  OBJECT: -1,
  DECLARATION: 1,
  ASSIGN: 0,
  TERNARY: 1,
  OR: 2,
  AND: 3,
  REL: 4,
  PLUS: 5,
  TIMES: 6,
  EXP: 7,
  TYPEOF: 8,
  DELETE: 8,
  VOID: 8,
  NOT: 9,
  NEG: 10,
  INC: 11,
  CALL: 12,
  NEW: 13,
  MEMBER: 14
};

// Magit comment test..
module.exports = grammar({
  name: 'actionscript',

  word: $ => $.identifier,

  rules: {
    identifier: $ => /[A-Za-z_$][A-Za-z0-9_$]*/,
    semicolon: $ => ';',
    this: $ => 'this',
    super: $ => 'super',

    // C Style comment
    comment: $ => token(prec(PREC.COMMENT, choice(
      seq('//', /.*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/'
      )))),

    // Declarations

    declaration: $ => prec(1, choice(
      //$.module_declaration,
      $.package_declaration,
      $.import_declaration,
      //$.class_declaration,
      //$.interface_declaration,
      //$.annotation_type_declaration,
      //$.enum_declaration,
    )),

    package_declaration: $ => seq(
      repeat($._annotation),
      'package',
      $._name,
      ';'
    ),

    import_declaration: $ => seq(
      'import',
      optional('static'),
      $._name,
      optional(seq('.', $.asterisk)),
      ';'
    ),

    // Statements

    empty_statement: $ => ';',

    _statement: $ => choice(
      //$.export_statement,
      //$.import_statement,
      //$.debugger_statement,
      //$.expression_statement,
      //$._declaration,
      //$.statement_block,

      //$.if_statement,
      //$.switch_statement,
      //$.for_statement,
      //$.for_in_statement,
      //$.while_statement,
      //$.do_statement,
      //$.try_statement,
      //$.with_statement,

      //$.break_statement,
      //$.continue_statement,
      //$.return_statement,
      //$.throw_statement,
      $.empty_statement,
      //$.labeled_statement
    ),

    statement_block: $ => prec.right(seq(
      '{',
      repeat($._statement),
      '}',
      optional($.semicolon)
    )),

    function_declaration: $ => prec.right(PREC.DECLARATION, seq(
      optional('async'),
      'function',
      field('name', $.identifier),
      $._call_signature,
      field('body', $.statement_block),
      optional($.semicolon)
    )),
  }
});
