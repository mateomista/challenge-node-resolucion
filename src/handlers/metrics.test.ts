import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import getMetrics from './metrics'; 
import { Request, Response } from 'express';

const mockBooks = [
  { id: '1', name: 'Book 1', author: 'Author 1', unitsSold: 100, price: 20 },
  { id: '2', name: 'Book 2', author: 'Author 2', unitsSold: 200, price: 15 },
  { id: '3', name: 'Book 3', author: 'Author 1', unitsSold: 300, price: 25 }
];

const mockGetBooks = vi.fn();

vi.mock('../providers/ApiBooksProvider', () => {
  return {
    ApiBooksProvider: vi.fn().mockImplementation(() => {
      return {
        getBooks: mockGetBooks
      };
    })
  };
});

describe('metricsHandler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    mockGetBooks.mockResolvedValue(mockBooks);

    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnThis(); 
    
    mockRes = {
      status: statusMock,
      json: jsonMock
    };

    mockReq = {
      query: {}
    };
    
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getMetrics', () => {
    it('should return metrics with empty author query', async () => {
      await getMetrics(mockReq as Request, mockRes as Response);

      expect(mockGetBooks).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      
      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: 200, 
        cheapest_book: mockBooks[1], 
        books_written_by_author: [] 
      });
    });

    it('should return metrics with author query', async () => {
      mockReq.query = { author: 'Author 1' };

      await getMetrics(mockReq as Request, mockRes as Response);

      expect(mockGetBooks).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);

      expect(jsonMock).toHaveBeenCalledWith({
        mean_units_sold: 200,
        cheapest_book: mockBooks[1],
        books_written_by_author: [
          mockBooks[0],
          mockBooks[2]
        ]
      });
    });

    it('should handle errors and return 500', async () => {
      mockGetBooks.mockRejectedValue(new Error('API Error'));

      await getMetrics(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ 
        message: 'Internal Server Error' 
      });
    });
  });
});