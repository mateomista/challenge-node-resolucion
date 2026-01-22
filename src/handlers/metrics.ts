import { Request, Response } from 'express';
import { ApiBooksProvider } from '../providers/ApiBooksProvider'; 
import { MetricsService } from '../services/MetricsService';  

const getMetrics = async (req: Request, res: Response) => {
  try {
    const booksProvider = new ApiBooksProvider();
    const metricsService = new MetricsService(booksProvider);

    const authorFilter = (req.query.author as string) || '';
    
    const metrics = await metricsService.getMetrics(authorFilter);

    return res.status(200).json(metrics);

  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default getMetrics;