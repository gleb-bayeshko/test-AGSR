import ComponentWithChildren from "@/utils/types/componentWithChildren";
import { Suspense } from "react";

export const metadata = {
  title: "Авторизация",
};

export default function RootLayout({ children }: ComponentWithChildren) {
  return <Suspense>{children}</Suspense>;
}
