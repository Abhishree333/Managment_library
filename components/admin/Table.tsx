

// components/admin/Table.tsx
import { users } from "@/database/schema";
import { InferSelectModel } from "drizzle-orm";

// Infer the User type from the users schema
type User = InferSelectModel<typeof users>;

// Define the props interface for the Table component
interface TableProps {
  users: User[] | null; // Allow users to be null or an array of User objects
}

export default function Table({ users }: TableProps) {
  // Handle cases where users is null or empty
  if (!users || users.length === 0) {
    return (
      <div className="mt-4">
        <p>No users found.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-200 px-4 py-2 text-left">University ID</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">{user.fullName || "N/A"}</td>
              <td className="border border-gray-200 px-4 py-2">{user.email || "N/A"}</td>
              <td className="border border-gray-200 px-4 py-2">{user.universityId || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}