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

module.exports = grammar({
  name: 'actionscript',

  word: $ => $.identifier,

  rules: {
    //
    // Expression components
    //

    //
    // Expressions
    //

    //
    // Primitives
    //
    string: $ => choice(
      seq(
        '"',
        repeat(choice(
          alias($.unescaped_double_string_fragment, $.string_fragment),
          $.escape_sequence
        )),
        '"'
      ),
      seq(
        "'",
        repeat(choice(
          alias($.unescaped_single_string_fragment, $.string_fragment),
          $.escape_sequence
        )),
        "'"
      )
    ),

    unescaped_double_string_fragment: $ =>
    token.immediate(prec(1, /[^"\\]+/)),

    // same here
    unescaped_single_string_fragment: $ =>
      token.immediate(prec(1, /[^'\\]+/)),

    escape_sequence: $ => token.immediate(seq(
      '\\',
      choice(
        /[^xu0-7]/,
        /[0-7]{1,3}/,
        /x[0-9a-fA-F]{2}/,
        /u[0-9a-fA-F]{4}/,
        /u{[0-9a-fA-F]+}/
      )
    )),

    comment: $ => token(choice(
      seq('//', /.*/),
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'))),

    number: $ => {
      const hex_literal = seq(
        choice('0x', '0X'),
          /[\da-fA-F](_?[\da-fA-F])*/
      )

      const decimal_digits = /\d(_?\d)*/
      const signed_integer = seq(optional(choice('-', '+')), decimal_digits)
      const exponent_part = seq(choice('e', 'E'), signed_integer)

      const binary_literal = seq(choice('0b', '0B'), /[0-1](_?[0-1])*/)

      const octal_literal = seq(choice('0o', '0O'), /[0-7](_?[0-7])*/)

      const bigint_literal = seq(choice(hex_literal, binary_literal, octal_literal, decimal_digits), 'n')

      const decimal_integer_literal = choice(
        '0',
        seq(optional('0'), /[1-9]/, optional(seq(optional('_'), decimal_digits)))
      )

      const decimal_literal = choice(
        seq(decimal_integer_literal, '.', optional(decimal_digits), optional(exponent_part)),
        seq('.', decimal_digits, optional(exponent_part)),
        seq(decimal_integer_literal, exponent_part),
        seq(decimal_digits),
      )

      return token(choice(
        hex_literal,
        decimal_literal,
        binary_literal,
        octal_literal,
        bigint_literal,
      ))
    },

    identifier: $ => {
      const alpha = /[^\x00-\x1F\s\p{Zs}0-9:;`"'@#.,|^&<=>+\-*/\\%?!~()\[\]{}\uFEFF\u2060\u200B]|\\u[0-9a-fA-F]{4}|\\u\{[0-9a-fA-F]+\}/
      const alphanumeric = /[^\x00-\x1F\s\p{Zs}:;`"'@#.,|^&<=>+\-*/\\%?!~()\[\]{}\uFEFF\u2060\u200B]|\\u[0-9a-fA-F]{4}|\\u\{[0-9a-fA-F]+\}/
                         return token(seq(alpha, repeat(alphanumeric)))
                        },

                    semicolon: $ => ';',

                    this: $ => 'this',
                    super: $ => 'super',
                    true: $ => 'true',
                    false: $ => 'false',
                    null: $ => 'null',

                    //
                    // Expression components
                    //

                    arguments: $ => seq(
                      '(',
                      commaSep(optional(choice($.expression, $.spread_element))),
                      ')'
                    ),

                    _property_name: $ => choice(
                      alias(choice(
                        $.identifier,
                        $._reserved_identifier
                      ), $.property_identifier),
                      $.private_property_identifier,
                      $.string,
                      $.number,
                      $.computed_property_name
                    ),

                    computed_property_name: $ => seq(
                      '[',
                      $.expression,
                      ']'
                    ),

                    _reserved_identifier: $ => choice(
                      'get',
                      'set',
                      'async',
                      'static',
                      'export'
                    ),

                    _semicolon: $ => choice($._automatic_semicolon, ';')
                   }
  });

                         function commaSep1(rule) {
                           return seq(rule, repeat(seq(',', rule)));
                         }

                         function commaSep(rule) {
                           return optional(commaSep1(rule));
                         }
