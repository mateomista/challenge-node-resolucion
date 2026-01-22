import { BooksProvider } from '../providers/books';
import { Book } from '../models/book';
import { MetricsResponse } from '../models/types'; 

export class MetricsService {

  constructor(private readonly booksProvider: BooksProvider) {}

  /**
   * @param authorFilter (Opcional) El autor por el cual filtrar.
   */
  async getMetrics(authorFilter?: string): Promise<MetricsResponse> {
    // 1. Obtener datos
    const books = await this.booksProvider.getBooks();

    // 2. Aplicar lógica de negocio
    const meanUnitsSold = this.calculateMeanUnitsSold(books);
    const cheapestBook = this.findCheapestBook(books);
    
    // Si no hay filtro, devolvemos array vacío (según lógica original) o todos (según lógica nueva).
    const booksWrittenByAuthor = authorFilter 
      ? this.filterBooksByAuthor(books, authorFilter) 
      : [];

    return {
      mean_units_sold: meanUnitsSold,
      cheapest_book: cheapestBook,
      books_written_by_author: booksWrittenByAuthor,
    };
  }

  // --- Métodos privados ---

  private calculateMeanUnitsSold(books: Book[]): number {
    if (books.length === 0) return 0;
    const totalUnitsSold = books.reduce((sum, book) => sum + book.unitsSold, 0);
    return totalUnitsSold / books.length; 
  }

  private findCheapestBook(books: Book[]): Book | null {
    if (books.length === 0) return null;
    return books.reduce((cheapest, book) => {
      return book.price < cheapest.price ? book : cheapest;
    }, books[0]);
  }

  private filterBooksByAuthor(books: Book[], author: string): Book[] {
    return books.filter(book => book.author.toLowerCase() === author.toLowerCase());
  }
}