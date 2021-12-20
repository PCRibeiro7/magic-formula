const axios = require("axios");
const puppeteer = require("puppeteer");
const tabletojson = require("tabletojson").Tabletojson;
const accounting = require("./accounting");
var json2xls = require('json2xls');
const fs = require('fs')

const STOCK_NAME_KEY = "Papel";
const MINIMUM_STOCK_LIQUIDITY_IN_BRL = 800000;
const MINIMUM_STOCK_KEY = "Liq.2meses";
const MINIMUM_EQUITY_VALUE = 0;
const MINIMUM_EQUITY_KEY = "Patrim. L�q";
const MINIMUM_EV_EBIT_VALUE = 0;
const EV_EBIT_KEY = "EV/EBIT";
const ROIC_KEY = "ROIC";

var json2xls = require("json2xls");
var json = {
  foo: "bar",
  qux: "moo",
  poo: 123,
  stux: new Date(),
};

const main = async (res) => {
  tabletojson.convertUrl(
    "https://www.fundamentus.com.br/resultado.php",
    function (tablesAsJson) {
      const companyTable = tablesAsJson[0];
      const companyIndicators = Object.keys(companyTable[0]);
      const formattedCompanyTable = JSON.parse(
        JSON.stringify(companyTable)
      ).map((indicators) => {
        companyIndicators.forEach((name) => {
          if (name !== STOCK_NAME_KEY) {
            indicators[name] = accounting.unformat(indicators[name]);
          }
        });
        return indicators;
      });
      const filteredCompanies = formattedCompanyTable.filter((company) => {
        return (
          company[MINIMUM_STOCK_KEY] > MINIMUM_STOCK_LIQUIDITY_IN_BRL &&
          company[MINIMUM_EQUITY_KEY] > MINIMUM_EQUITY_VALUE &&
          company[EV_EBIT_KEY] > MINIMUM_EV_EBIT_VALUE
        );
      });
      const orderedByEV_EBIT = JSON.parse(
        JSON.stringify(filteredCompanies)
      ).sort((a, b) => a[EV_EBIT_KEY] - b[EV_EBIT_KEY]);

      const orderedByROIC = JSON.parse(JSON.stringify(filteredCompanies)).sort(
        (a, b) => b[ROIC_KEY] - a[ROIC_KEY]
      );

      filteredCompaniesWithRanking = JSON.parse(
        JSON.stringify(filteredCompanies)
      )
        .map((company) => ({
          rank:
            orderedByEV_EBIT.findIndex(
              (c) => c[STOCK_NAME_KEY] === company[STOCK_NAME_KEY]
            ) +
            orderedByROIC.findIndex(
              (c) => c[STOCK_NAME_KEY] === company[STOCK_NAME_KEY]
            ),
            ...company,
        }))
        .sort((a, b) => a.rank - b.rank);
        res.xls('data.xlsx', filteredCompaniesWithRanking);
    }
  );
};
const express = require('express')
const app = express()
const port = 3000

app.use(json2xls.middleware);

app.get('/', (req, res) => {
    main(res);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
