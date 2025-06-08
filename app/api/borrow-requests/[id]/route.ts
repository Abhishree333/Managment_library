// app/api/borrow-requests/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Import auth from NextAuth.js v5
import { db } from "@/database/drizzle";
import { borrowRequests, books, borrowRecords, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  // Check if user is authenticated
  const session = await auth();

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
  }

  // Fetch the user's role from the database since it's not in the session
  const user = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user[0] || user[0].role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  // Proceed with updating the borrow request
  try {
    const { id } = params;
    const { status } = await request.json();

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const borrowRequest = await db
      .select()
      .from(borrowRequests)
      .where(eq(borrowRequests.id, id))
      .limit(1);

    if (!borrowRequest[0]) {
      return NextResponse.json({ error: "Borrow request not found" }, { status: 404 });
    }

    const currentRequest = borrowRequest[0];
    const bookId = currentRequest.bookId;

    if (status === "APPROVED" && currentRequest.status !== "APPROVED") {
      const book = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
      if (!book[0] || book[0].availableCopies <= 0) {
        return NextResponse.json({ error: "Book not available" }, { status: 400 });
      }

      await db
        .update(books)
        .set({ availableCopies: book[0].availableCopies - 1 })
        .where(eq(books.id, bookId));

      const borrowDate = new Date();
      const dueDate = new Date(borrowDate);
      dueDate.setDate(borrowDate.getDate() + 14);
      await db.insert(borrowRecords).values({
        id: uuidv4(),
        userId: currentRequest.userId,
        bookId: currentRequest.bookId,
        borrowDate,
        dueDate: dueDate.toISOString().split("T")[0],
        status: "BORROWED",
        createdAt: new Date(),
      });
    } else if (status === "REJECTED" && currentRequest.status === "APPROVED") {
      const book = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
      if (book[0]) {
        await db
          .update(books)
          .set({ availableCopies: book[0].availableCopies + 1 })
          .where(eq(books.id, bookId));
      }

      await db
        .update(borrowRecords)
        .set({ status: "RETURNED", returnDate: new Date().toISOString().split("T")[0] })
        .where(eq(borrowRecords.bookId, bookId));
    }

    const updatedRequest = await db
      .update(borrowRequests)
      .set({ status, updatedAt: new Date() })
      .where(eq(borrowRequests.id, id))
      .returning();

    return NextResponse.json(updatedRequest[0]);
  } catch (error) {
    console.error("Error updating borrow request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}