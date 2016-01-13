/**
 * Based on grunt-svgstore
 * @see https://github.com/FWeinb/grunt-svgstore
 */

var postsvg = require('postsvg');

// Matching an url() reference. To correct references broken by making ids unique to the source svg
var URL_PATTERN = /^url\(#([^ ]+?)\s*\)/g;

function prefixize(options) {
  if (typeof options.prefix !== 'string')
    throw new Error('Prefix must be a string');

  return function (doc) {
    var $ = doc.$;
    var root = doc.root();
    var rootId = root.attr('id');
    var prefix = options.prefix;
    var mappedIds = {};

    if (rootId)
      root.attr('id', prefix + rootId);

    root.find('[id]').each(function () {
      var $elem = $(this);
      var id = $elem.attr('id');
      var newId = prefix + id;
      mappedIds[id] = {
        id: newId,
        referenced: false,
        $elem: $elem
      };
      $elem.attr('id', newId);
    });

    root.find('*').each(function () {
      var $elem = $(this);
      var attrs = $elem.attr();

      Object.keys(attrs).forEach(function (attrName) {
        var value = attrs[attrName];
        var id;
        var match;

        while ((match = URL_PATTERN.exec(value)) !== null) {
          id = match[1];
          if (!!mappedIds[id]) {
            mappedIds[id].referenced = true;
            $elem.attr(attrName, value.replace(match[0], 'url(#' + mappedIds[id].id + ')'));
          }
        }

        switch (attrName) {
          case 'xlink:href':
            id = value.substring(1);
            var idObj = mappedIds[id];
            if (!!idObj) {
              idObj.referenced = false;
              $elem.attr(attrName, '#' + idObj.id);
            }
            break;

          case 'style':
            var declarations = value.split(';');
            var isStyleModified = false;

            // TODO: refactor this
            declarations.forEach(function (decl, i) {
              var declaration = decl.split(':');
              var declMatch;

              if (declaration.length === 2 && (declMatch = URL_PATTERN.exec(declaration[1].trim())) !== null) {
                id = declMatch[1];
                if (!!mappedIds[id]) {
                  if (!isStyleModified) isStyleModified = true;
                  mappedIds[id].referenced = true;
                  declaration[1] = declaration[1].replace(declMatch[0], 'url(#' + mappedIds[id].id + ')');
                  declarations[i] = declaration.join(':');
                }
              }
            });

            if (isStyleModified)
              $elem.attr(attrName, declarations.join(';'));
            break;
        }
      });
    });
  }
}

module.exports = postsvg.plugin('postsvg-prefixize', prefixize);