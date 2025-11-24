import IndexEntryPage from "@/features/index/ui/IndexEntryPage";
import { router, type ErrorBoundaryProps } from "expo-router";

// //must be last import
// import "react-native-reanimated";

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  router.push(`/global_error?error_message=${error.message}`);
}

const IndexPage = () => {
  return (
    <>
      <IndexEntryPage />
    </>
  );
};

export default IndexPage;
