import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API router definitions
  app.get('/api/cambio', async (req, res) => {
    try {
      const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL');
      if (response.ok) {
        const data = await response.json();
        const usdRate = parseFloat(data.USDBRL?.ask || '5.06');
        const eurRate = parseFloat(data.EURBRL?.ask || '5.52');
        
        // Format modern date info
        const date = new Date();
        const localTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return res.json({
          USD_BRL: usdRate,
          EUR_BRL: eurRate,
          timestamp: localTime,
        });
      }
      throw new Error('Retorno incorreto da AwesomeAPI');
    } catch (error) {
      console.warn('Erro ao requisitar cotação live. Servindo valores estáticos.', error);
      return res.json({
        USD_BRL: 5.06,
        EUR_BRL: 5.52,
        timestamp: 'Valores padrão (Offline)',
      });
    }
  });

  // Serve static assets or configure development Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Canivete Suíço HTTP] Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
