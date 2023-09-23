interface UserModel {
    uid: string;
    name: string;
    username: string;
    gender: string;
    photo: string;
    message: string;
    chatroom?: string;
}

export default UserModel;