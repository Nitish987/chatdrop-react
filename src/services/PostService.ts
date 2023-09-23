import RequestClient from "../infra/client";
import PostModel, { PostCommentModel, PostsModel } from "../models/post";
import AuthService from "./AuthService";

class AddPostService {
  private static instance: AddPostService = new AddPostService();

  private constructor() {}

  static getInstance(): AddPostService {
    return this.instance;
  }

  async text(visibility: string, hashtags: string, text: string): Promise<PostModel | null> {
    try {
      const form = new FormData();
      form.append('visibility', visibility);
      form.append('hashtags', hashtags);
      form.append('text', text);

      const data = await RequestClient.post({
        url: '/web/post/v3/post/add/?content_type=TEXT',
        data: form,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const post: PostModel = JSON.parse(JSON.stringify(response.data()['post']));
        return post;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async photo(visibility: string, hashtags: string, photos: File[], aspectRatios: number[]): Promise<PostModel | null> {
    try {
      const form = new FormData();
      form.append('visibility', visibility);
      form.append('hashtags', hashtags);
      photos.forEach(photo => {
        form.append('photos', photo);
      })
      aspectRatios.forEach(aspectRatio => {
        form.append('aspect_ratios', aspectRatio.toString());
      })

      const data = await RequestClient.post({
        url: '/web/post/v3/post/add/?content_type=PHOTO',
        data: form,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const post: PostModel = JSON.parse(JSON.stringify(response.data()['post']));
        return post;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async video(visibility: string, hashtags: string, video: File, aspectRatio: number, thumbnail: Blob): Promise<PostModel | null> {
    try {
      const filename = (Math.random() * 10000).toString();
      const file = new File([thumbnail], `${filename}.jpeg`);

      const form = new FormData();
      form.append('visibility', visibility);
      form.append('hashtags', hashtags);
      form.append('video', video);
      form.append('aspect_ratio', aspectRatio.toString());
      form.append('thumbnail', file);

      const data = await RequestClient.post({
        url: '/web/post/v3/post/add/?content_type=VIDEO',
        data: form,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const post: PostModel = JSON.parse(JSON.stringify(response.data()['post']));
        return post;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async textWithPhoto(visibility: string, hashtags: string, text: string, photos: File[], aspectRatios: number[]): Promise<PostModel | null> {
    try {
      const form = new FormData();
      form.append('visibility', visibility);
      form.append('hashtags', hashtags);
      form.append('text', text);
      photos.forEach(photo => {
        form.append('photos', photo);
      })
      aspectRatios.forEach(aspectRatio => {
        form.append('aspect_ratios', aspectRatio.toString());
      })

      const data = await RequestClient.post({
        url: '/web/post/v3/post/add/?content_type=TEXT_PHOTO',
        data: form,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const post: PostModel = JSON.parse(JSON.stringify(response.data()['post']));
        return post;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async textWithVideo(visibility: string, hashtags: string, text: string, video: File, aspectRatio: number, thumbnail: Blob): Promise<PostModel | null> {
    try {
      const filename = (Math.random() * 10000).toString();
      const file = new File([thumbnail], `${filename}.jpeg`);

      const form = new FormData();
      form.append('visibility', visibility);
      form.append('hashtags', hashtags);
      form.append('text', text);
      form.append('video', video);
      form.append('aspect_ratio', aspectRatio.toString());
      form.append('thumbnail', file);

      const data = await RequestClient.post({
        url: '/web/post/v3/post/add/?content_type=TEXT_VIDEO',
        data: form,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const post: PostModel = JSON.parse(JSON.stringify(response.data()['post']));
        return post;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

class PostService {
  private static instance: PostService = new PostService();
  public static Visibility = { PUBLIC: 'PUBLIC', PRIVATE: 'PRIVATE', ONLY_FRIENDS: 'ONLY_FRIENDS' };
  public static Like = { NONE: null, LIKE: 'LIKE', LOVE: 'LOVE', HAHA: 'HAHA', YAY: 'YAY', WOW: 'WOW', SAD: 'SAD', ANGRY: 'ANGRY' };
  public static HashTagType = {USER: 'USER', TAG: 'TAG', URL: 'URL'}

  private constructor() {}

  static getIntance(): PostService {
    return this.instance;
  }

  addPost() {
    return AddPostService.getInstance();
  }

  async viewPost(postId: string): Promise<PostModel | null> {
    try {
      const data = await RequestClient.get({
        url: `/web/post/v2/post/${postId}/view/`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const post: PostModel = JSON.parse(JSON.stringify(response.data()['post']));
        return post;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async changeVisibility(postId: string, visibility: string): Promise<boolean> {
    try {
      const data = await RequestClient.put({
        url: `/web/post/v1/post/${postId}/visibility/?vbt=${visibility}`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async listPost(uid: string, page: number = 1): Promise<PostsModel | null> {
    try {
      const data = await RequestClient.get({
        url: `/web/post/v3/post/list/?of=${uid}&page=${page}`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const posts: PostsModel = JSON.parse(JSON.stringify(response.data()));
        return posts;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async deletePost(postId: string): Promise<boolean> {
    try {
      const data = await RequestClient.delete({
        url: `/web/post/v1/post/${postId}/delete/`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async addComment(postId: string, text: string): Promise<PostCommentModel | null> {
    try {
      const data = await RequestClient.post({
        url: `/web/post/v1/post/${postId}/comment/`,
        data: { text: text },
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const comment: PostCommentModel = JSON.parse(JSON.stringify(response.data()['comment']));
        return comment;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async listComment(postId: string): Promise<PostCommentModel[] | null> {
    try {
      const data = await RequestClient.get({
        url: `/web/post/v1/post/${postId}/comment/`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      if (response.success()) {
        const comments: PostCommentModel[] = JSON.parse(JSON.stringify(response.data()['comments']));
        return comments;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  async deleteComment(postId: string, commentId: number): Promise<boolean> {
    try {
      const data = await RequestClient.delete({
        url: `/web/post/v1/post/${postId}/comment/${commentId}/delete/`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async likePost(postId: string, type: string): Promise<boolean> {
    try {
      const data = await RequestClient.post({
        url: `/web/post/v1/post/${postId}/like/`,
        data: { type: type },
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async dislikePost(postId: string): Promise<boolean> {
    try {
      const data = await RequestClient.delete({
        url: `/web/post/v1/post/${postId}/like/`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async likeComment(commentId: number, type: string): Promise<boolean> {
    try {
      const data = await RequestClient.post({
        url: `/web/post/v1/post/comment/${commentId}/like/`,
        data: { type: type },
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }

  async dislikeComment(commentId: number): Promise<boolean> {
    try {
      const data = await RequestClient.delete({
        url: `/web/post/v1/post/comment/${commentId}/like/`,
        headers: AuthService.getAuthHeaders(),
      });
      const response = RequestClient.collect(data);
      return response.success();
    } catch (e) {
      return false;
    }
  }
}

export default PostService;