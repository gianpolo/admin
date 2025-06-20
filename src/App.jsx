import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import SelfSchedulingConfigurations from "./pages/SelfSchedulingConfigurations.jsx";
import CreateSelfSchedulingConfiguration from "./pages/CreateSelfSchedulingConfiguration.jsx";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import RequireAuth from "./components/auth/RequireAuth.jsx";
export default function App() {
    return (<>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
            <Route index path="/" element={<Home />}/>
            <Route path="/self-scheduling-configurations" element={<SelfSchedulingConfigurations />}/>
            <Route path="/self-scheduling-configurations/new" element={<CreateSelfSchedulingConfiguration />}/>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </Router>
    </>);
}
