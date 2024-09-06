from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
import asyncio
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import re
from selenium import webdriver
import time
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

app = FastAPI()

clients = []

"""
sample transaction
# copied_transaction = {
#     "hash": "0x123",
#     "block_number": 123456,
#     "from_address": "0xabc",
#     "to_address": "0xdef",
#     "value": "1.23 ETH",
#     "gas_price": "0.01 ETH",
#     "block_timestamp": "2023-10-01T12:00:00Z"
# }
"""

import os

MONGO_DETAILS = os.getenv("MONGO_DB_URI", "mongodb://localhost:27017/")
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.transactions_db
transaction_collection = database.get_collection("transactions")


# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await websocket.accept()
#     clients.append(websocket)
#     try:
#         while True:
#             data = await websocket.receive_text()
#             transaction_data = json.loads(data)
#             transaction_data["_id"] = str(ObjectId())
#             await transaction_collection.insert_one(transaction_data)
#             await websocket.send_text(f"Message text was: {data}")
#     except Exception as e:
#         print(f"Error: {e}")
#     finally:
#         clients.remove(websocket)

def transform_transaction(transaction):
    transformed_transaction = {}
    transformed_transaction['hash'] = transaction.pop('Txhash')
    transformed_transaction['block_timestamp'] = transaction.pop('DateTime')
    transformed_transaction['method'] = transaction.pop('Method')
    transformed_transaction['block_number'] = transaction.pop('Blockno')
    transformed_transaction['from_address'] = transaction.pop('Sender')
    transformed_transaction['to_address'] = transaction.pop('Receiver')
    transformed_transaction['amount'] = float(transaction.pop('Amount').replace("ETH", "").replace(",", "").strip())
    transformed_transaction['gas_price'] = transaction.pop('TxnFee')
    transformed_transaction['status'] = transaction.pop('Status')
    transformed_transaction['receiver_label'] = transaction.pop('ReceiverLable')
    transformed_transaction['sender_label'] = transaction.pop('SenderLable')
    transformed_transaction['value'] = float(transaction.pop('Value').replace("$", "").replace(",", ""))

    return transformed_transaction


async def crawl_transactions():
    # driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    options = webdriver.ChromeOptions()
    # options.add_argument('--start-minimized')
    # options.add_argument('--headless')
    # options.add_argument('--disable-gpu')
    # options.add_argument('--no-sandbox')

    # driver = webdriver.Chrome(options=options)
    
    while True:
        # Set up the Chrome WebDriver
        # driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        # driver = webdriver.Chrome(service=Service(ChromeDriverManager()))

        # options = webdriver.ChromeOptions()

        driver = webdriver.Chrome(options=options)

        try:
            # Open the URL
            driver.get("https://etherscan.io/txs?p=1")

            # Use WebDriverWait to wait for a specific element to be present

            driver.implicitly_wait(10)

            # Get the page content
            page_content = driver.page_source

            # Extract the quickExportTransactionListData from the page_content
            match = re.search(r"const quickExportTransactionListData = '(\[.*?\])';", page_content)
            if match:
                quick_export_data = match.group(1)
                transactions = json.loads(quick_export_data)
                # print(transactions)

                for transaction in transactions:
                    transformed_transaction = transform_transaction(transaction)
                    # print('copied transaction', transformed_transaction)

                    # Check if the transaction is already in the database
                    existing_transaction = await transaction_collection.find_one({"hash": transformed_transaction['hash']})
                    if existing_transaction:
                        print(f"Transaction {transformed_transaction['hash']} already exists in the database.")
                        continue

                    # insert into mongodb
                    transformed_transaction["_id"] = str(ObjectId())
                    await transaction_collection.insert_one(transformed_transaction)

                    # send to websocket client
                    for client in clients:
                        await client.send_text(json.dumps(transformed_transaction))
            else:
                print("quickExportTransactionListData not found on page 1")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            driver.quit()

        await asyncio.sleep(1)  # Crawl every 3 seconds

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(crawl_transactions())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)