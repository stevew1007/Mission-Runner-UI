import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { themeSettings } from "./theme";
import Dashboard from "./scenes/dashboard";
import Publishing from "./scenes/publishing";
import Running from "./scenes/running";
import Inprogress from "./scenes/inprogress";
import Completeing from "./scenes/completing";
import Account from "./scenes/account";
import { Routes, Route, Navigate } from "react-router-dom";
import { useGlobal } from "./contexts/GlobalProvider";
import { useMemo } from "react";
import LoginPage from "./scenes/login";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import RegisterAccountPage from "./scenes/register_account";
import RegUserPage from "./scenes/register_user";
import Invalid from "./scenes/invalid";
import AdminRoute from "./components/AdminRoute";
// import AdminActivate from "./scenes/admin_";
import AdminSetRole from "./scenes/admin_setrole";
import AdminActivateAccount from "./scenes/admin_activateaccount";
import AdminAudit from "./scenes/admin_audit";
import Paying from "./scenes/paying";
import Confirming from "./scenes/confirming";
import RunnerRoute from "./components/RunnerRoute";

function App() {
    const { mode } = useGlobal();
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
                <main className="content">
                    <Routes>
                        <Route path="/404" element={<Invalid />} />
                        <Route
                            path="/login"
                            element={
                                <PublicRoute>
                                    <LoginPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute>
                                    <RegUserPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/"
                            element={<Navigate to="/inprogress" />}
                        />
                        <Route
                            path="*"
                            element={
                                <PrivateRoute>
                                    <Routes>
                                        <Route
                                            path="/admin/set_role"
                                            element={
                                                <AdminRoute>
                                                    <AdminSetRole />
                                                </AdminRoute>
                                            }
                                        />
                                        <Route
                                            path="/admin/activate"
                                            element={
                                                <AdminRoute>
                                                    <AdminActivateAccount />
                                                </AdminRoute>
                                            }
                                        />
                                        <Route
                                            path="/admin/audit"
                                            element={
                                                <AdminRoute>
                                                    <AdminAudit />
                                                </AdminRoute>
                                            }
                                        />
                                        <Route
                                            path="/"
                                            element={
                                                <Navigate to="/inprogress" />
                                            }
                                        />
                                        <Route
                                            path="/dashboard"
                                            element={<Dashboard />}
                                        />
                                        <Route
                                            path="/publishing"
                                            element={<Publishing />}
                                        />
                                        <Route
                                            path="/paying"
                                            element={<Paying />}
                                        />
                                        <Route
                                            path="/running"
                                            element={
                                                <RunnerRoute>
                                                    <Running />
                                                </RunnerRoute>
                                            }
                                        />
                                        <Route
                                            path="/inprogress"
                                            element={<Inprogress />}
                                        />
                                        <Route
                                            path="/completing"
                                            element={
                                                <RunnerRoute>
                                                    <Completeing />
                                                </RunnerRoute>
                                            }
                                        />
                                        <Route
                                            path="/confirming"
                                            element={
                                                <RunnerRoute>
                                                    <Confirming />
                                                </RunnerRoute>
                                            }
                                        />
                                        <Route
                                            path="/account"
                                            element={<Account />}
                                        />

                                        <Route
                                            path="/register_account"
                                            element={<RegisterAccountPage />}
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
