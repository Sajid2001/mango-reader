import {
  IconArrowsHorizontal,
  IconArrowsVertical,
  IconBook,
  IconCircleArrowLeft,
  IconCircleArrowRight,
  IconSpacingVertical,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDefaultFitHeight,
  setDefaultLeftToRight,
  setDefaultSinglePage,
  setLeftPageKeybind,
  setPageGap,
  setRightPageKeybind,
} from "../reduxStorage/settingsSlice";
import { UserSettings } from "../models/userSettings";
import { selectProfiles } from "../reduxStorage/selectors";
import KeybindSelector from "../components/KeybindSelector";

const ReaderSettings = () => {
  const iconSize = 24;

  const [showKeybindPopup, setShowKeybindPopup] = useState(false);

  const profiles = useSelector((state: any) => state.userSettings.profiles);
  const activeProfile = useSelector(
    (state: any) => state.userSettings.activeProfile
  );

  const leftPageKeybind = useSelector(
    (state: any) => state.userSettings.leftPageKeybind
  );

  const rightPageKeybind = useSelector(
    (state: any) => state.userSettings.rightPageKeybind
  );

  const leftChapterKeybind = useSelector(
    (state: any) => state.userSettings.leftChapterKeybind
  );

  const rightChapterKeybind = useSelector(
    (state: any) => state.userSettings.rightChapterKeybind
  );

  const sidebarKeybind = useSelector(
    (state: any) => state.userSettings.sidebarKeybind
  );

  const exitKeybind = useSelector(
    (state: any) => state.userSettings.exitKeybind
  );

  const changeKeybind = (keybind: string) => {
    setShowKeybindPopup(true);
    console.log(keybind);
  };

  // const singlePage = useSelector(
  //   (state: any) => state.userSettings.profiles[0].defaultSinglePage
  // );
  // const fitHeight = useSelector(
  //   (state: any) => state.userSettings.defaultFitHeight
  // );
  // const leftToRight = useSelector(
  //   (state: any) => state.userSettings.defaultLeftToRight
  // );
  // const pageGap = useSelector((state: any) => state.userSettings.pageGap);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(profiles);
    console.log(activeProfile);
  });

  return (
    <div className="*:py-3 *:px-4">
      <div className="ml-4 ">
        <h3 className="text-xl font-bold pb-3 ">Profile</h3>
        <div className="ml-2">
          <select className="pr-8">
            <option value="default">Default</option>
            <option value="custom">Custom</option>
          </select>
          <button className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold">
            Create New Profile
          </button>
        </div>
      </div>

      <div className="ml-4 ">
        <h3 className="text-xl font-bold mb-4 ">Layout</h3>
        <h4 className="text-md font-bold pb-2">Page Style</h4>
        <div className="ml-2 mb-4 grid grid-cols-2 grid-rows-1 *:gap-2 *:justify-center w-fit bg-secondary rounded-lg">
          <button
            disabled={profiles[activeProfile].defaultSinglePage}
            onClick={() => dispatch(setDefaultSinglePage(true))}
            className="flex w-44 bg-inherit px-2 py-1 h-full rounded-l-lg disabled:rounded-lg disabled:bg-primary font-semibold border-2 border-secondary disabled:border-text disabled:ring-0 disabled:ring-offset-0"
          >
            <IconBook size={iconSize} />
            Single Page
          </button>
          <button
            disabled={!profiles[activeProfile].defaultSinglePage}
            onClick={() => dispatch(setDefaultSinglePage(false))}
            className="flex w-44 bg-inherit px-2 py-1 h-full rounded-r-lg disabled:rounded-lg disabled:bg-primary font-semibold border-2 border-secondary disabled:border-text disabled:ring-0 disabled:ring-offset-0"
          >
            <IconSpacingVertical size={iconSize} />
            Long Strip
          </button>
        </div>

        <h4 className="text-md font-bold pb-2">Page Gap</h4>
        <div className="ml-2 mb-4 w-full">
          <input
            required
            value={profiles[activeProfile].pageGap}
            min={0}
            onChange={(e) => dispatch(setPageGap(e.target.valueAsNumber))}
            className="p-1 pl-1 w-[100px]  text-md bg-secondary rounded-lg font-semibold text-right pr-2 custom-number-input"
            type="number"
          />
          <span className="-ml-11 mr-6 font-semibold">px</span>
          <button
            onClick={() => dispatch(setPageGap(0))}
            className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold"
          >
            Reset Margins
          </button>
        </div>

        <h4 className="text-md font-bold pb-2">Direction</h4>
        <div className="ml-2 mb-4 grid grid-cols-2 grid-rows-1 *:gap-2 *:justify-center w-fit bg-secondary rounded-lg">
          <button
            disabled={!profiles[activeProfile].defaultLeftToRight}
            onClick={() => dispatch(setDefaultLeftToRight(false))}
            className="flex w-44 bg-inherit px-2 py-1 h-full rounded-l-lg disabled:rounded-lg disabled:bg-primary font-semibold border-2 border-secondary disabled:border-text disabled:ring-0 disabled:ring-offset-0"
          >
            <IconCircleArrowLeft size={iconSize} />
            Right To Left
          </button>
          <button
            disabled={profiles[activeProfile].defaultLeftToRight}
            onClick={() => dispatch(setDefaultLeftToRight(true))}
            className="flex w-44 bg-inherit px-2 py-1 h-full rounded-r-lg disabled:rounded-lg disabled:bg-primary font-semibold border-2 border-secondary disabled:border-text disabled:ring-0 disabled:ring-offset-0"
          >
            <IconCircleArrowRight size={iconSize} />
            Left To Right
          </button>
        </div>

        <h4 className="text-md font-bold pb-2">Page Fit</h4>
        <div className="ml-2 mb-4 grid grid-cols-2 grid-rows-1 *:gap-2 *:justify-center w-fit bg-secondary rounded-lg">
          <button
            disabled={!profiles[activeProfile].defaultFitHeight}
            onClick={() => dispatch(setDefaultFitHeight(false))}
            className="flex w-44 bg-inherit px-2 py-1 h-full rounded-l-lg disabled:rounded-lg disabled:bg-primary font-semibold border-2 border-secondary disabled:border-text disabled:ring-0 disabled:ring-offset-0"
          >
            <IconArrowsHorizontal size={iconSize} />
            Fit Width
          </button>
          <button
            disabled={profiles[activeProfile].defaultFitHeight}
            onClick={() => dispatch(setDefaultFitHeight(true))}
            className="flex w-44 bg-inherit px-2 py-1 h-full rounded-r-lg disabled:rounded-lg disabled:bg-primary font-semibold border-2 border-secondary disabled:border-text disabled:ring-0 disabled:ring-offset-0"
          >
            <IconArrowsVertical size={iconSize} />
            Fit Height
          </button>
        </div>

        <h3 className="text-xl font-bold pb-2 ">Keybinds</h3>
        <div className="*:w-full *:border-b-2 *:border-primary font-semibold">
          <div className="flex items-center justify-between p-2">
            <p className="align-bottom">Move Page Left</p>
            <button
              onClick={() => changeKeybind(leftChapterKeybind)}
              className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold"
            >
              {leftPageKeybind}
            </button>
          </div>
          <div className="flex items-center justify-between p-2">
            <p className="align-bottom">Move Page Right</p>
            <button className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold">
              {rightPageKeybind}
            </button>
          </div>
          <div className="flex items-center justify-between p-2">
            <p className="align-bottom">Move Chapter Left</p>
            <button className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold">
              {leftChapterKeybind}
            </button>
          </div>
          <div className="flex items-center justify-between p-2">
            <p className="align-bottom">Move Chapter Right</p>
            <button className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold">
              {rightChapterKeybind}
            </button>
          </div>
          <div className="flex items-center justify-between p-2">
            <p className="align-bottom">Open Reader Sidebar</p>
            <button className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold">
              {sidebarKeybind}
            </button>
          </div>
          <div className="flex items-center justify-between p-2">
            <p className="align-bottom">Go Back</p>
            <button className="ml-2 w-44 bg-secondary px-2 py-1 h-full rounded-lg font-semibold">
              {exitKeybind}
            </button>
          </div>
        </div>
      </div>
      {showKeybindPopup && <div></div>}
    </div>
  );
};

export default ReaderSettings;
