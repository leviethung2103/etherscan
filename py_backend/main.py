import asyncio
import logging

from aiohttp_retry import ExponentialRetry
from asyncio_throttle import Throttler

from aioetherscan import Client

from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv('ETHERSCAN_API_KEY')
if not api_key:
    raise ValueError("ETHERSCAN_API_KEY environment variable is not set")


logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO)


async def main():
    throttler = Throttler(rate_limit=4, period=1.0)
    retry_options = ExponentialRetry(attempts=2)

    c = Client(api_key, throttler=throttler, retry_options=retry_options)

    try:
        print(await c.stats.eth_price())
        print(await c.block.block_reward(123456))

        address = '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'
        async for t in c.extra.generators.token_transfers(
                address=address,
                start_block=19921833,
                end_block=19960851
        ):
            print(t)
            print(c.extra.link.get_tx_link(t['hash']))

        print(c.extra.link.get_address_link(address))
    finally:
        await c.close()


if __name__ == '__main__':
    asyncio.run(main())
