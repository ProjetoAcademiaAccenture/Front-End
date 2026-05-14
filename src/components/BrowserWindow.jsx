import { useContext } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { AuthContext } from "../auth/context/AuthContext";

import LojaLayout from "../modules/loja/LojaLayout";
import BancoLayout from "../modules/banco/BancoLayout";

import "./BrowserWindow.css";
import { ROUTES } from "../constants";

export default function BrowserWindow() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setActiveModule } = useContext(AuthContext);

  const activeTab = location.pathname.startsWith("/banco") ? "banco" : "loja";

  const handleTabSwitch = (tab) => {
    setActiveModule(tab);

    navigate(tab === "loja" ? ROUTES.LOGIN_SHOP : ROUTES.LOGIN_BANK);
  };

  return (
    <div className="desktop">
      <div className="pc-window">
        {/* Titlebar */}
        <div className="titlebar">
          <div className="dot red"></div>
          <div className="dot yellow"></div>
          <div className="dot green"></div>

          <span className="titlebar-text">E-Commerce System</span>
        </div>

        {/* Tabs */}
        <div className="tab-bar">
          <button
            className={`tab ${activeTab === "loja" ? "active" : ""}`}
            onClick={() => handleTabSwitch("loja")}
            type="button"
          >
            🛍️ Loja Online
          </button>

          <button
            className={`tab ${activeTab === "banco" ? "active" : ""}`}
            onClick={() => handleTabSwitch("banco")}
            type="button"
          >
            🏦 Banco Digital
          </button>
        </div>

        {/* Address bar */}
        <div className="address-bar">
          <span className="address-icon">🔒</span>

          <div className="address-input">{location.pathname}</div>
        </div>

        {/* Conteúdo */}
        <div className="browser-content">
          <Routes>
            <Route path="/loja/*" element={<LojaLayout />} />

            <Route path="/banco/*" element={<BancoLayout />} />

            <Route path="*" element={<navigate to={ROUTES.LOGIN_SHOP} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
