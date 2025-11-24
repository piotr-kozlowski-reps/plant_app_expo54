import LoginEntryPage from "@/features/auth/ui/LoginEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const LoginPage = () => {
  return (
    <>
      <LoginEntryPage />
    </>
  );
};

export default LoginPage;
