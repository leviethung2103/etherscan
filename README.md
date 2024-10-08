## Problem Statement
Develop an Anomaly Detection System to monitor real-time transactions and generate alerts for suspicious activities. 
Dataset sample: https://docs.google.com/spreadsheets/d/1DcAjDy-pxi6gn5aPdfA39fSo-SF4sDEilcqtdPZf0ic/edit?usp=sharing
(https://etherscan.io/ for more data)
For every new (real time) transaction, we want to detect suspicious activities: large transactions, rapid transactions from the same account, fraud transactions.

## Setup Instructions

### Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

1. **Node.js** (v20.x or later) and npm (v6.x or later)
   - You can download and install Node.js from [nodejs.org](https://nodejs.org/).
2. **Docker**  and **Docker Compose**
   - You can download and install Docker from [docker.com](https://www.docker.com/).
3. **Git** (v2.x or later)
   - You can download and install Git from [git-scm.com](https://git-scm.com/).

Ensure you have the necessary API keys and environment variables ready for the backend and frontend configurations.

### Backend

After cloning the source code, open the terminal and run these commands

```bash
# 1. navigate to the `backend` directory
cd backend
# 2. install the required dependencies
npm install or yarn install
# 3. start the backend server
node transaction.js

```

Finally, the server will be running at:
http://localhost:8001


### Frontend

Open the another terminal, suppose you are at the root project and then run these commands

```bash
# 1. Navigate to the `frontend` directory:
cd frontend
# 2. install the required dependencies
npm install or yarn install
# 3. start the web application server
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Python Backend (py_backend)


Open the another terminal, suppose you are at the root project and then run these commands

```bash
# 1. Navigate to the `py_backend` directory:
cd py_backend
# 2. Create a virtual environment:
python -m venv venv
# 3. On macOS/Linux
source venv/bin/activate
# 4. Install the required dependencies:
pip install -r requirements.txt
# 5. Start the Python backend server:
python server.py
```

### Mongo Database

To set up and run the MongoDB database, follow these steps:

Open the another terminal, suppose you are at the root project and then run these commands

```bash
# 1. Navigate to the `py_backend` directory:
cd py_backend
# 2. Create mongo-data locally
mkdir mongo-data
# 3. Run docker-compose
docker compose up -d
```

### Techinical Detail

The overall architecture of this project consists of three main components: the Frontend, the Python Backend, and the MongoDB Database.

1. **Frontend**: The frontend is a web application built with modern NextJS frameworks. It communicates with the backend through RESTful APIs to fetch and display data. The frontend is responsible for the user interface and user experience.

2. **Backend**: The backend is a Python-based server that handles the business logic and processes requests from the frontend. It interacts with the MongoDB database to store and retrieve data. The backend exposes RESTful APIs for the frontend to consume.

3. **MongoDB Database**: MongoDB is a NoSQL database used to store the application's data. It is chosen for its flexibility and scalability. The database is managed using Docker to ensure a consistent and isolated environment.

4. **Py Backend**: Machine learning modules and crawler modules

The architecture ensures a clear separation of concerns, making the application modular, scalable, and easier to maintain.

<img src="imgs/fig1_overall_achirecture.png" alt="Overall Architecture" width="80%">

### Fraud Detection Solution
<img src="imgs/fig2_detail_solution.png" alt="Detail Solution" width="80%">

### Port Configuration
<img src="imgs/fig3_port_conf.png" alt="Port Configuration" width="80%">
