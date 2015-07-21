/*
 * Javacript Compatability
 *
 * Array.map
 * Array.reduce
 */

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
if ('function' !== typeof Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (thisArg) {
      T = thisArg;
    }

    // 6. Let A be a new array created as if by the expression new Array(len) where Array is
    // the standard built-in constructor with that name and len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while(k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];

        // ii. Let mappedValue be the result of calling the Call internal method of callback
        // with T as the this value and argument list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

        // For best browser support, use the following:
        A[ k ] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}

if ('function' !== typeof Array.prototype.reduce) {
  Array.prototype.reduce = function(callback, opt_initialValue){
    'use strict';
    if (null === this || 'undefined' === typeof this) {
      // At the moment all modern browsers, that support strict mode, have
      // native implementation of Array.prototype.reduce. For instance, IE8
      // does not support strict mode, so this check is actually useless.
      throw new TypeError(
          'Array.prototype.reduce called on null or undefined');
    }
    if ('function' !== typeof callback) {
      throw new TypeError(callback + ' is not a function');
    }
    var index, value,
        length = this.length >>> 0,
        isValueSet = false;
    if (1 < arguments.length) {
      value = opt_initialValue;
      isValueSet = true;
    }
    for (index = 0; length > index; ++index) {
      if (this.hasOwnProperty(index)) {
        if (isValueSet) {
          value = callback(value, this[index], index, this);
        }
        else {
          value = this[index];
          isValueSet = true;
        }
      }
    }
    if (!isValueSet) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    return value;
  };
}

/*
Copyright (c) 2007-2015 Ryan Schuft (ryan.schuft@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
  This code is based in part on the work done in Ruby to support
  infection as part of Ruby on Rails in the ActiveSupport's Inflector
  and Inflections classes.  It was initally ported to Javascript by
  Ryan Schuft (ryan.schuft@gmail.com) in 2007.

  The code is available at http://code.google.com/p/inflection-js/

  The basic usage is:
    1. Include this script on your web page.
    2. Call functions on any String object in Javascript

  Currently implemented functions:

    String.pluralize(plural) == String
      renders a singular English language noun into its plural form
      normal results can be overridden by passing in an alternative

    String.singularize(singular) == String
      renders a plural English language noun into its singular form
      normal results can be overridden by passing in an alterative

    String.camelize(lowFirstLetter) == String
      renders a lower case underscored word into camel case
      the first letter of the result will be upper case unless you pass true
      also translates "/" into "::" (underscore does the opposite)

    String.underscore() == String
      renders a camel cased word into words seperated by underscores
      also translates "::" back into "/" (camelize does the opposite)

    String.humanize(lowFirstLetter) == String
      renders a lower case and underscored word into human readable form
      defaults to making the first letter capitalized unless you pass true

    String.capitalize() == String
      renders all characters to lower case and then makes the first upper

    String.dasherize() == String
      renders all underbars and spaces as dashes

    String.titleize() == String
      renders words into title casing (as for book titles)

    String.demodulize() == String
      renders class names that are prepended by modules into just the class

    String.tableize() == String
      renders camel cased singular words into their underscored plural form

    String.classify() == String
      renders an underscored plural word into its camel cased singular form

    String.foreign_key(dropIdUbar) == String
      renders a class name (camel cased singular noun) into a foreign key
      defaults to seperating the class from the id with an underbar unless
      you pass true

    String.ordinalize() == String
      renders all numbers found in the string into their sequence like "22nd"
*/

/*
  This sets up a container for some constants in its own namespace
  We use the window (if available) to enable dynamic loading of this script
  Window won't necessarily exist for non-browsers.
*/
if (typeof window !== "undefined" && !window.InflectionJS)
{
    window.InflectionJS = null;
}

/*
  This sets up some constants for later use
  This should use the window namespace variable if available
*/
InflectionJS =
{
    /*
      This is a list of nouns that use the same form for both singular and plural.
      This list should remain entirely in lower case to correctly match Strings.
    */
    uncountable_words: [
        'equipment', 'information', 'rice', 'money', 'species', 'series',
        'fish', 'sheep', 'moose', 'deer', 'news'
    ],

    /*
      These rules translate from the singular form of a noun to its plural form.
    */
    plural_rules: [
        [new RegExp('(m)an$', 'gi'),                 '$1en'],
        [new RegExp('(pe)rson$', 'gi'),              '$1ople'],
        [new RegExp('(child)$', 'gi'),               '$1ren'],
        [new RegExp('^(ox)$', 'gi'),                 '$1en'],
        [new RegExp('(ax|test)is$', 'gi'),           '$1es'],
        [new RegExp('(octop|vir)us$', 'gi'),         '$1i'],
        [new RegExp('(alias|status)$', 'gi'),        '$1es'],
        [new RegExp('(bu)s$', 'gi'),                 '$1ses'],
        [new RegExp('(buffal|tomat|potat)o$', 'gi'), '$1oes'],
        [new RegExp('([ti])um$', 'gi'),              '$1a'],
        [new RegExp('sis$', 'gi'),                   'ses'],
        [new RegExp('(?:([^f])fe|([lr])f)$', 'gi'),  '$1$2ves'],
        [new RegExp('(hive)$', 'gi'),                '$1s'],
        [new RegExp('([^aeiouy]|qu)y$', 'gi'),       '$1ies'],
        [new RegExp('(x|ch|ss|sh)$', 'gi'),          '$1es'],
        [new RegExp('(matr|vert|ind)ix|ex$', 'gi'),  '$1ices'],
        [new RegExp('([m|l])ouse$', 'gi'),           '$1ice'],
        [new RegExp('(quiz)$', 'gi'),                '$1zes'],
        [new RegExp('s$', 'gi'),                     's'],
        [new RegExp('$', 'gi'),                      's']
    ],

    /*
      These rules translate from the plural form of a noun to its singular form.
    */
    singular_rules: [
        [new RegExp('(m)en$', 'gi'),                                                       '$1an'],
        [new RegExp('(pe)ople$', 'gi'),                                                    '$1rson'],
        [new RegExp('(child)ren$', 'gi'),                                                  '$1'],
        [new RegExp('([ti])a$', 'gi'),                                                     '$1um'],
        [new RegExp('((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$','gi'), '$1$2sis'],
        [new RegExp('(hive)s$', 'gi'),                                                     '$1'],
        [new RegExp('(tive)s$', 'gi'),                                                     '$1'],
        [new RegExp('(curve)s$', 'gi'),                                                    '$1'],
        [new RegExp('([lr])ves$', 'gi'),                                                   '$1f'],
        [new RegExp('([^fo])ves$', 'gi'),                                                  '$1fe'],
        [new RegExp('([^aeiouy]|qu)ies$', 'gi'),                                           '$1y'],
        [new RegExp('(s)eries$', 'gi'),                                                    '$1eries'],
        [new RegExp('(m)ovies$', 'gi'),                                                    '$1ovie'],
        [new RegExp('(x|ch|ss|sh)es$', 'gi'),                                              '$1'],
        [new RegExp('([m|l])ice$', 'gi'),                                                  '$1ouse'],
        [new RegExp('(bus)es$', 'gi'),                                                     '$1'],
        [new RegExp('(o)es$', 'gi'),                                                       '$1'],
        [new RegExp('(shoe)s$', 'gi'),                                                     '$1'],
        [new RegExp('(cris|ax|test)es$', 'gi'),                                            '$1is'],
        [new RegExp('(octop|vir)i$', 'gi'),                                                '$1us'],
        [new RegExp('(alias|status)es$', 'gi'),                                            '$1'],
        [new RegExp('^(ox)en', 'gi'),                                                      '$1'],
        [new RegExp('(vert|ind)ices$', 'gi'),                                              '$1ex'],
        [new RegExp('(matr)ices$', 'gi'),                                                  '$1ix'],
        [new RegExp('(quiz)zes$', 'gi'),                                                   '$1'],
        [new RegExp('s$', 'gi'),                                                           '']
    ],

    /*
      This is a list of words that should not be capitalized for title case
    */
    non_titlecased_words: [
        'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at',
        'by', 'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over',
        'with', 'for'
    ],

    /*
      These are regular expressions used for converting between String formats
    */
    id_suffix: new RegExp('(_ids|_id)$', 'g'),
    underbar: new RegExp('_', 'g'),
    space_or_underbar: new RegExp('[\ _]', 'g'),
    uppercase: new RegExp('([A-Z])', 'g'),
    underbar_prefix: new RegExp('^_'),

    /*
      This is a helper method that applies rules based replacement to a String
      Signature:
        InflectionJS.apply_rules(str, rules, skip, override) == String
      Arguments:
        str - String - String to modify and return based on the passed rules
        rules - Array: [RegExp, String] - Regexp to match paired with String to use for replacement
        skip - Array: [String] - Strings to skip if they match
        override - String (optional) - String to return as though this method succeeded (used to conform to APIs)
      Returns:
        String - passed String modified by passed rules
      Examples:
        InflectionJS.apply_rules("cows", InflectionJs.singular_rules) === 'cow'
    */
    apply_rules: function(str, rules, skip, override)
    {
        if (override)
        {
            str = override;
        }
        else
        {
            var ignore = (skip.indexOf(str.toLowerCase()) > -1);
            if (!ignore)
            {
                for (var x = 0; x < rules.length; x++)
                {
                    if (str.match(rules[x][0]))
                    {
                        str = str.replace(rules[x][0], rules[x][1]);
                        break;
                    }
                }
            }
        }
        return '' + str;
    }
};

/*
  This lets us detect if an Array contains a given element
  Signature:
    Array.indexOf(item, fromIndex, compareFunc) == Integer
  Arguments:
    item - Object - object to locate in the Array
    fromIndex - Integer (optional) - starts checking from this position in the Array
    compareFunc - Function (optional) - function used to compare Array item vs passed item
  Returns:
    Integer - index position in the Array of the passed item
  Examples:
    ['hi','there'].indexOf("guys") === -1
    ['hi','there'].indexOf("hi") === 0
*/
if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function(item, fromIndex, compareFunc)
    {
        if (!fromIndex)
        {
            fromIndex = -1;
        }
        var index = -1;
        for (var i = fromIndex; i < this.length; i++)
        {
            if (this[i] === item || compareFunc && compareFunc(this[i], item))
            {
                index = i;
                break;
            }
        }
        return index;
    };
}

/*
  You can override this list for all Strings or just one depending on if you
  set the new values on prototype or on a given String instance.
*/
if (!String.prototype._uncountable_words)
{
    String.prototype._uncountable_words = InflectionJS.uncountable_words;
}

/*
  You can override this list for all Strings or just one depending on if you
  set the new values on prototype or on a given String instance.
*/
if (!String.prototype._plural_rules)
{
    String.prototype._plural_rules = InflectionJS.plural_rules;
}

/*
  You can override this list for all Strings or just one depending on if you
  set the new values on prototype or on a given String instance.
*/
if (!String.prototype._singular_rules)
{
    String.prototype._singular_rules = InflectionJS.singular_rules;
}

/*
  You can override this list for all Strings or just one depending on if you
  set the new values on prototype or on a given String instance.
*/
if (!String.prototype._non_titlecased_words)
{
    String.prototype._non_titlecased_words = InflectionJS.non_titlecased_words;
}

/*
  This function adds plurilization support to every String object
    Signature:
      String.pluralize(plural) == String
    Arguments:
      plural - String (optional) - overrides normal output with said String
    Returns:
      String - singular English language nouns are returned in plural form
    Examples:
      "person".pluralize() == "people"
      "octopus".pluralize() == "octopi"
      "Hat".pluralize() == "Hats"
      "person".pluralize("guys") == "guys"
*/
if (!String.prototype.pluralize)
{
    String.prototype.pluralize = function(plural)
    {
        return InflectionJS.apply_rules(
            this,
            this._plural_rules,
            this._uncountable_words,
            plural
        );
    };
}

/*
  This function adds singularization support to every String object
    Signature:
      String.singularize(singular) == String
    Arguments:
      singular - String (optional) - overrides normal output with said String
    Returns:
      String - plural English language nouns are returned in singular form
    Examples:
      "people".singularize() == "person"
      "octopi".singularize() == "octopus"
      "Hats".singularize() == "Hat"
      "guys".singularize("person") == "person"
*/
if (!String.prototype.singularize)
{
    String.prototype.singularize = function(singular)
    {
        return InflectionJS.apply_rules(
            this,
            this._singular_rules,
            this._uncountable_words,
            singular
        );
    };
}

/*
  This function adds camelization support to every String object
    Signature:
      String.camelize(lowFirstLetter) == String
    Arguments:
      lowFirstLetter - boolean (optional) - default is to capitalize the first
        letter of the results... passing true will lowercase it
    Returns:
      String - lower case underscored words will be returned in camel case
        additionally '/' is translated to '::'
    Examples:
      "message_properties".camelize() == "MessageProperties"
      "message_properties".camelize(true) == "messageProperties"
*/
if (!String.prototype.camelize)
{
     String.prototype.camelize = function(lowFirstLetter)
     {
        var str = this.toLowerCase();
        var str_path = str.split('/');
        for (var i = 0; i < str_path.length; i++)
        {
            var str_arr = str_path[i].split('_');
            var initX = ((lowFirstLetter && i + 1 === str_path.length) ? (1) : (0));
            for (var x = initX; x < str_arr.length; x++)
            {
                str_arr[x] = str_arr[x].charAt(0).toUpperCase() + str_arr[x].substring(1);
            }
            str_path[i] = str_arr.join('');
        }
        str = str_path.join('::');
        return '' + str;
    };
}

/*
  This function adds underscore support to every String object
    Signature:
      String.underscore() == String
    Arguments:
      N/A
    Returns:
      String - camel cased words are returned as lower cased and underscored
        additionally '::' is translated to '/'
    Examples:
      "MessageProperties".camelize() == "message_properties"
      "messageProperties".underscore() == "message_properties"
*/
if (!String.prototype.underscore)
{
     String.prototype.underscore = function()
     {
        var str = this;
        var str_path = str.split('::');
        for (var i = 0; i < str_path.length; i++)
        {
            str_path[i] = str_path[i].replace(InflectionJS.uppercase, '_$1');
            str_path[i] = str_path[i].replace(InflectionJS.underbar_prefix, '');
        }
        str = str_path.join('/').toLowerCase();
        return '' + str;
    };
}

/*
  This function adds humanize support to every String object
    Signature:
      String.humanize(lowFirstLetter) == String
    Arguments:
      lowFirstLetter - boolean (optional) - default is to capitalize the first
        letter of the results... passing true will lowercase it
    Returns:
      String - lower case underscored words will be returned in humanized form
    Examples:
      "message_properties".humanize() == "Message properties"
      "message_properties".humanize(true) == "message properties"
*/
if (!String.prototype.humanize)
{
    String.prototype.humanize = function(lowFirstLetter)
    {
        var str = this.toLowerCase();
        str = str.replace(InflectionJS.id_suffix, '');
        str = str.replace(InflectionJS.underbar, ' ');
        if (!lowFirstLetter)
        {
            str = str.capitalize();
        }
        return '' + str;
    };
}

/*
  This function adds capitalization support to every String object
    Signature:
      String.capitalize() == String
    Arguments:
      N/A
    Returns:
      String - all characters will be lower case and the first will be upper
    Examples:
      "message_properties".capitalize() == "Message_properties"
      "message properties".capitalize() == "Message properties"
*/
if (!String.prototype.capitalize)
{
    String.prototype.capitalize = function()
    {
        var str = this.toLowerCase();
        str = str.substring(0, 1).toUpperCase() + str.substring(1);
        return '' + str;
    };
}

/*
  This function adds dasherization support to every String object
    Signature:
      String.dasherize() == String
    Arguments:
      N/A
    Returns:
      String - replaces all spaces or underbars with dashes
    Examples:
      "message_properties".capitalize() == "message-properties"
      "Message Properties".capitalize() == "Message-Properties"
*/
if (!String.prototype.dasherize)
{
    String.prototype.dasherize = function()
    {
        var str = this;
        str = str.replace(InflectionJS.space_or_underbar, '-');
        return '' + str;
    };
}

/*
  This function adds titleize support to every String object
    Signature:
      String.titleize() == String
    Arguments:
      N/A
    Returns:
      String - capitalizes words as you would for a book title
    Examples:
      "message_properties".titleize() == "Message Properties"
      "message properties to keep".titleize() == "Message Properties to Keep"
*/
if (!String.prototype.titleize)
{
    String.prototype.titleize = function()
    {
        var str = this.toLowerCase();
        str = str.replace(InflectionJS.underbar, ' ');
        var str_arr = str.split(' ');
        for (var x = 0; x < str_arr.length; x++)
        {
            var d = str_arr[x].split('-');
            for (var i = 0; i < d.length; i++)
            {
                if (this._non_titlecased_words.indexOf(d[i].toLowerCase()) < 0)
                {
                    d[i] = d[i].capitalize();
                }
            }
            str_arr[x] = d.join('-');
        }
        str = str_arr.join(' ');
        str = str.substring(0, 1).toUpperCase() + str.substring(1);
        return '' + str;
    };
}

/*
  This function adds demodulize support to every String object
    Signature:
      String.demodulize() == String
    Arguments:
      N/A
    Returns:
      String - removes module names leaving only class names (Ruby style)
    Examples:
      "Message::Bus::Properties".demodulize() == "Properties"
*/
if (!String.prototype.demodulize)
{
    String.prototype.demodulize = function()
    {
        var str = this;
        var str_arr = str.split('::');
        str = str_arr[str_arr.length - 1];
        return '' + str;
    };
}

/*
  This function adds tableize support to every String object
    Signature:
      String.tableize() == String
    Arguments:
      N/A
    Returns:
      String - renders camel cased words into their underscored plural form
    Examples:
      "MessageBusProperty".tableize() == "message_bus_properties"
*/
if (!String.prototype.tableize)
{
    String.prototype.tableize = function()
    {
        var str = this;
        str = str.underscore().pluralize();
        return '' + str;
    };
}

/*
  This function adds classification support to every String object
    Signature:
      String.classify() == String
    Arguments:
      N/A
    Returns:
      String - underscored plural nouns become the camel cased singular form
    Examples:
      "message_bus_properties".classify() == "MessageBusProperty"
*/
if (!String.prototype.classify)
{
    String.prototype.classify = function()
    {
        var str = this;
        str = str.camelize().singularize();
        return '' + str;
    };
}

/*
  This function adds foreign key support to every String object
    Signature:
      String.foreign_key(dropIdUbar) == String
    Arguments:
      dropIdUbar - boolean (optional) - default is to seperate id with an
        underbar at the end of the class name, you can pass true to skip it
    Returns:
      String - camel cased singular class names become underscored with id
    Examples:
      "MessageBusProperty".foreign_key() == "message_bus_property_id"
      "MessageBusProperty".foreign_key(true) == "message_bus_propertyid"
*/
if (!String.prototype.foreign_key)
{
    String.prototype.foreign_key = function(dropIdUbar)
    {
        var str = this;
        str = str.demodulize().underscore() + ((dropIdUbar) ? ('') : ('_')) + 'id';
        return '' + str;
    };
}

/*
  This function adds ordinalize support to every String object
    Signature:
      String.ordinalize() == String
    Arguments:
      N/A
    Returns:
      String - renders all found numbers their sequence like "22nd"
    Examples:
      "the 1 pitch".ordinalize() == "the 1st pitch"
*/
if (!String.prototype.ordinalize)
{
    String.prototype.ordinalize = function()
    {
        var str = this;
        var str_arr = str.split(' ');
        for (var x = 0; x < str_arr.length; x++)
        {
            var i = parseInt(str_arr[x], 10);
            if (!isNaN(i))
            {
                var ltd = str_arr[x].substring(str_arr[x].length - 2);
                var ld = str_arr[x].substring(str_arr[x].length - 1);
                var suf = "th";
                if (ltd != "11" && ltd != "12" && ltd != "13")
                {
                    if (ld === "1")
                    {
                        suf = "st";
                    }
                    else if (ld === "2")
                    {
                        suf = "nd";
                    }
                    else if (ld === "3")
                    {
                        suf = "rd";
                    }
                }
                str_arr[x] += suf;
            }
        }
        str = str_arr.join(' ');
        return '' + str;
    };
}

/*! jQuery v1.11.2 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l="1.11.2",m=function(a,b){return new m.fn.init(a,b)},n=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,o=/^-ms-/,p=/-([\da-z])/gi,q=function(a,b){return b.toUpperCase()};m.fn=m.prototype={jquery:l,constructor:m,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=m.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return m.each(this,a,b)},map:function(a){return this.pushStack(m.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},m.extend=m.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||m.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(m.isPlainObject(c)||(b=m.isArray(c)))?(b?(b=!1,f=a&&m.isArray(a)?a:[]):f=a&&m.isPlainObject(a)?a:{},g[d]=m.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},m.extend({expando:"jQuery"+(l+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===m.type(a)},isArray:Array.isArray||function(a){return"array"===m.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){return!m.isArray(a)&&a-parseFloat(a)+1>=0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},isPlainObject:function(a){var b;if(!a||"object"!==m.type(a)||a.nodeType||m.isWindow(a))return!1;try{if(a.constructor&&!j.call(a,"constructor")&&!j.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}if(k.ownLast)for(b in a)return j.call(a,b);for(b in a);return void 0===b||j.call(a,b)},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(b){b&&m.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(o,"ms-").replace(p,q)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=r(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(n,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(r(Object(a))?m.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){var d;if(b){if(g)return g.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,b){var c=+b.length,d=0,e=a.length;while(c>d)a[e++]=b[d++];if(c!==c)while(void 0!==b[d])a[e++]=b[d++];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=r(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(f=a[b],b=a,a=f),m.isFunction(a)?(c=d.call(arguments,2),e=function(){return a.apply(b||this,c.concat(d.call(arguments)))},e.guid=a.guid=a.guid||m.guid++,e):void 0},now:function(){return+new Date},support:k}),m.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function r(a){var b=a.length,c=m.type(a);return"function"===c||m.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var s=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=hb(),z=hb(),A=hb(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N=M.replace("w","w#"),O="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+N+"))|)"+L+"*\\]",P=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+O+")*)|.*)\\)|)",Q=new RegExp(L+"+","g"),R=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),S=new RegExp("^"+L+"*,"+L+"*"),T=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),U=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),V=new RegExp(P),W=new RegExp("^"+N+"$"),X={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+O),PSEUDO:new RegExp("^"+P),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ab=/[+~]/,bb=/'|\\/g,cb=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),db=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},eb=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(fb){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function gb(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],k=b.nodeType,"string"!=typeof a||!a||1!==k&&9!==k&&11!==k)return d;if(!e&&p){if(11!==k&&(f=_.exec(a)))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return H.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName)return H.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=1!==k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(bb,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+rb(o[l]);w=ab.test(a)&&pb(b.parentNode)||b,x=o.join(",")}if(x)try{return H.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function hb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ib(a){return a[u]=!0,a}function jb(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function kb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function lb(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function mb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function nb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function ob(a){return ib(function(b){return b=+b,ib(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function pb(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=gb.support={},f=gb.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=gb.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=g.documentElement,e=g.defaultView,e&&e!==e.top&&(e.addEventListener?e.addEventListener("unload",eb,!1):e.attachEvent&&e.attachEvent("onunload",eb)),p=!f(g),c.attributes=jb(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=jb(function(a){return a.appendChild(g.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(g.getElementsByClassName),c.getById=jb(function(a){return o.appendChild(a).id=u,!g.getElementsByName||!g.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(g.querySelectorAll))&&(jb(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\f]' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),jb(function(a){var b=g.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&jb(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",P)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===g||a.ownerDocument===v&&t(v,a)?-1:b===g||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,h=[a],i=[b];if(!e||!f)return a===g?-1:b===g?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return lb(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?lb(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},g):n},gb.matches=function(a,b){return gb(a,null,null,b)},gb.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return gb(b,n,null,[a]).length>0},gb.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},gb.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},gb.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},gb.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=gb.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=gb.selectors={cacheLength:50,createPseudo:ib,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(cb,db),a[3]=(a[3]||a[4]||a[5]||"").replace(cb,db),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||gb.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&gb.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(cb,db).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=gb.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(Q," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||gb.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ib(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ib(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?ib(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ib(function(a){return function(b){return gb(a,b).length>0}}),contains:ib(function(a){return a=a.replace(cb,db),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ib(function(a){return W.test(a||"")||gb.error("unsupported lang: "+a),a=a.replace(cb,db).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:ob(function(){return[0]}),last:ob(function(a,b){return[b-1]}),eq:ob(function(a,b,c){return[0>c?c+b:c]}),even:ob(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:ob(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:ob(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:ob(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=mb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=nb(b);function qb(){}qb.prototype=d.filters=d.pseudos,d.setFilters=new qb,g=gb.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?gb.error(a):z(a,i).slice(0)};function rb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function sb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function tb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ub(a,b,c){for(var d=0,e=b.length;e>d;d++)gb(a,b[d],c);return c}function vb(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function wb(a,b,c,d,e,f){return d&&!d[u]&&(d=wb(d)),e&&!e[u]&&(e=wb(e,f)),ib(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ub(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:vb(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=vb(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=vb(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function xb(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=sb(function(a){return a===b},h,!0),l=sb(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[sb(tb(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return wb(i>1&&tb(m),i>1&&rb(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&xb(a.slice(i,e)),f>e&&xb(a=a.slice(e)),f>e&&rb(a))}m.push(c)}return tb(m)}function yb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=F.call(i));s=vb(s)}H.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&gb.uniqueSort(i)}return k&&(w=v,j=t),r};return c?ib(f):f}return h=gb.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=xb(b[c]),f[u]?d.push(f):e.push(f);f=A(a,yb(e,d)),f.selector=a}return f},i=gb.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(cb,db),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(cb,db),ab.test(j[0].type)&&pb(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&rb(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,ab.test(a)&&pb(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=jb(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),jb(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||kb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&jb(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||kb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),jb(function(a){return null==a.getAttribute("disabled")})||kb(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),gb}(a);m.find=s,m.expr=s.selectors,m.expr[":"]=m.expr.pseudos,m.unique=s.uniqueSort,m.text=s.getText,m.isXMLDoc=s.isXML,m.contains=s.contains;var t=m.expr.match.needsContext,u=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,v=/^.[^:#\[\.,]*$/;function w(a,b,c){if(m.isFunction(b))return m.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return m.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(v.test(b))return m.filter(b,a,c);b=m.filter(b,a)}return m.grep(a,function(a){return m.inArray(a,b)>=0!==c})}m.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?m.find.matchesSelector(d,a)?[d]:[]:m.find.matches(a,m.grep(b,function(a){return 1===a.nodeType}))},m.fn.extend({find:function(a){var b,c=[],d=this,e=d.length;if("string"!=typeof a)return this.pushStack(m(a).filter(function(){for(b=0;e>b;b++)if(m.contains(d[b],this))return!0}));for(b=0;e>b;b++)m.find(a,d[b],c);return c=this.pushStack(e>1?m.unique(c):c),c.selector=this.selector?this.selector+" "+a:a,c},filter:function(a){return this.pushStack(w(this,a||[],!1))},not:function(a){return this.pushStack(w(this,a||[],!0))},is:function(a){return!!w(this,"string"==typeof a&&t.test(a)?m(a):a||[],!1).length}});var x,y=a.document,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=m.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a.charAt(0)&&">"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||x).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof m?b[0]:b,m.merge(this,m.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:y,!0)),u.test(c[1])&&m.isPlainObject(b))for(c in b)m.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}if(d=y.getElementById(c[2]),d&&d.parentNode){if(d.id!==c[2])return x.find(a);this.length=1,this[0]=d}return this.context=y,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):m.isFunction(a)?"undefined"!=typeof x.ready?x.ready(a):a(m):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),m.makeArray(a,this))};A.prototype=m.fn,x=m(y);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};m.extend({dir:function(a,b,c){var d=[],e=a[b];while(e&&9!==e.nodeType&&(void 0===c||1!==e.nodeType||!m(e).is(c)))1===e.nodeType&&d.push(e),e=e[b];return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),m.fn.extend({has:function(a){var b,c=m(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(m.contains(this,c[b]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=t.test(a)||"string"!=typeof a?m(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&m.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?m.unique(f):f)},index:function(a){return a?"string"==typeof a?m.inArray(this[0],m(a)):m.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(m.unique(m.merge(this.get(),m(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}m.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return m.dir(a,"parentNode")},parentsUntil:function(a,b,c){return m.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return m.dir(a,"nextSibling")},prevAll:function(a){return m.dir(a,"previousSibling")},nextUntil:function(a,b,c){return m.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return m.dir(a,"previousSibling",c)},siblings:function(a){return m.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return m.sibling(a.firstChild)},contents:function(a){return m.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:m.merge([],a.childNodes)}},function(a,b){m.fn[a]=function(c,d){var e=m.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=m.filter(d,e)),this.length>1&&(C[a]||(e=m.unique(e)),B.test(a)&&(e=e.reverse())),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return m.each(a.match(E)||[],function(a,c){b[c]=!0}),b}m.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):m.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(c=a.memory&&l,d=!0,f=g||0,g=0,e=h.length,b=!0;h&&e>f;f++)if(h[f].apply(l[0],l[1])===!1&&a.stopOnFalse){c=!1;break}b=!1,h&&(i?i.length&&j(i.shift()):c?h=[]:k.disable())},k={add:function(){if(h){var d=h.length;!function f(b){m.each(b,function(b,c){var d=m.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&f(c)})}(arguments),b?e=h.length:c&&(g=d,j(c))}return this},remove:function(){return h&&m.each(arguments,function(a,c){var d;while((d=m.inArray(c,h,d))>-1)h.splice(d,1),b&&(e>=d&&e--,f>=d&&f--)}),this},has:function(a){return a?m.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],e=0,this},disable:function(){return h=i=c=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,c||k.disable(),this},locked:function(){return!i},fireWith:function(a,c){return!h||d&&!i||(c=c||[],c=[a,c.slice?c.slice():c],b?i.push(c):j(c)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!d}};return k},m.extend({Deferred:function(a){var b=[["resolve","done",m.Callbacks("once memory"),"resolved"],["reject","fail",m.Callbacks("once memory"),"rejected"],["notify","progress",m.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return m.Deferred(function(c){m.each(b,function(b,f){var g=m.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&m.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?m.extend(a,d):d}},e={};return d.pipe=d.then,m.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&m.isFunction(a.promise)?e:0,g=1===f?a:m.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&m.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;m.fn.ready=function(a){return m.ready.promise().done(a),this},m.extend({isReady:!1,readyWait:1,holdReady:function(a){a?m.readyWait++:m.ready(!0)},ready:function(a){if(a===!0?!--m.readyWait:!m.isReady){if(!y.body)return setTimeout(m.ready);m.isReady=!0,a!==!0&&--m.readyWait>0||(H.resolveWith(y,[m]),m.fn.triggerHandler&&(m(y).triggerHandler("ready"),m(y).off("ready")))}}});function I(){y.addEventListener?(y.removeEventListener("DOMContentLoaded",J,!1),a.removeEventListener("load",J,!1)):(y.detachEvent("onreadystatechange",J),a.detachEvent("onload",J))}function J(){(y.addEventListener||"load"===event.type||"complete"===y.readyState)&&(I(),m.ready())}m.ready.promise=function(b){if(!H)if(H=m.Deferred(),"complete"===y.readyState)setTimeout(m.ready);else if(y.addEventListener)y.addEventListener("DOMContentLoaded",J,!1),a.addEventListener("load",J,!1);else{y.attachEvent("onreadystatechange",J),a.attachEvent("onload",J);var c=!1;try{c=null==a.frameElement&&y.documentElement}catch(d){}c&&c.doScroll&&!function e(){if(!m.isReady){try{c.doScroll("left")}catch(a){return setTimeout(e,50)}I(),m.ready()}}()}return H.promise(b)};var K="undefined",L;for(L in m(k))break;k.ownLast="0"!==L,k.inlineBlockNeedsLayout=!1,m(function(){var a,b,c,d;c=y.getElementsByTagName("body")[0],c&&c.style&&(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),typeof b.style.zoom!==K&&(b.style.cssText="display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",k.inlineBlockNeedsLayout=a=3===b.offsetWidth,a&&(c.style.zoom=1)),c.removeChild(d))}),function(){var a=y.createElement("div");if(null==k.deleteExpando){k.deleteExpando=!0;try{delete a.test}catch(b){k.deleteExpando=!1}}a=null}(),m.acceptData=function(a){var b=m.noData[(a.nodeName+" ").toLowerCase()],c=+a.nodeType||1;return 1!==c&&9!==c?!1:!b||b!==!0&&a.getAttribute("classid")===b};var M=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,N=/([A-Z])/g;function O(a,b,c){if(void 0===c&&1===a.nodeType){var d="data-"+b.replace(N,"-$1").toLowerCase();if(c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:M.test(c)?m.parseJSON(c):c}catch(e){}m.data(a,b,c)}else c=void 0}return c}function P(a){var b;for(b in a)if(("data"!==b||!m.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;
return!0}function Q(a,b,d,e){if(m.acceptData(a)){var f,g,h=m.expando,i=a.nodeType,j=i?m.cache:a,k=i?a[h]:a[h]&&h;if(k&&j[k]&&(e||j[k].data)||void 0!==d||"string"!=typeof b)return k||(k=i?a[h]=c.pop()||m.guid++:h),j[k]||(j[k]=i?{}:{toJSON:m.noop}),("object"==typeof b||"function"==typeof b)&&(e?j[k]=m.extend(j[k],b):j[k].data=m.extend(j[k].data,b)),g=j[k],e||(g.data||(g.data={}),g=g.data),void 0!==d&&(g[m.camelCase(b)]=d),"string"==typeof b?(f=g[b],null==f&&(f=g[m.camelCase(b)])):f=g,f}}function R(a,b,c){if(m.acceptData(a)){var d,e,f=a.nodeType,g=f?m.cache:a,h=f?a[m.expando]:m.expando;if(g[h]){if(b&&(d=c?g[h]:g[h].data)){m.isArray(b)?b=b.concat(m.map(b,m.camelCase)):b in d?b=[b]:(b=m.camelCase(b),b=b in d?[b]:b.split(" ")),e=b.length;while(e--)delete d[b[e]];if(c?!P(d):!m.isEmptyObject(d))return}(c||(delete g[h].data,P(g[h])))&&(f?m.cleanData([a],!0):k.deleteExpando||g!=g.window?delete g[h]:g[h]=null)}}}m.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(a){return a=a.nodeType?m.cache[a[m.expando]]:a[m.expando],!!a&&!P(a)},data:function(a,b,c){return Q(a,b,c)},removeData:function(a,b){return R(a,b)},_data:function(a,b,c){return Q(a,b,c,!0)},_removeData:function(a,b){return R(a,b,!0)}}),m.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=m.data(f),1===f.nodeType&&!m._data(f,"parsedAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=m.camelCase(d.slice(5)),O(f,d,e[d])));m._data(f,"parsedAttrs",!0)}return e}return"object"==typeof a?this.each(function(){m.data(this,a)}):arguments.length>1?this.each(function(){m.data(this,a,b)}):f?O(f,a,m.data(f,a)):void 0},removeData:function(a){return this.each(function(){m.removeData(this,a)})}}),m.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=m._data(a,b),c&&(!d||m.isArray(c)?d=m._data(a,b,m.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=m.queue(a,b),d=c.length,e=c.shift(),f=m._queueHooks(a,b),g=function(){m.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return m._data(a,c)||m._data(a,c,{empty:m.Callbacks("once memory").add(function(){m._removeData(a,b+"queue"),m._removeData(a,c)})})}}),m.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?m.queue(this[0],a):void 0===b?this:this.each(function(){var c=m.queue(this,a,b);m._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&m.dequeue(this,a)})},dequeue:function(a){return this.each(function(){m.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=m.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=m._data(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var S=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=["Top","Right","Bottom","Left"],U=function(a,b){return a=b||a,"none"===m.css(a,"display")||!m.contains(a.ownerDocument,a)},V=m.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===m.type(c)){e=!0;for(h in c)m.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,m.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(m(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},W=/^(?:checkbox|radio)$/i;!function(){var a=y.createElement("input"),b=y.createElement("div"),c=y.createDocumentFragment();if(b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",k.leadingWhitespace=3===b.firstChild.nodeType,k.tbody=!b.getElementsByTagName("tbody").length,k.htmlSerialize=!!b.getElementsByTagName("link").length,k.html5Clone="<:nav></:nav>"!==y.createElement("nav").cloneNode(!0).outerHTML,a.type="checkbox",a.checked=!0,c.appendChild(a),k.appendChecked=a.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue,c.appendChild(b),b.innerHTML="<input type='radio' checked='checked' name='t'/>",k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,k.noCloneEvent=!0,b.attachEvent&&(b.attachEvent("onclick",function(){k.noCloneEvent=!1}),b.cloneNode(!0).click()),null==k.deleteExpando){k.deleteExpando=!0;try{delete b.test}catch(d){k.deleteExpando=!1}}}(),function(){var b,c,d=y.createElement("div");for(b in{submit:!0,change:!0,focusin:!0})c="on"+b,(k[b+"Bubbles"]=c in a)||(d.setAttribute(c,"t"),k[b+"Bubbles"]=d.attributes[c].expando===!1);d=null}();var X=/^(?:input|select|textarea)$/i,Y=/^key/,Z=/^(?:mouse|pointer|contextmenu)|click/,$=/^(?:focusinfocus|focusoutblur)$/,_=/^([^.]*)(?:\.(.+)|)$/;function ab(){return!0}function bb(){return!1}function cb(){try{return y.activeElement}catch(a){}}m.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,n,o,p,q,r=m._data(a);if(r){c.handler&&(i=c,c=i.handler,e=i.selector),c.guid||(c.guid=m.guid++),(g=r.events)||(g=r.events={}),(k=r.handle)||(k=r.handle=function(a){return typeof m===K||a&&m.event.triggered===a.type?void 0:m.event.dispatch.apply(k.elem,arguments)},k.elem=a),b=(b||"").match(E)||[""],h=b.length;while(h--)f=_.exec(b[h])||[],o=q=f[1],p=(f[2]||"").split(".").sort(),o&&(j=m.event.special[o]||{},o=(e?j.delegateType:j.bindType)||o,j=m.event.special[o]||{},l=m.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&m.expr.match.needsContext.test(e),namespace:p.join(".")},i),(n=g[o])||(n=g[o]=[],n.delegateCount=0,j.setup&&j.setup.call(a,d,p,k)!==!1||(a.addEventListener?a.addEventListener(o,k,!1):a.attachEvent&&a.attachEvent("on"+o,k))),j.add&&(j.add.call(a,l),l.handler.guid||(l.handler.guid=c.guid)),e?n.splice(n.delegateCount++,0,l):n.push(l),m.event.global[o]=!0);a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,n,o,p,q,r=m.hasData(a)&&m._data(a);if(r&&(k=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=_.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=m.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,n=k[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),i=f=n.length;while(f--)g=n[f],!e&&q!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&("**"!==d||!g.selector)||(n.splice(f,1),g.selector&&n.delegateCount--,l.remove&&l.remove.call(a,g));i&&!n.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||m.removeEvent(a,o,r.handle),delete k[o])}else for(o in k)m.event.remove(a,o+b[j],c,d,!0);m.isEmptyObject(k)&&(delete r.handle,m._removeData(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,l,n,o=[d||y],p=j.call(b,"type")?b.type:b,q=j.call(b,"namespace")?b.namespace.split("."):[];if(h=l=d=d||y,3!==d.nodeType&&8!==d.nodeType&&!$.test(p+m.event.triggered)&&(p.indexOf(".")>=0&&(q=p.split("."),p=q.shift(),q.sort()),g=p.indexOf(":")<0&&"on"+p,b=b[m.expando]?b:new m.Event(p,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=q.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:m.makeArray(c,[b]),k=m.event.special[p]||{},e||!k.trigger||k.trigger.apply(d,c)!==!1)){if(!e&&!k.noBubble&&!m.isWindow(d)){for(i=k.delegateType||p,$.test(i+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),l=h;l===(d.ownerDocument||y)&&o.push(l.defaultView||l.parentWindow||a)}n=0;while((h=o[n++])&&!b.isPropagationStopped())b.type=n>1?i:k.bindType||p,f=(m._data(h,"events")||{})[b.type]&&m._data(h,"handle"),f&&f.apply(h,c),f=g&&h[g],f&&f.apply&&m.acceptData(h)&&(b.result=f.apply(h,c),b.result===!1&&b.preventDefault());if(b.type=p,!e&&!b.isDefaultPrevented()&&(!k._default||k._default.apply(o.pop(),c)===!1)&&m.acceptData(d)&&g&&d[p]&&!m.isWindow(d)){l=d[g],l&&(d[g]=null),m.event.triggered=p;try{d[p]()}catch(r){}m.event.triggered=void 0,l&&(d[g]=l)}return b.result}},dispatch:function(a){a=m.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(m._data(this,"events")||{})[a.type]||[],k=m.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=m.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,g=0;while((e=f.handlers[g++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(e.namespace))&&(a.handleObj=e,a.data=e.data,c=((m.event.special[e.origType]||{}).handle||e.handler).apply(f.elem,i),void 0!==c&&(a.result=c)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!=this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(e=[],f=0;h>f;f++)d=b[f],c=d.selector+" ",void 0===e[c]&&(e[c]=d.needsContext?m(c,this).index(i)>=0:m.find(c,this,null,[i]).length),e[c]&&e.push(d);e.length&&g.push({elem:i,handlers:e})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},fix:function(a){if(a[m.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=Z.test(e)?this.mouseHooks:Y.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new m.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=f.srcElement||y),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,g.filter?g.filter(a,f):a},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button,g=b.fromElement;return null==a.pageX&&null!=b.clientX&&(d=a.target.ownerDocument||y,e=d.documentElement,c=d.body,a.pageX=b.clientX+(e&&e.scrollLeft||c&&c.scrollLeft||0)-(e&&e.clientLeft||c&&c.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||c&&c.scrollTop||0)-(e&&e.clientTop||c&&c.clientTop||0)),!a.relatedTarget&&g&&(a.relatedTarget=g===a.target?b.toElement:g),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==cb()&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:"focusin"},blur:{trigger:function(){return this===cb()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return m.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0},_default:function(a){return m.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=m.extend(new m.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?m.event.trigger(e,null,b):m.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},m.removeEvent=y.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]===K&&(a[d]=null),a.detachEvent(d,c))},m.Event=function(a,b){return this instanceof m.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ab:bb):this.type=a,b&&m.extend(this,b),this.timeStamp=a&&a.timeStamp||m.now(),void(this[m.expando]=!0)):new m.Event(a,b)},m.Event.prototype={isDefaultPrevented:bb,isPropagationStopped:bb,isImmediatePropagationStopped:bb,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ab,a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ab,a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ab,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},m.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){m.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!m.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.submitBubbles||(m.event.special.submit={setup:function(){return m.nodeName(this,"form")?!1:void m.event.add(this,"click._submit keypress._submit",function(a){var b=a.target,c=m.nodeName(b,"input")||m.nodeName(b,"button")?b.form:void 0;c&&!m._data(c,"submitBubbles")&&(m.event.add(c,"submit._submit",function(a){a._submit_bubble=!0}),m._data(c,"submitBubbles",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&m.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){return m.nodeName(this,"form")?!1:void m.event.remove(this,"._submit")}}),k.changeBubbles||(m.event.special.change={setup:function(){return X.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(m.event.add(this,"propertychange._change",function(a){"checked"===a.originalEvent.propertyName&&(this._just_changed=!0)}),m.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),m.event.simulate("change",this,a,!0)})),!1):void m.event.add(this,"beforeactivate._change",function(a){var b=a.target;X.test(b.nodeName)&&!m._data(b,"changeBubbles")&&(m.event.add(b,"change._change",function(a){!this.parentNode||a.isSimulated||a.isTrigger||m.event.simulate("change",this.parentNode,a,!0)}),m._data(b,"changeBubbles",!0))})},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||"radio"!==b.type&&"checkbox"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return m.event.remove(this,"._change"),!X.test(this.nodeName)}}),k.focusinBubbles||m.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){m.event.simulate(b,a.target,m.event.fix(a),!0)};m.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=m._data(d,b);e||d.addEventListener(a,c,!0),m._data(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=m._data(d,b)-1;e?m._data(d,b,e):(d.removeEventListener(a,c,!0),m._removeData(d,b))}}}),m.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(f in a)this.on(f,b,c,a[f],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=bb;else if(!d)return this;return 1===e&&(g=d,d=function(a){return m().off(a),g.apply(this,arguments)},d.guid=g.guid||(g.guid=m.guid++)),this.each(function(){m.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,m(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=bb),this.each(function(){m.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){m.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?m.event.trigger(a,b,c,!0):void 0}});function db(a){var b=eb.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}var eb="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",fb=/ jQuery\d+="(?:null|\d+)"/g,gb=new RegExp("<(?:"+eb+")[\\s/>]","i"),hb=/^\s+/,ib=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,jb=/<([\w:]+)/,kb=/<tbody/i,lb=/<|&#?\w+;/,mb=/<(?:script|style|link)/i,nb=/checked\s*(?:[^=]|=\s*.checked.)/i,ob=/^$|\/(?:java|ecma)script/i,pb=/^true\/(.*)/,qb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,rb={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:k.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},sb=db(y),tb=sb.appendChild(y.createElement("div"));rb.optgroup=rb.option,rb.tbody=rb.tfoot=rb.colgroup=rb.caption=rb.thead,rb.th=rb.td;function ub(a,b){var c,d,e=0,f=typeof a.getElementsByTagName!==K?a.getElementsByTagName(b||"*"):typeof a.querySelectorAll!==K?a.querySelectorAll(b||"*"):void 0;if(!f)for(f=[],c=a.childNodes||a;null!=(d=c[e]);e++)!b||m.nodeName(d,b)?f.push(d):m.merge(f,ub(d,b));return void 0===b||b&&m.nodeName(a,b)?m.merge([a],f):f}function vb(a){W.test(a.type)&&(a.defaultChecked=a.checked)}function wb(a,b){return m.nodeName(a,"table")&&m.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function xb(a){return a.type=(null!==m.find.attr(a,"type"))+"/"+a.type,a}function yb(a){var b=pb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function zb(a,b){for(var c,d=0;null!=(c=a[d]);d++)m._data(c,"globalEval",!b||m._data(b[d],"globalEval"))}function Ab(a,b){if(1===b.nodeType&&m.hasData(a)){var c,d,e,f=m._data(a),g=m._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)m.event.add(b,c,h[c][d])}g.data&&(g.data=m.extend({},g.data))}}function Bb(a,b){var c,d,e;if(1===b.nodeType){if(c=b.nodeName.toLowerCase(),!k.noCloneEvent&&b[m.expando]){e=m._data(b);for(d in e.events)m.removeEvent(b,d,e.handle);b.removeAttribute(m.expando)}"script"===c&&b.text!==a.text?(xb(b).text=a.text,yb(b)):"object"===c?(b.parentNode&&(b.outerHTML=a.outerHTML),k.html5Clone&&a.innerHTML&&!m.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):"input"===c&&W.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):"option"===c?b.defaultSelected=b.selected=a.defaultSelected:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}}m.extend({clone:function(a,b,c){var d,e,f,g,h,i=m.contains(a.ownerDocument,a);if(k.html5Clone||m.isXMLDoc(a)||!gb.test("<"+a.nodeName+">")?f=a.cloneNode(!0):(tb.innerHTML=a.outerHTML,tb.removeChild(f=tb.firstChild)),!(k.noCloneEvent&&k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||m.isXMLDoc(a)))for(d=ub(f),h=ub(a),g=0;null!=(e=h[g]);++g)d[g]&&Bb(e,d[g]);if(b)if(c)for(h=h||ub(a),d=d||ub(f),g=0;null!=(e=h[g]);g++)Ab(e,d[g]);else Ab(a,f);return d=ub(f,"script"),d.length>0&&zb(d,!i&&ub(a,"script")),d=h=e=null,f},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,l,n=a.length,o=db(b),p=[],q=0;n>q;q++)if(f=a[q],f||0===f)if("object"===m.type(f))m.merge(p,f.nodeType?[f]:f);else if(lb.test(f)){h=h||o.appendChild(b.createElement("div")),i=(jb.exec(f)||["",""])[1].toLowerCase(),l=rb[i]||rb._default,h.innerHTML=l[1]+f.replace(ib,"<$1></$2>")+l[2],e=l[0];while(e--)h=h.lastChild;if(!k.leadingWhitespace&&hb.test(f)&&p.push(b.createTextNode(hb.exec(f)[0])),!k.tbody){f="table"!==i||kb.test(f)?"<table>"!==l[1]||kb.test(f)?0:h:h.firstChild,e=f&&f.childNodes.length;while(e--)m.nodeName(j=f.childNodes[e],"tbody")&&!j.childNodes.length&&f.removeChild(j)}m.merge(p,h.childNodes),h.textContent="";while(h.firstChild)h.removeChild(h.firstChild);h=o.lastChild}else p.push(b.createTextNode(f));h&&o.removeChild(h),k.appendChecked||m.grep(ub(p,"input"),vb),q=0;while(f=p[q++])if((!d||-1===m.inArray(f,d))&&(g=m.contains(f.ownerDocument,f),h=ub(o.appendChild(f),"script"),g&&zb(h),c)){e=0;while(f=h[e++])ob.test(f.type||"")&&c.push(f)}return h=null,o},cleanData:function(a,b){for(var d,e,f,g,h=0,i=m.expando,j=m.cache,l=k.deleteExpando,n=m.event.special;null!=(d=a[h]);h++)if((b||m.acceptData(d))&&(f=d[i],g=f&&j[f])){if(g.events)for(e in g.events)n[e]?m.event.remove(d,e):m.removeEvent(d,e,g.handle);j[f]&&(delete j[f],l?delete d[i]:typeof d.removeAttribute!==K?d.removeAttribute(i):d[i]=null,c.push(f))}}}),m.fn.extend({text:function(a){return V(this,function(a){return void 0===a?m.text(this):this.empty().append((this[0]&&this[0].ownerDocument||y).createTextNode(a))},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=wb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=wb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?m.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||m.cleanData(ub(c)),c.parentNode&&(b&&m.contains(c.ownerDocument,c)&&zb(ub(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++){1===a.nodeType&&m.cleanData(ub(a,!1));while(a.firstChild)a.removeChild(a.firstChild);a.options&&m.nodeName(a,"select")&&(a.options.length=0)}return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return m.clone(this,a,b)})},html:function(a){return V(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a)return 1===b.nodeType?b.innerHTML.replace(fb,""):void 0;if(!("string"!=typeof a||mb.test(a)||!k.htmlSerialize&&gb.test(a)||!k.leadingWhitespace&&hb.test(a)||rb[(jb.exec(a)||["",""])[1].toLowerCase()])){a=a.replace(ib,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(m.cleanData(ub(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,m.cleanData(ub(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,n=this,o=l-1,p=a[0],q=m.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&nb.test(p))return this.each(function(c){var d=n.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(i=m.buildFragment(a,this[0].ownerDocument,!1,this),c=i.firstChild,1===i.childNodes.length&&(i=c),c)){for(g=m.map(ub(i,"script"),xb),f=g.length;l>j;j++)d=i,j!==o&&(d=m.clone(d,!0,!0),f&&m.merge(g,ub(d,"script"))),b.call(this[j],d,j);if(f)for(h=g[g.length-1].ownerDocument,m.map(g,yb),j=0;f>j;j++)d=g[j],ob.test(d.type||"")&&!m._data(d,"globalEval")&&m.contains(h,d)&&(d.src?m._evalUrl&&m._evalUrl(d.src):m.globalEval((d.text||d.textContent||d.innerHTML||"").replace(qb,"")));i=c=null}return this}}),m.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){m.fn[a]=function(a){for(var c,d=0,e=[],g=m(a),h=g.length-1;h>=d;d++)c=d===h?this:this.clone(!0),m(g[d])[b](c),f.apply(e,c.get());return this.pushStack(e)}});var Cb,Db={};function Eb(b,c){var d,e=m(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:m.css(e[0],"display");return e.detach(),f}function Fb(a){var b=y,c=Db[a];return c||(c=Eb(a,b),"none"!==c&&c||(Cb=(Cb||m("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=(Cb[0].contentWindow||Cb[0].contentDocument).document,b.write(),b.close(),c=Eb(a,b),Cb.detach()),Db[a]=c),c}!function(){var a;k.shrinkWrapBlocks=function(){if(null!=a)return a;a=!1;var b,c,d;return c=y.getElementsByTagName("body")[0],c&&c.style?(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),typeof b.style.zoom!==K&&(b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",b.appendChild(y.createElement("div")).style.width="5px",a=3!==b.offsetWidth),c.removeChild(d),a):void 0}}();var Gb=/^margin/,Hb=new RegExp("^("+S+")(?!px)[a-z%]+$","i"),Ib,Jb,Kb=/^(top|right|bottom|left)$/;a.getComputedStyle?(Ib=function(b){return b.ownerDocument.defaultView.opener?b.ownerDocument.defaultView.getComputedStyle(b,null):a.getComputedStyle(b,null)},Jb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ib(a),g=c?c.getPropertyValue(b)||c[b]:void 0,c&&(""!==g||m.contains(a.ownerDocument,a)||(g=m.style(a,b)),Hb.test(g)&&Gb.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0===g?g:g+""}):y.documentElement.currentStyle&&(Ib=function(a){return a.currentStyle},Jb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ib(a),g=c?c[b]:void 0,null==g&&h&&h[b]&&(g=h[b]),Hb.test(g)&&!Kb.test(b)&&(d=h.left,e=a.runtimeStyle,f=e&&e.left,f&&(e.left=a.currentStyle.left),h.left="fontSize"===b?"1em":g,g=h.pixelLeft+"px",h.left=d,f&&(e.left=f)),void 0===g?g:g+""||"auto"});function Lb(a,b){return{get:function(){var c=a();if(null!=c)return c?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d,e,f,g,h;if(b=y.createElement("div"),b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",d=b.getElementsByTagName("a")[0],c=d&&d.style){c.cssText="float:left;opacity:.5",k.opacity="0.5"===c.opacity,k.cssFloat=!!c.cssFloat,b.style.backgroundClip="content-box",b.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===b.style.backgroundClip,k.boxSizing=""===c.boxSizing||""===c.MozBoxSizing||""===c.WebkitBoxSizing,m.extend(k,{reliableHiddenOffsets:function(){return null==g&&i(),g},boxSizingReliable:function(){return null==f&&i(),f},pixelPosition:function(){return null==e&&i(),e},reliableMarginRight:function(){return null==h&&i(),h}});function i(){var b,c,d,i;c=y.getElementsByTagName("body")[0],c&&c.style&&(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),b.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",e=f=!1,h=!0,a.getComputedStyle&&(e="1%"!==(a.getComputedStyle(b,null)||{}).top,f="4px"===(a.getComputedStyle(b,null)||{width:"4px"}).width,i=b.appendChild(y.createElement("div")),i.style.cssText=b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",i.style.marginRight=i.style.width="0",b.style.width="1px",h=!parseFloat((a.getComputedStyle(i,null)||{}).marginRight),b.removeChild(i)),b.innerHTML="<table><tr><td></td><td>t</td></tr></table>",i=b.getElementsByTagName("td"),i[0].style.cssText="margin:0;border:0;padding:0;display:none",g=0===i[0].offsetHeight,g&&(i[0].style.display="",i[1].style.display="none",g=0===i[0].offsetHeight),c.removeChild(d))}}}(),m.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var Mb=/alpha\([^)]*\)/i,Nb=/opacity\s*=\s*([^)]*)/,Ob=/^(none|table(?!-c[ea]).+)/,Pb=new RegExp("^("+S+")(.*)$","i"),Qb=new RegExp("^([+-])=("+S+")","i"),Rb={position:"absolute",visibility:"hidden",display:"block"},Sb={letterSpacing:"0",fontWeight:"400"},Tb=["Webkit","O","Moz","ms"];function Ub(a,b){if(b in a)return b;var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=Tb.length;while(e--)if(b=Tb[e]+c,b in a)return b;return d}function Vb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=m._data(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&U(d)&&(f[g]=m._data(d,"olddisplay",Fb(d.nodeName)))):(e=U(d),(c&&"none"!==c||!e)&&m._data(d,"olddisplay",e?c:m.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function Wb(a,b,c){var d=Pb.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Xb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=m.css(a,c+T[f],!0,e)),d?("content"===c&&(g-=m.css(a,"padding"+T[f],!0,e)),"margin"!==c&&(g-=m.css(a,"border"+T[f]+"Width",!0,e))):(g+=m.css(a,"padding"+T[f],!0,e),"padding"!==c&&(g+=m.css(a,"border"+T[f]+"Width",!0,e)));return g}function Yb(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Ib(a),g=k.boxSizing&&"border-box"===m.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=Jb(a,b,f),(0>e||null==e)&&(e=a.style[b]),Hb.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Xb(a,b,c||(g?"border":"content"),d,f)+"px"}m.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Jb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":k.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=m.camelCase(b),i=a.style;if(b=m.cssProps[h]||(m.cssProps[h]=Ub(i,h)),g=m.cssHooks[b]||m.cssHooks[h],void 0===c)return g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b];if(f=typeof c,"string"===f&&(e=Qb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(m.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||m.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),!(g&&"set"in g&&void 0===(c=g.set(a,c,d)))))try{i[b]=c}catch(j){}}},css:function(a,b,c,d){var e,f,g,h=m.camelCase(b);return b=m.cssProps[h]||(m.cssProps[h]=Ub(a.style,h)),g=m.cssHooks[b]||m.cssHooks[h],g&&"get"in g&&(f=g.get(a,!0,c)),void 0===f&&(f=Jb(a,b,d)),"normal"===f&&b in Sb&&(f=Sb[b]),""===c||c?(e=parseFloat(f),c===!0||m.isNumeric(e)?e||0:f):f}}),m.each(["height","width"],function(a,b){m.cssHooks[b]={get:function(a,c,d){return c?Ob.test(m.css(a,"display"))&&0===a.offsetWidth?m.swap(a,Rb,function(){return Yb(a,b,d)}):Yb(a,b,d):void 0},set:function(a,c,d){var e=d&&Ib(a);return Wb(a,c,d?Xb(a,b,d,k.boxSizing&&"border-box"===m.css(a,"boxSizing",!1,e),e):0)}}}),k.opacity||(m.cssHooks.opacity={get:function(a,b){return Nb.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=m.isNumeric(b)?"alpha(opacity="+100*b+")":"",f=d&&d.filter||c.filter||"";c.zoom=1,(b>=1||""===b)&&""===m.trim(f.replace(Mb,""))&&c.removeAttribute&&(c.removeAttribute("filter"),""===b||d&&!d.filter)||(c.filter=Mb.test(f)?f.replace(Mb,e):f+" "+e)}}),m.cssHooks.marginRight=Lb(k.reliableMarginRight,function(a,b){return b?m.swap(a,{display:"inline-block"},Jb,[a,"marginRight"]):void 0}),m.each({margin:"",padding:"",border:"Width"},function(a,b){m.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+T[d]+b]=f[d]||f[d-2]||f[0];return e}},Gb.test(a)||(m.cssHooks[a+b].set=Wb)}),m.fn.extend({css:function(a,b){return V(this,function(a,b,c){var d,e,f={},g=0;if(m.isArray(b)){for(d=Ib(a),e=b.length;e>g;g++)f[b[g]]=m.css(a,b[g],!1,d);return f}return void 0!==c?m.style(a,b,c):m.css(a,b)},a,b,arguments.length>1)},show:function(){return Vb(this,!0)},hide:function(){return Vb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){U(this)?m(this).show():m(this).hide()})}});function Zb(a,b,c,d,e){return new Zb.prototype.init(a,b,c,d,e)
}m.Tween=Zb,Zb.prototype={constructor:Zb,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(m.cssNumber[c]?"":"px")},cur:function(){var a=Zb.propHooks[this.prop];return a&&a.get?a.get(this):Zb.propHooks._default.get(this)},run:function(a){var b,c=Zb.propHooks[this.prop];return this.pos=b=this.options.duration?m.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Zb.propHooks._default.set(this),this}},Zb.prototype.init.prototype=Zb.prototype,Zb.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=m.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){m.fx.step[a.prop]?m.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[m.cssProps[a.prop]]||m.cssHooks[a.prop])?m.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Zb.propHooks.scrollTop=Zb.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},m.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},m.fx=Zb.prototype.init,m.fx.step={};var $b,_b,ac=/^(?:toggle|show|hide)$/,bc=new RegExp("^(?:([+-])=|)("+S+")([a-z%]*)$","i"),cc=/queueHooks$/,dc=[ic],ec={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=bc.exec(b),f=e&&e[3]||(m.cssNumber[a]?"":"px"),g=(m.cssNumber[a]||"px"!==f&&+d)&&bc.exec(m.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,m.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function fc(){return setTimeout(function(){$b=void 0}),$b=m.now()}function gc(a,b){var c,d={height:a},e=0;for(b=b?1:0;4>e;e+=2-b)c=T[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function hc(a,b,c){for(var d,e=(ec[b]||[]).concat(ec["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function ic(a,b,c){var d,e,f,g,h,i,j,l,n=this,o={},p=a.style,q=a.nodeType&&U(a),r=m._data(a,"fxshow");c.queue||(h=m._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,n.always(function(){n.always(function(){h.unqueued--,m.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[p.overflow,p.overflowX,p.overflowY],j=m.css(a,"display"),l="none"===j?m._data(a,"olddisplay")||Fb(a.nodeName):j,"inline"===l&&"none"===m.css(a,"float")&&(k.inlineBlockNeedsLayout&&"inline"!==Fb(a.nodeName)?p.zoom=1:p.display="inline-block")),c.overflow&&(p.overflow="hidden",k.shrinkWrapBlocks()||n.always(function(){p.overflow=c.overflow[0],p.overflowX=c.overflow[1],p.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],ac.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(q?"hide":"show")){if("show"!==e||!r||void 0===r[d])continue;q=!0}o[d]=r&&r[d]||m.style(a,d)}else j=void 0;if(m.isEmptyObject(o))"inline"===("none"===j?Fb(a.nodeName):j)&&(p.display=j);else{r?"hidden"in r&&(q=r.hidden):r=m._data(a,"fxshow",{}),f&&(r.hidden=!q),q?m(a).show():n.done(function(){m(a).hide()}),n.done(function(){var b;m._removeData(a,"fxshow");for(b in o)m.style(a,b,o[b])});for(d in o)g=hc(q?r[d]:0,d,n),d in r||(r[d]=g.start,q&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function jc(a,b){var c,d,e,f,g;for(c in a)if(d=m.camelCase(c),e=b[d],f=a[c],m.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=m.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function kc(a,b,c){var d,e,f=0,g=dc.length,h=m.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=$b||fc(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:m.extend({},b),opts:m.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:$b||fc(),duration:c.duration,tweens:[],createTween:function(b,c){var d=m.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(jc(k,j.opts.specialEasing);g>f;f++)if(d=dc[f].call(j,a,k,j.opts))return d;return m.map(k,hc,j),m.isFunction(j.opts.start)&&j.opts.start.call(a,j),m.fx.timer(m.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}m.Animation=m.extend(kc,{tweener:function(a,b){m.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],ec[c]=ec[c]||[],ec[c].unshift(b)},prefilter:function(a,b){b?dc.unshift(a):dc.push(a)}}),m.speed=function(a,b,c){var d=a&&"object"==typeof a?m.extend({},a):{complete:c||!c&&b||m.isFunction(a)&&a,duration:a,easing:c&&b||b&&!m.isFunction(b)&&b};return d.duration=m.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in m.fx.speeds?m.fx.speeds[d.duration]:m.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){m.isFunction(d.old)&&d.old.call(this),d.queue&&m.dequeue(this,d.queue)},d},m.fn.extend({fadeTo:function(a,b,c,d){return this.filter(U).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=m.isEmptyObject(a),f=m.speed(b,c,d),g=function(){var b=kc(this,m.extend({},a),f);(e||m._data(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=m.timers,g=m._data(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&cc.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&m.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=m._data(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=m.timers,g=d?d.length:0;for(c.finish=!0,m.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),m.each(["toggle","show","hide"],function(a,b){var c=m.fn[b];m.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(gc(b,!0),a,d,e)}}),m.each({slideDown:gc("show"),slideUp:gc("hide"),slideToggle:gc("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){m.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),m.timers=[],m.fx.tick=function(){var a,b=m.timers,c=0;for($b=m.now();c<b.length;c++)a=b[c],a()||b[c]!==a||b.splice(c--,1);b.length||m.fx.stop(),$b=void 0},m.fx.timer=function(a){m.timers.push(a),a()?m.fx.start():m.timers.pop()},m.fx.interval=13,m.fx.start=function(){_b||(_b=setInterval(m.fx.tick,m.fx.interval))},m.fx.stop=function(){clearInterval(_b),_b=null},m.fx.speeds={slow:600,fast:200,_default:400},m.fn.delay=function(a,b){return a=m.fx?m.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a,b,c,d,e;b=y.createElement("div"),b.setAttribute("className","t"),b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",d=b.getElementsByTagName("a")[0],c=y.createElement("select"),e=c.appendChild(y.createElement("option")),a=b.getElementsByTagName("input")[0],d.style.cssText="top:1px",k.getSetAttribute="t"!==b.className,k.style=/top/.test(d.getAttribute("style")),k.hrefNormalized="/a"===d.getAttribute("href"),k.checkOn=!!a.value,k.optSelected=e.selected,k.enctype=!!y.createElement("form").enctype,c.disabled=!0,k.optDisabled=!e.disabled,a=y.createElement("input"),a.setAttribute("value",""),k.input=""===a.getAttribute("value"),a.value="t",a.setAttribute("type","radio"),k.radioValue="t"===a.value}();var lc=/\r/g;m.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=m.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,m(this).val()):a,null==e?e="":"number"==typeof e?e+="":m.isArray(e)&&(e=m.map(e,function(a){return null==a?"":a+""})),b=m.valHooks[this.type]||m.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=m.valHooks[e.type]||m.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(lc,""):null==c?"":c)}}}),m.extend({valHooks:{option:{get:function(a){var b=m.find.attr(a,"value");return null!=b?b:m.trim(m.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&m.nodeName(c.parentNode,"optgroup"))){if(b=m(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=m.makeArray(b),g=e.length;while(g--)if(d=e[g],m.inArray(m.valHooks.option.get(d),f)>=0)try{d.selected=c=!0}catch(h){d.scrollHeight}else d.selected=!1;return c||(a.selectedIndex=-1),e}}}}),m.each(["radio","checkbox"],function(){m.valHooks[this]={set:function(a,b){return m.isArray(b)?a.checked=m.inArray(m(a).val(),b)>=0:void 0}},k.checkOn||(m.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var mc,nc,oc=m.expr.attrHandle,pc=/^(?:checked|selected)$/i,qc=k.getSetAttribute,rc=k.input;m.fn.extend({attr:function(a,b){return V(this,m.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){m.removeAttr(this,a)})}}),m.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===K?m.prop(a,b,c):(1===f&&m.isXMLDoc(a)||(b=b.toLowerCase(),d=m.attrHooks[b]||(m.expr.match.bool.test(b)?nc:mc)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=m.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void m.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=m.propFix[c]||c,m.expr.match.bool.test(c)?rc&&qc||!pc.test(c)?a[d]=!1:a[m.camelCase("default-"+c)]=a[d]=!1:m.attr(a,c,""),a.removeAttribute(qc?c:d)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&m.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),nc={set:function(a,b,c){return b===!1?m.removeAttr(a,c):rc&&qc||!pc.test(c)?a.setAttribute(!qc&&m.propFix[c]||c,c):a[m.camelCase("default-"+c)]=a[c]=!0,c}},m.each(m.expr.match.bool.source.match(/\w+/g),function(a,b){var c=oc[b]||m.find.attr;oc[b]=rc&&qc||!pc.test(b)?function(a,b,d){var e,f;return d||(f=oc[b],oc[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,oc[b]=f),e}:function(a,b,c){return c?void 0:a[m.camelCase("default-"+b)]?b.toLowerCase():null}}),rc&&qc||(m.attrHooks.value={set:function(a,b,c){return m.nodeName(a,"input")?void(a.defaultValue=b):mc&&mc.set(a,b,c)}}),qc||(mc={set:function(a,b,c){var d=a.getAttributeNode(c);return d||a.setAttributeNode(d=a.ownerDocument.createAttribute(c)),d.value=b+="","value"===c||b===a.getAttribute(c)?b:void 0}},oc.id=oc.name=oc.coords=function(a,b,c){var d;return c?void 0:(d=a.getAttributeNode(b))&&""!==d.value?d.value:null},m.valHooks.button={get:function(a,b){var c=a.getAttributeNode(b);return c&&c.specified?c.value:void 0},set:mc.set},m.attrHooks.contenteditable={set:function(a,b,c){mc.set(a,""===b?!1:b,c)}},m.each(["width","height"],function(a,b){m.attrHooks[b]={set:function(a,c){return""===c?(a.setAttribute(b,"auto"),c):void 0}}})),k.style||(m.attrHooks.style={get:function(a){return a.style.cssText||void 0},set:function(a,b){return a.style.cssText=b+""}});var sc=/^(?:input|select|textarea|button|object)$/i,tc=/^(?:a|area)$/i;m.fn.extend({prop:function(a,b){return V(this,m.prop,a,b,arguments.length>1)},removeProp:function(a){return a=m.propFix[a]||a,this.each(function(){try{this[a]=void 0,delete this[a]}catch(b){}})}}),m.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!m.isXMLDoc(a),f&&(b=m.propFix[b]||b,e=m.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=m.find.attr(a,"tabindex");return b?parseInt(b,10):sc.test(a.nodeName)||tc.test(a.nodeName)&&a.href?0:-1}}}}),k.hrefNormalized||m.each(["href","src"],function(a,b){m.propHooks[b]={get:function(a){return a.getAttribute(b,4)}}}),k.optSelected||(m.propHooks.selected={get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}}),m.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){m.propFix[this.toLowerCase()]=this}),k.enctype||(m.propFix.enctype="encoding");var uc=/[\t\r\n\f]/g;m.fn.extend({addClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j="string"==typeof a&&a;if(m.isFunction(a))return this.each(function(b){m(this).addClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(E)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(uc," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=m.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j=0===arguments.length||"string"==typeof a&&a;if(m.isFunction(a))return this.each(function(b){m(this).removeClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(E)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(uc," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?m.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(m.isFunction(a)?function(c){m(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=m(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===K||"boolean"===c)&&(this.className&&m._data(this,"__className__",this.className),this.className=this.className||a===!1?"":m._data(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(uc," ").indexOf(b)>=0)return!0;return!1}}),m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){m.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),m.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var vc=m.now(),wc=/\?/,xc=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;m.parseJSON=function(b){if(a.JSON&&a.JSON.parse)return a.JSON.parse(b+"");var c,d=null,e=m.trim(b+"");return e&&!m.trim(e.replace(xc,function(a,b,e,f){return c&&b&&(d=0),0===d?a:(c=e||b,d+=!f-!e,"")}))?Function("return "+e)():m.error("Invalid JSON: "+b)},m.parseXML=function(b){var c,d;if(!b||"string"!=typeof b)return null;try{a.DOMParser?(d=new DOMParser,c=d.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b))}catch(e){c=void 0}return c&&c.documentElement&&!c.getElementsByTagName("parsererror").length||m.error("Invalid XML: "+b),c};var yc,zc,Ac=/#.*$/,Bc=/([?&])_=[^&]*/,Cc=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Dc=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Ec=/^(?:GET|HEAD)$/,Fc=/^\/\//,Gc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,Hc={},Ic={},Jc="*/".concat("*");try{zc=location.href}catch(Kc){zc=y.createElement("a"),zc.href="",zc=zc.href}yc=Gc.exec(zc.toLowerCase())||[];function Lc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(m.isFunction(c))while(d=f[e++])"+"===d.charAt(0)?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Mc(a,b,c,d){var e={},f=a===Ic;function g(h){var i;return e[h]=!0,m.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Nc(a,b){var c,d,e=m.ajaxSettings.flatOptions||{};for(d in b)void 0!==b[d]&&((e[d]?a:c||(c={}))[d]=b[d]);return c&&m.extend(!0,a,c),a}function Oc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===e&&(e=a.mimeType||b.getResponseHeader("Content-Type"));if(e)for(g in h)if(h[g]&&h[g].test(e)){i.unshift(g);break}if(i[0]in c)f=i[0];else{for(g in c){if(!i[0]||a.converters[g+" "+i[0]]){f=g;break}d||(d=g)}f=f||d}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Pc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}m.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:zc,type:"GET",isLocal:Dc.test(yc[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Jc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":m.parseJSON,"text xml":m.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Nc(Nc(a,m.ajaxSettings),b):Nc(m.ajaxSettings,a)},ajaxPrefilter:Lc(Hc),ajaxTransport:Lc(Ic),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=m.ajaxSetup({},b),l=k.context||k,n=k.context&&(l.nodeType||l.jquery)?m(l):m.event,o=m.Deferred(),p=m.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!j){j={};while(b=Cc.exec(f))j[b[1].toLowerCase()]=b[2]}b=j[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?f:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return i&&i.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||zc)+"").replace(Ac,"").replace(Fc,yc[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=m.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(c=Gc.exec(k.url.toLowerCase()),k.crossDomain=!(!c||c[1]===yc[1]&&c[2]===yc[2]&&(c[3]||("http:"===c[1]?"80":"443"))===(yc[3]||("http:"===yc[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=m.param(k.data,k.traditional)),Mc(Hc,k,b,v),2===t)return v;h=m.event&&k.global,h&&0===m.active++&&m.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!Ec.test(k.type),e=k.url,k.hasContent||(k.data&&(e=k.url+=(wc.test(e)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=Bc.test(e)?e.replace(Bc,"$1_="+vc++):e+(wc.test(e)?"&":"?")+"_="+vc++)),k.ifModified&&(m.lastModified[e]&&v.setRequestHeader("If-Modified-Since",m.lastModified[e]),m.etag[e]&&v.setRequestHeader("If-None-Match",m.etag[e])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+Jc+"; q=0.01":""):k.accepts["*"]);for(d in k.headers)v.setRequestHeader(d,k.headers[d]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(d in{success:1,error:1,complete:1})v[d](k[d]);if(i=Mc(Ic,k,b,v)){v.readyState=1,h&&n.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,i.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,c,d){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),i=void 0,f=d||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,c&&(u=Oc(k,v,c)),u=Pc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(m.lastModified[e]=w),w=v.getResponseHeader("etag"),w&&(m.etag[e]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,h&&n.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),h&&(n.trigger("ajaxComplete",[v,k]),--m.active||m.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return m.get(a,b,c,"json")},getScript:function(a,b){return m.get(a,void 0,b,"script")}}),m.each(["get","post"],function(a,b){m[b]=function(a,c,d,e){return m.isFunction(c)&&(e=e||d,d=c,c=void 0),m.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),m._evalUrl=function(a){return m.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},m.fn.extend({wrapAll:function(a){if(m.isFunction(a))return this.each(function(b){m(this).wrapAll(a.call(this,b))});if(this[0]){var b=m(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&1===a.firstChild.nodeType)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return this.each(m.isFunction(a)?function(b){m(this).wrapInner(a.call(this,b))}:function(){var b=m(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=m.isFunction(a);return this.each(function(c){m(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){m.nodeName(this,"body")||m(this).replaceWith(this.childNodes)}).end()}}),m.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0||!k.reliableHiddenOffsets()&&"none"===(a.style&&a.style.display||m.css(a,"display"))},m.expr.filters.visible=function(a){return!m.expr.filters.hidden(a)};var Qc=/%20/g,Rc=/\[\]$/,Sc=/\r?\n/g,Tc=/^(?:submit|button|image|reset|file)$/i,Uc=/^(?:input|select|textarea|keygen)/i;function Vc(a,b,c,d){var e;if(m.isArray(b))m.each(b,function(b,e){c||Rc.test(a)?d(a,e):Vc(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==m.type(b))d(a,b);else for(e in b)Vc(a+"["+e+"]",b[e],c,d)}m.param=function(a,b){var c,d=[],e=function(a,b){b=m.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=m.ajaxSettings&&m.ajaxSettings.traditional),m.isArray(a)||a.jquery&&!m.isPlainObject(a))m.each(a,function(){e(this.name,this.value)});else for(c in a)Vc(c,a[c],b,e);return d.join("&").replace(Qc,"+")},m.fn.extend({serialize:function(){return m.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=m.prop(this,"elements");return a?m.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!m(this).is(":disabled")&&Uc.test(this.nodeName)&&!Tc.test(a)&&(this.checked||!W.test(a))}).map(function(a,b){var c=m(this).val();return null==c?null:m.isArray(c)?m.map(c,function(a){return{name:b.name,value:a.replace(Sc,"\r\n")}}):{name:b.name,value:c.replace(Sc,"\r\n")}}).get()}}),m.ajaxSettings.xhr=void 0!==a.ActiveXObject?function(){return!this.isLocal&&/^(get|post|head|put|delete|options)$/i.test(this.type)&&Zc()||$c()}:Zc;var Wc=0,Xc={},Yc=m.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in Xc)Xc[a](void 0,!0)}),k.cors=!!Yc&&"withCredentials"in Yc,Yc=k.ajax=!!Yc,Yc&&m.ajaxTransport(function(a){if(!a.crossDomain||k.cors){var b;return{send:function(c,d){var e,f=a.xhr(),g=++Wc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)void 0!==c[e]&&f.setRequestHeader(e,c[e]+"");f.send(a.hasContent&&a.data||null),b=function(c,e){var h,i,j;if(b&&(e||4===f.readyState))if(delete Xc[g],b=void 0,f.onreadystatechange=m.noop,e)4!==f.readyState&&f.abort();else{j={},h=f.status,"string"==typeof f.responseText&&(j.text=f.responseText);try{i=f.statusText}catch(k){i=""}h||!a.isLocal||a.crossDomain?1223===h&&(h=204):h=j.text?200:404}j&&d(h,i,j,f.getAllResponseHeaders())},a.async?4===f.readyState?setTimeout(b):f.onreadystatechange=Xc[g]=b:b()},abort:function(){b&&b(void 0,!0)}}}});function Zc(){try{return new a.XMLHttpRequest}catch(b){}}function $c(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}m.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return m.globalEval(a),a}}}),m.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),m.ajaxTransport("script",function(a){if(a.crossDomain){var b,c=y.head||m("head")[0]||y.documentElement;return{send:function(d,e){b=y.createElement("script"),b.async=!0,a.scriptCharset&&(b.charset=a.scriptCharset),b.src=a.url,b.onload=b.onreadystatechange=function(a,c){(c||!b.readyState||/loaded|complete/.test(b.readyState))&&(b.onload=b.onreadystatechange=null,b.parentNode&&b.parentNode.removeChild(b),b=null,c||e(200,"success"))},c.insertBefore(b,c.firstChild)},abort:function(){b&&b.onload(void 0,!0)}}}});var _c=[],ad=/(=)\?(?=&|$)|\?\?/;m.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=_c.pop()||m.expando+"_"+vc++;return this[a]=!0,a}}),m.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(ad.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&ad.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=m.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(ad,"$1"+e):b.jsonp!==!1&&(b.url+=(wc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||m.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,_c.push(e)),g&&m.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),m.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||y;var d=u.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=m.buildFragment([a],b,e),e&&e.length&&m(e).remove(),m.merge([],d.childNodes))};var bd=m.fn.load;m.fn.load=function(a,b,c){if("string"!=typeof a&&bd)return bd.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=m.trim(a.slice(h,a.length)),a=a.slice(0,h)),m.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(f="POST"),g.length>0&&m.ajax({url:a,type:f,dataType:"html",data:b}).done(function(a){e=arguments,g.html(d?m("<div>").append(m.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,e||[a.responseText,b,a])}),this},m.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){m.fn[b]=function(a){return this.on(b,a)}}),m.expr.filters.animated=function(a){return m.grep(m.timers,function(b){return a===b.elem}).length};var cd=a.document.documentElement;function dd(a){return m.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}m.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=m.css(a,"position"),l=m(a),n={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=m.css(a,"top"),i=m.css(a,"left"),j=("absolute"===k||"fixed"===k)&&m.inArray("auto",[f,i])>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),m.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(n.top=b.top-h.top+g),null!=b.left&&(n.left=b.left-h.left+e),"using"in b?b.using.call(a,n):l.css(n)}},m.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){m.offset.setOffset(this,a,b)});var b,c,d={top:0,left:0},e=this[0],f=e&&e.ownerDocument;if(f)return b=f.documentElement,m.contains(b,e)?(typeof e.getBoundingClientRect!==K&&(d=e.getBoundingClientRect()),c=dd(f),{top:d.top+(c.pageYOffset||b.scrollTop)-(b.clientTop||0),left:d.left+(c.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}):d},position:function(){if(this[0]){var a,b,c={top:0,left:0},d=this[0];return"fixed"===m.css(d,"position")?b=d.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),m.nodeName(a[0],"html")||(c=a.offset()),c.top+=m.css(a[0],"borderTopWidth",!0),c.left+=m.css(a[0],"borderLeftWidth",!0)),{top:b.top-c.top-m.css(d,"marginTop",!0),left:b.left-c.left-m.css(d,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||cd;while(a&&!m.nodeName(a,"html")&&"static"===m.css(a,"position"))a=a.offsetParent;return a||cd})}}),m.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c=/Y/.test(b);m.fn[a]=function(d){return V(this,function(a,d,e){var f=dd(a);return void 0===e?f?b in f?f[b]:f.document.documentElement[d]:a[d]:void(f?f.scrollTo(c?m(f).scrollLeft():e,c?e:m(f).scrollTop()):a[d]=e)},a,d,arguments.length,null)}}),m.each(["top","left"],function(a,b){m.cssHooks[b]=Lb(k.pixelPosition,function(a,c){return c?(c=Jb(a,b),Hb.test(c)?m(a).position()[b]+"px":c):void 0})}),m.each({Height:"height",Width:"width"},function(a,b){m.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){m.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return V(this,function(b,c,d){var e;return m.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?m.css(b,c,g):m.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),m.fn.size=function(){return this.length},m.fn.andSelf=m.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return m});var ed=a.jQuery,fd=a.$;return m.noConflict=function(b){return a.$===m&&(a.$=fd),b&&a.jQuery===m&&(a.jQuery=ed),m},typeof b===K&&(a.jQuery=a.$=m),m});

/**
 * Lightbox v2.7.1
 * by Lokesh Dhakar - http://lokeshdhakar.com/projects/lightbox2/
 *
 * @license http://creativecommons.org/licenses/by/2.5/
 * - Free for use in both personal and commercial projects
 * - Attribution requires leaving author name, author link, and the license info intact
 */
(function(){var a=jQuery,b=function(){function a(){this.fadeDuration=500,this.fitImagesInViewport=!0,this.resizeDuration=700,this.positionFromTop=50,this.showImageNumberLabel=!0,this.alwaysShowNavOnTouchDevices=!1,this.wrapAround=!1}return a.prototype.albumLabel=function(a,b){return"Image "+a+" of "+b},a}(),c=function(){function b(a){this.options=a,this.album=[],this.currentImageIndex=void 0,this.init()}return b.prototype.init=function(){this.enable(),this.build()},b.prototype.enable=function(){var b=this;a("body").on("click","a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]",function(c){return b.start(a(c.currentTarget)),!1})},b.prototype.build=function(){var b=this;a("<div id='lightboxOverlay' class='lightboxOverlay'></div><div id='lightbox' class='lightbox'><div class='lb-outerContainer'><div class='lb-container'><img class='lb-image' src='' /><div class='lb-nav'><a class='lb-prev' href='' ></a><a class='lb-next' href='' ></a></div><div class='lb-loader'><a class='lb-cancel'></a></div></div></div><div class='lb-dataContainer'><div class='lb-data'><div class='lb-details'><span class='lb-caption'></span><span class='lb-number'></span></div><div class='lb-closeContainer'><a class='lb-close'></a></div></div></div></div>").appendTo(a("body")),this.$lightbox=a("#lightbox"),this.$overlay=a("#lightboxOverlay"),this.$outerContainer=this.$lightbox.find(".lb-outerContainer"),this.$container=this.$lightbox.find(".lb-container"),this.containerTopPadding=parseInt(this.$container.css("padding-top"),10),this.containerRightPadding=parseInt(this.$container.css("padding-right"),10),this.containerBottomPadding=parseInt(this.$container.css("padding-bottom"),10),this.containerLeftPadding=parseInt(this.$container.css("padding-left"),10),this.$overlay.hide().on("click",function(){return b.end(),!1}),this.$lightbox.hide().on("click",function(c){return"lightbox"===a(c.target).attr("id")&&b.end(),!1}),this.$outerContainer.on("click",function(c){return"lightbox"===a(c.target).attr("id")&&b.end(),!1}),this.$lightbox.find(".lb-prev").on("click",function(){return b.changeImage(0===b.currentImageIndex?b.album.length-1:b.currentImageIndex-1),!1}),this.$lightbox.find(".lb-next").on("click",function(){return b.changeImage(b.currentImageIndex===b.album.length-1?0:b.currentImageIndex+1),!1}),this.$lightbox.find(".lb-loader, .lb-close").on("click",function(){return b.end(),!1})},b.prototype.start=function(b){function c(a){d.album.push({link:a.attr("href"),title:a.attr("data-title")||a.attr("title")})}var d=this,e=a(window);e.on("resize",a.proxy(this.sizeOverlay,this)),a("select, object, embed").css({visibility:"hidden"}),this.sizeOverlay(),this.album=[];var f,g=0,h=b.attr("data-lightbox");if(h){f=a(b.prop("tagName")+'[data-lightbox="'+h+'"]');for(var i=0;i<f.length;i=++i)c(a(f[i])),f[i]===b[0]&&(g=i)}else if("lightbox"===b.attr("rel"))c(b);else{f=a(b.prop("tagName")+'[rel="'+b.attr("rel")+'"]');for(var j=0;j<f.length;j=++j)c(a(f[j])),f[j]===b[0]&&(g=j)}var k=e.scrollTop()+this.options.positionFromTop,l=e.scrollLeft();this.$lightbox.css({top:k+"px",left:l+"px"}).fadeIn(this.options.fadeDuration),this.changeImage(g)},b.prototype.changeImage=function(b){var c=this;this.disableKeyboardNav();var d=this.$lightbox.find(".lb-image");this.$overlay.fadeIn(this.options.fadeDuration),a(".lb-loader").fadeIn("slow"),this.$lightbox.find(".lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption").hide(),this.$outerContainer.addClass("animating");var e=new Image;e.onload=function(){var f,g,h,i,j,k,l;d.attr("src",c.album[b].link),f=a(e),d.width(e.width),d.height(e.height),c.options.fitImagesInViewport&&(l=a(window).width(),k=a(window).height(),j=l-c.containerLeftPadding-c.containerRightPadding-20,i=k-c.containerTopPadding-c.containerBottomPadding-120,(e.width>j||e.height>i)&&(e.width/j>e.height/i?(h=j,g=parseInt(e.height/(e.width/h),10),d.width(h),d.height(g)):(g=i,h=parseInt(e.width/(e.height/g),10),d.width(h),d.height(g)))),c.sizeContainer(d.width(),d.height())},e.src=this.album[b].link,this.currentImageIndex=b},b.prototype.sizeOverlay=function(){this.$overlay.width(a(window).width()).height(a(document).height())},b.prototype.sizeContainer=function(a,b){function c(){d.$lightbox.find(".lb-dataContainer").width(g),d.$lightbox.find(".lb-prevLink").height(h),d.$lightbox.find(".lb-nextLink").height(h),d.showImage()}var d=this,e=this.$outerContainer.outerWidth(),f=this.$outerContainer.outerHeight(),g=a+this.containerLeftPadding+this.containerRightPadding,h=b+this.containerTopPadding+this.containerBottomPadding;e!==g||f!==h?this.$outerContainer.animate({width:g,height:h},this.options.resizeDuration,"swing",function(){c()}):c()},b.prototype.showImage=function(){this.$lightbox.find(".lb-loader").hide(),this.$lightbox.find(".lb-image").fadeIn("slow"),this.updateNav(),this.updateDetails(),this.preloadNeighboringImages(),this.enableKeyboardNav()},b.prototype.updateNav=function(){var a=!1;try{document.createEvent("TouchEvent"),a=this.options.alwaysShowNavOnTouchDevices?!0:!1}catch(b){}this.$lightbox.find(".lb-nav").show(),this.album.length>1&&(this.options.wrapAround?(a&&this.$lightbox.find(".lb-prev, .lb-next").css("opacity","1"),this.$lightbox.find(".lb-prev, .lb-next").show()):(this.currentImageIndex>0&&(this.$lightbox.find(".lb-prev").show(),a&&this.$lightbox.find(".lb-prev").css("opacity","1")),this.currentImageIndex<this.album.length-1&&(this.$lightbox.find(".lb-next").show(),a&&this.$lightbox.find(".lb-next").css("opacity","1"))))},b.prototype.updateDetails=function(){var b=this;"undefined"!=typeof this.album[this.currentImageIndex].title&&""!==this.album[this.currentImageIndex].title&&this.$lightbox.find(".lb-caption").html(this.album[this.currentImageIndex].title).fadeIn("fast").find("a").on("click",function(){location.href=a(this).attr("href")}),this.album.length>1&&this.options.showImageNumberLabel?this.$lightbox.find(".lb-number").text(this.options.albumLabel(this.currentImageIndex+1,this.album.length)).fadeIn("fast"):this.$lightbox.find(".lb-number").hide(),this.$outerContainer.removeClass("animating"),this.$lightbox.find(".lb-dataContainer").fadeIn(this.options.resizeDuration,function(){return b.sizeOverlay()})},b.prototype.preloadNeighboringImages=function(){if(this.album.length>this.currentImageIndex+1){var a=new Image;a.src=this.album[this.currentImageIndex+1].link}if(this.currentImageIndex>0){var b=new Image;b.src=this.album[this.currentImageIndex-1].link}},b.prototype.enableKeyboardNav=function(){a(document).on("keyup.keyboard",a.proxy(this.keyboardAction,this))},b.prototype.disableKeyboardNav=function(){a(document).off(".keyboard")},b.prototype.keyboardAction=function(a){var b=27,c=37,d=39,e=a.keyCode,f=String.fromCharCode(e).toLowerCase();e===b||f.match(/x|o|c/)?this.end():"p"===f||e===c?0!==this.currentImageIndex?this.changeImage(this.currentImageIndex-1):this.options.wrapAround&&this.album.length>1&&this.changeImage(this.album.length-1):("n"===f||e===d)&&(this.currentImageIndex!==this.album.length-1?this.changeImage(this.currentImageIndex+1):this.options.wrapAround&&this.album.length>1&&this.changeImage(0))},b.prototype.end=function(){this.disableKeyboardNav(),a(window).off("resize",this.sizeOverlay),this.$lightbox.fadeOut(this.options.fadeDuration),this.$overlay.fadeOut(this.options.fadeDuration),a("select, object, embed").css({visibility:"visible"})},b}();a(function(){{var a=new b;new c(a)}})}).call(this);

//! moment.js
//! version : 2.9.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
(function(a){function b(a,b,c){switch(arguments.length){case 2:return null!=a?a:b;case 3:return null!=a?a:null!=b?b:c;default:throw new Error("Implement me")}}function c(a,b){return Bb.call(a,b)}function d(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function e(a){vb.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+a)}function f(a,b){var c=!0;return o(function(){return c&&(e(a),c=!1),b.apply(this,arguments)},b)}function g(a,b){sc[a]||(e(b),sc[a]=!0)}function h(a,b){return function(c){return r(a.call(this,c),b)}}function i(a,b){return function(c){return this.localeData().ordinal(a.call(this,c),b)}}function j(a,b){var c,d,e=12*(b.year()-a.year())+(b.month()-a.month()),f=a.clone().add(e,"months");return 0>b-f?(c=a.clone().add(e-1,"months"),d=(b-f)/(f-c)):(c=a.clone().add(e+1,"months"),d=(b-f)/(c-f)),-(e+d)}function k(a,b,c){var d;return null==c?b:null!=a.meridiemHour?a.meridiemHour(b,c):null!=a.isPM?(d=a.isPM(c),d&&12>b&&(b+=12),d||12!==b||(b=0),b):b}function l(){}function m(a,b){b!==!1&&H(a),p(this,a),this._d=new Date(+a._d),uc===!1&&(uc=!0,vb.updateOffset(this),uc=!1)}function n(a){var b=A(a),c=b.year||0,d=b.quarter||0,e=b.month||0,f=b.week||0,g=b.day||0,h=b.hour||0,i=b.minute||0,j=b.second||0,k=b.millisecond||0;this._milliseconds=+k+1e3*j+6e4*i+36e5*h,this._days=+g+7*f,this._months=+e+3*d+12*c,this._data={},this._locale=vb.localeData(),this._bubble()}function o(a,b){for(var d in b)c(b,d)&&(a[d]=b[d]);return c(b,"toString")&&(a.toString=b.toString),c(b,"valueOf")&&(a.valueOf=b.valueOf),a}function p(a,b){var c,d,e;if("undefined"!=typeof b._isAMomentObject&&(a._isAMomentObject=b._isAMomentObject),"undefined"!=typeof b._i&&(a._i=b._i),"undefined"!=typeof b._f&&(a._f=b._f),"undefined"!=typeof b._l&&(a._l=b._l),"undefined"!=typeof b._strict&&(a._strict=b._strict),"undefined"!=typeof b._tzm&&(a._tzm=b._tzm),"undefined"!=typeof b._isUTC&&(a._isUTC=b._isUTC),"undefined"!=typeof b._offset&&(a._offset=b._offset),"undefined"!=typeof b._pf&&(a._pf=b._pf),"undefined"!=typeof b._locale&&(a._locale=b._locale),Kb.length>0)for(c in Kb)d=Kb[c],e=b[d],"undefined"!=typeof e&&(a[d]=e);return a}function q(a){return 0>a?Math.ceil(a):Math.floor(a)}function r(a,b,c){for(var d=""+Math.abs(a),e=a>=0;d.length<b;)d="0"+d;return(e?c?"+":"":"-")+d}function s(a,b){var c={milliseconds:0,months:0};return c.months=b.month()-a.month()+12*(b.year()-a.year()),a.clone().add(c.months,"M").isAfter(b)&&--c.months,c.milliseconds=+b-+a.clone().add(c.months,"M"),c}function t(a,b){var c;return b=M(b,a),a.isBefore(b)?c=s(a,b):(c=s(b,a),c.milliseconds=-c.milliseconds,c.months=-c.months),c}function u(a,b){return function(c,d){var e,f;return null===d||isNaN(+d)||(g(b,"moment()."+b+"(period, number) is deprecated. Please use moment()."+b+"(number, period)."),f=c,c=d,d=f),c="string"==typeof c?+c:c,e=vb.duration(c,d),v(this,e,a),this}}function v(a,b,c,d){var e=b._milliseconds,f=b._days,g=b._months;d=null==d?!0:d,e&&a._d.setTime(+a._d+e*c),f&&pb(a,"Date",ob(a,"Date")+f*c),g&&nb(a,ob(a,"Month")+g*c),d&&vb.updateOffset(a,f||g)}function w(a){return"[object Array]"===Object.prototype.toString.call(a)}function x(a){return"[object Date]"===Object.prototype.toString.call(a)||a instanceof Date}function y(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&C(a[d])!==C(b[d]))&&g++;return g+f}function z(a){if(a){var b=a.toLowerCase().replace(/(.)s$/,"$1");a=lc[a]||mc[b]||b}return a}function A(a){var b,d,e={};for(d in a)c(a,d)&&(b=z(d),b&&(e[b]=a[d]));return e}function B(b){var c,d;if(0===b.indexOf("week"))c=7,d="day";else{if(0!==b.indexOf("month"))return;c=12,d="month"}vb[b]=function(e,f){var g,h,i=vb._locale[b],j=[];if("number"==typeof e&&(f=e,e=a),h=function(a){var b=vb().utc().set(d,a);return i.call(vb._locale,b,e||"")},null!=f)return h(f);for(g=0;c>g;g++)j.push(h(g));return j}}function C(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=b>=0?Math.floor(b):Math.ceil(b)),c}function D(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function E(a,b,c){return jb(vb([a,11,31+b-c]),b,c).week}function F(a){return G(a)?366:365}function G(a){return a%4===0&&a%100!==0||a%400===0}function H(a){var b;a._a&&-2===a._pf.overflow&&(b=a._a[Db]<0||a._a[Db]>11?Db:a._a[Eb]<1||a._a[Eb]>D(a._a[Cb],a._a[Db])?Eb:a._a[Fb]<0||a._a[Fb]>24||24===a._a[Fb]&&(0!==a._a[Gb]||0!==a._a[Hb]||0!==a._a[Ib])?Fb:a._a[Gb]<0||a._a[Gb]>59?Gb:a._a[Hb]<0||a._a[Hb]>59?Hb:a._a[Ib]<0||a._a[Ib]>999?Ib:-1,a._pf._overflowDayOfYear&&(Cb>b||b>Eb)&&(b=Eb),a._pf.overflow=b)}function I(b){return null==b._isValid&&(b._isValid=!isNaN(b._d.getTime())&&b._pf.overflow<0&&!b._pf.empty&&!b._pf.invalidMonth&&!b._pf.nullInput&&!b._pf.invalidFormat&&!b._pf.userInvalidated,b._strict&&(b._isValid=b._isValid&&0===b._pf.charsLeftOver&&0===b._pf.unusedTokens.length&&b._pf.bigHour===a)),b._isValid}function J(a){return a?a.toLowerCase().replace("_","-"):a}function K(a){for(var b,c,d,e,f=0;f<a.length;){for(e=J(a[f]).split("-"),b=e.length,c=J(a[f+1]),c=c?c.split("-"):null;b>0;){if(d=L(e.slice(0,b).join("-")))return d;if(c&&c.length>=b&&y(e,c,!0)>=b-1)break;b--}f++}return null}function L(a){var b=null;if(!Jb[a]&&Lb)try{b=vb.locale(),require("./locale/"+a),vb.locale(b)}catch(c){}return Jb[a]}function M(a,b){var c,d;return b._isUTC?(c=b.clone(),d=(vb.isMoment(a)||x(a)?+a:+vb(a))-+c,c._d.setTime(+c._d+d),vb.updateOffset(c,!1),c):vb(a).local()}function N(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function O(a){var b,c,d=a.match(Pb);for(b=0,c=d.length;c>b;b++)d[b]=rc[d[b]]?rc[d[b]]:N(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function P(a,b){return a.isValid()?(b=Q(b,a.localeData()),nc[b]||(nc[b]=O(b)),nc[b](a)):a.localeData().invalidDate()}function Q(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(Qb.lastIndex=0;d>=0&&Qb.test(a);)a=a.replace(Qb,c),Qb.lastIndex=0,d-=1;return a}function R(a,b){var c,d=b._strict;switch(a){case"Q":return _b;case"DDDD":return bc;case"YYYY":case"GGGG":case"gggg":return d?cc:Tb;case"Y":case"G":case"g":return ec;case"YYYYYY":case"YYYYY":case"GGGGG":case"ggggg":return d?dc:Ub;case"S":if(d)return _b;case"SS":if(d)return ac;case"SSS":if(d)return bc;case"DDD":return Sb;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return Wb;case"a":case"A":return b._locale._meridiemParse;case"x":return Zb;case"X":return $b;case"Z":case"ZZ":return Xb;case"T":return Yb;case"SSSS":return Vb;case"MM":case"DD":case"YY":case"GG":case"gg":case"HH":case"hh":case"mm":case"ss":case"ww":case"WW":return d?ac:Rb;case"M":case"D":case"d":case"H":case"h":case"m":case"s":case"w":case"W":case"e":case"E":return Rb;case"Do":return d?b._locale._ordinalParse:b._locale._ordinalParseLenient;default:return c=new RegExp($(Z(a.replace("\\","")),"i"))}}function S(a){a=a||"";var b=a.match(Xb)||[],c=b[b.length-1]||[],d=(c+"").match(jc)||["-",0,0],e=+(60*d[1])+C(d[2]);return"+"===d[0]?e:-e}function T(a,b,c){var d,e=c._a;switch(a){case"Q":null!=b&&(e[Db]=3*(C(b)-1));break;case"M":case"MM":null!=b&&(e[Db]=C(b)-1);break;case"MMM":case"MMMM":d=c._locale.monthsParse(b,a,c._strict),null!=d?e[Db]=d:c._pf.invalidMonth=b;break;case"D":case"DD":null!=b&&(e[Eb]=C(b));break;case"Do":null!=b&&(e[Eb]=C(parseInt(b.match(/\d{1,2}/)[0],10)));break;case"DDD":case"DDDD":null!=b&&(c._dayOfYear=C(b));break;case"YY":e[Cb]=vb.parseTwoDigitYear(b);break;case"YYYY":case"YYYYY":case"YYYYYY":e[Cb]=C(b);break;case"a":case"A":c._meridiem=b;break;case"h":case"hh":c._pf.bigHour=!0;case"H":case"HH":e[Fb]=C(b);break;case"m":case"mm":e[Gb]=C(b);break;case"s":case"ss":e[Hb]=C(b);break;case"S":case"SS":case"SSS":case"SSSS":e[Ib]=C(1e3*("0."+b));break;case"x":c._d=new Date(C(b));break;case"X":c._d=new Date(1e3*parseFloat(b));break;case"Z":case"ZZ":c._useUTC=!0,c._tzm=S(b);break;case"dd":case"ddd":case"dddd":d=c._locale.weekdaysParse(b),null!=d?(c._w=c._w||{},c._w.d=d):c._pf.invalidWeekday=b;break;case"w":case"ww":case"W":case"WW":case"d":case"e":case"E":a=a.substr(0,1);case"gggg":case"GGGG":case"GGGGG":a=a.substr(0,2),b&&(c._w=c._w||{},c._w[a]=C(b));break;case"gg":case"GG":c._w=c._w||{},c._w[a]=vb.parseTwoDigitYear(b)}}function U(a){var c,d,e,f,g,h,i;c=a._w,null!=c.GG||null!=c.W||null!=c.E?(g=1,h=4,d=b(c.GG,a._a[Cb],jb(vb(),1,4).year),e=b(c.W,1),f=b(c.E,1)):(g=a._locale._week.dow,h=a._locale._week.doy,d=b(c.gg,a._a[Cb],jb(vb(),g,h).year),e=b(c.w,1),null!=c.d?(f=c.d,g>f&&++e):f=null!=c.e?c.e+g:g),i=kb(d,e,f,h,g),a._a[Cb]=i.year,a._dayOfYear=i.dayOfYear}function V(a){var c,d,e,f,g=[];if(!a._d){for(e=X(a),a._w&&null==a._a[Eb]&&null==a._a[Db]&&U(a),a._dayOfYear&&(f=b(a._a[Cb],e[Cb]),a._dayOfYear>F(f)&&(a._pf._overflowDayOfYear=!0),d=fb(f,0,a._dayOfYear),a._a[Db]=d.getUTCMonth(),a._a[Eb]=d.getUTCDate()),c=0;3>c&&null==a._a[c];++c)a._a[c]=g[c]=e[c];for(;7>c;c++)a._a[c]=g[c]=null==a._a[c]?2===c?1:0:a._a[c];24===a._a[Fb]&&0===a._a[Gb]&&0===a._a[Hb]&&0===a._a[Ib]&&(a._nextDay=!0,a._a[Fb]=0),a._d=(a._useUTC?fb:eb).apply(null,g),null!=a._tzm&&a._d.setUTCMinutes(a._d.getUTCMinutes()-a._tzm),a._nextDay&&(a._a[Fb]=24)}}function W(a){var b;a._d||(b=A(a._i),a._a=[b.year,b.month,b.day||b.date,b.hour,b.minute,b.second,b.millisecond],V(a))}function X(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function Y(b){if(b._f===vb.ISO_8601)return void ab(b);b._a=[],b._pf.empty=!0;var c,d,e,f,g,h=""+b._i,i=h.length,j=0;for(e=Q(b._f,b._locale).match(Pb)||[],c=0;c<e.length;c++)f=e[c],d=(h.match(R(f,b))||[])[0],d&&(g=h.substr(0,h.indexOf(d)),g.length>0&&b._pf.unusedInput.push(g),h=h.slice(h.indexOf(d)+d.length),j+=d.length),rc[f]?(d?b._pf.empty=!1:b._pf.unusedTokens.push(f),T(f,d,b)):b._strict&&!d&&b._pf.unusedTokens.push(f);b._pf.charsLeftOver=i-j,h.length>0&&b._pf.unusedInput.push(h),b._pf.bigHour===!0&&b._a[Fb]<=12&&(b._pf.bigHour=a),b._a[Fb]=k(b._locale,b._a[Fb],b._meridiem),V(b),H(b)}function Z(a){return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e})}function $(a){return a.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function _(a){var b,c,e,f,g;if(0===a._f.length)return a._pf.invalidFormat=!0,void(a._d=new Date(0/0));for(f=0;f<a._f.length;f++)g=0,b=p({},a),null!=a._useUTC&&(b._useUTC=a._useUTC),b._pf=d(),b._f=a._f[f],Y(b),I(b)&&(g+=b._pf.charsLeftOver,g+=10*b._pf.unusedTokens.length,b._pf.score=g,(null==e||e>g)&&(e=g,c=b));o(a,c||b)}function ab(a){var b,c,d=a._i,e=fc.exec(d);if(e){for(a._pf.iso=!0,b=0,c=hc.length;c>b;b++)if(hc[b][1].exec(d)){a._f=hc[b][0]+(e[6]||" ");break}for(b=0,c=ic.length;c>b;b++)if(ic[b][1].exec(d)){a._f+=ic[b][0];break}d.match(Xb)&&(a._f+="Z"),Y(a)}else a._isValid=!1}function bb(a){ab(a),a._isValid===!1&&(delete a._isValid,vb.createFromInputFallback(a))}function cb(a,b){var c,d=[];for(c=0;c<a.length;++c)d.push(b(a[c],c));return d}function db(b){var c,d=b._i;d===a?b._d=new Date:x(d)?b._d=new Date(+d):null!==(c=Mb.exec(d))?b._d=new Date(+c[1]):"string"==typeof d?bb(b):w(d)?(b._a=cb(d.slice(0),function(a){return parseInt(a,10)}),V(b)):"object"==typeof d?W(b):"number"==typeof d?b._d=new Date(d):vb.createFromInputFallback(b)}function eb(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return 1970>a&&h.setFullYear(a),h}function fb(a){var b=new Date(Date.UTC.apply(null,arguments));return 1970>a&&b.setUTCFullYear(a),b}function gb(a,b){if("string"==typeof a)if(isNaN(a)){if(a=b.weekdaysParse(a),"number"!=typeof a)return null}else a=parseInt(a,10);return a}function hb(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function ib(a,b,c){var d=vb.duration(a).abs(),e=Ab(d.as("s")),f=Ab(d.as("m")),g=Ab(d.as("h")),h=Ab(d.as("d")),i=Ab(d.as("M")),j=Ab(d.as("y")),k=e<oc.s&&["s",e]||1===f&&["m"]||f<oc.m&&["mm",f]||1===g&&["h"]||g<oc.h&&["hh",g]||1===h&&["d"]||h<oc.d&&["dd",h]||1===i&&["M"]||i<oc.M&&["MM",i]||1===j&&["y"]||["yy",j];return k[2]=b,k[3]=+a>0,k[4]=c,hb.apply({},k)}function jb(a,b,c){var d,e=c-b,f=c-a.day();return f>e&&(f-=7),e-7>f&&(f+=7),d=vb(a).add(f,"d"),{week:Math.ceil(d.dayOfYear()/7),year:d.year()}}function kb(a,b,c,d,e){var f,g,h=fb(a,0,1).getUTCDay();return h=0===h?7:h,c=null!=c?c:e,f=e-h+(h>d?7:0)-(e>h?7:0),g=7*(b-1)+(c-e)+f+1,{year:g>0?a:a-1,dayOfYear:g>0?g:F(a-1)+g}}function lb(b){var c,d=b._i,e=b._f;return b._locale=b._locale||vb.localeData(b._l),null===d||e===a&&""===d?vb.invalid({nullInput:!0}):("string"==typeof d&&(b._i=d=b._locale.preparse(d)),vb.isMoment(d)?new m(d,!0):(e?w(e)?_(b):Y(b):db(b),c=new m(b),c._nextDay&&(c.add(1,"d"),c._nextDay=a),c))}function mb(a,b){var c,d;if(1===b.length&&w(b[0])&&(b=b[0]),!b.length)return vb();for(c=b[0],d=1;d<b.length;++d)b[d][a](c)&&(c=b[d]);return c}function nb(a,b){var c;return"string"==typeof b&&(b=a.localeData().monthsParse(b),"number"!=typeof b)?a:(c=Math.min(a.date(),D(a.year(),b)),a._d["set"+(a._isUTC?"UTC":"")+"Month"](b,c),a)}function ob(a,b){return a._d["get"+(a._isUTC?"UTC":"")+b]()}function pb(a,b,c){return"Month"===b?nb(a,c):a._d["set"+(a._isUTC?"UTC":"")+b](c)}function qb(a,b){return function(c){return null!=c?(pb(this,a,c),vb.updateOffset(this,b),this):ob(this,a)}}function rb(a){return 400*a/146097}function sb(a){return 146097*a/400}function tb(a){vb.duration.fn[a]=function(){return this._data[a]}}function ub(a){"undefined"==typeof ender&&(wb=zb.moment,zb.moment=a?f("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.",vb):vb)}for(var vb,wb,xb,yb="2.9.0",zb="undefined"==typeof global||"undefined"!=typeof window&&window!==global.window?this:global,Ab=Math.round,Bb=Object.prototype.hasOwnProperty,Cb=0,Db=1,Eb=2,Fb=3,Gb=4,Hb=5,Ib=6,Jb={},Kb=[],Lb="undefined"!=typeof module&&module&&module.exports,Mb=/^\/?Date\((\-?\d+)/i,Nb=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,Ob=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,Pb=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,Qb=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,Rb=/\d\d?/,Sb=/\d{1,3}/,Tb=/\d{1,4}/,Ub=/[+\-]?\d{1,6}/,Vb=/\d+/,Wb=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,Xb=/Z|[\+\-]\d\d:?\d\d/gi,Yb=/T/i,Zb=/[\+\-]?\d+/,$b=/[\+\-]?\d+(\.\d{1,3})?/,_b=/\d/,ac=/\d\d/,bc=/\d{3}/,cc=/\d{4}/,dc=/[+-]?\d{6}/,ec=/[+-]?\d+/,fc=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,gc="YYYY-MM-DDTHH:mm:ssZ",hc=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],ic=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],jc=/([\+\-]|\d\d)/gi,kc=("Date|Hours|Minutes|Seconds|Milliseconds".split("|"),{Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6}),lc={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",Q:"quarter",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},mc={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},nc={},oc={s:45,m:45,h:22,d:26,M:11},pc="DDD w W M D d".split(" "),qc="M D H h m s w W".split(" "),rc={M:function(){return this.month()+1},MMM:function(a){return this.localeData().monthsShort(this,a)},MMMM:function(a){return this.localeData().months(this,a)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(a){return this.localeData().weekdaysMin(this,a)},ddd:function(a){return this.localeData().weekdaysShort(this,a)},dddd:function(a){return this.localeData().weekdays(this,a)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return r(this.year()%100,2)},YYYY:function(){return r(this.year(),4)},YYYYY:function(){return r(this.year(),5)},YYYYYY:function(){var a=this.year(),b=a>=0?"+":"-";return b+r(Math.abs(a),6)},gg:function(){return r(this.weekYear()%100,2)},gggg:function(){return r(this.weekYear(),4)},ggggg:function(){return r(this.weekYear(),5)},GG:function(){return r(this.isoWeekYear()%100,2)},GGGG:function(){return r(this.isoWeekYear(),4)},GGGGG:function(){return r(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.localeData().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.localeData().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return C(this.milliseconds()/100)},SS:function(){return r(C(this.milliseconds()/10),2)},SSS:function(){return r(this.milliseconds(),3)},SSSS:function(){return r(this.milliseconds(),3)},Z:function(){var a=this.utcOffset(),b="+";return 0>a&&(a=-a,b="-"),b+r(C(a/60),2)+":"+r(C(a)%60,2)},ZZ:function(){var a=this.utcOffset(),b="+";return 0>a&&(a=-a,b="-"),b+r(C(a/60),2)+r(C(a)%60,2)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},x:function(){return this.valueOf()},X:function(){return this.unix()},Q:function(){return this.quarter()}},sc={},tc=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"],uc=!1;pc.length;)xb=pc.pop(),rc[xb+"o"]=i(rc[xb],xb);for(;qc.length;)xb=qc.pop(),rc[xb+xb]=h(rc[xb],2);rc.DDDD=h(rc.DDD,3),o(l.prototype,{set:function(a){var b,c;for(c in a)b=a[c],"function"==typeof b?this[c]=b:this["_"+c]=b;this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(a){return this._months[a.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(a){return this._monthsShort[a.month()]},monthsParse:function(a,b,c){var d,e,f;for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),d=0;12>d;d++){if(e=vb.utc([2e3,d]),c&&!this._longMonthsParse[d]&&(this._longMonthsParse[d]=new RegExp("^"+this.months(e,"").replace(".","")+"$","i"),this._shortMonthsParse[d]=new RegExp("^"+this.monthsShort(e,"").replace(".","")+"$","i")),c||this._monthsParse[d]||(f="^"+this.months(e,"")+"|^"+this.monthsShort(e,""),this._monthsParse[d]=new RegExp(f.replace(".",""),"i")),c&&"MMMM"===b&&this._longMonthsParse[d].test(a))return d;if(c&&"MMM"===b&&this._shortMonthsParse[d].test(a))return d;if(!c&&this._monthsParse[d].test(a))return d}},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(a){return this._weekdays[a.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(a){return this._weekdaysShort[a.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(a){return this._weekdaysMin[a.day()]},weekdaysParse:function(a){var b,c,d;for(this._weekdaysParse||(this._weekdaysParse=[]),b=0;7>b;b++)if(this._weekdaysParse[b]||(c=vb([2e3,1]).day(b),d="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,""),this._weekdaysParse[b]=new RegExp(d.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b},_longDateFormat:{LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM D, YYYY LT"},longDateFormat:function(a){var b=this._longDateFormat[a];return!b&&this._longDateFormat[a.toUpperCase()]&&(b=this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a]=b),b},isPM:function(a){return"p"===(a+"").toLowerCase().charAt(0)},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(a,b,c){var d=this._calendar[a];return"function"==typeof d?d.apply(b,[c]):d},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(a,b,c,d){var e=this._relativeTime[c];return"function"==typeof e?e(a,b,c,d):e.replace(/%d/i,a)},pastFuture:function(a,b){var c=this._relativeTime[a>0?"future":"past"];return"function"==typeof c?c(b):c.replace(/%s/i,b)},ordinal:function(a){return this._ordinal.replace("%d",a)},_ordinal:"%d",_ordinalParse:/\d{1,2}/,preparse:function(a){return a},postformat:function(a){return a},week:function(a){return jb(a,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6},firstDayOfWeek:function(){return this._week.dow},firstDayOfYear:function(){return this._week.doy},_invalidDate:"Invalid date",invalidDate:function(){return this._invalidDate}}),vb=function(b,c,e,f){var g;return"boolean"==typeof e&&(f=e,e=a),g={},g._isAMomentObject=!0,g._i=b,g._f=c,g._l=e,g._strict=f,g._isUTC=!1,g._pf=d(),lb(g)},vb.suppressDeprecationWarnings=!1,vb.createFromInputFallback=f("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(a){a._d=new Date(a._i+(a._useUTC?" UTC":""))}),vb.min=function(){var a=[].slice.call(arguments,0);return mb("isBefore",a)},vb.max=function(){var a=[].slice.call(arguments,0);return mb("isAfter",a)},vb.utc=function(b,c,e,f){var g;return"boolean"==typeof e&&(f=e,e=a),g={},g._isAMomentObject=!0,g._useUTC=!0,g._isUTC=!0,g._l=e,g._i=b,g._f=c,g._strict=f,g._pf=d(),lb(g).utc()},vb.unix=function(a){return vb(1e3*a)},vb.duration=function(a,b){var d,e,f,g,h=a,i=null;return vb.isDuration(a)?h={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(h={},b?h[b]=a:h.milliseconds=a):(i=Nb.exec(a))?(d="-"===i[1]?-1:1,h={y:0,d:C(i[Eb])*d,h:C(i[Fb])*d,m:C(i[Gb])*d,s:C(i[Hb])*d,ms:C(i[Ib])*d}):(i=Ob.exec(a))?(d="-"===i[1]?-1:1,f=function(a){var b=a&&parseFloat(a.replace(",","."));return(isNaN(b)?0:b)*d},h={y:f(i[2]),M:f(i[3]),d:f(i[4]),h:f(i[5]),m:f(i[6]),s:f(i[7]),w:f(i[8])}):null==h?h={}:"object"==typeof h&&("from"in h||"to"in h)&&(g=t(vb(h.from),vb(h.to)),h={},h.ms=g.milliseconds,h.M=g.months),e=new n(h),vb.isDuration(a)&&c(a,"_locale")&&(e._locale=a._locale),e},vb.version=yb,vb.defaultFormat=gc,vb.ISO_8601=function(){},vb.momentProperties=Kb,vb.updateOffset=function(){},vb.relativeTimeThreshold=function(b,c){return oc[b]===a?!1:c===a?oc[b]:(oc[b]=c,!0)},vb.lang=f("moment.lang is deprecated. Use moment.locale instead.",function(a,b){return vb.locale(a,b)}),vb.locale=function(a,b){var c;return a&&(c="undefined"!=typeof b?vb.defineLocale(a,b):vb.localeData(a),c&&(vb.duration._locale=vb._locale=c)),vb._locale._abbr},vb.defineLocale=function(a,b){return null!==b?(b.abbr=a,Jb[a]||(Jb[a]=new l),Jb[a].set(b),vb.locale(a),Jb[a]):(delete Jb[a],null)},vb.langData=f("moment.langData is deprecated. Use moment.localeData instead.",function(a){return vb.localeData(a)}),vb.localeData=function(a){var b;if(a&&a._locale&&a._locale._abbr&&(a=a._locale._abbr),!a)return vb._locale;if(!w(a)){if(b=L(a))return b;a=[a]}return K(a)},vb.isMoment=function(a){return a instanceof m||null!=a&&c(a,"_isAMomentObject")},vb.isDuration=function(a){return a instanceof n};for(xb=tc.length-1;xb>=0;--xb)B(tc[xb]);vb.normalizeUnits=function(a){return z(a)},vb.invalid=function(a){var b=vb.utc(0/0);return null!=a?o(b._pf,a):b._pf.userInvalidated=!0,b},vb.parseZone=function(){return vb.apply(null,arguments).parseZone()},vb.parseTwoDigitYear=function(a){return C(a)+(C(a)>68?1900:2e3)},vb.isDate=x,o(vb.fn=m.prototype,{clone:function(){return vb(this)},valueOf:function(){return+this._d-6e4*(this._offset||0)},unix:function(){return Math.floor(+this/1e3)},toString:function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){var a=vb(this).utc();return 0<a.year()&&a.year()<=9999?"function"==typeof Date.prototype.toISOString?this.toDate().toISOString():P(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):P(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var a=this;return[a.year(),a.month(),a.date(),a.hours(),a.minutes(),a.seconds(),a.milliseconds()]},isValid:function(){return I(this)},isDSTShifted:function(){return this._a?this.isValid()&&y(this._a,(this._isUTC?vb.utc(this._a):vb(this._a)).toArray())>0:!1},parsingFlags:function(){return o({},this._pf)},invalidAt:function(){return this._pf.overflow},utc:function(a){return this.utcOffset(0,a)},local:function(a){return this._isUTC&&(this.utcOffset(0,a),this._isUTC=!1,a&&this.subtract(this._dateUtcOffset(),"m")),this},format:function(a){var b=P(this,a||vb.defaultFormat);return this.localeData().postformat(b)},add:u(1,"add"),subtract:u(-1,"subtract"),diff:function(a,b,c){var d,e,f=M(a,this),g=6e4*(f.utcOffset()-this.utcOffset());return b=z(b),"year"===b||"month"===b||"quarter"===b?(e=j(this,f),"quarter"===b?e/=3:"year"===b&&(e/=12)):(d=this-f,e="second"===b?d/1e3:"minute"===b?d/6e4:"hour"===b?d/36e5:"day"===b?(d-g)/864e5:"week"===b?(d-g)/6048e5:d),c?e:q(e)},from:function(a,b){return vb.duration({to:this,from:a}).locale(this.locale()).humanize(!b)},fromNow:function(a){return this.from(vb(),a)},calendar:function(a){var b=a||vb(),c=M(b,this).startOf("day"),d=this.diff(c,"days",!0),e=-6>d?"sameElse":-1>d?"lastWeek":0>d?"lastDay":1>d?"sameDay":2>d?"nextDay":7>d?"nextWeek":"sameElse";return this.format(this.localeData().calendar(e,this,vb(b)))},isLeapYear:function(){return G(this.year())},isDST:function(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=gb(a,this.localeData()),this.add(a-b,"d")):b},month:qb("Month",!0),startOf:function(a){switch(a=z(a)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a?this.weekday(0):"isoWeek"===a&&this.isoWeekday(1),"quarter"===a&&this.month(3*Math.floor(this.month()/3)),this},endOf:function(b){return b=z(b),b===a||"millisecond"===b?this:this.startOf(b).add(1,"isoWeek"===b?"week":b).subtract(1,"ms")},isAfter:function(a,b){var c;return b=z("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=vb.isMoment(a)?a:vb(a),+this>+a):(c=vb.isMoment(a)?+a:+vb(a),c<+this.clone().startOf(b))},isBefore:function(a,b){var c;return b=z("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=vb.isMoment(a)?a:vb(a),+a>+this):(c=vb.isMoment(a)?+a:+vb(a),+this.clone().endOf(b)<c)},isBetween:function(a,b,c){return this.isAfter(a,c)&&this.isBefore(b,c)},isSame:function(a,b){var c;return b=z(b||"millisecond"),"millisecond"===b?(a=vb.isMoment(a)?a:vb(a),+this===+a):(c=+vb(a),+this.clone().startOf(b)<=c&&c<=+this.clone().endOf(b))},min:f("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(a){return a=vb.apply(null,arguments),this>a?this:a}),max:f("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(a){return a=vb.apply(null,arguments),a>this?this:a}),zone:f("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779",function(a,b){return null!=a?("string"!=typeof a&&(a=-a),this.utcOffset(a,b),this):-this.utcOffset()}),utcOffset:function(a,b){var c,d=this._offset||0;return null!=a?("string"==typeof a&&(a=S(a)),Math.abs(a)<16&&(a=60*a),!this._isUTC&&b&&(c=this._dateUtcOffset()),this._offset=a,this._isUTC=!0,null!=c&&this.add(c,"m"),d!==a&&(!b||this._changeInProgress?v(this,vb.duration(a-d,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,vb.updateOffset(this,!0),this._changeInProgress=null)),this):this._isUTC?d:this._dateUtcOffset()},isLocal:function(){return!this._isUTC},isUtcOffset:function(){return this._isUTC},isUtc:function(){return this._isUTC&&0===this._offset},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},parseZone:function(){return this._tzm?this.utcOffset(this._tzm):"string"==typeof this._i&&this.utcOffset(S(this._i)),this},hasAlignedHourOffset:function(a){return a=a?vb(a).utcOffset():0,(this.utcOffset()-a)%60===0},daysInMonth:function(){return D(this.year(),this.month())},dayOfYear:function(a){var b=Ab((vb(this).startOf("day")-vb(this).startOf("year"))/864e5)+1;return null==a?b:this.add(a-b,"d")},quarter:function(a){return null==a?Math.ceil((this.month()+1)/3):this.month(3*(a-1)+this.month()%3)},weekYear:function(a){var b=jb(this,this.localeData()._week.dow,this.localeData()._week.doy).year;return null==a?b:this.add(a-b,"y")},isoWeekYear:function(a){var b=jb(this,1,4).year;return null==a?b:this.add(a-b,"y")},week:function(a){var b=this.localeData().week(this);return null==a?b:this.add(7*(a-b),"d")},isoWeek:function(a){var b=jb(this,1,4).week;return null==a?b:this.add(7*(a-b),"d")},weekday:function(a){var b=(this.day()+7-this.localeData()._week.dow)%7;return null==a?b:this.add(a-b,"d")},isoWeekday:function(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)},isoWeeksInYear:function(){return E(this.year(),1,4)},weeksInYear:function(){var a=this.localeData()._week;return E(this.year(),a.dow,a.doy)},get:function(a){return a=z(a),this[a]()},set:function(a,b){var c;if("object"==typeof a)for(c in a)this.set(c,a[c]);else a=z(a),"function"==typeof this[a]&&this[a](b);return this},locale:function(b){var c;return b===a?this._locale._abbr:(c=vb.localeData(b),null!=c&&(this._locale=c),this)},lang:f("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(b){return b===a?this.localeData():this.locale(b)}),localeData:function(){return this._locale},_dateUtcOffset:function(){return 15*-Math.round(this._d.getTimezoneOffset()/15)}}),vb.fn.millisecond=vb.fn.milliseconds=qb("Milliseconds",!1),vb.fn.second=vb.fn.seconds=qb("Seconds",!1),vb.fn.minute=vb.fn.minutes=qb("Minutes",!1),vb.fn.hour=vb.fn.hours=qb("Hours",!0),vb.fn.date=qb("Date",!0),vb.fn.dates=f("dates accessor is deprecated. Use date instead.",qb("Date",!0)),vb.fn.year=qb("FullYear",!0),vb.fn.years=f("years accessor is deprecated. Use year instead.",qb("FullYear",!0)),vb.fn.days=vb.fn.day,vb.fn.months=vb.fn.month,vb.fn.weeks=vb.fn.week,vb.fn.isoWeeks=vb.fn.isoWeek,vb.fn.quarters=vb.fn.quarter,vb.fn.toJSON=vb.fn.toISOString,vb.fn.isUTC=vb.fn.isUtc,o(vb.duration.fn=n.prototype,{_bubble:function(){var a,b,c,d=this._milliseconds,e=this._days,f=this._months,g=this._data,h=0;g.milliseconds=d%1e3,a=q(d/1e3),g.seconds=a%60,b=q(a/60),g.minutes=b%60,c=q(b/60),g.hours=c%24,e+=q(c/24),h=q(rb(e)),e-=q(sb(h)),f+=q(e/30),e%=30,h+=q(f/12),f%=12,g.days=e,g.months=f,g.years=h},abs:function(){return this._milliseconds=Math.abs(this._milliseconds),this._days=Math.abs(this._days),this._months=Math.abs(this._months),this._data.milliseconds=Math.abs(this._data.milliseconds),this._data.seconds=Math.abs(this._data.seconds),this._data.minutes=Math.abs(this._data.minutes),this._data.hours=Math.abs(this._data.hours),this._data.months=Math.abs(this._data.months),this._data.years=Math.abs(this._data.years),this},weeks:function(){return q(this.days()/7)},valueOf:function(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*C(this._months/12)
},humanize:function(a){var b=ib(this,!a,this.localeData());return a&&(b=this.localeData().pastFuture(+this,b)),this.localeData().postformat(b)},add:function(a,b){var c=vb.duration(a,b);return this._milliseconds+=c._milliseconds,this._days+=c._days,this._months+=c._months,this._bubble(),this},subtract:function(a,b){var c=vb.duration(a,b);return this._milliseconds-=c._milliseconds,this._days-=c._days,this._months-=c._months,this._bubble(),this},get:function(a){return a=z(a),this[a.toLowerCase()+"s"]()},as:function(a){var b,c;if(a=z(a),"month"===a||"year"===a)return b=this._days+this._milliseconds/864e5,c=this._months+12*rb(b),"month"===a?c:c/12;switch(b=this._days+Math.round(sb(this._months/12)),a){case"week":return b/7+this._milliseconds/6048e5;case"day":return b+this._milliseconds/864e5;case"hour":return 24*b+this._milliseconds/36e5;case"minute":return 24*b*60+this._milliseconds/6e4;case"second":return 24*b*60*60+this._milliseconds/1e3;case"millisecond":return Math.floor(24*b*60*60*1e3)+this._milliseconds;default:throw new Error("Unknown unit "+a)}},lang:vb.fn.lang,locale:vb.fn.locale,toIsoString:f("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",function(){return this.toISOString()}),toISOString:function(){var a=Math.abs(this.years()),b=Math.abs(this.months()),c=Math.abs(this.days()),d=Math.abs(this.hours()),e=Math.abs(this.minutes()),f=Math.abs(this.seconds()+this.milliseconds()/1e3);return this.asSeconds()?(this.asSeconds()<0?"-":"")+"P"+(a?a+"Y":"")+(b?b+"M":"")+(c?c+"D":"")+(d||e||f?"T":"")+(d?d+"H":"")+(e?e+"M":"")+(f?f+"S":""):"P0D"},localeData:function(){return this._locale},toJSON:function(){return this.toISOString()}}),vb.duration.fn.toString=vb.duration.fn.toISOString;for(xb in kc)c(kc,xb)&&tb(xb.toLowerCase());vb.duration.fn.asMilliseconds=function(){return this.as("ms")},vb.duration.fn.asSeconds=function(){return this.as("s")},vb.duration.fn.asMinutes=function(){return this.as("m")},vb.duration.fn.asHours=function(){return this.as("h")},vb.duration.fn.asDays=function(){return this.as("d")},vb.duration.fn.asWeeks=function(){return this.as("weeks")},vb.duration.fn.asMonths=function(){return this.as("M")},vb.duration.fn.asYears=function(){return this.as("y")},vb.locale("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===C(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),function(a){a(vb)}(function(a){return a.defineLocale("af",{months:"Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),weekdays:"Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),weekdaysShort:"Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),weekdaysMin:"So_Ma_Di_Wo_Do_Vr_Sa".split("_"),meridiemParse:/vm|nm/i,isPM:function(a){return/^nm$/i.test(a)},meridiem:function(a,b,c){return 12>a?c?"vm":"VM":c?"nm":"NM"},longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Vandag om] LT",nextDay:"[Môre om] LT",nextWeek:"dddd [om] LT",lastDay:"[Gister om] LT",lastWeek:"[Laas] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oor %s",past:"%s gelede",s:"'n paar sekondes",m:"'n minuut",mm:"%d minute",h:"'n uur",hh:"%d ure",d:"'n dag",dd:"%d dae",M:"'n maand",MM:"%d maande",y:"'n jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("ar-ma",{months:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),weekdays:"الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:6,doy:12}})}),function(a){a(vb)}(function(a){var b={1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"},c={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"};return a.defineLocale("ar-sa",{months:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a){return 12>a?"ص":"م"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},preparse:function(a){return a.replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return c[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]}).replace(/,/g,"،")},week:{dow:6,doy:12}})}),function(a){a(vb)}(function(a){return a.defineLocale("ar-tn",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){var b={1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"},c={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},d=function(a){return 0===a?0:1===a?1:2===a?2:a%100>=3&&10>=a%100?3:a%100>=11?4:5},e={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},f=function(a){return function(b,c){var f=d(b),g=e[a][d(b)];return 2===f&&(g=g[c?0:1]),g.replace(/%d/i,b)}},g=["كانون الثاني يناير","شباط فبراير","آذار مارس","نيسان أبريل","أيار مايو","حزيران يونيو","تموز يوليو","آب أغسطس","أيلول سبتمبر","تشرين الأول أكتوبر","تشرين الثاني نوفمبر","كانون الأول ديسمبر"];return a.defineLocale("ar",{months:g,monthsShort:g,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a){return 12>a?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:f("s"),m:f("m"),mm:f("m"),h:f("h"),hh:f("h"),d:f("d"),dd:f("d"),M:f("M"),MM:f("M"),y:f("y"),yy:f("y")},preparse:function(a){return a.replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return c[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]}).replace(/,/g,"،")},week:{dow:6,doy:12}})}),function(a){a(vb)}(function(a){var b={1:"-inci",5:"-inci",8:"-inci",70:"-inci",80:"-inci",2:"-nci",7:"-nci",20:"-nci",50:"-nci",3:"-üncü",4:"-üncü",100:"-üncü",6:"-ncı",9:"-uncu",10:"-uncu",30:"-uncu",60:"-ıncı",90:"-ıncı"};return a.defineLocale("az",{months:"yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),monthsShort:"yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),weekdays:"Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),weekdaysShort:"Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),weekdaysMin:"Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[sabah saat] LT",nextWeek:"[gələn həftə] dddd [saat] LT",lastDay:"[dünən] LT",lastWeek:"[keçən həftə] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s əvvəl",s:"birneçə saniyyə",m:"bir dəqiqə",mm:"%d dəqiqə",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir il",yy:"%d il"},meridiemParse:/gecə|səhər|gündüz|axşam/,isPM:function(a){return/^(gündüz|axşam)$/.test(a)},meridiem:function(a){return 4>a?"gecə":12>a?"səhər":17>a?"gündüz":"axşam"},ordinalParse:/\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,ordinal:function(a){if(0===a)return a+"-ıncı";var c=a%10,d=a%100-c,e=a>=100?100:null;return a+(b[c]||b[d]||b[e])},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){function b(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function c(a,c,d){var e={mm:c?"хвіліна_хвіліны_хвілін":"хвіліну_хвіліны_хвілін",hh:c?"гадзіна_гадзіны_гадзін":"гадзіну_гадзіны_гадзін",dd:"дзень_дні_дзён",MM:"месяц_месяцы_месяцаў",yy:"год_гады_гадоў"};return"m"===d?c?"хвіліна":"хвіліну":"h"===d?c?"гадзіна":"гадзіну":a+" "+b(e[d],+a)}function d(a,b){var c={nominative:"студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_"),accusative:"студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function e(a,b){var c={nominative:"нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),accusative:"нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_")},d=/\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/.test(b)?"accusative":"nominative";return c[d][a.day()]}return a.defineLocale("be",{months:d,monthsShort:"студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),weekdays:e,weekdaysShort:"нд_пн_ат_ср_чц_пт_сб".split("_"),weekdaysMin:"нд_пн_ат_ср_чц_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., LT",LLLL:"dddd, D MMMM YYYY г., LT"},calendar:{sameDay:"[Сёння ў] LT",nextDay:"[Заўтра ў] LT",lastDay:"[Учора ў] LT",nextWeek:function(){return"[У] dddd [ў] LT"},lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return"[У мінулую] dddd [ў] LT";case 1:case 2:case 4:return"[У мінулы] dddd [ў] LT"}},sameElse:"L"},relativeTime:{future:"праз %s",past:"%s таму",s:"некалькі секунд",m:c,mm:c,h:c,hh:c,d:"дзень",dd:c,M:"месяц",MM:c,y:"год",yy:c},meridiemParse:/ночы|раніцы|дня|вечара/,isPM:function(a){return/^(дня|вечара)$/.test(a)},meridiem:function(a){return 4>a?"ночы":12>a?"раніцы":17>a?"дня":"вечара"},ordinalParse:/\d{1,2}-(і|ы|га)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a%10!==2&&a%10!==3||a%100===12||a%100===13?a+"-ы":a+"-і";case"D":return a+"-га";default:return a}},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("bg",{months:"януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),monthsShort:"янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),weekdays:"неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),weekdaysShort:"нед_пон_вто_сря_чет_пет_съб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Днес в] LT",nextDay:"[Утре в] LT",nextWeek:"dddd [в] LT",lastDay:"[Вчера в] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[В изминалата] dddd [в] LT";case 1:case 2:case 4:case 5:return"[В изминалия] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"след %s",past:"преди %s",s:"няколко секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дни",M:"месец",MM:"%d месеца",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&20>c?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){var b={1:"১",2:"২",3:"৩",4:"৪",5:"৫",6:"৬",7:"৭",8:"৮",9:"৯",0:"০"},c={"১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9","০":"0"};return a.defineLocale("bn",{months:"জানুয়ারী_ফেবুয়ারী_মার্চ_এপ্রিল_মে_জুন_জুলাই_অগাস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),monthsShort:"জানু_ফেব_মার্চ_এপর_মে_জুন_জুল_অগ_সেপ্ট_অক্টো_নভ_ডিসেম্".split("_"),weekdays:"রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পত্তিবার_শুক্রুবার_শনিবার".split("_"),weekdaysShort:"রবি_সোম_মঙ্গল_বুধ_বৃহস্পত্তি_শুক্রু_শনি".split("_"),weekdaysMin:"রব_সম_মঙ্গ_বু_ব্রিহ_শু_শনি".split("_"),longDateFormat:{LT:"A h:mm সময়",LTS:"A h:mm:ss সময়",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[আজ] LT",nextDay:"[আগামীকাল] LT",nextWeek:"dddd, LT",lastDay:"[গতকাল] LT",lastWeek:"[গত] dddd, LT",sameElse:"L"},relativeTime:{future:"%s পরে",past:"%s আগে",s:"কএক সেকেন্ড",m:"এক মিনিট",mm:"%d মিনিট",h:"এক ঘন্টা",hh:"%d ঘন্টা",d:"এক দিন",dd:"%d দিন",M:"এক মাস",MM:"%d মাস",y:"এক বছর",yy:"%d বছর"},preparse:function(a){return a.replace(/[১২৩৪৫৬৭৮৯০]/g,function(a){return c[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]})},meridiemParse:/রাত|শকাল|দুপুর|বিকেল|রাত/,isPM:function(a){return/^(দুপুর|বিকেল|রাত)$/.test(a)},meridiem:function(a){return 4>a?"রাত":10>a?"শকাল":17>a?"দুপুর":20>a?"বিকেল":"রাত"},week:{dow:0,doy:6}})}),function(a){a(vb)}(function(a){var b={1:"༡",2:"༢",3:"༣",4:"༤",5:"༥",6:"༦",7:"༧",8:"༨",9:"༩",0:"༠"},c={"༡":"1","༢":"2","༣":"3","༤":"4","༥":"5","༦":"6","༧":"7","༨":"8","༩":"9","༠":"0"};return a.defineLocale("bo",{months:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),monthsShort:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),weekdays:"གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),weekdaysShort:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),weekdaysMin:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),longDateFormat:{LT:"A h:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[དི་རིང] LT",nextDay:"[སང་ཉིན] LT",nextWeek:"[བདུན་ཕྲག་རྗེས་མ], LT",lastDay:"[ཁ་སང] LT",lastWeek:"[བདུན་ཕྲག་མཐའ་མ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ལ་",past:"%s སྔན་ལ",s:"ལམ་སང",m:"སྐར་མ་གཅིག",mm:"%d སྐར་མ",h:"ཆུ་ཚོད་གཅིག",hh:"%d ཆུ་ཚོད",d:"ཉིན་གཅིག",dd:"%d ཉིན་",M:"ཟླ་བ་གཅིག",MM:"%d ཟླ་བ",y:"ལོ་གཅིག",yy:"%d ལོ"},preparse:function(a){return a.replace(/[༡༢༣༤༥༦༧༨༩༠]/g,function(a){return c[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]})},meridiemParse:/མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,isPM:function(a){return/^(ཉིན་གུང|དགོང་དག|མཚན་མོ)$/.test(a)},meridiem:function(a){return 4>a?"མཚན་མོ":10>a?"ཞོགས་ཀས":17>a?"ཉིན་གུང":20>a?"དགོང་དག":"མཚན་མོ"},week:{dow:0,doy:6}})}),function(a){a(vb)}(function(b){function c(a,b,c){var d={mm:"munutenn",MM:"miz",dd:"devezh"};return a+" "+f(d[c],a)}function d(a){switch(e(a)){case 1:case 3:case 4:case 5:case 9:return a+" bloaz";default:return a+" vloaz"}}function e(a){return a>9?e(a%10):a}function f(a,b){return 2===b?g(a):a}function g(b){var c={m:"v",b:"v",d:"z"};return c[b.charAt(0)]===a?b:c[b.charAt(0)]+b.substring(1)}return b.defineLocale("br",{months:"Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),monthsShort:"Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),weekdays:"Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),weekdaysShort:"Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),weekdaysMin:"Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),longDateFormat:{LT:"h[e]mm A",LTS:"h[e]mm:ss A",L:"DD/MM/YYYY",LL:"D [a viz] MMMM YYYY",LLL:"D [a viz] MMMM YYYY LT",LLLL:"dddd, D [a viz] MMMM YYYY LT"},calendar:{sameDay:"[Hiziv da] LT",nextDay:"[Warc'hoazh da] LT",nextWeek:"dddd [da] LT",lastDay:"[Dec'h da] LT",lastWeek:"dddd [paset da] LT",sameElse:"L"},relativeTime:{future:"a-benn %s",past:"%s 'zo",s:"un nebeud segondennoù",m:"ur vunutenn",mm:c,h:"un eur",hh:"%d eur",d:"un devezh",dd:c,M:"ur miz",MM:c,y:"ur bloaz",yy:d},ordinalParse:/\d{1,2}(añ|vet)/,ordinal:function(a){var b=1===a?"añ":"vet";return a+b},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}return a.defineLocale("bs",{months:"januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:b,mm:b,h:b,hh:b,d:"dan",dd:b,M:"mjesec",MM:b,y:"godinu",yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("ca",{months:"gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),monthsShort:"gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split("_"),weekdays:"diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),weekdaysShort:"dg._dl._dt._dc._dj._dv._ds.".split("_"),weekdaysMin:"Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:function(){return"[avui a "+(1!==this.hours()?"les":"la")+"] LT"},nextDay:function(){return"[demà a "+(1!==this.hours()?"les":"la")+"] LT"},nextWeek:function(){return"dddd [a "+(1!==this.hours()?"les":"la")+"] LT"},lastDay:function(){return"[ahir a "+(1!==this.hours()?"les":"la")+"] LT"},lastWeek:function(){return"[el] dddd [passat a "+(1!==this.hours()?"les":"la")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"fa %s",s:"uns segons",m:"un minut",mm:"%d minuts",h:"una hora",hh:"%d hores",d:"un dia",dd:"%d dies",M:"un mes",MM:"%d mesos",y:"un any",yy:"%d anys"},ordinalParse:/\d{1,2}(r|n|t|è|a)/,ordinal:function(a,b){var c=1===a?"r":2===a?"n":3===a?"r":4===a?"t":"è";return("w"===b||"W"===b)&&(c="a"),a+c},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a){return a>1&&5>a&&1!==~~(a/10)}function c(a,c,d,e){var f=a+" ";switch(d){case"s":return c||e?"pár sekund":"pár sekundami";case"m":return c?"minuta":e?"minutu":"minutou";case"mm":return c||e?f+(b(a)?"minuty":"minut"):f+"minutami";break;case"h":return c?"hodina":e?"hodinu":"hodinou";case"hh":return c||e?f+(b(a)?"hodiny":"hodin"):f+"hodinami";break;case"d":return c||e?"den":"dnem";case"dd":return c||e?f+(b(a)?"dny":"dní"):f+"dny";break;case"M":return c||e?"měsíc":"měsícem";case"MM":return c||e?f+(b(a)?"měsíce":"měsíců"):f+"měsíci";break;case"y":return c||e?"rok":"rokem";case"yy":return c||e?f+(b(a)?"roky":"let"):f+"lety"}}var d="leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_"),e="led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_");return a.defineLocale("cs",{months:d,monthsShort:e,monthsParse:function(a,b){var c,d=[];for(c=0;12>c;c++)d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(d,e),weekdays:"neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),weekdaysShort:"ne_po_út_st_čt_pá_so".split("_"),weekdaysMin:"ne_po_út_st_čt_pá_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd D. MMMM YYYY LT"},calendar:{sameDay:"[dnes v] LT",nextDay:"[zítra v] LT",nextWeek:function(){switch(this.day()){case 0:return"[v neděli v] LT";case 1:case 2:return"[v] dddd [v] LT";case 3:return"[ve středu v] LT";case 4:return"[ve čtvrtek v] LT";case 5:return"[v pátek v] LT";case 6:return"[v sobotu v] LT"}},lastDay:"[včera v] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulou neděli v] LT";case 1:case 2:return"[minulé] dddd [v] LT";case 3:return"[minulou středu v] LT";case 4:case 5:return"[minulý] dddd [v] LT";case 6:return"[minulou sobotu v] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"před %s",s:c,m:c,mm:c,h:c,hh:c,d:c,dd:c,M:c,MM:c,y:c,yy:c},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("cv",{months:"кăрлач_нарăс_пуш_ака_май_çĕртме_утă_çурла_авăн_юпа_чӳк_раштав".split("_"),monthsShort:"кăр_нар_пуш_ака_май_çĕр_утă_çур_ав_юпа_чӳк_раш".split("_"),weekdays:"вырсарникун_тунтикун_ытларикун_юнкун_кĕçнерникун_эрнекун_шăматкун".split("_"),weekdaysShort:"выр_тун_ытл_юн_кĕç_эрн_шăм".split("_"),weekdaysMin:"вр_тн_ыт_юн_кç_эр_шм".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD-MM-YYYY",LL:"YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ]",LLL:"YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT",LLLL:"dddd, YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT"},calendar:{sameDay:"[Паян] LT [сехетре]",nextDay:"[Ыран] LT [сехетре]",lastDay:"[Ĕнер] LT [сехетре]",nextWeek:"[Çитес] dddd LT [сехетре]",lastWeek:"[Иртнĕ] dddd LT [сехетре]",sameElse:"L"},relativeTime:{future:function(a){var b=/сехет$/i.exec(a)?"рен":/çул$/i.exec(a)?"тан":"ран";return a+b},past:"%s каялла",s:"пĕр-ик çеккунт",m:"пĕр минут",mm:"%d минут",h:"пĕр сехет",hh:"%d сехет",d:"пĕр кун",dd:"%d кун",M:"пĕр уйăх",MM:"%d уйăх",y:"пĕр çул",yy:"%d çул"},ordinalParse:/\d{1,2}-мĕш/,ordinal:"%d-мĕш",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("cy",{months:"Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),monthsShort:"Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),weekdays:"Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),weekdaysShort:"Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),weekdaysMin:"Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Heddiw am] LT",nextDay:"[Yfory am] LT",nextWeek:"dddd [am] LT",lastDay:"[Ddoe am] LT",lastWeek:"dddd [diwethaf am] LT",sameElse:"L"},relativeTime:{future:"mewn %s",past:"%s yn ôl",s:"ychydig eiliadau",m:"munud",mm:"%d munud",h:"awr",hh:"%d awr",d:"diwrnod",dd:"%d diwrnod",M:"mis",MM:"%d mis",y:"blwyddyn",yy:"%d flynedd"},ordinalParse:/\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,ordinal:function(a){var b=a,c="",d=["","af","il","ydd","ydd","ed","ed","ed","fed","fed","fed","eg","fed","eg","eg","fed","eg","eg","fed","eg","fed"];return b>20?c=40===b||50===b||60===b||80===b||100===b?"fed":"ain":b>0&&(c=d[b]),a+c},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("da",{months:"januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tir_ons_tor_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd [d.] D. MMMM YYYY LT"},calendar:{sameDay:"[I dag kl.] LT",nextDay:"[I morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[I går kl.] LT",lastWeek:"[sidste] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"få sekunder",m:"et minut",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dage",M:"en måned",MM:"%d måneder",y:"et år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?d[c][0]:d[c][1]}return a.defineLocale("de-at",{months:"Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Heute um] LT [Uhr]",sameElse:"L",nextDay:"[Morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[Gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:b,mm:"%d Minuten",h:b,hh:"%d Stunden",d:b,dd:b,M:b,MM:b,y:b,yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?d[c][0]:d[c][1]}return a.defineLocale("de",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Heute um] LT [Uhr]",sameElse:"L",nextDay:"[Morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[Gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:b,mm:"%d Minuten",h:b,hh:"%d Stunden",d:b,dd:b,M:b,MM:b,y:b,yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("el",{monthsNominativeEl:"Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),monthsGenitiveEl:"Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),months:function(a,b){return/D/.test(b.substring(0,b.indexOf("MMMM")))?this._monthsGenitiveEl[a.month()]:this._monthsNominativeEl[a.month()]},monthsShort:"Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),weekdays:"Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),weekdaysShort:"Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),weekdaysMin:"Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),meridiem:function(a,b,c){return a>11?c?"μμ":"ΜΜ":c?"πμ":"ΠΜ"},isPM:function(a){return"μ"===(a+"").toLowerCase()[0]},meridiemParse:/[ΠΜ]\.?Μ?\.?/i,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendarEl:{sameDay:"[Σήμερα {}] LT",nextDay:"[Αύριο {}] LT",nextWeek:"dddd [{}] LT",lastDay:"[Χθες {}] LT",lastWeek:function(){switch(this.day()){case 6:return"[το προηγούμενο] dddd [{}] LT";default:return"[την προηγούμενη] dddd [{}] LT"}},sameElse:"L"},calendar:function(a,b){var c=this._calendarEl[a],d=b&&b.hours();return"function"==typeof c&&(c=c.apply(b)),c.replace("{}",d%12===1?"στη":"στις")},relativeTime:{future:"σε %s",past:"%s πριν",s:"λίγα δευτερόλεπτα",m:"ένα λεπτό",mm:"%d λεπτά",h:"μία ώρα",hh:"%d ώρες",d:"μία μέρα",dd:"%d μέρες",M:"ένας μήνας",MM:"%d μήνες",y:"ένας χρόνος",yy:"%d χρόνια"},ordinalParse:/\d{1,2}η/,ordinal:"%dη",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("en-au",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("en-ca",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"YYYY-MM-DD",LL:"D MMMM, YYYY",LLL:"D MMMM, YYYY LT",LLLL:"dddd, D MMMM, YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";
return a+c}})}),function(a){a(vb)}(function(a){return a.defineLocale("en-gb",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("eo",{months:"januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),weekdays:"Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),weekdaysShort:"Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"D[-an de] MMMM, YYYY",LLL:"D[-an de] MMMM, YYYY LT",LLLL:"dddd, [la] D[-an de] MMMM, YYYY LT"},meridiemParse:/[ap]\.t\.m/i,isPM:function(a){return"p"===a.charAt(0).toLowerCase()},meridiem:function(a,b,c){return a>11?c?"p.t.m.":"P.T.M.":c?"a.t.m.":"A.T.M."},calendar:{sameDay:"[Hodiaŭ je] LT",nextDay:"[Morgaŭ je] LT",nextWeek:"dddd [je] LT",lastDay:"[Hieraŭ je] LT",lastWeek:"[pasinta] dddd [je] LT",sameElse:"L"},relativeTime:{future:"je %s",past:"antaŭ %s",s:"sekundoj",m:"minuto",mm:"%d minutoj",h:"horo",hh:"%d horoj",d:"tago",dd:"%d tagoj",M:"monato",MM:"%d monatoj",y:"jaro",yy:"%d jaroj"},ordinalParse:/\d{1,2}a/,ordinal:"%da",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){var b="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),c="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_");return a.defineLocale("es",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(a,d){return/-MMM-/.test(d)?c[a.month()]:b[a.month()]},weekdays:"domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),weekdaysShort:"dom._lun._mar._mié._jue._vie._sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY LT",LLLL:"dddd, D [de] MMMM [de] YYYY LT"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c,d){var e={s:["mõne sekundi","mõni sekund","paar sekundit"],m:["ühe minuti","üks minut"],mm:[a+" minuti",a+" minutit"],h:["ühe tunni","tund aega","üks tund"],hh:[a+" tunni",a+" tundi"],d:["ühe päeva","üks päev"],M:["kuu aja","kuu aega","üks kuu"],MM:[a+" kuu",a+" kuud"],y:["ühe aasta","aasta","üks aasta"],yy:[a+" aasta",a+" aastat"]};return b?e[c][2]?e[c][2]:e[c][1]:d?e[c][0]:e[c][1]}return a.defineLocale("et",{months:"jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),monthsShort:"jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),weekdays:"pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),weekdaysShort:"P_E_T_K_N_R_L".split("_"),weekdaysMin:"P_E_T_K_N_R_L".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Täna,] LT",nextDay:"[Homme,] LT",nextWeek:"[Järgmine] dddd LT",lastDay:"[Eile,] LT",lastWeek:"[Eelmine] dddd LT",sameElse:"L"},relativeTime:{future:"%s pärast",past:"%s tagasi",s:b,m:b,mm:b,h:b,hh:b,d:b,dd:"%d päeva",M:b,MM:b,y:b,yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("eu",{months:"urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),monthsShort:"urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),weekdays:"igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),weekdaysShort:"ig._al._ar._az._og._ol._lr.".split("_"),weekdaysMin:"ig_al_ar_az_og_ol_lr".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"YYYY[ko] MMMM[ren] D[a]",LLL:"YYYY[ko] MMMM[ren] D[a] LT",LLLL:"dddd, YYYY[ko] MMMM[ren] D[a] LT",l:"YYYY-M-D",ll:"YYYY[ko] MMM D[a]",lll:"YYYY[ko] MMM D[a] LT",llll:"ddd, YYYY[ko] MMM D[a] LT"},calendar:{sameDay:"[gaur] LT[etan]",nextDay:"[bihar] LT[etan]",nextWeek:"dddd LT[etan]",lastDay:"[atzo] LT[etan]",lastWeek:"[aurreko] dddd LT[etan]",sameElse:"L"},relativeTime:{future:"%s barru",past:"duela %s",s:"segundo batzuk",m:"minutu bat",mm:"%d minutu",h:"ordu bat",hh:"%d ordu",d:"egun bat",dd:"%d egun",M:"hilabete bat",MM:"%d hilabete",y:"urte bat",yy:"%d urte"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){var b={1:"۱",2:"۲",3:"۳",4:"۴",5:"۵",6:"۶",7:"۷",8:"۸",9:"۹",0:"۰"},c={"۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","۰":"0"};return a.defineLocale("fa",{months:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),monthsShort:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),weekdays:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysShort:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysMin:"ی_د_س_چ_پ_ج_ش".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},meridiemParse:/قبل از ظهر|بعد از ظهر/,isPM:function(a){return/بعد از ظهر/.test(a)},meridiem:function(a){return 12>a?"قبل از ظهر":"بعد از ظهر"},calendar:{sameDay:"[امروز ساعت] LT",nextDay:"[فردا ساعت] LT",nextWeek:"dddd [ساعت] LT",lastDay:"[دیروز ساعت] LT",lastWeek:"dddd [پیش] [ساعت] LT",sameElse:"L"},relativeTime:{future:"در %s",past:"%s پیش",s:"چندین ثانیه",m:"یک دقیقه",mm:"%d دقیقه",h:"یک ساعت",hh:"%d ساعت",d:"یک روز",dd:"%d روز",M:"یک ماه",MM:"%d ماه",y:"یک سال",yy:"%d سال"},preparse:function(a){return a.replace(/[۰-۹]/g,function(a){return c[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]}).replace(/,/g,"،")},ordinalParse:/\d{1,2}م/,ordinal:"%dم",week:{dow:6,doy:12}})}),function(a){a(vb)}(function(a){function b(a,b,d,e){var f="";switch(d){case"s":return e?"muutaman sekunnin":"muutama sekunti";case"m":return e?"minuutin":"minuutti";case"mm":f=e?"minuutin":"minuuttia";break;case"h":return e?"tunnin":"tunti";case"hh":f=e?"tunnin":"tuntia";break;case"d":return e?"päivän":"päivä";case"dd":f=e?"päivän":"päivää";break;case"M":return e?"kuukauden":"kuukausi";case"MM":f=e?"kuukauden":"kuukautta";break;case"y":return e?"vuoden":"vuosi";case"yy":f=e?"vuoden":"vuotta"}return f=c(a,e)+" "+f}function c(a,b){return 10>a?b?e[a]:d[a]:a}var d="nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" "),e=["nolla","yhden","kahden","kolmen","neljän","viiden","kuuden",d[7],d[8],d[9]];return a.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] LT",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] LT",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] LT",llll:"ddd, Do MMM YYYY, [klo] LT"},calendar:{sameDay:"[tänään] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s päästä",past:"%s sitten",s:b,m:b,mm:b,h:b,hh:b,d:b,dd:b,M:b,MM:b,y:b,yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("fo",{months:"januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),weekdaysShort:"sun_mán_týs_mik_hós_frí_ley".split("_"),weekdaysMin:"su_má_tý_mi_hó_fr_le".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D. MMMM, YYYY LT"},calendar:{sameDay:"[Í dag kl.] LT",nextDay:"[Í morgin kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[Í gjár kl.] LT",lastWeek:"[síðstu] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"um %s",past:"%s síðani",s:"fá sekund",m:"ein minutt",mm:"%d minuttir",h:"ein tími",hh:"%d tímar",d:"ein dagur",dd:"%d dagar",M:"ein mánaði",MM:"%d mánaðir",y:"eitt ár",yy:"%d ár"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("fr-ca",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|)/,ordinal:function(a){return a+(1===a?"er":"")}})}),function(a){a(vb)}(function(a){return a.defineLocale("fr",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|)/,ordinal:function(a){return a+(1===a?"er":"")},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){var b="jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_"),c="jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_");return a.defineLocale("fy",{months:"jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),monthsShort:function(a,d){return/-MMM-/.test(d)?c[a.month()]:b[a.month()]},weekdays:"snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),weekdaysShort:"si._mo._ti._wo._to._fr._so.".split("_"),weekdaysMin:"Si_Mo_Ti_Wo_To_Fr_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[hjoed om] LT",nextDay:"[moarn om] LT",nextWeek:"dddd [om] LT",lastDay:"[juster om] LT",lastWeek:"[ôfrûne] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oer %s",past:"%s lyn",s:"in pear sekonden",m:"ien minút",mm:"%d minuten",h:"ien oere",hh:"%d oeren",d:"ien dei",dd:"%d dagen",M:"ien moanne",MM:"%d moannen",y:"ien jier",yy:"%d jierren"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("gl",{months:"Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro".split("_"),monthsShort:"Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),weekdays:"Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:function(){return"[hoxe "+(1!==this.hours()?"ás":"á")+"] LT"},nextDay:function(){return"[mañá "+(1!==this.hours()?"ás":"á")+"] LT"},nextWeek:function(){return"dddd ["+(1!==this.hours()?"ás":"a")+"] LT"},lastDay:function(){return"[onte "+(1!==this.hours()?"á":"a")+"] LT"},lastWeek:function(){return"[o] dddd [pasado "+(1!==this.hours()?"ás":"a")+"] LT"},sameElse:"L"},relativeTime:{future:function(a){return"uns segundos"===a?"nuns segundos":"en "+a},past:"hai %s",s:"uns segundos",m:"un minuto",mm:"%d minutos",h:"unha hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("he",{months:"ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),monthsShort:"ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),weekdays:"ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),weekdaysShort:"א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),weekdaysMin:"א_ב_ג_ד_ה_ו_ש".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [ב]MMMM YYYY",LLL:"D [ב]MMMM YYYY LT",LLLL:"dddd, D [ב]MMMM YYYY LT",l:"D/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY LT",llll:"ddd, D MMM YYYY LT"},calendar:{sameDay:"[היום ב־]LT",nextDay:"[מחר ב־]LT",nextWeek:"dddd [בשעה] LT",lastDay:"[אתמול ב־]LT",lastWeek:"[ביום] dddd [האחרון בשעה] LT",sameElse:"L"},relativeTime:{future:"בעוד %s",past:"לפני %s",s:"מספר שניות",m:"דקה",mm:"%d דקות",h:"שעה",hh:function(a){return 2===a?"שעתיים":a+" שעות"},d:"יום",dd:function(a){return 2===a?"יומיים":a+" ימים"},M:"חודש",MM:function(a){return 2===a?"חודשיים":a+" חודשים"},y:"שנה",yy:function(a){return 2===a?"שנתיים":a%10===0&&10!==a?a+" שנה":a+" שנים"}}})}),function(a){a(vb)}(function(a){var b={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},c={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};return a.defineLocale("hi",{months:"जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),monthsShort:"जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),weekdays:"रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm बजे",LTS:"A h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[आज] LT",nextDay:"[कल] LT",nextWeek:"dddd, LT",lastDay:"[कल] LT",lastWeek:"[पिछले] dddd, LT",sameElse:"L"},relativeTime:{future:"%s में",past:"%s पहले",s:"कुछ ही क्षण",m:"एक मिनट",mm:"%d मिनट",h:"एक घंटा",hh:"%d घंटे",d:"एक दिन",dd:"%d दिन",M:"एक महीने",MM:"%d महीने",y:"एक वर्ष",yy:"%d वर्ष"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return c[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]})},meridiemParse:/रात|सुबह|दोपहर|शाम/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात"===b?4>a?a:a+12:"सुबह"===b?a:"दोपहर"===b?a>=10?a:a+12:"शाम"===b?a+12:void 0},meridiem:function(a){return 4>a?"रात":10>a?"सुबह":17>a?"दोपहर":20>a?"शाम":"रात"},week:{dow:0,doy:6}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}return a.defineLocale("hr",{months:"sječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_"),monthsShort:"sje._vel._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:b,mm:b,h:b,hh:b,d:"dan",dd:b,M:"mjesec",MM:b,y:"godinu",yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){function b(a,b,c,d){var e=a;switch(c){case"s":return d||b?"néhány másodperc":"néhány másodperce";case"m":return"egy"+(d||b?" perc":" perce");case"mm":return e+(d||b?" perc":" perce");case"h":return"egy"+(d||b?" óra":" órája");case"hh":return e+(d||b?" óra":" órája");case"d":return"egy"+(d||b?" nap":" napja");case"dd":return e+(d||b?" nap":" napja");case"M":return"egy"+(d||b?" hónap":" hónapja");case"MM":return e+(d||b?" hónap":" hónapja");case"y":return"egy"+(d||b?" év":" éve");case"yy":return e+(d||b?" év":" éve")}return""}function c(a){return(a?"":"[múlt] ")+"["+d[this.day()]+"] LT[-kor]"}var d="vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ");return a.defineLocale("hu",{months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"vas_hét_kedd_sze_csüt_pén_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D., LT",LLLL:"YYYY. MMMM D., dddd LT"},meridiemParse:/de|du/i,isPM:function(a){return"u"===a.charAt(1).toLowerCase()},meridiem:function(a,b,c){return 12>a?c===!0?"de":"DE":c===!0?"du":"DU"},calendar:{sameDay:"[ma] LT[-kor]",nextDay:"[holnap] LT[-kor]",nextWeek:function(){return c.call(this,!0)},lastDay:"[tegnap] LT[-kor]",lastWeek:function(){return c.call(this,!1)},sameElse:"L"},relativeTime:{future:"%s múlva",past:"%s",s:b,m:b,mm:b,h:b,hh:b,d:b,dd:b,M:b,MM:b,y:b,yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){function b(a,b){var c={nominative:"հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_"),accusative:"հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function c(a){var b="հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_");return b[a.month()]}function d(a){var b="կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_");return b[a.day()]}return a.defineLocale("hy-am",{months:b,monthsShort:c,weekdays:d,weekdaysShort:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),weekdaysMin:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY թ.",LLL:"D MMMM YYYY թ., LT",LLLL:"dddd, D MMMM YYYY թ., LT"},calendar:{sameDay:"[այսօր] LT",nextDay:"[վաղը] LT",lastDay:"[երեկ] LT",nextWeek:function(){return"dddd [օրը ժամը] LT"},lastWeek:function(){return"[անցած] dddd [օրը ժամը] LT"},sameElse:"L"},relativeTime:{future:"%s հետո",past:"%s առաջ",s:"մի քանի վայրկյան",m:"րոպե",mm:"%d րոպե",h:"ժամ",hh:"%d ժամ",d:"օր",dd:"%d օր",M:"ամիս",MM:"%d ամիս",y:"տարի",yy:"%d տարի"},meridiemParse:/գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,isPM:function(a){return/^(ցերեկվա|երեկոյան)$/.test(a)},meridiem:function(a){return 4>a?"գիշերվա":12>a?"առավոտվա":17>a?"ցերեկվա":"երեկոյան"},ordinalParse:/\d{1,2}|\d{1,2}-(ին|րդ)/,ordinal:function(a,b){switch(b){case"DDD":case"w":case"W":case"DDDo":return 1===a?a+"-ին":a+"-րդ";default:return a}},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("id",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),weekdays:"Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),weekdaysShort:"Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"LT.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] LT",LLLL:"dddd, D MMMM YYYY [pukul] LT"},meridiemParse:/pagi|siang|sore|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"siang"===b?a>=11?a:a+12:"sore"===b||"malam"===b?a+12:void 0},meridiem:function(a){return 11>a?"pagi":15>a?"siang":19>a?"sore":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Besok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kemarin pukul] LT",lastWeek:"dddd [lalu pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lalu",s:"beberapa detik",m:"semenit",mm:"%d menit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){function b(a){return a%100===11?!0:a%10===1?!1:!0}function c(a,c,d,e){var f=a+" ";switch(d){case"s":return c||e?"nokkrar sekúndur":"nokkrum sekúndum";case"m":return c?"mínúta":"mínútu";case"mm":return b(a)?f+(c||e?"mínútur":"mínútum"):c?f+"mínúta":f+"mínútu";case"hh":return b(a)?f+(c||e?"klukkustundir":"klukkustundum"):f+"klukkustund";case"d":return c?"dagur":e?"dag":"degi";case"dd":return b(a)?c?f+"dagar":f+(e?"daga":"dögum"):c?f+"dagur":f+(e?"dag":"degi");case"M":return c?"mánuður":e?"mánuð":"mánuði";case"MM":return b(a)?c?f+"mánuðir":f+(e?"mánuði":"mánuðum"):c?f+"mánuður":f+(e?"mánuð":"mánuði");case"y":return c||e?"ár":"ári";case"yy":return b(a)?f+(c||e?"ár":"árum"):f+(c||e?"ár":"ári")}}return a.defineLocale("is",{months:"janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),monthsShort:"jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),weekdays:"sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),weekdaysShort:"sun_mán_þri_mið_fim_fös_lau".split("_"),weekdaysMin:"Su_Má_Þr_Mi_Fi_Fö_La".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] LT",LLLL:"dddd, D. MMMM YYYY [kl.] LT"},calendar:{sameDay:"[í dag kl.] LT",nextDay:"[á morgun kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[í gær kl.] LT",lastWeek:"[síðasta] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"eftir %s",past:"fyrir %s síðan",s:c,m:c,mm:c,h:"klukkustund",hh:c,d:c,dd:c,M:c,MM:c,y:c,yy:c},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("it",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),weekdaysShort:"Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),weekdaysMin:"D_L_Ma_Me_G_V_S".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:function(){switch(this.day()){case 0:return"[la scorsa] dddd [alle] LT";default:return"[lo scorso] dddd [alle] LT"}},sameElse:"L"},relativeTime:{future:function(a){return(/^[0-9].+$/.test(a)?"tra":"in")+" "+a},past:"%s fa",s:"alcuni secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("ja",{months:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),weekdaysShort:"日_月_火_水_木_金_土".split("_"),weekdaysMin:"日_月_火_水_木_金_土".split("_"),longDateFormat:{LT:"Ah時m分",LTS:"LTs秒",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日LT",LLLL:"YYYY年M月D日LT dddd"},meridiemParse:/午前|午後/i,isPM:function(a){return"午後"===a},meridiem:function(a){return 12>a?"午前":"午後"},calendar:{sameDay:"[今日] LT",nextDay:"[明日] LT",nextWeek:"[来週]dddd LT",lastDay:"[昨日] LT",lastWeek:"[前週]dddd LT",sameElse:"L"},relativeTime:{future:"%s後",past:"%s前",s:"数秒",m:"1分",mm:"%d分",h:"1時間",hh:"%d時間",d:"1日",dd:"%d日",M:"1ヶ月",MM:"%dヶ月",y:"1年",yy:"%d年"}})}),function(a){a(vb)}(function(a){function b(a,b){var c={nominative:"იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),accusative:"იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")},d=/D[oD] *MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function c(a,b){var c={nominative:"კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),accusative:"კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_")},d=/(წინა|შემდეგ)/.test(b)?"accusative":"nominative";return c[d][a.day()]}return a.defineLocale("ka",{months:b,monthsShort:"იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),weekdays:c,weekdaysShort:"კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),weekdaysMin:"კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[დღეს] LT[-ზე]",nextDay:"[ხვალ] LT[-ზე]",lastDay:"[გუშინ] LT[-ზე]",nextWeek:"[შემდეგ] dddd LT[-ზე]",lastWeek:"[წინა] dddd LT-ზე",sameElse:"L"},relativeTime:{future:function(a){return/(წამი|წუთი|საათი|წელი)/.test(a)?a.replace(/ი$/,"ში"):a+"ში"},past:function(a){return/(წამი|წუთი|საათი|დღე|თვე)/.test(a)?a.replace(/(ი|ე)$/,"ის წინ"):/წელი/.test(a)?a.replace(/წელი$/,"წლის წინ"):void 0},s:"რამდენიმე წამი",m:"წუთი",mm:"%d წუთი",h:"საათი",hh:"%d საათი",d:"დღე",dd:"%d დღე",M:"თვე",MM:"%d თვე",y:"წელი",yy:"%d წელი"},ordinalParse:/0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,ordinal:function(a){return 0===a?a:1===a?a+"-ლი":20>a||100>=a&&a%20===0||a%100===0?"მე-"+a:a+"-ე"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("km",{months:"មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),monthsShort:"មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),weekdays:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysShort:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysMin:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[ថ្ងៃនៈ ម៉ោង] LT",nextDay:"[ស្អែក ម៉ោង] LT",nextWeek:"dddd [ម៉ោង] LT",lastDay:"[ម្សិលមិញ ម៉ោង] LT",lastWeek:"dddd [សប្តាហ៍មុន] [ម៉ោង] LT",sameElse:"L"},relativeTime:{future:"%sទៀត",past:"%sមុន",s:"ប៉ុន្មានវិនាទី",m:"មួយនាទី",mm:"%d នាទី",h:"មួយម៉ោង",hh:"%d ម៉ោង",d:"មួយថ្ងៃ",dd:"%d ថ្ងៃ",M:"មួយខែ",MM:"%d ខែ",y:"មួយឆ្នាំ",yy:"%d ឆ្នាំ"},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("ko",{months:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),monthsShort:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),weekdays:"일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),weekdaysShort:"일_월_화_수_목_금_토".split("_"),weekdaysMin:"일_월_화_수_목_금_토".split("_"),longDateFormat:{LT:"A h시 m분",LTS:"A h시 m분 s초",L:"YYYY.MM.DD",LL:"YYYY년 MMMM D일",LLL:"YYYY년 MMMM D일 LT",LLLL:"YYYY년 MMMM D일 dddd LT"},calendar:{sameDay:"오늘 LT",nextDay:"내일 LT",nextWeek:"dddd LT",lastDay:"어제 LT",lastWeek:"지난주 dddd LT",sameElse:"L"},relativeTime:{future:"%s 후",past:"%s 전",s:"몇초",ss:"%d초",m:"일분",mm:"%d분",h:"한시간",hh:"%d시간",d:"하루",dd:"%d일",M:"한달",MM:"%d달",y:"일년",yy:"%d년"},ordinalParse:/\d{1,2}일/,ordinal:"%d일",meridiemParse:/오전|오후/,isPM:function(a){return"오후"===a},meridiem:function(a){return 12>a?"오전":"오후"}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d={m:["eng Minutt","enger Minutt"],h:["eng Stonn","enger Stonn"],d:["een Dag","engem Dag"],M:["ee Mount","engem Mount"],y:["ee Joer","engem Joer"]};return b?d[c][0]:d[c][1]}function c(a){var b=a.substr(0,a.indexOf(" "));return e(b)?"a "+a:"an "+a}function d(a){var b=a.substr(0,a.indexOf(" "));return e(b)?"viru "+a:"virun "+a}function e(a){if(a=parseInt(a,10),isNaN(a))return!1;if(0>a)return!0;if(10>a)return a>=4&&7>=a?!0:!1;if(100>a){var b=a%10,c=a/10;return e(0===b?c:b)}if(1e4>a){for(;a>=10;)a/=10;return e(a)}return a/=1e3,e(a)}return a.defineLocale("lb",{months:"Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),weekdaysShort:"So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mé_Dë_Më_Do_Fr_Sa".split("_"),longDateFormat:{LT:"H:mm [Auer]",LTS:"H:mm:ss [Auer]",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Haut um] LT",sameElse:"L",nextDay:"[Muer um] LT",nextWeek:"dddd [um] LT",lastDay:"[Gëschter um] LT",lastWeek:function(){switch(this.day()){case 2:case 4:return"[Leschten] dddd [um] LT";default:return"[Leschte] dddd [um] LT"}}},relativeTime:{future:c,past:d,s:"e puer Sekonnen",m:b,mm:"%d Minutten",h:b,hh:"%d Stonnen",d:b,dd:"%d Deeg",M:b,MM:"%d Méint",y:b,yy:"%d Joer"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c,d){return b?"kelios sekundės":d?"kelių sekundžių":"kelias sekundes"}function c(a,b,c,d){return b?e(c)[0]:d?e(c)[1]:e(c)[2]
}function d(a){return a%10===0||a>10&&20>a}function e(a){return h[a].split("_")}function f(a,b,f,g){var h=a+" ";return 1===a?h+c(a,b,f[0],g):b?h+(d(a)?e(f)[1]:e(f)[0]):g?h+e(f)[1]:h+(d(a)?e(f)[1]:e(f)[2])}function g(a,b){var c=-1===b.indexOf("dddd HH:mm"),d=i[a.day()];return c?d:d.substring(0,d.length-2)+"į"}var h={m:"minutė_minutės_minutę",mm:"minutės_minučių_minutes",h:"valanda_valandos_valandą",hh:"valandos_valandų_valandas",d:"diena_dienos_dieną",dd:"dienos_dienų_dienas",M:"mėnuo_mėnesio_mėnesį",MM:"mėnesiai_mėnesių_mėnesius",y:"metai_metų_metus",yy:"metai_metų_metus"},i="sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_");return a.defineLocale("lt",{months:"sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_"),monthsShort:"sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),weekdays:g,weekdaysShort:"Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),weekdaysMin:"S_P_A_T_K_Pn_Š".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"YYYY [m.] MMMM D [d.]",LLL:"YYYY [m.] MMMM D [d.], LT [val.]",LLLL:"YYYY [m.] MMMM D [d.], dddd, LT [val.]",l:"YYYY-MM-DD",ll:"YYYY [m.] MMMM D [d.]",lll:"YYYY [m.] MMMM D [d.], LT [val.]",llll:"YYYY [m.] MMMM D [d.], ddd, LT [val.]"},calendar:{sameDay:"[Šiandien] LT",nextDay:"[Rytoj] LT",nextWeek:"dddd LT",lastDay:"[Vakar] LT",lastWeek:"[Praėjusį] dddd LT",sameElse:"L"},relativeTime:{future:"po %s",past:"prieš %s",s:b,m:c,mm:f,h:c,hh:f,d:c,dd:f,M:c,MM:f,y:c,yy:f},ordinalParse:/\d{1,2}-oji/,ordinal:function(a){return a+"-oji"},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d=a.split("_");return c?b%10===1&&11!==b?d[2]:d[3]:b%10===1&&11!==b?d[0]:d[1]}function c(a,c,e){return a+" "+b(d[e],a,c)}var d={mm:"minūti_minūtes_minūte_minūtes",hh:"stundu_stundas_stunda_stundas",dd:"dienu_dienas_diena_dienas",MM:"mēnesi_mēnešus_mēnesis_mēneši",yy:"gadu_gadus_gads_gadi"};return a.defineLocale("lv",{months:"janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),monthsShort:"jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),weekdays:"svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),weekdaysShort:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysMin:"Sv_P_O_T_C_Pk_S".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"YYYY. [gada] D. MMMM",LLL:"YYYY. [gada] D. MMMM, LT",LLLL:"YYYY. [gada] D. MMMM, dddd, LT"},calendar:{sameDay:"[Šodien pulksten] LT",nextDay:"[Rīt pulksten] LT",nextWeek:"dddd [pulksten] LT",lastDay:"[Vakar pulksten] LT",lastWeek:"[Pagājušā] dddd [pulksten] LT",sameElse:"L"},relativeTime:{future:"%s vēlāk",past:"%s agrāk",s:"dažas sekundes",m:"minūti",mm:c,h:"stundu",hh:c,d:"dienu",dd:c,M:"mēnesi",MM:c,y:"gadu",yy:c},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("mk",{months:"јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),monthsShort:"јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),weekdays:"недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),weekdaysShort:"нед_пон_вто_сре_чет_пет_саб".split("_"),weekdaysMin:"нe_пo_вт_ср_че_пе_сa".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Денес во] LT",nextDay:"[Утре во] LT",nextWeek:"dddd [во] LT",lastDay:"[Вчера во] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[Во изминатата] dddd [во] LT";case 1:case 2:case 4:case 5:return"[Во изминатиот] dddd [во] LT"}},sameElse:"L"},relativeTime:{future:"после %s",past:"пред %s",s:"неколку секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дена",M:"месец",MM:"%d месеци",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&20>c?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("ml",{months:"ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),monthsShort:"ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),weekdays:"ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),weekdaysShort:"ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),weekdaysMin:"ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),longDateFormat:{LT:"A h:mm -നു",LTS:"A h:mm:ss -നു",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[ഇന്ന്] LT",nextDay:"[നാളെ] LT",nextWeek:"dddd, LT",lastDay:"[ഇന്നലെ] LT",lastWeek:"[കഴിഞ്ഞ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s കഴിഞ്ഞ്",past:"%s മുൻപ്",s:"അൽപ നിമിഷങ്ങൾ",m:"ഒരു മിനിറ്റ്",mm:"%d മിനിറ്റ്",h:"ഒരു മണിക്കൂർ",hh:"%d മണിക്കൂർ",d:"ഒരു ദിവസം",dd:"%d ദിവസം",M:"ഒരു മാസം",MM:"%d മാസം",y:"ഒരു വർഷം",yy:"%d വർഷം"},meridiemParse:/രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,isPM:function(a){return/^(ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി)$/.test(a)},meridiem:function(a){return 4>a?"രാത്രി":12>a?"രാവിലെ":17>a?"ഉച്ച കഴിഞ്ഞ്":20>a?"വൈകുന്നേരം":"രാത്രി"}})}),function(a){a(vb)}(function(a){var b={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},c={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};return a.defineLocale("mr",{months:"जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),monthsShort:"जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),weekdays:"रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm वाजता",LTS:"A h:mm:ss वाजता",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[आज] LT",nextDay:"[उद्या] LT",nextWeek:"dddd, LT",lastDay:"[काल] LT",lastWeek:"[मागील] dddd, LT",sameElse:"L"},relativeTime:{future:"%s नंतर",past:"%s पूर्वी",s:"सेकंद",m:"एक मिनिट",mm:"%d मिनिटे",h:"एक तास",hh:"%d तास",d:"एक दिवस",dd:"%d दिवस",M:"एक महिना",MM:"%d महिने",y:"एक वर्ष",yy:"%d वर्षे"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return c[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]})},meridiemParse:/रात्री|सकाळी|दुपारी|सायंकाळी/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात्री"===b?4>a?a:a+12:"सकाळी"===b?a:"दुपारी"===b?a>=10?a:a+12:"सायंकाळी"===b?a+12:void 0},meridiem:function(a){return 4>a?"रात्री":10>a?"सकाळी":17>a?"दुपारी":20>a?"सायंकाळी":"रात्री"},week:{dow:0,doy:6}})}),function(a){a(vb)}(function(a){return a.defineLocale("ms-my",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"LT.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] LT",LLLL:"dddd, D MMMM YYYY [pukul] LT"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"tengahari"===b?a>=11?a:a+12:"petang"===b||"malam"===b?a+12:void 0},meridiem:function(a){return 11>a?"pagi":15>a?"tengahari":19>a?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){var b={1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",0:"၀"},c={"၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9","၀":"0"};return a.defineLocale("my",{months:"ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),monthsShort:"ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),weekdays:"တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),weekdaysShort:"နွေ_လာ_င်္ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),weekdaysMin:"နွေ_လာ_င်္ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[ယနေ.] LT [မှာ]",nextDay:"[မနက်ဖြန်] LT [မှာ]",nextWeek:"dddd LT [မှာ]",lastDay:"[မနေ.က] LT [မှာ]",lastWeek:"[ပြီးခဲ့သော] dddd LT [မှာ]",sameElse:"L"},relativeTime:{future:"လာမည့် %s မှာ",past:"လွန်ခဲ့သော %s က",s:"စက္ကန်.အနည်းငယ်",m:"တစ်မိနစ်",mm:"%d မိနစ်",h:"တစ်နာရီ",hh:"%d နာရီ",d:"တစ်ရက်",dd:"%d ရက်",M:"တစ်လ",MM:"%d လ",y:"တစ်နှစ်",yy:"%d နှစ်"},preparse:function(a){return a.replace(/[၁၂၃၄၅၆၇၈၉၀]/g,function(a){return c[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]})},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("nb",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tirs_ons_tors_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"H.mm",LTS:"LT.ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] LT",LLLL:"dddd D. MMMM YYYY [kl.] LT"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[i går kl.] LT",lastWeek:"[forrige] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s siden",s:"noen sekunder",m:"ett minutt",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dager",M:"en måned",MM:"%d måneder",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){var b={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},c={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};return a.defineLocale("ne",{months:"जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),monthsShort:"जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),weekdays:"आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),weekdaysShort:"आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),weekdaysMin:"आइ._सो._मङ्_बु._बि._शु._श.".split("_"),longDateFormat:{LT:"Aको h:mm बजे",LTS:"Aको h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return c[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]})},meridiemParse:/राती|बिहान|दिउँसो|बेलुका|साँझ|राती/,meridiemHour:function(a,b){return 12===a&&(a=0),"राती"===b?3>a?a:a+12:"बिहान"===b?a:"दिउँसो"===b?a>=10?a:a+12:"बेलुका"===b||"साँझ"===b?a+12:void 0},meridiem:function(a){return 3>a?"राती":10>a?"बिहान":15>a?"दिउँसो":18>a?"बेलुका":20>a?"साँझ":"राती"},calendar:{sameDay:"[आज] LT",nextDay:"[भोली] LT",nextWeek:"[आउँदो] dddd[,] LT",lastDay:"[हिजो] LT",lastWeek:"[गएको] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%sमा",past:"%s अगाडी",s:"केही समय",m:"एक मिनेट",mm:"%d मिनेट",h:"एक घण्टा",hh:"%d घण्टा",d:"एक दिन",dd:"%d दिन",M:"एक महिना",MM:"%d महिना",y:"एक बर्ष",yy:"%d बर्ष"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){var b="jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),c="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_");return a.defineLocale("nl",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(a,d){return/-MMM-/.test(d)?c[a.month()]:b[a.month()]},weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("nn",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),weekdaysShort:"sun_mån_tys_ons_tor_fre_lau".split("_"),weekdaysMin:"su_må_ty_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[I dag klokka] LT",nextDay:"[I morgon klokka] LT",nextWeek:"dddd [klokka] LT",lastDay:"[I går klokka] LT",lastWeek:"[Føregåande] dddd [klokka] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s sidan",s:"nokre sekund",m:"eit minutt",mm:"%d minutt",h:"ein time",hh:"%d timar",d:"ein dag",dd:"%d dagar",M:"ein månad",MM:"%d månader",y:"eit år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a){return 5>a%10&&a%10>1&&~~(a/10)%10!==1}function c(a,c,d){var e=a+" ";switch(d){case"m":return c?"minuta":"minutę";case"mm":return e+(b(a)?"minuty":"minut");case"h":return c?"godzina":"godzinę";case"hh":return e+(b(a)?"godziny":"godzin");case"MM":return e+(b(a)?"miesiące":"miesięcy");case"yy":return e+(b(a)?"lata":"lat")}}var d="styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"),e="stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_");return a.defineLocale("pl",{months:function(a,b){return/D MMMM/.test(b)?e[a.month()]:d[a.month()]},monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),weekdays:"niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),weekdaysShort:"nie_pon_wt_śr_czw_pt_sb".split("_"),weekdaysMin:"N_Pn_Wt_Śr_Cz_Pt_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Dziś o] LT",nextDay:"[Jutro o] LT",nextWeek:"[W] dddd [o] LT",lastDay:"[Wczoraj o] LT",lastWeek:function(){switch(this.day()){case 0:return"[W zeszłą niedzielę o] LT";case 3:return"[W zeszłą środę o] LT";case 6:return"[W zeszłą sobotę o] LT";default:return"[W zeszły] dddd [o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",m:c,mm:c,h:c,hh:c,d:"1 dzień",dd:"%d dni",M:"miesiąc",MM:c,y:"rok",yy:c},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("pt-br",{months:"janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),monthsShort:"jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),weekdays:"domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado".split("_"),weekdaysShort:"dom_seg_ter_qua_qui_sex_sáb".split("_"),weekdaysMin:"dom_2ª_3ª_4ª_5ª_6ª_sáb".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY [às] LT",LLLL:"dddd, D [de] MMMM [de] YYYY [às] LT"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"%s atrás",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº"})}),function(a){a(vb)}(function(a){return a.defineLocale("pt",{months:"janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),monthsShort:"jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),weekdays:"domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado".split("_"),weekdaysShort:"dom_seg_ter_qua_qui_sex_sáb".split("_"),weekdaysMin:"dom_2ª_3ª_4ª_5ª_6ª_sáb".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY LT",LLLL:"dddd, D [de] MMMM [de] YYYY LT"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"há %s",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d={mm:"minute",hh:"ore",dd:"zile",MM:"luni",yy:"ani"},e=" ";return(a%100>=20||a>=100&&a%100===0)&&(e=" de "),a+e+d[c]}return a.defineLocale("ro",{months:"ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),monthsShort:"ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),weekdays:"duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),weekdaysShort:"Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),weekdaysMin:"Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[azi la] LT",nextDay:"[mâine la] LT",nextWeek:"dddd [la] LT",lastDay:"[ieri la] LT",lastWeek:"[fosta] dddd [la] LT",sameElse:"L"},relativeTime:{future:"peste %s",past:"%s în urmă",s:"câteva secunde",m:"un minut",mm:b,h:"o oră",hh:b,d:"o zi",dd:b,M:"o lună",MM:b,y:"un an",yy:b},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){function b(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function c(a,c,d){var e={mm:c?"минута_минуты_минут":"минуту_минуты_минут",hh:"час_часа_часов",dd:"день_дня_дней",MM:"месяц_месяца_месяцев",yy:"год_года_лет"};return"m"===d?c?"минута":"минуту":a+" "+b(e[d],+a)}function d(a,b){var c={nominative:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),accusative:"января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function e(a,b){var c={nominative:"янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),accusative:"янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function f(a,b){var c={nominative:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),accusative:"воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_")},d=/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/.test(b)?"accusative":"nominative";return c[d][a.day()]}return a.defineLocale("ru",{months:d,monthsShort:e,weekdays:f,weekdaysShort:"вс_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),monthsParse:[/^янв/i,/^фев/i,/^мар/i,/^апр/i,/^ма[й|я]/i,/^июн/i,/^июл/i,/^авг/i,/^сен/i,/^окт/i,/^ноя/i,/^дек/i],longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., LT",LLLL:"dddd, D MMMM YYYY г., LT"},calendar:{sameDay:"[Сегодня в] LT",nextDay:"[Завтра в] LT",lastDay:"[Вчера в] LT",nextWeek:function(){return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT"},lastWeek:function(a){if(a.week()===this.week())return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT";switch(this.day()){case 0:return"[В прошлое] dddd [в] LT";case 1:case 2:case 4:return"[В прошлый] dddd [в] LT";case 3:case 5:case 6:return"[В прошлую] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:c,mm:c,h:"час",hh:c,d:"день",dd:c,M:"месяц",MM:c,y:"год",yy:c},meridiemParse:/ночи|утра|дня|вечера/i,isPM:function(a){return/^(дня|вечера)$/.test(a)},meridiem:function(a){return 4>a?"ночи":12>a?"утра":17>a?"дня":"вечера"},ordinalParse:/\d{1,2}-(й|го|я)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":return a+"-й";case"D":return a+"-го";case"w":case"W":return a+"-я";default:return a}},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){function b(a){return a>1&&5>a}function c(a,c,d,e){var f=a+" ";switch(d){case"s":return c||e?"pár sekúnd":"pár sekundami";case"m":return c?"minúta":e?"minútu":"minútou";case"mm":return c||e?f+(b(a)?"minúty":"minút"):f+"minútami";break;case"h":return c?"hodina":e?"hodinu":"hodinou";case"hh":return c||e?f+(b(a)?"hodiny":"hodín"):f+"hodinami";break;case"d":return c||e?"deň":"dňom";case"dd":return c||e?f+(b(a)?"dni":"dní"):f+"dňami";break;case"M":return c||e?"mesiac":"mesiacom";case"MM":return c||e?f+(b(a)?"mesiace":"mesiacov"):f+"mesiacmi";break;case"y":return c||e?"rok":"rokom";case"yy":return c||e?f+(b(a)?"roky":"rokov"):f+"rokmi"}}var d="január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_"),e="jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_");return a.defineLocale("sk",{months:d,monthsShort:e,monthsParse:function(a,b){var c,d=[];for(c=0;12>c;c++)d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(d,e),weekdays:"nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),weekdaysShort:"ne_po_ut_st_št_pi_so".split("_"),weekdaysMin:"ne_po_ut_st_št_pi_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd D. MMMM YYYY LT"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedeľu o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo štvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[včera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulú nedeľu o] LT";case 1:case 2:return"[minulý] dddd [o] LT";case 3:return"[minulú stredu o] LT";case 4:case 5:return"[minulý] dddd [o] LT";case 6:return"[minulú sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:c,m:c,mm:c,h:c,hh:c,d:c,dd:c,M:c,MM:c,y:c,yy:c},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d=a+" ";switch(c){case"m":return b?"ena minuta":"eno minuto";case"mm":return d+=1===a?"minuta":2===a?"minuti":3===a||4===a?"minute":"minut";case"h":return b?"ena ura":"eno uro";case"hh":return d+=1===a?"ura":2===a?"uri":3===a||4===a?"ure":"ur";case"dd":return d+=1===a?"dan":"dni";case"MM":return d+=1===a?"mesec":2===a?"meseca":3===a||4===a?"mesece":"mesecev";case"yy":return d+=1===a?"leto":2===a?"leti":3===a||4===a?"leta":"let"}}return a.defineLocale("sl",{months:"januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),weekdays:"nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),weekdaysShort:"ned._pon._tor._sre._čet._pet._sob.".split("_"),weekdaysMin:"ne_po_to_sr_če_pe_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danes ob] LT",nextDay:"[jutri ob] LT",nextWeek:function(){switch(this.day()){case 0:return"[v] [nedeljo] [ob] LT";case 3:return"[v] [sredo] [ob] LT";case 6:return"[v] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[v] dddd [ob] LT"}},lastDay:"[včeraj ob] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[prejšnja] dddd [ob] LT";case 1:case 2:case 4:case 5:return"[prejšnji] dddd [ob] LT"}},sameElse:"L"},relativeTime:{future:"čez %s",past:"%s nazaj",s:"nekaj sekund",m:b,mm:b,h:b,hh:b,d:"en dan",dd:b,M:"en mesec",MM:b,y:"eno leto",yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("sq",{months:"Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),monthsShort:"Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),weekdays:"E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),weekdaysShort:"Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),weekdaysMin:"D_H_Ma_Më_E_P_Sh".split("_"),meridiemParse:/PD|MD/,isPM:function(a){return"M"===a.charAt(0)},meridiem:function(a){return 12>a?"PD":"MD"},longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Sot në] LT",nextDay:"[Nesër në] LT",nextWeek:"dddd [në] LT",lastDay:"[Dje në] LT",lastWeek:"dddd [e kaluar në] LT",sameElse:"L"},relativeTime:{future:"në %s",past:"%s më parë",s:"disa sekonda",m:"një minutë",mm:"%d minuta",h:"një orë",hh:"%d orë",d:"një ditë",dd:"%d ditë",M:"një muaj",MM:"%d muaj",y:"një vit",yy:"%d vite"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){var b={words:{m:["један минут","једне минуте"],mm:["минут","минуте","минута"],h:["један сат","једног сата"],hh:["сат","сата","сати"],dd:["дан","дана","дана"],MM:["месец","месеца","месеци"],yy:["година","године","година"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,c,d){var e=b.words[d];return 1===d.length?c?e[0]:e[1]:a+" "+b.correctGrammaticalCase(a,e)}};return a.defineLocale("sr-cyrl",{months:["јануар","фебруар","март","април","мај","јун","јул","август","септембар","октобар","новембар","децембар"],monthsShort:["јан.","феб.","мар.","апр.","мај","јун","јул","авг.","сеп.","окт.","нов.","дец."],weekdays:["недеља","понедељак","уторак","среда","четвртак","петак","субота"],weekdaysShort:["нед.","пон.","уто.","сре.","чет.","пет.","суб."],weekdaysMin:["не","по","ут","ср","че","пе","су"],longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[данас у] LT",nextDay:"[сутра у] LT",nextWeek:function(){switch(this.day()){case 0:return"[у] [недељу] [у] LT";case 3:return"[у] [среду] [у] LT";case 6:return"[у] [суботу] [у] LT";case 1:case 2:case 4:case 5:return"[у] dddd [у] LT"}},lastDay:"[јуче у] LT",lastWeek:function(){var a=["[прошле] [недеље] [у] LT","[прошлог] [понедељка] [у] LT","[прошлог] [уторка] [у] LT","[прошле] [среде] [у] LT","[прошлог] [четвртка] [у] LT","[прошлог] [петка] [у] LT","[прошле] [суботе] [у] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"за %s",past:"пре %s",s:"неколико секунди",m:b.translate,mm:b.translate,h:b.translate,hh:b.translate,d:"дан",dd:b.translate,M:"месец",MM:b.translate,y:"годину",yy:b.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){var b={words:{m:["jedan minut","jedne minute"],mm:["minut","minute","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mesec","meseca","meseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,c,d){var e=b.words[d];return 1===d.length?c?e[0]:e[1]:a+" "+b.correctGrammaticalCase(a,e)}};return a.defineLocale("sr",{months:["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"],monthsShort:["jan.","feb.","mar.","apr.","maj","jun","jul","avg.","sep.","okt.","nov.","dec."],weekdays:["nedelja","ponedeljak","utorak","sreda","četvrtak","petak","subota"],weekdaysShort:["ned.","pon.","uto.","sre.","čet.","pet.","sub."],weekdaysMin:["ne","po","ut","sr","če","pe","su"],longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedelju] [u] LT";case 3:return"[u] [sredu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var a=["[prošle] [nedelje] [u] LT","[prošlog] [ponedeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"pre %s",s:"nekoliko sekundi",m:b.translate,mm:b.translate,h:b.translate,hh:b.translate,d:"dan",dd:b.translate,M:"mesec",MM:b.translate,y:"godinu",yy:b.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("sv",{months:"januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),weekdaysShort:"sön_mån_tis_ons_tor_fre_lör".split("_"),weekdaysMin:"sö_må_ti_on_to_fr_lö".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Idag] LT",nextDay:"[Imorgon] LT",lastDay:"[Igår] LT",nextWeek:"dddd LT",lastWeek:"[Förra] dddd[en] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"för %s sedan",s:"några sekunder",m:"en minut",mm:"%d minuter",h:"en timme",hh:"%d timmar",d:"en dag",dd:"%d dagar",M:"en månad",MM:"%d månader",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}(e|a)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"e":1===b?"a":2===b?"a":"e";return a+c},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("ta",{months:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),monthsShort:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),weekdays:"ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),weekdaysShort:"ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),weekdaysMin:"ஞா_தி_செ_பு_வி_வெ_ச".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[இன்று] LT",nextDay:"[நாளை] LT",nextWeek:"dddd, LT",lastDay:"[நேற்று] LT",lastWeek:"[கடந்த வாரம்] dddd, LT",sameElse:"L"},relativeTime:{future:"%s இல்",past:"%s முன்",s:"ஒரு சில விநாடிகள்",m:"ஒரு நிமிடம்",mm:"%d நிமிடங்கள்",h:"ஒரு மணி நேரம்",hh:"%d மணி நேரம்",d:"ஒரு நாள்",dd:"%d நாட்கள்",M:"ஒரு மாதம்",MM:"%d மாதங்கள்",y:"ஒரு வருடம்",yy:"%d ஆண்டுகள்"},ordinalParse:/\d{1,2}வது/,ordinal:function(a){return a+"வது"},meridiemParse:/யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,meridiem:function(a){return 2>a?" யாமம்":6>a?" வைகறை":10>a?" காலை":14>a?" நண்பகல்":18>a?" எற்பாடு":22>a?" மாலை":" யாமம்"},meridiemHour:function(a,b){return 12===a&&(a=0),"யாமம்"===b?2>a?a:a+12:"வைகறை"===b||"காலை"===b?a:"நண்பகல்"===b&&a>=10?a:a+12},week:{dow:0,doy:6}})}),function(a){a(vb)}(function(a){return a.defineLocale("th",{months:"มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),monthsShort:"มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split("_"),weekdays:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),weekdaysShort:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),weekdaysMin:"อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),longDateFormat:{LT:"H นาฬิกา m นาที",LTS:"LT s วินาที",L:"YYYY/MM/DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY เวลา LT",LLLL:"วันddddที่ D MMMM YYYY เวลา LT"},meridiemParse:/ก่อนเที่ยง|หลังเที่ยง/,isPM:function(a){return"หลังเที่ยง"===a
},meridiem:function(a){return 12>a?"ก่อนเที่ยง":"หลังเที่ยง"},calendar:{sameDay:"[วันนี้ เวลา] LT",nextDay:"[พรุ่งนี้ เวลา] LT",nextWeek:"dddd[หน้า เวลา] LT",lastDay:"[เมื่อวานนี้ เวลา] LT",lastWeek:"[วัน]dddd[ที่แล้ว เวลา] LT",sameElse:"L"},relativeTime:{future:"อีก %s",past:"%sที่แล้ว",s:"ไม่กี่วินาที",m:"1 นาที",mm:"%d นาที",h:"1 ชั่วโมง",hh:"%d ชั่วโมง",d:"1 วัน",dd:"%d วัน",M:"1 เดือน",MM:"%d เดือน",y:"1 ปี",yy:"%d ปี"}})}),function(a){a(vb)}(function(a){return a.defineLocale("tl-ph",{months:"Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),monthsShort:"Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),weekdays:"Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),weekdaysShort:"Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),weekdaysMin:"Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"MM/D/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM DD, YYYY LT"},calendar:{sameDay:"[Ngayon sa] LT",nextDay:"[Bukas sa] LT",nextWeek:"dddd [sa] LT",lastDay:"[Kahapon sa] LT",lastWeek:"dddd [huling linggo] LT",sameElse:"L"},relativeTime:{future:"sa loob ng %s",past:"%s ang nakalipas",s:"ilang segundo",m:"isang minuto",mm:"%d minuto",h:"isang oras",hh:"%d oras",d:"isang araw",dd:"%d araw",M:"isang buwan",MM:"%d buwan",y:"isang taon",yy:"%d taon"},ordinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){var b={1:"'inci",5:"'inci",8:"'inci",70:"'inci",80:"'inci",2:"'nci",7:"'nci",20:"'nci",50:"'nci",3:"'üncü",4:"'üncü",100:"'üncü",6:"'ncı",9:"'uncu",10:"'uncu",30:"'uncu",60:"'ıncı",90:"'ıncı"};return a.defineLocale("tr",{months:"Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),monthsShort:"Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),weekdays:"Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),weekdaysShort:"Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),weekdaysMin:"Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[yarın saat] LT",nextWeek:"[haftaya] dddd [saat] LT",lastDay:"[dün] LT",lastWeek:"[geçen hafta] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s önce",s:"birkaç saniye",m:"bir dakika",mm:"%d dakika",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir yıl",yy:"%d yıl"},ordinalParse:/\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,ordinal:function(a){if(0===a)return a+"'ıncı";var c=a%10,d=a%100-c,e=a>=100?100:null;return a+(b[c]||b[d]||b[e])},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("tzm-latn",{months:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),monthsShort:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),weekdays:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysShort:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysMin:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[asdkh g] LT",nextDay:"[aska g] LT",nextWeek:"dddd [g] LT",lastDay:"[assant g] LT",lastWeek:"dddd [g] LT",sameElse:"L"},relativeTime:{future:"dadkh s yan %s",past:"yan %s",s:"imik",m:"minuḍ",mm:"%d minuḍ",h:"saɛa",hh:"%d tassaɛin",d:"ass",dd:"%d ossan",M:"ayowr",MM:"%d iyyirn",y:"asgas",yy:"%d isgasn"},week:{dow:6,doy:12}})}),function(a){a(vb)}(function(a){return a.defineLocale("tzm",{months:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),monthsShort:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),weekdays:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysShort:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysMin:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[ⴰⵙⴷⵅ ⴴ] LT",nextDay:"[ⴰⵙⴽⴰ ⴴ] LT",nextWeek:"dddd [ⴴ] LT",lastDay:"[ⴰⵚⴰⵏⵜ ⴴ] LT",lastWeek:"dddd [ⴴ] LT",sameElse:"L"},relativeTime:{future:"ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",past:"ⵢⴰⵏ %s",s:"ⵉⵎⵉⴽ",m:"ⵎⵉⵏⵓⴺ",mm:"%d ⵎⵉⵏⵓⴺ",h:"ⵙⴰⵄⴰ",hh:"%d ⵜⴰⵙⵙⴰⵄⵉⵏ",d:"ⴰⵙⵙ",dd:"%d oⵙⵙⴰⵏ",M:"ⴰⵢoⵓⵔ",MM:"%d ⵉⵢⵢⵉⵔⵏ",y:"ⴰⵙⴳⴰⵙ",yy:"%d ⵉⵙⴳⴰⵙⵏ"},week:{dow:6,doy:12}})}),function(a){a(vb)}(function(a){function b(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function c(a,c,d){var e={mm:"хвилина_хвилини_хвилин",hh:"година_години_годин",dd:"день_дні_днів",MM:"місяць_місяці_місяців",yy:"рік_роки_років"};return"m"===d?c?"хвилина":"хвилину":"h"===d?c?"година":"годину":a+" "+b(e[d],+a)}function d(a,b){var c={nominative:"січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_"),accusative:"січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_")},d=/D[oD]? *MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function e(a,b){var c={nominative:"неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),accusative:"неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),genitive:"неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")},d=/(\[[ВвУу]\]) ?dddd/.test(b)?"accusative":/\[?(?:минулої|наступної)? ?\] ?dddd/.test(b)?"genitive":"nominative";return c[d][a.day()]}function f(a){return function(){return a+"о"+(11===this.hours()?"б":"")+"] LT"}}return a.defineLocale("uk",{months:d,monthsShort:"січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),weekdays:e,weekdaysShort:"нд_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY р.",LLL:"D MMMM YYYY р., LT",LLLL:"dddd, D MMMM YYYY р., LT"},calendar:{sameDay:f("[Сьогодні "),nextDay:f("[Завтра "),lastDay:f("[Вчора "),nextWeek:f("[У] dddd ["),lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return f("[Минулої] dddd [").call(this);case 1:case 2:case 4:return f("[Минулого] dddd [").call(this)}},sameElse:"L"},relativeTime:{future:"за %s",past:"%s тому",s:"декілька секунд",m:c,mm:c,h:"годину",hh:c,d:"день",dd:c,M:"місяць",MM:c,y:"рік",yy:c},meridiemParse:/ночі|ранку|дня|вечора/,isPM:function(a){return/^(дня|вечора)$/.test(a)},meridiem:function(a){return 4>a?"ночі":12>a?"ранку":17>a?"дня":"вечора"},ordinalParse:/\d{1,2}-(й|го)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a+"-й";case"D":return a+"-го";default:return a}},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("uz",{months:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),monthsShort:"янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),weekdays:"Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),weekdaysShort:"Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),weekdaysMin:"Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"D MMMM YYYY, dddd LT"},calendar:{sameDay:"[Бугун соат] LT [да]",nextDay:"[Эртага] LT [да]",nextWeek:"dddd [куни соат] LT [да]",lastDay:"[Кеча соат] LT [да]",lastWeek:"[Утган] dddd [куни соат] LT [да]",sameElse:"L"},relativeTime:{future:"Якин %s ичида",past:"Бир неча %s олдин",s:"фурсат",m:"бир дакика",mm:"%d дакика",h:"бир соат",hh:"%d соат",d:"бир кун",dd:"%d кун",M:"бир ой",MM:"%d ой",y:"бир йил",yy:"%d йил"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("vi",{months:"tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),monthsShort:"Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),weekdays:"chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),weekdaysShort:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysMin:"CN_T2_T3_T4_T5_T6_T7".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM [năm] YYYY",LLL:"D MMMM [năm] YYYY LT",LLLL:"dddd, D MMMM [năm] YYYY LT",l:"DD/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY LT",llll:"ddd, D MMM YYYY LT"},calendar:{sameDay:"[Hôm nay lúc] LT",nextDay:"[Ngày mai lúc] LT",nextWeek:"dddd [tuần tới lúc] LT",lastDay:"[Hôm qua lúc] LT",lastWeek:"dddd [tuần rồi lúc] LT",sameElse:"L"},relativeTime:{future:"%s tới",past:"%s trước",s:"vài giây",m:"một phút",mm:"%d phút",h:"một giờ",hh:"%d giờ",d:"một ngày",dd:"%d ngày",M:"một tháng",MM:"%d tháng",y:"một năm",yy:"%d năm"},ordinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("zh-cn",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah点mm",LTS:"Ah点m分s秒",L:"YYYY-MM-DD",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日LT",LLLL:"YYYY年MMMD日ddddLT",l:"YYYY-MM-DD",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日LT",llll:"YYYY年MMMD日ddddLT"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"凌晨"===b||"早上"===b||"上午"===b?a:"下午"===b||"晚上"===b?a+12:a>=11?a:a+12},meridiem:function(a,b){var c=100*a+b;return 600>c?"凌晨":900>c?"早上":1130>c?"上午":1230>c?"中午":1800>c?"下午":"晚上"},calendar:{sameDay:function(){return 0===this.minutes()?"[今天]Ah[点整]":"[今天]LT"},nextDay:function(){return 0===this.minutes()?"[明天]Ah[点整]":"[明天]LT"},lastDay:function(){return 0===this.minutes()?"[昨天]Ah[点整]":"[昨天]LT"},nextWeek:function(){var b,c;return b=a().startOf("week"),c=this.unix()-b.unix()>=604800?"[下]":"[本]",0===this.minutes()?c+"dddAh点整":c+"dddAh点mm"},lastWeek:function(){var b,c;return b=a().startOf("week"),c=this.unix()<b.unix()?"[上]":"[本]",0===this.minutes()?c+"dddAh点整":c+"dddAh点mm"},sameElse:"LL"},ordinalParse:/\d{1,2}(日|月|周)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"周";default:return a}},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1分钟",mm:"%d分钟",h:"1小时",hh:"%d小时",d:"1天",dd:"%d天",M:"1个月",MM:"%d个月",y:"1年",yy:"%d年"},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("zh-tw",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah點mm",LTS:"Ah點m分s秒",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日LT",LLLL:"YYYY年MMMD日ddddLT",l:"YYYY年MMMD日",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日LT",llll:"YYYY年MMMD日ddddLT"},meridiemParse:/早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"早上"===b||"上午"===b?a:"中午"===b?a>=11?a:a+12:"下午"===b||"晚上"===b?a+12:void 0},meridiem:function(a,b){var c=100*a+b;return 900>c?"早上":1130>c?"上午":1230>c?"中午":1800>c?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},ordinalParse:/\d{1,2}(日|月|週)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"週";default:return a}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",m:"一分鐘",mm:"%d分鐘",h:"一小時",hh:"%d小時",d:"一天",dd:"%d天",M:"一個月",MM:"%d個月",y:"一年",yy:"%d年"}})}),vb.locale("en"),Lb?module.exports=vb:"function"==typeof define&&define.amd?(define(function(a,b,c){return c.config&&c.config()&&c.config().noGlobal===!0&&(zb.moment=wb),vb}),ub(!0)):ub()}).call(this);
/*
  ractive.js v0.6.1
  2014-10-25 - commit 3a576eb3

  http://ractivejs.org
  http://twitter.com/RactiveJS

  Released under the MIT License.
*/

( function( global ) {

  'use strict';

  var noConflict = global.Ractive;

  /* config/defaults/options.js */
  var options = function() {

    var defaultOptions = {
      // render placement:
      el: void 0,
      append: false,
      // template:
      template: {
        v: 1,
        t: []
      },
      yield: null,
      // parse:
      preserveWhitespace: false,
      sanitize: false,
      stripComments: true,
      // data & binding:
      data: {},
      computed: {},
      magic: false,
      modifyArrays: true,
      adapt: [],
      isolated: false,
      twoway: true,
      lazy: false,
      // transitions:
      noIntro: false,
      transitionsEnabled: true,
      complete: void 0,
      // css:
      noCssTransform: false,
      // debug:
      debug: false
    };
    return defaultOptions;
  }();

  /* config/defaults/easing.js */
  var easing = {
    linear: function( pos ) {
      return pos;
    },
    easeIn: function( pos ) {
      return Math.pow( pos, 3 );
    },
    easeOut: function( pos ) {
      return Math.pow( pos - 1, 3 ) + 1;
    },
    easeInOut: function( pos ) {
      if ( ( pos /= 0.5 ) < 1 ) {
        return 0.5 * Math.pow( pos, 3 );
      }
      return 0.5 * ( Math.pow( pos - 2, 3 ) + 2 );
    }
  };

  /* circular.js */
  var circular = [];

  /* utils/hasOwnProperty.js */
  var hasOwn = Object.prototype.hasOwnProperty;

  /* utils/isArray.js */
  var isArray = function() {

    var toString = Object.prototype.toString;
    // thanks, http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
    return function( thing ) {
      return toString.call( thing ) === '[object Array]';
    };
  }();

  /* utils/isObject.js */
  var isObject = function() {

    var toString = Object.prototype.toString;
    return function( thing ) {
      return thing && toString.call( thing ) === '[object Object]';
    };
  }();

  /* utils/isNumeric.js */
  var isNumeric = function( thing ) {
    return !isNaN( parseFloat( thing ) ) && isFinite( thing );
  };

  /* config/defaults/interpolators.js */
  var interpolators = function( circular, hasOwnProperty, isArray, isObject, isNumeric ) {

    var interpolators, interpolate, cssLengthPattern;
    circular.push( function() {
      interpolate = circular.interpolate;
    } );
    cssLengthPattern = /^([+-]?[0-9]+\.?(?:[0-9]+)?)(px|em|ex|%|in|cm|mm|pt|pc)$/;
    interpolators = {
      number: function( from, to ) {
        var delta;
        if ( !isNumeric( from ) || !isNumeric( to ) ) {
          return null;
        }
        from = +from;
        to = +to;
        delta = to - from;
        if ( !delta ) {
          return function() {
            return from;
          };
        }
        return function( t ) {
          return from + t * delta;
        };
      },
      array: function( from, to ) {
        var intermediate, interpolators, len, i;
        if ( !isArray( from ) || !isArray( to ) ) {
          return null;
        }
        intermediate = [];
        interpolators = [];
        i = len = Math.min( from.length, to.length );
        while ( i-- ) {
          interpolators[ i ] = interpolate( from[ i ], to[ i ] );
        }
        // surplus values - don't interpolate, but don't exclude them either
        for ( i = len; i < from.length; i += 1 ) {
          intermediate[ i ] = from[ i ];
        }
        for ( i = len; i < to.length; i += 1 ) {
          intermediate[ i ] = to[ i ];
        }
        return function( t ) {
          var i = len;
          while ( i-- ) {
            intermediate[ i ] = interpolators[ i ]( t );
          }
          return intermediate;
        };
      },
      object: function( from, to ) {
        var properties, len, interpolators, intermediate, prop;
        if ( !isObject( from ) || !isObject( to ) ) {
          return null;
        }
        properties = [];
        intermediate = {};
        interpolators = {};
        for ( prop in from ) {
          if ( hasOwnProperty.call( from, prop ) ) {
            if ( hasOwnProperty.call( to, prop ) ) {
              properties.push( prop );
              interpolators[ prop ] = interpolate( from[ prop ], to[ prop ] );
            } else {
              intermediate[ prop ] = from[ prop ];
            }
          }
        }
        for ( prop in to ) {
          if ( hasOwnProperty.call( to, prop ) && !hasOwnProperty.call( from, prop ) ) {
            intermediate[ prop ] = to[ prop ];
          }
        }
        len = properties.length;
        return function( t ) {
          var i = len,
            prop;
          while ( i-- ) {
            prop = properties[ i ];
            intermediate[ prop ] = interpolators[ prop ]( t );
          }
          return intermediate;
        };
      }
    };
    return interpolators;
  }( circular, hasOwn, isArray, isObject, isNumeric );

  /* config/svg.js */
  var svg = function() {

    var svg;
    if ( typeof document === 'undefined' ) {
      svg = false;
    } else {
      svg = document && document.implementation.hasFeature( 'http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1' );
    }
    return svg;
  }();

  /* utils/warn.js */
  var warn = function() {

    /* global console */
    var warn, warned = {};
    if ( typeof console !== 'undefined' && typeof console.warn === 'function' && typeof console.warn.apply === 'function' ) {
      warn = function( message, allowDuplicates ) {
        if ( !allowDuplicates ) {
          if ( warned[ message ] ) {
            return;
          }
          warned[ message ] = true;
        }
        console.warn( '%cRactive.js: %c' + message, 'color: rgb(114, 157, 52);', 'color: rgb(85, 85, 85);' );
      };
    } else {
      warn = function() {};
    }
    return warn;
  }();

  /* config/errors.js */
  var errors = {
    missingParser: 'Missing Ractive.parse - cannot parse template. Either preparse or use the version that includes the parser',
    mergeComparisonFail: 'Merge operation: comparison failed. Falling back to identity checking',
    noComponentEventArguments: 'Components currently only support simple events - you cannot include arguments. Sorry!',
    noTemplateForPartial: 'Could not find template for partial "{name}"',
    noNestedPartials: 'Partials ({{>{name}}}) cannot contain nested inline partials',
    evaluationError: 'Error evaluating "{uniqueString}": {err}',
    badArguments: 'Bad arguments "{arguments}". I\'m not allowed to argue unless you\'ve paid.',
    failedComputation: 'Failed to compute "{key}": {err}',
    missingPlugin: 'Missing "{name}" {plugin} plugin. You may need to download a {plugin} via http://docs.ractivejs.org/latest/plugins#{plugin}s',
    badRadioInputBinding: 'A radio input can have two-way binding on its name attribute, or its checked attribute - not both',
    noRegistryFunctionReturn: 'A function was specified for "{name}" {registry}, but no {registry} was returned',
    defaultElSpecified: 'The <{name}/> component has a default `el` property; it has been disregarded',
    noElementProxyEventWildcards: 'Only component proxy-events may contain "*" wildcards, <{element} on-{event}/> is not valid.',
    methodDeprecated: 'The method "{deprecated}" has been deprecated in favor of "{replacement}" and will likely be removed in a future release. See http://docs.ractivejs.org/latest/migrating for more information.'
  };

  /* utils/log.js */
  var log = function( consolewarn, errors ) {

    var log = {
      warn: function( options, passthru ) {
        if ( !options.debug && !passthru ) {
          return;
        }
        this.warnAlways( options );
      },
      warnAlways: function( options ) {
        this.logger( getMessage( options ), options.allowDuplicates );
      },
      error: function( options ) {
        this.errorOnly( options );
        if ( !options.debug ) {
          this.warn( options, true );
        }
      },
      errorOnly: function( options ) {
        if ( options.debug ) {
          this.critical( options );
        }
      },
      critical: function( options ) {
        var err = options.err || new Error( getMessage( options ) );
        this.thrower( err );
      },
      logger: consolewarn,
      thrower: function( err ) {
        throw err;
      }
    };

    function getMessage( options ) {
      var message = errors[ options.message ] || options.message || '';
      return interpolate( message, options.args );
    }
    // simple interpolation. probably quicker (and better) out there,
    // but log is not in golden path of execution, only exceptions
    function interpolate( message, args ) {
      return message.replace( /{([^{}]*)}/g, function( a, b ) {
        return args[ b ];
      } );
    }
    return log;
  }( warn, errors );

  /* Ractive/prototype/shared/hooks/Hook.js */
  var Ractive$shared_hooks_Hook = function( log ) {

    var deprecations = {
      construct: {
        deprecated: 'beforeInit',
        replacement: 'onconstruct'
      },
      render: {
        deprecated: 'init',
        message: 'The "init" method has been deprecated ' + 'and will likely be removed in a future release. ' + 'You can either use the "oninit" method which will fire ' + 'only once prior to, and regardless of, any eventual ractive ' + 'instance being rendered, or if you need to access the ' + 'rendered DOM, use "onrender" instead. ' + 'See http://docs.ractivejs.org/latest/migrating for more information.'
      },
      complete: {
        deprecated: 'complete',
        replacement: 'oncomplete'
      }
    };

    function Hook( event ) {
      this.event = event;
      this.method = 'on' + event;
      this.deprecate = deprecations[ event ];
    }
    Hook.prototype.fire = function( ractive, arg ) {
      function call( method ) {
        if ( ractive[ method ] ) {
          arg ? ractive[ method ]( arg ) : ractive[ method ]();
          return true;
        }
      }
      call( this.method );
      if ( !ractive[ this.method ] && this.deprecate && call( this.deprecate.deprecated ) ) {
        log.warnAlways( {
          debug: ractive.debug,
          message: this.deprecate.message || 'methodDeprecated',
          args: this.deprecate
        } );
      }
      arg ? ractive.fire( this.event, arg ) : ractive.fire( this.event );
    };
    return Hook;
  }( log );

  /* utils/removeFromArray.js */
  var removeFromArray = function( array, member ) {
    var index = array.indexOf( member );
    if ( index !== -1 ) {
      array.splice( index, 1 );
    }
  };

  /* utils/Promise.js */
  var Promise = function() {

    var __export;
    var _Promise, PENDING = {},
      FULFILLED = {},
      REJECTED = {};
    if ( typeof Promise === 'function' ) {
      // use native Promise
      _Promise = Promise;
    } else {
      _Promise = function( callback ) {
        var fulfilledHandlers = [],
          rejectedHandlers = [],
          state = PENDING,
          result, dispatchHandlers, makeResolver, fulfil, reject, promise;
        makeResolver = function( newState ) {
          return function( value ) {
            if ( state !== PENDING ) {
              return;
            }
            result = value;
            state = newState;
            dispatchHandlers = makeDispatcher( state === FULFILLED ? fulfilledHandlers : rejectedHandlers, result );
            // dispatch onFulfilled and onRejected handlers asynchronously
            wait( dispatchHandlers );
          };
        };
        fulfil = makeResolver( FULFILLED );
        reject = makeResolver( REJECTED );
        try {
          callback( fulfil, reject );
        } catch ( err ) {
          reject( err );
        }
        promise = {
          // `then()` returns a Promise - 2.2.7
          then: function( onFulfilled, onRejected ) {
            var promise2 = new _Promise( function( fulfil, reject ) {
              var processResolutionHandler = function( handler, handlers, forward ) {
                // 2.2.1.1
                if ( typeof handler === 'function' ) {
                  handlers.push( function( p1result ) {
                    var x;
                    try {
                      x = handler( p1result );
                      resolve( promise2, x, fulfil, reject );
                    } catch ( err ) {
                      reject( err );
                    }
                  } );
                } else {
                  // Forward the result of promise1 to promise2, if resolution handlers
                  // are not given
                  handlers.push( forward );
                }
              };
              // 2.2
              processResolutionHandler( onFulfilled, fulfilledHandlers, fulfil );
              processResolutionHandler( onRejected, rejectedHandlers, reject );
              if ( state !== PENDING ) {
                // If the promise has resolved already, dispatch the appropriate handlers asynchronously
                wait( dispatchHandlers );
              }
            } );
            return promise2;
          }
        };
        promise[ 'catch' ] = function( onRejected ) {
          return this.then( null, onRejected );
        };
        return promise;
      };
      _Promise.all = function( promises ) {
        return new _Promise( function( fulfil, reject ) {
          var result = [],
            pending, i, processPromise;
          if ( !promises.length ) {
            fulfil( result );
            return;
          }
          processPromise = function( i ) {
            promises[ i ].then( function( value ) {
              result[ i ] = value;
              if ( !--pending ) {
                fulfil( result );
              }
            }, reject );
          };
          pending = i = promises.length;
          while ( i-- ) {
            processPromise( i );
          }
        } );
      };
      _Promise.resolve = function( value ) {
        return new _Promise( function( fulfil ) {
          fulfil( value );
        } );
      };
      _Promise.reject = function( reason ) {
        return new _Promise( function( fulfil, reject ) {
          reject( reason );
        } );
      };
    }
    __export = _Promise;
    // TODO use MutationObservers or something to simulate setImmediate
    function wait( callback ) {
      setTimeout( callback, 0 );
    }

    function makeDispatcher( handlers, result ) {
      return function() {
        var handler;
        while ( handler = handlers.shift() ) {
          handler( result );
        }
      };
    }

    function resolve( promise, x, fulfil, reject ) {
      // Promise Resolution Procedure
      var then;
      // 2.3.1
      if ( x === promise ) {
        throw new TypeError( 'A promise\'s fulfillment handler cannot return the same promise' );
      }
      // 2.3.2
      if ( x instanceof _Promise ) {
        x.then( fulfil, reject );
      } else if ( x && ( typeof x === 'object' || typeof x === 'function' ) ) {
        try {
          then = x.then;
        } catch ( e ) {
          reject( e );
          // 2.3.3.2
          return;
        }
        // 2.3.3.3
        if ( typeof then === 'function' ) {
          var called, resolvePromise, rejectPromise;
          resolvePromise = function( y ) {
            if ( called ) {
              return;
            }
            called = true;
            resolve( promise, y, fulfil, reject );
          };
          rejectPromise = function( r ) {
            if ( called ) {
              return;
            }
            called = true;
            reject( r );
          };
          try {
            then.call( x, resolvePromise, rejectPromise );
          } catch ( e ) {
            if ( !called ) {
              // 2.3.3.3.4.1
              reject( e );
              // 2.3.3.3.4.2
              called = true;
              return;
            }
          }
        } else {
          fulfil( x );
        }
      } else {
        fulfil( x );
      }
    }
    return __export;
  }();

  /* utils/normaliseRef.js */
  var normaliseRef = function() {

    var regex = /\[\s*(\*|[0-9]|[1-9][0-9]+)\s*\]/g;
    return function normaliseRef( ref ) {
      return ( ref || '' ).replace( regex, '.$1' );
    };
  }();

  /* shared/getInnerContext.js */
  var getInnerContext = function( fragment ) {
    do {
      if ( fragment.context !== undefined ) {
        return fragment.context;
      }
    } while ( fragment = fragment.parent );
    return '';
  };

  /* utils/isEqual.js */
  var isEqual = function( a, b ) {
    if ( a === null && b === null ) {
      return true;
    }
    if ( typeof a === 'object' || typeof b === 'object' ) {
      return false;
    }
    return a === b;
  };

  /* shared/createComponentBinding.js */
  var createComponentBinding = function( circular, isEqual ) {

    var runloop;
    circular.push( function() {
      return runloop = circular.runloop;
    } );
    var Binding = function( ractive, keypath, otherInstance, otherKeypath ) {
      var this$0 = this;
      this.root = ractive;
      this.keypath = keypath;
      this.otherInstance = otherInstance;
      this.otherKeypath = otherKeypath;
      this.lock = function() {
        return this$0.updating = true;
      };
      this.unlock = function() {
        return this$0.updating = false;
      };
      this.bind();
      this.value = this.root.viewmodel.get( this.keypath );
    };
    Binding.prototype = {
      isLocked: function() {
        return this.updating || this.counterpart && this.counterpart.updating;
      },
      shuffle: function( newIndices, value ) {
        this.propagateChange( value, newIndices );
      },
      setValue: function( value ) {
        this.propagateChange( value );
      },
      propagateChange: function( value, newIndices ) {
        var other;
        // Only *you* can prevent infinite loops
        if ( this.isLocked() ) {
          this.value = value;
          return;
        }
        if ( !isEqual( value, this.value ) ) {
          this.lock();
          // TODO maybe the case that `value === this.value` - should that result
          // in an update rather than a set?
          // if the other viewmodel is already locked up, need to do a deferred update
          if ( !runloop.addViewmodel( other = this.otherInstance.viewmodel ) && this.counterpart.value !== value ) {
            runloop.scheduleTask( function() {
              return runloop.addViewmodel( other );
            } );
          }
          if ( newIndices ) {
            other.smartUpdate( this.otherKeypath, value, newIndices );
          } else {
            if ( isSettable( other, this.otherKeypath ) ) {
              other.set( this.otherKeypath, value );
            }
          }
          this.value = value;
          // TODO will the counterpart update after this line, during
          // the runloop end cycle? may be a problem...
          runloop.scheduleTask( this.unlock );
        }
      },
      refineValue: function( keypaths ) {
        var this$0 = this;
        var other;
        if ( this.isLocked() ) {
          return;
        }
        this.lock();
        runloop.addViewmodel( other = this.otherInstance.viewmodel );
        keypaths.map( function( keypath ) {
          return this$0.otherKeypath + keypath.substr( this$0.keypath.length );
        } ).forEach( function( keypath ) {
          return other.mark( keypath );
        } );
        runloop.scheduleTask( this.unlock );
      },
      bind: function() {
        this.root.viewmodel.register( this.keypath, this );
      },
      rebind: function( newKeypath ) {
        this.unbind();
        this.keypath = newKeypath;
        this.counterpart.otherKeypath = newKeypath;
        this.bind();
      },
      unbind: function() {
        this.root.viewmodel.unregister( this.keypath, this );
      }
    };

    function isSettable( viewmodel, keypath ) {
      var computed = viewmodel.computations[ keypath ];
      return !computed || computed.setter;
    }
    return function createComponentBinding( component, parentInstance, parentKeypath, childKeypath ) {
      var hash, childInstance, bindings, parentToChildBinding, childToParentBinding;
      hash = parentKeypath + '=' + childKeypath;
      bindings = component.bindings;
      if ( bindings[ hash ] ) {
        // TODO does this ever happen?
        return;
      }
      childInstance = component.instance;
      parentToChildBinding = new Binding( parentInstance, parentKeypath, childInstance, childKeypath );
      bindings.push( parentToChildBinding );
      if ( childInstance.twoway ) {
        childToParentBinding = new Binding( childInstance, childKeypath, parentInstance, parentKeypath );
        bindings.push( childToParentBinding );
        parentToChildBinding.counterpart = childToParentBinding;
        childToParentBinding.counterpart = parentToChildBinding;
      }
      bindings[ hash ] = parentToChildBinding;
    };
  }( circular, isEqual );

  /* shared/resolveRef.js */
  var resolveRef = function( normaliseRef, getInnerContext, createComponentBinding ) {

    var __export;
    var ancestorErrorMessage, getOptions;
    ancestorErrorMessage = 'Could not resolve reference - too many "../" prefixes';
    getOptions = {
      evaluateWrapped: true
    };
    __export = function resolveRef( ractive, ref, fragment, isParentLookup ) {
      var context, key, index, keypath, parentValue, hasContextChain, parentKeys, childKeys, parentKeypath, childKeypath;
      ref = normaliseRef( ref );
      // If a reference begins '~/', it's a top-level reference
      if ( ref.substr( 0, 2 ) === '~/' ) {
        return ref.substring( 2 );
      }
      // If a reference begins with '.', it's either a restricted reference or
      // an ancestor reference...
      if ( ref.charAt( 0 ) === '.' ) {
        return resolveAncestorReference( getInnerContext( fragment ), ref );
      }
      // ...otherwise we need to find the keypath
      key = ref.split( '.' )[ 0 ];
      // get() in viewmodel creation means no fragment (yet)
      fragment = fragment || {};
      do {
        context = fragment.context;
        if ( !context ) {
          continue;
        }
        hasContextChain = true;
        parentValue = ractive.viewmodel.get( context, getOptions );
        if ( parentValue && ( typeof parentValue === 'object' || typeof parentValue === 'function' ) && key in parentValue ) {
          return context + '.' + ref;
        }
      } while ( fragment = fragment.parent );
      // Root/computed property?
      if ( key in ractive.data || key in ractive.viewmodel.computations ) {
        return ref;
      }
      // If this is an inline component, and it's not isolated, we
      // can try going up the scope chain
      if ( ractive._parent && !ractive.isolated ) {
        hasContextChain = true;
        fragment = ractive.component.parentFragment;
        // Special case - index refs
        if ( fragment.indexRefs && ( index = fragment.indexRefs[ ref ] ) !== undefined ) {
          // Create an index ref binding, so that it can be rebound letter if necessary.
          // It doesn't have an alias since it's an implicit binding, hence `...[ ref ] = ref`
          ractive.component.indexRefBindings[ ref ] = ref;
          ractive.viewmodel.set( ref, index, true );
          return;
        }
        keypath = resolveRef( ractive._parent, ref, fragment, true );
        if ( keypath ) {
          // We need to create an inter-component binding
          // If parent keypath is 'one.foo' and child is 'two.foo', we bind
          // 'one' to 'two' as it's more efficient and avoids edge cases
          parentKeys = keypath.split( '.' );
          childKeys = ref.split( '.' );
          while ( parentKeys.length > 1 && childKeys.length > 1 && parentKeys[ parentKeys.length - 1 ] === childKeys[ childKeys.length - 1 ] ) {
            parentKeys.pop();
            childKeys.pop();
          }
          parentKeypath = parentKeys.join( '.' );
          childKeypath = childKeys.join( '.' );
          ractive.viewmodel.set( childKeypath, ractive._parent.viewmodel.get( parentKeypath ), true );
          createComponentBinding( ractive.component, ractive._parent, parentKeypath, childKeypath );
          return ref;
        }
      }
      // If there's no context chain, and the instance is either a) isolated or
      // b) an orphan, then we know that the keypath is identical to the reference
      if ( !isParentLookup && !hasContextChain ) {
        // the data object needs to have a property by this name,
        // to prevent future failed lookups
        ractive.viewmodel.set( ref, undefined );
        return ref;
      }
      if ( ractive.viewmodel.get( ref ) !== undefined ) {
        return ref;
      }
    };

    function resolveAncestorReference( baseContext, ref ) {
      var contextKeys;
      // {{.}} means 'current context'
      if ( ref === '.' )
        return baseContext;
      contextKeys = baseContext ? baseContext.split( '.' ) : [];
      // ancestor references (starting "../") go up the tree
      if ( ref.substr( 0, 3 ) === '../' ) {
        while ( ref.substr( 0, 3 ) === '../' ) {
          if ( !contextKeys.length ) {
            throw new Error( ancestorErrorMessage );
          }
          contextKeys.pop();
          ref = ref.substring( 3 );
        }
        contextKeys.push( ref );
        return contextKeys.join( '.' );
      }
      // not an ancestor reference - must be a restricted reference (prepended with "." or "./")
      if ( !baseContext ) {
        return ref.replace( /^\.\/?/, '' );
      }
      return baseContext + ref.replace( /^\.\//, '.' );
    }
    return __export;
  }( normaliseRef, getInnerContext, createComponentBinding );

  /* global/TransitionManager.js */
  var TransitionManager = function( removeFromArray ) {

    var TransitionManager = function( callback, parent ) {
      this.callback = callback;
      this.parent = parent;
      this.intros = [];
      this.outros = [];
      this.children = [];
      this.totalChildren = this.outroChildren = 0;
      this.detachQueue = [];
      this.outrosComplete = false;
      if ( parent ) {
        parent.addChild( this );
      }
    };
    TransitionManager.prototype = {
      addChild: function( child ) {
        this.children.push( child );
        this.totalChildren += 1;
        this.outroChildren += 1;
      },
      decrementOutros: function() {
        this.outroChildren -= 1;
        check( this );
      },
      decrementTotal: function() {
        this.totalChildren -= 1;
        check( this );
      },
      add: function( transition ) {
        var list = transition.isIntro ? this.intros : this.outros;
        list.push( transition );
      },
      remove: function( transition ) {
        var list = transition.isIntro ? this.intros : this.outros;
        removeFromArray( list, transition );
        check( this );
      },
      init: function() {
        this.ready = true;
        check( this );
      },
      detachNodes: function() {
        this.detachQueue.forEach( detach );
        this.children.forEach( detachNodes );
      }
    };

    function detach( element ) {
      element.detach();
    }

    function detachNodes( tm ) {
      tm.detachNodes();
    }

    function check( tm ) {
      if ( !tm.ready || tm.outros.length || tm.outroChildren )
        return;
      // If all outros are complete, and we haven't already done this,
      // we notify the parent if there is one, otherwise
      // start detaching nodes
      if ( !tm.outrosComplete ) {
        if ( tm.parent ) {
          tm.parent.decrementOutros( tm );
        } else {
          tm.detachNodes();
        }
        tm.outrosComplete = true;
      }
      // Once everything is done, we can notify parent transition
      // manager and call the callback
      if ( !tm.intros.length && !tm.totalChildren ) {
        if ( typeof tm.callback === 'function' ) {
          tm.callback();
        }
        if ( tm.parent ) {
          tm.parent.decrementTotal();
        }
      }
    }
    return TransitionManager;
  }( removeFromArray );

  /* global/runloop.js */
  var runloop = function( circular, Hook, removeFromArray, Promise, resolveRef, TransitionManager ) {

    var __export;
    var batch, runloop, unresolved = [],
      changeHook = new Hook( 'change' );
    runloop = {
      start: function( instance, returnPromise ) {
        var promise, fulfilPromise;
        if ( returnPromise ) {
          promise = new Promise( function( f ) {
            return fulfilPromise = f;
          } );
        }
        batch = {
          previousBatch: batch,
          transitionManager: new TransitionManager( fulfilPromise, batch && batch.transitionManager ),
          views: [],
          tasks: [],
          viewmodels: [],
          instance: instance
        };
        if ( instance ) {
          batch.viewmodels.push( instance.viewmodel );
        }
        return promise;
      },
      end: function() {
        flushChanges();
        batch.transitionManager.init();
        if ( !batch.previousBatch && !!batch.instance )
          batch.instance.viewmodel.changes = [];
        batch = batch.previousBatch;
      },
      addViewmodel: function( viewmodel ) {
        if ( batch ) {
          if ( batch.viewmodels.indexOf( viewmodel ) === -1 ) {
            batch.viewmodels.push( viewmodel );
            return true;
          } else {
            return false;
          }
        } else {
          viewmodel.applyChanges();
          return false;
        }
      },
      registerTransition: function( transition ) {
        transition._manager = batch.transitionManager;
        batch.transitionManager.add( transition );
      },
      addView: function( view ) {
        batch.views.push( view );
      },
      addUnresolved: function( thing ) {
        unresolved.push( thing );
      },
      removeUnresolved: function( thing ) {
        removeFromArray( unresolved, thing );
      },
      // synchronise node detachments with transition ends
      detachWhenReady: function( thing ) {
        batch.transitionManager.detachQueue.push( thing );
      },
      scheduleTask: function( task, postRender ) {
        var _batch;
        if ( !batch ) {
          task();
        } else {
          _batch = batch;
          while ( postRender && _batch.previousBatch ) {
            // this can't happen until the DOM has been fully updated
            // otherwise in some situations (with components inside elements)
            // transitions and decorators will initialise prematurely
            _batch = _batch.previousBatch;
          }
          _batch.tasks.push( task );
        }
      }
    };
    circular.runloop = runloop;
    __export = runloop;

    function flushChanges() {
      var i, thing, changeHash;
      for ( i = 0; i < batch.viewmodels.length; i += 1 ) {
        thing = batch.viewmodels[ i ];
        changeHash = thing.applyChanges();
        if ( changeHash ) {
          changeHook.fire( thing.ractive, changeHash );
        }
      }
      batch.viewmodels.length = 0;
      attemptKeypathResolution();
      // Now that changes have been fully propagated, we can update the DOM
      // and complete other tasks
      for ( i = 0; i < batch.views.length; i += 1 ) {
        batch.views[ i ].update();
      }
      batch.views.length = 0;
      for ( i = 0; i < batch.tasks.length; i += 1 ) {
        batch.tasks[ i ]();
      }
      batch.tasks.length = 0;
      // If updating the view caused some model blowback - e.g. a triple
      // containing <option> elements caused the binding on the <select>
      // to update - then we start over
      if ( batch.viewmodels.length )
        return flushChanges();
    }

    function attemptKeypathResolution() {
      var i, item, keypath, resolved;
      i = unresolved.length;
      // see if we can resolve any unresolved references
      while ( i-- ) {
        item = unresolved[ i ];
        if ( item.keypath ) {
          // it resolved some other way. TODO how? two-way binding? Seems
          // weird that we'd still end up here
          unresolved.splice( i, 1 );
        }
        if ( keypath = resolveRef( item.root, item.ref, item.parentFragment ) ) {
          ( resolved || ( resolved = [] ) ).push( {
            item: item,
            keypath: keypath
          } );
          unresolved.splice( i, 1 );
        }
      }
      if ( resolved ) {
        resolved.forEach( resolve );
      }
    }

    function resolve( resolved ) {
      resolved.item.resolve( resolved.keypath );
    }
    return __export;
  }( circular, Ractive$shared_hooks_Hook, removeFromArray, Promise, resolveRef, TransitionManager );

  /* utils/createBranch.js */
  var createBranch = function() {

    var numeric = /^\s*[0-9]+\s*$/;
    return function( key ) {
      return numeric.test( key ) ? [] : {};
    };
  }();

  /* viewmodel/prototype/get/magicAdaptor.js */
  var viewmodel$get_magicAdaptor = function( runloop, createBranch, isArray ) {

    var __export;
    var magicAdaptor, MagicWrapper;
    try {
      Object.defineProperty( {}, 'test', {
        value: 0
      } );
      magicAdaptor = {
        filter: function( object, keypath, ractive ) {
          var keys, key, parentKeypath, parentWrapper, parentValue;
          if ( !keypath ) {
            return false;
          }
          keys = keypath.split( '.' );
          key = keys.pop();
          parentKeypath = keys.join( '.' );
          // If the parent value is a wrapper, other than a magic wrapper,
          // we shouldn't wrap this property
          if ( ( parentWrapper = ractive.viewmodel.wrapped[ parentKeypath ] ) && !parentWrapper.magic ) {
            return false;
          }
          parentValue = ractive.get( parentKeypath );
          // if parentValue is an array that doesn't include this member,
          // we should return false otherwise lengths will get messed up
          if ( isArray( parentValue ) && /^[0-9]+$/.test( key ) ) {
            return false;
          }
          return parentValue && ( typeof parentValue === 'object' || typeof parentValue === 'function' );
        },
        wrap: function( ractive, property, keypath ) {
          return new MagicWrapper( ractive, property, keypath );
        }
      };
      MagicWrapper = function( ractive, value, keypath ) {
        var keys, objKeypath, template, siblings;
        this.magic = true;
        this.ractive = ractive;
        this.keypath = keypath;
        this.value = value;
        keys = keypath.split( '.' );
        this.prop = keys.pop();
        objKeypath = keys.join( '.' );
        this.obj = objKeypath ? ractive.get( objKeypath ) : ractive.data;
        template = this.originalDescriptor = Object.getOwnPropertyDescriptor( this.obj, this.prop );
        // Has this property already been wrapped?
        if ( template && template.set && ( siblings = template.set._ractiveWrappers ) ) {
          // Yes. Register this wrapper to this property, if it hasn't been already
          if ( siblings.indexOf( this ) === -1 ) {
            siblings.push( this );
          }
          return;
        }
        // No, it hasn't been wrapped
        createAccessors( this, value, template );
      };
      MagicWrapper.prototype = {
        get: function() {
          return this.value;
        },
        reset: function( value ) {
          if ( this.updating ) {
            return;
          }
          this.updating = true;
          this.obj[ this.prop ] = value;
          // trigger set() accessor
          runloop.addViewmodel( this.ractive.viewmodel );
          this.ractive.viewmodel.mark( this.keypath );
          this.updating = false;
        },
        set: function( key, value ) {
          if ( this.updating ) {
            return;
          }
          if ( !this.obj[ this.prop ] ) {
            this.updating = true;
            this.obj[ this.prop ] = createBranch( key );
            this.updating = false;
          }
          this.obj[ this.prop ][ key ] = value;
        },
        teardown: function() {
          var template, set, value, wrappers, index;
          // If this method was called because the cache was being cleared as a
          // result of a set()/update() call made by this wrapper, we return false
          // so that it doesn't get torn down
          if ( this.updating ) {
            return false;
          }
          template = Object.getOwnPropertyDescriptor( this.obj, this.prop );
          set = template && template.set;
          if ( !set ) {
            // most likely, this was an array member that was spliced out
            return;
          }
          wrappers = set._ractiveWrappers;
          index = wrappers.indexOf( this );
          if ( index !== -1 ) {
            wrappers.splice( index, 1 );
          }
          // Last one out, turn off the lights
          if ( !wrappers.length ) {
            value = this.obj[ this.prop ];
            Object.defineProperty( this.obj, this.prop, this.originalDescriptor || {
              writable: true,
              enumerable: true,
              configurable: true
            } );
            this.obj[ this.prop ] = value;
          }
        }
      };
    } catch ( err ) {
      magicAdaptor = false;
    }
    __export = magicAdaptor;

    function createAccessors( originalWrapper, value, template ) {
      var object, property, oldGet, oldSet, get, set;
      object = originalWrapper.obj;
      property = originalWrapper.prop;
      // Is this template configurable?
      if ( template && !template.configurable ) {
        // Special case - array length
        if ( property === 'length' ) {
          return;
        }
        throw new Error( 'Cannot use magic mode with property "' + property + '" - object is not configurable' );
      }
      // Time to wrap this property
      if ( template ) {
        oldGet = template.get;
        oldSet = template.set;
      }
      get = oldGet || function() {
        return value;
      };
      set = function( v ) {
        if ( oldSet ) {
          oldSet( v );
        }
        value = oldGet ? oldGet() : v;
        set._ractiveWrappers.forEach( updateWrapper );
      };

      function updateWrapper( wrapper ) {
        var keypath, ractive;
        wrapper.value = value;
        if ( wrapper.updating ) {
          return;
        }
        ractive = wrapper.ractive;
        keypath = wrapper.keypath;
        wrapper.updating = true;
        runloop.start( ractive );
        ractive.viewmodel.mark( keypath );
        runloop.end();
        wrapper.updating = false;
      }
      // Create an array of wrappers, in case other keypaths/ractives depend on this property.
      // Handily, we can store them as a property of the set function. Yay JavaScript.
      set._ractiveWrappers = [ originalWrapper ];
      Object.defineProperty( object, property, {
        get: get,
        set: set,
        enumerable: true,
        configurable: true
      } );
    }
    return __export;
  }( runloop, createBranch, isArray );

  /* config/magic.js */
  var magic = function( magicAdaptor ) {

    return !!magicAdaptor;
  }( viewmodel$get_magicAdaptor );

  /* config/namespaces.js */
  var namespaces = {
    html: 'http://www.w3.org/1999/xhtml',
    mathml: 'http://www.w3.org/1998/Math/MathML',
    svg: 'http://www.w3.org/2000/svg',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/'
  };

  /* utils/createElement.js */
  var createElement = function( svg, namespaces ) {

    var createElement;
    // Test for SVG support
    if ( !svg ) {
      createElement = function( type, ns ) {
        if ( ns && ns !== namespaces.html ) {
          throw 'This browser does not support namespaces other than http://www.w3.org/1999/xhtml. The most likely cause of this error is that you\'re trying to render SVG in an older browser. See http://docs.ractivejs.org/latest/svg-and-older-browsers for more information';
        }
        return document.createElement( type );
      };
    } else {
      createElement = function( type, ns ) {
        if ( !ns || ns === namespaces.html ) {
          return document.createElement( type );
        }
        return document.createElementNS( ns, type );
      };
    }
    return createElement;
  }( svg, namespaces );

  /* config/isClient.js */
  var isClient = function() {

    var isClient = typeof document === 'object';
    return isClient;
  }();

  /* utils/defineProperty.js */
  var defineProperty = function( isClient ) {

    var defineProperty;
    try {
      Object.defineProperty( {}, 'test', {
        value: 0
      } );
      if ( isClient ) {
        Object.defineProperty( document.createElement( 'div' ), 'test', {
          value: 0
        } );
      }
      defineProperty = Object.defineProperty;
    } catch ( err ) {
      // Object.defineProperty doesn't exist, or we're in IE8 where you can
      // only use it with DOM objects (what the fuck were you smoking, MSFT?)
      defineProperty = function( obj, prop, desc ) {
        obj[ prop ] = desc.value;
      };
    }
    return defineProperty;
  }( isClient );

  /* utils/defineProperties.js */
  var defineProperties = function( createElement, defineProperty, isClient ) {

    var defineProperties;
    try {
      try {
        Object.defineProperties( {}, {
          test: {
            value: 0
          }
        } );
      } catch ( err ) {
        // TODO how do we account for this? noMagic = true;
        throw err;
      }
      if ( isClient ) {
        Object.defineProperties( createElement( 'div' ), {
          test: {
            value: 0
          }
        } );
      }
      defineProperties = Object.defineProperties;
    } catch ( err ) {
      defineProperties = function( obj, props ) {
        var prop;
        for ( prop in props ) {
          if ( props.hasOwnProperty( prop ) ) {
            defineProperty( obj, prop, props[ prop ] );
          }
        }
      };
    }
    return defineProperties;
  }( createElement, defineProperty, isClient );

  /* Ractive/prototype/shared/add.js */
  var Ractive$shared_add = function( isNumeric ) {

    return function add( root, keypath, d ) {
      var value;
      if ( typeof keypath !== 'string' || !isNumeric( d ) ) {
        throw new Error( 'Bad arguments' );
      }
      value = +root.get( keypath ) || 0;
      if ( !isNumeric( value ) ) {
        throw new Error( 'Cannot add to a non-numeric value' );
      }
      return root.set( keypath, value + d );
    };
  }( isNumeric );

  /* Ractive/prototype/add.js */
  var Ractive$add = function( add ) {

    return function Ractive$add( keypath, d ) {
      return add( this, keypath, d === undefined ? 1 : +d );
    };
  }( Ractive$shared_add );

  /* utils/normaliseKeypath.js */
  var normaliseKeypath = function( normaliseRef ) {

    var leadingDot = /^\.+/;
    return function normaliseKeypath( keypath ) {
      return normaliseRef( keypath ).replace( leadingDot, '' );
    };
  }( normaliseRef );

  /* config/vendors.js */
  var vendors = [
    'o',
    'ms',
    'moz',
    'webkit'
  ];

  /* utils/requestAnimationFrame.js */
  var requestAnimationFrame = function( vendors ) {

    var requestAnimationFrame;
    // If window doesn't exist, we don't need requestAnimationFrame
    if ( typeof window === 'undefined' ) {
      requestAnimationFrame = null;
    } else {
      // https://gist.github.com/paulirish/1579671
      ( function( vendors, lastTime, window ) {
        var x, setTimeout;
        if ( window.requestAnimationFrame ) {
          return;
        }
        for ( x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ) {
          window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
        }
        if ( !window.requestAnimationFrame ) {
          setTimeout = window.setTimeout;
          window.requestAnimationFrame = function( callback ) {
            var currTime, timeToCall, id;
            currTime = Date.now();
            timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
            id = setTimeout( function() {
              callback( currTime + timeToCall );
            }, timeToCall );
            lastTime = currTime + timeToCall;
            return id;
          };
        }
      }( vendors, 0, window ) );
      requestAnimationFrame = window.requestAnimationFrame;
    }
    return requestAnimationFrame;
  }( vendors );

  /* utils/getTime.js */
  var getTime = function() {

    var getTime;
    if ( typeof window !== 'undefined' && window.performance && typeof window.performance.now === 'function' ) {
      getTime = function() {
        return window.performance.now();
      };
    } else {
      getTime = function() {
        return Date.now();
      };
    }
    return getTime;
  }();

  /* shared/animations.js */
  var animations = function( rAF, getTime, runloop ) {

    var queue = [];
    var animations = {
      tick: function() {
        var i, animation, now;
        now = getTime();
        runloop.start();
        for ( i = 0; i < queue.length; i += 1 ) {
          animation = queue[ i ];
          if ( !animation.tick( now ) ) {
            // animation is complete, remove it from the stack, and decrement i so we don't miss one
            queue.splice( i--, 1 );
          }
        }
        runloop.end();
        if ( queue.length ) {
          rAF( animations.tick );
        } else {
          animations.running = false;
        }
      },
      add: function( animation ) {
        queue.push( animation );
        if ( !animations.running ) {
          animations.running = true;
          rAF( animations.tick );
        }
      },
      // TODO optimise this
      abort: function( keypath, root ) {
        var i = queue.length,
          animation;
        while ( i-- ) {
          animation = queue[ i ];
          if ( animation.root === root && animation.keypath === keypath ) {
            animation.stop();
          }
        }
      }
    };
    return animations;
  }( requestAnimationFrame, getTime, runloop );

  /* config/options/css/transform.js */
  var transform = function() {

    var __export;
    var selectorsPattern = /(?:^|\})?\s*([^\{\}]+)\s*\{/g,
      commentsPattern = /\/\*.*?\*\//g,
      selectorUnitPattern = /((?:(?:\[[^\]+]\])|(?:[^\s\+\>\~:]))+)((?::[^\s\+\>\~]+)?\s*[\s\+\>\~]?)\s*/g,
      mediaQueryPattern = /^@media/,
      dataRvcGuidPattern = /\[data-rvcguid="[a-z0-9-]+"]/g;
    __export = function transformCss( css, guid ) {
      var transformed, addGuid;
      addGuid = function( selector ) {
        var selectorUnits, match, unit, dataAttr, base, prepended, appended, i, transformed = [];
        selectorUnits = [];
        while ( match = selectorUnitPattern.exec( selector ) ) {
          selectorUnits.push( {
            str: match[ 0 ],
            base: match[ 1 ],
            modifiers: match[ 2 ]
          } );
        }
        // For each simple selector within the selector, we need to create a version
        // that a) combines with the guid, and b) is inside the guid
        dataAttr = '[data-rvcguid="' + guid + '"]';
        base = selectorUnits.map( extractString );
        i = selectorUnits.length;
        while ( i-- ) {
          appended = base.slice();
          // Pseudo-selectors should go after the attribute selector
          unit = selectorUnits[ i ];
          appended[ i ] = unit.base + dataAttr + unit.modifiers || '';
          prepended = base.slice();
          prepended[ i ] = dataAttr + ' ' + prepended[ i ];
          transformed.push( appended.join( ' ' ), prepended.join( ' ' ) );
        }
        return transformed.join( ', ' );
      };
      if ( dataRvcGuidPattern.test( css ) ) {
        transformed = css.replace( dataRvcGuidPattern, '[data-rvcguid="' + guid + '"]' );
      } else {
        transformed = css.replace( commentsPattern, '' ).replace( selectorsPattern, function( match, $1 ) {
          var selectors, transformed;
          // don't transform media queries!
          if ( mediaQueryPattern.test( $1 ) )
            return match;
          selectors = $1.split( ',' ).map( trim );
          transformed = selectors.map( addGuid ).join( ', ' ) + ' ';
          return match.replace( $1, transformed );
        } );
      }
      return transformed;
    };

    function trim( str ) {
      if ( str.trim ) {
        return str.trim();
      }
      return str.replace( /^\s+/, '' ).replace( /\s+$/, '' );
    }

    function extractString( unit ) {
      return unit.str;
    }
    return __export;
  }();

  /* config/options/css/css.js */
  var css = function( transformCss ) {

    var cssConfig = {
      name: 'css',
      extend: extend,
      init: function() {}
    };

    function extend( Parent, proto, options ) {
      var guid = proto.constructor._guid,
        css;
      if ( css = getCss( options.css, options, guid ) || getCss( Parent.css, Parent, guid ) ) {
        proto.constructor.css = css;
      }
    }

    function getCss( css, target, guid ) {
      if ( !css ) {
        return;
      }
      return target.noCssTransform ? css : transformCss( css, guid );
    }
    return cssConfig;
  }( transform );

  /* utils/wrapMethod.js */
  var wrapMethod = function() {

    var __export;
    __export = function( method, superMethod, force ) {
      if ( force || needsSuper( method, superMethod ) ) {
        return function() {
          var hasSuper = '_super' in this,
            _super = this._super,
            result;
          this._super = superMethod;
          result = method.apply( this, arguments );
          if ( hasSuper ) {
            this._super = _super;
          }
          return result;
        };
      } else {
        return method;
      }
    };

    function needsSuper( method, superMethod ) {
      return typeof superMethod === 'function' && /_super/.test( method );
    }
    return __export;
  }();

  /* config/options/data.js */
  var data = function( wrap ) {

    var __export;
    var dataConfig = {
      name: 'data',
      extend: extend,
      init: init,
      reset: reset
    };
    __export = dataConfig;

    function combine( Parent, target, options ) {
      var value = options.data || {},
        parentValue = getAddedKeys( Parent.prototype.data );
      if ( typeof value !== 'object' && typeof value !== 'function' ) {
        throw new TypeError( 'data option must be an object or a function, "' + value + '" is not valid' );
      }
      return dispatch( parentValue, value );
    }

    function extend( Parent, proto, options ) {
      proto.data = combine( Parent, proto, options );
    }

    function init( Parent, ractive, options ) {
      var value = options.data,
        result = combine( Parent, ractive, options );
      if ( typeof result === 'function' ) {
        result = result.call( ractive, value ) || value;
      }
      return ractive.data = result || {};
    }

    function reset( ractive ) {
      var result = this.init( ractive.constructor, ractive, ractive );
      if ( result ) {
        ractive.data = result;
        return true;
      }
    }

    function getAddedKeys( parent ) {
      // only for functions that had keys added
      if ( typeof parent !== 'function' || !Object.keys( parent ).length ) {
        return parent;
      }
      // copy the added keys to temp 'object', otherwise
      // parent would be interpreted as 'function' by dispatch
      var temp = {};
      copy( parent, temp );
      // roll in added keys
      return dispatch( parent, temp );
    }

    function dispatch( parent, child ) {
      if ( typeof child === 'function' ) {
        return extendFn( child, parent );
      } else if ( typeof parent === 'function' ) {
        return fromFn( child, parent );
      } else {
        return fromProperties( child, parent );
      }
    }

    function copy( from, to, fillOnly ) {
      for ( var key in from ) {
        if ( fillOnly && key in to ) {
          continue;
        }
        to[ key ] = from[ key ];
      }
    }

    function fromProperties( child, parent ) {
      child = child || {};
      if ( !parent ) {
        return child;
      }
      copy( parent, child, true );
      return child;
    }

    function fromFn( child, parentFn ) {
      return function( data ) {
        var keys;
        if ( child ) {
          // Track the keys that our on the child,
          // but not on the data. We'll need to apply these
          // after the parent function returns.
          keys = [];
          for ( var key in child ) {
            if ( !data || !( key in data ) ) {
              keys.push( key );
            }
          }
        }
        // call the parent fn, use data if no return value
        data = parentFn.call( this, data ) || data;
        // Copy child keys back onto data. The child keys
        // should take precedence over whatever the
        // parent did with the data.
        if ( keys && keys.length ) {
          data = data || {};
          keys.forEach( function( key ) {
            data[ key ] = child[ key ];
          } );
        }
        return data;
      };
    }

    function extendFn( childFn, parent ) {
      var parentFn;
      if ( typeof parent !== 'function' ) {
        // copy props to data
        parentFn = function( data ) {
          fromProperties( data, parent );
        };
      } else {
        parentFn = function( data ) {
          // give parent function it's own this._super context,
          // otherwise this._super is from child and
          // causes infinite loop
          parent = wrap( parent, function() {}, true );
          return parent.call( this, data ) || data;
        };
      }
      return wrap( childFn, parentFn );
    }
    return __export;
  }( wrapMethod );

  /* config/types.js */
  var types = {
    TEXT: 1,
    INTERPOLATOR: 2,
    TRIPLE: 3,
    SECTION: 4,
    INVERTED: 5,
    CLOSING: 6,
    ELEMENT: 7,
    PARTIAL: 8,
    COMMENT: 9,
    DELIMCHANGE: 10,
    MUSTACHE: 11,
    TAG: 12,
    ATTRIBUTE: 13,
    CLOSING_TAG: 14,
    COMPONENT: 15,
    NUMBER_LITERAL: 20,
    STRING_LITERAL: 21,
    ARRAY_LITERAL: 22,
    OBJECT_LITERAL: 23,
    BOOLEAN_LITERAL: 24,
    GLOBAL: 26,
    KEY_VALUE_PAIR: 27,
    REFERENCE: 30,
    REFINEMENT: 31,
    MEMBER: 32,
    PREFIX_OPERATOR: 33,
    BRACKETED: 34,
    CONDITIONAL: 35,
    INFIX_OPERATOR: 36,
    INVOCATION: 40,
    SECTION_IF: 50,
    SECTION_UNLESS: 51,
    SECTION_EACH: 52,
    SECTION_WITH: 53,
    SECTION_IF_WITH: 54
  };

  /* utils/create.js */
  var create = function() {

    var create;
    try {
      Object.create( null );
      create = Object.create;
    } catch ( err ) {
      // sigh
      create = function() {
        var F = function() {};
        return function( proto, props ) {
          var obj;
          if ( proto === null ) {
            return {};
          }
          F.prototype = proto;
          obj = new F();
          if ( props ) {
            Object.defineProperties( obj, props );
          }
          return obj;
        };
      }();
    }
    return create;
  }();

  /* parse/Parser/expressions/shared/errors.js */
  var parse_Parser_expressions_shared_errors = {
    expectedExpression: 'Expected a JavaScript expression',
    expectedParen: 'Expected closing paren'
  };

  /* parse/Parser/expressions/primary/literal/numberLiteral.js */
  var numberLiteral = function( types ) {

    var numberPattern = /^(?:[+-]?)(?:(?:(?:0|[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;
    return function( parser ) {
      var result;
      if ( result = parser.matchPattern( numberPattern ) ) {
        return {
          t: types.NUMBER_LITERAL,
          v: result
        };
      }
      return null;
    };
  }( types );

  /* parse/Parser/expressions/primary/literal/booleanLiteral.js */
  var booleanLiteral = function( types ) {

    return function( parser ) {
      var remaining = parser.remaining();
      if ( remaining.substr( 0, 4 ) === 'true' ) {
        parser.pos += 4;
        return {
          t: types.BOOLEAN_LITERAL,
          v: 'true'
        };
      }
      if ( remaining.substr( 0, 5 ) === 'false' ) {
        parser.pos += 5;
        return {
          t: types.BOOLEAN_LITERAL,
          v: 'false'
        };
      }
      return null;
    };
  }( types );

  /* parse/Parser/expressions/primary/literal/stringLiteral/makeQuotedStringMatcher.js */
  var makeQuotedStringMatcher = function() {

    var stringMiddlePattern, escapeSequencePattern, lineContinuationPattern;
    // Match one or more characters until: ", ', \, or EOL/EOF.
    // EOL/EOF is written as (?!.) (meaning there's no non-newline char next).
    stringMiddlePattern = /^(?=.)[^"'\\]+?(?:(?!.)|(?=["'\\]))/;
    // Match one escape sequence, including the backslash.
    escapeSequencePattern = /^\\(?:['"\\bfnrt]|0(?![0-9])|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|(?=.)[^ux0-9])/;
    // Match one ES5 line continuation (backslash + line terminator).
    lineContinuationPattern = /^\\(?:\r\n|[\u000A\u000D\u2028\u2029])/;
    // Helper for defining getDoubleQuotedString and getSingleQuotedString.
    return function( okQuote ) {
      return function( parser ) {
        var start, literal, done, next;
        start = parser.pos;
        literal = '"';
        done = false;
        while ( !done ) {
          next = parser.matchPattern( stringMiddlePattern ) || parser.matchPattern( escapeSequencePattern ) || parser.matchString( okQuote );
          if ( next ) {
            if ( next === '"' ) {
              literal += '\\"';
            } else if ( next === '\\\'' ) {
              literal += '\'';
            } else {
              literal += next;
            }
          } else {
            next = parser.matchPattern( lineContinuationPattern );
            if ( next ) {
              // convert \(newline-like) into a \u escape, which is allowed in JSON
              literal += '\\u' + ( '000' + next.charCodeAt( 1 ).toString( 16 ) ).slice( -4 );
            } else {
              done = true;
            }
          }
        }
        literal += '"';
        // use JSON.parse to interpret escapes
        return JSON.parse( literal );
      };
    };
  }();

  /* parse/Parser/expressions/primary/literal/stringLiteral/singleQuotedString.js */
  var singleQuotedString = function( makeQuotedStringMatcher ) {

    return makeQuotedStringMatcher( '"' );
  }( makeQuotedStringMatcher );

  /* parse/Parser/expressions/primary/literal/stringLiteral/doubleQuotedString.js */
  var doubleQuotedString = function( makeQuotedStringMatcher ) {

    return makeQuotedStringMatcher( '\'' );
  }( makeQuotedStringMatcher );

  /* parse/Parser/expressions/primary/literal/stringLiteral/_stringLiteral.js */
  var stringLiteral = function( types, getSingleQuotedString, getDoubleQuotedString ) {

    return function( parser ) {
      var start, string;
      start = parser.pos;
      if ( parser.matchString( '"' ) ) {
        string = getDoubleQuotedString( parser );
        if ( !parser.matchString( '"' ) ) {
          parser.pos = start;
          return null;
        }
        return {
          t: types.STRING_LITERAL,
          v: string
        };
      }
      if ( parser.matchString( '\'' ) ) {
        string = getSingleQuotedString( parser );
        if ( !parser.matchString( '\'' ) ) {
          parser.pos = start;
          return null;
        }
        return {
          t: types.STRING_LITERAL,
          v: string
        };
      }
      return null;
    };
  }( types, singleQuotedString, doubleQuotedString );

  /* parse/Parser/expressions/shared/patterns.js */
  var patterns = {
    name: /^[a-zA-Z_$][a-zA-Z_$0-9]*/
  };

  /* parse/Parser/expressions/shared/key.js */
  var key = function( getStringLiteral, getNumberLiteral, patterns ) {

    var identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
    // http://mathiasbynens.be/notes/javascript-properties
    // can be any name, string literal, or number literal
    return function( parser ) {
      var token;
      if ( token = getStringLiteral( parser ) ) {
        return identifier.test( token.v ) ? token.v : '"' + token.v.replace( /"/g, '\\"' ) + '"';
      }
      if ( token = getNumberLiteral( parser ) ) {
        return token.v;
      }
      if ( token = parser.matchPattern( patterns.name ) ) {
        return token;
      }
    };
  }( stringLiteral, numberLiteral, patterns );

  /* parse/Parser/expressions/primary/literal/objectLiteral/keyValuePair.js */
  var keyValuePair = function( types, getKey ) {

    return function( parser ) {
      var start, key, value;
      start = parser.pos;
      // allow whitespace between '{' and key
      parser.allowWhitespace();
      key = getKey( parser );
      if ( key === null ) {
        parser.pos = start;
        return null;
      }
      // allow whitespace between key and ':'
      parser.allowWhitespace();
      // next character must be ':'
      if ( !parser.matchString( ':' ) ) {
        parser.pos = start;
        return null;
      }
      // allow whitespace between ':' and value
      parser.allowWhitespace();
      // next expression must be a, well... expression
      value = parser.readExpression();
      if ( value === null ) {
        parser.pos = start;
        return null;
      }
      return {
        t: types.KEY_VALUE_PAIR,
        k: key,
        v: value
      };
    };
  }( types, key );

  /* parse/Parser/expressions/primary/literal/objectLiteral/keyValuePairs.js */
  var keyValuePairs = function( getKeyValuePair ) {

    return function getKeyValuePairs( parser ) {
      var start, pairs, pair, keyValuePairs;
      start = parser.pos;
      pair = getKeyValuePair( parser );
      if ( pair === null ) {
        return null;
      }
      pairs = [ pair ];
      if ( parser.matchString( ',' ) ) {
        keyValuePairs = getKeyValuePairs( parser );
        if ( !keyValuePairs ) {
          parser.pos = start;
          return null;
        }
        return pairs.concat( keyValuePairs );
      }
      return pairs;
    };
  }( keyValuePair );

  /* parse/Parser/expressions/primary/literal/objectLiteral/_objectLiteral.js */
  var objectLiteral = function( types, getKeyValuePairs ) {

    return function( parser ) {
      var start, keyValuePairs;
      start = parser.pos;
      // allow whitespace
      parser.allowWhitespace();
      if ( !parser.matchString( '{' ) ) {
        parser.pos = start;
        return null;
      }
      keyValuePairs = getKeyValuePairs( parser );
      // allow whitespace between final value and '}'
      parser.allowWhitespace();
      if ( !parser.matchString( '}' ) ) {
        parser.pos = start;
        return null;
      }
      return {
        t: types.OBJECT_LITERAL,
        m: keyValuePairs
      };
    };
  }( types, keyValuePairs );

  /* parse/Parser/expressions/shared/expressionList.js */
  var expressionList = function( errors ) {

    return function getExpressionList( parser ) {
      var start, expressions, expr, next;
      start = parser.pos;
      parser.allowWhitespace();
      expr = parser.readExpression();
      if ( expr === null ) {
        return null;
      }
      expressions = [ expr ];
      // allow whitespace between expression and ','
      parser.allowWhitespace();
      if ( parser.matchString( ',' ) ) {
        next = getExpressionList( parser );
        if ( next === null ) {
          parser.error( errors.expectedExpression );
        }
        next.forEach( append );
      }

      function append( expression ) {
        expressions.push( expression );
      }
      return expressions;
    };
  }( parse_Parser_expressions_shared_errors );

  /* parse/Parser/expressions/primary/literal/arrayLiteral.js */
  var arrayLiteral = function( types, getExpressionList ) {

    return function( parser ) {
      var start, expressionList;
      start = parser.pos;
      // allow whitespace before '['
      parser.allowWhitespace();
      if ( !parser.matchString( '[' ) ) {
        parser.pos = start;
        return null;
      }
      expressionList = getExpressionList( parser );
      if ( !parser.matchString( ']' ) ) {
        parser.pos = start;
        return null;
      }
      return {
        t: types.ARRAY_LITERAL,
        m: expressionList
      };
    };
  }( types, expressionList );

  /* parse/Parser/expressions/primary/literal/_literal.js */
  var literal = function( getNumberLiteral, getBooleanLiteral, getStringLiteral, getObjectLiteral, getArrayLiteral ) {

    return function( parser ) {
      var literal = getNumberLiteral( parser ) || getBooleanLiteral( parser ) || getStringLiteral( parser ) || getObjectLiteral( parser ) || getArrayLiteral( parser );
      return literal;
    };
  }( numberLiteral, booleanLiteral, stringLiteral, objectLiteral, arrayLiteral );

  /* parse/Parser/expressions/primary/reference.js */
  var reference = function( types, patterns ) {

    var dotRefinementPattern, arrayMemberPattern, getArrayRefinement, globals, keywords;
    dotRefinementPattern = /^\.[a-zA-Z_$0-9]+/;
    getArrayRefinement = function( parser ) {
      var num = parser.matchPattern( arrayMemberPattern );
      if ( num ) {
        return '.' + num;
      }
      return null;
    };
    arrayMemberPattern = /^\[(0|[1-9][0-9]*)\]/;
    // if a reference is a browser global, we don't deference it later, so it needs special treatment
    globals = /^(?:Array|console|Date|RegExp|decodeURIComponent|decodeURI|encodeURIComponent|encodeURI|isFinite|isNaN|parseFloat|parseInt|JSON|Math|NaN|undefined|null)$/;
    // keywords are not valid references, with the exception of `this`
    keywords = /^(?:break|case|catch|continue|debugger|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|var|void|while|with)$/;
    return function( parser ) {
      var startPos, ancestor, name, dot, combo, refinement, lastDotIndex;
      startPos = parser.pos;
      // we might have a root-level reference
      if ( parser.matchString( '~/' ) ) {
        ancestor = '~/';
      } else {
        // we might have ancestor refs...
        ancestor = '';
        while ( parser.matchString( '../' ) ) {
          ancestor += '../';
        }
      }
      if ( !ancestor ) {
        // we might have an implicit iterator or a restricted reference
        dot = parser.matchString( './' ) || parser.matchString( '.' ) || '';
      }
      name = parser.matchPattern( /^@(?:keypath|index|key)/ ) || parser.matchPattern( patterns.name ) || '';
      // bug out if it's a keyword
      if ( keywords.test( name ) ) {
        parser.pos = startPos;
        return null;
      }
      // if this is a browser global, stop here
      if ( !ancestor && !dot && globals.test( name ) ) {
        return {
          t: types.GLOBAL,
          v: name
        };
      }
      combo = ( ancestor || dot ) + name;
      if ( !combo ) {
        return null;
      }
      while ( refinement = parser.matchPattern( dotRefinementPattern ) || getArrayRefinement( parser ) ) {
        combo += refinement;
      }
      if ( parser.matchString( '(' ) ) {
        // if this is a method invocation (as opposed to a function) we need
        // to strip the method name from the reference combo, else the context
        // will be wrong
        lastDotIndex = combo.lastIndexOf( '.' );
        if ( lastDotIndex !== -1 ) {
          combo = combo.substr( 0, lastDotIndex );
          parser.pos = startPos + combo.length;
        } else {
          parser.pos -= 1;
        }
      }
      return {
        t: types.REFERENCE,
        n: combo.replace( /^this\./, './' ).replace( /^this$/, '.' )
      };
    };
  }( types, patterns );

  /* parse/Parser/expressions/primary/bracketedExpression.js */
  var bracketedExpression = function( types, errors ) {

    return function( parser ) {
      var start, expr;
      start = parser.pos;
      if ( !parser.matchString( '(' ) ) {
        return null;
      }
      parser.allowWhitespace();
      expr = parser.readExpression();
      if ( !expr ) {
        parser.error( errors.expectedExpression );
      }
      parser.allowWhitespace();
      if ( !parser.matchString( ')' ) ) {
        parser.error( errors.expectedParen );
      }
      return {
        t: types.BRACKETED,
        x: expr
      };
    };
  }( types, parse_Parser_expressions_shared_errors );

  /* parse/Parser/expressions/primary/_primary.js */
  var primary = function( getLiteral, getReference, getBracketedExpression ) {

    return function( parser ) {
      return getLiteral( parser ) || getReference( parser ) || getBracketedExpression( parser );
    };
  }( literal, reference, bracketedExpression );

  /* parse/Parser/expressions/shared/refinement.js */
  var refinement = function( types, errors, patterns ) {

    return function getRefinement( parser ) {
      var start, name, expr;
      start = parser.pos;
      parser.allowWhitespace();
      // "." name
      if ( parser.matchString( '.' ) ) {
        parser.allowWhitespace();
        if ( name = parser.matchPattern( patterns.name ) ) {
          return {
            t: types.REFINEMENT,
            n: name
          };
        }
        parser.error( 'Expected a property name' );
      }
      // "[" expression "]"
      if ( parser.matchString( '[' ) ) {
        parser.allowWhitespace();
        expr = parser.readExpression();
        if ( !expr ) {
          parser.error( errors.expectedExpression );
        }
        parser.allowWhitespace();
        if ( !parser.matchString( ']' ) ) {
          parser.error( 'Expected \']\'' );
        }
        return {
          t: types.REFINEMENT,
          x: expr
        };
      }
      return null;
    };
  }( types, parse_Parser_expressions_shared_errors, patterns );

  /* parse/Parser/expressions/memberOrInvocation.js */
  var memberOrInvocation = function( types, getPrimary, getExpressionList, getRefinement, errors ) {

    return function( parser ) {
      var current, expression, refinement, expressionList;
      expression = getPrimary( parser );
      if ( !expression ) {
        return null;
      }
      while ( expression ) {
        current = parser.pos;
        if ( refinement = getRefinement( parser ) ) {
          expression = {
            t: types.MEMBER,
            x: expression,
            r: refinement
          };
        } else if ( parser.matchString( '(' ) ) {
          parser.allowWhitespace();
          expressionList = getExpressionList( parser );
          parser.allowWhitespace();
          if ( !parser.matchString( ')' ) ) {
            parser.error( errors.expectedParen );
          }
          expression = {
            t: types.INVOCATION,
            x: expression
          };
          if ( expressionList ) {
            expression.o = expressionList;
          }
        } else {
          break;
        }
      }
      return expression;
    };
  }( types, primary, expressionList, refinement, parse_Parser_expressions_shared_errors );

  /* parse/Parser/expressions/typeof.js */
  var _typeof = function( types, errors, getMemberOrInvocation ) {

    var getTypeof, makePrefixSequenceMatcher;
    makePrefixSequenceMatcher = function( symbol, fallthrough ) {
      return function( parser ) {
        var expression;
        if ( expression = fallthrough( parser ) ) {
          return expression;
        }
        if ( !parser.matchString( symbol ) ) {
          return null;
        }
        parser.allowWhitespace();
        expression = parser.readExpression();
        if ( !expression ) {
          parser.error( errors.expectedExpression );
        }
        return {
          s: symbol,
          o: expression,
          t: types.PREFIX_OPERATOR
        };
      };
    };
    // create all prefix sequence matchers, return getTypeof
    ( function() {
      var i, len, matcher, prefixOperators, fallthrough;
      prefixOperators = '! ~ + - typeof'.split( ' ' );
      fallthrough = getMemberOrInvocation;
      for ( i = 0, len = prefixOperators.length; i < len; i += 1 ) {
        matcher = makePrefixSequenceMatcher( prefixOperators[ i ], fallthrough );
        fallthrough = matcher;
      }
      // typeof operator is higher precedence than multiplication, so provides the
      // fallthrough for the multiplication sequence matcher we're about to create
      // (we're skipping void and delete)
      getTypeof = fallthrough;
    }() );
    return getTypeof;
  }( types, parse_Parser_expressions_shared_errors, memberOrInvocation );

  /* parse/Parser/expressions/logicalOr.js */
  var logicalOr = function( types, getTypeof ) {

    var getLogicalOr, makeInfixSequenceMatcher;
    makeInfixSequenceMatcher = function( symbol, fallthrough ) {
      return function( parser ) {
        var start, left, right;
        left = fallthrough( parser );
        if ( !left ) {
          return null;
        }
        // Loop to handle left-recursion in a case like `a * b * c` and produce
        // left association, i.e. `(a * b) * c`.  The matcher can't call itself
        // to parse `left` because that would be infinite regress.
        while ( true ) {
          start = parser.pos;
          parser.allowWhitespace();
          if ( !parser.matchString( symbol ) ) {
            parser.pos = start;
            return left;
          }
          // special case - in operator must not be followed by [a-zA-Z_$0-9]
          if ( symbol === 'in' && /[a-zA-Z_$0-9]/.test( parser.remaining().charAt( 0 ) ) ) {
            parser.pos = start;
            return left;
          }
          parser.allowWhitespace();
          // right operand must also consist of only higher-precedence operators
          right = fallthrough( parser );
          if ( !right ) {
            parser.pos = start;
            return left;
          }
          left = {
            t: types.INFIX_OPERATOR,
            s: symbol,
            o: [
              left,
              right
            ]
          };
        }
      };
    };
    // create all infix sequence matchers, and return getLogicalOr
    ( function() {
      var i, len, matcher, infixOperators, fallthrough;
      // All the infix operators on order of precedence (source: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Operator_Precedence)
      // Each sequence matcher will initially fall through to its higher precedence
      // neighbour, and only attempt to match if one of the higher precedence operators
      // (or, ultimately, a literal, reference, or bracketed expression) already matched
      infixOperators = '* / % + - << >> >>> < <= > >= in instanceof == != === !== & ^ | && ||'.split( ' ' );
      // A typeof operator is higher precedence than multiplication
      fallthrough = getTypeof;
      for ( i = 0, len = infixOperators.length; i < len; i += 1 ) {
        matcher = makeInfixSequenceMatcher( infixOperators[ i ], fallthrough );
        fallthrough = matcher;
      }
      // Logical OR is the fallthrough for the conditional matcher
      getLogicalOr = fallthrough;
    }() );
    return getLogicalOr;
  }( types, _typeof );

  /* parse/Parser/expressions/conditional.js */
  var conditional = function( types, getLogicalOr, errors ) {

    return function( parser ) {
      var start, expression, ifTrue, ifFalse;
      expression = getLogicalOr( parser );
      if ( !expression ) {
        return null;
      }
      start = parser.pos;
      parser.allowWhitespace();
      if ( !parser.matchString( '?' ) ) {
        parser.pos = start;
        return expression;
      }
      parser.allowWhitespace();
      ifTrue = parser.readExpression();
      if ( !ifTrue ) {
        parser.error( errors.expectedExpression );
      }
      parser.allowWhitespace();
      if ( !parser.matchString( ':' ) ) {
        parser.error( 'Expected ":"' );
      }
      parser.allowWhitespace();
      ifFalse = parser.readExpression();
      if ( !ifFalse ) {
        parser.error( errors.expectedExpression );
      }
      return {
        t: types.CONDITIONAL,
        o: [
          expression,
          ifTrue,
          ifFalse
        ]
      };
    };
  }( types, logicalOr, parse_Parser_expressions_shared_errors );

  /* parse/Parser/utils/flattenExpression.js */
  var flattenExpression = function( types, isObject ) {

    var __export;
    __export = function( expression ) {
      var refs = [],
        flattened;
      extractRefs( expression, refs );
      flattened = {
        r: refs,
        s: stringify( this, expression, refs )
      };
      return flattened;
    };

    function quoteStringLiteral( str ) {
      return JSON.stringify( String( str ) );
    }
    // TODO maybe refactor this?
    function extractRefs( node, refs ) {
      var i, list;
      if ( node.t === types.REFERENCE ) {
        if ( refs.indexOf( node.n ) === -1 ) {
          refs.unshift( node.n );
        }
      }
      list = node.o || node.m;
      if ( list ) {
        if ( isObject( list ) ) {
          extractRefs( list, refs );
        } else {
          i = list.length;
          while ( i-- ) {
            extractRefs( list[ i ], refs );
          }
        }
      }
      if ( node.x ) {
        extractRefs( node.x, refs );
      }
      if ( node.r ) {
        extractRefs( node.r, refs );
      }
      if ( node.v ) {
        extractRefs( node.v, refs );
      }
    }

    function stringify( parser, node, refs ) {
      var stringifyAll = function( item ) {
        return stringify( parser, item, refs );
      };
      switch ( node.t ) {
        case types.BOOLEAN_LITERAL:
        case types.GLOBAL:
        case types.NUMBER_LITERAL:
          return node.v;
        case types.STRING_LITERAL:
          return quoteStringLiteral( node.v );
        case types.ARRAY_LITERAL:
          return '[' + ( node.m ? node.m.map( stringifyAll ).join( ',' ) : '' ) + ']';
        case types.OBJECT_LITERAL:
          return '{' + ( node.m ? node.m.map( stringifyAll ).join( ',' ) : '' ) + '}';
        case types.KEY_VALUE_PAIR:
          return node.k + ':' + stringify( parser, node.v, refs );
        case types.PREFIX_OPERATOR:
          return ( node.s === 'typeof' ? 'typeof ' : node.s ) + stringify( parser, node.o, refs );
        case types.INFIX_OPERATOR:
          return stringify( parser, node.o[ 0 ], refs ) + ( node.s.substr( 0, 2 ) === 'in' ? ' ' + node.s + ' ' : node.s ) + stringify( parser, node.o[ 1 ], refs );
        case types.INVOCATION:
          return stringify( parser, node.x, refs ) + '(' + ( node.o ? node.o.map( stringifyAll ).join( ',' ) : '' ) + ')';
        case types.BRACKETED:
          return '(' + stringify( parser, node.x, refs ) + ')';
        case types.MEMBER:
          return stringify( parser, node.x, refs ) + stringify( parser, node.r, refs );
        case types.REFINEMENT:
          return node.n ? '.' + node.n : '[' + stringify( parser, node.x, refs ) + ']';
        case types.CONDITIONAL:
          return stringify( parser, node.o[ 0 ], refs ) + '?' + stringify( parser, node.o[ 1 ], refs ) + ':' + stringify( parser, node.o[ 2 ], refs );
        case types.REFERENCE:
          return '_' + refs.indexOf( node.n );
        default:
          parser.error( 'Expected legal JavaScript' );
      }
    }
    return __export;
  }( types, isObject );

  /* parse/Parser/_Parser.js */
  var Parser = function( circular, create, hasOwnProperty, getConditional, flattenExpression ) {

    var Parser, ParseError, leadingWhitespace = /^\s+/;
    ParseError = function( message ) {
      this.name = 'ParseError';
      this.message = message;
      try {
        throw new Error( message );
      } catch ( e ) {
        this.stack = e.stack;
      }
    };
    ParseError.prototype = Error.prototype;
    Parser = function( str, options ) {
      var items, item, lineStart = 0;
      this.str = str;
      this.options = options || {};
      this.pos = 0;
      this.lines = this.str.split( '\n' );
      this.lineEnds = this.lines.map( function( line ) {
        var lineEnd = lineStart + line.length + 1;
        // +1 for the newline
        lineStart = lineEnd;
        return lineEnd;
      }, 0 );
      // Custom init logic
      if ( this.init )
        this.init( str, options );
      items = [];
      while ( this.pos < this.str.length && ( item = this.read() ) ) {
        items.push( item );
      }
      this.leftover = this.remaining();
      this.result = this.postProcess ? this.postProcess( items, options ) : items;
    };
    Parser.prototype = {
      read: function( converters ) {
        var pos, i, len, item;
        if ( !converters )
          converters = this.converters;
        pos = this.pos;
        len = converters.length;
        for ( i = 0; i < len; i += 1 ) {
          this.pos = pos;
          // reset for each attempt
          if ( item = converters[ i ]( this ) ) {
            return item;
          }
        }
        return null;
      },
      readExpression: function() {
        // The conditional operator is the lowest precedence operator (except yield,
        // assignment operators, and commas, none of which are supported), so we
        // start there. If it doesn't match, it 'falls through' to progressively
        // higher precedence operators, until it eventually matches (or fails to
        // match) a 'primary' - a literal or a reference. This way, the abstract syntax
        // tree has everything in its proper place, i.e. 2 + 3 * 4 === 14, not 20.
        return getConditional( this );
      },
      flattenExpression: flattenExpression,
      getLinePos: function( char ) {
        var lineNum = 0,
          lineStart = 0,
          columnNum;
        while ( char >= this.lineEnds[ lineNum ] ) {
          lineStart = this.lineEnds[ lineNum ];
          lineNum += 1;
        }
        columnNum = char - lineStart;
        return [
          lineNum + 1,
          columnNum + 1,
          char
        ];
      },
      error: function( message ) {
        var pos, lineNum, columnNum, line, annotation, error;
        pos = this.getLinePos( this.pos );
        lineNum = pos[ 0 ];
        columnNum = pos[ 1 ];
        line = this.lines[ pos[ 0 ] - 1 ];
        annotation = line + '\n' + new Array( pos[ 1 ] ).join( ' ' ) + '^----';
        error = new ParseError( message + ' at line ' + lineNum + ' character ' + columnNum + ':\n' + annotation );
        error.line = pos[ 0 ];
        error.character = pos[ 1 ];
        error.shortMessage = message;
        throw error;
      },
      matchString: function( string ) {
        if ( this.str.substr( this.pos, string.length ) === string ) {
          this.pos += string.length;
          return string;
        }
      },
      matchPattern: function( pattern ) {
        var match;
        if ( match = pattern.exec( this.remaining() ) ) {
          this.pos += match[ 0 ].length;
          return match[ 1 ] || match[ 0 ];
        }
      },
      allowWhitespace: function() {
        this.matchPattern( leadingWhitespace );
      },
      remaining: function() {
        return this.str.substring( this.pos );
      },
      nextChar: function() {
        return this.str.charAt( this.pos );
      }
    };
    Parser.extend = function( proto ) {
      var Parent = this,
        Child, key;
      Child = function( str, options ) {
        Parser.call( this, str, options );
      };
      Child.prototype = create( Parent.prototype );
      for ( key in proto ) {
        if ( hasOwnProperty.call( proto, key ) ) {
          Child.prototype[ key ] = proto[ key ];
        }
      }
      Child.extend = Parser.extend;
      return Child;
    };
    circular.Parser = Parser;
    return Parser;
  }( circular, create, hasOwn, conditional, flattenExpression );

  /* parse/converters/mustache/delimiterChange.js */
  var delimiterChange = function() {

    var delimiterChangePattern = /^[^\s=]+/,
      whitespacePattern = /^\s+/;
    return function( parser ) {
      var start, opening, closing;
      if ( !parser.matchString( '=' ) ) {
        return null;
      }
      start = parser.pos;
      // allow whitespace before new opening delimiter
      parser.allowWhitespace();
      opening = parser.matchPattern( delimiterChangePattern );
      if ( !opening ) {
        parser.pos = start;
        return null;
      }
      // allow whitespace (in fact, it's necessary...)
      if ( !parser.matchPattern( whitespacePattern ) ) {
        return null;
      }
      closing = parser.matchPattern( delimiterChangePattern );
      if ( !closing ) {
        parser.pos = start;
        return null;
      }
      // allow whitespace before closing '='
      parser.allowWhitespace();
      if ( !parser.matchString( '=' ) ) {
        parser.pos = start;
        return null;
      }
      return [
        opening,
        closing
      ];
    };
  }();

  /* parse/converters/mustache/delimiterTypes.js */
  var delimiterTypes = [ {
    delimiters: 'delimiters',
    isTriple: false,
    isStatic: false
  }, {
    delimiters: 'tripleDelimiters',
    isTriple: true,
    isStatic: false
  }, {
    delimiters: 'staticDelimiters',
    isTriple: false,
    isStatic: true
  }, {
    delimiters: 'staticTripleDelimiters',
    isTriple: true,
    isStatic: true
  } ];

  /* parse/converters/mustache/type.js */
  var type = function( types ) {

    var mustacheTypes = {
      '#': types.SECTION,
      '^': types.INVERTED,
      '/': types.CLOSING,
      '>': types.PARTIAL,
      '!': types.COMMENT,
      '&': types.TRIPLE
    };
    return function( parser ) {
      var type = mustacheTypes[ parser.str.charAt( parser.pos ) ];
      if ( !type ) {
        return null;
      }
      parser.pos += 1;
      return type;
    };
  }( types );

  /* parse/converters/mustache/handlebarsBlockCodes.js */
  var handlebarsBlockCodes = function( types ) {

    return {
      'each': types.SECTION_EACH,
      'if': types.SECTION_IF,
      'if-with': types.SECTION_IF_WITH,
      'with': types.SECTION_WITH,
      'unless': types.SECTION_UNLESS
    };
  }( types );

  /* empty/legacy.js */
  var legacy = null;

  /* parse/converters/mustache/content.js */
  var content = function( types, mustacheType, handlebarsBlockCodes ) {

    var __export;
    var indexRefPattern = /^\s*:\s*([a-zA-Z_$][a-zA-Z_$0-9]*)/,
      arrayMemberPattern = /^[0-9][1-9]*$/,
      handlebarsBlockPattern = new RegExp( '^(' + Object.keys( handlebarsBlockCodes ).join( '|' ) + ')\\b' ),
      legalReference;
    legalReference = /^[a-zA-Z$_0-9]+(?:(\.[a-zA-Z$_0-9]+)|(\[[a-zA-Z$_0-9]+\]))*$/;
    __export = function( parser, delimiterType ) {
      var start, pos, mustache, type, block, expression, i, remaining, index, delimiters;
      start = parser.pos;
      mustache = {};
      delimiters = parser[ delimiterType.delimiters ];
      if ( delimiterType.isStatic ) {
        mustache.s = true;
      }
      // Determine mustache type
      if ( delimiterType.isTriple ) {
        mustache.t = types.TRIPLE;
      } else {
        // We need to test for expressions before we test for mustache type, because
        // an expression that begins '!' looks a lot like a comment
        if ( parser.remaining()[ 0 ] === '!' ) {
          try {
            expression = parser.readExpression();
            // Was it actually an expression, or a comment block in disguise?
            parser.allowWhitespace();
            if ( parser.remaining().indexOf( delimiters[ 1 ] ) ) {
              expression = null;
            } else {
              mustache.t = types.INTERPOLATOR;
            }
          } catch ( err ) {}
          if ( !expression ) {
            index = parser.remaining().indexOf( delimiters[ 1 ] );
            if ( ~index ) {
              parser.pos += index;
            } else {
              parser.error( 'Expected closing delimiter (\'' + delimiters[ 1 ] + '\')' );
            }
            return {
              t: types.COMMENT
            };
          }
        }
        if ( !expression ) {
          type = mustacheType( parser );
          mustache.t = type || types.INTERPOLATOR;
          // default
          // See if there's an explicit section type e.g. {{#with}}...{{/with}}
          if ( type === types.SECTION ) {
            if ( block = parser.matchPattern( handlebarsBlockPattern ) ) {
              mustache.n = block;
            }
            parser.allowWhitespace();
          } else if ( type === types.COMMENT || type === types.CLOSING ) {
            remaining = parser.remaining();
            index = remaining.indexOf( delimiters[ 1 ] );
            if ( index !== -1 ) {
              mustache.r = remaining.substr( 0, index ).split( ' ' )[ 0 ];
              parser.pos += index;
              return mustache;
            }
          }
        }
      }
      if ( !expression ) {
        // allow whitespace
        parser.allowWhitespace();
        // get expression
        expression = parser.readExpression();
        // If this is a partial, it may have a context (e.g. `{{>item foo}}`). These
        // cases involve a bit of a hack - we want to turn it into the equivalent of
        // `{{#with foo}}{{>item}}{{/with}}`, but to get there we temporarily append
        // a 'contextPartialExpression' to the mustache, and process the context instead of
        // the reference
        var temp;
        if ( mustache.t === types.PARTIAL && expression && ( temp = parser.readExpression() ) ) {
          mustache = {
            contextPartialExpression: expression
          };
          expression = temp;
        }
        // With certain valid references that aren't valid expressions,
        // e.g. {{1.foo}}, we have a problem: it looks like we've got an
        // expression, but the expression didn't consume the entire
        // reference. So we need to check that the mustache delimiters
        // appear next, unless there's an index reference (i.e. a colon)
        remaining = parser.remaining();
        if ( remaining.substr( 0, delimiters[ 1 ].length ) !== delimiters[ 1 ] && remaining.charAt( 0 ) !== ':' ) {
          pos = parser.pos;
          parser.pos = start;
          remaining = parser.remaining();
          index = remaining.indexOf( delimiters[ 1 ] );
          if ( index !== -1 ) {
            mustache.r = remaining.substr( 0, index ).trim();
            // Check it's a legal reference
            if ( !legalReference.test( mustache.r ) ) {
              parser.error( 'Expected a legal Mustache reference' );
            }
            parser.pos += index;
            return mustache;
          }
          parser.pos = pos;
        }
      }
      refineExpression( parser, expression, mustache );
      // if there was context, process the expression now and save it for later
      if ( mustache.contextPartialExpression ) {
        mustache.contextPartialExpression = [ refineExpression( parser, mustache.contextPartialExpression, {
          t: types.PARTIAL
        } ) ];
      }
      // optional index reference
      if ( i = parser.matchPattern( indexRefPattern ) ) {
        mustache.i = i;
      }
      return mustache;
    };

    function refineExpression( parser, expression, mustache ) {
      var referenceExpression;
      if ( expression ) {
        while ( expression.t === types.BRACKETED && expression.x ) {
          expression = expression.x;
        }
        // special case - integers should be treated as array members references,
        // rather than as expressions in their own right
        if ( expression.t === types.REFERENCE ) {
          mustache.r = expression.n;
        } else {
          if ( expression.t === types.NUMBER_LITERAL && arrayMemberPattern.test( expression.v ) ) {
            mustache.r = expression.v;
          } else if ( referenceExpression = getReferenceExpression( parser, expression ) ) {
            mustache.rx = referenceExpression;
          } else {
            mustache.x = parser.flattenExpression( expression );
          }
        }
        return mustache;
      }
    }
    // TODO refactor this! it's bewildering
    function getReferenceExpression( parser, expression ) {
      var members = [],
        refinement;
      while ( expression.t === types.MEMBER && expression.r.t === types.REFINEMENT ) {
        refinement = expression.r;
        if ( refinement.x ) {
          if ( refinement.x.t === types.REFERENCE ) {
            members.unshift( refinement.x );
          } else {
            members.unshift( parser.flattenExpression( refinement.x ) );
          }
        } else {
          members.unshift( refinement.n );
        }
        expression = expression.x;
      }
      if ( expression.t !== types.REFERENCE ) {
        return null;
      }
      return {
        r: expression.n,
        m: members
      };
    }
    return __export;
  }( types, type, handlebarsBlockCodes, legacy );

  /* parse/converters/mustache.js */
  var mustache = function( types, delimiterChange, delimiterTypes, mustacheContent, handlebarsBlockCodes ) {

    var __export;
    var delimiterChangeToken = {
      t: types.DELIMCHANGE,
      exclude: true
    };
    __export = getMustache;

    function getMustache( parser ) {
      var types;
      // If we're inside a <script> or <style> tag, and we're not
      // interpolating, bug out
      if ( parser.interpolate[ parser.inside ] === false ) {
        return null;
      }
      types = delimiterTypes.slice().sort( function compare( a, b ) {
        // Sort in order of descending opening delimiter length (longer first),
        // to protect against opening delimiters being substrings of each other
        return parser[ b.delimiters ][ 0 ].length - parser[ a.delimiters ][ 0 ].length;
      } );
      return function r( type ) {
        if ( !type ) {
          return null;
        } else {
          return getMustacheOfType( parser, type ) || r( types.shift() );
        }
      }( types.shift() );
    }

    function getMustacheOfType( parser, delimiterType ) {
      var start, mustache, delimiters, children, expectedClose, elseChildren, currentChildren, child;
      start = parser.pos;
      delimiters = parser[ delimiterType.delimiters ];
      if ( !parser.matchString( delimiters[ 0 ] ) ) {
        return null;
      }
      // delimiter change?
      if ( mustache = delimiterChange( parser ) ) {
        // find closing delimiter or abort...
        if ( !parser.matchString( delimiters[ 1 ] ) ) {
          return null;
        }
        // ...then make the switch
        parser[ delimiterType.delimiters ] = mustache;
        return delimiterChangeToken;
      }
      parser.allowWhitespace();
      mustache = mustacheContent( parser, delimiterType );
      if ( mustache === null ) {
        parser.pos = start;
        return null;
      }
      // allow whitespace before closing delimiter
      parser.allowWhitespace();
      if ( !parser.matchString( delimiters[ 1 ] ) ) {
        parser.error( 'Expected closing delimiter \'' + delimiters[ 1 ] + '\' after reference' );
      }
      if ( mustache.t === types.COMMENT ) {
        mustache.exclude = true;
      }
      if ( mustache.t === types.CLOSING ) {
        parser.sectionDepth -= 1;
        if ( parser.sectionDepth < 0 ) {
          parser.pos = start;
          parser.error( 'Attempted to close a section that wasn\'t open' );
        }
      }
      // partials with context
      if ( mustache.contextPartialExpression ) {
        mustache.f = mustache.contextPartialExpression;
        mustache.t = types.SECTION;
        mustache.n = 'with';
        delete mustache.contextPartialExpression;
      } else if ( isSection( mustache ) ) {
        parser.sectionDepth += 1;
        children = [];
        currentChildren = children;
        expectedClose = mustache.n;
        while ( child = parser.read() ) {
          if ( child.t === types.CLOSING ) {
            if ( expectedClose && child.r !== expectedClose ) {
              parser.error( 'Expected {{/' + expectedClose + '}}' );
            }
            break;
          }
          // {{else}} tags require special treatment
          if ( child.t === types.INTERPOLATOR && child.r === 'else' ) {
            // no {{else}} allowed in {{#unless}}
            if ( mustache.n === 'unless' ) {
              parser.error( '{{else}} not allowed in {{#unless}}' );
            } else {
              currentChildren = elseChildren = [];
              continue;
            }
          }
          currentChildren.push( child );
        }
        if ( children.length ) {
          mustache.f = children;
        }
        if ( elseChildren && elseChildren.length ) {
          mustache.l = elseChildren;
          if ( mustache.n === 'with' ) {
            mustache.n = 'if-with';
          }
        }
      }
      if ( parser.includeLinePositions ) {
        mustache.p = parser.getLinePos( start );
      }
      // Replace block name with code
      if ( mustache.n ) {
        mustache.n = handlebarsBlockCodes[ mustache.n ];
      } else if ( mustache.t === types.INVERTED ) {
        mustache.t = types.SECTION;
        mustache.n = types.SECTION_UNLESS;
      }
      return mustache;
    }

    function isSection( mustache ) {
      return mustache.t === types.SECTION || mustache.t === types.INVERTED;
    }
    return __export;
  }( types, delimiterChange, delimiterTypes, content, handlebarsBlockCodes );

  /* parse/converters/comment.js */
  var comment = function( types ) {

    var OPEN_COMMENT = '<!--',
      CLOSE_COMMENT = '-->';
    return function( parser ) {
      var start, content, remaining, endIndex, comment;
      start = parser.pos;
      if ( !parser.matchString( OPEN_COMMENT ) ) {
        return null;
      }
      remaining = parser.remaining();
      endIndex = remaining.indexOf( CLOSE_COMMENT );
      if ( endIndex === -1 ) {
        parser.error( 'Illegal HTML - expected closing comment sequence (\'-->\')' );
      }
      content = remaining.substr( 0, endIndex );
      parser.pos += endIndex + 3;
      comment = {
        t: types.COMMENT,
        c: content
      };
      if ( parser.includeLinePositions ) {
        comment.p = parser.getLinePos( start );
      }
      return comment;
    };
  }( types );

  /* config/voidElementNames.js */
  var voidElementNames = function() {

    var voidElementNames = /^(?:area|base|br|col|command|doctype|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
    return voidElementNames;
  }();

  /* parse/converters/utils/getLowestIndex.js */
  var getLowestIndex = function( haystack, needles ) {
    var i, index, lowest;
    i = needles.length;
    while ( i-- ) {
      index = haystack.indexOf( needles[ i ] );
      // short circuit
      if ( !index ) {
        return 0;
      }
      if ( index === -1 ) {
        continue;
      }
      if ( !lowest || index < lowest ) {
        lowest = index;
      }
    }
    return lowest || -1;
  };

  /* shared/decodeCharacterReferences.js */
  var decodeCharacterReferences = function() {

    var __export;
    var htmlEntities, controlCharacters, entityPattern;
    htmlEntities = {
      quot: 34,
      amp: 38,
      apos: 39,
      lt: 60,
      gt: 62,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      copy: 169,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      reg: 174,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      sup1: 185,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      Agrave: 192,
      Aacute: 193,
      Acirc: 194,
      Atilde: 195,
      Auml: 196,
      Aring: 197,
      AElig: 198,
      Ccedil: 199,
      Egrave: 200,
      Eacute: 201,
      Ecirc: 202,
      Euml: 203,
      Igrave: 204,
      Iacute: 205,
      Icirc: 206,
      Iuml: 207,
      ETH: 208,
      Ntilde: 209,
      Ograve: 210,
      Oacute: 211,
      Ocirc: 212,
      Otilde: 213,
      Ouml: 214,
      times: 215,
      Oslash: 216,
      Ugrave: 217,
      Uacute: 218,
      Ucirc: 219,
      Uuml: 220,
      Yacute: 221,
      THORN: 222,
      szlig: 223,
      agrave: 224,
      aacute: 225,
      acirc: 226,
      atilde: 227,
      auml: 228,
      aring: 229,
      aelig: 230,
      ccedil: 231,
      egrave: 232,
      eacute: 233,
      ecirc: 234,
      euml: 235,
      igrave: 236,
      iacute: 237,
      icirc: 238,
      iuml: 239,
      eth: 240,
      ntilde: 241,
      ograve: 242,
      oacute: 243,
      ocirc: 244,
      otilde: 245,
      ouml: 246,
      divide: 247,
      oslash: 248,
      ugrave: 249,
      uacute: 250,
      ucirc: 251,
      uuml: 252,
      yacute: 253,
      thorn: 254,
      yuml: 255,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      'int': 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    };
    controlCharacters = [
      8364,
      129,
      8218,
      402,
      8222,
      8230,
      8224,
      8225,
      710,
      8240,
      352,
      8249,
      338,
      141,
      381,
      143,
      144,
      8216,
      8217,
      8220,
      8221,
      8226,
      8211,
      8212,
      732,
      8482,
      353,
      8250,
      339,
      157,
      382,
      376
    ];
    entityPattern = new RegExp( '&(#?(?:x[\\w\\d]+|\\d+|' + Object.keys( htmlEntities ).join( '|' ) + '));?', 'g' );
    __export = function decodeCharacterReferences( html ) {
      return html.replace( entityPattern, function( match, entity ) {
        var code;
        // Handle named entities
        if ( entity[ 0 ] !== '#' ) {
          code = htmlEntities[ entity ];
        } else if ( entity[ 1 ] === 'x' ) {
          code = parseInt( entity.substring( 2 ), 16 );
        } else {
          code = parseInt( entity.substring( 1 ), 10 );
        }
        if ( !code ) {
          return match;
        }
        return String.fromCharCode( validateCode( code ) );
      } );
    };
    // some code points are verboten. If we were inserting HTML, the browser would replace the illegal
    // code points with alternatives in some cases - since we're bypassing that mechanism, we need
    // to replace them ourselves
    //
    // Source: http://en.wikipedia.org/wiki/Character_encodings_in_HTML#Illegal_characters
    function validateCode( code ) {
      if ( !code ) {
        return 65533;
      }
      // line feed becomes generic whitespace
      if ( code === 10 ) {
        return 32;
      }
      // ASCII range. (Why someone would use HTML entities for ASCII characters I don't know, but...)
      if ( code < 128 ) {
        return code;
      }
      // code points 128-159 are dealt with leniently by browsers, but they're incorrect. We need
      // to correct the mistake or we'll end up with missing € signs and so on
      if ( code <= 159 ) {
        return controlCharacters[ code - 128 ];
      }
      // basic multilingual plane
      if ( code < 55296 ) {
        return code;
      }
      // UTF-16 surrogate halves
      if ( code <= 57343 ) {
        return 65533;
      }
      // rest of the basic multilingual plane
      if ( code <= 65535 ) {
        return code;
      }
      return 65533;
    }
    return __export;
  }( legacy );

  /* parse/converters/text.js */
  var text = function( getLowestIndex, decodeCharacterReferences ) {

    return function( parser ) {
      var index, remaining, disallowed, barrier;
      remaining = parser.remaining();
      barrier = parser.inside ? '</' + parser.inside : '<';
      if ( parser.inside && !parser.interpolate[ parser.inside ] ) {
        index = remaining.indexOf( barrier );
      } else {
        disallowed = [
          parser.delimiters[ 0 ],
          parser.tripleDelimiters[ 0 ],
          parser.staticDelimiters[ 0 ],
          parser.staticTripleDelimiters[ 0 ]
        ];
        // http://developers.whatwg.org/syntax.html#syntax-attributes
        if ( parser.inAttribute === true ) {
          // we're inside an unquoted attribute value
          disallowed.push( '"', '\'', '=', '<', '>', '`' );
        } else if ( parser.inAttribute ) {
          // quoted attribute value
          disallowed.push( parser.inAttribute );
        } else {
          disallowed.push( barrier );
        }
        index = getLowestIndex( remaining, disallowed );
      }
      if ( !index ) {
        return null;
      }
      if ( index === -1 ) {
        index = remaining.length;
      }
      parser.pos += index;
      return parser.inside ? remaining.substr( 0, index ) : decodeCharacterReferences( remaining.substr( 0, index ) );
    };
  }( getLowestIndex, decodeCharacterReferences );

  /* parse/converters/element/closingTag.js */
  var closingTag = function( types ) {

    var closingTagPattern = /^([a-zA-Z]{1,}:?[a-zA-Z0-9\-]*)\s*\>/;
    return function( parser ) {
      var tag;
      // are we looking at a closing tag?
      if ( !parser.matchString( '</' ) ) {
        return null;
      }
      if ( tag = parser.matchPattern( closingTagPattern ) ) {
        return {
          t: types.CLOSING_TAG,
          e: tag
        };
      }
      // We have an illegal closing tag, report it
      parser.pos -= 2;
      parser.error( 'Illegal closing tag' );
    };
  }( types );

  /* parse/converters/element/attribute.js */
  var attribute = function( getLowestIndex, getMustache, decodeCharacterReferences ) {

    var __export;
    var attributeNamePattern = /^[^\s"'>\/=]+/,
      unquotedAttributeValueTextPattern = /^[^\s"'=<>`]+/;
    __export = getAttribute;

    function getAttribute( parser ) {
      var attr, name, value;
      parser.allowWhitespace();
      name = parser.matchPattern( attributeNamePattern );
      if ( !name ) {
        return null;
      }
      attr = {
        name: name
      };
      value = getAttributeValue( parser );
      if ( value ) {
        attr.value = value;
      }
      return attr;
    }

    function getAttributeValue( parser ) {
      var start, valueStart, startDepth, value;
      start = parser.pos;
      parser.allowWhitespace();
      if ( !parser.matchString( '=' ) ) {
        parser.pos = start;
        return null;
      }
      parser.allowWhitespace();
      valueStart = parser.pos;
      startDepth = parser.sectionDepth;
      value = getQuotedAttributeValue( parser, '\'' ) || getQuotedAttributeValue( parser, '"' ) || getUnquotedAttributeValue( parser );
      if ( parser.sectionDepth !== startDepth ) {
        parser.pos = valueStart;
        parser.error( 'An attribute value must contain as many opening section tags as closing section tags' );
      }
      if ( value === null ) {
        parser.pos = start;
        return null;
      }
      if ( !value.length ) {
        return null;
      }
      if ( value.length === 1 && typeof value[ 0 ] === 'string' ) {
        return decodeCharacterReferences( value[ 0 ] );
      }
      return value;
    }

    function getUnquotedAttributeValueToken( parser ) {
      var start, text, haystack, needles, index;
      start = parser.pos;
      text = parser.matchPattern( unquotedAttributeValueTextPattern );
      if ( !text ) {
        return null;
      }
      haystack = text;
      needles = [
        parser.delimiters[ 0 ],
        parser.tripleDelimiters[ 0 ],
        parser.staticDelimiters[ 0 ],
        parser.staticTripleDelimiters[ 0 ]
      ];
      if ( ( index = getLowestIndex( haystack, needles ) ) !== -1 ) {
        text = text.substr( 0, index );
        parser.pos = start + text.length;
      }
      return text;
    }

    function getUnquotedAttributeValue( parser ) {
      var tokens, token;
      parser.inAttribute = true;
      tokens = [];
      token = getMustache( parser ) || getUnquotedAttributeValueToken( parser );
      while ( token !== null ) {
        tokens.push( token );
        token = getMustache( parser ) || getUnquotedAttributeValueToken( parser );
      }
      if ( !tokens.length ) {
        return null;
      }
      parser.inAttribute = false;
      return tokens;
    }

    function getQuotedAttributeValue( parser, quoteMark ) {
      var start, tokens, token;
      start = parser.pos;
      if ( !parser.matchString( quoteMark ) ) {
        return null;
      }
      parser.inAttribute = quoteMark;
      tokens = [];
      token = getMustache( parser ) || getQuotedStringToken( parser, quoteMark );
      while ( token !== null ) {
        tokens.push( token );
        token = getMustache( parser ) || getQuotedStringToken( parser, quoteMark );
      }
      if ( !parser.matchString( quoteMark ) ) {
        parser.pos = start;
        return null;
      }
      parser.inAttribute = false;
      return tokens;
    }

    function getQuotedStringToken( parser, quoteMark ) {
      var start, index, haystack, needles;
      start = parser.pos;
      haystack = parser.remaining();
      needles = [
        quoteMark,
        parser.delimiters[ 0 ],
        parser.tripleDelimiters[ 0 ],
        parser.staticDelimiters[ 0 ],
        parser.staticTripleDelimiters[ 0 ]
      ];
      index = getLowestIndex( haystack, needles );
      if ( index === -1 ) {
        parser.error( 'Quoted attribute value must have a closing quote' );
      }
      if ( !index ) {
        return null;
      }
      parser.pos += index;
      return haystack.substr( 0, index );
    }
    return __export;
  }( getLowestIndex, mustache, decodeCharacterReferences );

  /* utils/parseJSON.js */
  var parseJSON = function( Parser, getStringLiteral, getKey ) {

    var JsonParser, specials, specialsPattern, numberPattern, placeholderPattern, placeholderAtStartPattern, onlyWhitespace;
    specials = {
      'true': true,
      'false': false,
      'undefined': undefined,
      'null': null
    };
    specialsPattern = new RegExp( '^(?:' + Object.keys( specials ).join( '|' ) + ')' );
    numberPattern = /^(?:[+-]?)(?:(?:(?:0|[1-9]\d*)?\.\d+)|(?:(?:0|[1-9]\d*)\.)|(?:0|[1-9]\d*))(?:[eE][+-]?\d+)?/;
    placeholderPattern = /\$\{([^\}]+)\}/g;
    placeholderAtStartPattern = /^\$\{([^\}]+)\}/;
    onlyWhitespace = /^\s*$/;
    JsonParser = Parser.extend( {
      init: function( str, options ) {
        this.values = options.values;
        this.allowWhitespace();
      },
      postProcess: function( result ) {
        if ( result.length !== 1 || !onlyWhitespace.test( this.leftover ) ) {
          return null;
        }
        return {
          value: result[ 0 ].v
        };
      },
      converters: [

        function getPlaceholder( parser ) {
          var placeholder;
          if ( !parser.values ) {
            return null;
          }
          placeholder = parser.matchPattern( placeholderAtStartPattern );
          if ( placeholder && parser.values.hasOwnProperty( placeholder ) ) {
            return {
              v: parser.values[ placeholder ]
            };
          }
        },
        function getSpecial( parser ) {
          var special;
          if ( special = parser.matchPattern( specialsPattern ) ) {
            return {
              v: specials[ special ]
            };
          }
        },
        function getNumber( parser ) {
          var number;
          if ( number = parser.matchPattern( numberPattern ) ) {
            return {
              v: +number
            };
          }
        },
        function getString( parser ) {
          var stringLiteral = getStringLiteral( parser ),
            values;
          if ( stringLiteral && ( values = parser.values ) ) {
            return {
              v: stringLiteral.v.replace( placeholderPattern, function( match, $1 ) {
                return $1 in values ? values[ $1 ] : $1;
              } )
            };
          }
          return stringLiteral;
        },
        function getObject( parser ) {
          var result, pair;
          if ( !parser.matchString( '{' ) ) {
            return null;
          }
          result = {};
          parser.allowWhitespace();
          if ( parser.matchString( '}' ) ) {
            return {
              v: result
            };
          }
          while ( pair = getKeyValuePair( parser ) ) {
            result[ pair.key ] = pair.value;
            parser.allowWhitespace();
            if ( parser.matchString( '}' ) ) {
              return {
                v: result
              };
            }
            if ( !parser.matchString( ',' ) ) {
              return null;
            }
          }
          return null;
        },
        function getArray( parser ) {
          var result, valueToken;
          if ( !parser.matchString( '[' ) ) {
            return null;
          }
          result = [];
          parser.allowWhitespace();
          if ( parser.matchString( ']' ) ) {
            return {
              v: result
            };
          }
          while ( valueToken = parser.read() ) {
            result.push( valueToken.v );
            parser.allowWhitespace();
            if ( parser.matchString( ']' ) ) {
              return {
                v: result
              };
            }
            if ( !parser.matchString( ',' ) ) {
              return null;
            }
            parser.allowWhitespace();
          }
          return null;
        }
      ]
    } );

    function getKeyValuePair( parser ) {
      var key, valueToken, pair;
      parser.allowWhitespace();
      key = getKey( parser );
      if ( !key ) {
        return null;
      }
      pair = {
        key: key
      };
      parser.allowWhitespace();
      if ( !parser.matchString( ':' ) ) {
        return null;
      }
      parser.allowWhitespace();
      valueToken = parser.read();
      if ( !valueToken ) {
        return null;
      }
      pair.value = valueToken.v;
      return pair;
    }
    return function( str, values ) {
      var parser = new JsonParser( str, {
        values: values
      } );
      return parser.result;
    };
  }( Parser, stringLiteral, key );

  /* parse/converters/element/processDirective.js */
  var processDirective = function( Parser, conditional, flattenExpression, parseJSON ) {

    var methodCallPattern = /^([a-zA-Z_$][a-zA-Z_$0-9]*)\(/,
      ExpressionParser;
    ExpressionParser = Parser.extend( {
      converters: [ conditional ]
    } );
    // TODO clean this up, it's shocking
    return function( tokens ) {
      var result, match, parser, args, token, colonIndex, directiveName, directiveArgs, parsed;
      if ( typeof tokens === 'string' ) {
        if ( match = methodCallPattern.exec( tokens ) ) {
          result = {
            m: match[ 1 ]
          };
          args = '[' + tokens.slice( result.m.length + 1, -1 ) + ']';
          parser = new ExpressionParser( args );
          result.a = flattenExpression( parser.result[ 0 ] );
          return result;
        }
        if ( tokens.indexOf( ':' ) === -1 ) {
          return tokens.trim();
        }
        tokens = [ tokens ];
      }
      result = {};
      directiveName = [];
      directiveArgs = [];
      if ( tokens ) {
        while ( tokens.length ) {
          token = tokens.shift();
          if ( typeof token === 'string' ) {
            colonIndex = token.indexOf( ':' );
            if ( colonIndex === -1 ) {
              directiveName.push( token );
            } else {
              // is the colon the first character?
              if ( colonIndex ) {
                // no
                directiveName.push( token.substr( 0, colonIndex ) );
              }
              // if there is anything after the colon in this token, treat
              // it as the first token of the directiveArgs fragment
              if ( token.length > colonIndex + 1 ) {
                directiveArgs[ 0 ] = token.substring( colonIndex + 1 );
              }
              break;
            }
          } else {
            directiveName.push( token );
          }
        }
        directiveArgs = directiveArgs.concat( tokens );
      }
      if ( !directiveName.length ) {
        result = '';
      } else if ( directiveArgs.length || typeof directiveName !== 'string' ) {
        result = {
          // TODO is this really necessary? just use the array
          n: directiveName.length === 1 && typeof directiveName[ 0 ] === 'string' ? directiveName[ 0 ] : directiveName
        };
        if ( directiveArgs.length === 1 && typeof directiveArgs[ 0 ] === 'string' ) {
          parsed = parseJSON( '[' + directiveArgs[ 0 ] + ']' );
          result.a = parsed ? parsed.value : directiveArgs[ 0 ].trim();
        } else {
          result.d = directiveArgs;
        }
      } else {
        result = directiveName;
      }
      return result;
    };
  }( Parser, conditional, flattenExpression, parseJSON );

  /* parse/converters/element.js */
  var element = function( types, voidElementNames, getMustache, getComment, getText, getClosingTag, getAttribute, processDirective ) {

    var __export;
    var tagNamePattern = /^[a-zA-Z]{1,}:?[a-zA-Z0-9\-]*/,
      validTagNameFollower = /^[\s\n\/>]/,
      onPattern = /^on/,
      proxyEventPattern = /^on-([a-zA-Z\\*\\.$_][a-zA-Z\\*\\.$_0-9\-]+)$/,
      reservedEventNames = /^(?:change|reset|teardown|update|construct|config|init|render|unrender|detach|insert)$/,
      directives = {
        'intro-outro': 't0',
        intro: 't1',
        outro: 't2',
        decorator: 'o'
      },
      exclude = {
        exclude: true
      },
      converters, disallowedContents;
    // Different set of converters, because this time we're looking for closing tags
    converters = [
      getMustache,
      getComment,
      getElement,
      getText,
      getClosingTag
    ];
    // based on http://developers.whatwg.org/syntax.html#syntax-tag-omission
    disallowedContents = {
      li: [ 'li' ],
      dt: [
        'dt',
        'dd'
      ],
      dd: [
        'dt',
        'dd'
      ],
      p: 'address article aside blockquote div dl fieldset footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol p pre section table ul'.split( ' ' ),
      rt: [
        'rt',
        'rp'
      ],
      rp: [
        'rt',
        'rp'
      ],
      optgroup: [ 'optgroup' ],
      option: [
        'option',
        'optgroup'
      ],
      thead: [
        'tbody',
        'tfoot'
      ],
      tbody: [
        'tbody',
        'tfoot'
      ],
      tfoot: [ 'tbody' ],
      tr: [
        'tr',
        'tbody'
      ],
      td: [
        'td',
        'th',
        'tr'
      ],
      th: [
        'td',
        'th',
        'tr'
      ]
    };
    __export = getElement;

    function getElement( parser ) {
      var start, element, lowerCaseName, directiveName, match, addProxyEvent, attribute, directive, selfClosing, children, child;
      start = parser.pos;
      if ( parser.inside || parser.inAttribute ) {
        return null;
      }
      if ( !parser.matchString( '<' ) ) {
        return null;
      }
      // if this is a closing tag, abort straight away
      if ( parser.nextChar() === '/' ) {
        return null;
      }
      element = {
        t: types.ELEMENT
      };
      if ( parser.includeLinePositions ) {
        element.p = parser.getLinePos( start );
      }
      if ( parser.matchString( '!' ) ) {
        element.y = 1;
      }
      // element name
      element.e = parser.matchPattern( tagNamePattern );
      if ( !element.e ) {
        return null;
      }
      // next character must be whitespace, closing solidus or '>'
      if ( !validTagNameFollower.test( parser.nextChar() ) ) {
        parser.error( 'Illegal tag name' );
      }
      addProxyEvent = function( name, directive ) {
        var directiveName = directive.n || directive;
        if ( reservedEventNames.test( directiveName ) ) {
          parser.pos -= directiveName.length;
          parser.error( 'Cannot use reserved event names (change, reset, teardown, update, construct, config, init, render, unrender, detach, insert)' );
        }
        element.v[ name ] = directive;
      };
      parser.allowWhitespace();
      // directives and attributes
      while ( attribute = getMustache( parser ) || getAttribute( parser ) ) {
        // regular attributes
        if ( attribute.name ) {
          // intro, outro, decorator
          if ( directiveName = directives[ attribute.name ] ) {
            element[ directiveName ] = processDirective( attribute.value );
          } else if ( match = proxyEventPattern.exec( attribute.name ) ) {
            if ( !element.v )
              element.v = {};
            directive = processDirective( attribute.value );
            addProxyEvent( match[ 1 ], directive );
          } else {
            if ( !parser.sanitizeEventAttributes || !onPattern.test( attribute.name ) ) {
              if ( !element.a )
                element.a = {};
              element.a[ attribute.name ] = attribute.value || 0;
            }
          }
        } else {
          if ( !element.m )
            element.m = [];
          element.m.push( attribute );
        }
        parser.allowWhitespace();
      }
      // allow whitespace before closing solidus
      parser.allowWhitespace();
      // self-closing solidus?
      if ( parser.matchString( '/' ) ) {
        selfClosing = true;
      }
      // closing angle bracket
      if ( !parser.matchString( '>' ) ) {
        return null;
      }
      lowerCaseName = element.e.toLowerCase();
      if ( !selfClosing && !voidElementNames.test( element.e ) ) {
        // Special case - if we open a script element, further tags should
        // be ignored unless they're a closing script element
        if ( lowerCaseName === 'script' || lowerCaseName === 'style' ) {
          parser.inside = lowerCaseName;
        }
        children = [];
        while ( canContain( lowerCaseName, parser.remaining() ) && ( child = parser.read( converters ) ) ) {
          // Special case - closing section tag
          if ( child.t === types.CLOSING ) {
            break;
          }
          if ( child.t === types.CLOSING_TAG ) {
            break;
          }
          children.push( child );
        }
        if ( children.length ) {
          element.f = children;
        }
      }
      parser.inside = null;
      if ( parser.sanitizeElements && parser.sanitizeElements.indexOf( lowerCaseName ) !== -1 ) {
        return exclude;
      }
      return element;
    }

    function canContain( name, remaining ) {
      var match, disallowed;
      match = /^<([a-zA-Z][a-zA-Z0-9]*)/.exec( remaining );
      disallowed = disallowedContents[ name ];
      if ( !match || !disallowed ) {
        return true;
      }
      return !~disallowed.indexOf( match[ 1 ].toLowerCase() );
    }
    return __export;
  }( types, voidElementNames, mustache, comment, text, closingTag, attribute, processDirective );

  /* parse/utils/trimWhitespace.js */
  var trimWhitespace = function() {

    var leadingWhitespace = /^[ \t\f\r\n]+/,
      trailingWhitespace = /[ \t\f\r\n]+$/;
    return function( items, leading, trailing ) {
      var item;
      if ( leading ) {
        item = items[ 0 ];
        if ( typeof item === 'string' ) {
          item = item.replace( leadingWhitespace, '' );
          if ( !item ) {
            items.shift();
          } else {
            items[ 0 ] = item;
          }
        }
      }
      if ( trailing ) {
        item = items[ items.length - 1 ];
        if ( typeof item === 'string' ) {
          item = item.replace( trailingWhitespace, '' );
          if ( !item ) {
            items.pop();
          } else {
            items[ items.length - 1 ] = item;
          }
        }
      }
    };
  }();

  /* parse/utils/stripStandalones.js */
  var stripStandalones = function( types ) {

    var __export;
    var leadingLinebreak = /^\s*\r?\n/,
      trailingLinebreak = /\r?\n\s*$/;
    __export = function( items ) {
      var i, current, backOne, backTwo, lastSectionItem;
      for ( i = 1; i < items.length; i += 1 ) {
        current = items[ i ];
        backOne = items[ i - 1 ];
        backTwo = items[ i - 2 ];
        // if we're at the end of a [text][comment][text] sequence...
        if ( isString( current ) && isComment( backOne ) && isString( backTwo ) ) {
          // ... and the comment is a standalone (i.e. line breaks either side)...
          if ( trailingLinebreak.test( backTwo ) && leadingLinebreak.test( current ) ) {
            // ... then we want to remove the whitespace after the first line break
            items[ i - 2 ] = backTwo.replace( trailingLinebreak, '\n' );
            // and the leading line break of the second text token
            items[ i ] = current.replace( leadingLinebreak, '' );
          }
        }
        // if the current item is a section, and it is preceded by a linebreak, and
        // its first item is a linebreak...
        if ( isSection( current ) && isString( backOne ) ) {
          if ( trailingLinebreak.test( backOne ) && isString( current.f[ 0 ] ) && leadingLinebreak.test( current.f[ 0 ] ) ) {
            items[ i - 1 ] = backOne.replace( trailingLinebreak, '\n' );
            current.f[ 0 ] = current.f[ 0 ].replace( leadingLinebreak, '' );
          }
        }
        // if the last item was a section, and it is followed by a linebreak, and
        // its last item is a linebreak...
        if ( isString( current ) && isSection( backOne ) ) {
          lastSectionItem = backOne.f[ backOne.f.length - 1 ];
          if ( isString( lastSectionItem ) && trailingLinebreak.test( lastSectionItem ) && leadingLinebreak.test( current ) ) {
            backOne.f[ backOne.f.length - 1 ] = lastSectionItem.replace( trailingLinebreak, '\n' );
            items[ i ] = current.replace( leadingLinebreak, '' );
          }
        }
      }
      return items;
    };

    function isString( item ) {
      return typeof item === 'string';
    }

    function isComment( item ) {
      return item.t === types.COMMENT || item.t === types.DELIMCHANGE;
    }

    function isSection( item ) {
      return ( item.t === types.SECTION || item.t === types.INVERTED ) && item.f;
    }
    return __export;
  }( types );

  /* utils/escapeRegExp.js */
  var escapeRegExp = function() {

    var pattern = /[-/\\^$*+?.()|[\]{}]/g;
    return function escapeRegExp( str ) {
      return str.replace( pattern, '\\$&' );
    };
  }();

  /* parse/_parse.js */
  var parse = function( types, Parser, mustache, comment, element, text, trimWhitespace, stripStandalones, escapeRegExp ) {

    var __export;
    var StandardParser, parse, contiguousWhitespace = /[ \t\f\r\n]+/g,
      preserveWhitespaceElements = /^(?:pre|script|style|textarea)$/i,
      leadingWhitespace = /^\s+/,
      trailingWhitespace = /\s+$/;
    StandardParser = Parser.extend( {
      init: function( str, options ) {
        // config
        setDelimiters( options, this );
        this.sectionDepth = 0;
        this.interpolate = {
          script: !options.interpolate || options.interpolate.script !== false,
          style: !options.interpolate || options.interpolate.style !== false
        };
        if ( options.sanitize === true ) {
          options.sanitize = {
            // blacklist from https://code.google.com/p/google-caja/source/browse/trunk/src/com/google/caja/lang/html/html4-elements-whitelist.json
            elements: 'applet base basefont body frame frameset head html isindex link meta noframes noscript object param script style title'.split( ' ' ),
            eventAttributes: true
          };
        }
        this.sanitizeElements = options.sanitize && options.sanitize.elements;
        this.sanitizeEventAttributes = options.sanitize && options.sanitize.eventAttributes;
        this.includeLinePositions = options.includeLinePositions;
      },
      postProcess: function( items, options ) {
        if ( this.sectionDepth > 0 ) {
          this.error( 'A section was left open' );
        }
        cleanup( items, options.stripComments !== false, options.preserveWhitespace, !options.preserveWhitespace, !options.preserveWhitespace, options.rewriteElse !== false );
        return items;
      },
      converters: [
        mustache,
        comment,
        element,
        text
      ]
    } );
    parse = function( template ) {
      var options = arguments[ 1 ];
      if ( options === void 0 )
        options = {};
      var result, remaining, partials, name, startMatch, endMatch, inlinePartialStart, inlinePartialEnd;
      setDelimiters( options );
      inlinePartialStart = new RegExp( '<!--\\s*' + escapeRegExp( options.delimiters[ 0 ] ) + '\\s*>\\s*([a-zA-Z_$][a-zA-Z_$0-9]*)\\s*' + escapeRegExp( options.delimiters[ 1 ] ) + '\\s*-->' );
      inlinePartialEnd = new RegExp( '<!--\\s*' + escapeRegExp( options.delimiters[ 0 ] ) + '\\s*\\/\\s*([a-zA-Z_$][a-zA-Z_$0-9]*)\\s*' + escapeRegExp( options.delimiters[ 1 ] ) + '\\s*-->' );
      result = {
        v: 1
      };
      if ( inlinePartialStart.test( template ) ) {
        remaining = template;
        template = '';
        while ( startMatch = inlinePartialStart.exec( remaining ) ) {
          name = startMatch[ 1 ];
          template += remaining.substr( 0, startMatch.index );
          remaining = remaining.substring( startMatch.index + startMatch[ 0 ].length );
          endMatch = inlinePartialEnd.exec( remaining );
          if ( !endMatch || endMatch[ 1 ] !== name ) {
            throw new Error( 'Inline partials must have a closing delimiter, and cannot be nested. Expected closing for "' + name + '", but ' + ( endMatch ? 'instead found "' + endMatch[ 1 ] + '"' : ' no closing found' ) );
          }
          ( partials || ( partials = {} ) )[ name ] = new StandardParser( remaining.substr( 0, endMatch.index ), options ).result;
          remaining = remaining.substring( endMatch.index + endMatch[ 0 ].length );
        }
        template += remaining;
        result.p = partials;
      }
      result.t = new StandardParser( template, options ).result;
      return result;
    };
    __export = parse;

    function cleanup( items, stripComments, preserveWhitespace, removeLeadingWhitespace, removeTrailingWhitespace, rewriteElse ) {
      var i, item, previousItem, nextItem, preserveWhitespaceInsideFragment, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment, unlessBlock, key;
      // First pass - remove standalones and comments etc
      stripStandalones( items );
      i = items.length;
      while ( i-- ) {
        item = items[ i ];
        // Remove delimiter changes, unsafe elements etc
        if ( item.exclude ) {
          items.splice( i, 1 );
        } else if ( stripComments && item.t === types.COMMENT ) {
          items.splice( i, 1 );
        }
      }
      // If necessary, remove leading and trailing whitespace
      trimWhitespace( items, removeLeadingWhitespace, removeTrailingWhitespace );
      i = items.length;
      while ( i-- ) {
        item = items[ i ];
        // Recurse
        if ( item.f ) {
          preserveWhitespaceInsideFragment = preserveWhitespace || item.t === types.ELEMENT && preserveWhitespaceElements.test( item.e );
          if ( !preserveWhitespaceInsideFragment ) {
            previousItem = items[ i - 1 ];
            nextItem = items[ i + 1 ];
            // if the previous item was a text item with trailing whitespace,
            // remove leading whitespace inside the fragment
            if ( !previousItem || typeof previousItem === 'string' && trailingWhitespace.test( previousItem ) ) {
              removeLeadingWhitespaceInsideFragment = true;
            }
            // and vice versa
            if ( !nextItem || typeof nextItem === 'string' && leadingWhitespace.test( nextItem ) ) {
              removeTrailingWhitespaceInsideFragment = true;
            }
          }
          cleanup( item.f, stripComments, preserveWhitespaceInsideFragment, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment, rewriteElse );
        }
        // Split if-else blocks into two (an if, and an unless)
        if ( item.l ) {
          cleanup( item.l, stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment, rewriteElse );
          if ( rewriteElse ) {
            unlessBlock = {
              t: 4,
              n: types.SECTION_UNLESS,
              f: item.l
            };
            // copy the conditional based on its type
            if ( item.r ) {
              unlessBlock.r = item.r;
            }
            if ( item.x ) {
              unlessBlock.x = item.x;
            }
            if ( item.rx ) {
              unlessBlock.rx = item.rx;
            }
            items.splice( i + 1, 0, unlessBlock );
            delete item.l;
          }
        }
        // Clean up element attributes
        if ( item.a ) {
          for ( key in item.a ) {
            if ( item.a.hasOwnProperty( key ) && typeof item.a[ key ] !== 'string' ) {
              cleanup( item.a[ key ], stripComments, preserveWhitespace, removeLeadingWhitespaceInsideFragment, removeTrailingWhitespaceInsideFragment, rewriteElse );
            }
          }
        }
      }
      // final pass - fuse text nodes together
      i = items.length;
      while ( i-- ) {
        if ( typeof items[ i ] === 'string' ) {
          if ( typeof items[ i + 1 ] === 'string' ) {
            items[ i ] = items[ i ] + items[ i + 1 ];
            items.splice( i + 1, 1 );
          }
          if ( !preserveWhitespace ) {
            items[ i ] = items[ i ].replace( contiguousWhitespace, ' ' );
          }
          if ( items[ i ] === '' ) {
            items.splice( i, 1 );
          }
        }
      }
    }

    function setDelimiters( source ) {
      var target = arguments[ 1 ];
      if ( target === void 0 )
        target = source;
      target.delimiters = source.delimiters || [
        '{{',
        '}}'
      ];
      target.tripleDelimiters = source.tripleDelimiters || [
        '{{{',
        '}}}'
      ];
      target.staticDelimiters = source.staticDelimiters || [
        '[[',
        ']]'
      ];
      target.staticTripleDelimiters = source.staticTripleDelimiters || [
        '[[[',
        ']]]'
      ];
    }
    return __export;
  }( types, Parser, mustache, comment, element, text, trimWhitespace, stripStandalones, escapeRegExp );

  /* config/options/groups/optionGroup.js */
  var optionGroup = function() {

    return function createOptionGroup( keys, config ) {
      var group = keys.map( config );
      keys.forEach( function( key, i ) {
        group[ key ] = group[ i ];
      } );
      return group;
    };
  }( legacy );

  /* config/options/groups/parseOptions.js */
  var parseOptions = function( optionGroup ) {

    var keys, parseOptions;
    keys = [
      'preserveWhitespace',
      'sanitize',
      'stripComments',
      'delimiters',
      'tripleDelimiters',
      'interpolate'
    ];
    parseOptions = optionGroup( keys, function( key ) {
      return key;
    } );
    return parseOptions;
  }( optionGroup );

  /* config/options/template/parser.js */
  var parser = function( errors, isClient, parse, create, parseOptions ) {

    var parser = {
      parse: doParse,
      fromId: fromId,
      isHashedId: isHashedId,
      isParsed: isParsed,
      getParseOptions: getParseOptions,
      createHelper: createHelper
    };

    function createHelper( parseOptions ) {
      var helper = create( parser );
      helper.parse = function( template, options ) {
        return doParse( template, options || parseOptions );
      };
      return helper;
    }

    function doParse( template, parseOptions ) {
      if ( !parse ) {
        throw new Error( errors.missingParser );
      }
      return parse( template, parseOptions || this.options );
    }

    function fromId( id, options ) {
      var template;
      if ( !isClient ) {
        if ( options && options.noThrow ) {
          return;
        }
        throw new Error( 'Cannot retrieve template #' + id + ' as Ractive is not running in a browser.' );
      }
      if ( isHashedId( id ) ) {
        id = id.substring( 1 );
      }
      if ( !( template = document.getElementById( id ) ) ) {
        if ( options && options.noThrow ) {
          return;
        }
        throw new Error( 'Could not find template element with id #' + id );
      }
      if ( template.tagName.toUpperCase() !== 'SCRIPT' ) {
        if ( options && options.noThrow ) {
          return;
        }
        throw new Error( 'Template element with id #' + id + ', must be a <script> element' );
      }
      return template.innerHTML;
    }

    function isHashedId( id ) {
      return id && id.charAt( 0 ) === '#';
    }

    function isParsed( template ) {
      return !( typeof template === 'string' );
    }

    function getParseOptions( ractive ) {
      // Could be Ractive or a Component
      if ( ractive.defaults ) {
        ractive = ractive.defaults;
      }
      return parseOptions.reduce( function( val, key ) {
        val[ key ] = ractive[ key ];
        return val;
      }, {} );
    }
    return parser;
  }( errors, isClient, parse, create, parseOptions );

  /* config/options/template/template.js */
  var template = function( parser, parse ) {

    var templateConfig = {
      name: 'template',
      extend: function extend( Parent, proto, options ) {
        var template;
        // only assign if exists
        if ( 'template' in options ) {
          template = options.template;
          if ( typeof template === 'function' ) {
            proto.template = template;
          } else {
            proto.template = parseIfString( template, proto );
          }
        }
      },
      init: function init( Parent, ractive, options ) {
        var template, fn;
        // TODO because of prototypal inheritance, we might just be able to use
        // ractive.template, and not bother passing through the Parent object.
        // At present that breaks the test mocks' expectations
        template = 'template' in options ? options.template : Parent.prototype.template;
        if ( typeof template === 'function' ) {
          fn = template;
          template = getDynamicTemplate( ractive, fn );
          ractive._config.template = {
            fn: fn,
            result: template
          };
        }
        template = parseIfString( template, ractive );
        // TODO the naming of this is confusing - ractive.template refers to [...],
        // but Component.prototype.template refers to {v:1,t:[],p:[]}...
        // it's unnecessary, because the developer never needs to access
        // ractive.template
        ractive.template = template.t;
        if ( template.p ) {
          extendPartials( ractive.partials, template.p );
        }
      },
      reset: function( ractive ) {
        var result = resetValue( ractive ),
          parsed;
        if ( result ) {
          parsed = parseIfString( result, ractive );
          ractive.template = parsed.t;
          extendPartials( ractive.partials, parsed.p, true );
          return true;
        }
      }
    };

    function resetValue( ractive ) {
      var initial = ractive._config.template,
        result;
      // If this isn't a dynamic template, there's nothing to do
      if ( !initial || !initial.fn ) {
        return;
      }
      result = getDynamicTemplate( ractive, initial.fn );
      // TODO deep equality check to prevent unnecessary re-rendering
      // in the case of already-parsed templates
      if ( result !== initial.result ) {
        initial.result = result;
        result = parseIfString( result, ractive );
        return result;
      }
    }

    function getDynamicTemplate( ractive, fn ) {
      var helper = parser.createHelper( parser.getParseOptions( ractive ) );
      return fn.call( ractive, ractive.data, helper );
    }

    function parseIfString( template, ractive ) {
      if ( typeof template === 'string' ) {
        // ID of an element containing the template?
        if ( template[ 0 ] === '#' ) {
          template = parser.fromId( template );
        }
        template = parse( template, parser.getParseOptions( ractive ) );
      } else if ( template.v !== 1 ) {
        throw new Error( 'Mismatched template version! Please ensure you are using the latest version of Ractive.js in your build process as well as in your app' );
      }
      return template;
    }

    function extendPartials( existingPartials, newPartials, overwrite ) {
      if ( !newPartials )
        return;
      // TODO there's an ambiguity here - we need to overwrite in the `reset()`
      // case, but not initially...
      for ( var key in newPartials ) {
        if ( overwrite || !existingPartials.hasOwnProperty( key ) ) {
          existingPartials[ key ] = newPartials[ key ];
        }
      }
    }
    return templateConfig;
  }( parser, parse );

  /* config/options/Registry.js */
  var Registry = function( create ) {

    function Registry( name, useDefaults ) {
      this.name = name;
      this.useDefaults = useDefaults;
    }
    Registry.prototype = {
      constructor: Registry,
      extend: function( Parent, proto, options ) {
        this.configure( this.useDefaults ? Parent.defaults : Parent, this.useDefaults ? proto : proto.constructor, options );
      },
      init: function( Parent, ractive, options ) {
        this.configure( this.useDefaults ? Parent.defaults : Parent, ractive, options );
      },
      configure: function( Parent, target, options ) {
        var name = this.name,
          option = options[ name ],
          registry;
        registry = create( Parent[ name ] );
        for ( var key in option ) {
          registry[ key ] = option[ key ];
        }
        target[ name ] = registry;
      },
      reset: function( ractive ) {
        var registry = ractive[ this.name ];
        var changed = false;
        Object.keys( registry ).forEach( function( key ) {
          var item = registry[ key ];
          if ( item._fn ) {
            if ( item._fn.isOwner ) {
              registry[ key ] = item._fn;
            } else {
              delete registry[ key ];
            }
            changed = true;
          }
        } );
        return changed;
      },
      findOwner: function( ractive, key ) {
        return ractive[ this.name ].hasOwnProperty( key ) ? ractive : this.findConstructor( ractive.constructor, key );
      },
      findConstructor: function( constructor, key ) {
        if ( !constructor ) {
          return;
        }
        return constructor[ this.name ].hasOwnProperty( key ) ? constructor : this.findConstructor( constructor._parent, key );
      },
      find: function( ractive, key ) {
        var this$0 = this;
        return recurseFind( ractive, function( r ) {
          return r[ this$0.name ][ key ];
        } );
      },
      findInstance: function( ractive, key ) {
        var this$0 = this;
        return recurseFind( ractive, function( r ) {
          return r[ this$0.name ][ key ] ? r : void 0;
        } );
      }
    };

    function recurseFind( ractive, fn ) {
      var find, parent;
      if ( find = fn( ractive ) ) {
        return find;
      }
      if ( !ractive.isolated && ( parent = ractive._parent ) ) {
        return recurseFind( parent, fn );
      }
    }
    return Registry;
  }( create, legacy );

  /* config/options/groups/registries.js */
  var registries = function( optionGroup, Registry ) {

    var keys = [
        'adaptors',
        'components',
        'computed',
        'decorators',
        'easing',
        'events',
        'interpolators',
        'partials',
        'transitions'
      ],
      registries = optionGroup( keys, function( key ) {
        return new Registry( key, key === 'computed' );
      } );
    return registries;
  }( optionGroup, Registry );

  /* utils/noop.js */
  var noop = function() {};

  /* utils/wrapPrototypeMethod.js */
  var wrapPrototypeMethod = function( noop ) {

    var __export;
    __export = function wrap( parent, name, method ) {
      if ( !/_super/.test( method ) ) {
        return method;
      }
      var wrapper = function wrapSuper() {
        var superMethod = getSuperMethod( wrapper._parent, name ),
          hasSuper = '_super' in this,
          oldSuper = this._super,
          result;
        this._super = superMethod;
        result = method.apply( this, arguments );
        if ( hasSuper ) {
          this._super = oldSuper;
        } else {
          delete this._super;
        }
        return result;
      };
      wrapper._parent = parent;
      wrapper._method = method;
      return wrapper;
    };

    function getSuperMethod( parent, name ) {
      var method;
      if ( name in parent ) {
        var value = parent[ name ];
        if ( typeof value === 'function' ) {
          method = value;
        } else {
          method = function returnValue() {
            return value;
          };
        }
      } else {
        method = noop;
      }
      return method;
    }
    return __export;
  }( noop );

  /* config/deprecate.js */
  var deprecate = function( warn, isArray ) {

    function deprecate( options, deprecated, correct ) {
      if ( deprecated in options ) {
        if ( !( correct in options ) ) {
          warn( getMessage( deprecated, correct ) );
          options[ correct ] = options[ deprecated ];
        } else {
          throw new Error( getMessage( deprecated, correct, true ) );
        }
      }
    }

    function getMessage( deprecated, correct, isError ) {
      return 'options.' + deprecated + ' has been deprecated in favour of options.' + correct + '.' + ( isError ? ' You cannot specify both options, please use options.' + correct + '.' : '' );
    }

    function deprecateEventDefinitions( options ) {
      deprecate( options, 'eventDefinitions', 'events' );
    }

    function deprecateAdaptors( options ) {
      // Using extend with Component instead of options,
      // like Human.extend( Spider ) means adaptors as a registry
      // gets copied to options. So we have to check if actually an array
      if ( isArray( options.adaptors ) ) {
        deprecate( options, 'adaptors', 'adapt' );
      }
    }
    return function deprecateOptions( options ) {
      deprecate( options, 'beforeInit', 'onconstruct' );
      deprecate( options, 'init', 'onrender' );
      deprecate( options, 'complete', 'oncomplete' );
      deprecateEventDefinitions( options );
      deprecateAdaptors( options );
    };
  }( warn, isArray );

  /* config/config.js */
  var config = function( css, data, defaults, template, parseOptions, registries, wrapPrototype, deprecate ) {

    var custom, options, config, blacklisted;
    // would be nice to not have these here,
    // they get added during initialise, so for now we have
    // to make sure not to try and extend them.
    // Possibly, we could re-order and not add till later
    // in process.
    blacklisted = {
      '_parent': true,
      '_component': true
    };
    custom = {
      data: data,
      template: template,
      css: css
    };
    options = Object.keys( defaults ).filter( function( key ) {
      return !registries[ key ] && !custom[ key ] && !parseOptions[ key ];
    } );
    // this defines the order:
    config = [].concat( custom.data, parseOptions, options, registries, custom.template, custom.css );
    for ( var key in custom ) {
      config[ key ] = custom[ key ];
    }
    // for iteration
    config.keys = Object.keys( defaults ).concat( registries.map( function( r ) {
      return r.name;
    } ) ).concat( [ 'css' ] );
    // add these to blacklisted key's that we don't double extend
    config.keys.forEach( function( key ) {
      return blacklisted[ key ] = true;
    } );
    config.parseOptions = parseOptions;
    config.registries = registries;

    function customConfig( method, key, Parent, instance, options ) {
      custom[ key ][ method ]( Parent, instance, options );
    }
    config.extend = function( Parent, proto, options ) {
      configure( 'extend', Parent, proto, options );
    };
    config.init = function( Parent, ractive, options ) {
      configure( 'init', Parent, ractive, options );
    };

    function isStandardDefaultKey( key ) {
      return key in defaults && !( key in config.parseOptions ) && !( key in custom );
    }

    function configure( method, Parent, instance, options ) {
      deprecate( options );
      customConfig( method, 'data', Parent, instance, options );
      config.parseOptions.forEach( function( key ) {
        if ( key in options ) {
          instance[ key ] = options[ key ];
        }
      } );
      for ( var key in options ) {
        if ( isStandardDefaultKey( key ) ) {
          var value = options[ key ];
          instance[ key ] = typeof value === 'function' ? wrapPrototype( Parent.prototype, key, value ) : value;
        }
      }
      config.registries.forEach( function( registry ) {
        registry[ method ]( Parent, instance, options );
      } );
      customConfig( method, 'template', Parent, instance, options );
      customConfig( method, 'css', Parent, instance, options );
      extendOtherMethods( Parent.prototype, instance, options );
    }

    function extendOtherMethods( parent, instance, options ) {
      for ( var key in options ) {
        if ( !( key in blacklisted ) && options.hasOwnProperty( key ) ) {
          var member = options[ key ];
          // if this is a method that overwrites a method, wrap it:
          if ( typeof member === 'function' ) {
            member = wrapPrototype( parent, key, member );
          }
          instance[ key ] = member;
        }
      }
    }
    config.reset = function( ractive ) {
      return config.filter( function( c ) {
        return c.reset && c.reset( ractive );
      } ).map( function( c ) {
        return c.name;
      } );
    };
    config.getConstructTarget = function( ractive, options ) {
      if ( options.onconstruct ) {
        // pretend this object literal is the ractive instance
        return {
          onconstruct: wrapPrototype( ractive, 'onconstruct', options.onconstruct ).bind( ractive ),
          fire: ractive.fire.bind( ractive )
        };
      } else {
        return ractive;
      }
    };
    return config;
  }( css, data, options, template, parseOptions, registries, wrapPrototypeMethod, deprecate );

  /* shared/interpolate.js */
  var interpolate = function( circular, warn, interpolators, config ) {

    var __export;
    var interpolate = function( from, to, ractive, type ) {
      if ( from === to ) {
        return snap( to );
      }
      if ( type ) {
        var interpol = config.registries.interpolators.find( ractive, type );
        if ( interpol ) {
          return interpol( from, to ) || snap( to );
        }
        warn( 'Missing "' + type + '" interpolator. You may need to download a plugin from [TODO]' );
      }
      return interpolators.number( from, to ) || interpolators.array( from, to ) || interpolators.object( from, to ) || snap( to );
    };
    circular.interpolate = interpolate;
    __export = interpolate;

    function snap( to ) {
      return function() {
        return to;
      };
    }
    return __export;
  }( circular, warn, interpolators, config );

  /* Ractive/prototype/animate/Animation.js */
  var Ractive$animate_Animation = function( warn, runloop, interpolate ) {

    var Animation = function( options ) {
      var key;
      this.startTime = Date.now();
      // from and to
      for ( key in options ) {
        if ( options.hasOwnProperty( key ) ) {
          this[ key ] = options[ key ];
        }
      }
      this.interpolator = interpolate( this.from, this.to, this.root, this.interpolator );
      this.running = true;
      this.tick();
    };
    Animation.prototype = {
      tick: function() {
        var elapsed, t, value, timeNow, index, keypath;
        keypath = this.keypath;
        if ( this.running ) {
          timeNow = Date.now();
          elapsed = timeNow - this.startTime;
          if ( elapsed >= this.duration ) {
            if ( keypath !== null ) {
              runloop.start( this.root );
              this.root.viewmodel.set( keypath, this.to );
              runloop.end();
            }
            if ( this.step ) {
              this.step( 1, this.to );
            }
            this.complete( this.to );
            index = this.root._animations.indexOf( this );
            // TODO investigate why this happens
            if ( index === -1 ) {
              warn( 'Animation was not found' );
            }
            this.root._animations.splice( index, 1 );
            this.running = false;
            return false;
          }
          t = this.easing ? this.easing( elapsed / this.duration ) : elapsed / this.duration;
          if ( keypath !== null ) {
            value = this.interpolator( t );
            runloop.start( this.root );
            this.root.viewmodel.set( keypath, value );
            runloop.end();
          }
          if ( this.step ) {
            this.step( t, value );
          }
          return true;
        }
        return false;
      },
      stop: function() {
        var index;
        this.running = false;
        index = this.root._animations.indexOf( this );
        // TODO investigate why this happens
        if ( index === -1 ) {
          warn( 'Animation was not found' );
        }
        this.root._animations.splice( index, 1 );
      }
    };
    return Animation;
  }( warn, runloop, interpolate );

  /* Ractive/prototype/animate.js */
  var Ractive$animate = function( isEqual, Promise, normaliseKeypath, animations, Animation ) {

    var __export;
    var noop = function() {},
      noAnimation = {
        stop: noop
      };
    __export = function Ractive$animate( keypath, to, options ) {
      var promise, fulfilPromise, k, animation, animations, easing, duration, step, complete, makeValueCollector, currentValues, collectValue, dummy, dummyOptions;
      promise = new Promise( function( fulfil ) {
        fulfilPromise = fulfil;
      } );
      // animate multiple keypaths
      if ( typeof keypath === 'object' ) {
        options = to || {};
        easing = options.easing;
        duration = options.duration;
        animations = [];
        // we don't want to pass the `step` and `complete` handlers, as they will
        // run for each animation! So instead we'll store the handlers and create
        // our own...
        step = options.step;
        complete = options.complete;
        if ( step || complete ) {
          currentValues = {};
          options.step = null;
          options.complete = null;
          makeValueCollector = function( keypath ) {
            return function( t, value ) {
              currentValues[ keypath ] = value;
            };
          };
        }
        for ( k in keypath ) {
          if ( keypath.hasOwnProperty( k ) ) {
            if ( step || complete ) {
              collectValue = makeValueCollector( k );
              options = {
                easing: easing,
                duration: duration
              };
              if ( step ) {
                options.step = collectValue;
              }
            }
            options.complete = complete ? collectValue : noop;
            animations.push( animate( this, k, keypath[ k ], options ) );
          }
        }
        // Create a dummy animation, to facilitate step/complete
        // callbacks, and Promise fulfilment
        dummyOptions = {
          easing: easing,
          duration: duration
        };
        if ( step ) {
          dummyOptions.step = function( t ) {
            step( t, currentValues );
          };
        }
        if ( complete ) {
          promise.then( function( t ) {
            complete( t, currentValues );
          } );
        }
        dummyOptions.complete = fulfilPromise;
        dummy = animate( this, null, null, dummyOptions );
        animations.push( dummy );
        promise.stop = function() {
          var animation;
          while ( animation = animations.pop() ) {
            animation.stop();
          }
          if ( dummy ) {
            dummy.stop();
          }
        };
        return promise;
      }
      // animate a single keypath
      options = options || {};
      if ( options.complete ) {
        promise.then( options.complete );
      }
      options.complete = fulfilPromise;
      animation = animate( this, keypath, to, options );
      promise.stop = function() {
        animation.stop();
      };
      return promise;
    };

    function animate( root, keypath, to, options ) {
      var easing, duration, animation, from;
      if ( keypath ) {
        keypath = normaliseKeypath( keypath );
      }
      if ( keypath !== null ) {
        from = root.viewmodel.get( keypath );
      }
      // cancel any existing animation
      // TODO what about upstream/downstream keypaths?
      animations.abort( keypath, root );
      // don't bother animating values that stay the same
      if ( isEqual( from, to ) ) {
        if ( options.complete ) {
          options.complete( options.to );
        }
        return noAnimation;
      }
      // easing function
      if ( options.easing ) {
        if ( typeof options.easing === 'function' ) {
          easing = options.easing;
        } else {
          easing = root.easing[ options.easing ];
        }
        if ( typeof easing !== 'function' ) {
          easing = null;
        }
      }
      // duration
      duration = options.duration === undefined ? 400 : options.duration;
      // TODO store keys, use an internal set method
      animation = new Animation( {
        keypath: keypath,
        from: from,
        to: to,
        root: root,
        duration: duration,
        easing: easing,
        interpolator: options.interpolator,
        // TODO wrap callbacks if necessary, to use instance as context
        step: options.step,
        complete: options.complete
      } );
      animations.add( animation );
      root._animations.push( animation );
      return animation;
    }
    return __export;
  }( isEqual, Promise, normaliseKeypath, animations, Ractive$animate_Animation );

  /* Ractive/prototype/detach.js */
  var Ractive$detach = function( Hook, removeFromArray ) {

    var detachHook = new Hook( 'detach' );
    return function Ractive$detach() {
      if ( this.detached ) {
        return this.detached;
      }
      if ( this.el ) {
        removeFromArray( this.el.__ractive_instances__, this );
      }
      this.detached = this.fragment.detach();
      detachHook.fire( this );
      return this.detached;
    };
  }( Ractive$shared_hooks_Hook, removeFromArray );

  /* Ractive/prototype/find.js */
  var Ractive$find = function Ractive$find( selector ) {
    if ( !this.el ) {
      return null;
    }
    return this.fragment.find( selector );
  };

  /* utils/matches.js */
  var matches = function( isClient, vendors, createElement ) {

    var matches, div, methodNames, unprefixed, prefixed, i, j, makeFunction;
    if ( !isClient ) {
      matches = null;
    } else {
      div = createElement( 'div' );
      methodNames = [
        'matches',
        'matchesSelector'
      ];
      makeFunction = function( methodName ) {
        return function( node, selector ) {
          return node[ methodName ]( selector );
        };
      };
      i = methodNames.length;
      while ( i-- && !matches ) {
        unprefixed = methodNames[ i ];
        if ( div[ unprefixed ] ) {
          matches = makeFunction( unprefixed );
        } else {
          j = vendors.length;
          while ( j-- ) {
            prefixed = vendors[ i ] + unprefixed.substr( 0, 1 ).toUpperCase() + unprefixed.substring( 1 );
            if ( div[ prefixed ] ) {
              matches = makeFunction( prefixed );
              break;
            }
          }
        }
      }
      // IE8...
      if ( !matches ) {
        matches = function( node, selector ) {
          var nodes, parentNode, i;
          parentNode = node.parentNode;
          if ( !parentNode ) {
            // empty dummy <div>
            div.innerHTML = '';
            parentNode = div;
            node = node.cloneNode();
            div.appendChild( node );
          }
          nodes = parentNode.querySelectorAll( selector );
          i = nodes.length;
          while ( i-- ) {
            if ( nodes[ i ] === node ) {
              return true;
            }
          }
          return false;
        };
      }
    }
    return matches;
  }( isClient, vendors, createElement );

  /* Ractive/prototype/shared/makeQuery/test.js */
  var Ractive$shared_makeQuery_test = function( matches ) {

    return function( item, noDirty ) {
      var itemMatches = this._isComponentQuery ? !this.selector || item.name === this.selector : matches( item.node, this.selector );
      if ( itemMatches ) {
        this.push( item.node || item.instance );
        if ( !noDirty ) {
          this._makeDirty();
        }
        return true;
      }
    };
  }( matches );

  /* Ractive/prototype/shared/makeQuery/cancel.js */
  var Ractive$shared_makeQuery_cancel = function() {
    var liveQueries, selector, index;
    liveQueries = this._root[ this._isComponentQuery ? 'liveComponentQueries' : 'liveQueries' ];
    selector = this.selector;
    index = liveQueries.indexOf( selector );
    if ( index !== -1 ) {
      liveQueries.splice( index, 1 );
      liveQueries[ selector ] = null;
    }
  };

  /* Ractive/prototype/shared/makeQuery/sortByItemPosition.js */
  var Ractive$shared_makeQuery_sortByItemPosition = function() {

    var __export;
    __export = function( a, b ) {
      var ancestryA, ancestryB, oldestA, oldestB, mutualAncestor, indexA, indexB, fragments, fragmentA, fragmentB;
      ancestryA = getAncestry( a.component || a._ractive.proxy );
      ancestryB = getAncestry( b.component || b._ractive.proxy );
      oldestA = ancestryA[ ancestryA.length - 1 ];
      oldestB = ancestryB[ ancestryB.length - 1 ];
      // remove items from the end of both ancestries as long as they are identical
      // - the final one removed is the closest mutual ancestor
      while ( oldestA && oldestA === oldestB ) {
        ancestryA.pop();
        ancestryB.pop();
        mutualAncestor = oldestA;
        oldestA = ancestryA[ ancestryA.length - 1 ];
        oldestB = ancestryB[ ancestryB.length - 1 ];
      }
      // now that we have the mutual ancestor, we can find which is earliest
      oldestA = oldestA.component || oldestA;
      oldestB = oldestB.component || oldestB;
      fragmentA = oldestA.parentFragment;
      fragmentB = oldestB.parentFragment;
      // if both items share a parent fragment, our job is easy
      if ( fragmentA === fragmentB ) {
        indexA = fragmentA.items.indexOf( oldestA );
        indexB = fragmentB.items.indexOf( oldestB );
        // if it's the same index, it means one contains the other,
        // so we see which has the longest ancestry
        return indexA - indexB || ancestryA.length - ancestryB.length;
      }
      // if mutual ancestor is a section, we first test to see which section
      // fragment comes first
      if ( fragments = mutualAncestor.fragments ) {
        indexA = fragments.indexOf( fragmentA );
        indexB = fragments.indexOf( fragmentB );
        return indexA - indexB || ancestryA.length - ancestryB.length;
      }
      throw new Error( 'An unexpected condition was met while comparing the position of two components. Please file an issue at https://github.com/RactiveJS/Ractive/issues - thanks!' );
    };

    function getParent( item ) {
      var parentFragment;
      if ( parentFragment = item.parentFragment ) {
        return parentFragment.owner;
      }
      if ( item.component && ( parentFragment = item.component.parentFragment ) ) {
        return parentFragment.owner;
      }
    }

    function getAncestry( item ) {
      var ancestry, ancestor;
      ancestry = [ item ];
      ancestor = getParent( item );
      while ( ancestor ) {
        ancestry.push( ancestor );
        ancestor = getParent( ancestor );
      }
      return ancestry;
    }
    return __export;
  }();

  /* Ractive/prototype/shared/makeQuery/sortByDocumentPosition.js */
  var Ractive$shared_makeQuery_sortByDocumentPosition = function( sortByItemPosition ) {

    return function( node, otherNode ) {
      var bitmask;
      if ( node.compareDocumentPosition ) {
        bitmask = node.compareDocumentPosition( otherNode );
        return bitmask & 2 ? 1 : -1;
      }
      // In old IE, we can piggy back on the mechanism for
      // comparing component positions
      return sortByItemPosition( node, otherNode );
    };
  }( Ractive$shared_makeQuery_sortByItemPosition );

  /* Ractive/prototype/shared/makeQuery/sort.js */
  var Ractive$shared_makeQuery_sort = function( sortByDocumentPosition, sortByItemPosition ) {

    return function() {
      this.sort( this._isComponentQuery ? sortByItemPosition : sortByDocumentPosition );
      this._dirty = false;
    };
  }( Ractive$shared_makeQuery_sortByDocumentPosition, Ractive$shared_makeQuery_sortByItemPosition );

  /* Ractive/prototype/shared/makeQuery/dirty.js */
  var Ractive$shared_makeQuery_dirty = function( runloop ) {

    return function() {
      var this$0 = this;
      if ( !this._dirty ) {
        this._dirty = true;
        // Once the DOM has been updated, ensure the query
        // is correctly ordered
        runloop.scheduleTask( function() {
          this$0._sort();
        } );
      }
    };
  }( runloop );

  /* Ractive/prototype/shared/makeQuery/remove.js */
  var Ractive$shared_makeQuery_remove = function( nodeOrComponent ) {
    var index = this.indexOf( this._isComponentQuery ? nodeOrComponent.instance : nodeOrComponent );
    if ( index !== -1 ) {
      this.splice( index, 1 );
    }
  };

  /* Ractive/prototype/shared/makeQuery/_makeQuery.js */
  var Ractive$shared_makeQuery__makeQuery = function( defineProperties, test, cancel, sort, dirty, remove ) {

    return function makeQuery( ractive, selector, live, isComponentQuery ) {
      var query = [];
      defineProperties( query, {
        selector: {
          value: selector
        },
        live: {
          value: live
        },
        _isComponentQuery: {
          value: isComponentQuery
        },
        _test: {
          value: test
        }
      } );
      if ( !live ) {
        return query;
      }
      defineProperties( query, {
        cancel: {
          value: cancel
        },
        _root: {
          value: ractive
        },
        _sort: {
          value: sort
        },
        _makeDirty: {
          value: dirty
        },
        _remove: {
          value: remove
        },
        _dirty: {
          value: false,
          writable: true
        }
      } );
      return query;
    };
  }( defineProperties, Ractive$shared_makeQuery_test, Ractive$shared_makeQuery_cancel, Ractive$shared_makeQuery_sort, Ractive$shared_makeQuery_dirty, Ractive$shared_makeQuery_remove );

  /* Ractive/prototype/findAll.js */
  var Ractive$findAll = function( makeQuery ) {

    return function Ractive$findAll( selector, options ) {
      var liveQueries, query;
      if ( !this.el ) {
        return [];
      }
      options = options || {};
      liveQueries = this._liveQueries;
      // Shortcut: if we're maintaining a live query with this
      // selector, we don't need to traverse the parallel DOM
      if ( query = liveQueries[ selector ] ) {
        // Either return the exact same query, or (if not live) a snapshot
        return options && options.live ? query : query.slice();
      }
      query = makeQuery( this, selector, !!options.live, false );
      // Add this to the list of live queries Ractive needs to maintain,
      // if applicable
      if ( query.live ) {
        liveQueries.push( selector );
        liveQueries[ '_' + selector ] = query;
      }
      this.fragment.findAll( selector, query );
      return query;
    };
  }( Ractive$shared_makeQuery__makeQuery );

  /* Ractive/prototype/findAllComponents.js */
  var Ractive$findAllComponents = function( makeQuery ) {

    return function Ractive$findAllComponents( selector, options ) {
      var liveQueries, query;
      options = options || {};
      liveQueries = this._liveComponentQueries;
      // Shortcut: if we're maintaining a live query with this
      // selector, we don't need to traverse the parallel DOM
      if ( query = liveQueries[ selector ] ) {
        // Either return the exact same query, or (if not live) a snapshot
        return options && options.live ? query : query.slice();
      }
      query = makeQuery( this, selector, !!options.live, true );
      // Add this to the list of live queries Ractive needs to maintain,
      // if applicable
      if ( query.live ) {
        liveQueries.push( selector );
        liveQueries[ '_' + selector ] = query;
      }
      this.fragment.findAllComponents( selector, query );
      return query;
    };
  }( Ractive$shared_makeQuery__makeQuery );

  /* Ractive/prototype/findComponent.js */
  var Ractive$findComponent = function Ractive$findComponent( selector ) {
    return this.fragment.findComponent( selector );
  };

  /* utils/getPotentialWildcardMatches.js */
  var getPotentialWildcardMatches = function() {

    var __export;
    var starMaps = {};
    // This function takes a keypath such as 'foo.bar.baz', and returns
    // all the variants of that keypath that include a wildcard in place
    // of a key, such as 'foo.bar.*', 'foo.*.baz', 'foo.*.*' and so on.
    // These are then checked against the dependants map (ractive.viewmodel.depsMap)
    // to see if any pattern observers are downstream of one or more of
    // these wildcard keypaths (e.g. 'foo.bar.*.status')
    __export = function getPotentialWildcardMatches( keypath ) {
      var keys, starMap, mapper, i, result, wildcardKeypath;
      keys = keypath.split( '.' );
      if ( !( starMap = starMaps[ keys.length ] ) ) {
        starMap = getStarMap( keys.length );
      }
      result = [];
      mapper = function( star, i ) {
        return star ? '*' : keys[ i ];
      };
      i = starMap.length;
      while ( i-- ) {
        wildcardKeypath = starMap[ i ].map( mapper ).join( '.' );
        if ( !result.hasOwnProperty( wildcardKeypath ) ) {
          result.push( wildcardKeypath );
          result[ wildcardKeypath ] = true;
        }
      }
      return result;
    };
    // This function returns all the possible true/false combinations for
    // a given number - e.g. for two, the possible combinations are
    // [ true, true ], [ true, false ], [ false, true ], [ false, false ].
    // It does so by getting all the binary values between 0 and e.g. 11
    function getStarMap( num ) {
      var ones = '',
        max, binary, starMap, mapper, i;
      if ( !starMaps[ num ] ) {
        starMap = [];
        while ( ones.length < num ) {
          ones += 1;
        }
        max = parseInt( ones, 2 );
        mapper = function( digit ) {
          return digit === '1';
        };
        for ( i = 0; i <= max; i += 1 ) {
          binary = i.toString( 2 );
          while ( binary.length < num ) {
            binary = '0' + binary;
          }
          starMap[ i ] = Array.prototype.map.call( binary, mapper );
        }
        starMaps[ num ] = starMap;
      }
      return starMaps[ num ];
    }
    return __export;
  }();

  /* Ractive/prototype/shared/fireEvent.js */
  var Ractive$shared_fireEvent = function( getPotentialWildcardMatches ) {

    var __export;
    __export = function fireEvent( ractive, eventName ) {
      var options = arguments[ 2 ];
      if ( options === void 0 )
        options = {};
      if ( !eventName ) {
        return;
      }
      if ( !options.event ) {
        options.event = {
          name: eventName,
          context: ractive.data,
          keypath: '',
          // until event not included as argument default
          _noArg: true
        };
      } else {
        options.event.name = eventName;
      }
      var eventNames = getPotentialWildcardMatches( eventName );
      fireEventAs( ractive, eventNames, options.event, options.args, true );
    };

    function fireEventAs( ractive, eventNames, event, args ) {
      var initialFire = arguments[ 4 ];
      if ( initialFire === void 0 )
        initialFire = false;
      var subscribers, i, bubble = true;
      if ( event ) {
        ractive.event = event;
      }
      for ( i = eventNames.length; i >= 0; i-- ) {
        subscribers = ractive._subs[ eventNames[ i ] ];
        if ( subscribers ) {
          bubble = notifySubscribers( ractive, subscribers, event, args ) && bubble;
        }
      }
      if ( event ) {
        delete ractive.event;
      }
      if ( ractive._parent && bubble ) {
        if ( initialFire && ractive.component ) {
          var fullName = ractive.component.name + '.' + eventNames[ eventNames.length - 1 ];
          eventNames = getPotentialWildcardMatches( fullName );
          if ( event ) {
            event.component = ractive;
          }
        }
        fireEventAs( ractive._parent, eventNames, event, args );
      }
    }

    function notifySubscribers( ractive, subscribers, event, args ) {
      var originalEvent = null,
        stopEvent = false;
      if ( event && !event._noArg ) {
        args = [ event ].concat( args );
      }
      for ( var i = 0, len = subscribers.length; i < len; i += 1 ) {
        if ( subscribers[ i ].apply( ractive, args ) === false ) {
          stopEvent = true;
        }
      }
      if ( event && !event._noArg && stopEvent && ( originalEvent = event.original ) ) {
        originalEvent.preventDefault && originalEvent.preventDefault();
        originalEvent.stopPropagation && originalEvent.stopPropagation();
      }
      return !stopEvent;
    }
    return __export;
  }( getPotentialWildcardMatches );

  /* Ractive/prototype/fire.js */
  var Ractive$fire = function( fireEvent ) {

    return function Ractive$fire( eventName ) {
      var options = {
        args: Array.prototype.slice.call( arguments, 1 )
      };
      fireEvent( this, eventName, options );
    };
  }( Ractive$shared_fireEvent );

  /* Ractive/prototype/get.js */
  var Ractive$get = function( normaliseKeypath, resolveRef ) {

    var options = {
      capture: true
    };
    // top-level calls should be intercepted
    return function Ractive$get( keypath ) {
      var value;
      keypath = normaliseKeypath( keypath );
      value = this.viewmodel.get( keypath, options );
      // Create inter-component binding, if necessary
      if ( value === undefined && this._parent && !this.isolated ) {
        if ( resolveRef( this, keypath, this.fragment ) ) {
          // creates binding as side-effect, if appropriate
          value = this.viewmodel.get( keypath );
        }
      }
      return value;
    };
  }( normaliseKeypath, resolveRef );

  /* utils/getElement.js */
  var getElement = function getElement( input ) {
    var output;
    if ( !input || typeof input === 'boolean' ) {
      return;
    }
    if ( typeof window === 'undefined' || !document || !input ) {
      return null;
    }
    // We already have a DOM node - no work to do. (Duck typing alert!)
    if ( input.nodeType ) {
      return input;
    }
    // Get node from string
    if ( typeof input === 'string' ) {
      // try ID first
      output = document.getElementById( input );
      // then as selector, if possible
      if ( !output && document.querySelector ) {
        output = document.querySelector( input );
      }
      // did it work?
      if ( output && output.nodeType ) {
        return output;
      }
    }
    // If we've been given a collection (jQuery, Zepto etc), extract the first item
    if ( input[ 0 ] && input[ 0 ].nodeType ) {
      return input[ 0 ];
    }
    return null;
  };

  /* Ractive/prototype/insert.js */
  var Ractive$insert = function( Hook, getElement ) {

    var __export;
    var insertHook = new Hook( 'insert' );
    __export = function Ractive$insert( target, anchor ) {
      if ( !this.fragment.rendered ) {
        // TODO create, and link to, documentation explaining this
        throw new Error( 'The API has changed - you must call `ractive.render(target[, anchor])` to render your Ractive instance. Once rendered you can use `ractive.insert()`.' );
      }
      target = getElement( target );
      anchor = getElement( anchor ) || null;
      if ( !target ) {
        throw new Error( 'You must specify a valid target to insert into' );
      }
      target.insertBefore( this.detach(), anchor );
      this.el = target;
      ( target.__ractive_instances__ || ( target.__ractive_instances__ = [] ) ).push( this );
      this.detached = null;
      fireInsertHook( this );
    };

    function fireInsertHook( ractive ) {
      insertHook.fire( ractive );
      ractive.findAllComponents( '*' ).forEach( function( child ) {
        fireInsertHook( child.instance );
      } );
    }
    return __export;
  }( Ractive$shared_hooks_Hook, getElement );

  /* Ractive/prototype/merge.js */
  var Ractive$merge = function( runloop, isArray, normaliseKeypath ) {

    return function Ractive$merge( keypath, array, options ) {
      var currentArray, promise;
      keypath = normaliseKeypath( keypath );
      currentArray = this.viewmodel.get( keypath );
      // If either the existing value or the new value isn't an
      // array, just do a regular set
      if ( !isArray( currentArray ) || !isArray( array ) ) {
        return this.set( keypath, array, options && options.complete );
      }
      // Manage transitions
      promise = runloop.start( this, true );
      this.viewmodel.merge( keypath, currentArray, array, options );
      runloop.end();
      // attach callback as fulfilment handler, if specified
      if ( options && options.complete ) {
        promise.then( options.complete );
      }
      return promise;
    };
  }( runloop, isArray, normaliseKeypath );

  /* Ractive/prototype/observe/Observer.js */
  var Ractive$observe_Observer = function( runloop, isEqual ) {

    var Observer = function( ractive, keypath, callback, options ) {
      this.root = ractive;
      this.keypath = keypath;
      this.callback = callback;
      this.defer = options.defer;
      // default to root as context, but allow it to be overridden
      this.context = options && options.context ? options.context : ractive;
    };
    Observer.prototype = {
      init: function( immediate ) {
        this.value = this.root.get( this.keypath );
        if ( immediate !== false ) {
          this.update();
        } else {
          this.oldValue = this.value;
        }
      },
      setValue: function( value ) {
        var this$0 = this;
        if ( !isEqual( value, this.value ) ) {
          this.value = value;
          if ( this.defer && this.ready ) {
            runloop.scheduleTask( function() {
              return this$0.update();
            } );
          } else {
            this.update();
          }
        }
      },
      update: function() {
        // Prevent infinite loops
        if ( this.updating ) {
          return;
        }
        this.updating = true;
        this.callback.call( this.context, this.value, this.oldValue, this.keypath );
        this.oldValue = this.value;
        this.updating = false;
      }
    };
    return Observer;
  }( runloop, isEqual );

  /* shared/getMatchingKeypaths.js */
  var getMatchingKeypaths = function( isArray ) {

    return function getMatchingKeypaths( ractive, pattern ) {
      var keys, key, matchingKeypaths;
      keys = pattern.split( '.' );
      matchingKeypaths = [ '' ];
      while ( key = keys.shift() ) {
        if ( key === '*' ) {
          // expand to find all valid child keypaths
          matchingKeypaths = matchingKeypaths.reduce( expand, [] );
        } else {
          if ( matchingKeypaths[ 0 ] === '' ) {
            // first key
            matchingKeypaths[ 0 ] = key;
          } else {
            matchingKeypaths = matchingKeypaths.map( concatenate( key ) );
          }
        }
      }
      return matchingKeypaths;

      function expand( matchingKeypaths, keypath ) {
        var value, key, childKeypath;
        value = ractive.viewmodel.wrapped[ keypath ] ? ractive.viewmodel.wrapped[ keypath ].get() : ractive.get( keypath );
        for ( key in value ) {
          if ( value.hasOwnProperty( key ) && ( key !== '_ractive' || !isArray( value ) ) ) {
            // for benefit of IE8
            childKeypath = keypath ? keypath + '.' + key : key;
            matchingKeypaths.push( childKeypath );
          }
        }
        return matchingKeypaths;
      }

      function concatenate( key ) {
        return function( keypath ) {
          return keypath ? keypath + '.' + key : key;
        };
      }
    };
  }( isArray );

  /* Ractive/prototype/observe/getPattern.js */
  var Ractive$observe_getPattern = function( getMatchingKeypaths ) {

    return function getPattern( ractive, pattern ) {
      var matchingKeypaths, values;
      matchingKeypaths = getMatchingKeypaths( ractive, pattern );
      values = {};
      matchingKeypaths.forEach( function( keypath ) {
        values[ keypath ] = ractive.get( keypath );
      } );
      return values;
    };
  }( getMatchingKeypaths );

  /* Ractive/prototype/observe/PatternObserver.js */
  var Ractive$observe_PatternObserver = function( runloop, isEqual, getPattern ) {

    var PatternObserver, wildcard = /\*/,
      slice = Array.prototype.slice;
    PatternObserver = function( ractive, keypath, callback, options ) {
      this.root = ractive;
      this.callback = callback;
      this.defer = options.defer;
      this.keypath = keypath;
      this.regex = new RegExp( '^' + keypath.replace( /\./g, '\\.' ).replace( /\*/g, '([^\\.]+)' ) + '$' );
      this.values = {};
      if ( this.defer ) {
        this.proxies = [];
      }
      // default to root as context, but allow it to be overridden
      this.context = options && options.context ? options.context : ractive;
    };
    PatternObserver.prototype = {
      init: function( immediate ) {
        var values, keypath;
        values = getPattern( this.root, this.keypath );
        if ( immediate !== false ) {
          for ( keypath in values ) {
            if ( values.hasOwnProperty( keypath ) ) {
              this.update( keypath );
            }
          }
        } else {
          this.values = values;
        }
      },
      update: function( keypath ) {
        var this$0 = this;
        var values;
        if ( wildcard.test( keypath ) ) {
          values = getPattern( this.root, keypath );
          for ( keypath in values ) {
            if ( values.hasOwnProperty( keypath ) ) {
              this.update( keypath );
            }
          }
          return;
        }
        // special case - array mutation should not trigger `array.*`
        // pattern observer with `array.length`
        if ( this.root.viewmodel.implicitChanges[ keypath ] ) {
          return;
        }
        if ( this.defer && this.ready ) {
          runloop.scheduleTask( function() {
            return this$0.getProxy( keypath ).update();
          } );
          return;
        }
        this.reallyUpdate( keypath );
      },
      reallyUpdate: function( keypath ) {
        var value, keys, args;
        value = this.root.viewmodel.get( keypath );
        // Prevent infinite loops
        if ( this.updating ) {
          this.values[ keypath ] = value;
          return;
        }
        this.updating = true;
        if ( !isEqual( value, this.values[ keypath ] ) || !this.ready ) {
          keys = slice.call( this.regex.exec( keypath ), 1 );
          args = [
            value,
            this.values[ keypath ],
            keypath
          ].concat( keys );
          this.callback.apply( this.context, args );
          this.values[ keypath ] = value;
        }
        this.updating = false;
      },
      getProxy: function( keypath ) {
        var self = this;
        if ( !this.proxies[ keypath ] ) {
          this.proxies[ keypath ] = {
            update: function() {
              self.reallyUpdate( keypath );
            }
          };
        }
        return this.proxies[ keypath ];
      }
    };
    return PatternObserver;
  }( runloop, isEqual, Ractive$observe_getPattern );

  /* Ractive/prototype/observe/getObserverFacade.js */
  var Ractive$observe_getObserverFacade = function( normaliseKeypath, Observer, PatternObserver ) {

    var wildcard = /\*/,
      emptyObject = {};
    return function getObserverFacade( ractive, keypath, callback, options ) {
      var observer, isPatternObserver, cancelled;
      keypath = normaliseKeypath( keypath );
      options = options || emptyObject;
      // pattern observers are treated differently
      if ( wildcard.test( keypath ) ) {
        observer = new PatternObserver( ractive, keypath, callback, options );
        ractive.viewmodel.patternObservers.push( observer );
        isPatternObserver = true;
      } else {
        observer = new Observer( ractive, keypath, callback, options );
      }
      ractive.viewmodel.register( keypath, observer, isPatternObserver ? 'patternObservers' : 'observers' );
      observer.init( options.init );
      // This flag allows observers to initialise even with undefined values
      observer.ready = true;
      return {
        cancel: function() {
          var index;
          if ( cancelled ) {
            return;
          }
          if ( isPatternObserver ) {
            index = ractive.viewmodel.patternObservers.indexOf( observer );
            ractive.viewmodel.patternObservers.splice( index, 1 );
            ractive.viewmodel.unregister( keypath, observer, 'patternObservers' );
          } else {
            ractive.viewmodel.unregister( keypath, observer, 'observers' );
          }
          cancelled = true;
        }
      };
    };
  }( normaliseKeypath, Ractive$observe_Observer, Ractive$observe_PatternObserver );

  /* Ractive/prototype/observe.js */
  var Ractive$observe = function( isObject, getObserverFacade ) {

    return function Ractive$observe( keypath, callback, options ) {
      var observers, map, keypaths, i;
      // Allow a map of keypaths to handlers
      if ( isObject( keypath ) ) {
        options = callback;
        map = keypath;
        observers = [];
        for ( keypath in map ) {
          if ( map.hasOwnProperty( keypath ) ) {
            callback = map[ keypath ];
            observers.push( this.observe( keypath, callback, options ) );
          }
        }
        return {
          cancel: function() {
            while ( observers.length ) {
              observers.pop().cancel();
            }
          }
        };
      }
      // Allow `ractive.observe( callback )` - i.e. observe entire model
      if ( typeof keypath === 'function' ) {
        options = callback;
        callback = keypath;
        keypath = '';
        return getObserverFacade( this, keypath, callback, options );
      }
      keypaths = keypath.split( ' ' );
      // Single keypath
      if ( keypaths.length === 1 ) {
        return getObserverFacade( this, keypath, callback, options );
      }
      // Multiple space-separated keypaths
      observers = [];
      i = keypaths.length;
      while ( i-- ) {
        keypath = keypaths[ i ];
        if ( keypath ) {
          observers.push( getObserverFacade( this, keypath, callback, options ) );
        }
      }
      return {
        cancel: function() {
          while ( observers.length ) {
            observers.pop().cancel();
          }
        }
      };
    };
  }( isObject, Ractive$observe_getObserverFacade );

  /* Ractive/prototype/shared/trim.js */
  var Ractive$shared_trim = function( str ) {
    return str.trim();
  };

  /* Ractive/prototype/shared/notEmptyString.js */
  var Ractive$shared_notEmptyString = function( str ) {
    return str !== '';
  };

  /* Ractive/prototype/off.js */
  var Ractive$off = function( trim, notEmptyString ) {

    return function Ractive$off( eventName, callback ) {
      var this$0 = this;
      var eventNames;
      // if no arguments specified, remove all callbacks
      if ( !eventName ) {
        // TODO use this code instead, once the following issue has been resolved
        // in PhantomJS (tests are unpassable otherwise!)
        // https://github.com/ariya/phantomjs/issues/11856
        // defineProperty( this, '_subs', { value: create( null ), configurable: true });
        for ( eventName in this._subs ) {
          delete this._subs[ eventName ];
        }
      } else {
        // Handle multiple space-separated event names
        eventNames = eventName.split( ' ' ).map( trim ).filter( notEmptyString );
        eventNames.forEach( function( eventName ) {
          var subscribers, index;
          // If we have subscribers for this event...
          if ( subscribers = this$0._subs[ eventName ] ) {
            // ...if a callback was specified, only remove that
            if ( callback ) {
              index = subscribers.indexOf( callback );
              if ( index !== -1 ) {
                subscribers.splice( index, 1 );
              }
            } else {
              this$0._subs[ eventName ] = [];
            }
          }
        } );
      }
      return this;
    };
  }( Ractive$shared_trim, Ractive$shared_notEmptyString );

  /* Ractive/prototype/on.js */
  var Ractive$on = function( trim, notEmptyString ) {

    return function Ractive$on( eventName, callback ) {
      var this$0 = this;
      var self = this,
        listeners, n, eventNames;
      // allow mutliple listeners to be bound in one go
      if ( typeof eventName === 'object' ) {
        listeners = [];
        for ( n in eventName ) {
          if ( eventName.hasOwnProperty( n ) ) {
            listeners.push( this.on( n, eventName[ n ] ) );
          }
        }
        return {
          cancel: function() {
            var listener;
            while ( listener = listeners.pop() ) {
              listener.cancel();
            }
          }
        };
      }
      // Handle multiple space-separated event names
      eventNames = eventName.split( ' ' ).map( trim ).filter( notEmptyString );
      eventNames.forEach( function( eventName ) {
        ( this$0._subs[ eventName ] || ( this$0._subs[ eventName ] = [] ) ).push( callback );
      } );
      return {
        cancel: function() {
          self.off( eventName, callback );
        }
      };
    };
  }( Ractive$shared_trim, Ractive$shared_notEmptyString );

  /* shared/getNewIndices.js */
  var getNewIndices = function() {

    var __export;
    // This function takes an array, the name of a mutator method, and the
    // arguments to call that mutator method with, and returns an array that
    // maps the old indices to their new indices.
    // So if you had something like this...
    //
    //     array = [ 'a', 'b', 'c', 'd' ];
    //     array.push( 'e' );
    //
    // ...you'd get `[ 0, 1, 2, 3 ]` - in other words, none of the old indices
    // have changed. If you then did this...
    //
    //     array.unshift( 'z' );
    //
    // ...the indices would be `[ 1, 2, 3, 4, 5 ]` - every item has been moved
    // one higher to make room for the 'z'. If you removed an item, the new index
    // would be -1...
    //
    //     array.splice( 2, 2 );
    //
    // ...this would result in [ 0, 1, -1, -1, 2, 3 ].
    //
    // This information is used to enable fast, non-destructive shuffling of list
    // sections when you do e.g. `ractive.splice( 'items', 2, 2 );
    __export = function getNewIndices( array, methodName, args ) {
      var spliceArguments, len, newIndices = [],
        removeStart, removeEnd, balance, i;
      spliceArguments = getSpliceEquivalent( array, methodName, args );
      if ( !spliceArguments ) {
        return null;
      }
      len = array.length;
      balance = spliceArguments.length - 2 - spliceArguments[ 1 ];
      removeStart = Math.min( len, spliceArguments[ 0 ] );
      removeEnd = removeStart + spliceArguments[ 1 ];
      for ( i = 0; i < removeStart; i += 1 ) {
        newIndices.push( i );
      }
      for ( ; i < removeEnd; i += 1 ) {
        newIndices.push( -1 );
      }
      for ( ; i < len; i += 1 ) {
        newIndices.push( i + balance );
      }
      return newIndices;
    };
    // The pop, push, shift an unshift methods can all be represented
    // as an equivalent splice
    function getSpliceEquivalent( array, methodName, args ) {
      switch ( methodName ) {
        case 'splice':
          if ( args[ 0 ] !== undefined && args[ 0 ] < 0 ) {
            args[ 0 ] = array.length + Math.max( args[ 0 ], -array.length );
          }
          while ( args.length < 2 ) {
            args.push( 0 );
          }
          // ensure we only remove elements that exist
          args[ 1 ] = Math.min( args[ 1 ], array.length - args[ 0 ] );
          return args;
        case 'sort':
        case 'reverse':
          return null;
        case 'pop':
          if ( array.length ) {
            return [
              array.length - 1,
              1
            ];
          }
          return null;
        case 'push':
          return [
            array.length,
            0
          ].concat( args );
        case 'shift':
          return [
            0,
            1
          ];
        case 'unshift':
          return [
            0,
            0
          ].concat( args );
      }
    }
    return __export;
  }();

  /* Ractive/prototype/shared/makeArrayMethod.js */
  var Ractive$shared_makeArrayMethod = function( isArray, runloop, getNewIndices ) {

    var arrayProto = Array.prototype;
    return function( methodName ) {
      return function( keypath ) {
        var SLICE$0 = Array.prototype.slice;
        var args = SLICE$0.call( arguments, 1 );
        var array, newIndices = [],
          len, promise, result;
        array = this.get( keypath );
        len = array.length;
        if ( !isArray( array ) ) {
          throw new Error( 'Called ractive.' + methodName + '(\'' + keypath + '\'), but \'' + keypath + '\' does not refer to an array' );
        }
        newIndices = getNewIndices( array, methodName, args );
        result = arrayProto[ methodName ].apply( array, args );
        promise = runloop.start( this, true ).then( function() {
          return result;
        } );
        if ( !!newIndices ) {
          this.viewmodel.smartUpdate( keypath, array, newIndices );
        } else {
          this.viewmodel.mark( keypath );
        }
        runloop.end();
        return promise;
      };
    };
  }( isArray, runloop, getNewIndices );

  /* Ractive/prototype/pop.js */
  var Ractive$pop = function( makeArrayMethod ) {

    return makeArrayMethod( 'pop' );
  }( Ractive$shared_makeArrayMethod );

  /* Ractive/prototype/push.js */
  var Ractive$push = function( makeArrayMethod ) {

    return makeArrayMethod( 'push' );
  }( Ractive$shared_makeArrayMethod );

  /* global/css.js */
  var global_css = function( circular, isClient, removeFromArray ) {

    var css, update, runloop, styleElement, head, styleSheet, inDom, prefix = '/* Ractive.js component styles */\n',
      componentsInPage = {},
      styles = [];
    if ( !isClient ) {
      css = null;
    } else {
      circular.push( function() {
        runloop = circular.runloop;
      } );
      styleElement = document.createElement( 'style' );
      styleElement.type = 'text/css';
      head = document.getElementsByTagName( 'head' )[ 0 ];
      inDom = false;
      // Internet Exploder won't let you use styleSheet.innerHTML - we have to
      // use styleSheet.cssText instead
      styleSheet = styleElement.styleSheet;
      update = function() {
        var css;
        if ( styles.length ) {
          css = prefix + styles.join( ' ' );
          if ( styleSheet ) {
            styleSheet.cssText = css;
          } else {
            styleElement.innerHTML = css;
          }
          if ( !inDom ) {
            head.appendChild( styleElement );
            inDom = true;
          }
        } else if ( inDom ) {
          head.removeChild( styleElement );
          inDom = false;
        }
      };
      css = {
        add: function( Component ) {
          if ( !Component.css ) {
            return;
          }
          if ( !componentsInPage[ Component._guid ] ) {
            // we create this counter so that we can in/decrement it as
            // instances are added and removed. When all components are
            // removed, the style is too
            componentsInPage[ Component._guid ] = 0;
            styles.push( Component.css );
            update();
          }
          componentsInPage[ Component._guid ] += 1;
        },
        remove: function( Component ) {
          if ( !Component.css ) {
            return;
          }
          componentsInPage[ Component._guid ] -= 1;
          if ( !componentsInPage[ Component._guid ] ) {
            removeFromArray( styles, Component.css );
            runloop.scheduleTask( update );
          }
        }
      };
    }
    return css;
  }( circular, isClient, removeFromArray );

  /* Ractive/prototype/render.js */
  var Ractive$render = function( css, Hook, getElement, runloop ) {

    var renderHook = new Hook( 'render' ),
      completeHook = new Hook( 'complete' );
    return function Ractive$render( target, anchor ) {
      var this$0 = this;
      var promise, instances, transitionsEnabled;
      // if `noIntro` is `true`, temporarily disable transitions
      transitionsEnabled = this.transitionsEnabled;
      if ( this.noIntro ) {
        this.transitionsEnabled = false;
      }
      promise = runloop.start( this, true );
      runloop.scheduleTask( function() {
        return renderHook.fire( this$0 );
      }, true );
      if ( this.fragment.rendered ) {
        throw new Error( 'You cannot call ractive.render() on an already rendered instance! Call ractive.unrender() first' );
      }
      target = getElement( target ) || this.el;
      anchor = getElement( anchor ) || this.anchor;
      this.el = target;
      this.anchor = anchor;
      // Add CSS, if applicable
      if ( this.constructor.css ) {
        css.add( this.constructor );
      }
      if ( target ) {
        if ( !( instances = target.__ractive_instances__ ) ) {
          target.__ractive_instances__ = [ this ];
        } else {
          instances.push( this );
        }
        if ( anchor ) {
          target.insertBefore( this.fragment.render(), anchor );
        } else {
          target.appendChild( this.fragment.render() );
        }
      }
      runloop.end();
      this.transitionsEnabled = transitionsEnabled;
      // It is now more problematic to know if the complete hook
      // would fire. Method checking is straight-forward, but would
      // also require preflighting event subscriptions. Which seems
      // like more work then just letting the promise happen.
      // But perhaps I'm wrong about that...
      promise.then( function() {
        return completeHook.fire( this$0 );
      } );
      return promise;
    };
  }( global_css, Ractive$shared_hooks_Hook, getElement, runloop );

  /* virtualdom/Fragment/prototype/bubble.js */
  var virtualdom_Fragment$bubble = function Fragment$bubble() {
    this.dirtyValue = this.dirtyArgs = true;
    if ( this.bound && typeof this.owner.bubble === 'function' ) {
      this.owner.bubble();
    }
  };

  /* virtualdom/Fragment/prototype/detach.js */
  var virtualdom_Fragment$detach = function Fragment$detach() {
    var docFrag;
    if ( this.items.length === 1 ) {
      return this.items[ 0 ].detach();
    }
    docFrag = document.createDocumentFragment();
    this.items.forEach( function( item ) {
      var node = item.detach();
      // TODO The if {...} wasn't previously required - it is now, because we're
      // forcibly detaching everything to reorder sections after an update. That's
      // a non-ideal brute force approach, implemented to get all the tests to pass
      // - as soon as it's replaced with something more elegant, this should
      // revert to `docFrag.appendChild( item.detach() )`
      if ( node ) {
        docFrag.appendChild( node );
      }
    } );
    return docFrag;
  };

  /* virtualdom/Fragment/prototype/find.js */
  var virtualdom_Fragment$find = function Fragment$find( selector ) {
    var i, len, item, queryResult;
    if ( this.items ) {
      len = this.items.length;
      for ( i = 0; i < len; i += 1 ) {
        item = this.items[ i ];
        if ( item.find && ( queryResult = item.find( selector ) ) ) {
          return queryResult;
        }
      }
      return null;
    }
  };

  /* virtualdom/Fragment/prototype/findAll.js */
  var virtualdom_Fragment$findAll = function Fragment$findAll( selector, query ) {
    var i, len, item;
    if ( this.items ) {
      len = this.items.length;
      for ( i = 0; i < len; i += 1 ) {
        item = this.items[ i ];
        if ( item.findAll ) {
          item.findAll( selector, query );
        }
      }
    }
    return query;
  };

  /* virtualdom/Fragment/prototype/findAllComponents.js */
  var virtualdom_Fragment$findAllComponents = function Fragment$findAllComponents( selector, query ) {
    var i, len, item;
    if ( this.items ) {
      len = this.items.length;
      for ( i = 0; i < len; i += 1 ) {
        item = this.items[ i ];
        if ( item.findAllComponents ) {
          item.findAllComponents( selector, query );
        }
      }
    }
    return query;
  };

  /* virtualdom/Fragment/prototype/findComponent.js */
  var virtualdom_Fragment$findComponent = function Fragment$findComponent( selector ) {
    var len, i, item, queryResult;
    if ( this.items ) {
      len = this.items.length;
      for ( i = 0; i < len; i += 1 ) {
        item = this.items[ i ];
        if ( item.findComponent && ( queryResult = item.findComponent( selector ) ) ) {
          return queryResult;
        }
      }
      return null;
    }
  };

  /* virtualdom/Fragment/prototype/findNextNode.js */
  var virtualdom_Fragment$findNextNode = function Fragment$findNextNode( item ) {
    var index = item.index,
      node;
    if ( this.items[ index + 1 ] ) {
      node = this.items[ index + 1 ].firstNode();
    } else if ( this.owner === this.root ) {
      if ( !this.owner.component ) {
        // TODO but something else could have been appended to
        // this.root.el, no?
        node = null;
      } else {
        node = this.owner.component.findNextNode();
      }
    } else {
      node = this.owner.findNextNode( this );
    }
    return node;
  };

  /* virtualdom/Fragment/prototype/firstNode.js */
  var virtualdom_Fragment$firstNode = function Fragment$firstNode() {
    if ( this.items && this.items[ 0 ] ) {
      return this.items[ 0 ].firstNode();
    }
    return null;
  };

  /* virtualdom/Fragment/prototype/getNode.js */
  var virtualdom_Fragment$getNode = function Fragment$getNode() {
    var fragment = this;
    do {
      if ( fragment.pElement ) {
        return fragment.pElement.node;
      }
    } while ( fragment = fragment.parent );
    return this.root.detached || this.root.el;
  };

  /* virtualdom/Fragment/prototype/getValue.js */
  var virtualdom_Fragment$getValue = function( parseJSON ) {

    var __export;
    var empty = {};
    __export = function Fragment$getValue() {
      var options = arguments[ 0 ];
      if ( options === void 0 )
        options = empty;
      var asArgs, values, source, parsed, cachedResult, dirtyFlag, result;
      asArgs = options.args;
      cachedResult = asArgs ? 'argsList' : 'value';
      dirtyFlag = asArgs ? 'dirtyArgs' : 'dirtyValue';
      if ( this[ dirtyFlag ] ) {
        source = processItems( this.items, values = {}, this.root._guid );
        parsed = parseJSON( asArgs ? '[' + source + ']' : source, values );
        if ( !parsed ) {
          result = asArgs ? [ this.toString() ] : this.toString();
        } else {
          result = parsed.value;
        }
        this[ cachedResult ] = result;
        this[ dirtyFlag ] = false;
      }
      return this[ cachedResult ];
    };

    function processItems( items, values, guid, counter ) {
      counter = counter || 0;
      return items.map( function( item ) {
        var placeholderId, wrapped, value;
        if ( item.text ) {
          return item.text;
        }
        if ( item.fragments ) {
          return item.fragments.map( function( fragment ) {
            return processItems( fragment.items, values, guid, counter );
          } ).join( '' );
        }
        placeholderId = guid + '-' + counter++;
        if ( wrapped = item.root.viewmodel.wrapped[ item.keypath ] ) {
          value = wrapped.value;
        } else {
          value = item.getValue();
        }
        values[ placeholderId ] = value;
        return '${' + placeholderId + '}';
      } ).join( '' );
    }
    return __export;
  }( parseJSON );

  /* utils/escapeHtml.js */
  var escapeHtml = function() {

    var lessThan = /</g;
    var greaterThan = />/g;
    var amp = /&/g;
    return function escapeHtml( str ) {
      return str.replace( amp, '&amp;' ).replace( lessThan, '&lt;' ).replace( greaterThan, '&gt;' );
    };
  }();

  /* utils/detachNode.js */
  var detachNode = function detachNode( node ) {
    if ( node && node.parentNode ) {
      node.parentNode.removeChild( node );
    }
    return node;
  };

  /* virtualdom/items/shared/detach.js */
  var detach = function( detachNode ) {

    return function() {
      return detachNode( this.node );
    };
  }( detachNode );

  /* virtualdom/items/Text.js */
  var Text = function( types, escapeHtml, detach ) {

    var Text = function( options ) {
      this.type = types.TEXT;
      this.text = options.template;
    };
    Text.prototype = {
      detach: detach,
      firstNode: function() {
        return this.node;
      },
      render: function() {
        if ( !this.node ) {
          this.node = document.createTextNode( this.text );
        }
        return this.node;
      },
      toString: function( escape ) {
        return escape ? escapeHtml( this.text ) : this.text;
      },
      unrender: function( shouldDestroy ) {
        if ( shouldDestroy ) {
          return this.detach();
        }
      }
    };
    return Text;
  }( types, escapeHtml, detach );

  /* virtualdom/items/shared/unbind.js */
  var unbind = function unbind() {
    if ( this.registered ) {
      // this was registered as a dependant
      this.root.viewmodel.unregister( this.keypath, this );
    }
    if ( this.resolver ) {
      this.resolver.unbind();
    }
  };

  /* virtualdom/items/shared/Mustache/getValue.js */
  var getValue = function Mustache$getValue() {
    return this.value;
  };

  /* virtualdom/items/shared/utils/startsWithKeypath.js */
  var startsWithKeypath = function startsWithKeypath( target, keypath ) {
    return target && keypath && target.substr( 0, keypath.length + 1 ) === keypath + '.';
  };

  /* virtualdom/items/shared/utils/getNewKeypath.js */
  var getNewKeypath = function( startsWithKeypath ) {

    return function getNewKeypath( targetKeypath, oldKeypath, newKeypath ) {
      // exact match
      if ( targetKeypath === oldKeypath ) {
        return newKeypath !== undefined ? newKeypath : null;
      }
      // partial match based on leading keypath segments
      if ( startsWithKeypath( targetKeypath, oldKeypath ) ) {
        return newKeypath === null ? newKeypath : targetKeypath.replace( oldKeypath + '.', newKeypath + '.' );
      }
    };
  }( startsWithKeypath );

  /* virtualdom/items/shared/Resolvers/ReferenceResolver.js */
  var ReferenceResolver = function( runloop, resolveRef, getNewKeypath ) {

    var ReferenceResolver = function( owner, ref, callback ) {
      var keypath;
      this.ref = ref;
      this.resolved = false;
      this.root = owner.root;
      this.parentFragment = owner.parentFragment;
      this.callback = callback;
      keypath = resolveRef( owner.root, ref, owner.parentFragment );
      if ( keypath !== undefined ) {
        this.resolve( keypath );
      } else {
        runloop.addUnresolved( this );
      }
    };
    ReferenceResolver.prototype = {
      resolve: function( keypath ) {
        this.resolved = true;
        this.keypath = keypath;
        this.callback( keypath );
      },
      forceResolution: function() {
        this.resolve( this.ref );
      },
      rebind: function( indexRef, newIndex, oldKeypath, newKeypath ) {
        var keypath;
        if ( this.keypath !== undefined ) {
          keypath = getNewKeypath( this.keypath, oldKeypath, newKeypath );
          // was a new keypath created?
          if ( keypath !== undefined ) {
            // resolve it
            this.resolve( keypath );
          }
        }
      },
      unbind: function() {
        if ( !this.resolved ) {
          runloop.removeUnresolved( this );
        }
      }
    };
    return ReferenceResolver;
  }( runloop, resolveRef, getNewKeypath );

  /* virtualdom/items/shared/Resolvers/SpecialResolver.js */
  var SpecialResolver = function() {

    var SpecialResolver = function( owner, ref, callback ) {
      this.parentFragment = owner.parentFragment;
      this.ref = ref;
      this.callback = callback;
      this.rebind();
    };
    SpecialResolver.prototype = {
      rebind: function() {
        var ref = this.ref,
          fragment = this.parentFragment;
        if ( ref === '@keypath' ) {
          while ( fragment ) {
            if ( !!fragment.context ) {
              return this.callback( '@' + fragment.context );
            }
            fragment = fragment.parent;
          }
        }
        if ( ref === '@index' || ref === '@key' ) {
          while ( fragment ) {
            if ( fragment.index !== undefined ) {
              return this.callback( '@' + fragment.index );
            }
            fragment = fragment.parent;
          }
        }
        throw new Error( 'Unknown special reference "' + ref + '" - valid references are @index, @key and @keypath' );
      },
      unbind: function() {}
    };
    return SpecialResolver;
  }();

  /* virtualdom/items/shared/Resolvers/IndexResolver.js */
  var IndexResolver = function() {

    var IndexResolver = function( owner, ref, callback ) {
      this.parentFragment = owner.parentFragment;
      this.ref = ref;
      this.callback = callback;
      this.rebind();
    };
    IndexResolver.prototype = {
      rebind: function() {
        var ref = this.ref,
          indexRefs = this.parentFragment.indexRefs,
          index = indexRefs[ ref ];
        if ( index !== undefined ) {
          this.callback( '@' + index );
        }
      },
      unbind: function() {}
    };
    return IndexResolver;
  }();

  /* virtualdom/items/shared/Resolvers/createReferenceResolver.js */
  var createReferenceResolver = function( ReferenceResolver, SpecialResolver, IndexResolver ) {

    return function createReferenceResolver( owner, ref, callback ) {
      var indexRefs, index;
      if ( ref.charAt( 0 ) === '@' ) {
        return new SpecialResolver( owner, ref, callback );
      }
      indexRefs = owner.parentFragment.indexRefs;
      if ( indexRefs && ( index = indexRefs[ ref ] ) !== undefined ) {
        return new IndexResolver( owner, ref, callback );
      }
      return new ReferenceResolver( owner, ref, callback );
    };
  }( ReferenceResolver, SpecialResolver, IndexResolver );

  /* shared/getFunctionFromString.js */
  var getFunctionFromString = function() {

    var cache = {};
    return function getFunctionFromString( str, i ) {
      var fn, args;
      if ( cache[ str ] ) {
        return cache[ str ];
      }
      args = [];
      while ( i-- ) {
        args[ i ] = '_' + i;
      }
      fn = new Function( args.join( ',' ), 'return(' + str + ')' );
      cache[ str ] = fn;
      return fn;
    };
  }();

  /* virtualdom/items/shared/Resolvers/ExpressionResolver.js */
  var ExpressionResolver = function( defineProperty, isNumeric, createReferenceResolver, getFunctionFromString ) {

    var __export;
    var ExpressionResolver, bind = Function.prototype.bind;
    ExpressionResolver = function( owner, parentFragment, expression, callback ) {
      var resolver = this,
        ractive, indexRefs;
      ractive = owner.root;
      resolver.root = ractive;
      resolver.parentFragment = parentFragment;
      resolver.callback = callback;
      resolver.owner = owner;
      resolver.str = expression.s;
      resolver.keypaths = [];
      indexRefs = parentFragment.indexRefs;
      // Create resolvers for each reference
      resolver.pending = expression.r.length;
      resolver.refResolvers = expression.r.map( function( ref, i ) {
        return createReferenceResolver( resolver, ref, function( keypath ) {
          resolver.resolve( i, keypath );
        } );
      } );
      resolver.ready = true;
      resolver.bubble();
    };
    ExpressionResolver.prototype = {
      bubble: function() {
        if ( !this.ready ) {
          return;
        }
        this.uniqueString = getUniqueString( this.str, this.keypaths );
        this.keypath = getKeypath( this.uniqueString );
        this.createEvaluator();
        this.callback( this.keypath );
      },
      unbind: function() {
        var resolver;
        while ( resolver = this.refResolvers.pop() ) {
          resolver.unbind();
        }
      },
      resolve: function( index, keypath ) {
        this.keypaths[ index ] = keypath;
        this.bubble();
      },
      createEvaluator: function() {
        var this$0 = this;
        var self = this,
          computation, valueGetters, signature, keypath, fn;
        computation = this.root.viewmodel.computations[ this.keypath ];
        // only if it doesn't exist yet!
        if ( !computation ) {
          fn = getFunctionFromString( this.str, this.refResolvers.length );
          valueGetters = this.keypaths.map( function( keypath ) {
            var value;
            if ( keypath === 'undefined' ) {
              return function() {
                return undefined;
              };
            }
            // 'special' keypaths encode a value
            if ( keypath[ 0 ] === '@' ) {
              value = keypath.slice( 1 );
              return isNumeric( value ) ? function() {
                return +value;
              } : function() {
                return value;
              };
            }
            return function() {
              var value = this$0.root.viewmodel.get( keypath );
              if ( typeof value === 'function' ) {
                value = wrapFunction( value, self.root );
              }
              return value;
            };
          } );
          signature = {
            deps: this.keypaths.filter( isValidDependency ),
            get: function() {
              var args = valueGetters.map( call );
              return fn.apply( null, args );
            }
          };
          computation = this.root.viewmodel.compute( this.keypath, signature );
        } else {
          this.root.viewmodel.mark( this.keypath );
        }
      },
      rebind: function( indexRef, newIndex, oldKeypath, newKeypath ) {
        // TODO only bubble once, no matter how many references are affected by the rebind
        this.refResolvers.forEach( function( r ) {
          return r.rebind( indexRef, newIndex, oldKeypath, newKeypath );
        } );
      }
    };
    __export = ExpressionResolver;

    function call( value ) {
      return value.call();
    }

    function getUniqueString( str, keypaths ) {
      // get string that is unique to this expression
      return str.replace( /_([0-9]+)/g, function( match, $1 ) {
        var keypath, value;
        keypath = keypaths[ $1 ];
        if ( keypath === undefined ) {
          return 'undefined';
        }
        if ( keypath[ 0 ] === '@' ) {
          value = keypath.slice( 1 );
          return isNumeric( value ) ? value : '"' + value + '"';
        }
        return keypath;
      } );
    }

    function getKeypath( uniqueString ) {
      // Sanitize by removing any periods or square brackets. Otherwise
      // we can't split the keypath into keys!
      return '${' + uniqueString.replace( /[\.\[\]]/g, '-' ) + '}';
    }

    function isValidDependency( keypath ) {
      return keypath !== undefined && keypath[ 0 ] !== '@';
    }

    function wrapFunction( fn, ractive ) {
      var wrapped, prop, key;
      if ( fn._noWrap ) {
        return fn;
      }
      prop = '__ractive_' + ractive._guid;
      wrapped = fn[ prop ];
      if ( wrapped ) {
        return wrapped;
      } else if ( /this/.test( fn.toString() ) ) {
        defineProperty( fn, prop, {
          value: bind.call( fn, ractive )
        } );
        // Add properties/methods to wrapped function
        for ( key in fn ) {
          if ( fn.hasOwnProperty( key ) ) {
            fn[ prop ][ key ] = fn[ key ];
          }
        }
        return fn[ prop ];
      }
      defineProperty( fn, '__ractive_nowrap', {
        value: fn
      } );
      return fn.__ractive_nowrap;
    }
    return __export;
  }( defineProperty, isNumeric, createReferenceResolver, getFunctionFromString, legacy );

  /* virtualdom/items/shared/Resolvers/ReferenceExpressionResolver/MemberResolver.js */
  var MemberResolver = function( types, createReferenceResolver, ExpressionResolver ) {

    var MemberResolver = function( template, resolver, parentFragment ) {
      var member = this,
        keypath;
      member.resolver = resolver;
      member.root = resolver.root;
      member.parentFragment = parentFragment;
      member.viewmodel = resolver.root.viewmodel;
      if ( typeof template === 'string' ) {
        member.value = template;
      } else if ( template.t === types.REFERENCE ) {
        member.refResolver = createReferenceResolver( this, template.n, function( keypath ) {
          member.resolve( keypath );
        } );
      } else {
        new ExpressionResolver( resolver, parentFragment, template, function( keypath ) {
          member.resolve( keypath );
        } );
      }
    };
    MemberResolver.prototype = {
      resolve: function( keypath ) {
        if ( this.keypath ) {
          this.viewmodel.unregister( this.keypath, this );
        }
        this.keypath = keypath;
        this.value = this.viewmodel.get( keypath );
        this.bind();
        this.resolver.bubble();
      },
      bind: function() {
        this.viewmodel.register( this.keypath, this );
      },
      rebind: function( indexRef, newIndex, oldKeypath, newKeypath ) {
        if ( this.refResolver ) {
          this.refResolver.rebind( indexRef, newIndex, oldKeypath, newKeypath );
        }
      },
      setValue: function( value ) {
        this.value = value;
        this.resolver.bubble();
      },
      unbind: function() {
        if ( this.keypath ) {
          this.viewmodel.unregister( this.keypath, this );
        }
        if ( this.unresolved ) {
          this.unresolved.unbind();
        }
      },
      forceResolution: function() {
        if ( this.refResolver ) {
          this.refResolver.forceResolution();
        }
      }
    };
    return MemberResolver;
  }( types, createReferenceResolver, ExpressionResolver );

  /* virtualdom/items/shared/Resolvers/ReferenceExpressionResolver/ReferenceExpressionResolver.js */
  var ReferenceExpressionResolver = function( resolveRef, ReferenceResolver, MemberResolver ) {

    var ReferenceExpressionResolver = function( mustache, template, callback ) {
      var this$0 = this;
      var resolver = this,
        ractive, ref, keypath, parentFragment;
      resolver.parentFragment = parentFragment = mustache.parentFragment;
      resolver.root = ractive = mustache.root;
      resolver.mustache = mustache;
      resolver.ref = ref = template.r;
      resolver.callback = callback;
      resolver.unresolved = [];
      // Find base keypath
      if ( keypath = resolveRef( ractive, ref, parentFragment ) ) {
        resolver.base = keypath;
      } else {
        resolver.baseResolver = new ReferenceResolver( this, ref, function( keypath ) {
          resolver.base = keypath;
          resolver.baseResolver = null;
          resolver.bubble();
        } );
      }
      // Find values for members, or mark them as unresolved
      resolver.members = template.m.map( function( template ) {
        return new MemberResolver( template, this$0, parentFragment );
      } );
      resolver.ready = true;
      resolver.bubble();
    };
    ReferenceExpressionResolver.prototype = {
      getKeypath: function() {
        var values = this.members.map( getValue );
        if ( !values.every( isDefined ) || this.baseResolver ) {
          return null;
        }
        return this.base + '.' + values.join( '.' );
      },
      bubble: function() {
        if ( !this.ready || this.baseResolver ) {
          return;
        }
        this.callback( this.getKeypath() );
      },
      unbind: function() {
        this.members.forEach( unbind );
      },
      rebind: function( indexRef, newIndex, oldKeypath, newKeypath ) {
        var changed;
        this.members.forEach( function( members ) {
          if ( members.rebind( indexRef, newIndex, oldKeypath, newKeypath ) ) {
            changed = true;
          }
        } );
        if ( changed ) {
          this.bubble();
        }
      },
      forceResolution: function() {
        if ( this.baseResolver ) {
          this.base = this.ref;
          this.baseResolver.unbind();
          this.baseResolver = null;
        }
        this.members.forEach( function( m ) {
          return m.forceResolution();
        } );
        this.bubble();
      }
    };

    function getValue( member ) {
      return member.value;
    }

    function isDefined( value ) {
      return value != undefined;
    }

    function unbind( member ) {
      member.unbind();
    }
    return ReferenceExpressionResolver;
  }( resolveRef, ReferenceResolver, MemberResolver );

  /* virtualdom/items/shared/Mustache/initialise.js */
  var initialise = function( types, createReferenceResolver, ReferenceExpressionResolver, ExpressionResolver ) {

    return function Mustache$init( mustache, options ) {
      var ref, parentFragment, template;
      parentFragment = options.parentFragment;
      template = options.template;
      mustache.root = parentFragment.root;
      mustache.parentFragment = parentFragment;
      mustache.pElement = parentFragment.pElement;
      mustache.template = options.template;
      mustache.index = options.index || 0;
      mustache.isStatic = options.template.s;
      mustache.type = options.template.t;
      mustache.registered = false;
      // if this is a simple mustache, with a reference, we just need to resolve
      // the reference to a keypath
      if ( ref = template.r ) {
        mustache.resolver = new createReferenceResolver( mustache, ref, resolve );
      }
      // if it's an expression, we have a bit more work to do
      if ( options.template.x ) {
        mustache.resolver = new ExpressionResolver( mustache, parentFragment, options.template.x, resolveAndRebindChildren );
      }
      if ( options.template.rx ) {
        mustache.resolver = new ReferenceExpressionResolver( mustache, options.template.rx, resolveAndRebindChildren );
      }
      // Special case - inverted sections
      if ( mustache.template.n === types.SECTION_UNLESS && !mustache.hasOwnProperty( 'value' ) ) {
        mustache.setValue( undefined );
      }

      function resolve( keypath ) {
        mustache.resolve( keypath );
      }

      function resolveAndRebindChildren( newKeypath ) {
        var oldKeypath = mustache.keypath;
        if ( newKeypath !== oldKeypath ) {
          mustache.resolve( newKeypath );
          if ( oldKeypath !== undefined ) {
            mustache.fragments && mustache.fragments.forEach( function( f ) {
              f.rebind( null, null, oldKeypath, newKeypath );
            } );
          }
        }
      }
    };
  }( types, createReferenceResolver, ReferenceExpressionResolver, ExpressionResolver );

  /* virtualdom/items/shared/Mustache/resolve.js */
  var resolve = function( isNumeric ) {

    return function Mustache$resolve( keypath ) {
      var wasResolved, value, twowayBinding;
      // 'Special' keypaths, e.g. @foo or @7, encode a value
      if ( keypath && keypath[ 0 ] === '@' ) {
        value = keypath.slice( 1 );
        if ( isNumeric( value ) ) {
          value = +value;
        }
        this.keypath = keypath;
        this.setValue( value );
        return;
      }
      // If we resolved previously, we need to unregister
      if ( this.registered ) {
        // undefined or null
        this.root.viewmodel.unregister( this.keypath, this );
        this.registered = false;
        wasResolved = true;
      }
      this.keypath = keypath;
      // If the new keypath exists, we need to register
      // with the viewmodel
      if ( keypath != undefined ) {
        // undefined or null
        value = this.root.viewmodel.get( keypath );
        this.root.viewmodel.register( keypath, this );
        this.registered = true;
      }
      // Either way we need to queue up a render (`value`
      // will be `undefined` if there's no keypath)
      this.setValue( value );
      // Two-way bindings need to point to their new target keypath
      if ( wasResolved && ( twowayBinding = this.twowayBinding ) ) {
        twowayBinding.rebound();
      }
    };
  }( isNumeric );

  /* virtualdom/items/shared/Mustache/rebind.js */
  var rebind = function Mustache$rebind( indexRef, newIndex, oldKeypath, newKeypath ) {
    // Children first
    if ( this.fragments ) {
      this.fragments.forEach( function( f ) {
        return f.rebind( indexRef, newIndex, oldKeypath, newKeypath );
      } );
    }
    // Expression mustache?
    if ( this.resolver ) {
      this.resolver.rebind( indexRef, newIndex, oldKeypath, newKeypath );
    }
  };

  /* virtualdom/items/shared/Mustache/_Mustache.js */
  var Mustache = function( getValue, init, resolve, rebind ) {

    return {
      getValue: getValue,
      init: init,
      resolve: resolve,
      rebind: rebind
    };
  }( getValue, initialise, resolve, rebind );

  /* virtualdom/items/Interpolator.js */
  var Interpolator = function( types, runloop, escapeHtml, detachNode, isEqual, unbind, Mustache, detach ) {

    var Interpolator = function( options ) {
      this.type = types.INTERPOLATOR;
      Mustache.init( this, options );
    };
    Interpolator.prototype = {
      update: function() {
        this.node.data = this.value == undefined ? '' : this.value;
      },
      resolve: Mustache.resolve,
      rebind: Mustache.rebind,
      detach: detach,
      unbind: unbind,
      render: function() {
        if ( !this.node ) {
          this.node = document.createTextNode( this.value != undefined ? this.value : '' );
        }
        return this.node;
      },
      unrender: function( shouldDestroy ) {
        if ( shouldDestroy ) {
          detachNode( this.node );
        }
      },
      getValue: Mustache.getValue,
      // TEMP
      setValue: function( value ) {
        var wrapper;
        // TODO is there a better way to approach this?
        if ( wrapper = this.root.viewmodel.wrapped[ this.keypath ] ) {
          value = wrapper.get();
        }
        if ( !isEqual( value, this.value ) ) {
          this.value = value;
          this.parentFragment.bubble();
          if ( this.node ) {
            runloop.addView( this );
          }
        }
      },
      firstNode: function() {
        return this.node;
      },
      toString: function( escape ) {
        var string = this.value != undefined ? '' + this.value : '';
        return escape ? escapeHtml( string ) : string;
      }
    };
    return Interpolator;
  }( types, runloop, escapeHtml, detachNode, isEqual, unbind, Mustache, detach );

  /* virtualdom/items/Section/prototype/bubble.js */
  var virtualdom_items_Section$bubble = function Section$bubble() {
    this.parentFragment.bubble();
  };

  /* virtualdom/items/Section/prototype/detach.js */
  var virtualdom_items_Section$detach = function Section$detach() {
    var docFrag;
    if ( this.fragments.length === 1 ) {
      return this.fragments[ 0 ].detach();
    }
    docFrag = document.createDocumentFragment();
    this.fragments.forEach( function( item ) {
      docFrag.appendChild( item.detach() );
    } );
    return docFrag;
  };

  /* virtualdom/items/Section/prototype/find.js */
  var virtualdom_items_Section$find = function Section$find( selector ) {
    var i, len, queryResult;
    len = this.fragments.length;
    for ( i = 0; i < len; i += 1 ) {
      if ( queryResult = this.fragments[ i ].find( selector ) ) {
        return queryResult;
      }
    }
    return null;
  };

  /* virtualdom/items/Section/prototype/findAll.js */
  var virtualdom_items_Section$findAll = function Section$findAll( selector, query ) {
    var i, len;
    len = this.fragments.length;
    for ( i = 0; i < len; i += 1 ) {
      this.fragments[ i ].findAll( selector, query );
    }
  };

  /* virtualdom/items/Section/prototype/findAllComponents.js */
  var virtualdom_items_Section$findAllComponents = function Section$findAllComponents( selector, query ) {
    var i, len;
    len = this.fragments.length;
    for ( i = 0; i < len; i += 1 ) {
      this.fragments[ i ].findAllComponents( selector, query );
    }
  };

  /* virtualdom/items/Section/prototype/findComponent.js */
  var virtualdom_items_Section$findComponent = function Section$findComponent( selector ) {
    var i, len, queryResult;
    len = this.fragments.length;
    for ( i = 0; i < len; i += 1 ) {
      if ( queryResult = this.fragments[ i ].findComponent( selector ) ) {
        return queryResult;
      }
    }
    return null;
  };

  /* virtualdom/items/Section/prototype/findNextNode.js */
  var virtualdom_items_Section$findNextNode = function Section$findNextNode( fragment ) {
    if ( this.fragments[ fragment.index + 1 ] ) {
      return this.fragments[ fragment.index + 1 ].firstNode();
    }
    return this.parentFragment.findNextNode( this );
  };

  /* virtualdom/items/Section/prototype/firstNode.js */
  var virtualdom_items_Section$firstNode = function Section$firstNode() {
    var len, i, node;
    if ( len = this.fragments.length ) {
      for ( i = 0; i < len; i += 1 ) {
        if ( node = this.fragments[ i ].firstNode() ) {
          return node;
        }
      }
    }
    return this.parentFragment.findNextNode( this );
  };

  /* virtualdom/items/Section/prototype/shuffle.js */
  var virtualdom_items_Section$shuffle = function( types, runloop, circular ) {

    var Fragment;
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    return function Section$shuffle( newIndices ) {
      var this$0 = this;
      var section = this,
        parentFragment, firstChange, i, newLength, reboundFragments, fragmentOptions, fragment;
      // short circuit any double-updates, and ensure that this isn't applied to
      // non-list sections
      if ( this.shuffling || this.unbound || this.subtype && this.subtype !== types.SECTION_EACH ) {
        return;
      }
      this.shuffling = true;
      runloop.scheduleTask( function() {
        return this$0.shuffling = false;
      } );
      parentFragment = this.parentFragment;
      reboundFragments = [];
      // first, rebind existing fragments
      newIndices.forEach( function rebindIfNecessary( newIndex, oldIndex ) {
        var fragment, by, oldKeypath, newKeypath;
        if ( newIndex === oldIndex ) {
          reboundFragments[ newIndex ] = section.fragments[ oldIndex ];
          return;
        }
        fragment = section.fragments[ oldIndex ];
        if ( firstChange === undefined ) {
          firstChange = oldIndex;
        }
        // does this fragment need to be torn down?
        if ( newIndex === -1 ) {
          section.fragmentsToUnrender.push( fragment );
          fragment.unbind();
          return;
        }
        // Otherwise, it needs to be rebound to a new index
        by = newIndex - oldIndex;
        oldKeypath = section.keypath + '.' + oldIndex;
        newKeypath = section.keypath + '.' + newIndex;
        fragment.rebind( section.template.i, newIndex, oldKeypath, newKeypath );
        fragment.index = newIndex;
        reboundFragments[ newIndex ] = fragment;
      } );
      newLength = this.root.get( this.keypath ).length;
      // If nothing changed with the existing fragments, then we start adding
      // new fragments at the end...
      if ( firstChange === undefined ) {
        // ...unless there are no new fragments to add
        if ( this.length === newLength ) {
          return;
        }
        firstChange = this.length;
      }
      this.length = this.fragments.length = newLength;
      if ( this.rendered ) {
        runloop.addView( this );
      }
      // Prepare new fragment options
      fragmentOptions = {
        template: this.template.f,
        root: this.root,
        owner: this
      };
      if ( this.template.i ) {
        fragmentOptions.indexRef = this.template.i;
      }
      // Add as many new fragments as we need to, or add back existing
      // (detached) fragments
      for ( i = firstChange; i < newLength; i += 1 ) {
        fragment = reboundFragments[ i ];
        if ( !fragment ) {
          this.fragmentsToCreate.push( i );
        }
        this.fragments[ i ] = fragment;
      }
    };
  }( types, runloop, circular );

  /* virtualdom/items/Section/prototype/render.js */
  var virtualdom_items_Section$render = function Section$render() {
    var docFrag;
    docFrag = this.docFrag = document.createDocumentFragment();
    this.update();
    this.rendered = true;
    return docFrag;
  };

  /* utils/isArrayLike.js */
  var isArrayLike = function() {

    var pattern = /^\[object (?:Array|FileList)\]$/,
      toString = Object.prototype.toString;
    return function isArrayLike( obj ) {
      return pattern.test( toString.call( obj ) );
    };
  }();

  /* virtualdom/items/Section/prototype/setValue.js */
  var virtualdom_items_Section$setValue = function( types, isArrayLike, isObject, runloop, circular ) {

    var __export;
    var Fragment;
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    __export = function Section$setValue( value ) {
      var this$0 = this;
      var wrapper, fragmentOptions;
      if ( this.updating ) {
        // If a child of this section causes a re-evaluation - for example, an
        // expression refers to a function that mutates the array that this
        // section depends on - we'll end up with a double rendering bug (see
        // https://github.com/ractivejs/ractive/issues/748). This prevents it.
        return;
      }
      this.updating = true;
      // with sections, we need to get the fake value if we have a wrapped object
      if ( wrapper = this.root.viewmodel.wrapped[ this.keypath ] ) {
        value = wrapper.get();
      }
      // If any fragments are awaiting creation after a splice,
      // this is the place to do it
      if ( this.fragmentsToCreate.length ) {
        fragmentOptions = {
          template: this.template.f,
          root: this.root,
          pElement: this.pElement,
          owner: this,
          indexRef: this.template.i
        };
        this.fragmentsToCreate.forEach( function( index ) {
          var fragment;
          fragmentOptions.context = this$0.keypath + '.' + index;
          fragmentOptions.index = index;
          fragment = new Fragment( fragmentOptions );
          this$0.fragmentsToRender.push( this$0.fragments[ index ] = fragment );
        } );
        this.fragmentsToCreate.length = 0;
      } else if ( reevaluateSection( this, value ) ) {
        this.bubble();
        if ( this.rendered ) {
          runloop.addView( this );
        }
      }
      this.value = value;
      this.updating = false;
    };

    function reevaluateSection( section, value ) {
      var fragmentOptions = {
        template: section.template.f,
        root: section.root,
        pElement: section.parentFragment.pElement,
        owner: section
      };
      // If we already know the section type, great
      // TODO can this be optimised? i.e. pick an reevaluateSection function during init
      // and avoid doing this each time?
      if ( section.subtype ) {
        switch ( section.subtype ) {
          case types.SECTION_IF:
            return reevaluateConditionalSection( section, value, false, fragmentOptions );
          case types.SECTION_UNLESS:
            return reevaluateConditionalSection( section, value, true, fragmentOptions );
          case types.SECTION_WITH:
            return reevaluateContextSection( section, fragmentOptions );
          case types.SECTION_IF_WITH:
            return reevaluateConditionalContextSection( section, value, fragmentOptions );
          case types.SECTION_EACH:
            if ( isObject( value ) ) {
              return reevaluateListObjectSection( section, value, fragmentOptions );
            }
        }
      }
      // Otherwise we need to work out what sort of section we're dealing with
      section.ordered = !!isArrayLike( value );
      // Ordered list section
      if ( section.ordered ) {
        return reevaluateListSection( section, value, fragmentOptions );
      }
      // Unordered list, or context
      if ( isObject( value ) || typeof value === 'function' ) {
        // Index reference indicates section should be treated as a list
        if ( section.template.i ) {
          return reevaluateListObjectSection( section, value, fragmentOptions );
        }
        // Otherwise, object provides context for contents
        return reevaluateContextSection( section, fragmentOptions );
      }
      // Conditional section
      return reevaluateConditionalSection( section, value, false, fragmentOptions );
    }

    function reevaluateListSection( section, value, fragmentOptions ) {
      var i, length, fragment;
      length = value.length;
      if ( length === section.length ) {
        // Nothing to do
        return false;
      }
      // if the array is shorter than it was previously, remove items
      if ( length < section.length ) {
        section.fragmentsToUnrender = section.fragments.splice( length, section.length - length );
        section.fragmentsToUnrender.forEach( unbind );
      } else {
        if ( length > section.length ) {
          // add any new ones
          for ( i = section.length; i < length; i += 1 ) {
            // append list item to context stack
            fragmentOptions.context = section.keypath + '.' + i;
            fragmentOptions.index = i;
            if ( section.template.i ) {
              fragmentOptions.indexRef = section.template.i;
            }
            fragment = new Fragment( fragmentOptions );
            section.fragmentsToRender.push( section.fragments[ i ] = fragment );
          }
        }
      }
      section.length = length;
      return true;
    }

    function reevaluateListObjectSection( section, value, fragmentOptions ) {
      var id, i, hasKey, fragment, changed;
      hasKey = section.hasKey || ( section.hasKey = {} );
      // remove any fragments that should no longer exist
      i = section.fragments.length;
      while ( i-- ) {
        fragment = section.fragments[ i ];
        if ( !( fragment.index in value ) ) {
          changed = true;
          fragment.unbind();
          section.fragmentsToUnrender.push( fragment );
          section.fragments.splice( i, 1 );
          hasKey[ fragment.index ] = false;
        }
      }
      // add any that haven't been created yet
      for ( id in value ) {
        if ( !hasKey[ id ] ) {
          changed = true;
          fragmentOptions.context = section.keypath + '.' + id;
          fragmentOptions.index = id;
          if ( section.template.i ) {
            fragmentOptions.indexRef = section.template.i;
          }
          fragment = new Fragment( fragmentOptions );
          section.fragmentsToRender.push( fragment );
          section.fragments.push( fragment );
          hasKey[ id ] = true;
        }
      }
      section.length = section.fragments.length;
      return changed;
    }

    function reevaluateConditionalContextSection( section, value, fragmentOptions ) {
      if ( value ) {
        return reevaluateContextSection( section, fragmentOptions );
      } else {
        return removeSectionFragments( section );
      }
    }

    function reevaluateContextSection( section, fragmentOptions ) {
      var fragment;
      // ...then if it isn't rendered, render it, adding section.keypath to the context stack
      // (if it is already rendered, then any children dependent on the context stack
      // will update themselves without any prompting)
      if ( !section.length ) {
        // append this section to the context stack
        fragmentOptions.context = section.keypath;
        fragmentOptions.index = 0;
        fragment = new Fragment( fragmentOptions );
        section.fragmentsToRender.push( section.fragments[ 0 ] = fragment );
        section.length = 1;
        return true;
      }
    }

    function reevaluateConditionalSection( section, value, inverted, fragmentOptions ) {
      var doRender, emptyArray, emptyObject, fragment, name;
      emptyArray = isArrayLike( value ) && value.length === 0;
      emptyObject = false;
      if ( !isArrayLike( value ) && isObject( value ) ) {
        emptyObject = true;
        for ( name in value ) {
          emptyObject = false;
          break;
        }
      }
      if ( inverted ) {
        doRender = emptyArray || emptyObject || !value;
      } else {
        doRender = value && !emptyArray && !emptyObject;
      }
      if ( doRender ) {
        if ( !section.length ) {
          // no change to context stack
          fragmentOptions.index = 0;
          fragment = new Fragment( fragmentOptions );
          section.fragmentsToRender.push( section.fragments[ 0 ] = fragment );
          section.length = 1;
          return true;
        }
        if ( section.length > 1 ) {
          section.fragmentsToUnrender = section.fragments.splice( 1 );
          section.fragmentsToUnrender.forEach( unbind );
          return true;
        }
      } else {
        return removeSectionFragments( section );
      }
    }

    function removeSectionFragments( section ) {
      if ( section.length ) {
        section.fragmentsToUnrender = section.fragments.splice( 0, section.fragments.length ).filter( isRendered );
        section.fragmentsToUnrender.forEach( unbind );
        section.length = section.fragmentsToRender.length = 0;
        return true;
      }
    }

    function unbind( fragment ) {
      fragment.unbind();
    }

    function isRendered( fragment ) {
      return fragment.rendered;
    }
    return __export;
  }( types, isArrayLike, isObject, runloop, circular );

  /* virtualdom/items/Section/prototype/toString.js */
  var virtualdom_items_Section$toString = function Section$toString( escape ) {
    var str, i, len;
    str = '';
    i = 0;
    len = this.length;
    for ( i = 0; i < len; i += 1 ) {
      str += this.fragments[ i ].toString( escape );
    }
    return str;
  };

  /* virtualdom/items/Section/prototype/unbind.js */
  var virtualdom_items_Section$unbind = function( unbind ) {

    var __export;
    __export = function Section$unbind() {
      this.fragments.forEach( unbindFragment );
      unbind.call( this );
      this.length = 0;
      this.unbound = true;
    };

    function unbindFragment( fragment ) {
      fragment.unbind();
    }
    return __export;
  }( unbind );

  /* virtualdom/items/Section/prototype/unrender.js */
  var virtualdom_items_Section$unrender = function() {

    var __export;
    __export = function Section$unrender( shouldDestroy ) {
      this.fragments.forEach( shouldDestroy ? unrenderAndDestroy : unrender );
    };

    function unrenderAndDestroy( fragment ) {
      fragment.unrender( true );
    }

    function unrender( fragment ) {
      fragment.unrender( false );
    }
    return __export;
  }();

  /* virtualdom/items/Section/prototype/update.js */
  var virtualdom_items_Section$update = function Section$update() {
    var fragment, renderIndex, renderedFragments, anchor, target, i, len;
    // `this.renderedFragments` is in the order of the previous render.
    // If fragments have shuffled about, this allows us to quickly
    // reinsert them in the correct place
    renderedFragments = this.renderedFragments;
    // Remove fragments that have been marked for destruction
    while ( fragment = this.fragmentsToUnrender.pop() ) {
      fragment.unrender( true );
      renderedFragments.splice( renderedFragments.indexOf( fragment ), 1 );
    }
    // Render new fragments (but don't insert them yet)
    while ( fragment = this.fragmentsToRender.shift() ) {
      fragment.render();
    }
    if ( this.rendered ) {
      target = this.parentFragment.getNode();
    }
    len = this.fragments.length;
    for ( i = 0; i < len; i += 1 ) {
      fragment = this.fragments[ i ];
      renderIndex = renderedFragments.indexOf( fragment, i );
      // search from current index - it's guaranteed to be the same or higher
      if ( renderIndex === i ) {
        // already in the right place. insert accumulated nodes (if any) and carry on
        if ( this.docFrag.childNodes.length ) {
          anchor = fragment.firstNode();
          target.insertBefore( this.docFrag, anchor );
        }
        continue;
      }
      this.docFrag.appendChild( fragment.detach() );
      // update renderedFragments
      if ( renderIndex !== -1 ) {
        renderedFragments.splice( renderIndex, 1 );
      }
      renderedFragments.splice( i, 0, fragment );
    }
    if ( this.rendered && this.docFrag.childNodes.length ) {
      anchor = this.parentFragment.findNextNode( this );
      target.insertBefore( this.docFrag, anchor );
    }
    // Save the rendering order for next time
    this.renderedFragments = this.fragments.slice();
  };

  /* virtualdom/items/Section/_Section.js */
  var Section = function( types, Mustache, bubble, detach, find, findAll, findAllComponents, findComponent, findNextNode, firstNode, shuffle, render, setValue, toString, unbind, unrender, update ) {

    var Section = function( options ) {
      this.type = types.SECTION;
      this.subtype = options.template.n;
      this.inverted = this.subtype === types.SECTION_UNLESS;
      this.pElement = options.pElement;
      this.fragments = [];
      this.fragmentsToCreate = [];
      this.fragmentsToRender = [];
      this.fragmentsToUnrender = [];
      this.renderedFragments = [];
      this.length = 0;
      // number of times this section is rendered
      Mustache.init( this, options );
    };
    Section.prototype = {
      bubble: bubble,
      detach: detach,
      find: find,
      findAll: findAll,
      findAllComponents: findAllComponents,
      findComponent: findComponent,
      findNextNode: findNextNode,
      firstNode: firstNode,
      getValue: Mustache.getValue,
      shuffle: shuffle,
      rebind: Mustache.rebind,
      render: render,
      resolve: Mustache.resolve,
      setValue: setValue,
      toString: toString,
      unbind: unbind,
      unrender: unrender,
      update: update
    };
    return Section;
  }( types, Mustache, virtualdom_items_Section$bubble, virtualdom_items_Section$detach, virtualdom_items_Section$find, virtualdom_items_Section$findAll, virtualdom_items_Section$findAllComponents, virtualdom_items_Section$findComponent, virtualdom_items_Section$findNextNode, virtualdom_items_Section$firstNode, virtualdom_items_Section$shuffle, virtualdom_items_Section$render, virtualdom_items_Section$setValue, virtualdom_items_Section$toString, virtualdom_items_Section$unbind, virtualdom_items_Section$unrender, virtualdom_items_Section$update );

  /* virtualdom/items/Triple/prototype/detach.js */
  var virtualdom_items_Triple$detach = function Triple$detach() {
    var len, i;
    if ( this.docFrag ) {
      len = this.nodes.length;
      for ( i = 0; i < len; i += 1 ) {
        this.docFrag.appendChild( this.nodes[ i ] );
      }
      return this.docFrag;
    }
  };

  /* virtualdom/items/Triple/prototype/find.js */
  var virtualdom_items_Triple$find = function( matches ) {

    return function Triple$find( selector ) {
      var i, len, node, queryResult;
      len = this.nodes.length;
      for ( i = 0; i < len; i += 1 ) {
        node = this.nodes[ i ];
        if ( node.nodeType !== 1 ) {
          continue;
        }
        if ( matches( node, selector ) ) {
          return node;
        }
        if ( queryResult = node.querySelector( selector ) ) {
          return queryResult;
        }
      }
      return null;
    };
  }( matches );

  /* virtualdom/items/Triple/prototype/findAll.js */
  var virtualdom_items_Triple$findAll = function( matches ) {

    return function Triple$findAll( selector, queryResult ) {
      var i, len, node, queryAllResult, numNodes, j;
      len = this.nodes.length;
      for ( i = 0; i < len; i += 1 ) {
        node = this.nodes[ i ];
        if ( node.nodeType !== 1 ) {
          continue;
        }
        if ( matches( node, selector ) ) {
          queryResult.push( node );
        }
        if ( queryAllResult = node.querySelectorAll( selector ) ) {
          numNodes = queryAllResult.length;
          for ( j = 0; j < numNodes; j += 1 ) {
            queryResult.push( queryAllResult[ j ] );
          }
        }
      }
    };
  }( matches );

  /* virtualdom/items/Triple/prototype/firstNode.js */
  var virtualdom_items_Triple$firstNode = function Triple$firstNode() {
    if ( this.rendered && this.nodes[ 0 ] ) {
      return this.nodes[ 0 ];
    }
    return this.parentFragment.findNextNode( this );
  };

  /* virtualdom/items/Triple/helpers/insertHtml.js */
  var insertHtml = function( namespaces, createElement ) {

    var __export;
    var elementCache = {},
      ieBug, ieBlacklist;
    try {
      createElement( 'table' ).innerHTML = 'foo';
    } catch ( err ) {
      ieBug = true;
      ieBlacklist = {
        TABLE: [
          '<table class="x">',
          '</table>'
        ],
        THEAD: [
          '<table><thead class="x">',
          '</thead></table>'
        ],
        TBODY: [
          '<table><tbody class="x">',
          '</tbody></table>'
        ],
        TR: [
          '<table><tr class="x">',
          '</tr></table>'
        ],
        SELECT: [
          '<select class="x">',
          '</select>'
        ]
      };
    }
    __export = function( html, node, docFrag ) {
      var container, nodes = [],
        wrapper, selectedOption, child, i;
      // render 0 and false
      if ( html != null && html !== '' ) {
        if ( ieBug && ( wrapper = ieBlacklist[ node.tagName ] ) ) {
          container = element( 'DIV' );
          container.innerHTML = wrapper[ 0 ] + html + wrapper[ 1 ];
          container = container.querySelector( '.x' );
          if ( container.tagName === 'SELECT' ) {
            selectedOption = container.options[ container.selectedIndex ];
          }
        } else if ( node.namespaceURI === namespaces.svg ) {
          container = element( 'DIV' );
          container.innerHTML = '<svg class="x">' + html + '</svg>';
          container = container.querySelector( '.x' );
        } else {
          container = element( node.tagName );
          container.innerHTML = html;
          if ( container.tagName === 'SELECT' ) {
            selectedOption = container.options[ container.selectedIndex ];
          }
        }
        while ( child = container.firstChild ) {
          nodes.push( child );
          docFrag.appendChild( child );
        }
        // This is really annoying. Extracting <option> nodes from the
        // temporary container <select> causes the remaining ones to
        // become selected. So now we have to deselect them. IE8, you
        // amaze me. You really do
        // ...and now Chrome too
        if ( node.tagName === 'SELECT' ) {
          i = nodes.length;
          while ( i-- ) {
            if ( nodes[ i ] !== selectedOption ) {
              nodes[ i ].selected = false;
            }
          }
        }
      }
      return nodes;
    };

    function element( tagName ) {
      return elementCache[ tagName ] || ( elementCache[ tagName ] = createElement( tagName ) );
    }
    return __export;
  }( namespaces, createElement );

  /* utils/toArray.js */
  var toArray = function toArray( arrayLike ) {
    var array = [],
      i = arrayLike.length;
    while ( i-- ) {
      array[ i ] = arrayLike[ i ];
    }
    return array;
  };

  /* virtualdom/items/Triple/helpers/updateSelect.js */
  var updateSelect = function( toArray ) {

    var __export;
    __export = function updateSelect( parentElement ) {
      var selectedOptions, option, value;
      if ( !parentElement || parentElement.name !== 'select' || !parentElement.binding ) {
        return;
      }
      selectedOptions = toArray( parentElement.node.options ).filter( isSelected );
      // If one of them had a `selected` attribute, we need to sync
      // the model to the view
      if ( parentElement.getAttribute( 'multiple' ) ) {
        value = selectedOptions.map( function( o ) {
          return o.value;
        } );
      } else if ( option = selectedOptions[ 0 ] ) {
        value = option.value;
      }
      if ( value !== undefined ) {
        parentElement.binding.setValue( value );
      }
      parentElement.bubble();
    };

    function isSelected( option ) {
      return option.selected;
    }
    return __export;
  }( toArray );

  /* virtualdom/items/Triple/prototype/render.js */
  var virtualdom_items_Triple$render = function( insertHtml, updateSelect ) {

    return function Triple$render() {
      if ( this.rendered ) {
        throw new Error( 'Attempted to render an item that was already rendered' );
      }
      this.docFrag = document.createDocumentFragment();
      this.nodes = insertHtml( this.value, this.parentFragment.getNode(), this.docFrag );
      // Special case - we're inserting the contents of a <select>
      updateSelect( this.pElement );
      this.rendered = true;
      return this.docFrag;
    };
  }( insertHtml, updateSelect );

  /* virtualdom/items/Triple/prototype/setValue.js */
  var virtualdom_items_Triple$setValue = function( runloop ) {

    return function Triple$setValue( value ) {
      var wrapper;
      // TODO is there a better way to approach this?
      if ( wrapper = this.root.viewmodel.wrapped[ this.keypath ] ) {
        value = wrapper.get();
      }
      if ( value !== this.value ) {
        this.value = value;
        this.parentFragment.bubble();
        if ( this.rendered ) {
          runloop.addView( this );
        }
      }
    };
  }( runloop );

  /* virtualdom/items/Triple/prototype/toString.js */
  var virtualdom_items_Triple$toString = function( decodeCharacterReferences ) {

    return function Triple$toString() {
      return this.value != undefined ? decodeCharacterReferences( '' + this.value ) : '';
    };
  }( decodeCharacterReferences );

  /* virtualdom/items/Triple/prototype/unrender.js */
  var virtualdom_items_Triple$unrender = function( detachNode ) {

    return function Triple$unrender( shouldDestroy ) {
      if ( this.rendered && shouldDestroy ) {
        this.nodes.forEach( detachNode );
        this.rendered = false;
      }
    };
  }( detachNode );

  /* virtualdom/items/Triple/prototype/update.js */
  var virtualdom_items_Triple$update = function( insertHtml, updateSelect ) {

    return function Triple$update() {
      var node, parentNode;
      if ( !this.rendered ) {
        return;
      }
      // Remove existing nodes
      while ( this.nodes && this.nodes.length ) {
        node = this.nodes.pop();
        node.parentNode.removeChild( node );
      }
      // Insert new nodes
      parentNode = this.parentFragment.getNode();
      this.nodes = insertHtml( this.value, parentNode, this.docFrag );
      parentNode.insertBefore( this.docFrag, this.parentFragment.findNextNode( this ) );
      // Special case - we're inserting the contents of a <select>
      updateSelect( this.pElement );
    };
  }( insertHtml, updateSelect );

  /* virtualdom/items/Triple/_Triple.js */
  var Triple = function( types, Mustache, detach, find, findAll, firstNode, render, setValue, toString, unrender, update, unbind ) {

    var Triple = function( options ) {
      this.type = types.TRIPLE;
      Mustache.init( this, options );
    };
    Triple.prototype = {
      detach: detach,
      find: find,
      findAll: findAll,
      firstNode: firstNode,
      getValue: Mustache.getValue,
      rebind: Mustache.rebind,
      render: render,
      resolve: Mustache.resolve,
      setValue: setValue,
      toString: toString,
      unbind: unbind,
      unrender: unrender,
      update: update
    };
    return Triple;
  }( types, Mustache, virtualdom_items_Triple$detach, virtualdom_items_Triple$find, virtualdom_items_Triple$findAll, virtualdom_items_Triple$firstNode, virtualdom_items_Triple$render, virtualdom_items_Triple$setValue, virtualdom_items_Triple$toString, virtualdom_items_Triple$unrender, virtualdom_items_Triple$update, unbind );

  /* virtualdom/items/Element/prototype/bubble.js */
  var virtualdom_items_Element$bubble = function() {
    this.parentFragment.bubble();
  };

  /* virtualdom/items/Element/prototype/detach.js */
  var virtualdom_items_Element$detach = function Element$detach() {
    var node = this.node,
      parentNode;
    if ( node ) {
      // need to check for parent node - DOM may have been altered
      // by something other than Ractive! e.g. jQuery UI...
      if ( parentNode = node.parentNode ) {
        parentNode.removeChild( node );
      }
      return node;
    }
  };

  /* virtualdom/items/Element/prototype/find.js */
  var virtualdom_items_Element$find = function( matches ) {

    return function( selector ) {
      if ( matches( this.node, selector ) ) {
        return this.node;
      }
      if ( this.fragment && this.fragment.find ) {
        return this.fragment.find( selector );
      }
    };
  }( matches );

  /* virtualdom/items/Element/prototype/findAll.js */
  var virtualdom_items_Element$findAll = function( selector, query ) {
    // Add this node to the query, if applicable, and register the
    // query on this element
    if ( query._test( this, true ) && query.live ) {
      ( this.liveQueries || ( this.liveQueries = [] ) ).push( query );
    }
    if ( this.fragment ) {
      this.fragment.findAll( selector, query );
    }
  };

  /* virtualdom/items/Element/prototype/findAllComponents.js */
  var virtualdom_items_Element$findAllComponents = function( selector, query ) {
    if ( this.fragment ) {
      this.fragment.findAllComponents( selector, query );
    }
  };

  /* virtualdom/items/Element/prototype/findComponent.js */
  var virtualdom_items_Element$findComponent = function( selector ) {
    if ( this.fragment ) {
      return this.fragment.findComponent( selector );
    }
  };

  /* virtualdom/items/Element/prototype/findNextNode.js */
  var virtualdom_items_Element$findNextNode = function Element$findNextNode() {
    return null;
  };

  /* virtualdom/items/Element/prototype/firstNode.js */
  var virtualdom_items_Element$firstNode = function Element$firstNode() {
    return this.node;
  };

  /* virtualdom/items/Element/prototype/getAttribute.js */
  var virtualdom_items_Element$getAttribute = function Element$getAttribute( name ) {
    if ( !this.attributes || !this.attributes[ name ] ) {
      return;
    }
    return this.attributes[ name ].value;
  };

  /* virtualdom/items/Element/shared/enforceCase.js */
  var enforceCase = function() {

    var svgCamelCaseElements, svgCamelCaseAttributes, createMap, map;
    svgCamelCaseElements = 'altGlyph altGlyphDef altGlyphItem animateColor animateMotion animateTransform clipPath feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence foreignObject glyphRef linearGradient radialGradient textPath vkern'.split( ' ' );
    svgCamelCaseAttributes = 'attributeName attributeType baseFrequency baseProfile calcMode clipPathUnits contentScriptType contentStyleType diffuseConstant edgeMode externalResourcesRequired filterRes filterUnits glyphRef gradientTransform gradientUnits kernelMatrix kernelUnitLength keyPoints keySplines keyTimes lengthAdjust limitingConeAngle markerHeight markerUnits markerWidth maskContentUnits maskUnits numOctaves pathLength patternContentUnits patternTransform patternUnits pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits refX refY repeatCount repeatDur requiredExtensions requiredFeatures specularConstant specularExponent spreadMethod startOffset stdDeviation stitchTiles surfaceScale systemLanguage tableValues targetX targetY textLength viewBox viewTarget xChannelSelector yChannelSelector zoomAndPan'.split( ' ' );
    createMap = function( items ) {
      var map = {},
        i = items.length;
      while ( i-- ) {
        map[ items[ i ].toLowerCase() ] = items[ i ];
      }
      return map;
    };
    map = createMap( svgCamelCaseElements.concat( svgCamelCaseAttributes ) );
    return function( elementName ) {
      var lowerCaseElementName = elementName.toLowerCase();
      return map[ lowerCaseElementName ] || lowerCaseElementName;
    };
  }();

  /* virtualdom/items/Element/Attribute/prototype/bubble.js */
  var virtualdom_items_Element_Attribute$bubble = function( runloop, isEqual ) {

    return function Attribute$bubble() {
      var value = this.fragment.getValue();
      // TODO this can register the attribute multiple times (see render test
      // 'Attribute with nested mustaches')
      if ( !isEqual( value, this.value ) ) {
        // Need to clear old id from ractive.nodes
        if ( this.name === 'id' && this.value ) {
          delete this.root.nodes[ this.value ];
        }
        this.value = value;
        if ( this.name === 'value' && this.node ) {
          // We need to store the value on the DOM like this so we
          // can retrieve it later without it being coerced to a string
          this.node._ractive.value = value;
        }
        if ( this.rendered ) {
          runloop.addView( this );
        }
      }
    };
  }( runloop, isEqual );

  /* config/booleanAttributes.js */
  var booleanAttributes = function() {

    // https://github.com/kangax/html-minifier/issues/63#issuecomment-37763316
    var booleanAttributes = /^(allowFullscreen|async|autofocus|autoplay|checked|compact|controls|declare|default|defaultChecked|defaultMuted|defaultSelected|defer|disabled|draggable|enabled|formNoValidate|hidden|indeterminate|inert|isMap|itemScope|loop|multiple|muted|noHref|noResize|noShade|noValidate|noWrap|open|pauseOnExit|readOnly|required|reversed|scoped|seamless|selected|sortable|translate|trueSpeed|typeMustMatch|visible)$/i;
    return booleanAttributes;
  }();

  /* virtualdom/items/Element/Attribute/helpers/determineNameAndNamespace.js */
  var determineNameAndNamespace = function( namespaces, enforceCase ) {

    return function( attribute, name ) {
      var colonIndex, namespacePrefix;
      // are we dealing with a namespaced attribute, e.g. xlink:href?
      colonIndex = name.indexOf( ':' );
      if ( colonIndex !== -1 ) {
        // looks like we are, yes...
        namespacePrefix = name.substr( 0, colonIndex );
        // ...unless it's a namespace *declaration*, which we ignore (on the assumption
        // that only valid namespaces will be used)
        if ( namespacePrefix !== 'xmlns' ) {
          name = name.substring( colonIndex + 1 );
          attribute.name = enforceCase( name );
          attribute.namespace = namespaces[ namespacePrefix.toLowerCase() ];
          attribute.namespacePrefix = namespacePrefix;
          if ( !attribute.namespace ) {
            throw 'Unknown namespace ("' + namespacePrefix + '")';
          }
          return;
        }
      }
      // SVG attribute names are case sensitive
      attribute.name = attribute.element.namespace !== namespaces.html ? enforceCase( name ) : name;
    };
  }( namespaces, enforceCase );

  /* virtualdom/items/Element/Attribute/helpers/getInterpolator.js */
  var getInterpolator = function( types ) {

    return function getInterpolator( attribute ) {
      var items = attribute.fragment.items;
      if ( items.length !== 1 ) {
        return;
      }
      if ( items[ 0 ].type === types.INTERPOLATOR ) {
        return items[ 0 ];
      }
    };
  }( types );

  /* virtualdom/items/Element/Attribute/helpers/determinePropertyName.js */
  var determinePropertyName = function( namespaces, booleanAttributes ) {

    var propertyNames = {
      'accept-charset': 'acceptCharset',
      accesskey: 'accessKey',
      bgcolor: 'bgColor',
      'class': 'className',
      codebase: 'codeBase',
      colspan: 'colSpan',
      contenteditable: 'contentEditable',
      datetime: 'dateTime',
      dirname: 'dirName',
      'for': 'htmlFor',
      'http-equiv': 'httpEquiv',
      ismap: 'isMap',
      maxlength: 'maxLength',
      novalidate: 'noValidate',
      pubdate: 'pubDate',
      readonly: 'readOnly',
      rowspan: 'rowSpan',
      tabindex: 'tabIndex',
      usemap: 'useMap'
    };
    return function( attribute, options ) {
      var propertyName;
      if ( attribute.pNode && !attribute.namespace && ( !options.pNode.namespaceURI || options.pNode.namespaceURI === namespaces.html ) ) {
        propertyName = propertyNames[ attribute.name ] || attribute.name;
        if ( options.pNode[ propertyName ] !== undefined ) {
          attribute.propertyName = propertyName;
        }
        // is attribute a boolean attribute or 'value'? If so we're better off doing e.g.
        // node.selected = true rather than node.setAttribute( 'selected', '' )
        if ( booleanAttributes.test( propertyName ) || propertyName === 'value' ) {
          attribute.useProperty = true;
        }
      }
    };
  }( namespaces, booleanAttributes );

  /* virtualdom/items/Element/Attribute/prototype/init.js */
  var virtualdom_items_Element_Attribute$init = function( types, booleanAttributes, determineNameAndNamespace, getInterpolator, determinePropertyName, circular ) {

    var Fragment;
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    return function Attribute$init( options ) {
      this.type = types.ATTRIBUTE;
      this.element = options.element;
      this.root = options.root;
      determineNameAndNamespace( this, options.name );
      // if it's an empty attribute, or just a straight key-value pair, with no
      // mustache shenanigans, set the attribute accordingly and go home
      if ( !options.value || typeof options.value === 'string' ) {
        this.value = booleanAttributes.test( this.name ) ? true : options.value || '';
        return;
      }
      // otherwise we need to do some work
      // share parentFragment with parent element
      this.parentFragment = this.element.parentFragment;
      this.fragment = new Fragment( {
        template: options.value,
        root: this.root,
        owner: this
      } );
      this.value = this.fragment.getValue();
      // Store a reference to this attribute's interpolator, if its fragment
      // takes the form `{{foo}}`. This is necessary for two-way binding and
      // for correctly rendering HTML later
      this.interpolator = getInterpolator( this );
      this.isBindable = !!this.interpolator && !this.interpolator.isStatic;
      // can we establish this attribute's property name equivalent?
      determinePropertyName( this, options );
      // mark as ready
      this.ready = true;
    };
  }( types, booleanAttributes, determineNameAndNamespace, getInterpolator, determinePropertyName, circular );

  /* virtualdom/items/Element/Attribute/prototype/rebind.js */
  var virtualdom_items_Element_Attribute$rebind = function Attribute$rebind( indexRef, newIndex, oldKeypath, newKeypath ) {
    if ( this.fragment ) {
      this.fragment.rebind( indexRef, newIndex, oldKeypath, newKeypath );
    }
  };

  /* virtualdom/items/Element/Attribute/prototype/render.js */
  var virtualdom_items_Element_Attribute$render = function( namespaces, booleanAttributes ) {

    var propertyNames = {
      'accept-charset': 'acceptCharset',
      'accesskey': 'accessKey',
      'bgcolor': 'bgColor',
      'class': 'className',
      'codebase': 'codeBase',
      'colspan': 'colSpan',
      'contenteditable': 'contentEditable',
      'datetime': 'dateTime',
      'dirname': 'dirName',
      'for': 'htmlFor',
      'http-equiv': 'httpEquiv',
      'ismap': 'isMap',
      'maxlength': 'maxLength',
      'novalidate': 'noValidate',
      'pubdate': 'pubDate',
      'readonly': 'readOnly',
      'rowspan': 'rowSpan',
      'tabindex': 'tabIndex',
      'usemap': 'useMap'
    };
    return function Attribute$render( node ) {
      var propertyName;
      this.node = node;
      // should we use direct property access, or setAttribute?
      if ( !node.namespaceURI || node.namespaceURI === namespaces.html ) {
        propertyName = propertyNames[ this.name ] || this.name;
        if ( node[ propertyName ] !== undefined ) {
          this.propertyName = propertyName;
        }
        // is attribute a boolean attribute or 'value'? If so we're better off doing e.g.
        // node.selected = true rather than node.setAttribute( 'selected', '' )
        if ( booleanAttributes.test( propertyName ) || propertyName === 'value' ) {
          this.useProperty = true;
        }
        if ( propertyName === 'value' ) {
          this.useProperty = true;
          node._ractive.value = this.value;
        }
      }
      this.rendered = true;
      this.update();
    };
  }( namespaces, booleanAttributes );

  /* virtualdom/items/Element/Attribute/prototype/toString.js */
  var virtualdom_items_Element_Attribute$toString = function( booleanAttributes ) {

    var __export;
    __export = function Attribute$toString() {
      var name = ( fragment = this ).name,
        namespacePrefix = fragment.namespacePrefix,
        value = fragment.value,
        interpolator = fragment.interpolator,
        fragment = fragment.fragment;
      // Special case - select and textarea values (should not be stringified)
      if ( name === 'value' && ( this.element.name === 'select' || this.element.name === 'textarea' ) ) {
        return;
      }
      // Special case - content editable
      if ( name === 'value' && this.element.getAttribute( 'contenteditable' ) !== undefined ) {
        return;
      }
      // Special case - radio names
      if ( name === 'name' && this.element.name === 'input' && interpolator ) {
        return 'name={{' + ( interpolator.keypath || interpolator.ref ) + '}}';
      }
      // Boolean attributes
      if ( booleanAttributes.test( name ) ) {
        return value ? name : '';
      }
      if ( fragment ) {
        value = fragment.toString();
      }
      if ( namespacePrefix ) {
        name = namespacePrefix + ':' + name;
      }
      return value ? name + '="' + escape( value ) + '"' : name;
    };

    function escape( value ) {
      return value.replace( /&/g, '&amp;' ).replace( /"/g, '&quot;' ).replace( /'/g, '&#39;' );
    }
    return __export;
  }( booleanAttributes );

  /* virtualdom/items/Element/Attribute/prototype/unbind.js */
  var virtualdom_items_Element_Attribute$unbind = function Attribute$unbind() {
    // ignore non-dynamic attributes
    if ( this.fragment ) {
      this.fragment.unbind();
    }
    if ( this.name === 'id' ) {
      delete this.root.nodes[ this.value ];
    }
  };

  /* virtualdom/items/Element/Attribute/prototype/update/updateSelectValue.js */
  var virtualdom_items_Element_Attribute$update_updateSelectValue = function Attribute$updateSelect() {
    var value = this.value,
      options, option, optionValue, i;
    if ( !this.locked ) {
      this.node._ractive.value = value;
      options = this.node.options;
      i = options.length;
      while ( i-- ) {
        option = options[ i ];
        optionValue = option._ractive ? option._ractive.value : option.value;
        // options inserted via a triple don't have _ractive
        if ( optionValue == value ) {
          // double equals as we may be comparing numbers with strings
          option.selected = true;
          break;
        }
      }
    }
  };

  /* utils/arrayContains.js */
  var arrayContains = function arrayContains( array, value ) {
    for ( var i = 0, c = array.length; i < c; i++ ) {
      if ( array[ i ] == value ) {
        return true;
      }
    }
    return false;
  };

  /* virtualdom/items/Element/Attribute/prototype/update/updateMultipleSelectValue.js */
  var virtualdom_items_Element_Attribute$update_updateMultipleSelectValue = function( arrayContains, isArray ) {

    return function Attribute$updateMultipleSelect() {
      var value = this.value,
        options, i, option, optionValue;
      if ( !isArray( value ) ) {
        value = [ value ];
      }
      options = this.node.options;
      i = options.length;
      while ( i-- ) {
        option = options[ i ];
        optionValue = option._ractive ? option._ractive.value : option.value;
        // options inserted via a triple don't have _ractive
        option.selected = arrayContains( value, optionValue );
      }
    };
  }( arrayContains, isArray );

  /* virtualdom/items/Element/Attribute/prototype/update/updateRadioName.js */
  var virtualdom_items_Element_Attribute$update_updateRadioName = function Attribute$updateRadioName() {
    var node = ( value = this ).node,
      value = value.value;
    node.checked = value == node._ractive.value;
  };

  /* virtualdom/items/Element/Attribute/prototype/update/updateRadioValue.js */
  var virtualdom_items_Element_Attribute$update_updateRadioValue = function( runloop ) {

    return function Attribute$updateRadioValue() {
      var wasChecked, node = this.node,
        binding, bindings, i;
      wasChecked = node.checked;
      node.value = this.element.getAttribute( 'value' );
      node.checked = this.element.getAttribute( 'value' ) === this.element.getAttribute( 'name' );
      // This is a special case - if the input was checked, and the value
      // changed so that it's no longer checked, the twoway binding is
      // most likely out of date. To fix it we have to jump through some
      // hoops... this is a little kludgy but it works
      if ( wasChecked && !node.checked && this.element.binding ) {
        bindings = this.element.binding.siblings;
        if ( i = bindings.length ) {
          while ( i-- ) {
            binding = bindings[ i ];
            if ( !binding.element.node ) {
              // this is the initial render, siblings are still rendering!
              // we'll come back later...
              return;
            }
            if ( binding.element.node.checked ) {
              runloop.addViewmodel( binding.root.viewmodel );
              return binding.handleChange();
            }
          }
          runloop.addViewmodel( binding.root.viewmodel );
          this.root.viewmodel.set( binding.keypath, undefined );
        }
      }
    };
  }( runloop );

  /* virtualdom/items/Element/Attribute/prototype/update/updateCheckboxName.js */
  var virtualdom_items_Element_Attribute$update_updateCheckboxName = function( isArray ) {

    return function Attribute$updateCheckboxName() {
      var element = ( value = this ).element,
        node = value.node,
        value = value.value,
        valueAttribute, i;
      valueAttribute = element.getAttribute( 'value' );
      if ( !isArray( value ) ) {
        node.checked = value == valueAttribute;
      } else {
        i = value.length;
        while ( i-- ) {
          if ( valueAttribute == value[ i ] ) {
            node.checked = true;
            return;
          }
        }
        node.checked = false;
      }
    };
  }( isArray );

  /* virtualdom/items/Element/Attribute/prototype/update/updateClassName.js */
  var virtualdom_items_Element_Attribute$update_updateClassName = function Attribute$updateClassName() {
    var node, value;
    node = this.node;
    value = this.value;
    if ( value === undefined ) {
      value = '';
    }
    node.className = value;
  };

  /* virtualdom/items/Element/Attribute/prototype/update/updateIdAttribute.js */
  var virtualdom_items_Element_Attribute$update_updateIdAttribute = function Attribute$updateIdAttribute() {
    var node = ( value = this ).node,
      value = value.value;
    this.root.nodes[ value ] = node;
    node.id = value;
  };

  /* virtualdom/items/Element/Attribute/prototype/update/updateIEStyleAttribute.js */
  var virtualdom_items_Element_Attribute$update_updateIEStyleAttribute = function Attribute$updateIEStyleAttribute() {
    var node, value;
    node = this.node;
    value = this.value;
    if ( value === undefined ) {
      value = '';
    }
    node.style.setAttribute( 'cssText', value );
  };

  /* virtualdom/items/Element/Attribute/prototype/update/updateContentEditableValue.js */
  var virtualdom_items_Element_Attribute$update_updateContentEditableValue = function Attribute$updateContentEditableValue() {
    var value = this.value;
    if ( value === undefined ) {
      value = '';
    }
    if ( !this.locked ) {
      this.node.innerHTML = value;
    }
  };

  /* virtualdom/items/Element/Attribute/prototype/update/updateValue.js */
  var virtualdom_items_Element_Attribute$update_updateValue = function Attribute$updateValue() {
    var node = ( value = this ).node,
      value = value.value;
    // store actual value, so it doesn't get coerced to a string
    node._ractive.value = value;
    // with two-way binding, only update if the change wasn't initiated by the user
    // otherwise the cursor will often be sent to the wrong place
    if ( !this.locked ) {
      node.value = value == undefined ? '' : value;
    }
  };

  /* virtualdom/items/Element/Attribute/prototype/update/updateBoolean.js */
  var virtualdom_items_Element_Attribute$update_updateBoolean = function Attribute$updateBooleanAttribute() {
    // with two-way binding, only update if the change wasn't initiated by the user
    // otherwise the cursor will often be sent to the wrong place
    if ( !this.locked ) {
      this.node[ this.propertyName ] = this.value;
    }
  };

  /* virtualdom/items/Element/Attribute/prototype/update/updateEverythingElse.js */
  var virtualdom_items_Element_Attribute$update_updateEverythingElse = function( booleanAttributes ) {

    return function Attribute$updateEverythingElse() {
      var node = ( fragment = this ).node,
        namespace = fragment.namespace,
        name = fragment.name,
        value = fragment.value,
        fragment = fragment.fragment;
      if ( namespace ) {
        node.setAttributeNS( namespace, name, ( fragment || value ).toString() );
      } else if ( !booleanAttributes.test( name ) ) {
        node.setAttribute( name, ( fragment || value ).toString() );
      } else {
        if ( value ) {
          node.setAttribute( name, '' );
        } else {
          node.removeAttribute( name );
        }
      }
    };
  }( booleanAttributes );

  /* virtualdom/items/Element/Attribute/prototype/update.js */
  var virtualdom_items_Element_Attribute$update = function( namespaces, noop, updateSelectValue, updateMultipleSelectValue, updateRadioName, updateRadioValue, updateCheckboxName, updateClassName, updateIdAttribute, updateIEStyleAttribute, updateContentEditableValue, updateValue, updateBoolean, updateEverythingElse ) {

    return function Attribute$update() {
      var name = ( node = this ).name,
        element = node.element,
        node = node.node,
        type, updateMethod;
      if ( name === 'id' ) {
        updateMethod = updateIdAttribute;
      } else if ( name === 'value' ) {
        // special case - selects
        if ( element.name === 'select' && name === 'value' ) {
          updateMethod = element.getAttribute( 'multiple' ) ? updateMultipleSelectValue : updateSelectValue;
        } else if ( element.name === 'textarea' ) {
          updateMethod = updateValue;
        } else if ( element.getAttribute( 'contenteditable' ) != null ) {
          updateMethod = updateContentEditableValue;
        } else if ( element.name === 'input' ) {
          type = element.getAttribute( 'type' );
          // type='file' value='{{fileList}}'>
          if ( type === 'file' ) {
            updateMethod = noop;
          } else if ( type === 'radio' && element.binding && element.binding.name === 'name' ) {
            updateMethod = updateRadioValue;
          } else {
            updateMethod = updateValue;
          }
        }
      } else if ( this.twoway && name === 'name' ) {
        if ( node.type === 'radio' ) {
          updateMethod = updateRadioName;
        } else if ( node.type === 'checkbox' ) {
          updateMethod = updateCheckboxName;
        }
      } else if ( name === 'style' && node.style.setAttribute ) {
        updateMethod = updateIEStyleAttribute;
      } else if ( name === 'class' && ( !node.namespaceURI || node.namespaceURI === namespaces.html ) ) {
        updateMethod = updateClassName;
      } else if ( this.useProperty ) {
        updateMethod = updateBoolean;
      }
      if ( !updateMethod ) {
        updateMethod = updateEverythingElse;
      }
      this.update = updateMethod;
      this.update();
    };
  }( namespaces, noop, virtualdom_items_Element_Attribute$update_updateSelectValue, virtualdom_items_Element_Attribute$update_updateMultipleSelectValue, virtualdom_items_Element_Attribute$update_updateRadioName, virtualdom_items_Element_Attribute$update_updateRadioValue, virtualdom_items_Element_Attribute$update_updateCheckboxName, virtualdom_items_Element_Attribute$update_updateClassName, virtualdom_items_Element_Attribute$update_updateIdAttribute, virtualdom_items_Element_Attribute$update_updateIEStyleAttribute, virtualdom_items_Element_Attribute$update_updateContentEditableValue, virtualdom_items_Element_Attribute$update_updateValue, virtualdom_items_Element_Attribute$update_updateBoolean, virtualdom_items_Element_Attribute$update_updateEverythingElse );

  /* virtualdom/items/Element/Attribute/_Attribute.js */
  var Attribute = function( bubble, init, rebind, render, toString, unbind, update ) {

    var Attribute = function( options ) {
      this.init( options );
    };
    Attribute.prototype = {
      bubble: bubble,
      init: init,
      rebind: rebind,
      render: render,
      toString: toString,
      unbind: unbind,
      update: update
    };
    return Attribute;
  }( virtualdom_items_Element_Attribute$bubble, virtualdom_items_Element_Attribute$init, virtualdom_items_Element_Attribute$rebind, virtualdom_items_Element_Attribute$render, virtualdom_items_Element_Attribute$toString, virtualdom_items_Element_Attribute$unbind, virtualdom_items_Element_Attribute$update );

  /* virtualdom/items/Element/prototype/init/createAttributes.js */
  var virtualdom_items_Element$init_createAttributes = function( Attribute ) {

    return function( element, attributes ) {
      var name, attribute, result = [];
      for ( name in attributes ) {
        if ( attributes.hasOwnProperty( name ) ) {
          attribute = new Attribute( {
            element: element,
            name: name,
            value: attributes[ name ],
            root: element.root
          } );
          result.push( result[ name ] = attribute );
        }
      }
      return result;
    };
  }( Attribute );

  /* virtualdom/items/Element/ConditionalAttribute/_ConditionalAttribute.js */
  var ConditionalAttribute = function( circular, namespaces, createElement, toArray ) {

    var __export;
    var Fragment, div;
    if ( typeof document !== 'undefined' ) {
      div = createElement( 'div' );
    }
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    var ConditionalAttribute = function( element, template ) {
      this.element = element;
      this.root = element.root;
      this.parentFragment = element.parentFragment;
      this.attributes = [];
      this.fragment = new Fragment( {
        root: element.root,
        owner: this,
        template: [ template ]
      } );
    };
    ConditionalAttribute.prototype = {
      bubble: function() {
        if ( this.node ) {
          this.update();
        }
        this.element.bubble();
      },
      rebind: function( indexRef, newIndex, oldKeypath, newKeypath ) {
        this.fragment.rebind( indexRef, newIndex, oldKeypath, newKeypath );
      },
      render: function( node ) {
        this.node = node;
        this.isSvg = node.namespaceURI === namespaces.svg;
        this.update();
      },
      unbind: function() {
        this.fragment.unbind();
      },
      update: function() {
        var this$0 = this;
        var str, attrs;
        str = this.fragment.toString();
        attrs = parseAttributes( str, this.isSvg );
        // any attributes that previously existed but no longer do
        // must be removed
        this.attributes.filter( function( a ) {
          return notIn( attrs, a );
        } ).forEach( function( a ) {
          this$0.node.removeAttribute( a.name );
        } );
        attrs.forEach( function( a ) {
          this$0.node.setAttribute( a.name, a.value );
        } );
        this.attributes = attrs;
      },
      toString: function() {
        return this.fragment.toString();
      }
    };
    __export = ConditionalAttribute;

    function parseAttributes( str, isSvg ) {
      var tag = isSvg ? 'svg' : 'div';
      div.innerHTML = '<' + tag + ' ' + str + '></' + tag + '>';
      return toArray( div.childNodes[ 0 ].attributes );
    }

    function notIn( haystack, needle ) {
      var i = haystack.length;
      while ( i-- ) {
        if ( haystack[ i ].name === needle.name ) {
          return false;
        }
      }
      return true;
    }
    return __export;
  }( circular, namespaces, createElement, toArray );

  /* virtualdom/items/Element/prototype/init/createConditionalAttributes.js */
  var virtualdom_items_Element$init_createConditionalAttributes = function( ConditionalAttribute ) {

    return function( element, attributes ) {
      if ( !attributes ) {
        return [];
      }
      return attributes.map( function( a ) {
        return new ConditionalAttribute( element, a );
      } );
    };
  }( ConditionalAttribute );

  /* utils/extend.js */
  var extend = function( target ) {
    var SLICE$0 = Array.prototype.slice;
    var sources = SLICE$0.call( arguments, 1 );
    var prop, source;
    while ( source = sources.shift() ) {
      for ( prop in source ) {
        if ( source.hasOwnProperty( prop ) ) {
          target[ prop ] = source[ prop ];
        }
      }
    }
    return target;
  };

  /* virtualdom/items/Element/Binding/Binding.js */
  var Binding = function( runloop, warn, create, extend, removeFromArray ) {

    var Binding = function( element ) {
      var interpolator, keypath, value;
      this.element = element;
      this.root = element.root;
      this.attribute = element.attributes[ this.name || 'value' ];
      interpolator = this.attribute.interpolator;
      interpolator.twowayBinding = this;
      if ( interpolator.keypath && interpolator.keypath.substr( 0, 2 ) === '${' ) {
        warn( 'Two-way binding does not work with expressions (`' + interpolator.keypath.slice( 2, -1 ) + '`)' );
        return false;
      }
      // A mustache may be *ambiguous*. Let's say we were given
      // `value="{{bar}}"`. If the context was `foo`, and `foo.bar`
      // *wasn't* `undefined`, the keypath would be `foo.bar`.
      // Then, any user input would result in `foo.bar` being updated.
      //
      // If, however, `foo.bar` *was* undefined, and so was `bar`, we would be
      // left with an unresolved partial keypath - so we are forced to make an
      // assumption. That assumption is that the input in question should
      // be forced to resolve to `bar`, and any user input would affect `bar`
      // and not `foo.bar`.
      //
      // Did that make any sense? No? Oh. Sorry. Well the moral of the story is
      // be explicit when using two-way data-binding about what keypath you're
      // updating. Using it in lists is probably a recipe for confusion...
      if ( !interpolator.keypath ) {
        interpolator.resolver.forceResolution();
      }
      this.keypath = keypath = interpolator.keypath;
      // initialise value, if it's undefined
      if ( this.root.viewmodel.get( keypath ) === undefined && this.getInitialValue ) {
        value = this.getInitialValue();
        if ( value !== undefined ) {
          this.root.viewmodel.set( keypath, value );
        }
      }
    };
    Binding.prototype = {
      handleChange: function() {
        var this$0 = this;
        runloop.start( this.root );
        this.attribute.locked = true;
        this.root.viewmodel.set( this.keypath, this.getValue() );
        runloop.scheduleTask( function() {
          return this$0.attribute.locked = false;
        } );
        runloop.end();
      },
      rebound: function() {
        var bindings, oldKeypath, newKeypath;
        oldKeypath = this.keypath;
        newKeypath = this.attribute.interpolator.keypath;
        // The attribute this binding is linked to has already done the work
        if ( oldKeypath === newKeypath ) {
          return;
        }
        removeFromArray( this.root._twowayBindings[ oldKeypath ], this );
        this.keypath = newKeypath;
        bindings = this.root._twowayBindings[ newKeypath ] || ( this.root._twowayBindings[ newKeypath ] = [] );
        bindings.push( this );
      },
      unbind: function() {}
    };
    Binding.extend = function( properties ) {
      var Parent = this,
        SpecialisedBinding;
      SpecialisedBinding = function( element ) {
        Binding.call( this, element );
        if ( this.init ) {
          this.init();
        }
      };
      SpecialisedBinding.prototype = create( Parent.prototype );
      extend( SpecialisedBinding.prototype, properties );
      SpecialisedBinding.extend = Binding.extend;
      return SpecialisedBinding;
    };
    return Binding;
  }( runloop, warn, create, extend, removeFromArray );

  /* virtualdom/items/Element/Binding/shared/handleDomEvent.js */
  var handleDomEvent = function handleChange() {
    this._ractive.binding.handleChange();
  };

  /* virtualdom/items/Element/Binding/ContentEditableBinding.js */
  var ContentEditableBinding = function( Binding, handleDomEvent ) {

    var ContentEditableBinding = Binding.extend( {
      getInitialValue: function() {
        return this.element.fragment ? this.element.fragment.toString() : '';
      },
      render: function() {
        var node = this.element.node;
        node.addEventListener( 'change', handleDomEvent, false );
        if ( !this.root.lazy ) {
          node.addEventListener( 'input', handleDomEvent, false );
          if ( node.attachEvent ) {
            node.addEventListener( 'keyup', handleDomEvent, false );
          }
        }
      },
      unrender: function() {
        var node = this.element.node;
        node.removeEventListener( 'change', handleDomEvent, false );
        node.removeEventListener( 'input', handleDomEvent, false );
        node.removeEventListener( 'keyup', handleDomEvent, false );
      },
      getValue: function() {
        return this.element.node.innerHTML;
      }
    } );
    return ContentEditableBinding;
  }( Binding, handleDomEvent );

  /* virtualdom/items/Element/Binding/shared/getSiblings.js */
  var getSiblings = function() {

    var sets = {};
    return function getSiblings( id, group, keypath ) {
      var hash = id + group + keypath;
      return sets[ hash ] || ( sets[ hash ] = [] );
    };
  }();

  /* virtualdom/items/Element/Binding/RadioBinding.js */
  var RadioBinding = function( runloop, removeFromArray, Binding, getSiblings, handleDomEvent ) {

    var RadioBinding = Binding.extend( {
      name: 'checked',
      init: function() {
        this.siblings = getSiblings( this.root._guid, 'radio', this.element.getAttribute( 'name' ) );
        this.siblings.push( this );
      },
      render: function() {
        var node = this.element.node;
        node.addEventListener( 'change', handleDomEvent, false );
        if ( node.attachEvent ) {
          node.addEventListener( 'click', handleDomEvent, false );
        }
      },
      unrender: function() {
        var node = this.element.node;
        node.removeEventListener( 'change', handleDomEvent, false );
        node.removeEventListener( 'click', handleDomEvent, false );
      },
      handleChange: function() {
        runloop.start( this.root );
        this.siblings.forEach( function( binding ) {
          binding.root.viewmodel.set( binding.keypath, binding.getValue() );
        } );
        runloop.end();
      },
      getValue: function() {
        return this.element.node.checked;
      },
      unbind: function() {
        removeFromArray( this.siblings, this );
      }
    } );
    return RadioBinding;
  }( runloop, removeFromArray, Binding, getSiblings, handleDomEvent );

  /* virtualdom/items/Element/Binding/RadioNameBinding.js */
  var RadioNameBinding = function( removeFromArray, Binding, handleDomEvent, getSiblings ) {

    var RadioNameBinding = Binding.extend( {
      name: 'name',
      init: function() {
        this.siblings = getSiblings( this.root._guid, 'radioname', this.keypath );
        this.siblings.push( this );
        this.radioName = true;
        // so that ractive.updateModel() knows what to do with this
        this.attribute.twoway = true;
      },
      getInitialValue: function() {
        if ( this.element.getAttribute( 'checked' ) ) {
          return this.element.getAttribute( 'value' );
        }
      },
      render: function() {
        var node = this.element.node;
        node.name = '{{' + this.keypath + '}}';
        node.checked = this.root.viewmodel.get( this.keypath ) == this.element.getAttribute( 'value' );
        node.addEventListener( 'change', handleDomEvent, false );
        if ( node.attachEvent ) {
          node.addEventListener( 'click', handleDomEvent, false );
        }
      },
      unrender: function() {
        var node = this.element.node;
        node.removeEventListener( 'change', handleDomEvent, false );
        node.removeEventListener( 'click', handleDomEvent, false );
      },
      getValue: function() {
        var node = this.element.node;
        return node._ractive ? node._ractive.value : node.value;
      },
      handleChange: function() {
        // If this <input> is the one that's checked, then the value of its
        // `name` keypath gets set to its value
        if ( this.element.node.checked ) {
          Binding.prototype.handleChange.call( this );
        }
      },
      rebound: function( indexRef, newIndex, oldKeypath, newKeypath ) {
        var node;
        Binding.prototype.rebound.call( this, indexRef, newIndex, oldKeypath, newKeypath );
        if ( node = this.element.node ) {
          node.name = '{{' + this.keypath + '}}';
        }
      },
      unbind: function() {
        removeFromArray( this.siblings, this );
      }
    } );
    return RadioNameBinding;
  }( removeFromArray, Binding, handleDomEvent, getSiblings );

  /* virtualdom/items/Element/Binding/CheckboxNameBinding.js */
  var CheckboxNameBinding = function( isArray, arrayContains, removeFromArray, Binding, getSiblings, handleDomEvent ) {

    var CheckboxNameBinding = Binding.extend( {
      name: 'name',
      getInitialValue: function() {
        // This only gets called once per group (of inputs that
        // share a name), because it only gets called if there
        // isn't an initial value. By the same token, we can make
        // a note of that fact that there was no initial value,
        // and populate it using any `checked` attributes that
        // exist (which users should avoid, but which we should
        // support anyway to avoid breaking expectations)
        this.noInitialValue = true;
        return [];
      },
      init: function() {
        var existingValue, bindingValue;
        this.checkboxName = true;
        // so that ractive.updateModel() knows what to do with this
        this.attribute.twoway = true;
        // we set this property so that the attribute gets the correct update method
        // Each input has a reference to an array containing it and its
        // siblings, as two-way binding depends on being able to ascertain
        // the status of all inputs within the group
        this.siblings = getSiblings( this.root._guid, 'checkboxes', this.keypath );
        this.siblings.push( this );
        if ( this.noInitialValue ) {
          this.siblings.noInitialValue = true;
        }
        // If no initial value was set, and this input is checked, we
        // update the model
        if ( this.siblings.noInitialValue && this.element.getAttribute( 'checked' ) ) {
          existingValue = this.root.viewmodel.get( this.keypath );
          bindingValue = this.element.getAttribute( 'value' );
          existingValue.push( bindingValue );
        }
      },
      unbind: function() {
        removeFromArray( this.siblings, this );
      },
      render: function() {
        var node = this.element.node,
          existingValue, bindingValue;
        existingValue = this.root.viewmodel.get( this.keypath );
        bindingValue = this.element.getAttribute( 'value' );
        if ( isArray( existingValue ) ) {
          this.isChecked = arrayContains( existingValue, bindingValue );
        } else {
          this.isChecked = existingValue == bindingValue;
        }
        node.name = '{{' + this.keypath + '}}';
        node.checked = this.isChecked;
        node.addEventListener( 'change', handleDomEvent, false );
        // in case of IE emergency, bind to click event as well
        if ( node.attachEvent ) {
          node.addEventListener( 'click', handleDomEvent, false );
        }
      },
      unrender: function() {
        var node = this.element.node;
        node.removeEventListener( 'change', handleDomEvent, false );
        node.removeEventListener( 'click', handleDomEvent, false );
      },
      changed: function() {
        var wasChecked = !!this.isChecked;
        this.isChecked = this.element.node.checked;
        return this.isChecked === wasChecked;
      },
      handleChange: function() {
        this.isChecked = this.element.node.checked;
        Binding.prototype.handleChange.call( this );
      },
      getValue: function() {
        return this.siblings.filter( isChecked ).map( getValue );
      }
    } );

    function isChecked( binding ) {
      return binding.isChecked;
    }

    function getValue( binding ) {
      return binding.element.getAttribute( 'value' );
    }
    return CheckboxNameBinding;
  }( isArray, arrayContains, removeFromArray, Binding, getSiblings, handleDomEvent );

  /* virtualdom/items/Element/Binding/CheckboxBinding.js */
  var CheckboxBinding = function( Binding, handleDomEvent ) {

    var CheckboxBinding = Binding.extend( {
      name: 'checked',
      render: function() {
        var node = this.element.node;
        node.addEventListener( 'change', handleDomEvent, false );
        if ( node.attachEvent ) {
          node.addEventListener( 'click', handleDomEvent, false );
        }
      },
      unrender: function() {
        var node = this.element.node;
        node.removeEventListener( 'change', handleDomEvent, false );
        node.removeEventListener( 'click', handleDomEvent, false );
      },
      getValue: function() {
        return this.element.node.checked;
      }
    } );
    return CheckboxBinding;
  }( Binding, handleDomEvent );

  /* virtualdom/items/Element/Binding/SelectBinding.js */
  var SelectBinding = function( runloop, Binding, handleDomEvent ) {

    var SelectBinding = Binding.extend( {
      getInitialValue: function() {
        var options = this.element.options,
          len, i, value, optionWasSelected;
        if ( this.element.getAttribute( 'value' ) !== undefined ) {
          return;
        }
        i = len = options.length;
        if ( !len ) {
          return;
        }
        // take the final selected option...
        while ( i-- ) {
          if ( options[ i ].getAttribute( 'selected' ) ) {
            value = options[ i ].getAttribute( 'value' );
            optionWasSelected = true;
            break;
          }
        }
        // or the first non-disabled option, if none are selected
        if ( !optionWasSelected ) {
          while ( ++i < len ) {
            if ( !options[ i ].getAttribute( 'disabled' ) ) {
              value = options[ i ].getAttribute( 'value' );
              break;
            }
          }
        }
        // This is an optimisation (aka hack) that allows us to forgo some
        // other more expensive work
        if ( value !== undefined ) {
          this.element.attributes.value.value = value;
        }
        return value;
      },
      render: function() {
        this.element.node.addEventListener( 'change', handleDomEvent, false );
      },
      unrender: function() {
        this.element.node.removeEventListener( 'change', handleDomEvent, false );
      },
      // TODO this method is an anomaly... is it necessary?
      setValue: function( value ) {
        runloop.addViewmodel( this.root.viewmodel );
        this.root.viewmodel.set( this.keypath, value );
      },
      getValue: function() {
        var options, i, len, option, optionValue;
        options = this.element.node.options;
        len = options.length;
        for ( i = 0; i < len; i += 1 ) {
          option = options[ i ];
          if ( options[ i ].selected ) {
            optionValue = option._ractive ? option._ractive.value : option.value;
            return optionValue;
          }
        }
      },
      forceUpdate: function() {
        var this$0 = this;
        var value = this.getValue();
        if ( value !== undefined ) {
          this.attribute.locked = true;
          runloop.addViewmodel( this.root.viewmodel );
          runloop.scheduleTask( function() {
            return this$0.attribute.locked = false;
          } );
          this.root.viewmodel.set( this.keypath, value );
        }
      }
    } );
    return SelectBinding;
  }( runloop, Binding, handleDomEvent );

  /* utils/arrayContentsMatch.js */
  var arrayContentsMatch = function( isArray ) {

    return function( a, b ) {
      var i;
      if ( !isArray( a ) || !isArray( b ) ) {
        return false;
      }
      if ( a.length !== b.length ) {
        return false;
      }
      i = a.length;
      while ( i-- ) {
        if ( a[ i ] !== b[ i ] ) {
          return false;
        }
      }
      return true;
    };
  }( isArray );

  /* virtualdom/items/Element/Binding/MultipleSelectBinding.js */
  var MultipleSelectBinding = function( runloop, arrayContentsMatch, SelectBinding, handleDomEvent ) {

    var MultipleSelectBinding = SelectBinding.extend( {
      getInitialValue: function() {
        return this.element.options.filter( function( option ) {
          return option.getAttribute( 'selected' );
        } ).map( function( option ) {
          return option.getAttribute( 'value' );
        } );
      },
      render: function() {
        var valueFromModel;
        this.element.node.addEventListener( 'change', handleDomEvent, false );
        valueFromModel = this.root.viewmodel.get( this.keypath );
        if ( valueFromModel === undefined ) {
          // get value from DOM, if possible
          this.handleChange();
        }
      },
      unrender: function() {
        this.element.node.removeEventListener( 'change', handleDomEvent, false );
      },
      setValue: function() {
        throw new Error( 'TODO not implemented yet' );
      },
      getValue: function() {
        var selectedValues, options, i, len, option, optionValue;
        selectedValues = [];
        options = this.element.node.options;
        len = options.length;
        for ( i = 0; i < len; i += 1 ) {
          option = options[ i ];
          if ( option.selected ) {
            optionValue = option._ractive ? option._ractive.value : option.value;
            selectedValues.push( optionValue );
          }
        }
        return selectedValues;
      },
      handleChange: function() {
        var attribute, previousValue, value;
        attribute = this.attribute;
        previousValue = attribute.value;
        value = this.getValue();
        if ( previousValue === undefined || !arrayContentsMatch( value, previousValue ) ) {
          SelectBinding.prototype.handleChange.call( this );
        }
        return this;
      },
      forceUpdate: function() {
        var this$0 = this;
        var value = this.getValue();
        if ( value !== undefined ) {
          this.attribute.locked = true;
          runloop.addViewmodel( this.root.viewmodel );
          runloop.scheduleTask( function() {
            return this$0.attribute.locked = false;
          } );
          this.root.viewmodel.set( this.keypath, value );
        }
      },
      updateModel: function() {
        if ( this.attribute.value === undefined || !this.attribute.value.length ) {
          this.root.viewmodel.set( this.keypath, this.initialValue );
        }
      }
    } );
    return MultipleSelectBinding;
  }( runloop, arrayContentsMatch, SelectBinding, handleDomEvent );

  /* virtualdom/items/Element/Binding/FileListBinding.js */
  var FileListBinding = function( Binding, handleDomEvent ) {

    var FileListBinding = Binding.extend( {
      render: function() {
        this.element.node.addEventListener( 'change', handleDomEvent, false );
      },
      unrender: function() {
        this.element.node.removeEventListener( 'change', handleDomEvent, false );
      },
      getValue: function() {
        return this.element.node.files;
      }
    } );
    return FileListBinding;
  }( Binding, handleDomEvent );

  /* virtualdom/items/Element/Binding/GenericBinding.js */
  var GenericBinding = function( Binding, handleDomEvent ) {

    var __export;
    var GenericBinding, getOptions;
    getOptions = {
      evaluateWrapped: true
    };
    GenericBinding = Binding.extend( {
      getInitialValue: function() {
        return '';
      },
      getValue: function() {
        return this.element.node.value;
      },
      render: function() {
        var node = this.element.node;
        node.addEventListener( 'change', handleDomEvent, false );
        if ( !this.root.lazy ) {
          node.addEventListener( 'input', handleDomEvent, false );
          if ( node.attachEvent ) {
            node.addEventListener( 'keyup', handleDomEvent, false );
          }
        }
        node.addEventListener( 'blur', handleBlur, false );
      },
      unrender: function() {
        var node = this.element.node;
        node.removeEventListener( 'change', handleDomEvent, false );
        node.removeEventListener( 'input', handleDomEvent, false );
        node.removeEventListener( 'keyup', handleDomEvent, false );
        node.removeEventListener( 'blur', handleBlur, false );
      }
    } );
    __export = GenericBinding;

    function handleBlur() {
      var value;
      handleDomEvent.call( this );
      value = this._ractive.root.viewmodel.get( this._ractive.binding.keypath, getOptions );
      this.value = value == undefined ? '' : value;
    }
    return __export;
  }( Binding, handleDomEvent );

  /* virtualdom/items/Element/Binding/NumericBinding.js */
  var NumericBinding = function( GenericBinding ) {

    return GenericBinding.extend( {
      getInitialValue: function() {
        return undefined;
      },
      getValue: function() {
        var value = parseFloat( this.element.node.value );
        return isNaN( value ) ? undefined : value;
      }
    } );
  }( GenericBinding );

  /* virtualdom/items/Element/prototype/init/createTwowayBinding.js */
  var virtualdom_items_Element$init_createTwowayBinding = function( log, ContentEditableBinding, RadioBinding, RadioNameBinding, CheckboxNameBinding, CheckboxBinding, SelectBinding, MultipleSelectBinding, FileListBinding, NumericBinding, GenericBinding ) {

    var __export;
    __export = function createTwowayBinding( element ) {
      var attributes = element.attributes,
        type, Binding, bindName, bindChecked;
      // if this is a late binding, and there's already one, it
      // needs to be torn down
      if ( element.binding ) {
        element.binding.teardown();
        element.binding = null;
      }
      // contenteditable
      if ( // if the contenteditable attribute is true or is bindable and may thus become true
        ( element.getAttribute( 'contenteditable' ) || !!attributes.contenteditable && isBindable( attributes.contenteditable ) ) && isBindable( attributes.value ) ) {
        Binding = ContentEditableBinding;
      } else if ( element.name === 'input' ) {
        type = element.getAttribute( 'type' );
        if ( type === 'radio' || type === 'checkbox' ) {
          bindName = isBindable( attributes.name );
          bindChecked = isBindable( attributes.checked );
          // we can either bind the name attribute, or the checked attribute - not both
          if ( bindName && bindChecked ) {
            log.error( {
              message: 'badRadioInputBinding'
            } );
          }
          if ( bindName ) {
            Binding = type === 'radio' ? RadioNameBinding : CheckboxNameBinding;
          } else if ( bindChecked ) {
            Binding = type === 'radio' ? RadioBinding : CheckboxBinding;
          }
        } else if ( type === 'file' && isBindable( attributes.value ) ) {
          Binding = FileListBinding;
        } else if ( isBindable( attributes.value ) ) {
          Binding = type === 'number' || type === 'range' ? NumericBinding : GenericBinding;
        }
      } else if ( element.name === 'select' && isBindable( attributes.value ) ) {
        Binding = element.getAttribute( 'multiple' ) ? MultipleSelectBinding : SelectBinding;
      } else if ( element.name === 'textarea' && isBindable( attributes.value ) ) {
        Binding = GenericBinding;
      }
      if ( Binding ) {
        return new Binding( element );
      }
    };

    function isBindable( attribute ) {
      return attribute && attribute.isBindable;
    }
    return __export;
  }( log, ContentEditableBinding, RadioBinding, RadioNameBinding, CheckboxNameBinding, CheckboxBinding, SelectBinding, MultipleSelectBinding, FileListBinding, NumericBinding, GenericBinding );

  /* virtualdom/items/Element/EventHandler/prototype/bubble.js */
  var virtualdom_items_Element_EventHandler$bubble = function EventHandler$bubble() {
    var hasAction = this.getAction();
    if ( hasAction && !this.hasListener ) {
      this.listen();
    } else if ( !hasAction && this.hasListener ) {
      this.unrender();
    }
  };

  /* virtualdom/items/Element/EventHandler/prototype/fire.js */
  var virtualdom_items_Element_EventHandler$fire = function( fireEvent ) {

    return function EventHandler$fire( event ) {
      fireEvent( this.root, this.getAction(), {
        event: event
      } );
    };
  }( Ractive$shared_fireEvent );

  /* virtualdom/items/Element/EventHandler/prototype/getAction.js */
  var virtualdom_items_Element_EventHandler$getAction = function EventHandler$getAction() {
    return this.action.toString().trim();
  };

  /* virtualdom/items/Element/EventHandler/prototype/init.js */
  var virtualdom_items_Element_EventHandler$init = function( getFunctionFromString, createReferenceResolver, circular, fireEvent, log ) {

    var __export;
    var Fragment, getValueOptions = {
        args: true
      },
      eventPattern = /^event(?:\.(.+))?/;
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    __export = function EventHandler$init( element, name, template ) {
      var handler = this,
        action, refs, ractive;
      handler.element = element;
      handler.root = element.root;
      handler.name = name;
      if ( name.indexOf( '*' ) !== -1 ) {
        log.error( {
          debug: this.root.debug,
          message: 'noElementProxyEventWildcards',
          args: {
            element: element.tagName,
            event: name
          }
        } );
        this.invalid = true;
      }
      if ( template.m ) {
        refs = template.a.r;
        // This is a method call
        handler.method = template.m;
        handler.keypaths = [];
        handler.fn = getFunctionFromString( template.a.s, refs.length );
        handler.parentFragment = element.parentFragment;
        ractive = handler.root;
        // Create resolvers for each reference
        handler.refResolvers = refs.map( function( ref, i ) {
          var match;
          // special case - the `event` object
          if ( match = eventPattern.exec( ref ) ) {
            handler.keypaths[ i ] = {
              eventObject: true,
              refinements: match[ 1 ] ? match[ 1 ].split( '.' ) : []
            };
            return null;
          }
          return createReferenceResolver( handler, ref, function( keypath ) {
            handler.resolve( i, keypath );
          } );
        } );
        this.fire = fireMethodCall;
      } else {
        // Get action ('foo' in 'on-click='foo')
        action = template.n || template;
        if ( typeof action !== 'string' ) {
          action = new Fragment( {
            template: action,
            root: this.root,
            owner: this
          } );
        }
        this.action = action;
        // Get parameters
        if ( template.d ) {
          this.dynamicParams = new Fragment( {
            template: template.d,
            root: this.root,
            owner: this.element
          } );
          this.fire = fireEventWithDynamicParams;
        } else if ( template.a ) {
          this.params = template.a;
          this.fire = fireEventWithParams;
        }
      }
    };

    function fireMethodCall( event ) {
      var ractive, values, args;
      ractive = this.root;
      if ( typeof ractive[ this.method ] !== 'function' ) {
        throw new Error( 'Attempted to call a non-existent method ("' + this.method + '")' );
      }
      values = this.keypaths.map( function( keypath ) {
        var value, len, i;
        if ( keypath === undefined ) {
          // not yet resolved
          return undefined;
        }
        // TODO the refinements stuff would be better handled at parse time
        if ( keypath.eventObject ) {
          value = event;
          if ( len = keypath.refinements.length ) {
            for ( i = 0; i < len; i += 1 ) {
              value = value[ keypath.refinements[ i ] ];
            }
          }
        } else {
          value = ractive.viewmodel.get( keypath );
        }
        return value;
      } );
      ractive.event = event;
      args = this.fn.apply( null, values );
      ractive[ this.method ].apply( ractive, args );
      delete ractive.event;
    }

    function fireEventWithParams( event ) {
      fireEvent( this.root, this.getAction(), {
        event: event,
        args: this.params
      } );
    }

    function fireEventWithDynamicParams( event ) {
      var args = this.dynamicParams.getValue( getValueOptions );
      // need to strip [] from ends if a string!
      if ( typeof args === 'string' ) {
        args = args.substr( 1, args.length - 2 );
      }
      fireEvent( this.root, this.getAction(), {
        event: event,
        args: args
      } );
    }
    return __export;
  }( getFunctionFromString, createReferenceResolver, circular, Ractive$shared_fireEvent, log );

  /* virtualdom/items/Element/EventHandler/shared/genericHandler.js */
  var genericHandler = function genericHandler( event ) {
    var storage, handler;
    storage = this._ractive;
    handler = storage.events[ event.type ];
    handler.fire( {
      node: this,
      original: event,
      index: storage.index,
      keypath: storage.keypath,
      context: storage.root.get( storage.keypath )
    } );
  };

  /* virtualdom/items/Element/EventHandler/prototype/listen.js */
  var virtualdom_items_Element_EventHandler$listen = function( config, genericHandler, log ) {

    var __export;
    var customHandlers = {},
      touchEvents = {
        touchstart: true,
        touchmove: true,
        touchend: true,
        touchcancel: true,
        //not w3c, but supported in some browsers
        touchleave: true
      };
    __export = function EventHandler$listen() {
      var definition, name = this.name;
      if ( this.invalid ) {
        return;
      }
      if ( definition = config.registries.events.find( this.root, name ) ) {
        this.custom = definition( this.node, getCustomHandler( name ) );
      } else {
        // Looks like we're dealing with a standard DOM event... but let's check
        if ( !( 'on' + name in this.node ) && !( window && 'on' + name in window ) ) {
          // okay to use touch events if this browser doesn't support them
          if ( !touchEvents[ name ] ) {
            log.error( {
              debug: this.root.debug,
              message: 'missingPlugin',
              args: {
                plugin: 'event',
                name: name
              }
            } );
          }
          return;
        }
        this.node.addEventListener( name, genericHandler, false );
      }
      this.hasListener = true;
    };

    function getCustomHandler( name ) {
      if ( !customHandlers[ name ] ) {
        customHandlers[ name ] = function( event ) {
          var storage = event.node._ractive;
          event.index = storage.index;
          event.keypath = storage.keypath;
          event.context = storage.root.get( storage.keypath );
          storage.events[ name ].fire( event );
        };
      }
      return customHandlers[ name ];
    }
    return __export;
  }( config, genericHandler, log );

  /* virtualdom/items/Element/EventHandler/prototype/rebind.js */
  var virtualdom_items_Element_EventHandler$rebind = function EventHandler$rebind( indexRef, newIndex, oldKeypath, newKeypath ) {
    var fragment;
    if ( this.method ) {
      fragment = this.element.parentFragment;
      this.refResolvers.forEach( rebind );
      return;
    }
    if ( typeof this.action !== 'string' ) {
      rebind( this.action );
    }
    if ( this.dynamicParams ) {
      rebind( this.dynamicParams );
    }

    function rebind( thing ) {
      thing && thing.rebind( indexRef, newIndex, oldKeypath, newKeypath );
    }
  };

  /* virtualdom/items/Element/EventHandler/prototype/render.js */
  var virtualdom_items_Element_EventHandler$render = function EventHandler$render() {
    this.node = this.element.node;
    // store this on the node itself, so it can be retrieved by a
    // universal handler
    this.node._ractive.events[ this.name ] = this;
    if ( this.method || this.getAction() ) {
      this.listen();
    }
  };

  /* virtualdom/items/Element/EventHandler/prototype/resolve.js */
  var virtualdom_items_Element_EventHandler$resolve = function EventHandler$resolve( index, keypath ) {
    this.keypaths[ index ] = keypath;
  };

  /* virtualdom/items/Element/EventHandler/prototype/unbind.js */
  var virtualdom_items_Element_EventHandler$unbind = function() {

    var __export;
    __export = function EventHandler$unbind() {
      if ( this.method ) {
        this.refResolvers.forEach( unbind );
        return;
      }
      // Tear down dynamic name
      if ( typeof this.action !== 'string' ) {
        this.action.unbind();
      }
      // Tear down dynamic parameters
      if ( this.dynamicParams ) {
        this.dynamicParams.unbind();
      }
    };

    function unbind( x ) {
      x.unbind();
    }
    return __export;
  }();

  /* virtualdom/items/Element/EventHandler/prototype/unrender.js */
  var virtualdom_items_Element_EventHandler$unrender = function( genericHandler ) {

    return function EventHandler$unrender() {
      if ( this.custom ) {
        this.custom.teardown();
      } else {
        this.node.removeEventListener( this.name, genericHandler, false );
      }
      this.hasListener = false;
    };
  }( genericHandler );

  /* virtualdom/items/Element/EventHandler/_EventHandler.js */
  var EventHandler = function( bubble, fire, getAction, init, listen, rebind, render, resolve, unbind, unrender ) {

    var EventHandler = function( element, name, template ) {
      this.init( element, name, template );
    };
    EventHandler.prototype = {
      bubble: bubble,
      fire: fire,
      getAction: getAction,
      init: init,
      listen: listen,
      rebind: rebind,
      render: render,
      resolve: resolve,
      unbind: unbind,
      unrender: unrender
    };
    return EventHandler;
  }( virtualdom_items_Element_EventHandler$bubble, virtualdom_items_Element_EventHandler$fire, virtualdom_items_Element_EventHandler$getAction, virtualdom_items_Element_EventHandler$init, virtualdom_items_Element_EventHandler$listen, virtualdom_items_Element_EventHandler$rebind, virtualdom_items_Element_EventHandler$render, virtualdom_items_Element_EventHandler$resolve, virtualdom_items_Element_EventHandler$unbind, virtualdom_items_Element_EventHandler$unrender );

  /* virtualdom/items/Element/prototype/init/createEventHandlers.js */
  var virtualdom_items_Element$init_createEventHandlers = function( EventHandler ) {

    return function( element, template ) {
      var i, name, names, handler, result = [];
      for ( name in template ) {
        if ( template.hasOwnProperty( name ) ) {
          names = name.split( '-' );
          i = names.length;
          while ( i-- ) {
            handler = new EventHandler( element, names[ i ], template[ name ] );
            result.push( handler );
          }
        }
      }
      return result;
    };
  }( EventHandler );

  /* virtualdom/items/Element/Decorator/_Decorator.js */
  var Decorator = function( log, circular, config ) {

    var Fragment, getValueOptions, Decorator;
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    getValueOptions = {
      args: true
    };
    Decorator = function( element, template ) {
      var decorator = this,
        ractive, name, fragment;
      decorator.element = element;
      decorator.root = ractive = element.root;
      name = template.n || template;
      if ( typeof name !== 'string' ) {
        fragment = new Fragment( {
          template: name,
          root: ractive,
          owner: element
        } );
        name = fragment.toString();
        fragment.unbind();
      }
      if ( template.a ) {
        decorator.params = template.a;
      } else if ( template.d ) {
        decorator.fragment = new Fragment( {
          template: template.d,
          root: ractive,
          owner: element
        } );
        decorator.params = decorator.fragment.getValue( getValueOptions );
        decorator.fragment.bubble = function() {
          this.dirtyArgs = this.dirtyValue = true;
          decorator.params = this.getValue( getValueOptions );
          if ( decorator.ready ) {
            decorator.update();
          }
        };
      }
      decorator.fn = config.registries.decorators.find( ractive, name );
      if ( !decorator.fn ) {
        log.error( {
          debug: ractive.debug,
          message: 'missingPlugin',
          args: {
            plugin: 'decorator',
            name: name
          }
        } );
      }
    };
    Decorator.prototype = {
      init: function() {
        var decorator = this,
          node, result, args;
        node = decorator.element.node;
        if ( decorator.params ) {
          args = [ node ].concat( decorator.params );
          result = decorator.fn.apply( decorator.root, args );
        } else {
          result = decorator.fn.call( decorator.root, node );
        }
        if ( !result || !result.teardown ) {
          throw new Error( 'Decorator definition must return an object with a teardown method' );
        }
        // TODO does this make sense?
        decorator.actual = result;
        decorator.ready = true;
      },
      update: function() {
        if ( this.actual.update ) {
          this.actual.update.apply( this.root, this.params );
        } else {
          this.actual.teardown( true );
          this.init();
        }
      },
      rebind: function( indexRef, newIndex, oldKeypath, newKeypath ) {
        if ( this.fragment ) {
          this.fragment.rebind( indexRef, newIndex, oldKeypath, newKeypath );
        }
      },
      teardown: function( updating ) {
        this.actual.teardown();
        if ( !updating && this.fragment ) {
          this.fragment.unbind();
        }
      }
    };
    return Decorator;
  }( log, circular, config );

  /* virtualdom/items/Element/special/select/sync.js */
  var sync = function( toArray ) {

    var __export;
    __export = function syncSelect( selectElement ) {
      var selectNode, selectValue, isMultiple, options, optionWasSelected;
      selectNode = selectElement.node;
      if ( !selectNode ) {
        return;
      }
      options = toArray( selectNode.options );
      selectValue = selectElement.getAttribute( 'value' );
      isMultiple = selectElement.getAttribute( 'multiple' );
      // If the <select> has a specified value, that should override
      // these options
      if ( selectValue !== undefined ) {
        options.forEach( function( o ) {
          var optionValue, shouldSelect;
          optionValue = o._ractive ? o._ractive.value : o.value;
          shouldSelect = isMultiple ? valueContains( selectValue, optionValue ) : selectValue == optionValue;
          if ( shouldSelect ) {
            optionWasSelected = true;
          }
          o.selected = shouldSelect;
        } );
        if ( !optionWasSelected ) {
          if ( options[ 0 ] ) {
            options[ 0 ].selected = true;
          }
          if ( selectElement.binding ) {
            selectElement.binding.forceUpdate();
          }
        }
      } else if ( selectElement.binding ) {
        selectElement.binding.forceUpdate();
      }
    };

    function valueContains( selectValue, optionValue ) {
      var i = selectValue.length;
      while ( i-- ) {
        if ( selectValue[ i ] == optionValue ) {
          return true;
        }
      }
    }
    return __export;
  }( toArray );

  /* virtualdom/items/Element/special/select/bubble.js */
  var bubble = function( runloop, syncSelect ) {

    return function bubbleSelect() {
      var this$0 = this;
      if ( !this.dirty ) {
        this.dirty = true;
        runloop.scheduleTask( function() {
          syncSelect( this$0 );
          this$0.dirty = false;
        } );
      }
      this.parentFragment.bubble();
    };
  }( runloop, sync );

  /* virtualdom/items/Element/special/option/findParentSelect.js */
  var findParentSelect = function findParentSelect( element ) {
    do {
      if ( element.name === 'select' ) {
        return element;
      }
    } while ( element = element.parent );
  };

  /* virtualdom/items/Element/special/option/init.js */
  var init = function( findParentSelect ) {

    return function initOption( option, template ) {
      option.select = findParentSelect( option.parent );
      // we might be inside a <datalist> element
      if ( !option.select ) {
        return;
      }
      option.select.options.push( option );
      // If the value attribute is missing, use the element's content
      if ( !template.a ) {
        template.a = {};
      }
      // ...as long as it isn't disabled
      if ( template.a.value === undefined && !template.a.hasOwnProperty( 'disabled' ) ) {
        template.a.value = template.f;
      }
      // If there is a `selected` attribute, but the <select>
      // already has a value, delete it
      if ( 'selected' in template.a && option.select.getAttribute( 'value' ) !== undefined ) {
        delete template.a.selected;
      }
    };
  }( findParentSelect );

  /* virtualdom/items/Element/prototype/init.js */
  var virtualdom_items_Element$init = function( types, enforceCase, createAttributes, createConditionalAttributes, createTwowayBinding, createEventHandlers, Decorator, bubbleSelect, initOption, circular ) {

    var Fragment;
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    return function Element$init( options ) {
      var parentFragment, template, ractive, binding, bindings;
      this.type = types.ELEMENT;
      // stuff we'll need later
      parentFragment = this.parentFragment = options.parentFragment;
      template = this.template = options.template;
      this.parent = options.pElement || parentFragment.pElement;
      this.root = ractive = parentFragment.root;
      this.index = options.index;
      this.name = enforceCase( template.e );
      // Special case - <option> elements
      if ( this.name === 'option' ) {
        initOption( this, template );
      }
      // Special case - <select> elements
      if ( this.name === 'select' ) {
        this.options = [];
        this.bubble = bubbleSelect;
      }
      // create attributes
      this.attributes = createAttributes( this, template.a );
      this.conditionalAttributes = createConditionalAttributes( this, template.m );
      // append children, if there are any
      if ( template.f ) {
        this.fragment = new Fragment( {
          template: template.f,
          root: ractive,
          owner: this,
          pElement: this
        } );
      }
      // create twoway binding
      if ( ractive.twoway && ( binding = createTwowayBinding( this, template.a ) ) ) {
        this.binding = binding;
        // register this with the root, so that we can do ractive.updateModel()
        bindings = this.root._twowayBindings[ binding.keypath ] || ( this.root._twowayBindings[ binding.keypath ] = [] );
        bindings.push( binding );
      }
      // create event proxies
      if ( template.v ) {
        this.eventHandlers = createEventHandlers( this, template.v );
      }
      // create decorator
      if ( template.o ) {
        this.decorator = new Decorator( this, template.o );
      }
      // create transitions
      this.intro = template.t0 || template.t1;
      this.outro = template.t0 || template.t2;
    };
  }( types, enforceCase, virtualdom_items_Element$init_createAttributes, virtualdom_items_Element$init_createConditionalAttributes, virtualdom_items_Element$init_createTwowayBinding, virtualdom_items_Element$init_createEventHandlers, Decorator, bubble, init, circular );

  /* virtualdom/items/shared/utils/startsWith.js */
  var startsWith = function( startsWithKeypath ) {

    return function startsWith( target, keypath ) {
      return target === keypath || startsWithKeypath( target, keypath );
    };
  }( startsWithKeypath );

  /* virtualdom/items/shared/utils/assignNewKeypath.js */
  var assignNewKeypath = function( startsWith, getNewKeypath ) {

    return function assignNewKeypath( target, property, oldKeypath, newKeypath ) {
      var existingKeypath = target[ property ];
      if ( !existingKeypath || startsWith( existingKeypath, newKeypath ) || !startsWith( existingKeypath, oldKeypath ) ) {
        return;
      }
      target[ property ] = getNewKeypath( existingKeypath, oldKeypath, newKeypath );
    };
  }( startsWith, getNewKeypath );

  /* virtualdom/items/Element/prototype/rebind.js */
  var virtualdom_items_Element$rebind = function( assignNewKeypath ) {

    return function Element$rebind( indexRef, newIndex, oldKeypath, newKeypath ) {
      var i, storage, liveQueries, ractive;
      if ( this.attributes ) {
        this.attributes.forEach( rebind );
      }
      if ( this.conditionalAttributes ) {
        this.conditionalAttributes.forEach( rebind );
      }
      if ( this.eventHandlers ) {
        this.eventHandlers.forEach( rebind );
      }
      if ( this.decorator ) {
        rebind( this.decorator );
      }
      // rebind children
      if ( this.fragment ) {
        rebind( this.fragment );
      }
      // Update live queries, if necessary
      if ( liveQueries = this.liveQueries ) {
        ractive = this.root;
        i = liveQueries.length;
        while ( i-- ) {
          liveQueries[ i ]._makeDirty();
        }
      }
      if ( this.node && ( storage = this.node._ractive ) ) {
        // adjust keypath if needed
        assignNewKeypath( storage, 'keypath', oldKeypath, newKeypath );
        if ( indexRef != undefined ) {
          storage.index[ indexRef ] = newIndex;
        }
      }

      function rebind( thing ) {
        thing.rebind( indexRef, newIndex, oldKeypath, newKeypath );
      }
    };
  }( assignNewKeypath );

  /* virtualdom/items/Element/special/img/render.js */
  var render = function renderImage( img ) {
    var loadHandler;
    // if this is an <img>, and we're in a crap browser, we may need to prevent it
    // from overriding width and height when it loads the src
    if ( img.attributes.width || img.attributes.height ) {
      img.node.addEventListener( 'load', loadHandler = function() {
        var width = img.getAttribute( 'width' ),
          height = img.getAttribute( 'height' );
        if ( width !== undefined ) {
          img.node.setAttribute( 'width', width );
        }
        if ( height !== undefined ) {
          img.node.setAttribute( 'height', height );
        }
        img.node.removeEventListener( 'load', loadHandler, false );
      }, false );
    }
  };

  /* virtualdom/items/Element/Transition/prototype/init.js */
  var virtualdom_items_Element_Transition$init = function( log, config, circular ) {

    var Fragment, getValueOptions = {};
    // TODO what are the options?
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    return function Transition$init( element, template, isIntro ) {
      var t = this,
        ractive, name, fragment;
      t.element = element;
      t.root = ractive = element.root;
      t.isIntro = isIntro;
      name = template.n || template;
      if ( typeof name !== 'string' ) {
        fragment = new Fragment( {
          template: name,
          root: ractive,
          owner: element
        } );
        name = fragment.toString();
        fragment.unbind();
      }
      t.name = name;
      if ( template.a ) {
        t.params = template.a;
      } else if ( template.d ) {
        // TODO is there a way to interpret dynamic arguments without all the
        // 'dependency thrashing'?
        fragment = new Fragment( {
          template: template.d,
          root: ractive,
          owner: element
        } );
        t.params = fragment.getValue( getValueOptions );
        fragment.unbind();
      }
      t._fn = config.registries.transitions.find( ractive, name );
      if ( !t._fn ) {
        log.error( {
          debug: ractive.debug,
          message: 'missingPlugin',
          args: {
            plugin: 'transition',
            name: name
          }
        } );
        return;
      }
    };
  }( log, config, circular );

  /* utils/camelCase.js */
  var camelCase = function( hyphenatedStr ) {
    return hyphenatedStr.replace( /-([a-zA-Z])/g, function( match, $1 ) {
      return $1.toUpperCase();
    } );
  };

  /* virtualdom/items/Element/Transition/helpers/prefix.js */
  var prefix = function( isClient, vendors, createElement, camelCase ) {

    var prefix, prefixCache, testStyle;
    if ( !isClient ) {
      prefix = null;
    } else {
      prefixCache = {};
      testStyle = createElement( 'div' ).style;
      prefix = function( prop ) {
        var i, vendor, capped;
        prop = camelCase( prop );
        if ( !prefixCache[ prop ] ) {
          if ( testStyle[ prop ] !== undefined ) {
            prefixCache[ prop ] = prop;
          } else {
            // test vendors...
            capped = prop.charAt( 0 ).toUpperCase() + prop.substring( 1 );
            i = vendors.length;
            while ( i-- ) {
              vendor = vendors[ i ];
              if ( testStyle[ vendor + capped ] !== undefined ) {
                prefixCache[ prop ] = vendor + capped;
                break;
              }
            }
          }
        }
        return prefixCache[ prop ];
      };
    }
    return prefix;
  }( isClient, vendors, createElement, camelCase );

  /* virtualdom/items/Element/Transition/prototype/getStyle.js */
  var virtualdom_items_Element_Transition$getStyle = function( legacy, isClient, isArray, prefix ) {

    var getStyle, getComputedStyle;
    if ( !isClient ) {
      getStyle = null;
    } else {
      getComputedStyle = window.getComputedStyle || legacy.getComputedStyle;
      getStyle = function( props ) {
        var computedStyle, styles, i, prop, value;
        computedStyle = getComputedStyle( this.node );
        if ( typeof props === 'string' ) {
          value = computedStyle[ prefix( props ) ];
          if ( value === '0px' ) {
            value = 0;
          }
          return value;
        }
        if ( !isArray( props ) ) {
          throw new Error( 'Transition$getStyle must be passed a string, or an array of strings representing CSS properties' );
        }
        styles = {};
        i = props.length;
        while ( i-- ) {
          prop = props[ i ];
          value = computedStyle[ prefix( prop ) ];
          if ( value === '0px' ) {
            value = 0;
          }
          styles[ prop ] = value;
        }
        return styles;
      };
    }
    return getStyle;
  }( legacy, isClient, isArray, prefix );

  /* virtualdom/items/Element/Transition/prototype/setStyle.js */
  var virtualdom_items_Element_Transition$setStyle = function( prefix ) {

    return function( style, value ) {
      var prop;
      if ( typeof style === 'string' ) {
        this.node.style[ prefix( style ) ] = value;
      } else {
        for ( prop in style ) {
          if ( style.hasOwnProperty( prop ) ) {
            this.node.style[ prefix( prop ) ] = style[ prop ];
          }
        }
      }
      return this;
    };
  }( prefix );

  /* shared/Ticker.js */
  var Ticker = function( warn, getTime, animations ) {

    var __export;
    var Ticker = function( options ) {
      var easing;
      this.duration = options.duration;
      this.step = options.step;
      this.complete = options.complete;
      // easing
      if ( typeof options.easing === 'string' ) {
        easing = options.root.easing[ options.easing ];
        if ( !easing ) {
          warn( 'Missing easing function ("' + options.easing + '"). You may need to download a plugin from [TODO]' );
          easing = linear;
        }
      } else if ( typeof options.easing === 'function' ) {
        easing = options.easing;
      } else {
        easing = linear;
      }
      this.easing = easing;
      this.start = getTime();
      this.end = this.start + this.duration;
      this.running = true;
      animations.add( this );
    };
    Ticker.prototype = {
      tick: function( now ) {
        var elapsed, eased;
        if ( !this.running ) {
          return false;
        }
        if ( now > this.end ) {
          if ( this.step ) {
            this.step( 1 );
          }
          if ( this.complete ) {
            this.complete( 1 );
          }
          return false;
        }
        elapsed = now - this.start;
        eased = this.easing( elapsed / this.duration );
        if ( this.step ) {
          this.step( eased );
        }
        return true;
      },
      stop: function() {
        if ( this.abort ) {
          this.abort();
        }
        this.running = false;
      }
    };
    __export = Ticker;

    function linear( t ) {
      return t;
    }
    return __export;
  }( warn, getTime, animations );

  /* virtualdom/items/Element/Transition/helpers/unprefix.js */
  var unprefix = function( vendors ) {

    var unprefixPattern = new RegExp( '^-(?:' + vendors.join( '|' ) + ')-' );
    return function( prop ) {
      return prop.replace( unprefixPattern, '' );
    };
  }( vendors );

  /* virtualdom/items/Element/Transition/helpers/hyphenate.js */
  var hyphenate = function( vendors ) {

    var vendorPattern = new RegExp( '^(?:' + vendors.join( '|' ) + ')([A-Z])' );
    return function( str ) {
      var hyphenated;
      if ( !str ) {
        return '';
      }
      if ( vendorPattern.test( str ) ) {
        str = '-' + str;
      }
      hyphenated = str.replace( /[A-Z]/g, function( match ) {
        return '-' + match.toLowerCase();
      } );
      return hyphenated;
    };
  }( vendors );

  /* virtualdom/items/Element/Transition/prototype/animateStyle/createTransitions.js */
  var virtualdom_items_Element_Transition$animateStyle_createTransitions = function( isClient, warn, createElement, camelCase, interpolate, Ticker, prefix, unprefix, hyphenate ) {

    var createTransitions, testStyle, TRANSITION, TRANSITIONEND, CSS_TRANSITIONS_ENABLED, TRANSITION_DURATION, TRANSITION_PROPERTY, TRANSITION_TIMING_FUNCTION, canUseCssTransitions = {},
      cannotUseCssTransitions = {};
    if ( !isClient ) {
      createTransitions = null;
    } else {
      testStyle = createElement( 'div' ).style;
      // determine some facts about our environment
      ( function() {
        if ( testStyle.transition !== undefined ) {
          TRANSITION = 'transition';
          TRANSITIONEND = 'transitionend';
          CSS_TRANSITIONS_ENABLED = true;
        } else if ( testStyle.webkitTransition !== undefined ) {
          TRANSITION = 'webkitTransition';
          TRANSITIONEND = 'webkitTransitionEnd';
          CSS_TRANSITIONS_ENABLED = true;
        } else {
          CSS_TRANSITIONS_ENABLED = false;
        }
      }() );
      if ( TRANSITION ) {
        TRANSITION_DURATION = TRANSITION + 'Duration';
        TRANSITION_PROPERTY = TRANSITION + 'Property';
        TRANSITION_TIMING_FUNCTION = TRANSITION + 'TimingFunction';
      }
      createTransitions = function( t, to, options, changedProperties, resolve ) {
        // Wait a beat (otherwise the target styles will be applied immediately)
        // TODO use a fastdom-style mechanism?
        setTimeout( function() {
          var hashPrefix, jsTransitionsComplete, cssTransitionsComplete, checkComplete, transitionEndHandler;
          checkComplete = function() {
            if ( jsTransitionsComplete && cssTransitionsComplete ) {
              // will changes to events and fire have an unexpected consequence here?
              t.root.fire( t.name + ':end', t.node, t.isIntro );
              resolve();
            }
          };
          // this is used to keep track of which elements can use CSS to animate
          // which properties
          hashPrefix = ( t.node.namespaceURI || '' ) + t.node.tagName;
          t.node.style[ TRANSITION_PROPERTY ] = changedProperties.map( prefix ).map( hyphenate ).join( ',' );
          t.node.style[ TRANSITION_TIMING_FUNCTION ] = hyphenate( options.easing || 'linear' );
          t.node.style[ TRANSITION_DURATION ] = options.duration / 1000 + 's';
          transitionEndHandler = function( event ) {
            var index;
            index = changedProperties.indexOf( camelCase( unprefix( event.propertyName ) ) );
            if ( index !== -1 ) {
              changedProperties.splice( index, 1 );
            }
            if ( changedProperties.length ) {
              // still transitioning...
              return;
            }
            t.node.removeEventListener( TRANSITIONEND, transitionEndHandler, false );
            cssTransitionsComplete = true;
            checkComplete();
          };
          t.node.addEventListener( TRANSITIONEND, transitionEndHandler, false );
          setTimeout( function() {
            var i = changedProperties.length,
              hash, originalValue, index, propertiesToTransitionInJs = [],
              prop, suffix;
            while ( i-- ) {
              prop = changedProperties[ i ];
              hash = hashPrefix + prop;
              if ( CSS_TRANSITIONS_ENABLED && !cannotUseCssTransitions[ hash ] ) {
                t.node.style[ prefix( prop ) ] = to[ prop ];
                // If we're not sure if CSS transitions are supported for
                // this tag/property combo, find out now
                if ( !canUseCssTransitions[ hash ] ) {
                  originalValue = t.getStyle( prop );
                  // if this property is transitionable in this browser,
                  // the current style will be different from the target style
                  canUseCssTransitions[ hash ] = t.getStyle( prop ) != to[ prop ];
                  cannotUseCssTransitions[ hash ] = !canUseCssTransitions[ hash ];
                  // Reset, if we're going to use timers after all
                  if ( cannotUseCssTransitions[ hash ] ) {
                    t.node.style[ prefix( prop ) ] = originalValue;
                  }
                }
              }
              if ( !CSS_TRANSITIONS_ENABLED || cannotUseCssTransitions[ hash ] ) {
                // we need to fall back to timer-based stuff
                if ( originalValue === undefined ) {
                  originalValue = t.getStyle( prop );
                }
                // need to remove this from changedProperties, otherwise transitionEndHandler
                // will get confused
                index = changedProperties.indexOf( prop );
                if ( index === -1 ) {
                  warn( 'Something very strange happened with transitions. If you see this message, please let @RactiveJS know. Thanks!' );
                } else {
                  changedProperties.splice( index, 1 );
                }
                // TODO Determine whether this property is animatable at all
                suffix = /[^\d]*$/.exec( to[ prop ] )[ 0 ];
                // ...then kick off a timer-based transition
                propertiesToTransitionInJs.push( {
                  name: prefix( prop ),
                  interpolator: interpolate( parseFloat( originalValue ), parseFloat( to[ prop ] ) ),
                  suffix: suffix
                } );
              }
            }
            // javascript transitions
            if ( propertiesToTransitionInJs.length ) {
              new Ticker( {
                root: t.root,
                duration: options.duration,
                easing: camelCase( options.easing || '' ),
                step: function( pos ) {
                  var prop, i;
                  i = propertiesToTransitionInJs.length;
                  while ( i-- ) {
                    prop = propertiesToTransitionInJs[ i ];
                    t.node.style[ prop.name ] = prop.interpolator( pos ) + prop.suffix;
                  }
                },
                complete: function() {
                  jsTransitionsComplete = true;
                  checkComplete();
                }
              } );
            } else {
              jsTransitionsComplete = true;
            }
            if ( !changedProperties.length ) {
              // We need to cancel the transitionEndHandler, and deal with
              // the fact that it will never fire
              t.node.removeEventListener( TRANSITIONEND, transitionEndHandler, false );
              cssTransitionsComplete = true;
              checkComplete();
            }
          }, 0 );
        }, options.delay || 0 );
      };
    }
    return createTransitions;
  }( isClient, warn, createElement, camelCase, interpolate, Ticker, prefix, unprefix, hyphenate );

  /* virtualdom/items/Element/Transition/prototype/animateStyle/visibility.js */
  var virtualdom_items_Element_Transition$animateStyle_visibility = function( vendors ) {

    var hidden, vendor, prefix, i, visibility;
    if ( typeof document !== 'undefined' ) {
      hidden = 'hidden';
      visibility = {};
      if ( hidden in document ) {
        prefix = '';
      } else {
        i = vendors.length;
        while ( i-- ) {
          vendor = vendors[ i ];
          hidden = vendor + 'Hidden';
          if ( hidden in document ) {
            prefix = vendor;
          }
        }
      }
      if ( prefix !== undefined ) {
        document.addEventListener( prefix + 'visibilitychange', onChange );
        // initialise
        onChange();
      } else {
        // gah, we're in an old browser
        if ( 'onfocusout' in document ) {
          document.addEventListener( 'focusout', onHide );
          document.addEventListener( 'focusin', onShow );
        } else {
          window.addEventListener( 'pagehide', onHide );
          window.addEventListener( 'blur', onHide );
          window.addEventListener( 'pageshow', onShow );
          window.addEventListener( 'focus', onShow );
        }
        visibility.hidden = false;
      }
    }

    function onChange() {
      visibility.hidden = document[ hidden ];
    }

    function onHide() {
      visibility.hidden = true;
    }

    function onShow() {
      visibility.hidden = false;
    }
    return visibility;
  }( vendors );

  /* virtualdom/items/Element/Transition/prototype/animateStyle/_animateStyle.js */
  var virtualdom_items_Element_Transition$animateStyle__animateStyle = function( legacy, isClient, warn, Promise, prefix, createTransitions, visibility ) {

    var animateStyle, getComputedStyle, resolved;
    if ( !isClient ) {
      animateStyle = null;
    } else {
      getComputedStyle = window.getComputedStyle || legacy.getComputedStyle;
      animateStyle = function( style, value, options, complete ) {
        var t = this,
          to;
        // Special case - page isn't visible. Don't animate anything, because
        // that way you'll never get CSS transitionend events
        if ( visibility.hidden ) {
          this.setStyle( style, value );
          return resolved || ( resolved = Promise.resolve() );
        }
        if ( typeof style === 'string' ) {
          to = {};
          to[ style ] = value;
        } else {
          to = style;
          // shuffle arguments
          complete = options;
          options = value;
        }
        // As of 0.3.9, transition authors should supply an `option` object with
        // `duration` and `easing` properties (and optional `delay`), plus a
        // callback function that gets called after the animation completes
        // TODO remove this check in a future version
        if ( !options ) {
          warn( 'The "' + t.name + '" transition does not supply an options object to `t.animateStyle()`. This will break in a future version of Ractive. For more info see https://github.com/RactiveJS/Ractive/issues/340' );
          options = t;
          complete = t.complete;
        }
        var promise = new Promise( function( resolve ) {
          var propertyNames, changedProperties, computedStyle, current, from, i, prop;
          // Edge case - if duration is zero, set style synchronously and complete
          if ( !options.duration ) {
            t.setStyle( to );
            resolve();
            return;
          }
          // Get a list of the properties we're animating
          propertyNames = Object.keys( to );
          changedProperties = [];
          // Store the current styles
          computedStyle = getComputedStyle( t.node );
          from = {};
          i = propertyNames.length;
          while ( i-- ) {
            prop = propertyNames[ i ];
            current = computedStyle[ prefix( prop ) ];
            if ( current === '0px' ) {
              current = 0;
            }
            // we need to know if we're actually changing anything
            if ( current != to[ prop ] ) {
              // use != instead of !==, so we can compare strings with numbers
              changedProperties.push( prop );
              // make the computed style explicit, so we can animate where
              // e.g. height='auto'
              t.node.style[ prefix( prop ) ] = current;
            }
          }
          // If we're not actually changing anything, the transitionend event
          // will never fire! So we complete early
          if ( !changedProperties.length ) {
            resolve();
            return;
          }
          createTransitions( t, to, options, changedProperties, resolve );
        } );
        // If a callback was supplied, do the honours
        // TODO remove this check in future
        if ( complete ) {
          warn( 't.animateStyle returns a Promise as of 0.4.0. Transition authors should do t.animateStyle(...).then(callback)' );
          promise.then( complete );
        }
        return promise;
      };
    }
    return animateStyle;
  }( legacy, isClient, warn, Promise, prefix, virtualdom_items_Element_Transition$animateStyle_createTransitions, virtualdom_items_Element_Transition$animateStyle_visibility );

  /* utils/fillGaps.js */
  var fillGaps = function( target ) {
    var SLICE$0 = Array.prototype.slice;
    var sources = SLICE$0.call( arguments, 1 );
    sources.forEach( function( s ) {
      for ( var key in s ) {
        if ( s.hasOwnProperty( key ) && !( key in target ) ) {
          target[ key ] = s[ key ];
        }
      }
    } );
    return target;
  };

  /* virtualdom/items/Element/Transition/prototype/processParams.js */
  var virtualdom_items_Element_Transition$processParams = function( fillGaps ) {

    return function( params, defaults ) {
      if ( typeof params === 'number' ) {
        params = {
          duration: params
        };
      } else if ( typeof params === 'string' ) {
        if ( params === 'slow' ) {
          params = {
            duration: 600
          };
        } else if ( params === 'fast' ) {
          params = {
            duration: 200
          };
        } else {
          params = {
            duration: 400
          };
        }
      } else if ( !params ) {
        params = {};
      }
      return fillGaps( {}, params, defaults );
    };
  }( fillGaps );

  /* virtualdom/items/Element/Transition/prototype/start.js */
  var virtualdom_items_Element_Transition$start = function() {

    var __export;
    __export = function Transition$start() {
      var t = this,
        node, originalStyle, completed;
      node = t.node = t.element.node;
      originalStyle = node.getAttribute( 'style' );
      // create t.complete() - we don't want this on the prototype,
      // because we don't want `this` silliness when passing it as
      // an argument
      t.complete = function( noReset ) {
        if ( completed ) {
          return;
        }
        if ( !noReset && t.isIntro ) {
          resetStyle( node, originalStyle );
        }
        node._ractive.transition = null;
        t._manager.remove( t );
        completed = true;
      };
      // If the transition function doesn't exist, abort
      if ( !t._fn ) {
        t.complete();
        return;
      }
      t._fn.apply( t.root, [ t ].concat( t.params ) );
    };

    function resetStyle( node, style ) {
      if ( style ) {
        node.setAttribute( 'style', style );
      } else {
        // Next line is necessary, to remove empty style attribute!
        // See http://stackoverflow.com/a/7167553
        node.getAttribute( 'style' );
        node.removeAttribute( 'style' );
      }
    }
    return __export;
  }();

  /* virtualdom/items/Element/Transition/_Transition.js */
  var Transition = function( init, getStyle, setStyle, animateStyle, processParams, start, circular ) {

    var Fragment, Transition;
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    Transition = function( owner, template, isIntro ) {
      this.init( owner, template, isIntro );
    };
    Transition.prototype = {
      init: init,
      start: start,
      getStyle: getStyle,
      setStyle: setStyle,
      animateStyle: animateStyle,
      processParams: processParams
    };
    return Transition;
  }( virtualdom_items_Element_Transition$init, virtualdom_items_Element_Transition$getStyle, virtualdom_items_Element_Transition$setStyle, virtualdom_items_Element_Transition$animateStyle__animateStyle, virtualdom_items_Element_Transition$processParams, virtualdom_items_Element_Transition$start, circular );

  /* virtualdom/items/Element/prototype/render.js */
  var virtualdom_items_Element$render = function( namespaces, isArray, warn, create, createElement, defineProperty, noop, runloop, getInnerContext, renderImage, Transition ) {

    var __export;
    var updateCss, updateScript;
    updateCss = function() {
      var node = this.node,
        content = this.fragment.toString( false );
      // IE8 has no styleSheet unless there's a type text/css
      if ( window && window.appearsToBeIELessEqual8 ) {
        node.type = 'text/css';
      }
      if ( node.styleSheet ) {
        node.styleSheet.cssText = content;
      } else {
        while ( node.hasChildNodes() ) {
          node.removeChild( node.firstChild );
        }
        node.appendChild( document.createTextNode( content ) );
      }
    };
    updateScript = function() {
      if ( !this.node.type || this.node.type === 'text/javascript' ) {
        warn( 'Script tag was updated. This does not cause the code to be re-evaluated!' );
      }
      this.node.text = this.fragment.toString( false );
    };
    __export = function Element$render() {
      var this$0 = this;
      var root = this.root,
        namespace, node;
      namespace = getNamespace( this );
      node = this.node = createElement( this.name, namespace );
      // Is this a top-level node of a component? If so, we may need to add
      // a data-rvcguid attribute, for CSS encapsulation
      // NOTE: css no longer copied to instance, so we check constructor.css -
      // we can enhance to handle instance, but this is more "correct" with current
      // functionality
      if ( root.constructor.css && this.parentFragment.getNode() === root.el ) {
        this.node.setAttribute( 'data-rvcguid', root.constructor._guid );
      }
      // Add _ractive property to the node - we use this object to store stuff
      // related to proxy events, two-way bindings etc
      defineProperty( this.node, '_ractive', {
        value: {
          proxy: this,
          keypath: getInnerContext( this.parentFragment ),
          index: this.parentFragment.indexRefs,
          events: create( null ),
          root: root
        }
      } );
      // Render attributes
      this.attributes.forEach( function( a ) {
        return a.render( node );
      } );
      this.conditionalAttributes.forEach( function( a ) {
        return a.render( node );
      } );
      // Render children
      if ( this.fragment ) {
        // Special case - <script> element
        if ( this.name === 'script' ) {
          this.bubble = updateScript;
          this.node.text = this.fragment.toString( false );
          // bypass warning initially
          this.fragment.unrender = noop;
        } else if ( this.name === 'style' ) {
          this.bubble = updateCss;
          this.bubble();
          this.fragment.unrender = noop;
        } else if ( this.binding && this.getAttribute( 'contenteditable' ) ) {
          this.fragment.unrender = noop;
        } else {
          this.node.appendChild( this.fragment.render() );
        }
      }
      // Add proxy event handlers
      if ( this.eventHandlers ) {
        this.eventHandlers.forEach( function( h ) {
          return h.render();
        } );
      }
      // deal with two-way bindings
      if ( this.binding ) {
        this.binding.render();
        this.node._ractive.binding = this.binding;
      }
      // Special case: if this is an <img>, and we're in a crap browser, we may
      // need to prevent it from overriding width and height when it loads the src
      if ( this.name === 'img' ) {
        renderImage( this );
      }
      // apply decorator(s)
      if ( this.decorator && this.decorator.fn ) {
        runloop.scheduleTask( function() {
          return this$0.decorator.init();
        }, true );
      }
      // trigger intro transition
      if ( root.transitionsEnabled && this.intro ) {
        var transition = new Transition( this, this.intro, true );
        runloop.registerTransition( transition );
        runloop.scheduleTask( function() {
          return transition.start();
        }, true );
        this.transition = transition;
      }
      if ( this.name === 'option' ) {
        processOption( this );
      }
      if ( this.node.autofocus ) {
        // Special case. Some browsers (*cough* Firefix *cough*) have a problem
        // with dynamically-generated elements having autofocus, and they won't
        // allow you to programmatically focus the element until it's in the DOM
        runloop.scheduleTask( function() {
          return this$0.node.focus();
        }, true );
      }
      updateLiveQueries( this );
      return this.node;
    };

    function getNamespace( element ) {
      var namespace, xmlns, parent;
      // Use specified namespace...
      if ( xmlns = element.getAttribute( 'xmlns' ) ) {
        namespace = xmlns;
      } else if ( element.name === 'svg' ) {
        namespace = namespaces.svg;
      } else if ( parent = element.parent ) {
        // ...or HTML, if the parent is a <foreignObject>
        if ( parent.name === 'foreignObject' ) {
          namespace = namespaces.html;
        } else {
          namespace = parent.node.namespaceURI;
        }
      } else {
        namespace = element.root.el.namespaceURI;
      }
      return namespace;
    }

    function processOption( option ) {
      var optionValue, selectValue, i;
      if ( !option.select ) {
        return;
      }
      selectValue = option.select.getAttribute( 'value' );
      if ( selectValue === undefined ) {
        return;
      }
      optionValue = option.getAttribute( 'value' );
      if ( option.select.node.multiple && isArray( selectValue ) ) {
        i = selectValue.length;
        while ( i-- ) {
          if ( optionValue == selectValue[ i ] ) {
            option.node.selected = true;
            break;
          }
        }
      } else {
        option.node.selected = optionValue == selectValue;
      }
    }

    function updateLiveQueries( element ) {
      var instance, liveQueries, i, selector, query;
      // Does this need to be added to any live queries?
      instance = element.root;
      do {
        liveQueries = instance._liveQueries;
        i = liveQueries.length;
        while ( i-- ) {
          selector = liveQueries[ i ];
          query = liveQueries[ '_' + selector ];
          if ( query._test( element ) ) {
            // keep register of applicable selectors, for when we teardown
            ( element.liveQueries || ( element.liveQueries = [] ) ).push( query );
          }
        }
      } while ( instance = instance._parent );
    }
    return __export;
  }( namespaces, isArray, warn, create, createElement, defineProperty, noop, runloop, getInnerContext, render, Transition );

  /* virtualdom/items/Element/prototype/toString.js */
  var virtualdom_items_Element$toString = function( voidElementNames, isArray, escapeHtml ) {

    var __export;
    __export = function() {
      var str, escape;
      str = '<' + ( this.template.y ? '!DOCTYPE' : this.template.e );
      str += this.attributes.map( stringifyAttribute ).join( '' ) + this.conditionalAttributes.map( stringifyAttribute ).join( '' );
      // Special case - selected options
      if ( this.name === 'option' && optionIsSelected( this ) ) {
        str += ' selected';
      }
      // Special case - two-way radio name bindings
      if ( this.name === 'input' && inputIsCheckedRadio( this ) ) {
        str += ' checked';
      }
      str += '>';
      // Special case - textarea
      if ( this.name === 'textarea' && this.getAttribute( 'value' ) !== undefined ) {
        str += escapeHtml( this.getAttribute( 'value' ) );
      } else if ( this.getAttribute( 'contenteditable' ) !== undefined ) {
        str += this.getAttribute( 'value' );
      }
      if ( this.fragment ) {
        escape = this.name !== 'script' && this.name !== 'style';
        str += this.fragment.toString( escape );
      }
      // add a closing tag if this isn't a void element
      if ( !voidElementNames.test( this.template.e ) ) {
        str += '</' + this.template.e + '>';
      }
      return str;
    };

    function optionIsSelected( element ) {
      var optionValue, selectValue, i;
      optionValue = element.getAttribute( 'value' );
      if ( optionValue === undefined || !element.select ) {
        return false;
      }
      selectValue = element.select.getAttribute( 'value' );
      if ( selectValue == optionValue ) {
        return true;
      }
      if ( element.select.getAttribute( 'multiple' ) && isArray( selectValue ) ) {
        i = selectValue.length;
        while ( i-- ) {
          if ( selectValue[ i ] == optionValue ) {
            return true;
          }
        }
      }
    }

    function inputIsCheckedRadio( element ) {
      var attributes, typeAttribute, valueAttribute, nameAttribute;
      attributes = element.attributes;
      typeAttribute = attributes.type;
      valueAttribute = attributes.value;
      nameAttribute = attributes.name;
      if ( !typeAttribute || typeAttribute.value !== 'radio' || !valueAttribute || !nameAttribute.interpolator ) {
        return;
      }
      if ( valueAttribute.value === nameAttribute.interpolator.value ) {
        return true;
      }
    }

    function stringifyAttribute( attribute ) {
      var str = attribute.toString();
      return str ? ' ' + str : '';
    }
    return __export;
  }( voidElementNames, isArray, escapeHtml );

  /* virtualdom/items/Element/special/option/unbind.js */
  var virtualdom_items_Element_special_option_unbind = function( removeFromArray ) {

    return function unbindOption( option ) {
      if ( option.select ) {
        removeFromArray( option.select.options, option );
      }
    };
  }( removeFromArray );

  /* virtualdom/items/Element/prototype/unbind.js */
  var virtualdom_items_Element$unbind = function( unbindOption ) {

    var __export;
    __export = function Element$unbind() {
      if ( this.fragment ) {
        this.fragment.unbind();
      }
      if ( this.binding ) {
        this.binding.unbind();
      }
      if ( this.eventHandlers ) {
        this.eventHandlers.forEach( unbind );
      }
      // Special case - <option>
      if ( this.name === 'option' ) {
        unbindOption( this );
      }
      this.attributes.forEach( unbind );
      this.conditionalAttributes.forEach( unbind );
    };

    function unbind( x ) {
      x.unbind();
    }
    return __export;
  }( virtualdom_items_Element_special_option_unbind );

  /* virtualdom/items/Element/prototype/unrender.js */
  var virtualdom_items_Element$unrender = function( runloop, Transition ) {

    var __export;
    __export = function Element$unrender( shouldDestroy ) {
      var binding, bindings;
      if ( this.transition ) {
        this.transition.complete();
      }
      // Detach as soon as we can
      if ( this.name === 'option' ) {
        // <option> elements detach immediately, so that
        // their parent <select> element syncs correctly, and
        // since option elements can't have transitions anyway
        this.detach();
      } else if ( shouldDestroy ) {
        runloop.detachWhenReady( this );
      }
      // Children first. that way, any transitions on child elements will be
      // handled by the current transitionManager
      if ( this.fragment ) {
        this.fragment.unrender( false );
      }
      if ( binding = this.binding ) {
        this.binding.unrender();
        this.node._ractive.binding = null;
        bindings = this.root._twowayBindings[ binding.keypath ];
        bindings.splice( bindings.indexOf( binding ), 1 );
      }
      // Remove event handlers
      if ( this.eventHandlers ) {
        this.eventHandlers.forEach( function( h ) {
          return h.unrender();
        } );
      }
      if ( this.decorator ) {
        this.decorator.teardown();
      }
      // trigger outro transition if necessary
      if ( this.root.transitionsEnabled && this.outro ) {
        var transition = new Transition( this, this.outro, false );
        runloop.registerTransition( transition );
        runloop.scheduleTask( function() {
          return transition.start();
        } );
      }
      // Remove this node from any live queries
      if ( this.liveQueries ) {
        removeFromLiveQueries( this );
      }
    };

    function removeFromLiveQueries( element ) {
      var query, selector, i;
      i = element.liveQueries.length;
      while ( i-- ) {
        query = element.liveQueries[ i ];
        selector = query.selector;
        query._remove( element.node );
      }
    }
    return __export;
  }( runloop, Transition );

  /* virtualdom/items/Element/_Element.js */
  var Element = function( bubble, detach, find, findAll, findAllComponents, findComponent, findNextNode, firstNode, getAttribute, init, rebind, render, toString, unbind, unrender ) {

    var Element = function( options ) {
      this.init( options );
    };
    Element.prototype = {
      bubble: bubble,
      detach: detach,
      find: find,
      findAll: findAll,
      findAllComponents: findAllComponents,
      findComponent: findComponent,
      findNextNode: findNextNode,
      firstNode: firstNode,
      getAttribute: getAttribute,
      init: init,
      rebind: rebind,
      render: render,
      toString: toString,
      unbind: unbind,
      unrender: unrender
    };
    return Element;
  }( virtualdom_items_Element$bubble, virtualdom_items_Element$detach, virtualdom_items_Element$find, virtualdom_items_Element$findAll, virtualdom_items_Element$findAllComponents, virtualdom_items_Element$findComponent, virtualdom_items_Element$findNextNode, virtualdom_items_Element$firstNode, virtualdom_items_Element$getAttribute, virtualdom_items_Element$init, virtualdom_items_Element$rebind, virtualdom_items_Element$render, virtualdom_items_Element$toString, virtualdom_items_Element$unbind, virtualdom_items_Element$unrender );

  /* virtualdom/items/Partial/deIndent.js */
  var deIndent = function() {

    var __export;
    var empty = /^\s*$/,
      leadingWhitespace = /^\s*/;
    __export = function( str ) {
      var lines, firstLine, lastLine, minIndent;
      lines = str.split( '\n' );
      // remove first and last line, if they only contain whitespace
      firstLine = lines[ 0 ];
      if ( firstLine !== undefined && empty.test( firstLine ) ) {
        lines.shift();
      }
      lastLine = lines[ lines.length - 1 ];
      if ( lastLine !== undefined && empty.test( lastLine ) ) {
        lines.pop();
      }
      minIndent = lines.reduce( reducer, null );
      if ( minIndent ) {
        str = lines.map( function( line ) {
          return line.replace( minIndent, '' );
        } ).join( '\n' );
      }
      return str;
    };

    function reducer( previous, line ) {
      var lineIndent = leadingWhitespace.exec( line )[ 0 ];
      if ( previous === null || lineIndent.length < previous.length ) {
        return lineIndent;
      }
      return previous;
    }
    return __export;
  }();

  /* virtualdom/items/Partial/getPartialTemplate.js */
  var getPartialTemplate = function( log, config, parser, deIndent ) {

    var __export;
    __export = function getPartialTemplate( ractive, name ) {
      var partial;
      // If the partial in instance or view heirarchy instances, great
      if ( partial = getPartialFromRegistry( ractive, name ) ) {
        return partial;
      }
      // Does it exist on the page as a script tag?
      partial = parser.fromId( name, {
        noThrow: true
      } );
      if ( partial ) {
        // is this necessary?
        partial = deIndent( partial );
        // parse and register to this ractive instance
        var parsed = parser.parse( partial, parser.getParseOptions( ractive ) );
        // register (and return main partial if there are others in the template)
        return ractive.partials[ name ] = parsed.t;
      }
    };

    function getPartialFromRegistry( ractive, name ) {
      var partials = config.registries.partials;
      // find first instance in the ractive or view hierarchy that has this partial
      var instance = partials.findInstance( ractive, name );
      if ( !instance ) {
        return;
      }
      var partial = instance.partials[ name ],
        fn;
      // partial is a function?
      if ( typeof partial === 'function' ) {
        fn = partial.bind( instance );
        fn.isOwner = instance.partials.hasOwnProperty( name );
        partial = fn( instance.data, parser );
      }
      if ( !partial ) {
        log.warn( {
          debug: ractive.debug,
          message: 'noRegistryFunctionReturn',
          args: {
            registry: 'partial',
            name: name
          }
        } );
        return;
      }
      // If this was added manually to the registry,
      // but hasn't been parsed, parse it now
      if ( !parser.isParsed( partial ) ) {
        // use the parseOptions of the ractive instance on which it was found
        var parsed = parser.parse( partial, parser.getParseOptions( instance ) );
        // Partials cannot contain nested partials!
        // TODO add a test for this
        if ( parsed.p ) {
          log.warn( {
            debug: ractive.debug,
            message: 'noNestedPartials',
            args: {
              rname: name
            }
          } );
        }
        // if fn, use instance to store result, otherwise needs to go
        // in the correct point in prototype chain on instance or constructor
        var target = fn ? instance : partials.findOwner( instance, name );
        // may be a template with partials, which need to be registered and main template extracted
        target.partials[ name ] = partial = parsed.t;
      }
      // store for reset
      if ( fn ) {
        partial._fn = fn;
      }
      return partial.v ? partial.t : partial;
    }
    return __export;
  }( log, config, parser, deIndent );

  /* virtualdom/items/Partial/applyIndent.js */
  var applyIndent = function( string, indent ) {
    var indented;
    if ( !indent ) {
      return string;
    }
    indented = string.split( '\n' ).map( function( line, notFirstLine ) {
      return notFirstLine ? indent + line : line;
    } ).join( '\n' );
    return indented;
  };

  /* virtualdom/items/Partial/_Partial.js */
  var Partial = function( log, types, getPartialTemplate, applyIndent, circular, runloop, Mustache, rebind, unbind ) {

    var Partial, Fragment;
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    Partial = function( options ) {
      var parentFragment, template;
      parentFragment = this.parentFragment = options.parentFragment;
      this.root = parentFragment.root;
      this.type = types.PARTIAL;
      this.index = options.index;
      this.name = options.template.r;
      this.fragment = this.fragmentToRender = this.fragmentToUnrender = null;
      Mustache.init( this, options );
      // If this didn't resolve, it most likely means we have a named partial
      // (i.e. `{{>foo}}` means 'use the foo partial', not 'use the partial
      // whose name is the value of `foo`')
      if ( !this.keypath && ( template = getPartialTemplate( this.root, this.name ) ) ) {
        unbind.call( this );
        // prevent any further changes
        this.isNamed = true;
        this.setTemplate( template );
      }
    };
    Partial.prototype = {
      bubble: function() {
        this.parentFragment.bubble();
      },
      detach: function() {
        return this.fragment.detach();
      },
      find: function( selector ) {
        return this.fragment.find( selector );
      },
      findAll: function( selector, query ) {
        return this.fragment.findAll( selector, query );
      },
      findComponent: function( selector ) {
        return this.fragment.findComponent( selector );
      },
      findAllComponents: function( selector, query ) {
        return this.fragment.findAllComponents( selector, query );
      },
      firstNode: function() {
        return this.fragment.firstNode();
      },
      findNextNode: function() {
        return this.parentFragment.findNextNode( this );
      },
      getValue: function() {
        return this.fragment.getValue();
      },
      rebind: function( indexRef, newIndex, oldKeypath, newKeypath ) {
        rebind.call( this, indexRef, newIndex, oldKeypath, newKeypath );
        this.fragment.rebind( indexRef, newIndex, oldKeypath, newKeypath );
      },
      render: function() {
        this.docFrag = document.createDocumentFragment();
        this.update();
        this.rendered = true;
        return this.docFrag;
      },
      resolve: Mustache.resolve,
      setValue: function( value ) {
        var template;
        if ( value !== undefined && value === this.value ) {
          // nothing has changed, so no work to be done
          return;
        }
        template = getPartialTemplate( this.root, '' + value );
        // we may be here if we have a partial like `{{>foo}}` and `foo` is the
        // name of both a data property (whose value ISN'T the name of a partial)
        // and a partial. In those cases, this becomes a named partial
        if ( !template && this.name && ( template = getPartialTemplate( this.root, this.name ) ) ) {
          unbind.call( this );
          this.isNamed = true;
        }
        if ( !template ) {
          log.error( {
            debug: this.root.debug,
            message: 'noTemplateForPartial',
            args: {
              name: this.name
            }
          } );
        }
        this.setTemplate( template || [] );
        this.value = value;
        this.bubble();
        if ( this.rendered ) {
          runloop.addView( this );
        }
      },
      setTemplate: function( template ) {
        if ( this.fragment ) {
          this.fragment.unbind();
          this.fragmentToUnrender = this.fragment;
        }
        this.fragment = new Fragment( {
          template: template,
          root: this.root,
          owner: this,
          pElement: this.parentFragment.pElement
        } );
        this.fragmentToRender = this.fragment;
      },
      toString: function( toString ) {
        var string, previousItem, lastLine, match;
        string = this.fragment.toString( toString );
        previousItem = this.parentFragment.items[ this.index - 1 ];
        if ( !previousItem || previousItem.type !== types.TEXT ) {
          return string;
        }
        lastLine = previousItem.text.split( '\n' ).pop();
        if ( match = /^\s+$/.exec( lastLine ) ) {
          return applyIndent( string, match[ 0 ] );
        }
        return string;
      },
      unbind: function() {
        if ( !this.isNamed ) {
          // dynamic partial - need to unbind self
          unbind.call( this );
        }
        if ( this.fragment ) {
          this.fragment.unbind();
        }
      },
      unrender: function( shouldDestroy ) {
        if ( this.rendered ) {
          if ( this.fragment ) {
            this.fragment.unrender( shouldDestroy );
          }
          this.rendered = false;
        }
      },
      update: function() {
        var target, anchor;
        if ( this.fragmentToUnrender ) {
          this.fragmentToUnrender.unrender( true );
          this.fragmentToUnrender = null;
        }
        if ( this.fragmentToRender ) {
          this.docFrag.appendChild( this.fragmentToRender.render() );
          this.fragmentToRender = null;
        }
        if ( this.rendered ) {
          target = this.parentFragment.getNode();
          anchor = this.parentFragment.findNextNode( this );
          target.insertBefore( this.docFrag, anchor );
        }
      }
    };
    return Partial;
  }( log, types, getPartialTemplate, applyIndent, circular, runloop, Mustache, rebind, unbind );

  /* virtualdom/items/Component/getComponent.js */
  var getComponent = function( config, log, circular ) {

    var Ractive;
    circular.push( function() {
      Ractive = circular.Ractive;
    } );
    // finds the component constructor in the registry or view hierarchy registries
    return function getComponent( ractive, name ) {
      var component, instance = config.registries.components.findInstance( ractive, name );
      if ( instance ) {
        component = instance.components[ name ];
        // best test we have for not Ractive.extend
        if ( !component._parent ) {
          // function option, execute and store for reset
          var fn = component.bind( instance );
          fn.isOwner = instance.components.hasOwnProperty( name );
          component = fn( instance.data );
          if ( !component ) {
            log.warn( {
              debug: ractive.debug,
              message: 'noRegistryFunctionReturn',
              args: {
                registry: 'component',
                name: name
              }
            } );
            return;
          }
          if ( typeof component === 'string' ) {
            //allow string lookup
            component = getComponent( ractive, component );
          }
          component._fn = fn;
          instance.components[ name ] = component;
        }
      }
      return component;
    };
  }( config, log, circular );

  /* virtualdom/items/Component/prototype/detach.js */
  var virtualdom_items_Component$detach = function( Hook ) {

    var detachHook = new Hook( 'detach' );
    return function Component$detach() {
      var detached = this.instance.fragment.detach();
      detachHook.fire( this.instance );
      return detached;
    };
  }( Ractive$shared_hooks_Hook );

  /* virtualdom/items/Component/prototype/find.js */
  var virtualdom_items_Component$find = function Component$find( selector ) {
    return this.instance.fragment.find( selector );
  };

  /* virtualdom/items/Component/prototype/findAll.js */
  var virtualdom_items_Component$findAll = function Component$findAll( selector, query ) {
    return this.instance.fragment.findAll( selector, query );
  };

  /* virtualdom/items/Component/prototype/findAllComponents.js */
  var virtualdom_items_Component$findAllComponents = function Component$findAllComponents( selector, query ) {
    query._test( this, true );
    if ( this.instance.fragment ) {
      this.instance.fragment.findAllComponents( selector, query );
    }
  };

  /* virtualdom/items/Component/prototype/findComponent.js */
  var virtualdom_items_Component$findComponent = function Component$findComponent( selector ) {
    if ( !selector || selector === this.name ) {
      return this.instance;
    }
    if ( this.instance.fragment ) {
      return this.instance.fragment.findComponent( selector );
    }
    return null;
  };

  /* virtualdom/items/Component/prototype/findNextNode.js */
  var virtualdom_items_Component$findNextNode = function Component$findNextNode() {
    return this.parentFragment.findNextNode( this );
  };

  /* virtualdom/items/Component/prototype/firstNode.js */
  var virtualdom_items_Component$firstNode = function Component$firstNode() {
    if ( this.rendered ) {
      return this.instance.fragment.firstNode();
    }
    return null;
  };

  /* virtualdom/items/Component/initialise/createModel/ComponentParameter.js */
  var ComponentParameter = function( runloop, circular ) {

    var Fragment, ComponentParameter;
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    ComponentParameter = function( component, key, value ) {
      this.parentFragment = component.parentFragment;
      this.component = component;
      this.key = key;
      this.fragment = new Fragment( {
        template: value,
        root: component.root,
        owner: this
      } );
      this.value = this.fragment.getValue();
    };
    ComponentParameter.prototype = {
      bubble: function() {
        if ( !this.dirty ) {
          this.dirty = true;
          runloop.addView( this );
        }
      },
      update: function() {
        var value = this.fragment.getValue();
        this.component.instance.viewmodel.set( this.key, value );
        runloop.addViewmodel( this.component.instance.viewmodel );
        this.value = value;
        this.dirty = false;
      },
      rebind: function( indexRef, newIndex, oldKeypath, newKeypath ) {
        this.fragment.rebind( indexRef, newIndex, oldKeypath, newKeypath );
      },
      unbind: function() {
        this.fragment.unbind();
      }
    };
    return ComponentParameter;
  }( runloop, circular );

  /* virtualdom/items/Component/initialise/createModel/ReferenceExpressionParameter.js */
  var ReferenceExpressionParameter = function( ReferenceExpressionResolver, createComponentBinding ) {

    var ReferenceExpressionParameter = function( component, childKeypath, template, toBind ) {
      var this$0 = this;
      this.root = component.root;
      this.parentFragment = component.parentFragment;
      this.ready = false;
      this.hash = null;
      this.resolver = new ReferenceExpressionResolver( this, template, function( keypath ) {
        // Are we updating an existing binding?
        if ( this$0.binding || ( this$0.binding = component.bindings[ this$0.hash ] ) ) {
          component.bindings[ this$0.hash ] = null;
          this$0.binding.rebind( keypath );
          this$0.hash = keypath + '=' + childKeypath;
          component.bindings[ this$0.hash ];
        } else {
          if ( !this$0.ready ) {
            // The child instance isn't created yet, we need to create the binding later
            toBind.push( {
              childKeypath: childKeypath,
              parentKeypath: keypath
            } );
          } else {
            createComponentBinding( component, component.root, keypath, childKeypath );
          }
        }
        this$0.value = component.root.viewmodel.get( keypath );
      } );
    };
    ReferenceExpressionParameter.prototype = {
      rebind: function( indexRef, newIndex, oldKeypath, newKeypath ) {
        this.resolver.rebind( indexRef, newIndex, oldKeypath, newKeypath );
      },
      unbind: function() {
        this.resolver.unbind();
      }
    };
    return ReferenceExpressionParameter;
  }( ReferenceExpressionResolver, createComponentBinding );

  /* virtualdom/items/Component/initialise/createModel/_createModel.js */
  var createModel = function( types, parseJSON, resolveRef, ComponentParameter, ReferenceExpressionParameter ) {

    var __export;
    __export = function( component, defaultData, attributes, toBind ) {
      var data = {},
        key, value;
      // some parameters, e.g. foo="The value is {{bar}}", are 'complex' - in
      // other words, we need to construct a string fragment to watch
      // when they change. We store these so they can be torn down later
      component.complexParameters = [];
      for ( key in attributes ) {
        if ( attributes.hasOwnProperty( key ) ) {
          value = getValue( component, key, attributes[ key ], toBind );
          if ( value !== undefined || defaultData[ key ] === undefined ) {
            data[ key ] = value;
          }
        }
      }
      return data;
    };

    function getValue( component, key, template, toBind ) {
      var parameter, parsed, parentInstance, parentFragment, keypath, indexRef;
      parentInstance = component.root;
      parentFragment = component.parentFragment;
      // If this is a static value, great
      if ( typeof template === 'string' ) {
        parsed = parseJSON( template );
        if ( !parsed ) {
          return template;
        }
        return parsed.value;
      }
      // If null, we treat it as a boolean attribute (i.e. true)
      if ( template === null ) {
        return true;
      }
      // Single interpolator?
      if ( template.length === 1 && template[ 0 ].t === types.INTERPOLATOR ) {
        // If it's a regular interpolator, we bind to it
        if ( template[ 0 ].r ) {
          // Is it an index reference?
          if ( parentFragment.indexRefs && parentFragment.indexRefs[ indexRef = template[ 0 ].r ] !== undefined ) {
            component.indexRefBindings[ indexRef ] = key;
            return parentFragment.indexRefs[ indexRef ];
          }
          // TODO what about references that resolve late? Should these be considered?
          keypath = resolveRef( parentInstance, template[ 0 ].r, parentFragment ) || template[ 0 ].r;
          // We need to set up bindings between parent and child, but
          // we can't do it yet because the child instance doesn't exist
          // yet - so we make a note instead
          toBind.push( {
            childKeypath: key,
            parentKeypath: keypath
          } );
          return parentInstance.viewmodel.get( keypath );
        }
        // If it's a reference expression (e.g. `{{foo[bar]}}`), we need
        // to watch the keypath and create/destroy bindings
        if ( template[ 0 ].rx ) {
          parameter = new ReferenceExpressionParameter( component, key, template[ 0 ].rx, toBind );
          component.complexParameters.push( parameter );
          parameter.ready = true;
          return parameter.value;
        }
      }
      // We have a 'complex parameter' - we need to create a full-blown string
      // fragment in order to evaluate and observe its value
      parameter = new ComponentParameter( component, key, template );
      component.complexParameters.push( parameter );
      return parameter.value;
    }
    return __export;
  }( types, parseJSON, resolveRef, ComponentParameter, ReferenceExpressionParameter );

  /* virtualdom/items/Component/initialise/createInstance.js */
  var createInstance = function( log ) {

    return function( component, Component, data, contentDescriptor ) {
      var instance, parentFragment, partials, ractive;
      parentFragment = component.parentFragment;
      ractive = component.root;
      // Make contents available as a {{>content}} partial
      partials = {
        content: contentDescriptor || []
      };
      if ( Component.defaults.el ) {
        log.warn( {
          debug: ractive.debug,
          message: 'defaultElSpecified',
          args: {
            name: component.name
          }
        } );
      }
      instance = new Component( {
        el: null,
        append: true,
        data: data,
        partials: partials,
        magic: ractive.magic || Component.defaults.magic,
        modifyArrays: ractive.modifyArrays,
        _parent: ractive,
        _component: component,
        // need to inherit runtime parent adaptors
        adapt: ractive.adapt,
        yield: {
          template: contentDescriptor,
          instance: ractive
        }
      } );
      return instance;
    };
  }( log );

  /* virtualdom/items/Component/initialise/createBindings.js */
  var createBindings = function( createComponentBinding ) {

    return function createInitialComponentBindings( component, toBind ) {
      toBind.forEach( function createInitialComponentBinding( pair ) {
        var childValue, parentValue;
        createComponentBinding( component, component.root, pair.parentKeypath, pair.childKeypath );
        childValue = component.instance.viewmodel.get( pair.childKeypath );
        parentValue = component.root.viewmodel.get( pair.parentKeypath );
        if ( childValue !== undefined && parentValue === undefined ) {
          component.root.viewmodel.set( pair.parentKeypath, childValue );
        }
      } );
    };
  }( createComponentBinding );

  /* virtualdom/items/Component/initialise/propagateEvents.js */
  var propagateEvents = function( circular, fireEvent, log ) {

    var __export;
    var Fragment;
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    __export = function propagateEvents( component, eventsDescriptor ) {
      var eventName;
      for ( eventName in eventsDescriptor ) {
        if ( eventsDescriptor.hasOwnProperty( eventName ) ) {
          propagateEvent( component.instance, component.root, eventName, eventsDescriptor[ eventName ] );
        }
      }
    };

    function propagateEvent( childInstance, parentInstance, eventName, proxyEventName ) {
      if ( typeof proxyEventName !== 'string' ) {
        log.error( {
          debug: parentInstance.debug,
          message: 'noComponentEventArguments'
        } );
      }
      childInstance.on( eventName, function() {
        var event, args;
        // semi-weak test, but what else? tag the event obj ._isEvent ?
        if ( arguments.length && arguments[ 0 ] && arguments[ 0 ].node ) {
          event = Array.prototype.shift.call( arguments );
        }
        args = Array.prototype.slice.call( arguments );
        fireEvent( parentInstance, proxyEventName, {
          event: event,
          args: args
        } );
        // cancel bubbling
        return false;
      } );
    }
    return __export;
  }( circular, Ractive$shared_fireEvent, log );

  /* virtualdom/items/Component/initialise/updateLiveQueries.js */
  var updateLiveQueries = function( component ) {
    var ancestor, query;
    // If there's a live query for this component type, add it
    ancestor = component.root;
    while ( ancestor ) {
      if ( query = ancestor._liveComponentQueries[ '_' + component.name ] ) {
        query.push( component.instance );
      }
      ancestor = ancestor._parent;
    }
  };

  /* virtualdom/items/Component/prototype/init.js */
  var virtualdom_items_Component$init = function( types, warn, createModel, createInstance, createBindings, propagateEvents, updateLiveQueries ) {

    return function Component$init( options, Component ) {
      var parentFragment, root, data, toBind;
      parentFragment = this.parentFragment = options.parentFragment;
      root = parentFragment.root;
      this.root = root;
      this.type = types.COMPONENT;
      this.name = options.template.e;
      this.index = options.index;
      this.indexRefBindings = {};
      this.bindings = [];
      // even though only one yielder is allowed, we need to have an array of them
      // as it's possible to cause a yielder to be created before the last one
      // was destroyed in the same turn of the runloop
      this.yielders = [];
      if ( !Component ) {
        throw new Error( 'Component "' + this.name + '" not found' );
      }
      // First, we need to create a model for the component - e.g. if we
      // encounter <widget foo='bar'/> then we need to create a widget
      // with `data: { foo: 'bar' }`.
      //
      // This may involve setting up some bindings, but we can't do it
      // yet so we take some notes instead
      toBind = [];
      data = createModel( this, Component.defaults.data || {}, options.template.a, toBind );
      createInstance( this, Component, data, options.template.f );
      createBindings( this, toBind );
      propagateEvents( this, options.template.v );
      // intro, outro and decorator directives have no effect
      if ( options.template.t1 || options.template.t2 || options.template.o ) {
        warn( 'The "intro", "outro" and "decorator" directives have no effect on components' );
      }
      updateLiveQueries( this );
    };
  }( types, warn, createModel, createInstance, createBindings, propagateEvents, updateLiveQueries );

  /* virtualdom/items/Component/prototype/rebind.js */
  var virtualdom_items_Component$rebind = function( runloop, getNewKeypath ) {

    return function Component$rebind( indexRef, newIndex, oldKeypath, newKeypath ) {
      var childInstance = this.instance,
        parentInstance = childInstance._parent,
        indexRefAlias, query;
      this.bindings.forEach( function( binding ) {
        var updated;
        if ( binding.root !== parentInstance ) {
          return;
        }
        if ( updated = getNewKeypath( binding.keypath, oldKeypath, newKeypath ) ) {
          binding.rebind( updated );
        }
      } );
      this.complexParameters.forEach( rebind );
      if ( this.yielders[ 0 ] ) {
        rebind( this.yielders[ 0 ] );
      }
      if ( indexRefAlias = this.indexRefBindings[ indexRef ] ) {
        runloop.addViewmodel( childInstance.viewmodel );
        childInstance.viewmodel.set( indexRefAlias, newIndex );
      }
      if ( query = this.root._liveComponentQueries[ '_' + this.name ] ) {
        query._makeDirty();
      }

      function rebind( x ) {
        x.rebind( indexRef, newIndex, oldKeypath, newKeypath );
      }
    };
  }( runloop, getNewKeypath );

  /* virtualdom/items/Component/prototype/render.js */
  var virtualdom_items_Component$render = function Component$render() {
    var instance = this.instance;
    instance.render( this.parentFragment.getNode() );
    this.rendered = true;
    return instance.fragment.detach();
  };

  /* virtualdom/items/Component/prototype/toString.js */
  var virtualdom_items_Component$toString = function Component$toString() {
    return this.instance.fragment.toString();
  };

  /* virtualdom/items/Component/prototype/unbind.js */
  var virtualdom_items_Component$unbind = function( Hook, removeFromArray ) {

    var __export;
    var teardownHook = new Hook( 'teardown' );
    __export = function Component$unbind() {
      var instance = this.instance;
      this.complexParameters.forEach( unbind );
      this.bindings.forEach( unbind );
      removeFromLiveComponentQueries( this );
      // teardown the instance
      instance.fragment.unbind();
      instance.viewmodel.teardown();
      if ( instance.fragment.rendered && instance.el.__ractive_instances__ ) {
        removeFromArray( instance.el.__ractive_instances__, instance );
      }
      teardownHook.fire( instance );
    };

    function unbind( thing ) {
      thing.unbind();
    }

    function removeFromLiveComponentQueries( component ) {
      var instance, query;
      instance = component.root;
      do {
        if ( query = instance._liveComponentQueries[ '_' + component.name ] ) {
          query._remove( component );
        }
      } while ( instance = instance._parent );
    }
    return __export;
  }( Ractive$shared_hooks_Hook, removeFromArray );

  /* virtualdom/items/Component/prototype/unrender.js */
  var virtualdom_items_Component$unrender = function Component$unrender( shouldDestroy ) {
    this.shouldDestroy = shouldDestroy;
    this.instance.unrender();
  };

  /* virtualdom/items/Component/_Component.js */
  var Component = function( detach, find, findAll, findAllComponents, findComponent, findNextNode, firstNode, init, rebind, render, toString, unbind, unrender ) {

    var Component = function( options, Constructor ) {
      this.init( options, Constructor );
    };
    Component.prototype = {
      detach: detach,
      find: find,
      findAll: findAll,
      findAllComponents: findAllComponents,
      findComponent: findComponent,
      findNextNode: findNextNode,
      firstNode: firstNode,
      init: init,
      rebind: rebind,
      render: render,
      toString: toString,
      unbind: unbind,
      unrender: unrender
    };
    return Component;
  }( virtualdom_items_Component$detach, virtualdom_items_Component$find, virtualdom_items_Component$findAll, virtualdom_items_Component$findAllComponents, virtualdom_items_Component$findComponent, virtualdom_items_Component$findNextNode, virtualdom_items_Component$firstNode, virtualdom_items_Component$init, virtualdom_items_Component$rebind, virtualdom_items_Component$render, virtualdom_items_Component$toString, virtualdom_items_Component$unbind, virtualdom_items_Component$unrender );

  /* virtualdom/items/Comment.js */
  var Comment = function( types, detach ) {

    var Comment = function( options ) {
      this.type = types.COMMENT;
      this.value = options.template.c;
    };
    Comment.prototype = {
      detach: detach,
      firstNode: function() {
        return this.node;
      },
      render: function() {
        if ( !this.node ) {
          this.node = document.createComment( this.value );
        }
        return this.node;
      },
      toString: function() {
        return '<!--' + this.value + '-->';
      },
      unrender: function( shouldDestroy ) {
        if ( shouldDestroy ) {
          this.node.parentNode.removeChild( this.node );
        }
      }
    };
    return Comment;
  }( types, detach );

  /* virtualdom/items/Yielder.js */
  var Yielder = function( runloop, removeFromArray, circular ) {

    var Fragment;
    circular.push( function() {
      Fragment = circular.Fragment;
    } );
    var Yielder = function( options ) {
      var componentInstance, component;
      componentInstance = options.parentFragment.root;
      this.component = component = componentInstance.component;
      this.surrogateParent = options.parentFragment;
      this.parentFragment = component.parentFragment;
      this.fragment = new Fragment( {
        owner: this,
        root: componentInstance.yield.instance,
        template: componentInstance.yield.template,
        pElement: this.surrogateParent.pElement
      } );
      component.yielders.push( this );
      runloop.scheduleTask( function() {
        if ( component.yielders.length > 1 ) {
          throw new Error( 'A component template can only have one {{yield}} declaration at a time' );
        }
      } );
    };
    Yielder.prototype = {
      detach: function() {
        return this.fragment.detach();
      },
      find: function( selector ) {
        return this.fragment.find( selector );
      },
      findAll: function( selector, query ) {
        return this.fragment.findAll( selector, query );
      },
      findComponent: function( selector ) {
        return this.fragment.findComponent( selector );
      },
      findAllComponents: function( selector, query ) {
        return this.fragment.findAllComponents( selector, query );
      },
      findNextNode: function() {
        return this.surrogateParent.findNextNode( this );
      },
      firstNode: function() {
        return this.fragment.firstNode();
      },
      getValue: function( options ) {
        return this.fragment.getValue( options );
      },
      render: function() {
        return this.fragment.render();
      },
      unbind: function() {
        this.fragment.unbind();
      },
      unrender: function( shouldDestroy ) {
        this.fragment.unrender( shouldDestroy );
        removeFromArray( this.component.yielders, this );
      },
      rebind: function( indexRef, newIndex, oldKeypath, newKeypath ) {
        this.fragment.rebind( indexRef, newIndex, oldKeypath, newKeypath );
      },
      toString: function() {
        return this.fragment.toString();
      }
    };
    return Yielder;
  }( runloop, removeFromArray, circular );

  /* virtualdom/Fragment/prototype/init/createItem.js */
  var virtualdom_Fragment$init_createItem = function( types, Text, Interpolator, Section, Triple, Element, Partial, getComponent, Component, Comment, Yielder ) {

    return function createItem( options ) {
      if ( typeof options.template === 'string' ) {
        return new Text( options );
      }
      switch ( options.template.t ) {
        case types.INTERPOLATOR:
          if ( options.template.r === 'yield' ) {
            return new Yielder( options );
          }
          return new Interpolator( options );
        case types.SECTION:
          return new Section( options );
        case types.TRIPLE:
          return new Triple( options );
        case types.ELEMENT:
          var constructor;
          if ( constructor = getComponent( options.parentFragment.root, options.template.e ) ) {
            return new Component( options, constructor );
          }
          return new Element( options );
        case types.PARTIAL:
          return new Partial( options );
        case types.COMMENT:
          return new Comment( options );
        default:
          throw new Error( 'Something very strange happened. Please file an issue at https://github.com/ractivejs/ractive/issues. Thanks!' );
      }
    };
  }( types, Text, Interpolator, Section, Triple, Element, Partial, getComponent, Component, Comment, Yielder );

  /* virtualdom/Fragment/prototype/init.js */
  var virtualdom_Fragment$init = function( types, create, createItem ) {

    return function Fragment$init( options ) {
      var this$0 = this;
      var parentFragment, parentRefs, ref;
      // The item that owns this fragment - an element, section, partial, or attribute
      this.owner = options.owner;
      parentFragment = this.parent = this.owner.parentFragment;
      // inherited properties
      this.root = options.root;
      this.pElement = options.pElement;
      this.context = options.context;
      // If parent item is a section, this may not be the only fragment
      // that belongs to it - we need to make a note of the index
      if ( this.owner.type === types.SECTION ) {
        this.index = options.index;
      }
      // index references (the 'i' in {{#section:i}}...{{/section}}) need to cascade
      // down the tree
      if ( parentFragment ) {
        parentRefs = parentFragment.indexRefs;
        if ( parentRefs ) {
          this.indexRefs = create( null );
          // avoids need for hasOwnProperty
          for ( ref in parentRefs ) {
            this.indexRefs[ ref ] = parentRefs[ ref ];
          }
        }
      }
      if ( options.indexRef ) {
        if ( !this.indexRefs ) {
          this.indexRefs = {};
        }
        this.indexRefs[ options.indexRef ] = options.index;
      }
      // Time to create this fragment's child items
      // TEMP should this be happening?
      if ( typeof options.template === 'string' ) {
        options.template = [ options.template ];
      } else if ( !options.template ) {
        options.template = [];
      }
      this.items = options.template.map( function( template, i ) {
        return createItem( {
          parentFragment: this$0,
          pElement: options.pElement,
          template: template,
          index: i
        } );
      } );
      this.value = this.argsList = null;
      this.dirtyArgs = this.dirtyValue = true;
      this.bound = true;
    };
  }( types, create, virtualdom_Fragment$init_createItem );

  /* virtualdom/Fragment/prototype/rebind.js */
  var virtualdom_Fragment$rebind = function( assignNewKeypath ) {

    return function Fragment$rebind( indexRef, newIndex, oldKeypath, newKeypath ) {
      this.index = newIndex;
      // assign new context keypath if needed
      assignNewKeypath( this, 'context', oldKeypath, newKeypath );
      if ( this.indexRefs && this.indexRefs[ indexRef ] !== undefined ) {
        this.indexRefs[ indexRef ] = newIndex;
      }
      this.items.forEach( function( item ) {
        if ( item.rebind ) {
          item.rebind( indexRef, newIndex, oldKeypath, newKeypath );
        }
      } );
    };
  }( assignNewKeypath );

  /* virtualdom/Fragment/prototype/render.js */
  var virtualdom_Fragment$render = function Fragment$render() {
    var result;
    if ( this.items.length === 1 ) {
      result = this.items[ 0 ].render();
    } else {
      result = document.createDocumentFragment();
      this.items.forEach( function( item ) {
        result.appendChild( item.render() );
      } );
    }
    this.rendered = true;
    return result;
  };

  /* virtualdom/Fragment/prototype/toString.js */
  var virtualdom_Fragment$toString = function Fragment$toString( escape ) {
    if ( !this.items ) {
      return '';
    }
    return this.items.map( function( item ) {
      return item.toString( escape );
    } ).join( '' );
  };

  /* virtualdom/Fragment/prototype/unbind.js */
  var virtualdom_Fragment$unbind = function() {

    var __export;
    __export = function Fragment$unbind() {
      if ( !this.bound ) {
        return;
      }
      this.items.forEach( unbindItem );
      this.bound = false;
    };

    function unbindItem( item ) {
      if ( item.unbind ) {
        item.unbind();
      }
    }
    return __export;
  }();

  /* virtualdom/Fragment/prototype/unrender.js */
  var virtualdom_Fragment$unrender = function Fragment$unrender( shouldDestroy ) {
    if ( !this.rendered ) {
      throw new Error( 'Attempted to unrender a fragment that was not rendered' );
    }
    this.items.forEach( function( i ) {
      return i.unrender( shouldDestroy );
    } );
    this.rendered = false;
  };

  /* virtualdom/Fragment.js */
  var Fragment = function( bubble, detach, find, findAll, findAllComponents, findComponent, findNextNode, firstNode, getNode, getValue, init, rebind, render, toString, unbind, unrender, circular ) {

    var Fragment = function( options ) {
      this.init( options );
    };
    Fragment.prototype = {
      bubble: bubble,
      detach: detach,
      find: find,
      findAll: findAll,
      findAllComponents: findAllComponents,
      findComponent: findComponent,
      findNextNode: findNextNode,
      firstNode: firstNode,
      getNode: getNode,
      getValue: getValue,
      init: init,
      rebind: rebind,
      render: render,
      toString: toString,
      unbind: unbind,
      unrender: unrender
    };
    circular.Fragment = Fragment;
    return Fragment;
  }( virtualdom_Fragment$bubble, virtualdom_Fragment$detach, virtualdom_Fragment$find, virtualdom_Fragment$findAll, virtualdom_Fragment$findAllComponents, virtualdom_Fragment$findComponent, virtualdom_Fragment$findNextNode, virtualdom_Fragment$firstNode, virtualdom_Fragment$getNode, virtualdom_Fragment$getValue, virtualdom_Fragment$init, virtualdom_Fragment$rebind, virtualdom_Fragment$render, virtualdom_Fragment$toString, virtualdom_Fragment$unbind, virtualdom_Fragment$unrender, circular );

  /* Ractive/prototype/reset.js */
  var Ractive$reset = function( Hook, runloop, Fragment, config ) {

    var shouldRerender = [
        'template',
        'partials',
        'components',
        'decorators',
        'events'
      ],
      resetHook = new Hook( 'reset' );
    return function Ractive$reset( data, callback ) {
      var promise, wrapper, changes, i, rerender;
      if ( typeof data === 'function' && !callback ) {
        callback = data;
        data = {};
      } else {
        data = data || {};
      }
      if ( typeof data !== 'object' ) {
        throw new Error( 'The reset method takes either no arguments, or an object containing new data' );
      }
      // If the root object is wrapped, try and use the wrapper's reset value
      if ( ( wrapper = this.viewmodel.wrapped[ '' ] ) && wrapper.reset ) {
        if ( wrapper.reset( data ) === false ) {
          // reset was rejected, we need to replace the object
          this.data = data;
        }
      } else {
        this.data = data;
      }
      // reset config items and track if need to rerender
      changes = config.reset( this );
      i = changes.length;
      while ( i-- ) {
        if ( shouldRerender.indexOf( changes[ i ] ) > -1 ) {
          rerender = true;
          break;
        }
      }
      if ( rerender ) {
        var component;
        this.viewmodel.mark( '' );
        // Is this is a component, we need to set the `shouldDestroy`
        // flag, otherwise it will assume by default that a parent node
        // will be detached, and therefore it doesn't need to bother
        // detaching its own nodes
        if ( component = this.component ) {
          component.shouldDestroy = true;
        }
        this.unrender();
        if ( component ) {
          component.shouldDestroy = false;
        }
        // If the template changed, we need to destroy the parallel DOM
        // TODO if we're here, presumably it did?
        if ( this.fragment.template !== this.template ) {
          this.fragment.unbind();
          this.fragment = new Fragment( {
            template: this.template,
            root: this,
            owner: this
          } );
        }
        promise = this.render( this.el, this.anchor );
      } else {
        promise = runloop.start( this, true );
        this.viewmodel.mark( '' );
        runloop.end();
      }
      resetHook.fire( this, data );
      if ( callback ) {
        promise.then( callback );
      }
      return promise;
    };
  }( Ractive$shared_hooks_Hook, runloop, Fragment, config );

  /* Ractive/prototype/resetTemplate.js */
  var Ractive$resetTemplate = function( config, Fragment ) {

    return function Ractive$resetTemplate( template ) {
      var transitionsEnabled, component;
      config.template.init( null, this, {
        template: template
      } );
      transitionsEnabled = this.transitionsEnabled;
      this.transitionsEnabled = false;
      // Is this is a component, we need to set the `shouldDestroy`
      // flag, otherwise it will assume by default that a parent node
      // will be detached, and therefore it doesn't need to bother
      // detaching its own nodes
      if ( component = this.component ) {
        component.shouldDestroy = true;
      }
      this.unrender();
      if ( component ) {
        component.shouldDestroy = false;
      }
      // remove existing fragment and create new one
      this.fragment.unbind();
      this.fragment = new Fragment( {
        template: this.template,
        root: this,
        owner: this
      } );
      this.render( this.el, this.anchor );
      this.transitionsEnabled = transitionsEnabled;
    };
  }( config, Fragment );

  /* Ractive/prototype/reverse.js */
  var Ractive$reverse = function( makeArrayMethod ) {

    return makeArrayMethod( 'reverse' );
  }( Ractive$shared_makeArrayMethod );

  /* Ractive/prototype/set.js */
  var Ractive$set = function( runloop, isObject, normaliseKeypath, getMatchingKeypaths ) {

    var wildcard = /\*/;
    return function Ractive$set( keypath, value, callback ) {
      var this$0 = this;
      var map, promise;
      promise = runloop.start( this, true );
      // Set multiple keypaths in one go
      if ( isObject( keypath ) ) {
        map = keypath;
        callback = value;
        for ( keypath in map ) {
          if ( map.hasOwnProperty( keypath ) ) {
            value = map[ keypath ];
            keypath = normaliseKeypath( keypath );
            this.viewmodel.set( keypath, value );
          }
        }
      } else {
        keypath = normaliseKeypath( keypath );
        if ( wildcard.test( keypath ) ) {
          getMatchingKeypaths( this, keypath ).forEach( function( keypath ) {
            this$0.viewmodel.set( keypath, value );
          } );
        } else {
          this.viewmodel.set( keypath, value );
        }
      }
      runloop.end();
      if ( callback ) {
        promise.then( callback.bind( this ) );
      }
      return promise;
    };
  }( runloop, isObject, normaliseKeypath, getMatchingKeypaths );

  /* Ractive/prototype/shift.js */
  var Ractive$shift = function( makeArrayMethod ) {

    return makeArrayMethod( 'shift' );
  }( Ractive$shared_makeArrayMethod );

  /* Ractive/prototype/sort.js */
  var Ractive$sort = function( makeArrayMethod ) {

    return makeArrayMethod( 'sort' );
  }( Ractive$shared_makeArrayMethod );

  /* Ractive/prototype/splice.js */
  var Ractive$splice = function( makeArrayMethod ) {

    return makeArrayMethod( 'splice' );
  }( Ractive$shared_makeArrayMethod );

  /* Ractive/prototype/subtract.js */
  var Ractive$subtract = function( add ) {

    return function Ractive$subtract( keypath, d ) {
      return add( this, keypath, d === undefined ? -1 : -d );
    };
  }( Ractive$shared_add );

  /* Ractive/prototype/teardown.js */
  var Ractive$teardown = function( Hook, Promise, removeFromArray ) {

    var teardownHook = new Hook( 'teardown' );
    // Teardown. This goes through the root fragment and all its children, removing observers
    // and generally cleaning up after itself
    return function Ractive$teardown( callback ) {
      var promise;
      this.fragment.unbind();
      this.viewmodel.teardown();
      if ( this.fragment.rendered && this.el.__ractive_instances__ ) {
        removeFromArray( this.el.__ractive_instances__, this );
      }
      this.shouldDestroy = true;
      promise = this.fragment.rendered ? this.unrender() : Promise.resolve();
      teardownHook.fire( this );
      if ( callback ) {
        // TODO deprecate this?
        promise.then( callback.bind( this ) );
      }
      return promise;
    };
  }( Ractive$shared_hooks_Hook, Promise, removeFromArray );

  /* Ractive/prototype/toggle.js */
  var Ractive$toggle = function( log ) {

    return function Ractive$toggle( keypath, callback ) {
      var value;
      if ( typeof keypath !== 'string' ) {
        log.errorOnly( {
          debug: this.debug,
          messsage: 'badArguments',
          arg: {
            arguments: keypath
          }
        } );
      }
      value = this.get( keypath );
      return this.set( keypath, !value, callback );
    };
  }( log );

  /* Ractive/prototype/toHTML.js */
  var Ractive$toHTML = function Ractive$toHTML() {
    return this.fragment.toString( true );
  };

  /* Ractive/prototype/unrender.js */
  var Ractive$unrender = function( css, Hook, log, Promise, removeFromArray, runloop ) {

    var unrenderHook = new Hook( 'unrender' );
    return function Ractive$unrender() {
      var this$0 = this;
      var promise, shouldDestroy;
      if ( !this.fragment.rendered ) {
        log.warn( {
          debug: this.debug,
          message: 'ractive.unrender() was called on a Ractive instance that was not rendered'
        } );
        return Promise.resolve();
      }
      promise = runloop.start( this, true );
      // If this is a component, and the component isn't marked for destruction,
      // don't detach nodes from the DOM unnecessarily
      shouldDestroy = !this.component || this.component.shouldDestroy || this.shouldDestroy;
      if ( this.constructor.css ) {
        promise.then( function() {
          css.remove( this$0.constructor );
        } );
      }
      // Cancel any animations in progress
      while ( this._animations[ 0 ] ) {
        this._animations[ 0 ].stop();
      }
      this.fragment.unrender( shouldDestroy );
      removeFromArray( this.el.__ractive_instances__, this );
      unrenderHook.fire( this );
      runloop.end();
      return promise;
    };
  }( global_css, Ractive$shared_hooks_Hook, log, Promise, removeFromArray, runloop );

  /* Ractive/prototype/unshift.js */
  var Ractive$unshift = function( makeArrayMethod ) {

    return makeArrayMethod( 'unshift' );
  }( Ractive$shared_makeArrayMethod );

  /* Ractive/prototype/update.js */
  var Ractive$update = function( Hook, runloop ) {

    var updateHook = new Hook( 'update' );
    return function Ractive$update( keypath, callback ) {
      var promise;
      if ( typeof keypath === 'function' ) {
        callback = keypath;
        keypath = '';
      } else {
        keypath = keypath || '';
      }
      promise = runloop.start( this, true );
      this.viewmodel.mark( keypath );
      runloop.end();
      updateHook.fire( this, keypath );
      if ( callback ) {
        promise.then( callback.bind( this ) );
      }
      return promise;
    };
  }( Ractive$shared_hooks_Hook, runloop );

  /* Ractive/prototype/updateModel.js */
  var Ractive$updateModel = function( arrayContentsMatch, isEqual ) {

    var __export;
    __export = function Ractive$updateModel( keypath, cascade ) {
      var values;
      if ( typeof keypath !== 'string' ) {
        keypath = '';
        cascade = true;
      }
      consolidateChangedValues( this, keypath, values = {}, cascade );
      return this.set( values );
    };

    function consolidateChangedValues( ractive, keypath, values, cascade ) {
      var bindings, childDeps, i, binding, oldValue, newValue, checkboxGroups = [];
      bindings = ractive._twowayBindings[ keypath ];
      if ( bindings && ( i = bindings.length ) ) {
        while ( i-- ) {
          binding = bindings[ i ];
          // special case - radio name bindings
          if ( binding.radioName && !binding.element.node.checked ) {
            continue;
          }
          // special case - checkbox name bindings come in groups, so
          // we want to get the value once at most
          if ( binding.checkboxName ) {
            if ( !checkboxGroups[ binding.keypath ] && !binding.changed() ) {
              checkboxGroups.push( binding.keypath );
              checkboxGroups[ binding.keypath ] = binding;
            }
            continue;
          }
          oldValue = binding.attribute.value;
          newValue = binding.getValue();
          if ( arrayContentsMatch( oldValue, newValue ) ) {
            continue;
          }
          if ( !isEqual( oldValue, newValue ) ) {
            values[ keypath ] = newValue;
          }
        }
      }
      // Handle groups of `<input type='checkbox' name='{{foo}}' ...>`
      if ( checkboxGroups.length ) {
        checkboxGroups.forEach( function( keypath ) {
          var binding, oldValue, newValue;
          binding = checkboxGroups[ keypath ];
          // one to represent the entire group
          oldValue = binding.attribute.value;
          newValue = binding.getValue();
          if ( !arrayContentsMatch( oldValue, newValue ) ) {
            values[ keypath ] = newValue;
          }
        } );
      }
      if ( !cascade ) {
        return;
      }
      // cascade
      childDeps = ractive.viewmodel.depsMap[ 'default' ][ keypath ];
      if ( childDeps ) {
        i = childDeps.length;
        while ( i-- ) {
          consolidateChangedValues( ractive, childDeps[ i ], values, cascade );
        }
      }
    }
    return __export;
  }( arrayContentsMatch, isEqual );

  /* Ractive/prototype.js */
  var prototype = function( add, animate, detach, find, findAll, findAllComponents, findComponent, fire, get, insert, merge, observe, off, on, pop, push, render, reset, resetTemplate, reverse, set, shift, sort, splice, subtract, teardown, toggle, toHTML, unrender, unshift, update, updateModel ) {

    return {
      add: add,
      animate: animate,
      detach: detach,
      find: find,
      findAll: findAll,
      findAllComponents: findAllComponents,
      findComponent: findComponent,
      fire: fire,
      get: get,
      insert: insert,
      merge: merge,
      observe: observe,
      off: off,
      on: on,
      pop: pop,
      push: push,
      render: render,
      reset: reset,
      resetTemplate: resetTemplate,
      reverse: reverse,
      set: set,
      shift: shift,
      sort: sort,
      splice: splice,
      subtract: subtract,
      teardown: teardown,
      toggle: toggle,
      toHTML: toHTML,
      unrender: unrender,
      unshift: unshift,
      update: update,
      updateModel: updateModel
    };
  }( Ractive$add, Ractive$animate, Ractive$detach, Ractive$find, Ractive$findAll, Ractive$findAllComponents, Ractive$findComponent, Ractive$fire, Ractive$get, Ractive$insert, Ractive$merge, Ractive$observe, Ractive$off, Ractive$on, Ractive$pop, Ractive$push, Ractive$render, Ractive$reset, Ractive$resetTemplate, Ractive$reverse, Ractive$set, Ractive$shift, Ractive$sort, Ractive$splice, Ractive$subtract, Ractive$teardown, Ractive$toggle, Ractive$toHTML, Ractive$unrender, Ractive$unshift, Ractive$update, Ractive$updateModel );

  /* utils/getGuid.js */
  var getGuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function( c ) {
      var r, v;
      r = Math.random() * 16 | 0;
      v = c == 'x' ? r : r & 3 | 8;
      return v.toString( 16 );
    } );
  };

  /* utils/getNextNumber.js */
  var getNextNumber = function() {

    var i = 0;
    return function() {
      return 'r-' + i++;
    };
  }();

  /* Ractive/prototype/shared/hooks/HookQueue.js */
  var Ractive$shared_hooks_HookQueue = function( Hook ) {

    function HookQueue( event ) {
      this.hook = new Hook( event );
      this.inProcess = {};
      this.queue = {};
    }
    HookQueue.prototype = {
      constructor: HookQueue,
      begin: function( ractive ) {
        this.inProcess[ ractive._guid ] = true;
      },
      end: function( ractive ) {
        var parent = ractive._parent;
        // If this is *isn't* a child of a component that's in process,
        // it should call methods or fire at this point
        if ( !parent || !this.inProcess[ parent._guid ] ) {
          fire( this, ractive );
        } else {
          getChildQueue( this.queue, parent ).push( ractive );
        }
        delete this.inProcess[ ractive._guid ];
      }
    };

    function getChildQueue( queue, ractive ) {
      return queue[ ractive._guid ] || ( queue[ ractive._guid ] = [] );
    }

    function fire( hookQueue, ractive ) {
      var childQueue = getChildQueue( hookQueue.queue, ractive );
      hookQueue.hook.fire( ractive );
      // queue is "live" because components can end up being
      // added while hooks fire on parents that modify data values.
      while ( childQueue.length ) {
        fire( hookQueue, childQueue.shift() );
      }
      delete hookQueue.queue[ ractive._guid ];
    }
    return HookQueue;
  }( Ractive$shared_hooks_Hook );

  /* viewmodel/prototype/get/arrayAdaptor/processWrapper.js */
  var viewmodel$get_arrayAdaptor_processWrapper = function( wrapper, array, methodName, newIndices ) {
    var root = wrapper.root,
      keypath = wrapper.keypath;
    // If this is a sort or reverse, we just do root.set()...
    // TODO use merge logic?
    if ( methodName === 'sort' || methodName === 'reverse' ) {
      root.viewmodel.set( keypath, array );
      return;
    }
    root.viewmodel.smartUpdate( keypath, array, newIndices );
  };

  /* viewmodel/prototype/get/arrayAdaptor/patch.js */
  var viewmodel$get_arrayAdaptor_patch = function( runloop, defineProperty, getNewIndices, processWrapper ) {

    var patchedArrayProto = [],
      mutatorMethods = [
        'pop',
        'push',
        'reverse',
        'shift',
        'sort',
        'splice',
        'unshift'
      ],
      testObj, patchArrayMethods, unpatchArrayMethods;
    mutatorMethods.forEach( function( methodName ) {
      var method = function() {
        var SLICE$0 = Array.prototype.slice;
        var args = SLICE$0.call( arguments, 0 );
        var newIndices, result, wrapper, i;
        newIndices = getNewIndices( this, methodName, args );
        // apply the underlying method
        result = Array.prototype[ methodName ].apply( this, arguments );
        // trigger changes
        runloop.start();
        this._ractive.setting = true;
        i = this._ractive.wrappers.length;
        while ( i-- ) {
          wrapper = this._ractive.wrappers[ i ];
          runloop.addViewmodel( wrapper.root.viewmodel );
          processWrapper( wrapper, this, methodName, newIndices );
        }
        runloop.end();
        this._ractive.setting = false;
        return result;
      };
      defineProperty( patchedArrayProto, methodName, {
        value: method
      } );
    } );
    // can we use prototype chain injection?
    // http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/#wrappers_prototype_chain_injection
    testObj = {};
    if ( testObj.__proto__ ) {
      // yes, we can
      patchArrayMethods = function( array ) {
        array.__proto__ = patchedArrayProto;
      };
      unpatchArrayMethods = function( array ) {
        array.__proto__ = Array.prototype;
      };
    } else {
      // no, we can't
      patchArrayMethods = function( array ) {
        var i, methodName;
        i = mutatorMethods.length;
        while ( i-- ) {
          methodName = mutatorMethods[ i ];
          defineProperty( array, methodName, {
            value: patchedArrayProto[ methodName ],
            configurable: true
          } );
        }
      };
      unpatchArrayMethods = function( array ) {
        var i;
        i = mutatorMethods.length;
        while ( i-- ) {
          delete array[ mutatorMethods[ i ] ];
        }
      };
    }
    patchArrayMethods.unpatch = unpatchArrayMethods;
    return patchArrayMethods;
  }( runloop, defineProperty, getNewIndices, viewmodel$get_arrayAdaptor_processWrapper );

  /* viewmodel/prototype/get/arrayAdaptor.js */
  var viewmodel$get_arrayAdaptor = function( defineProperty, isArray, patch ) {

    var arrayAdaptor,
      // helpers
      ArrayWrapper, errorMessage;
    arrayAdaptor = {
      filter: function( object ) {
        // wrap the array if a) b) it's an array, and b) either it hasn't been wrapped already,
        // or the array didn't trigger the get() itself
        return isArray( object ) && ( !object._ractive || !object._ractive.setting );
      },
      wrap: function( ractive, array, keypath ) {
        return new ArrayWrapper( ractive, array, keypath );
      }
    };
    ArrayWrapper = function( ractive, array, keypath ) {
      this.root = ractive;
      this.value = array;
      this.keypath = keypath;
      // if this array hasn't already been ractified, ractify it
      if ( !array._ractive ) {
        // define a non-enumerable _ractive property to store the wrappers
        defineProperty( array, '_ractive', {
          value: {
            wrappers: [],
            instances: [],
            setting: false
          },
          configurable: true
        } );
        patch( array );
      }
      // store the ractive instance, so we can handle transitions later
      if ( !array._ractive.instances[ ractive._guid ] ) {
        array._ractive.instances[ ractive._guid ] = 0;
        array._ractive.instances.push( ractive );
      }
      array._ractive.instances[ ractive._guid ] += 1;
      array._ractive.wrappers.push( this );
    };
    ArrayWrapper.prototype = {
      get: function() {
        return this.value;
      },
      teardown: function() {
        var array, storage, wrappers, instances, index;
        array = this.value;
        storage = array._ractive;
        wrappers = storage.wrappers;
        instances = storage.instances;
        // if teardown() was invoked because we're clearing the cache as a result of
        // a change that the array itself triggered, we can save ourselves the teardown
        // and immediate setup
        if ( storage.setting ) {
          return false;
        }
        index = wrappers.indexOf( this );
        if ( index === -1 ) {
          throw new Error( errorMessage );
        }
        wrappers.splice( index, 1 );
        // if nothing else depends on this array, we can revert it to its
        // natural state
        if ( !wrappers.length ) {
          delete array._ractive;
          patch.unpatch( this.value );
        } else {
          // remove ractive instance if possible
          instances[ this.root._guid ] -= 1;
          if ( !instances[ this.root._guid ] ) {
            index = instances.indexOf( this.root );
            if ( index === -1 ) {
              throw new Error( errorMessage );
            }
            instances.splice( index, 1 );
          }
        }
      }
    };
    errorMessage = 'Something went wrong in a rather interesting way';
    return arrayAdaptor;
  }( defineProperty, isArray, viewmodel$get_arrayAdaptor_patch );

  /* viewmodel/prototype/get/magicArrayAdaptor.js */
  var viewmodel$get_magicArrayAdaptor = function( magicAdaptor, arrayAdaptor ) {

    var magicArrayAdaptor, MagicArrayWrapper;
    if ( magicAdaptor ) {
      magicArrayAdaptor = {
        filter: function( object, keypath, ractive ) {
          return magicAdaptor.filter( object, keypath, ractive ) && arrayAdaptor.filter( object );
        },
        wrap: function( ractive, array, keypath ) {
          return new MagicArrayWrapper( ractive, array, keypath );
        }
      };
      MagicArrayWrapper = function( ractive, array, keypath ) {
        this.value = array;
        this.magic = true;
        this.magicWrapper = magicAdaptor.wrap( ractive, array, keypath );
        this.arrayWrapper = arrayAdaptor.wrap( ractive, array, keypath );
      };
      MagicArrayWrapper.prototype = {
        get: function() {
          return this.value;
        },
        teardown: function() {
          this.arrayWrapper.teardown();
          this.magicWrapper.teardown();
        },
        reset: function( value ) {
          return this.magicWrapper.reset( value );
        }
      };
    }
    return magicArrayAdaptor;
  }( viewmodel$get_magicAdaptor, viewmodel$get_arrayAdaptor );

  /* viewmodel/prototype/adapt.js */
  var viewmodel$adapt = function( config, arrayAdaptor, log, magicAdaptor, magicArrayAdaptor ) {

    var __export;
    var prefixers = {};
    __export = function Viewmodel$adapt( keypath, value ) {
      var ractive = this.ractive,
        len, i, adaptor, wrapped;
      // Do we have an adaptor for this value?
      len = ractive.adapt.length;
      for ( i = 0; i < len; i += 1 ) {
        adaptor = ractive.adapt[ i ];
        // Adaptors can be specified as e.g. [ 'Backbone.Model', 'Backbone.Collection' ] -
        // we need to get the actual adaptor if that's the case
        if ( typeof adaptor === 'string' ) {
          var found = config.registries.adaptors.find( ractive, adaptor );
          if ( !found ) {
            // will throw. "return" for safety, if we downgrade :)
            return log.critical( {
              debug: ractive.debug,
              message: 'missingPlugin',
              args: {
                plugin: 'adaptor',
                name: adaptor
              }
            } );
          }
          adaptor = ractive.adapt[ i ] = found;
        }
        if ( adaptor.filter( value, keypath, ractive ) ) {
          wrapped = this.wrapped[ keypath ] = adaptor.wrap( ractive, value, keypath, getPrefixer( keypath ) );
          wrapped.value = value;
          return value;
        }
      }
      if ( ractive.magic ) {
        if ( magicArrayAdaptor.filter( value, keypath, ractive ) ) {
          this.wrapped[ keypath ] = magicArrayAdaptor.wrap( ractive, value, keypath );
        } else if ( magicAdaptor.filter( value, keypath, ractive ) ) {
          this.wrapped[ keypath ] = magicAdaptor.wrap( ractive, value, keypath );
        }
      } else if ( ractive.modifyArrays && arrayAdaptor.filter( value, keypath, ractive ) ) {
        this.wrapped[ keypath ] = arrayAdaptor.wrap( ractive, value, keypath );
      }
      return value;
    };

    function prefixKeypath( obj, prefix ) {
      var prefixed = {},
        key;
      if ( !prefix ) {
        return obj;
      }
      prefix += '.';
      for ( key in obj ) {
        if ( obj.hasOwnProperty( key ) ) {
          prefixed[ prefix + key ] = obj[ key ];
        }
      }
      return prefixed;
    }

    function getPrefixer( rootKeypath ) {
      var rootDot;
      if ( !prefixers[ rootKeypath ] ) {
        rootDot = rootKeypath ? rootKeypath + '.' : '';
        prefixers[ rootKeypath ] = function( relativeKeypath, value ) {
          var obj;
          if ( typeof relativeKeypath === 'string' ) {
            obj = {};
            obj[ rootDot + relativeKeypath ] = value;
            return obj;
          }
          if ( typeof relativeKeypath === 'object' ) {
            // 'relativeKeypath' is in fact a hash, not a keypath
            return rootDot ? prefixKeypath( relativeKeypath, rootKeypath ) : relativeKeypath;
          }
        };
      }
      return prefixers[ rootKeypath ];
    }
    return __export;
  }( config, viewmodel$get_arrayAdaptor, log, viewmodel$get_magicAdaptor, viewmodel$get_magicArrayAdaptor );

  /* viewmodel/helpers/getUpstreamChanges.js */
  var getUpstreamChanges = function getUpstreamChanges( changes ) {
    var upstreamChanges = [ '' ],
      i, keypath, keys, upstreamKeypath;
    i = changes.length;
    while ( i-- ) {
      keypath = changes[ i ];
      keys = keypath.split( '.' );
      while ( keys.length > 1 ) {
        keys.pop();
        upstreamKeypath = keys.join( '.' );
        if ( upstreamChanges.indexOf( upstreamKeypath ) === -1 ) {
          upstreamChanges.push( upstreamKeypath );
        }
      }
    }
    return upstreamChanges;
  };

  /* viewmodel/prototype/applyChanges/getPotentialWildcardMatches.js */
  var viewmodel$applyChanges_getPotentialWildcardMatches = function() {

    var __export;
    var starMaps = {};
    // This function takes a keypath such as 'foo.bar.baz', and returns
    // all the variants of that keypath that include a wildcard in place
    // of a key, such as 'foo.bar.*', 'foo.*.baz', 'foo.*.*' and so on.
    // These are then checked against the dependants map (ractive.viewmodel.depsMap)
    // to see if any pattern observers are downstream of one or more of
    // these wildcard keypaths (e.g. 'foo.bar.*.status')
    __export = function getPotentialWildcardMatches( keypath ) {
      var keys, starMap, mapper, result;
      keys = keypath.split( '.' );
      starMap = getStarMap( keys.length );
      mapper = function( star, i ) {
        return star ? '*' : keys[ i ];
      };
      result = starMap.map( function( mask ) {
        return mask.map( mapper ).join( '.' );
      } );
      return result;
    };
    // This function returns all the possible true/false combinations for
    // a given number - e.g. for two, the possible combinations are
    // [ true, true ], [ true, false ], [ false, true ], [ false, false ].
    // It does so by getting all the binary values between 0 and e.g. 11
    function getStarMap( length ) {
      var ones = '',
        max, binary, starMap, mapper, i;
      if ( !starMaps[ length ] ) {
        starMap = [];
        while ( ones.length < length ) {
          ones += 1;
        }
        max = parseInt( ones, 2 );
        mapper = function( digit ) {
          return digit === '1';
        };
        for ( i = 0; i <= max; i += 1 ) {
          binary = i.toString( 2 );
          while ( binary.length < length ) {
            binary = '0' + binary;
          }
          starMap[ i ] = Array.prototype.map.call( binary, mapper );
        }
        starMaps[ length ] = starMap;
      }
      return starMaps[ length ];
    }
    return __export;
  }();

  /* viewmodel/prototype/applyChanges/notifyPatternObservers.js */
  var viewmodel$applyChanges_notifyPatternObservers = function( getPotentialWildcardMatches ) {

    var __export;
    var lastKey = /[^\.]+$/;
    __export = notifyPatternObservers;

    function notifyPatternObservers( viewmodel, keypath, onlyDirect ) {
      var potentialWildcardMatches;
      updateMatchingPatternObservers( viewmodel, keypath );
      if ( onlyDirect ) {
        return;
      }
      potentialWildcardMatches = getPotentialWildcardMatches( keypath );
      potentialWildcardMatches.forEach( function( upstreamPattern ) {
        cascade( viewmodel, upstreamPattern, keypath );
      } );
    }

    function cascade( viewmodel, upstreamPattern, keypath ) {
      var group, map, actualChildKeypath;
      group = viewmodel.depsMap.patternObservers;
      map = group[ upstreamPattern ];
      if ( map ) {
        map.forEach( function( childKeypath ) {
          var key = lastKey.exec( childKeypath )[ 0 ];
          // 'baz'
          actualChildKeypath = keypath ? keypath + '.' + key : key;
          // 'foo.bar.baz'
          updateMatchingPatternObservers( viewmodel, actualChildKeypath );
          cascade( viewmodel, childKeypath, actualChildKeypath );
        } );
      }
    }

    function updateMatchingPatternObservers( viewmodel, keypath ) {
      viewmodel.patternObservers.forEach( function( observer ) {
        if ( observer.regex.test( keypath ) ) {
          observer.update( keypath );
        }
      } );
    }
    return __export;
  }( viewmodel$applyChanges_getPotentialWildcardMatches );

  /* viewmodel/prototype/applyChanges.js */
  var viewmodel$applyChanges = function( getUpstreamChanges, notifyPatternObservers ) {

    var __export;
    __export = function Viewmodel$applyChanges() {
      var this$0 = this;
      var self = this,
        changes, upstreamChanges, hash = {};
      changes = this.changes;
      if ( !changes.length ) {
        // TODO we end up here on initial render. Perhaps we shouldn't?
        return;
      }

      function cascade( keypath ) {
        var map, dependants, keys;
        if ( self.noCascade.hasOwnProperty( keypath ) ) {
          return;
        }
        if ( dependants = self.deps.computed[ keypath ] ) {
          dependants.forEach( invalidate );
          keys = dependants.map( getKey );
          keys.forEach( mark );
          keys.forEach( cascade );
        }
        if ( map = self.depsMap.computed[ keypath ] ) {
          map.forEach( cascade );
        }
      }

      function mark( keypath ) {
        self.mark( keypath );
      }
      changes.forEach( cascade );
      upstreamChanges = getUpstreamChanges( changes );
      upstreamChanges.forEach( function( keypath ) {
        var dependants, keys;
        if ( dependants = self.deps.computed[ keypath ] ) {
          dependants.forEach( invalidate );
          keys = dependants.map( getKey );
          keys.forEach( mark );
          keys.forEach( cascade );
        }
      } );
      this.changes = [];
      // Pattern observers are a weird special case
      if ( this.patternObservers.length ) {
        upstreamChanges.forEach( function( keypath ) {
          return notifyPatternObservers( this$0, keypath, true );
        } );
        changes.forEach( function( keypath ) {
          return notifyPatternObservers( this$0, keypath );
        } );
      }
      if ( this.deps.observers ) {
        upstreamChanges.forEach( function( keypath ) {
          return notifyUpstreamDependants( this$0, null, keypath, 'observers' );
        } );
        notifyAllDependants( this, changes, 'observers' );
      }
      if ( this.deps[ 'default' ] ) {
        var bindings = [];
        upstreamChanges.forEach( function( keypath ) {
          return notifyUpstreamDependants( this$0, bindings, keypath, 'default' );
        } );
        if ( bindings.length ) {
          notifyBindings( this, bindings, changes );
        }
        notifyAllDependants( this, changes, 'default' );
      }
      // Return a hash of keypaths to updated values
      changes.forEach( function( keypath ) {
        hash[ keypath ] = this$0.get( keypath );
      } );
      this.implicitChanges = {};
      this.noCascade = {};
      return hash;
    };

    function invalidate( computation ) {
      computation.invalidate();
    }

    function getKey( computation ) {
      return computation.key;
    }

    function notifyUpstreamDependants( viewmodel, bindings, keypath, groupName ) {
      var dependants, value;
      if ( dependants = findDependants( viewmodel, keypath, groupName ) ) {
        value = viewmodel.get( keypath );
        dependants.forEach( function( d ) {
          // don't "set" the parent value, refine it
          // i.e. not data = value, but data[foo] = fooValue
          if ( bindings && d.refineValue ) {
            bindings.push( d );
          } else {
            d.setValue( value );
          }
        } );
      }
    }

    function notifyBindings( viewmodel, bindings, changes ) {
      bindings.forEach( function( binding ) {
        var useSet = false,
          i = 0,
          length = changes.length,
          refinements = [];
        while ( i < length ) {
          var keypath = changes[ i ];
          if ( keypath === binding.keypath ) {
            useSet = true;
            break;
          }
          if ( keypath.slice( 0, binding.keypath.length ) === binding.keypath ) {
            refinements.push( keypath );
          }
          i++;
        }
        if ( useSet ) {
          binding.setValue( viewmodel.get( binding.keypath ) );
        }
        if ( refinements.length ) {
          binding.refineValue( refinements );
        }
      } );
    }

    function notifyAllDependants( viewmodel, keypaths, groupName ) {
      var queue = [];
      addKeypaths( keypaths );
      queue.forEach( dispatch );

      function addKeypaths( keypaths ) {
        keypaths.forEach( addKeypath );
        keypaths.forEach( cascade );
      }

      function addKeypath( keypath ) {
        var deps = findDependants( viewmodel, keypath, groupName );
        if ( deps ) {
          queue.push( {
            keypath: keypath,
            deps: deps
          } );
        }
      }

      function cascade( keypath ) {
        var childDeps;
        if ( childDeps = viewmodel.depsMap[ groupName ][ keypath ] ) {
          addKeypaths( childDeps );
        }
      }

      function dispatch( set ) {
        var value = viewmodel.get( set.keypath );
        set.deps.forEach( function( d ) {
          return d.setValue( value );
        } );
      }
    }

    function findDependants( viewmodel, keypath, groupName ) {
      var group = viewmodel.deps[ groupName ];
      return group ? group[ keypath ] : null;
    }
    return __export;
  }( getUpstreamChanges, viewmodel$applyChanges_notifyPatternObservers );

  /* viewmodel/prototype/capture.js */
  var viewmodel$capture = function Viewmodel$capture() {
    this.captureGroups.push( [] );
  };

  /* viewmodel/prototype/clearCache.js */
  var viewmodel$clearCache = function Viewmodel$clearCache( keypath, dontTeardownWrapper ) {
    var cacheMap, wrapper;
    if ( !dontTeardownWrapper ) {
      // Is there a wrapped property at this keypath?
      if ( wrapper = this.wrapped[ keypath ] ) {
        // Did we unwrap it?
        if ( wrapper.teardown() !== false ) {
          // Is this right?
          // What's the meaning of returning false from teardown?
          // Could there be a GC ramification if this is a "real" ractive.teardown()?
          this.wrapped[ keypath ] = null;
        }
      }
    }
    this.cache[ keypath ] = undefined;
    if ( cacheMap = this.cacheMap[ keypath ] ) {
      while ( cacheMap.length ) {
        this.clearCache( cacheMap.pop() );
      }
    }
  };

  /* viewmodel/Computation/getComputationSignature.js */
  var getComputationSignature = function() {

    var __export;
    var pattern = /\$\{([^\}]+)\}/g;
    __export = function( signature ) {
      if ( typeof signature === 'function' ) {
        return {
          get: signature
        };
      }
      if ( typeof signature === 'string' ) {
        return {
          get: createFunctionFromString( signature )
        };
      }
      if ( typeof signature === 'object' && typeof signature.get === 'string' ) {
        signature = {
          get: createFunctionFromString( signature.get ),
          set: signature.set
        };
      }
      return signature;
    };

    function createFunctionFromString( signature ) {
      var functionBody = 'var __ractive=this;return(' + signature.replace( pattern, function( match, keypath ) {
        return '__ractive.get("' + keypath + '")';
      } ) + ')';
      return new Function( functionBody );
    }
    return __export;
  }();

  /* viewmodel/Computation/Computation.js */
  var Computation = function( log, isEqual ) {

    var Computation = function( ractive, key, signature ) {
      var this$0 = this;
      this.ractive = ractive;
      this.viewmodel = ractive.viewmodel;
      this.key = key;
      this.getter = signature.get;
      this.setter = signature.set;
      this.hardDeps = signature.deps || [];
      this.softDeps = [];
      this.depValues = {};
      if ( this.hardDeps ) {
        this.hardDeps.forEach( function( d ) {
          return ractive.viewmodel.register( d, this$0, 'computed' );
        } );
      }
      this._dirty = this._firstRun = true;
    };
    Computation.prototype = {
      constructor: Computation,
      init: function() {
        var initial;
        this.bypass = true;
        initial = this.ractive.viewmodel.get( this.key );
        this.ractive.viewmodel.clearCache( this.key );
        this.bypass = false;
        if ( this.setter && initial !== undefined ) {
          this.set( initial );
        }
      },
      invalidate: function() {
        this._dirty = true;
      },
      get: function() {
        var this$0 = this;
        var ractive, newDeps, dependenciesChanged, dependencyValuesChanged = false;
        if ( this.getting ) {
          // prevent double-computation (e.g. caused by array mutation inside computation)
          return;
        }
        this.getting = true;
        if ( this._dirty ) {
          ractive = this.ractive;
          // determine whether the inputs have changed, in case this depends on
          // other computed values
          if ( this._firstRun || !this.hardDeps.length && !this.softDeps.length ) {
            dependencyValuesChanged = true;
          } else {
            [
              this.hardDeps,
              this.softDeps
            ].forEach( function( deps ) {
              var keypath, value, i;
              if ( dependencyValuesChanged ) {
                return;
              }
              i = deps.length;
              while ( i-- ) {
                keypath = deps[ i ];
                value = ractive.viewmodel.get( keypath );
                if ( !isEqual( value, this$0.depValues[ keypath ] ) ) {
                  this$0.depValues[ keypath ] = value;
                  dependencyValuesChanged = true;
                  return;
                }
              }
            } );
          }
          if ( dependencyValuesChanged ) {
            ractive.viewmodel.capture();
            try {
              this.value = this.getter.call( ractive );
            } catch ( err ) {
              log.warn( {
                debug: ractive.debug,
                message: 'failedComputation',
                args: {
                  key: this.key,
                  err: err.message || err
                }
              } );
              this.value = void 0;
            }
            newDeps = ractive.viewmodel.release();
            dependenciesChanged = this.updateDependencies( newDeps );
            if ( dependenciesChanged ) {
              [
                this.hardDeps,
                this.softDeps
              ].forEach( function( deps ) {
                deps.forEach( function( keypath ) {
                  this$0.depValues[ keypath ] = ractive.viewmodel.get( keypath );
                } );
              } );
            }
          }
          this._dirty = false;
        }
        this.getting = this._firstRun = false;
        return this.value;
      },
      set: function( value ) {
        if ( this.setting ) {
          this.value = value;
          return;
        }
        if ( !this.setter ) {
          throw new Error( 'Computed properties without setters are read-only. (This may change in a future version of Ractive!)' );
        }
        this.setter.call( this.ractive, value );
      },
      updateDependencies: function( newDeps ) {
        var i, oldDeps, keypath, dependenciesChanged;
        oldDeps = this.softDeps;
        // remove dependencies that are no longer used
        i = oldDeps.length;
        while ( i-- ) {
          keypath = oldDeps[ i ];
          if ( newDeps.indexOf( keypath ) === -1 ) {
            dependenciesChanged = true;
            this.viewmodel.unregister( keypath, this, 'computed' );
          }
        }
        // create references for any new dependencies
        i = newDeps.length;
        while ( i-- ) {
          keypath = newDeps[ i ];
          if ( oldDeps.indexOf( keypath ) === -1 && ( !this.hardDeps || this.hardDeps.indexOf( keypath ) === -1 ) ) {
            dependenciesChanged = true;
            this.viewmodel.register( keypath, this, 'computed' );
          }
        }
        if ( dependenciesChanged ) {
          this.softDeps = newDeps.slice();
        }
        return dependenciesChanged;
      }
    };
    return Computation;
  }( log, isEqual );

  /* viewmodel/prototype/compute.js */
  var viewmodel$compute = function( getComputationSignature, Computation ) {

    return function Viewmodel$compute( key, signature ) {
      signature = getComputationSignature( signature );
      return this.computations[ key ] = new Computation( this.ractive, key, signature );
    };
  }( getComputationSignature, Computation );

  /* viewmodel/prototype/get/FAILED_LOOKUP.js */
  var viewmodel$get_FAILED_LOOKUP = {
    FAILED_LOOKUP: true
  };

  /* viewmodel/prototype/get/UnresolvedImplicitDependency.js */
  var viewmodel$get_UnresolvedImplicitDependency = function( removeFromArray, runloop ) {

    var empty = {};
    var UnresolvedImplicitDependency = function( viewmodel, keypath ) {
      this.viewmodel = viewmodel;
      this.root = viewmodel.ractive;
      // TODO eliminate this
      this.ref = keypath;
      this.parentFragment = empty;
      viewmodel.unresolvedImplicitDependencies[ keypath ] = true;
      viewmodel.unresolvedImplicitDependencies.push( this );
      runloop.addUnresolved( this );
    };
    UnresolvedImplicitDependency.prototype = {
      resolve: function() {
        this.viewmodel.mark( this.ref );
        this.viewmodel.unresolvedImplicitDependencies[ this.ref ] = false;
        removeFromArray( this.viewmodel.unresolvedImplicitDependencies, this );
      },
      teardown: function() {
        runloop.removeUnresolved( this );
      }
    };
    return UnresolvedImplicitDependency;
  }( removeFromArray, runloop );

  /* viewmodel/prototype/get.js */
  var viewmodel$get = function( isNumeric, FAILED_LOOKUP, UnresolvedImplicitDependency ) {

    var __export;
    var empty = {};
    __export = function Viewmodel$get( keypath ) {
      var options = arguments[ 1 ];
      if ( options === void 0 )
        options = empty;
      var ractive = this.ractive,
        cache = this.cache,
        value, computation, wrapped, captureGroup;
      if ( keypath[ 0 ] === '@' ) {
        value = keypath.slice( 1 );
        return isNumeric( value ) ? +value : value;
      }
      if ( cache[ keypath ] === undefined ) {
        // Is this a computed property?
        if ( ( computation = this.computations[ keypath ] ) && !computation.bypass ) {
          value = computation.get();
          this.adapt( keypath, value );
        } else if ( wrapped = this.wrapped[ keypath ] ) {
          value = wrapped.value;
        } else if ( !keypath ) {
          this.adapt( '', ractive.data );
          value = ractive.data;
        } else {
          value = retrieve( this, keypath );
        }
        cache[ keypath ] = value;
      } else {
        value = cache[ keypath ];
      }
      if ( options.evaluateWrapped && ( wrapped = this.wrapped[ keypath ] ) ) {
        value = wrapped.get();
      }
      // capture the keypath, if we're inside a computation
      if ( options.capture && ( captureGroup = this.captureGroups[ this.captureGroups.length - 1 ] ) ) {
        if ( !~captureGroup.indexOf( keypath ) ) {
          captureGroup.push( keypath );
          // if we couldn't resolve the keypath, we need to make it as a failed
          // lookup, so that the computation updates correctly once we CAN
          // resolve the keypath
          if ( value === FAILED_LOOKUP && this.unresolvedImplicitDependencies[ keypath ] !== true ) {
            new UnresolvedImplicitDependency( this, keypath );
          }
        }
      }
      return value === FAILED_LOOKUP ? void 0 : value;
    };

    function retrieve( viewmodel, keypath ) {
      var keys, key, parentKeypath, parentValue, cacheMap, value, wrapped;
      keys = keypath.split( '.' );
      key = keys.pop();
      parentKeypath = keys.join( '.' );
      parentValue = viewmodel.get( parentKeypath );
      if ( wrapped = viewmodel.wrapped[ parentKeypath ] ) {
        parentValue = wrapped.get();
      }
      if ( parentValue === null || parentValue === undefined ) {
        return;
      }
      // update cache map
      if ( !( cacheMap = viewmodel.cacheMap[ parentKeypath ] ) ) {
        viewmodel.cacheMap[ parentKeypath ] = [ keypath ];
      } else {
        if ( cacheMap.indexOf( keypath ) === -1 ) {
          cacheMap.push( keypath );
        }
      }
      // If this property doesn't exist, we return a sentinel value
      // so that we know to query parent scope (if such there be)
      if ( typeof parentValue === 'object' && !( key in parentValue ) ) {
        return viewmodel.cache[ keypath ] = FAILED_LOOKUP;
      }
      value = parentValue[ key ];
      // Do we have an adaptor for this value?
      viewmodel.adapt( keypath, value, false );
      // Update cache
      viewmodel.cache[ keypath ] = value;
      return value;
    }
    return __export;
  }( isNumeric, viewmodel$get_FAILED_LOOKUP, viewmodel$get_UnresolvedImplicitDependency );

  /* viewmodel/prototype/init.js */
  var viewmodel$init = function() {

    var __export;
    __export = function Viewmodel$init() {
      var key, computation, computations = [];
      for ( key in this.ractive.computed ) {
        computation = this.compute( key, this.ractive.computed[ key ] );
        computations.push( computation );
      }
      computations.forEach( init );
    };

    function init( computation ) {
      computation.init();
    }
    return __export;
  }();

  /* viewmodel/prototype/mark.js */
  var viewmodel$mark = function Viewmodel$mark( keypath, options ) {
    var computation;
    // implicit changes (i.e. `foo.length` on `ractive.push('foo',42)`)
    // should not be picked up by pattern observers
    if ( options ) {
      if ( options.implicit ) {
        this.implicitChanges[ keypath ] = true;
      }
      if ( options.noCascade ) {
        this.noCascade[ keypath ] = true;
      }
    }
    if ( computation = this.computations[ keypath ] ) {
      computation.invalidate();
    }
    if ( this.changes.indexOf( keypath ) === -1 ) {
      this.changes.push( keypath );
    }
    this.clearCache( keypath );
  };

  /* viewmodel/prototype/merge/mapOldToNewIndex.js */
  var viewmodel$merge_mapOldToNewIndex = function( oldArray, newArray ) {
    var usedIndices, firstUnusedIndex, newIndices, changed;
    usedIndices = {};
    firstUnusedIndex = 0;
    newIndices = oldArray.map( function( item, i ) {
      var index, start, len;
      start = firstUnusedIndex;
      len = newArray.length;
      do {
        index = newArray.indexOf( item, start );
        if ( index === -1 ) {
          changed = true;
          return -1;
        }
        start = index + 1;
      } while ( usedIndices[ index ] && start < len );
      // keep track of the first unused index, so we don't search
      // the whole of newArray for each item in oldArray unnecessarily
      if ( index === firstUnusedIndex ) {
        firstUnusedIndex += 1;
      }
      if ( index !== i ) {
        changed = true;
      }
      usedIndices[ index ] = true;
      return index;
    } );
    return newIndices;
  };

  /* viewmodel/prototype/merge.js */
  var viewmodel$merge = function( warn, mapOldToNewIndex ) {

    var __export;
    var comparators = {};
    __export = function Viewmodel$merge( keypath, currentArray, array, options ) {
      var oldArray, newArray, comparator, newIndices;
      this.mark( keypath );
      if ( options && options.compare ) {
        comparator = getComparatorFunction( options.compare );
        try {
          oldArray = currentArray.map( comparator );
          newArray = array.map( comparator );
        } catch ( err ) {
          // fallback to an identity check - worst case scenario we have
          // to do more DOM manipulation than we thought...
          // ...unless we're in debug mode of course
          if ( this.debug ) {
            throw err;
          } else {
            warn( 'Merge operation: comparison failed. Falling back to identity checking' );
          }
          oldArray = currentArray;
          newArray = array;
        }
      } else {
        oldArray = currentArray;
        newArray = array;
      }
      // find new indices for members of oldArray
      newIndices = mapOldToNewIndex( oldArray, newArray );
      this.smartUpdate( keypath, array, newIndices, currentArray.length !== array.length );
    };

    function stringify( item ) {
      return JSON.stringify( item );
    }

    function getComparatorFunction( comparator ) {
      // If `compare` is `true`, we use JSON.stringify to compare
      // objects that are the same shape, but non-identical - i.e.
      // { foo: 'bar' } !== { foo: 'bar' }
      if ( comparator === true ) {
        return stringify;
      }
      if ( typeof comparator === 'string' ) {
        if ( !comparators[ comparator ] ) {
          comparators[ comparator ] = function( item ) {
            return item[ comparator ];
          };
        }
        return comparators[ comparator ];
      }
      if ( typeof comparator === 'function' ) {
        return comparator;
      }
      throw new Error( 'The `compare` option must be a function, or a string representing an identifying field (or `true` to use JSON.stringify)' );
    }
    return __export;
  }( warn, viewmodel$merge_mapOldToNewIndex );

  /* viewmodel/prototype/register.js */
  var viewmodel$register = function() {

    var __export;
    __export = function Viewmodel$register( keypath, dependant ) {
      var group = arguments[ 2 ];
      if ( group === void 0 )
        group = 'default';
      var depsByKeypath, deps;
      if ( dependant.isStatic ) {
        return;
      }
      depsByKeypath = this.deps[ group ] || ( this.deps[ group ] = {} );
      deps = depsByKeypath[ keypath ] || ( depsByKeypath[ keypath ] = [] );
      deps.push( dependant );
      if ( !keypath ) {
        return;
      }
      updateDependantsMap( this, keypath, group );
    };

    function updateDependantsMap( viewmodel, keypath, group ) {
      var keys, parentKeypath, map, parent;
      // update dependants map
      keys = keypath.split( '.' );
      while ( keys.length ) {
        keys.pop();
        parentKeypath = keys.join( '.' );
        map = viewmodel.depsMap[ group ] || ( viewmodel.depsMap[ group ] = {} );
        parent = map[ parentKeypath ] || ( map[ parentKeypath ] = [] );
        if ( parent[ keypath ] === undefined ) {
          parent[ keypath ] = 0;
          parent.push( keypath );
        }
        parent[ keypath ] += 1;
        keypath = parentKeypath;
      }
    }
    return __export;
  }();

  /* viewmodel/prototype/release.js */
  var viewmodel$release = function Viewmodel$release() {
    return this.captureGroups.pop();
  };

  /* viewmodel/prototype/set.js */
  var viewmodel$set = function( isEqual, createBranch ) {

    var __export;
    __export = function Viewmodel$set( keypath, value, silent ) {
      var computation, wrapper, dontTeardownWrapper;
      computation = this.computations[ keypath ];
      if ( computation ) {
        if ( computation.setting ) {
          // let the other computation set() handle things...
          return;
        }
        computation.set( value );
        value = computation.get();
      }
      if ( isEqual( this.cache[ keypath ], value ) ) {
        return;
      }
      wrapper = this.wrapped[ keypath ];
      // If we have a wrapper with a `reset()` method, we try and use it. If the
      // `reset()` method returns false, the wrapper should be torn down, and
      // (most likely) a new one should be created later
      if ( wrapper && wrapper.reset ) {
        dontTeardownWrapper = wrapper.reset( value ) !== false;
        if ( dontTeardownWrapper ) {
          value = wrapper.get();
        }
      }
      if ( !computation && !dontTeardownWrapper ) {
        resolveSet( this, keypath, value );
      }
      if ( !silent ) {
        this.mark( keypath );
      } else {
        // We're setting a parent of the original target keypath (i.e.
        // creating a fresh branch) - we need to clear the cache, but
        // not mark it as a change
        this.clearCache( keypath );
      }
    };

    function resolveSet( viewmodel, keypath, value ) {
      var keys, lastKey, parentKeypath, wrapper, parentValue, wrapperSet, valueSet;
      wrapperSet = function() {
        if ( wrapper.set ) {
          wrapper.set( lastKey, value );
        } else {
          parentValue = wrapper.get();
          valueSet();
        }
      };
      valueSet = function() {
        if ( !parentValue ) {
          parentValue = createBranch( lastKey );
          viewmodel.set( parentKeypath, parentValue, true );
        }
        parentValue[ lastKey ] = value;
      };
      keys = keypath.split( '.' );
      lastKey = keys.pop();
      parentKeypath = keys.join( '.' );
      wrapper = viewmodel.wrapped[ parentKeypath ];
      if ( wrapper ) {
        wrapperSet();
      } else {
        parentValue = viewmodel.get( parentKeypath );
        // may have been wrapped via the above .get()
        // call on viewmodel if this is first access via .set()!
        if ( wrapper = viewmodel.wrapped[ parentKeypath ] ) {
          wrapperSet();
        } else {
          valueSet();
        }
      }
    }
    return __export;
  }( isEqual, createBranch );

  /* viewmodel/prototype/smartUpdate.js */
  var viewmodel$smartUpdate = function() {

    var __export;
    var implicitOption = {
        implicit: true
      },
      noCascadeOption = {
        noCascade: true
      };
    __export = function Viewmodel$smartUpdate( keypath, array, newIndices ) {
      var this$0 = this;
      var dependants, oldLength;
      oldLength = newIndices.length;
      // Indices that are being removed should be marked as dirty
      newIndices.forEach( function( newIndex, oldIndex ) {
        if ( newIndex === -1 ) {
          this$0.mark( keypath + '.' + oldIndex, noCascadeOption );
        }
      } );
      // Update the model
      // TODO allow existing array to be updated in place, rather than replaced?
      this.set( keypath, array, true );
      if ( dependants = this.deps[ 'default' ][ keypath ] ) {
        dependants.filter( canShuffle ).forEach( function( d ) {
          return d.shuffle( newIndices, array );
        } );
      }
      if ( oldLength !== array.length ) {
        this.mark( keypath + '.length', implicitOption );
        for ( var i = oldLength; i < array.length; i += 1 ) {
          this.mark( keypath + '.' + i );
        }
        // don't allow removed indexes beyond end of new array to trigger recomputations
        for ( var i$0 = array.length; i$0 < oldLength; i$0 += 1 ) {
          this.mark( keypath + '.' + i$0, noCascadeOption );
        }
      }
    };

    function canShuffle( dependant ) {
      return typeof dependant.shuffle === 'function';
    }
    return __export;
  }();

  /* viewmodel/prototype/teardown.js */
  var viewmodel$teardown = function Viewmodel$teardown() {
    var this$0 = this;
    var unresolvedImplicitDependency;
    // Clear entire cache - this has the desired side-effect
    // of unwrapping adapted values (e.g. arrays)
    Object.keys( this.cache ).forEach( function( keypath ) {
      return this$0.clearCache( keypath );
    } );
    // Teardown any failed lookups - we don't need them to resolve any more
    while ( unresolvedImplicitDependency = this.unresolvedImplicitDependencies.pop() ) {
      unresolvedImplicitDependency.teardown();
    }
  };

  /* viewmodel/prototype/unregister.js */
  var viewmodel$unregister = function() {

    var __export;
    __export = function Viewmodel$unregister( keypath, dependant ) {
      var group = arguments[ 2 ];
      if ( group === void 0 )
        group = 'default';
      var deps, index;
      if ( dependant.isStatic ) {
        return;
      }
      deps = this.deps[ group ][ keypath ];
      index = deps.indexOf( dependant );
      if ( index === -1 ) {
        throw new Error( 'Attempted to remove a dependant that was no longer registered! This should not happen. If you are seeing this bug in development please raise an issue at https://github.com/RactiveJS/Ractive/issues - thanks' );
      }
      deps.splice( index, 1 );
      if ( !keypath ) {
        return;
      }
      updateDependantsMap( this, keypath, group );
    };

    function updateDependantsMap( viewmodel, keypath, group ) {
      var keys, parentKeypath, map, parent;
      // update dependants map
      keys = keypath.split( '.' );
      while ( keys.length ) {
        keys.pop();
        parentKeypath = keys.join( '.' );
        map = viewmodel.depsMap[ group ];
        parent = map[ parentKeypath ];
        parent[ keypath ] -= 1;
        if ( !parent[ keypath ] ) {
          // remove from parent deps map
          parent.splice( parent.indexOf( keypath ), 1 );
          parent[ keypath ] = undefined;
        }
        keypath = parentKeypath;
      }
    }
    return __export;
  }();

  /* viewmodel/adaptConfig.js */
  var adaptConfig = function() {

    // should this be combined with prototype/adapt.js?
    var configure = {
      lookup: function( target, adaptors ) {
        var i, adapt = target.adapt;
        if ( !adapt || !adapt.length ) {
          return adapt;
        }
        if ( adaptors && Object.keys( adaptors ).length && ( i = adapt.length ) ) {
          while ( i-- ) {
            var adaptor = adapt[ i ];
            if ( typeof adaptor === 'string' ) {
              adapt[ i ] = adaptors[ adaptor ] || adaptor;
            }
          }
        }
        return adapt;
      },
      combine: function( parent, adapt ) {
        // normalize 'Foo' to [ 'Foo' ]
        parent = arrayIfString( parent );
        adapt = arrayIfString( adapt );
        // no parent? return adapt
        if ( !parent || !parent.length ) {
          return adapt;
        }
        // no adapt? return 'copy' of parent
        if ( !adapt || !adapt.length ) {
          return parent.slice();
        }
        // add parent adaptors to options
        parent.forEach( function( a ) {
          // don't put in duplicates
          if ( adapt.indexOf( a ) === -1 ) {
            adapt.push( a );
          }
        } );
        return adapt;
      }
    };

    function arrayIfString( adapt ) {
      if ( typeof adapt === 'string' ) {
        adapt = [ adapt ];
      }
      return adapt;
    }
    return configure;
  }();

  /* viewmodel/Viewmodel.js */
  var Viewmodel = function( create, adapt, applyChanges, capture, clearCache, compute, get, init, mark, merge, register, release, set, smartUpdate, teardown, unregister, adaptConfig ) {

    var noMagic;
    try {
      Object.defineProperty( {}, 'test', {
        value: 0
      } );
    } catch ( err ) {
      noMagic = true;
    }
    var Viewmodel = function( ractive ) {
      this.ractive = ractive;
      // TODO eventually, we shouldn't need this reference
      Viewmodel.extend( ractive.constructor, ractive );
      this.cache = {};
      // we need to be able to use hasOwnProperty, so can't inherit from null
      this.cacheMap = create( null );
      this.deps = {
        computed: {},
        'default': {}
      };
      this.depsMap = {
        computed: {},
        'default': {}
      };
      this.patternObservers = [];
      this.wrapped = create( null );
      this.computations = create( null );
      this.captureGroups = [];
      this.unresolvedImplicitDependencies = [];
      this.changes = [];
      this.implicitChanges = {};
      this.noCascade = {};
    };
    Viewmodel.extend = function( Parent, instance ) {
      if ( instance.magic && noMagic ) {
        throw new Error( 'Getters and setters (magic mode) are not supported in this browser' );
      }
      instance.adapt = adaptConfig.combine( Parent.prototype.adapt, instance.adapt ) || [];
      instance.adapt = adaptConfig.lookup( instance, instance.adaptors );
    };
    Viewmodel.prototype = {
      adapt: adapt,
      applyChanges: applyChanges,
      capture: capture,
      clearCache: clearCache,
      compute: compute,
      get: get,
      init: init,
      mark: mark,
      merge: merge,
      register: register,
      release: release,
      set: set,
      smartUpdate: smartUpdate,
      teardown: teardown,
      unregister: unregister
    };
    return Viewmodel;
  }( create, viewmodel$adapt, viewmodel$applyChanges, viewmodel$capture, viewmodel$clearCache, viewmodel$compute, viewmodel$get, viewmodel$init, viewmodel$mark, viewmodel$merge, viewmodel$register, viewmodel$release, viewmodel$set, viewmodel$smartUpdate, viewmodel$teardown, viewmodel$unregister, adaptConfig );

  /* Ractive/initialise.js */
  var Ractive_initialise = function( config, create, Fragment, getElement, getNextNumber, Hook, HookQueue, Viewmodel ) {

    var __export;
    var constructHook = new Hook( 'construct' ),
      configHook = new Hook( 'config' ),
      initHook = new HookQueue( 'init' );
    __export = function initialiseRactiveInstance( ractive ) {
      var options = arguments[ 1 ];
      if ( options === void 0 )
        options = {};
      var el;
      initialiseProperties( ractive, options );
      // make this option do what would be expected if someone
      // did include it on a new Ractive() or new Component() call.
      // Silly to do so (put a hook on the very options being used),
      // but handle it correctly, consistent with the intent.
      constructHook.fire( config.getConstructTarget( ractive, options ), options );
      // init config from Parent and options
      config.init( ractive.constructor, ractive, options );
      configHook.fire( ractive );
      // Teardown any existing instances *before* trying to set up the new one -
      // avoids certain weird bugs
      if ( el = getElement( ractive.el ) ) {
        if ( !ractive.append ) {
          if ( el.__ractive_instances__ ) {
            try {
              el.__ractive_instances__.splice( 0, el.__ractive_instances__.length ).forEach( function( r ) {
                return r.teardown();
              } );
            } catch ( err ) {}
          }
          el.innerHTML = '';
        }
      }
      initHook.begin( ractive );
      // TEMPORARY. This is so we can implement Viewmodel gradually
      ractive.viewmodel = new Viewmodel( ractive );
      // hacky circular problem until we get this sorted out
      // if viewmodel immediately processes computed properties,
      // they may call ractive.get, which calls ractive.viewmodel,
      // which hasn't been set till line above finishes.
      ractive.viewmodel.init();
      // Render our *root fragment*
      if ( ractive.template ) {
        ractive.fragment = new Fragment( {
          template: ractive.template,
          root: ractive,
          owner: ractive
        } );
      }
      initHook.end( ractive );
      // render automatically ( if `el` is specified )
      if ( el ) {
        ractive.render( el, ractive.append );
      }
    };

    function initialiseProperties( ractive, options ) {
      // Generate a unique identifier, for places where you'd use a weak map if it
      // existed
      ractive._guid = getNextNumber();
      // events
      ractive._subs = create( null );
      // storage for item configuration from instantiation to reset,
      // like dynamic functions or original values
      ractive._config = {};
      // two-way bindings
      ractive._twowayBindings = create( null );
      // animations (so we can stop any in progress at teardown)
      ractive._animations = [];
      // nodes registry
      ractive.nodes = {};
      // live queries
      ractive._liveQueries = [];
      ractive._liveComponentQueries = [];
      // If this is a component, store a reference to the parent
      if ( options._parent && options._component ) {
        ractive._parent = options._parent;
        ractive.component = options._component;
        // And store a reference to the instance on the component
        options._component.instance = ractive;
      }
    }
    return __export;
  }( config, create, Fragment, getElement, getNextNumber, Ractive$shared_hooks_Hook, Ractive$shared_hooks_HookQueue, Viewmodel );

  /* extend/unwrapExtended.js */
  var unwrapExtended = function( wrap, config, circular ) {

    var __export;
    var Ractive;
    circular.push( function() {
      Ractive = circular.Ractive;
    } );
    __export = function unwrapExtended( Child ) {
      if ( !( Child.prototype instanceof Ractive ) ) {
        return Child;
      }
      var options = {};
      while ( Child ) {
        config.registries.forEach( function( r ) {
          addRegistry( r.useDefaults ? Child.prototype : Child, options, r.name );
        } );
        Object.keys( Child.prototype ).forEach( function( key ) {
          if ( key === 'computed' ) {
            return;
          }
          var value = Child.prototype[ key ];
          if ( !( key in options ) ) {
            options[ key ] = value._method ? value._method : value;
          } else if ( typeof options[ key ] === 'function' && typeof value === 'function' && options[ key ]._method ) {
            var result, needsSuper = value._method;
            if ( needsSuper ) {
              value = value._method;
            }
            // rewrap bound directly to parent fn
            result = wrap( options[ key ]._method, value );
            if ( needsSuper ) {
              result._method = result;
            }
            options[ key ] = result;
          }
        } );
        if ( Child._parent !== Ractive ) {
          Child = Child._parent;
        } else {
          Child = false;
        }
      }
      return options;
    };

    function addRegistry( target, options, name ) {
      var registry, keys = Object.keys( target[ name ] );
      if ( !keys.length ) {
        return;
      }
      if ( !( registry = options[ name ] ) ) {
        registry = options[ name ] = {};
      }
      keys.filter( function( key ) {
        return !( key in registry );
      } ).forEach( function( key ) {
        return registry[ key ] = target[ name ][ key ];
      } );
    }
    return __export;
  }( wrapMethod, config, circular );

  /* extend/_extend.js */
  var Ractive_extend = function( create, defineProperties, getGuid, config, initialise, Viewmodel, unwrap ) {

    return function extend() {
      var options = arguments[ 0 ];
      if ( options === void 0 )
        options = {};
      var Parent = this,
        Child, proto, staticProperties;
      // if we're extending with another Ractive instance, inherit its
      // prototype methods and default options as well
      options = unwrap( options );
      // create Child constructor
      Child = function( options ) {
        initialise( this, options );
      };
      proto = create( Parent.prototype );
      proto.constructor = Child;
      staticProperties = {
        // each component needs a guid, for managing CSS etc
        _guid: {
          value: getGuid()
        },
        // alias prototype as defaults
        defaults: {
          value: proto
        },
        // extendable
        extend: {
          value: extend,
          writable: true,
          configurable: true
        },
        // Parent - for IE8, can't use Object.getPrototypeOf
        _parent: {
          value: Parent
        }
      };
      defineProperties( Child, staticProperties );
      // extend configuration
      config.extend( Parent, proto, options );
      Viewmodel.extend( Parent, proto );
      Child.prototype = proto;
      return Child;
    };
  }( create, defineProperties, getGuid, config, Ractive_initialise, Viewmodel, unwrapExtended );

  /* Ractive.js */
  var Ractive = function( defaults, easing, interpolators, svg, magic, defineProperties, proto, Promise, extendObj, extend, parse, initialise, circular ) {

    var Ractive, properties;
    // Main Ractive required object
    Ractive = function( options ) {
      initialise( this, options );
    };
    // Ractive properties
    properties = {
      // static methods:
      extend: {
        value: extend
      },
      parse: {
        value: parse
      },
      // Namespaced constructors
      Promise: {
        value: Promise
      },
      // support
      svg: {
        value: svg
      },
      magic: {
        value: magic
      },
      // version
      VERSION: {
        value: '0.6.1'
      },
      // Plugins
      adaptors: {
        writable: true,
        value: {}
      },
      components: {
        writable: true,
        value: {}
      },
      decorators: {
        writable: true,
        value: {}
      },
      easing: {
        writable: true,
        value: easing
      },
      events: {
        writable: true,
        value: {}
      },
      interpolators: {
        writable: true,
        value: interpolators
      },
      partials: {
        writable: true,
        value: {}
      },
      transitions: {
        writable: true,
        value: {}
      }
    };
    // Ractive properties
    defineProperties( Ractive, properties );
    Ractive.prototype = extendObj( proto, defaults );
    Ractive.prototype.constructor = Ractive;
    // alias prototype as defaults
    Ractive.defaults = Ractive.prototype;
    // Certain modules have circular dependencies. If we were bundling a
    // module loader, e.g. almond.js, this wouldn't be a problem, but we're
    // not - we're using amdclean as part of the build process. Because of
    // this, we need to wait until all modules have loaded before those
    // circular dependencies can be required.
    circular.Ractive = Ractive;
    while ( circular.length ) {
      circular.pop()();
    }
    // Ractive.js makes liberal use of things like Array.prototype.indexOf. In
    // older browsers, these are made available via a shim - here, we do a quick
    // pre-flight check to make sure that either a) we're not in a shit browser,
    // or b) we're using a Ractive-legacy.js build
    var FUNCTION = 'function';
    if ( typeof Date.now !== FUNCTION || typeof String.prototype.trim !== FUNCTION || typeof Object.keys !== FUNCTION || typeof Array.prototype.indexOf !== FUNCTION || typeof Array.prototype.forEach !== FUNCTION || typeof Array.prototype.map !== FUNCTION || typeof Array.prototype.filter !== FUNCTION || typeof window !== 'undefined' && typeof window.addEventListener !== FUNCTION ) {
      throw new Error( 'It looks like you\'re attempting to use Ractive.js in an older browser. You\'ll need to use one of the \'legacy builds\' in order to continue - see http://docs.ractivejs.org/latest/legacy-builds for more information.' );
    }
    return Ractive;
  }( options, easing, interpolators, svg, magic, defineProperties, prototype, Promise, extend, Ractive_extend, parse, Ractive_initialise, circular );


  // export as Common JS module...
  if ( typeof module !== "undefined" && module.exports ) {
    module.exports = Ractive;
  }

  // ... or as AMD module
  else if ( typeof define === "function" && define.amd ) {
    define( function() {
      return Ractive;
    } );
  }

  // ... or as browser global
  global.Ractive = Ractive;

  Ractive.noConflict = function() {
    global.Ractive = noConflict;
    return Ractive;
  };

}( typeof window !== 'undefined' ? window : this ) );
var ReportView = (function() {

  function ReportView(options, pdfComponent) {
    this.data = options || {};
    this.pdfComponent = pdfComponent
  }

  ReportView.prototype.render = function(report) {

    this.data.report = report;

    this.ractive = new Ractive({
      el:       "#report",
      template: Templates[report.data.template],
      partials: Templates,
      data:     this.data,
      components: {
        pdfbutton: this.pdfComponent
      }
    });
  };

  ReportView.prototype.updateData = function(data) {
    this.ractive.set("report.data", data);
  };

  ReportView.prototype.updateSignatories = function(signatories) {
    this.ractive.set("report.signatories", signatories);
  };

  return ReportView;
})();

var PDF = (function($){

  function l(arg) {
    // console.log(arg);
    return arg;
  }

  var pdfButton = null;
  function getPdfButton() {
    if (pdfButton === null) {

      pdfButton = Ractive.extend({
        clicked: false,
        firstStatus: false,
        url: null,
        isolated: true,
        template: Templates['pdf'],
        data: {
          processing: false,
          outage: false
        },
        getStatus: function() {
          var self = this;
          l("get pdf status");
          return $.get("pdf",function( data ) {
            self.set('outage',false);
            self.firstStatus = true
            if (data.status === "Completed") {
              l("pdf completed - "+data.url);
              self.url = data.url;
              if (self.clicked) {
                setTimeout(function(){
                  window.location.href = self.url;
                },500);
              }
            } else if (data.status === "Processing") {
              l("pdf processing");
              self.set("processing",true);
              setTimeout(self.getStatus,1500);
              return
            } else if (data.status === "Error") {
              l("pdf error "+data.error);
              self.set('outage',true)
            } else if (data.status === "NotFound" && self.clicked) {
              self.generate();
            } else {
              l("pdf status: " + data.status);
            }
            self.set("processing",false);
          }).fail(function(){
            l("pdf status fail");
            self.set('processing',false)
            self.set('outage',true)
          });
        },
        generate: function() {
          var self = this;
          self.set('outage',false);
          self.set('processing',true);

          l("post pdf start");
          $.post('pdf').done(function(){
            l("post pdf (200)");
            self.getStatus();
          }).fail(function(){
            l("post pdf fail");
            self.set('processing',false);
            self.set('outage',true);
          })
        },
        oninit: function() {
          var self = this;
          l("init started");
          self.getStatus = self.getStatus.bind(self);
          self.generate = self.generate.bind(self);
          self.getStatus()
          self.on('download', function(){
            l("button clicked");
            self.clicked = true;
            if (self.url !== null) {
              window.location.href =self.url;
              return false
            } else if (!self.get('processing') && self.firstStatus === true) {
              l("click - generate");
              self.generate();
            } else if (self.firstStatus === false && self.get('outage')) {
              l("click - outage");
              self.getStatus();
            } else {
              l("click - errr what?");
            }
            self.set('processing',true);
            return false;
          });
        }
      });
    }
    return pdfButton;
  }

  var external = {
    component: function() {
      return getPdfButton();
    }
  };
  return external;
})(jQuery);

var helpers = Ractive.defaults.data;

helpers.formatText = function(str) {
  if (typeof str === "string") {
    // Add a word break opportunity after slashes to ensure item names
    // that have slashes (e.g. "Doors/Entry/Security") break at the slash and not the middle of the word.

    // Don't perform this substitution if the trimmed string contains whitespace in the middle, because it
    // breaks inline HTML (e.g. <a> or <img> tags).
    var str_trimmed = str.trim();
    if (!/\s/.test(str_trimmed)) {
      // Replace slash characters before replacing newline characters, otherwise the substitutions will interfere with each other.
      str = str.replace(/\//g, '/<wbr>');
    }

    str = str.replace(/\n/g, '<br />');
  }
  return str;
};

helpers.formatDate = function(rfc3339, format) {
  var config = this.data.report.config || {};
  var locale = config.locale || "en";
  format = format || "LLL";

  return moment(rfc3339).locale(locale).format(format);
};

helpers.inflect = function(word, number) {
  return (number == 1 ? word : word.pluralize());
};

helpers.fileURL = function(filename) {
  return "files/" + filename;
};

helpers.signaturesFromSignatories = function(signatories) {

  function compare(a, b) {
    if (typeof a === "undefined" && typeof b === "undefined") {
      return 0;
    }
    if (typeof a === "undefined") {
      return 1;
    }
    if (typeof b === "undefined") {
      return -1;
    }
    return a - b;
  }

  function compareSignatures(a, b) {

    var generatedAtOrder = compare(a.generatedAt, b.generatedAt);
    if (generatedAtOrder !== 0) {
      return generatedAtOrder;
    }

    return compare(a.id, b.id);
  }

  var signaturesArray = [];
  for (var id in signatories) {
    if (signatories.hasOwnProperty(id)) {
      var signature = signatories[id];
      signature.id = id;
      signaturesArray.push(signature);
    }
  }

  return signaturesArray.sort(compareSignatures);
};

this["Templates"] = this["Templates"] || {};
this["Templates"]["appendices"] = {"v":1,"t":[{"t":4,"n":52,"r":"appendices","f":["\n  ",{"t":7,"e":"section","a":{"class":"appendix"},"f":["\n    ",{"t":7,"e":"h1","f":[{"t":2,"x":{"r":["name","formatDate","inspectionStartedAt"],"s":"_0+\" (\"+_1(_2,\"LL\")+\")\""}}]},"\n",{"t":4,"n":52,"r":"sections","f":["      ",{"t":7,"e":"table","a":{"class":"single-row"},"f":["\n        ",{"t":7,"e":"thead","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","f":[{"t":2,"r":"title"}," Photos"]}]}]},"\n        ",{"t":7,"e":"tbody","f":["\n          ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"r":"photos","f":[{"t":8,"r":"photos"}],"t":4,"n":53}]}]},"\n        "]},"\n      "]},"\n"]},"  "]},"\n"]}]};
this["Templates"]["contacts"] = {"v":1,"t":[{"t":4,"n":50,"r":"contacts","f":["\n  ",{"t":7,"e":"div","a":{"class":"clearfix"},"f":["\n    ",{"t":7,"e":"div","a":{"id":"landlords"},"f":["\n      ",{"t":7,"e":"div","f":[{"t":2,"x":{"r":["inflect","contacts.length"],"s":"_0(\"Contact\",_1)"}}]},"\n      ",{"t":7,"e":"ul","a":{"class":"people"},"f":["\n",{"t":4,"n":52,"r":"contacts","f":["          ",{"t":7,"e":"li","f":["\n            ",{"t":8,"r":"person"},"\n            ",{"t":4,"r":".mailingAddress","f":[{"t":7,"e":"p","f":[{"t":8,"r":"address"}]}]},"\n          "]},"\n"]},"      "]},"\n    "]},"\n  "]},"\n"]}]};
this["Templates"]["disclaimer"] = {"v":1,"t":[{"t":4,"n":50,"r":"disclaimerText","f":["\n  ",{"t":7,"e":"section","f":["\n    ",{"t":7,"e":"table","a":{"class":"single-row"},"f":["\n      ",{"t":7,"e":"thead","f":[{"t":7,"e":"tr","f":[{"t":7,"e":"th","f":["Important Information Regarding This Report"]}]}]},"\n      ",{"t":7,"e":"tr","f":[{"t":7,"e":"td","f":[{"t":3,"x":{"r":["formatText","disclaimerText"],"s":"_0(_1)"}}]}]},"\n    "]},"\n  "]},"\n"]}]};
this["Templates"]["footer-fields"] = {"v":1,"t":[{"t":4,"n":50,"r":"footerFields","f":["\n  ",{"t":7,"e":"table","f":["\n    ",{"t":7,"e":"colgroup","f":["\n      ",{"t":7,"e":"col","a":{"class":"master"}},"\n      ",{"t":7,"e":"col"},"\n      ",{"t":7,"e":"col"},"\n    "]},"\n    ",{"t":7,"e":"thead","f":["\n      ",{"t":7,"e":"tr","f":["\n        ",{"t":7,"e":"th","f":["Summary"]},"\n",{"t":4,"n":52,"r":"inspections","f":["          ",{"t":4,"n":50,"r":".","f":["\n            ",{"t":7,"e":"th","a":{"class":"inspection-title"},"f":[{"t":2,"x":{"r":["type","formatDate","startedAt"],"s":"_0+\" (\"+_1(_2,\"LL\")+\")\""}}]},"\n"]},{"t":4,"n":51,"f":["\n            ",{"t":7,"e":"th","a":{"class":"inspection-title"}},"\n          "],"r":"."}]},"      "]},"\n    "]},"\n    ",{"t":7,"e":"tbody","f":["\n",{"t":4,"n":52,"r":"footerFields","f":["        ",{"t":7,"e":"tr","a":{"class":"item"},"f":["\n          ",{"t":7,"e":"td","f":[{"t":3,"x":{"r":["formatText","title"],"s":"_0(_1)"}}]},"\n          ",{"t":7,"e":"td","a":{"class":"notes cell-group-start"},"f":[{"t":3,"x":{"r":["formatText","inspection1Value"],"s":"_0(_1)"}}]},"\n          ",{"t":7,"e":"td","a":{"class":"notes cell-group-start"},"f":[{"t":3,"x":{"r":["formatText","inspection2Value"],"s":"_0(_1)"}}]},"\n        "]},"\n"]},"    "]},"\n  "]},"\n"]}]};
this["Templates"]["header-fields"] = {"v":1,"t":[{"t":4,"n":50,"r":"headerFields","f":["\n  ",{"t":7,"e":"table","f":["\n    ",{"t":7,"e":"colgroup","f":["\n      ",{"t":7,"e":"col","a":{"class":"master"}},"\n      ",{"t":7,"e":"col"},"\n      ",{"t":7,"e":"col"},"\n    "]},"\n    ",{"t":7,"e":"thead","f":["\n      ",{"t":7,"e":"tr","f":["\n        ",{"t":7,"e":"th","f":["Overview"]},"\n",{"t":4,"n":52,"r":"inspections","f":["          ",{"t":4,"n":50,"r":".","f":["\n            ",{"t":7,"e":"th","a":{"class":"inspection-title"},"f":[{"t":2,"x":{"r":["type","formatDate","startedAt"],"s":"_0+\" (\"+_1(_2,\"LL\")+\")\""}}]},"\n"]},{"t":4,"n":51,"f":["\n            ",{"t":7,"e":"th","a":{"class":"inspection-title"}},"\n          "],"r":"."}]},"      "]},"\n    "]},"\n    ",{"t":7,"e":"tbody","f":["\n",{"t":4,"n":52,"r":"headerFields","f":["        ",{"t":7,"e":"tr","f":["\n          ",{"t":7,"e":"td","f":[{"t":2,"r":"title"}]},"\n          ",{"t":7,"e":"td","a":{"class":"cell-group-start"},"f":[{"t":2,"r":"inspection1Value"}]},"\n          ",{"t":7,"e":"td","a":{"class":"cell-group-start"},"f":[{"t":2,"r":"inspection2Value"}]},"\n        "]},"\n"]},"    "]},"\n  "]},"\n"]}]};
this["Templates"]["header"] = {"v":1,"t":[{"t":4,"n":50,"r":"chrome","f":["\n  ",{"t":7,"e":"header","f":["\n    ",{"t":7,"e":"nav","a":{"class":"navbar"},"f":["\n      ",{"t":7,"e":"div","a":{"class":"container"},"f":["\n      \t",{"t":7,"e":"div","a":{"class":"actions"},"f":["\n\t\t\t\t\t",{"t":7,"e":"ul","f":["\n\t\t\t\t\t\t",{"t":7,"e":"pdfbutton"},"\n\t\t\t\t\t"]},"\n      \t"]},"\n        ",{"t":7,"e":"h1","f":["Inspection Report"]},"\n      "]},"\n    "]},"\n  "]},"\n"]}]};
this["Templates"]["letterhead"] = {"v":1,"t":[{"t":7,"e":"header","a":{"class":"letterhead clearfix"},"f":["\n",{"t":4,"n":50,"r":"logo","f":["\t  ",{"t":7,"e":"div","a":{"id":"business-logo-box"},"f":["\n\t    ",{"t":7,"e":"img","a":{"src":[{"t":2,"x":{"r":["fileURL","logo"],"s":"_0(_1)"}}]}},"\n\t  "]},"\n"]},"  ",{"t":7,"e":"div","a":{"class":"business-details"},"f":["\n    ",{"t":7,"e":"h2","f":[{"t":2,"r":"name"}]},"\n    ",{"t":7,"e":"p","f":[{"t":2,"r":"tagLine"}]},"\n    ",{"t":7,"e":"p","f":[{"t":3,"x":{"r":["formatText","address"],"s":"_0(_1)"}}]},"\n  "]},"\n"]},"\n"]};
this["Templates"]["pdf"] = {"v":1,"t":[{"t":4,"n":50,"r":"outage","f":["\n",{"t":7,"e":"li","a":{"class":"error"},"f":[" PDF Error",{"t":7,"e":"br"},"Try again soon or ",{"t":7,"e":"a","a":{"href":"mailto:support@happyco.com"},"f":["contact support"]}]},"\n"]},{"t":7,"e":"li","f":["\n",{"t":7,"e":"a","a":{"id":"pdf-link"},"f":["\n",{"t":7,"e":"div","a":{"class":[{"t":4,"n":50,"r":"processing","f":["loading-icon"]},{"t":4,"n":51,"f":["download-icon"],"r":"processing"}]},"v":{"click":"download"}},"\n"]},"\n"]},"\n"]};
this["Templates"]["person"] = {"v":1,"t":[{"t":7,"e":"div","f":["\n",{"t":4,"n":50,"x":{"r":["name","role"],"s":"_0||_1"},"f":["\t\t",{"t":7,"e":"p","f":["\n",{"t":4,"n":50,"r":"name","f":["\t\t\t\t",{"t":2,"r":"name"},"\n\t\t\t\t",{"t":4,"n":50,"r":"role","f":[" "]},"\n"]},"\t\t\t",{"t":4,"n":50,"r":"role","f":["\n\t\t\t\t(",{"t":2,"r":"role"},")\n"]},"\t\t"]},"\n"]},"\t",{"t":4,"n":50,"x":{"r":["phone","email"],"s":"_0||_1"},"f":["\n\t\t",{"t":7,"e":"p","f":["\n",{"t":4,"n":50,"r":"phone","f":["\t\t\t\t",{"t":2,"r":"phone"},"\n\t\t\t\t",{"t":4,"n":50,"r":"email","f":[{"t":7,"e":"br"}]},"\n"]},"\t\t\t",{"t":4,"n":50,"r":"email","f":["\n\t\t\t\t",{"t":2,"r":"email"},"\n"]},"\t\t"]},"\n"]}]},"\n"]};
this["Templates"]["photos"] = {"v":1,"t":[{"t":7,"e":"ul","a":{"class":"photos justify-photos"},"f":["\n",{"t":4,"r":".","f":["    ",{"t":7,"e":"li","f":["\n      ",{"t":7,"e":"figure","a":{"class":"photo"},"f":["\n        ",{"t":7,"e":"a","a":{"href":[{"t":2,"x":{"r":["fileURL","id"],"s":"_0(_1)"}}],"data-lightbox":[{"t":2,"r":"group"}],"title":[{"t":2,"r":"caption"}]},"f":["\n          ",{"t":7,"e":"img","a":{"src":[{"t":2,"x":{"r":["fileURL","id"],"s":"_0(_1)"}}],"style":"width: 100%;","alt":[{"t":2,"r":"caption"}],"onerror":"this.onerror=null;this.src='images/photo-placeholder.svg'"}},"\n        "]},"\n        ",{"t":7,"e":"figcaption","f":["\n",{"t":4,"n":50,"r":"caption","f":["            ",{"t":7,"e":"div","f":[{"t":2,"r":"caption"}]},"\n"]},"          ",{"t":4,"n":50,"r":"takenAt","f":["\n            ",{"t":7,"e":"div","f":[{"t":2,"x":{"r":["formatDate","takenAt"],"s":"_0(_1,\"L\")"}}," ",{"t":2,"x":{"r":["formatDate","takenAt"],"s":"_0(_1,\"LT\")"}}]},"\n"]},"        "]},"\n      "]},"\n    "]},"\n"]},"  ",{"t":4,"r":".","f":["\n    ",{"t":7,"e":"li","a":{"class":"justifyfix"}},"\n"]}]},"\n"]};
this["Templates"]["report-details"] = {"v":1,"t":[{"t":7,"e":"div","a":{"class":"report-details clearfix"},"f":["\n  ",{"t":7,"e":"div","a":{"class":"asset-details"},"f":["\n  \t",{"t":7,"e":"ul","f":["\n",{"t":4,"n":52,"r":"assetDetails","f":["    \t",{"t":7,"e":"li","a":{"class":[{"t":2,"r":"class"}]},"f":[{"t":3,"r":"text"}]},"\n"]},"     "]},"\n  "]},"\n\n  ",{"t":7,"e":"div","a":{"class":"inspector-details"},"f":["\n    ",{"t":7,"e":"p","f":["\n      ",{"t":7,"e":"span","a":{"class":"title-text"},"f":["Inspected:"]},"\n      ",{"t":7,"e":"span","f":[{"t":2,"x":{"r":["formatDate","inspectedAt"],"s":"_0(_1,\"LLL\")"}}]},"\n    "]},"\n    ",{"t":7,"e":"p","f":["\n      ",{"t":7,"e":"span","a":{"class":"title-text"},"f":["Report Created:"]},"\n      ",{"t":7,"e":"span","f":[" ",{"t":2,"x":{"r":["formatDate","createdAt"],"s":"_0(_1,\"LLL\")"}}]},"\n    "]},"\n    ",{"t":7,"e":"p","f":[{"r":"inspector","f":[{"t":8,"r":"person"}],"t":4,"n":53}]},"\n  "]},"\n"]},"\n"]};
this["Templates"]["signature"] = {"v":1,"t":[{"t":7,"e":"figure","a":{"class":"signature"},"f":["\n  ",{"t":7,"e":"div","a":{"class":"signature-box"},"f":["\n    ",{"t":7,"e":"div","a":{"class":"signature-image"},"f":["\n",{"t":4,"n":50,"r":"image","f":["        ",{"t":7,"e":"img","a":{"src":[{"t":2,"x":{"r":["fileURL","image"],"s":"_0(_1)"}}],"style":["margin-bottom:",{"t":2,"x":{"r":["baselineOffset"],"s":"Math.round(_0*-100)"}},"%;"]}},"\n"]},"    "]},"\n  "]},"\n  ",{"t":7,"e":"figcaption","a":{"class":"clearfix"},"f":["\n",{"t":4,"n":50,"r":"name","f":["      ",{"t":7,"e":"span","a":{"class":"signature-name"},"f":[{"t":2,"r":"name"}]},"\n"]},"    ",{"t":4,"n":50,"r":"signedAt","f":["\n      ",{"t":7,"e":"span","a":{"class":"signature-date"},"f":[{"t":2,"x":{"r":["formatDate","signedAt"],"s":"_0(_1)"}}]},"\n"]},"  "]},"\n"]},"\n"]};
this["Templates"]["signatures"] = {"v":1,"t":[{"t":4,"n":50,"r":"signatures","f":["\n  ",{"t":7,"e":"section","f":["\n    ",{"t":7,"e":"table","a":{"class":"single-row signatures"},"f":["\n      ",{"t":7,"e":"thead","f":["\n        ",{"t":7,"e":"tr","f":[{"t":7,"e":"th","f":[{"t":2,"x":{"r":["inflect","signatures.length"],"s":"_0(\"Signature\",_1)"}}]}]},"\n      "]},"\n",{"t":4,"n":52,"r":"signatures","f":["        ",{"t":7,"e":"tr","f":["\n          ",{"t":7,"e":"td","f":[{"t":8,"r":"signature"}]},"\n        "]},"\n"]},"    "]},"\n  "]},"\n"]}]};
this["Templates"]["standard"] = {"v":1,"t":[{"t":7,"e":"div","a":{"class":["page ",{"t":2,"x":{"r":["chrome"],"s":"_0?\"with-chrome\":\"\""}}]},"f":["\n  ",{"t":8,"x":{"r":[],"s":"\"header\""}},"\n\n  ",{"t":7,"e":"div","a":{"class":"report-wrapper"},"f":["\n    ",{"t":7,"e":"div","a":{"class":"main"},"f":["\n",{"t":4,"n":53,"r":"report","f":["        ",{"t":4,"n":53,"r":"data","f":["\n          ",{"t":7,"e":"section","a":{"id":"title-page"},"f":["\n            ",{"r":"letterhead","f":[{"t":8,"r":"letterhead"}],"t":4,"n":53},"\n\n            ",{"t":7,"e":"div","a":{"class":"report-title-box"},"f":["\n              ",{"t":7,"e":"h1","f":[{"t":2,"r":"title"}]},"\n\n              ",{"t":8,"x":{"r":[],"s":"\"report-details\""}},"\n            "]},"\n\n            ",{"r":"contacts","f":[{"t":8,"r":"contacts"}],"t":4,"n":53},"\n          "]},"\n\n          ",{"t":7,"e":"section","f":["\n",{"t":4,"n":50,"r":"headerFields","f":["              ",{"t":7,"e":"table","f":["\n                ",{"t":7,"e":"colgroup","f":["\n                  ",{"t":7,"e":"col","a":{"class":"master"}},"\n                  ",{"t":7,"e":"col"},"\n                "]},"\n                ",{"t":7,"e":"thead","f":["\n                  ",{"t":7,"e":"tr","f":["\n                    ",{"t":7,"e":"th","a":{"colspan":"2"},"f":["Overview"]},"\n                  "]},"\n                "]},"\n                ",{"t":7,"e":"tbody","f":["\n",{"t":4,"n":52,"r":"headerFields","f":["                    ",{"t":7,"e":"tr","f":["\n                      ",{"t":7,"e":"td","f":[{"t":2,"r":"title"}]},"\n                      ",{"t":7,"e":"td","a":{"class":"cell-group-start"},"f":[{"t":2,"r":"value"}]},"\n                    "]},"\n"]},"                "]},"\n              "]},"\n"]},"            ",{"t":4,"n":52,"r":"bodySections","f":["\n              ",{"t":7,"e":"table","f":["\n                ",{"t":7,"e":"colgroup","f":["\n                  ",{"t":7,"e":"col","a":{"class":"master"}},"\n                  ",{"t":7,"e":"col"},"\n                "]},"\n                ",{"t":7,"e":"thead","f":["\n                  ",{"t":7,"e":"tr","f":["\n                    ",{"t":7,"e":"th","a":{"colspan":"2"},"f":[{"t":3,"x":{"r":["formatText","title"],"s":"_0(_1)"}}]},"\n                  "]},"\n                "]},"\n                ",{"t":7,"e":"tbody","f":["\n",{"t":4,"n":52,"r":"rows","f":["                    ",{"t":7,"e":"tr","a":{"class":"item"},"f":["\n                      ",{"t":7,"e":"td","f":["\n                        ",{"t":3,"x":{"r":["formatText","title"],"s":"_0(_1)"}},"\n                      "]},"\n                      ",{"t":7,"e":"td","a":{"class":"notes cell-group-start"},"f":["\n                        ",{"t":7,"e":"div","a":{"class":"values"},"f":["\n                          ",{"t":7,"e":"span","f":[{"t":2,"r":"values"}]},"\n                        "]},"\n                        ",{"t":7,"e":"div","a":{"class":"notes"},"f":[{"t":3,"x":{"r":["formatText","notes"],"s":"_0(_1)"}}]},"\n                      "]},"\n                    "]},"\n"]},"                  ",{"t":4,"n":50,"r":"photos","f":["\n                    ",{"t":7,"e":"tr","f":["\n                      ",{"t":7,"e":"td","f":["Photos"]},"\n                      ",{"t":7,"e":"td","a":{"class":"photos-cell cell-group-start"},"f":["\n                        ",{"r":"photos","f":[{"t":8,"r":"photos"}],"t":4,"n":53},"\n                      "]},"\n                    "]},"\n"]},"                "]},"\n              "]},"\n"]},"            ",{"t":4,"n":50,"r":"footerFields","f":["\n              ",{"t":7,"e":"table","f":["\n                ",{"t":7,"e":"colgroup","f":["\n                  ",{"t":7,"e":"col","a":{"class":"master"}},"\n                  ",{"t":7,"e":"col"},"\n                "]},"\n                ",{"t":7,"e":"thead","f":["\n                  ",{"t":7,"e":"tr","f":["\n                    ",{"t":7,"e":"th","a":{"colspan":"2"},"f":["Summary"]},"\n                  "]},"\n                "]},"\n                ",{"t":7,"e":"tbody","f":["\n",{"t":4,"n":52,"r":"footerFields","f":["                    ",{"t":7,"e":"tr","a":{"class":"item"},"f":["\n                      ",{"t":7,"e":"td","f":[{"t":3,"x":{"r":["formatText","title"],"s":"_0(_1)"}}]},"\n                      ",{"t":7,"e":"td","a":{"class":"notes cell-group-start"},"f":[{"t":3,"x":{"r":["formatText","value"],"s":"_0(_1)"}}]},"\n                    "]},"\n"]},"                "]},"\n              "]},"\n"]},"          "]},"\n\n          ",{"t":8,"r":"disclaimer"},"\n"]},"        ",{"x":{"r":["signaturesFromSignatories","signatories"],"s":"{signatures:_0(_1)}"},"f":[{"t":8,"r":"signatures"}],"t":4,"n":53},"\n        ",{"x":{"r":["data.appendices"],"s":"{appendices:_0}"},"f":[{"t":8,"r":"appendices"}],"t":4,"n":53},"\n"]},"    "]},"\n  "]},"\n"]},"\n"]};
this["Templates"]["two-column"] = {"v":1,"t":[{"t":7,"e":"div","a":{"class":["page ",{"t":2,"x":{"r":["chrome"],"s":"_0?\"with-chrome\":\"\""}}]},"f":["\n  ",{"t":8,"x":{"r":[],"s":"\"header\""}},"\n\n  ",{"t":7,"e":"div","a":{"class":"report-wrapper"},"f":["\n    ",{"t":7,"e":"div","a":{"class":"main"},"f":["\n",{"t":4,"n":53,"r":"report","f":["        ",{"t":4,"n":53,"r":"data","f":["\n          ",{"t":7,"e":"section","a":{"id":"title-page"},"f":["\n            ",{"r":"letterhead","f":[{"t":8,"r":"letterhead"}],"t":4,"n":53},"\n\n            ",{"t":7,"e":"div","a":{"class":"report-title-box"},"f":["\n              ",{"t":7,"e":"h1","f":[{"t":2,"r":"title"}]},"\n\n              ",{"t":8,"x":{"r":[],"s":"\"report-details\""}},"\n            "]},"\n\n            ",{"r":"contacts","f":[{"t":8,"r":"contacts"}],"t":4,"n":53},"\n          "]},"\n\n          ",{"t":7,"e":"section","f":["\n            ",{"x":{"r":["headerFields"],"s":"{headerFields:_0}"},"f":[{"t":8,"x":{"r":[],"s":"\"header-fields\""}}],"t":4,"n":53},"\n",{"t":4,"n":52,"r":"bodySections","f":["              ",{"t":7,"e":"table","f":["\n                ",{"t":7,"e":"colgroup","f":["\n                  ",{"t":7,"e":"col","a":{"class":"master"}},"\n                  ",{"t":7,"e":"col"},"\n                  ",{"t":7,"e":"col"},"\n                "]},"\n                ",{"t":7,"e":"thead","f":["\n                  ",{"t":7,"e":"tr","f":["\n                    ",{"t":7,"e":"th","f":[{"t":3,"x":{"r":["formatText","title"],"s":"_0(_1)"}}]},"\n",{"t":4,"n":52,"r":"inspections","f":["                      ",{"t":4,"n":50,"r":".","f":["\n                        ",{"t":7,"e":"th","a":{"class":"inspection-title"},"f":[{"t":2,"x":{"r":["type","formatDate","startedAt"],"s":"_0+\" (\"+_1(_2,\"LL\")+\")\""}}]},"\n"]},{"t":4,"n":51,"f":["\n                        ",{"t":7,"e":"th","a":{"class":"inspection-title"}},"\n                      "],"r":"."}]},"                  "]},"\n                "]},"\n                ",{"t":7,"e":"tbody","f":["\n",{"t":4,"n":52,"r":"rows","f":["                    ",{"t":7,"e":"tr","a":{"class":"item"},"f":["\n                      ",{"t":7,"e":"td","f":["\n                        ",{"t":3,"x":{"r":["formatText","title"],"s":"_0(_1)"}},"\n                      "]},"\n                      ",{"t":7,"e":"td","a":{"class":"notes cell-group-start"},"f":["\n                        ",{"t":7,"e":"div","a":{"class":"values"},"f":["\n                          ",{"t":7,"e":"span","f":[{"t":2,"r":"inspection1Values"}]},"\n                        "]},"\n                        ",{"t":7,"e":"div","a":{"class":"notes"},"f":[{"t":3,"x":{"r":["formatText","inspection1Notes"],"s":"_0(_1)"}}]},"\n                      "]},"\n                      ",{"t":7,"e":"td","a":{"class":"notes cell-group-start"},"f":["\n                        ",{"t":7,"e":"div","a":{"class":"values"},"f":["\n                          ",{"t":7,"e":"span","f":[{"t":2,"r":"inspection2Values"}]},"\n                        "]},"\n                        ",{"t":7,"e":"div","a":{"class":"notes"},"f":[{"t":3,"x":{"r":["formatText","inspection2Notes"],"s":"_0(_1)"}}]},"\n                      "]},"\n                    "]},"\n"]},"                  ",{"t":4,"n":50,"x":{"r":["inspection1Photos","inspection2Photos"],"s":"_0||_1"},"f":["\n                    ",{"t":7,"e":"tr","f":["\n                      ",{"t":7,"e":"td","f":["Photos"]},"\n                      ",{"t":7,"e":"td","a":{"class":"photos-cell small-photos cell-group-start"},"f":["\n                        ",{"r":"inspection1Photos","f":[{"t":8,"r":"photos"}],"t":4,"n":53},"\n                      "]},"\n                      ",{"t":7,"e":"td","a":{"class":"photos-cell small-photos cell-group-start"},"f":["\n                        ",{"r":"inspection2Photos","f":[{"t":8,"r":"photos"}],"t":4,"n":53},"\n                      "]},"\n                    "]},"\n"]},"                "]},"\n              "]},"\n"]},"            ",{"x":{"r":["footerFields"],"s":"{footerFields:_0}"},"f":[{"t":8,"x":{"r":[],"s":"\"footer-fields\""}}],"t":4,"n":53},"\n          "]},"\n\n          ",{"t":8,"r":"disclaimer"},"\n"]},"        ",{"x":{"r":["signaturesFromSignatories","signatories"],"s":"{signatures:_0(_1)}"},"f":[{"t":8,"r":"signatures"}],"t":4,"n":53},"\n        ",{"x":{"r":["data.appendices"],"s":"{appendices:_0}"},"f":[{"t":8,"r":"appendices"}],"t":4,"n":53},"\n"]},"    "]},"\n  "]},"\n"]},"\n"]};