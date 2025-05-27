import { SnackbarProvider } from "notistack";
import ComponentWithChildren from "@/utils/types/componentWithChildren";

export default function NotistackProvider({ children }: ComponentWithChildren) {
  return (
    <SnackbarProvider
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {children}
    </SnackbarProvider>
  );
}
