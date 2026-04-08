# StockApp

This project is a real-time stock dashboard built using Angular and a WebSocket server. It supports both live stock data and mock data simulation for development and testing purposes.

### Features
Real-time stock updates using WebSocket
Mock data simulation for offline/demo usage
Toggle between real and mock data via environment configuration: change useMock to true or false in environment.ts
Responsive UI with reusable components
Clean and scalable SCSS architecture using design tokens

## Development server
 ### Run Backend first
   Goto backend/ folder then  Run `node websocketServer.ts`.
   Will Start running on  `http://localhost:8000/`
   
 ### Run Frontend now
    Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Production server
Run `ng build --configuration production`. build will be created here: dist/stock-app/


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.


