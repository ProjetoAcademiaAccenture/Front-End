import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Loja from "./pages/Loja";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loja" element={<Loja />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;