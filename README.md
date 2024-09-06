## Setup Instructions

### Backend

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2. Install the required dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Create a `.env` file in the `backend` directory and add your environment variables:
    ```bash
    touch .env
    ```

4. Start the backend server:
    ```bash
    npm start
    # or
    yarn start
    ```

### Frontend

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2. Install the required dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Create a `.env.local` file in the `frontend` directory and add your environment variables:
    ```bash
    touch .env.local
    ```

4. Start the frontend development server:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Python Backend (py_backend)

1. Navigate to the `py_backend` directory:
    ```bash
    cd py_backend
    ```

2. Create a virtual environment:
    ```bash
    python -m venv venv
    ```

3. Activate the virtual environment:
    - On Windows:
        ```bash
        venv\Scripts\activate
        ```
    - On macOS/Linux:
        ```bash
        source venv/bin/activate
        ```

4. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5. Create a `.env` file in the `py_backend` directory and add your environment variables:
    ```bash
    touch .env
    ```

6. Start the Python backend server:
    ```bash
    python server.py
    ```
