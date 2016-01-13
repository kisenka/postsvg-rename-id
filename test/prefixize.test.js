var expect = require('chai').expect;

var postsvg = require('postsvg');
var prefixize = require('../');

var testPrefix = 'test_';

var fixtureTests = [
  {
    message: 'add prefix to node id',
    fixture:  '<svg><path id="a"/></svg>',
    expected: '<svg><path id="test_a"/></svg>'
  },
  {
    message: 'not modify nodes without id',
    fixture:  '<svg/>',
    expected: '<svg/>'
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
    message: 'add prefix to `xlink:href` attributes',
    fixture:  '<svg><path id="path"/><use xlink:href="#path"/></svg>',
    expected: '<svg><path id="test_path"/><use xlink:href="#test_path"/></svg>'
  },
  {
    message: 'not modify `xlink:href` attributes when correspondent id not found',
    fixture:  '<svg><path/><use xlink:href="#path"/></svg>',
    expected: '<svg><path/><use xlink:href="#path"/></svg>'
  },
  {
    message: 'add prefix to `style` declaration values with `url(#id)` pattern',
    fixture:  '<svg><linearGradient id="gradient"/><path style="fill: url(#gradient) ; "/></svg>',
    expected: '<svg><linearGradient id="test_gradient"/><path style="fill: url(#test_gradient) ; "/></svg>'
  },
  {
    message: 'not modify `style` declaration values with `url(#id)` pattern when correspondent id not found',
    fixture:  '<svg><linearGradient/><path style="fill: url(#gradient) ; "/></svg>',
    expected: '<svg><linearGradient/><path style="fill: url(#gradient) ; "/></svg>'
  }
];

describe('prefixize', function () {
  it('throws when prefix not specified or not a string', function () {
    expect(function () {
      prefixize()
    }).to.throws(Error);

    expect(function () {
      prefixize({prefix: 123})
    }).to.throws(Error);
  });

  fixtureTests.forEach(function (test) {
    it(test.message, function (done) {
      var options = test.options || {prefix: testPrefix};
      var result = postsvg([prefixize(options)]).process(test.fixture);
      expect(result.toString()).to.equals(test.expected);
      done();
    });

  })
});