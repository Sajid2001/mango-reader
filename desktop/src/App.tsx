import Sidebar from "./components/Sidebar";
import { Route, HashRouter, Routes, Navigate } from "react-router-dom";
import LibraryPage from "./pages/LibraryPage";
import SearchPage from "./pages/SearchPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import AskAIPage from "./pages/AskAIPage";
import MangaPage from "./pages/MangaPage";
import ReaderPage from "./pages/ReaderPage";
import GeneralSettings from "./pages/GeneralSettings";
import ReaderSettings from "./pages/ReaderSettings";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadSettings } from "./fileStorage/settingsStorage";
import { UserSettings } from "./models/userSettings";
import { setAllSettings } from "./reduxStorage/settingsSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    loadSettings().then((oldSettings: UserSettings) => {
      dispatch(setAllSettings(oldSettings));
    });
  }, []);
  const theme = useSelector((state: any) => state.userSettings.theme);

  // Determine if the sidebar should be hidden based on the current route

  return (
    <div className={`${theme} flex text-text`}>
      <HashRouter>
        <div className="min-h-screen bg-primary text-text">
          <Sidebar />
        </div>

        <div className=" w-full bg-background">
          <Routes>
            <Route
              path="/reader/:mangaId/:chapterId"
              element={<ReaderPage />}
            />
            <Route path="/manga/:id" element={<MangaPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />}>
              <Route path="general" element={<GeneralSettings />} />
              <Route path="reader" element={<ReaderSettings />} />
              <Route path="" element={<GeneralSettings />} />
            </Route>
            <Route path="/askai" element={<AskAIPage />} />
            <Route path="/" element={<LibraryPage />} />
          </Routes>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
