import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import SelfSchedulingConfigurations from "./pages/ConfigurationPages/SelfSchedulingConfigurations.jsx";
import CreateSelfSchedulingConfiguration from "./pages/ConfigurationPages/CreateSelfSchedulingConfiguration.jsx";
import SelfSchedulingConfigurationDetails from "./pages/ConfigurationPages/SelfSchedulingConfigurationDetails.jsx";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import RequireAuth from "./components/auth/RequireAuth.jsx";
import SignIn from "./pages/AuthPages/SignIn.jsx";
export default function App() {
  console.log("App component rendered");
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route index path="/" element={<Home />} />
            <Route
              path="/self-scheduling-configurations"
              element={<SelfSchedulingConfigurations />}
            />
            <Route
              path="/self-scheduling-configurations/new"
              element={<CreateSelfSchedulingConfiguration />}
            />
            <Route
              path="/self-scheduling-configurations/:id"
              element={<SelfSchedulingConfigurationDetails />}
            />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
