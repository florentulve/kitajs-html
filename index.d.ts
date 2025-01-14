/// <reference path="./jsx.d.ts" />

/**
 * Fast and type safe HTML templates using JSX syntax.
 *
 * @module html
 * @license Apache License Version 2.0
 *
 * @link https://github.com/kitajs/html
 * @link https://www.npmjs.com/package/@kitajs/html
 * @link https://kitajs.github.io/html/
 */
declare namespace html {
  /**
   * A const used to represent a html fragment.
   */
  export declare const Fragment: unique symbol

  /**
   * Escapes a string for safe use as HTML text content.
   *
   * @param {unknown} value the value to escape. If the value is not a string it will be converted to a string with `toString()` or `toISOString()` if it is a Date.
   * @returns {string} the escaped string.
   * @this {void}
   */
  export function escapeHtml(this: void, value: unknown): string

  /**
   * Returns true if the element is a html void element.
   *
   * @param {string} tag the name of the element to check.
   * @returns {boolean} if the element is a html void element.
   * @this {void}
   */
  export function isVoidElement(this: void, tag: string): boolean

  /**
   * Transforms an object of style attributes into a html style string.
   *
   * @param {object | string}  style a record of literal values to use as style attributes or a string.
   * @returns {string} the generated html style string.
   * @this {void}
   */
  export function styleToString(this: void, style: object | string): boolean

  /**
   * Transforms an object of attributes into a html attributes string.
   *
   * **This function does not support Date objects.**
   *
   * @example `a b="c" d="1"`
   *
   * @param {object} attributes a record of literal values to use as attributes.
   * @returns {string} the generated html attributes string.
   * @this {void}
   */
  export function attributesToString(this: void, attributes: object): string

  /**
   * Converts a camel cased string to a kebab cased string.
   *
   * @param {string} camel the camel cased string to convert.
   * @this {void}
   */
  export function toKebabCase(this: void, camel: string): string

  /**
   * Returns true if the character at the given index is an uppercase character.
   *
   * @param {string} input the string to check.
   * @param {number} index the index of the character to check.
   * @returns {boolean} if the character at the given index is an uppercase character.
   * @this {void}
   */
  export function isUpper(this: void, input: string, index: number): boolean

  /**
   * Generates a html string from the given contents.
   *
   * @param {string | Function} name the name of the element to create or a function that creates the element.
   * @param {{children?: object}} [attributes] a record of literal values to use as attributes. A property named `children` will be used as the children of the element.
   * @param  {...string} contents the inner contents of the element.
   * @returns {string} the generated html string.
   * @this {void}
   */
  export function createElement(
    this: void,
    name: string | Function | typeof Fragment,
    attributes: PropsWithChildren<any> | null,
    ...contents: Children[]
  ): JSX.Element

  /**
   * Joins raw string html elements into a single html string.
   *
   * A raw html fragment is just an array of strings, this method concatenates.
   *
   * @param {(string | string[])[]} contents an maybe nested array of strings to concatenate.
   * @returns {string} the concatenated string of contents.
   * @this {void}
   */
  export function contentsToString(
    this: void,
    contents: (string | string[])[]
  ): JSX.Element

  /**
   * Compiles html with the given arguments specified with $name syntax.
   *
   * @param {string} html
   * @returns {function} the compiled function which
   * @this {void}
   */
  export function compile<A extends string[] = []>(
    this: void,
    html: string
  ): (args: Record<A[number], number | string | boolean>) => JSX.Element

  /**
   * Here for interop with preact and many build systems.
   */
  export declare const h = createElement

  export declare type Children =
    | number
    | string
    | boolean
    | null
    | undefined
    | Children[]

  export declare type PropsWithChildren<T = {}> = { children?: Children } & T

  export declare type Component<T = {}> = (
    this: void,
    props: PropsWithChildren<T>
  ) => JSX.Element
}

export = html
