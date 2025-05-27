"use client";
import ComponentWithChildren from "@/utils/types/componentWithChildren";
import TanstackQueryProvider from "./TanstackQueryProvider";
import StoreProvider from "./StoreProvider";
import MuiThemeProvider from "./MuiThemeProvider";
import NotistackProvider from "./NotistackProvider";
import MuiLocalizationProvider from "./MuiLocalizationProvider";

// Компонент для обертки всех провайдеров
function Providers({ children }: ComponentWithChildren) {
  return (
    <StoreProvider>
      <TanstackQueryProvider>
        <MuiThemeProvider>
          <MuiLocalizationProvider>
            <NotistackProvider>{children}</NotistackProvider>
          </MuiLocalizationProvider>
        </MuiThemeProvider>
      </TanstackQueryProvider>
    </StoreProvider>
  );
}

export default Providers;
