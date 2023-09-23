import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FullProfileModel, ProfileCoverPhotoModel, ProfileModel, ProfilePhotoModel } from '../../models/profile';


interface ContentState {
  profile: FullProfileModel | null;
}

const initialState: ContentState = {
  profile: null,
}

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setProfileContent: (state, action: PayloadAction<FullProfileModel | null>) => {
      state.profile = action.payload;
    },
    updateProfileContent: (state, action: PayloadAction<ProfileModel>) => {
      state.profile!.profile = action.payload;
    },
    updateProfilePhotoContent: (state, action: PayloadAction<ProfilePhotoModel>) => {
      state.profile!.profile.photo = action.payload.photo;
      state.profile!.profile_photos.push(action.payload);
    },
    updateProfileCoverContent: (state, action: PayloadAction<ProfileCoverPhotoModel>) => {
      state.profile!.profile.cover_photo = action.payload.cover;
      state.profile!.profile_cover_photos.push(action.payload);
    },
  },
})

export const { 
  setProfileContent, 
  updateProfileContent, 
  updateProfilePhotoContent, 
  updateProfileCoverContent,
} = contentSlice.actions

export default contentSlice.reducer