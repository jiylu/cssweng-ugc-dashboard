"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AuthUser,
  getCurrentUser,
  logoutUser,
} from "@/lib/auth-session";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void getCurrentUser()
        .then((currentUser) => setUser(currentUser))
        .catch((error) =>
          setSessionError(
            error instanceof Error ? error.message : "Unable to load session.",
          ),
        )
        .finally(() => setHasCheckedSession(true));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ff] p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-[#8811FF]/10 text-[#8811FF]">
            <UserCircle className="size-5" />
          </div>
          <CardTitle>Temporary Dashboard</CardTitle>
          <CardDescription>
            Session test page. This can be deleted once the real dashboard is
            ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasCheckedSession && (
            <p className="text-sm text-muted-foreground">Checking session...</p>
          )}

          {hasCheckedSession && !user && (
            <p className="text-sm text-muted-foreground">
              {sessionError ||
                "No active session cookie was found. Log in again to test session persistence."}
            </p>
          )}

          {user && (
            <div className="space-y-3 rounded-lg border bg-white p-4 text-sm">
              <div>
                <p className="text-muted-foreground">First name</p>
                <p className="font-medium">{user.first_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last name</p>
                <p className="font-medium">{user.last_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="break-all font-medium">{user.email}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            className="w-full"
            variant={user ? "destructive" : "default"}
            onClick={user ? handleLogout : () => router.push("/login")}
          >
            {user && <LogOut className="size-4" />}
            {user ? "Logout and Clear Session" : "Back to Login"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
