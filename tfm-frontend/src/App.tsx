import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./Components/Landing/Landing";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Main from "./Components/Main/Main";
import Perfil from "./Components/Perfil/Perfil";
import Ligas from "./Components/Ligas/Ligas";
import Equipos from "./Components/Equipos/Equipos";
import { AuthProvider } from "./Hooks/useAuth";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";

const theme = createTheme({
  palette: {
    primary: {
      main: '#D60D8C',
    },
  },
});

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Main />
                  </PrivateRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <PrivateRoute>
                    <Perfil />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ligas"
                element={
                  <PrivateRoute>
                    <Ligas />
                  </PrivateRoute>
                }
              />
              <Route
                path="/equipos"
                element={
                  <PrivateRoute>
                    <Equipos />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
