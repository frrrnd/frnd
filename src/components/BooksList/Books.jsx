import React, { useState, useEffect } from 'react';
import './books.module.css';
import { motion } from 'framer-motion';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/data/books.json'); // Ajuste o caminho conforme necessário
        if (!response.ok) {
          throw new Error('Falha ao carregar os dados');
        }
        const data = await response.json();

        const booksId = data.map((book, index) => ({
            id: index + 1,
            ...book
        }));
        setBooks(booksId);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Agrupa os livros por ano
  const groupBooksByYear = (books) => {
    const grouped = {};
    books.forEach(book => {
      if (!grouped[book.yearRead]) {
        grouped[book.yearRead] = [];
      }
      grouped[book.yearRead].push(book);
    });
    return Object.entries(grouped).sort((a, b) => b[0] - a[0]); // Ordena por ano decrescente
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  const groupedBooks = groupBooksByYear(books);

  return (
    <div className="w-full p-4 space-y-8">
      {groupedBooks.map(([year, books]) => (
        <div key={year} className="books__year">
          <h2>{year}</h2>
          <div className="books__wrapper">
            {books.map((book) => (
              <div key={book.id} className="book">
                <div className="book__inner">
                  <img
                    src={book.coverUrl}
                    alt={`Capa do livro ${book.title}`}
                  />
                  <div className="space-y-2">
                    <h2>{book.title}</h2>
                    <p>{book.author}</p>
                    
                      <span className="books--status">
                      {book.status === 'reading' ? 'Reading' : 'Read'}
                      </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Books;