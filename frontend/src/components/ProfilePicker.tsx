import { profileInitials } from "../utils/workflow";

type ProfilePickerProps = {
  profiles: string[];
  activeProfile: string;
  onPick: (name: string) => void;
};

export function ProfilePicker({ profiles, activeProfile, onPick }: ProfilePickerProps) {
  return (
    <div className="profile-picker">
      <p className="picker-label">Active profile</p>
      <div className="profile-options">
        {profiles.map((name) => (
          <button
            key={name}
            type="button"
            className={`profile-chip ${activeProfile === name ? "is-active" : ""}`}
            onClick={() => onPick(name)}
          >
            <span className="avatar">{profileInitials(name)}</span>
            <span className="profile-name">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
