import Images from "../../settings/constants/images";

class Avatar {
  static get(gender: string, photo: string = ''): any {
    if (photo === '') {
      switch(gender) {
        case 'M': return Images.maleAvatar;
        case 'F': return Images.femaleAvatar;
        case 'O': return Images.defaultAvatar;
      }
    }
    return photo;
  }
}

export default Avatar;