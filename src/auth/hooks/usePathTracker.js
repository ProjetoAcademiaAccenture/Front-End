import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function usePathTracker(module, saveLastPath) {
  const location = useLocation();

  useEffect(() => {
    if (
      !location.pathname.includes("login") &&
      !location.pathname.includes("signup")
    ) {
      saveLastPath(module, location.pathname);
    }
  }, [location.pathname, module, saveLastPath]);
}
