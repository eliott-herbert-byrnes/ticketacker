import { ThemeProvider as BaseThemeProvider } from "next-themes";

type themeProviderType = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: themeProviderType) => {
  return (
    <BaseThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </BaseThemeProvider>
  );
};

export { ThemeProvider };
