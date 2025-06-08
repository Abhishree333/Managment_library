// components/admin/BorrowRequestsTable.tsx
"use client";

import { InferSelectModel } from "drizzle-orm";
import { users, books, borrowRequests } from "@/database/schema";

// Infer types from schema
type User = InferSelectModel<typeof users>;
type Book = InferSelectModel<typeof books>;
type BorrowRequest = InferSelectModel<typeof borrowRequests>;

// Define the Request interface to match the query result
interface Request {
  id: string; // UUID as string
  user: { id: string; fullName: string | null; email: string | null } | null; // Allow null due to LEFT JOIN
  book: { id: string; title: string | null; author: string | null } | null; // Allow null due to LEFT JOIN
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string | Date | null; // Handle string or Date from the database
}

interface TableProps {
  requests: Request[] | null;
}

export default function BorrowRequestsTable({ requests }: TableProps) {
  // Handle empty or null requests
  if (!requests || requests.length === 0) {
    return (
      <div className="mt-4">
        <p>No borrow requests found.</p>
      </div>
    );
  }

  // Format date safely
  const formatDate = (date: string | Date | null): string => {
    if (!date) return "N/A";
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "Invalid Date";
      return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Update request status
  const updateRequestStatus = async (requestId: string, newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    try {
      const response = await fetch(`/api/borrow-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        window.location.reload(); // Refresh the page to reflect changes
      } else {
        const errorData = await response.json();
        console.error("Failed to update request status:", errorData.error);
        alert(`Error: ${errorData.error}`); // Show error to user
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      alert("Error: Unable to update request status. Please try again.");
    }
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2 text-left">User</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Book</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Author</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Requested At</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">
                {request.user?.fullName || "Unknown User"}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {request.book?.title || "Unknown Book"}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                {request.book?.author || "Unknown Author"}
              </td>
              <td className="border border-gray-200 px-4 py-2">{request.status}</td>
              <td className="border border-gray-200 px-4 py-2">
                {formatDate(request.requestedAt)}
              </td>
              <td className="border border-gray-200 px-4 py-2">
                <button
                  onClick={() => updateRequestStatus(request.id, "APPROVED")}
                  className={`mr-2 rounded px-2 py-1 text-white ${
                    request.status === "APPROVED"
                      ? "cursor-not-allowed bg-green-300"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  disabled={request.status === "APPROVED"}
                >
                  Approve
                </button>
                <button
                  onClick={() => updateRequestStatus(request.id, "REJECTED")}
                  className={`mr-2 rounded px-2 py-1 text-white ${
                    request.status === "REJECTED"
                      ? "cursor-not-allowed bg-red-300"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                  disabled={request.status === "REJECTED"}
                >
                  Reject
                </button>
                <button
                  onClick={() => updateRequestStatus(request.id, "PENDING")}
                  className={`rounded px-2 py-1 text-white ${
                    request.status === "PENDING"
                      ? "cursor-not-allowed bg-yellow-300"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                  disabled={request.status === "PENDING"}
                >
                  Pending
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}