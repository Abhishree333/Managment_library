// app/admin/users/page.tsx
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import Table from "@/components/admin/Table";

export default async function UsersPage() {
  try {
    const allUsers = await db.select().from(users);
    console.log("Fetched users:", allUsers); // Debug log

    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">All Users</h1>
        <Table users={allUsers} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Users</h1>
        <p className="text-red-500">Error loading users: {error.message}</p>
      </div>
    );
  }
}