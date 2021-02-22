const cheerio = require('cheerio');
const fetch = require('node-fetch');
const currency = require('currency.js');

const USD = value => currency(value);
const USD_REGEX = /^\$/;

const NTD = value => currency(value, { symbol: 'NT$', precision: 0 });
const NTD_REGEX = /^NT\$/;

getSum = async (getCount) => {
    if (!(getCount)) {
        throw new Error("Argument missing");
    }
    let url = 'https://playboard.co/en/youtube-ranking/most-superchatted-v-tuber-channels-in-worldwide-daily';
    console.log(`Fetch URL: ${url}`);
    console.log();
    fetch(url)
        .then(function (response) {
            return response.text();
        })
        .then(function (body) {
            let $ = cheerio.load(body);
            let title = $('title').text();
            console.log(title);
            console.log();

            let name = [];
            let data = [];
            $('.name__label h3').each(function () {
                name.push($(this).text());
            });
            $('.fluc-label.fluc-label--en.fluc-label--symbol-math.up').each(function () {
                data.push($(this).text());
            });

            let sum = 0;
            let n = data.length;
            let counter = 1;
            let currencyType;

            if (NTD_REGEX.test(data[0])) {
                currencyType = "NTD";
            } else if (USD_REGEX.test(data[0])) {
                currencyType = "USD";
            } else {
                currencyType = null;
                console.error("Unable to determine Currency Type");
                return;
            }

            for (let i = 0; i < n && counter <= getCount; i += 2, counter++) {
                console.log(counter);
                console.log(name[counter - 1]);
                console.log(data[i]);
                // console.log(currency(data[i]).value);
                sum += currency(data[i]).value;
                console.log();
            }
            counter--;
            console.log(`Data Count: ${counter}`);
            console.log(`Date in local time: ${Date().toLocaleString()}`);
            switch (currencyType) {
                case "NTD":
                    console.log(`Sum: ${NTD(sum).format()}`);
                    break;
                case "USD":
                    console.log(`sum: ${USD(sum).format()}`);
                    break;
            }
        });
}

getSum(10);
