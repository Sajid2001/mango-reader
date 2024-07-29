import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getSettings, loadSettings, setSettings } from "../fileStorage/settingsStorage";
import { resetUserSettings, setAllSettings } from "../reduxStorage/settingsSlice";
import { useDispatch, useSelector } from "react-redux";
import { get } from "http";
import { UserSettings } from "../models/userSettings";

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const settings = useSelector((state: any) => state.userSettings);

  const revertSettings = () => {
    loadSettings().then(() => {
      getSettings().then((oldSettings: UserSettings) => {
        dispatch(setAllSettings(oldSettings));
      })
    })
  };

  const saveSettings = () => {
    loadSettings().then(() => {
      setSettings(settings);
    })
  };

  const resetSettingsToDefault = () => {
    loadSettings().then(() => {
      getSettings().then(() => {
        dispatch(resetUserSettings());
      })
    })
  };

  return (
    <div className="h-screen w-full flex-col overflow-y-auto">
      <div className=" flex flex-wrap *:pt-3 pb-4">
        <h1 className="text-3xl pl-7 mr-2 font-bold ">Settings</h1>
        <div className="flex m-1 *:mr-2">
          <button onClick={resetSettingsToDefault} className="py-1  mb-3 font-semibold text-lg px-5 bg-accent text-background rounded-lg active:bg-slate-700">
            Reset To Default
          </button>
          <button onClick={revertSettings} className="py-1  mb-3 font-semibold text-lg px-5 bg-secondary rounded-lg active:bg-slate-200">
            Revert
          </button>
          <button onClick={saveSettings} className="py-1  mb-3 font-semibold text-lg px-5 bg-secondary rounded-lg active:bg-slate-200">
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex w-full border-b-2 border-secondary mb-4 *:-mt-4">
        <button
          onClick={() => navigate("/settings/general")}
          disabled={location.pathname === "/settings/general"}
          className="transition ease-in-out disabled:border-b-4 disabled:border-primary text-2xl p-4 border-1 border-primary"
        >
          General
        </button>
        <button
          onClick={() => navigate("/settings/reader")}
          disabled={location.pathname === "/settings/reader"}
          className="transition ease-in-out disabled:border-b-4 disabled:border-primary text-2xl p-4 border-1 border-secondary"
        >
          Reader
        </button>
      </div>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage;
