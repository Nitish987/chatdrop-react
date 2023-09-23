interface ProfileModel {
  uid: string;
  name: string;
  username: string;
  photo: string;
  cover_photo: string;
  gender: string;
  message: string;
  bio: string;
  interest: string;
  website: string;
  location: string;
  post_count: number;
  follower_count: number;
  following_count: number;
  reel_count: number;
  settings: ProfileSettingsModel;
}

interface ProfileSettingsModel {
  is_profile_private?: boolean;
  default_post_visibility?: string;
  default_reel_visibility?: string;
  allow_chatgpt_info_access?: boolean;
}

interface ProfilePhotoModel {
  id: number;
  photo: string;
}

interface ProfileCoverPhotoModel {
  id: number;
  cover: string;
}

interface FullProfileModel {
  profile: ProfileModel;
  profile_photos: ProfilePhotoModel[];
  profile_cover_photos: ProfileCoverPhotoModel[];
}

interface FriendProfileModel {
  profile: ProfileModel;
  profile_photos: ProfilePhotoModel[];
  profile_cover_photos: ProfileCoverPhotoModel[];
  is_friend: boolean;
  is_friend_requested: boolean;
  friend_request_id: number;
  is_following: boolean;
  is_follow_requested: boolean;
  follow_request_id: number;
  is_blocked: boolean;
}

export type { ProfileModel, ProfileSettingsModel, ProfilePhotoModel, ProfileCoverPhotoModel, FullProfileModel, FriendProfileModel };