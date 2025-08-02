import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, SnackbarProvider, useAuth } from '@/context';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './components/theme';
import { LoadingAnimation } from '@/components/loading-animation';

export const queryClient = new QueryClient();
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  if (!auth.isAuthReady) {
    return <LoadingAnimation />; // or your splash component
  }
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <AuthProvider>
            <CssBaseline />
            <InnerApp />
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
