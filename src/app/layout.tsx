import Providers from "@/app/_providers";
import ComponentWithChildren from "@/utils/types/componentWithChildren";
import { Modals } from "./_modals";

export const metadata = {
  title: "Приложение To Do",
};

export default function RootLayout({ children }: ComponentWithChildren) {
  return (
    <html lang="ru">
      <body>
        <Providers>
          <Modals />
          {children}
        </Providers>
      </body>
    </html>
  );
}
