const express = require("express");
const app = express();
const port = 5001;
const Moralis = require("moralis").default;
const cors = require("cors");

require("dotenv").config({ path: ".env" });

app.use(cors());
app.use(express.json());

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

app.get("/getethprice", async (req, res) => {
  try {
    // const response = await Moralis.EvmApi.token.getTokenPrice({
    //   address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    //   chain: "0x1",
    // });

    // console.log(response);

    const dummyResponse = {
      tokenName: 'Wrapped Ether',
      tokenSymbol: 'WETH',
      tokenLogo: 'https://logo.moralis.io/0x1_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2_a578c5277503e547a072ae32517254ca',
      tokenDecimals: '18',
      nativePrice: {
        value: '999593199902969288',
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
      },
      usdPrice: 2900.64181435853,
      usdPriceFormatted: '2524.641814358530233820',
      exchangeName: 'Uniswap v3',
      exchangeAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      priceLastChangedAtBlock: '20646661',
      blockTimestamp: '1725084479000',
      possibleSpam: false,
      verifiedContract: true,
      pairAddress: '0xc7bbec68d12a0d1830360f8ec58fa599ba1b0e9b',
      pairTotalLiquidityUsd: '8469768.63',
      securityScore: 92
    };



    return res.status(200).json(dummyResponse);
    // return res.status(200).json(response);
  } catch (e) {
    console.log(`Somthing went wrong ${e}`);
    return res.status(400).json();
  }
});

// app.get("/address", async (req, res) => {
//   try {
//     const { query } = req;
//     const chain = "0x1";

//     const response = await Moralis.EvmApi.transaction.getWalletTransactions({
//       address: query.address,
//       chain,
//     });

//     return res.status(200).json(response);
//   } catch (e) {
//     console.log(`Something went wrong ${e}`);
//     return res.status(400).json();
//   }
// });

Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
