import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { themeSettings } from "./theme";
import Dashboard from "./scenes/dashboard";
import Publishing from "./scenes/publishing";
import Running from "./scenes/running";
import Inprogress from "./scenes/inprogress";
import Completeing from "./scenes/completing";
import { Routes, Route } from "react-router-dom";
import { useGlobal } from "./contexts/GlobalProvider";
import { useMemo } from "react";
import LoginPage from "./scenes/login";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";

function App() {
    const { mode } = useGlobal();
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
                <main className="content">
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <LoginPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <PrivateRoute>
                                    <Routes>
                                        <Route
                                            path="/dashboard"
                                            element={<Dashboard />}
                                        />
                                        <Route
                                            path="/publishing"
                                            element={<Publishing />}
                                        />
                                        <Route
                                            path="/running"
                                            element={<Running />}
                                        />
                                        <Route
                                            path="/inprogress"
                                            element={<Inprogress />}
                                        />
                                        <Route
                                            path="/completing"
                                            element={<Completeing />}
                                        />
                                    </Routes>
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </main>
            </div>
        </ThemeProvider>
    );
}

export default App;
