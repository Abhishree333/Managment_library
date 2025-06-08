// app/admin/book-requests/page.tsx
import { db } from "@/database/drizzle";
import { borrowRequests, users, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import BorrowRequestsTable from "@/components/admin/BorrowRequestsTable";

export default async function BorrowRequestsPage() {
  try {
    const requests = await db
      .select({
        id: borrowRequests.id,
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
        },
        book: {
          id: books.id,
          title: books.title,
          author: books.author,
        },
        status: borrowRequests.status,
        requestedAt: borrowRequests.requestedAt,
      })
      .from(borrowRequests)
      .leftJoin(users, eq(borrowRequests.userId, users.id))
      .leftJoin(books, eq(borrowRequests.bookId, books.id));

      console.log("",requests);
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Borrow Requests</h1>
        <BorrowRequestsTable requests={requests} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching borrow requests:", error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Borrow Requests</h1>
        <p className="text-red-500">Error loading borrow requests: {error.message}</p>
      </div>
    );
  }
}