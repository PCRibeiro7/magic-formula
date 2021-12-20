const accounting = require("accounting");
accounting.settings = {
  currency: {
    symbol: "R$", // default currency symbol is '$'
    format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
    decimal: ",", // decimal point separator
    thousand: ".", // thousands separator
  },
  number: {
    precision: 2, // default precision on numbers is 0
    thousand: ".",
    decimal: ",",
  },
};

module.exports = accounting;
