import PostService from "../../../services/PostService";
import ImageApi from "../../../shared/apis/image";
import VideoApi from "../../../shared/apis/video";

interface FilePicked {
  file: File;
  data: string;
}

const PostVisibility = PostService.Visibility;

class AddPostController {
  private static instance: AddPostController = new AddPostController();
  private postService = PostService.getIntance();

  static getInstance() {
    return this.instance;
  }

  add() {
    return this.postService.addPost();
  }

  static extractHashTags(text: string): string {
    const hashtags: string[] = [];
    const words = text.split(' ');
    words.forEach(word => {
      const k = word.charAt(0);
      if (k === '@' || k === '#' || word.startsWith('http')) {
        hashtags.push(word);
      }
    });
    return hashtags.join(',');
  }

  static createUploadablePhotos(photos: FilePicked[]): [File[], number[]] {
    const photoList: File[] = photos.map(photo => photo.file);
    const photoAspectRatios: number[] = [];
    photos.forEach(photo => {
      const api = ImageApi.getInstance(photo.data);
      photoAspectRatios.push(api.aspectRatio);
    });
    return [photoList, photoAspectRatios];
  }

  static async createUploadableVideo(video: FilePicked): Promise<[File, number, Blob | null]> {
    const api = await VideoApi.getInstance(video.file);
    const thumbnail = await api.generateThumbnail();
    return [video.file, api.aspectRatio, thumbnail];
  }
}

export default AddPostController;
export { PostVisibility };
export type { FilePicked };