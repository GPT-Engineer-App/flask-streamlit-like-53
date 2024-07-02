import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import LogOutput from "./pages/LogOutput.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/log-output" element={<LogOutput />} />
      </Routes>
    </Router>
  );
}

export default App;