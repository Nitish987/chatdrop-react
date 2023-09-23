import { FriendProfileModel, FullProfileModel, ProfileCoverPhotoModel, ProfileModel, ProfilePhotoModel } from "../../../models/profile";
import UserModel from "../../../models/user";
import FriendProfileService from "../../../services/FriendService";
import ProfileService, { IUpdateProfileParams } from "../../../services/ProfileService";
import PrivacyService from "../../../services/PrivacyService";
import FansService from "../../../services/FansService";
import { FollowersModel, FollowingsModel } from "../../../models/fans";
import PostService from "../../../services/PostService";
import { PostsModel } from "../../../models/post";

class ProfileController {
  private static instance: ProfileController = new ProfileController();
  private profileService = ProfileService.getInstance();
  private friendService = FriendProfileService.getInstance();
  private fansService = FansService.getInstance();
  private privacyService = PrivacyService.getInstance();
  private postService = PostService.getIntance();
  private followerPage = 1;
  private followingsPage = 1;
  private postPage = 1;

  private constructor() { }

  static getInstance(): ProfileController {
    return ProfileController.instance;
  }

  async fetchProfile(): Promise<FullProfileModel | null> {
    return await this.profileService.getProfile();
  }

  async updateProfile({ message, bio, interest, location, website }: IUpdateProfileParams): Promise<ProfileModel | null> {
    return await this.profileService.updateProfile({ message, bio, interest, location, website });
  }

  async updateProfilePhoto(photo: Blob): Promise<ProfilePhotoModel | null> {
    return await this.profileService.updatePhoto(photo);
  }

  async updateCoverPhoto(cover: Blob): Promise<ProfileCoverPhotoModel | null> {
    return await this.profileService.updateCover(cover);
  }

  async fetchFriendProfile(uid: string): Promise<FriendProfileModel | null> {
    return await this.friendService.getProfile(uid);
  }

  async sendFriendRequest(uid: string): Promise<boolean> {
    return this.friendService.sendFriendRequest(uid);
  }

  async acceptFriendRequest(requestId: number): Promise<boolean> {
    return this.friendService.acceptFriendRequest(requestId);
  }

  async unFriend(uid: string): Promise<boolean> {
    return this.friendService.unfriend(uid);
  }

  async sendFriendFollowRequest(uid: string): Promise<boolean> {
    return this.friendService.sendFollowRequest(uid);
  }

  async acceptFriendFollowRequest(requestId: number): Promise<boolean> {
    return this.friendService.acceptFollowRequest(requestId);
  }

  async unFollowFriend(uid: string): Promise<boolean> {
    return this.friendService.unfollow(uid);
  }

  async fetchFriendList(uid: string): Promise<UserModel[] | null> {
    return this.friendService.listFriend(uid);
  }

  async fetchFollowersList(uid: string): Promise<FollowersModel | null> {
    return this.fansService.listFollowers(uid, this.followerPage++);
  }

  async fetchFollowingsList(uid: string): Promise<FollowingsModel | null> {
    return this.fansService.listFollowings(uid, this.followingsPage++);
  }

  async fetchPostList(uid: string): Promise<PostsModel | null> {
    return this.postService.listPost(uid, this.postPage++);
  }

  deletePost(postId: string): Promise<boolean> {
    return this.postService.deletePost(postId);
  }

  async block(uid: string): Promise<boolean> {
    return this.privacyService.block(uid);
  }

  async unblock(uid: string): Promise<boolean> {
    return this.privacyService.unblock(uid);
  }
}

export default ProfileController;