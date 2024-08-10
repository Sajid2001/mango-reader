import { IconX } from "@tabler/icons-react";
import PopupProps from "../models/popupProps";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { addProfile } from "../reduxStorage/settingsSlice";

interface ProfileMakerPopupProps extends PopupProps {
  profileNames: string[];
}
const NewProfileMaker = ({
  closePopup,
  profileNames,
}: ProfileMakerPopupProps) => {
  const dispatch = useDispatch();
  const createNewProfile = () => {
    dispatch(addProfile(profileName));
    closePopup();
  };

  const [profileName, setProfileName] = useState<string>("");

  return (
    <div className="flex items-center bg-accent-70 fixed z-20 justify-center top-0 left-0 h-screen w-screen">
      <div className="relative flex flex-col w-[400px] py-6 px-8 rounded-xl bg-primary">
        <button className="absolute top-2 right-2">
          <IconX onClick={() => closePopup()} />
        </button>
        <input
          className="py-1  mb-3 font-semibold text-lg px-5 bg-secondary rounded-lg"
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          placeholder="Enter Profile Name"
        />
        {profileNames.includes(profileName) && (
          <p className="text-accent font-bold">Profile name already exists!</p>
        )}
        <button
          onClick={() => createNewProfile()}
          disabled={profileNames.includes(profileName)}
          className="py-1  font-semibold text-lg px-5 bg-accent disabled:opacity-50 text-background rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewProfileMaker;
