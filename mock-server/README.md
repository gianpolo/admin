# Mock Backend Server

A simple Express server that provides fake responses for the frontend API.

## Install and run

```bash
cd mock-server
npm install
npm start
```

The server listens on `http://localhost:3001` and exposes the same API used by the application under `/api/v1`.
Set `REACT_APP_USE_FAKE_SERVER=true` when running the React app to use this mock backend.
