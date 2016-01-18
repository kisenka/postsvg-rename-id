var expect = require('chai').expect;

var postsvg = require('postsvg');
var rename = require('../');

describe('postsvg-rename-id', function () {
  describe('options', function() {

    var input = '<svg id="svg"/>';

    it('throws when `pattern` not specified', function () {
      expect(function() {
        postsvg().use(rename()).process(input)
      }).to.throws(TypeError);
    });

    it('`pattern` can be a string', function () {
      expect(function() {
        postsvg().use(rename({pattern: '[id]'}))
      }).to.not.throws(TypeError);
    });

    it('`pattern` can be a function which should return a string', function () {
      expect(function() {
        postsvg().use( rename({pattern: function() {}})).process(input)
      }).to.throws(TypeError);

      expect(function() {
        postsvg().use( rename({pattern: function() { return '123' }})).process(input)
      }).to.not.throws(TypeError);
    });
  });

  describe('processing', function() {
    var fixtureTests = [
      {
        message: 'pattern: simple string',
        fixture:  '<svg><path id="a"/></svg>',
        expected: '<svg><path id="b"/></svg>',
        options: {pattern: 'b'}
      },
      {
        message: 'pattern: [id] placeholder',
        fixture:  '<svg><path id="a"/></svg>',
        expected: '<svg><path id="test_a"/></svg>',
        options: {pattern: 'test_[id]'}
      },
      {
        message: 'pattern: [document-id] placeholder',
        fixture:  '<svg><path id="a"/></svg>',
        options: {pattern: '[document-id]_b'},
        callback: function(result, test) {
          var docId = result.doc.getId();
          var renamedNode = result.doc.root().find('path[id]');

          expect(renamedNode.attr('id')).to.equal(docId + '_b')
        }
      },
      {
        message: 'pattern: function',
        fixture:  '<svg><path id="a"/></svg>',
        expected: '<svg><path id="123"/></svg>',
        options: {pattern: function() { return '123' }}
      },
      {
        message: 'pattern: function with placeholders',
        fixture:  '<svg><path id="a"/></svg>',
        expected: '<svg><path id="123"/></svg>',
        options: {pattern: function() { return '[id]_b_[document-id]' }},
        callback: function(result, test) {
          var docId = result.doc.getId();
          var renamedNode = result.doc.root().find('path[id]');

          expect(renamedNode.attr('id')).to.equal('a_b_' + docId);
        }
      },
      {
        message: 'pattern: function which use options',
        fixture:  '<svg><path id="a"/></svg>',
        expected: '<svg><path id="a_b"/></svg>',
        options: {
          pattern: function(options) {
            return '[id]_' + options.option
          }
        },
        processOptions: {
          option: 'b'
        }
      },
      {
        message: 'not modify nodes without id',
        fixture:  '<svg><path/></svg>',
        expected: '<svg><path/></svg>'
      },
      {
        message: 'modify attribute value with `url(#id)` pattern',
        fixture:  '<svg><linearGradient id="gradient"/><path fill="url(#gradient)"/></svg>',
        expected: '<svg><linearGradient id="test_gradient"/><path fill="url(#test_gradient)"/></svg>'
      },
      {
        message: 'not modify attribute value with `url(#id)` pattern when correspondent id not found',
        fixture:  '<svg><linearGradient/><path fill="url(#gradient)"/></svg>',
        expected: '<svg><linearGradient/><path fill="url(#gradient)"/></svg>'
      },
      {
        message: 'modify `xlink:href` attributes',
        fixture:  '<svg><path id="path"/><use xlink:href="#path"/></svg>',
        expected: '<svg><path id="test_path"/><use xlink:href="#test_path"/></svg>'
      },
      {
        message: 'not modify `xlink:href` attributes when correspondent id not found',
        fixture:  '<svg><path/><use xlink:href="#path"/></svg>',
        expected: '<svg><path/><use xlink:href="#path"/></svg>'
      },
      {
        message: 'modify `style` declaration values with `url(#id)` pattern',
        fixture:  '<svg><linearGradient id="gradient"/><path style="fill: url(#gradient) ; "/></svg>',
        expected: '<svg><linearGradient id="test_gradient"/><path style="fill: url(#test_gradient) ; "/></svg>'
      },
      {
        message: 'not modify `style` declaration values with `url(#id)` pattern when correspondent id not found',
        fixture:  '<svg><linearGradient/><path style="fill: url(#gradient) ; "/></svg>',
        expected: '<svg><linearGradient/><path style="fill: url(#gradient) ; "/></svg>'
      }
    ];

    var defaultPattern = 'test_[id]';
    var defaultOptions = {pattern: defaultPattern};

    fixtureTests.forEach(function (test) {
      it(test.message, function (done) {
        var options = test.options || defaultOptions;
        var processOptions = test.processOptions;
        var result = postsvg()
          .use(rename(options))
          .process(test.fixture, processOptions);

        if (test.callback)
          test.callback(result, test);
        else
          expect(result.toString()).to.equal(test.expected);

        done();
      });
    });
  });

});