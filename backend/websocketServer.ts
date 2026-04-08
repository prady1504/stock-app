import dotenv from 'dotenv';
import WebSocket, { WebSocketServer } from 'ws';

dotenv.config();

const API_KEY = process.env['FINNHUB_API_KEY'];
const stocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];
let clients: WebSocket[] = [];
const staticCache: any = {};
let latestPrices: any = {};
async function loadStaticData() {
  await Promise.all(
    stocks.map(async (symbol) => {
      try {
        const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
        const metricUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${API_KEY}`;
        const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${API_KEY}`;

        const [quoteRes, metricRes, profileRes] = await Promise.all([
          fetch(quoteUrl),
          fetch(metricUrl),
          fetch(profileUrl)
        ]);

        const quote = await quoteRes.json();
        const metric = await metricRes.json();
        const profile = await profileRes.json();

        staticCache[symbol] = {
          name: profile.name,
          lastPrice: quote.pc,
          price: quote.c,
          high: quote.h,
          low: quote.l,
          high52: metric.metric?.['52WeekHigh'],
          low52: metric.metric?.['52WeekLow']
        };

      } catch (err) {
        console.error(`Error loading static data for ${symbol}`, err);
      }
    })
  );

  //Initialize all stocks
  stocks.forEach(symbol => {
    latestPrices[symbol] = {
      symbol,
      price: staticCache[symbol]?.price,
      timestamp: Date.now(),
      ...staticCache[symbol]
    };
  });

  console.log('Static data loaded:', staticCache);
}

const finnhubSocket = new WebSocket(`wss://ws.finnhub.io?token=${API_KEY}`);

finnhubSocket.on('open', () => {
  console.log('Connected to Finnhub WebSocket');
  stocks.forEach(symbol => {
    finnhubSocket.send(JSON.stringify({
      type: 'subscribe',
      symbol
    }));
  });
});

finnhubSocket.on('message', (data) => {
  const parsed = JSON.parse(data.toString());
  console.log('Pradeep:', parsed);
  if (parsed.type === 'trade' && parsed.data) {
    parsed.data.forEach((trade: any) => {
      const symbol = trade.s;

      console.log('🔥 Updating:', symbol, trade.p);

      latestPrices[symbol] = {
        ...(latestPrices[symbol] || {}),
        symbol,
        price: trade.p,
        timestamp: trade.t
      };
    });
    const fullData = Object.values(latestPrices);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(fullData));
      }
    });
  }
});

const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');
  clients.push(ws);
    //Send initial data
  ws.send(JSON.stringify(Object.values(latestPrices)));
  ws.on('message', (msg) => {
    const parsed = JSON.parse(msg.toString());

    if (parsed.type === 'TOGGLE') {
      const { symbol, isActive } = parsed;

      if (!isActive) {
        finnhubSocket.send(JSON.stringify({
          type: 'unsubscribe',
          symbol
        }));

      } else {
        finnhubSocket.send(JSON.stringify({
          type: 'subscribe',
          symbol
        }));
      }
    }
  });


  ws.on('close', () => {
    console.log('Angular client disconnected');
    clients = clients.filter(c => c !== ws);
  });
});

console.log(`WebSocket running on ws://localhost:8080`);
loadStaticData();