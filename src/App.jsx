import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import SchedulingSessionListPage from "./pages/SchedulingPages/SchedulingSessionListPage";
import AddSchedulingPlanPage from "./pages/SchedulingPages/AddSchedulingPlanPage";
import SchedulingDetailsPage from "./pages/SchedulingPages/SchedulingDetailsPage";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import RequireAuth from "./components/auth/RequireAuth";
import SignIn from "./pages/AuthPages/SignIn";
export default function App() {
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
            <Route path="/scheduling-plans" element={<SchedulingSessionListPage />} />
            <Route path="/scheduling-plans/new" element={<AddSchedulingPlanPage />} />
            <Route path="/scheduling-plans/:id" element={<SchedulingDetailsPage />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
