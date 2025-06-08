// import { BorrowBook } from '@/components/BorrowBook';
// interface Book {
//   id: number;
//   id: string;
//   title: string;
//   author: string;
//   genre: string;
//   rating: number;
//   total_copies: number;
//   available_copies: number;
//   totalCopies: number;
//   availableCopies: number;
//   description: string;
//   color: string;
//   cover: string;
//   video: string;
//   coverColor: string;
//   coverUrl: string;
//   videoUrl: string;
//   summary: string;
//   isLoanedBook?: boolean;
//   createdAt: Date | null;
// }

// interface AuthCredentials {
// @@ -21,3 +21,16 @@ interface AuthCredentials {
//   universityId: number;
//   universityCard: string;
// }

// interface BookParams {
//   title: string;
//   author: string;
//   genre: string;
//   rating: number;
//   coverUrl: string;
//   coverColor: string;
//   description: string;
//   totalCopies: number;
//   videoUrl: string;
//   summary: string;
// }

// interface BorrowBookParams {
//   bookId : string;
//   userId : string;

// }

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
  universityCard: string;
}

interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}