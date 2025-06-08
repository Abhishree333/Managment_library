// app/admin/layout.tsx
import React, { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import "@/styles/admin.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  console.log("Full session:", session);

  if (!session?.user?.id) {
    console.log("Redirecting to /sign-in: No session or user ID");
    redirect("/sign-in");
  }

  console.log("User ID:", session.user.id);

  let user;
  try {
    user = await db
      .select({ isAdmin: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);
    console.log("User query result:", user);
  } catch (error) {
    console.error("Error querying user role:", error);
    redirect("/"); // Redirect on error to avoid breaking the layout
  }

  const isAdmin = user[0]?.isAdmin === "ADMIN";
  console.log("Is user an admin?", isAdmin);

  if (!isAdmin) {
    console.log("Redirecting to /: User is not an admin");
    redirect("/");
  }

  return (
    <main className="flex min-h-screen w-full flex-row">
      <Sidebar session={session} />
      <div className="admin-container">
        <Header session={session} />
        {children}
      </div>
    </main>
  );
};

export default Layout;