import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import SelfSchedulingListPage from "./pages/SelfSchedulingPages/SelfSchedulingListPage.jsx";
import AddSelfSchedulingPage from "./pages/SelfSchedulingPages/AddSelfSchedulingPage.jsx";
import SelfSchedulingDetailsPage from "./pages/SelfSchedulingPages/SelfSchedulingDetailsPage.jsx";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import RequireAuth from "./components/auth/RequireAuth.jsx";
import SignIn from "./pages/AuthPages/SignIn.jsx";
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
            <Route path="/self-schedulings" element={<SelfSchedulingListPage />} />
            <Route path="/self-schedulings/new" element={<AddSelfSchedulingPage />} />
            <Route path="/self-schedulings/:id" element={<SelfSchedulingDetailsPage />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
