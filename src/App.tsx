import { BrowserRouter } from 'react-router-dom';

import { Router } from './Router';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Appbar } from './components/Appbar';

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Appbar />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
