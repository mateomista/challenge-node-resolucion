import { Book } from '../models/book.ts'

export interface BooksProvider {
  getBooks(): Promise<Book[]>
}
