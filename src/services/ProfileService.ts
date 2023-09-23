import RequestClient from "../infra/client";
import { ProfileModel, FullProfileModel, ProfilePhotoModel, ProfileCoverPhotoModel } from "../models/profile";
import AuthService from "./AuthService";

interface IUpdateProfileParams {
  message: string;
  location: string;
  interest: string;
  bio: string;
  website: string;
}

class ProfileService {
  private static instance: ProfileService = new ProfileService();

  static getInstance(): ProfileService {
    return ProfileService.instance;
  }

  async getProfile(): Promise<FullProfileModel | null> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.get({
        url: `/web/account/v1/profile/${headers.uid}/`,
        headers: headers
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const profile: FullProfileModel = JSON.parse(JSON.stringify(response.data()));
        return profile;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async updateProfile({ message, location, interest, bio, website }: IUpdateProfileParams): Promise<ProfileModel | null> {
    try {
      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.put({
        url: `/web/account/v1/profile/${headers.uid}/`,
        data: {
          message, location, interest, bio, website
        },
        headers: headers
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const profile: ProfileModel = JSON.parse(JSON.stringify(response.data()['profile']));
        return profile;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async updatePhoto(photo: Blob): Promise<ProfilePhotoModel  | null> {
    try {
      const filename = (Math.random() * 10000).toString();
      const file = new File([photo], `${filename}.jpeg`);
      const form = new FormData();
      form.set('photo', file);

      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.put({
        url: `/web/account/v1/profile/${headers.uid}/photo/update/`,
        data: form,
        headers: headers,
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const profilePhoto: ProfilePhotoModel = JSON.parse(JSON.stringify(response.data()));
        return profilePhoto;
      }
      return null;
    } catch(e) {
      return null;
    }
  }

  async updateCover(cover: Blob): Promise<ProfileCoverPhotoModel  | null> {
    try {
      const filename = (Math.random() * 10000).toString();
      const file = new File([cover], `${filename}.jpeg`);
      const form = new FormData();
      form.set('cover_photo', file);

      const headers = AuthService.getAuthHeaders();
      const data = await RequestClient.put({
        url: `/web/account/v1/profile/${headers.uid}/cover/update/`,
        data: form,
        headers: headers,
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const profilePhoto: ProfileCoverPhotoModel = JSON.parse(JSON.stringify(response.data()));
        return profilePhoto;
      }
      return null;
    } catch(e) {
      return null;
    }
  }
}

export default ProfileService;
export type { IUpdateProfileParams };