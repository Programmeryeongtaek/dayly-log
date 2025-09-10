import LoginPageContent from "@/components/auth/LoginPageContent";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-accent-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
