import { BooksProvider } from './books';
import { Book } from '../models/book';

interface ApiBook {
  id: number;
  name: string;
  author: string;
  units_sold: number;
  price: number;
}

export class ApiBooksProvider implements BooksProvider {
  private readonly apiUrl = 'https://6781684b85151f714b0aa5db.mockapi.io/api/v1/books';

  async getBooks(): Promise<Book[]> {

    try {
      // 1. Hacemos la petición
      const response = await fetch(this.apiUrl);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      // 2. Obtenemos el JSON
      const rawData = (await response.json()) as ApiBook[];

      // 3. Mapeamos al dominio
      const books: Book[] = rawData.map((item) => ({
        id: String(item.id),
        name: item.name,
        author: item.author,
        unitsSold: item.units_sold, 
        price: item.price,
      }));

      return books;

    } catch (error) {
      throw new Error('No se pudo obtener la lista de libros del proveedor externo.');
    }
  }
}