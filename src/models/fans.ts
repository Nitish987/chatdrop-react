import UserModel from "./user";

interface FollowersModel {
    followers: UserModel[];
    has_next: boolean;
}

interface FollowingsModel {
    followings: UserModel[];
    has_next: boolean;
}

export type { FollowersModel, FollowingsModel };