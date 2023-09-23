class VideoApi {
  public video: HTMLVideoElement;
  public width: number = 0;
  public height: number = 0;
  public aspectRatio: number = 0;

  private constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  static async getInstance(content: File | string) {
    return new Promise<VideoApi>((resolve) => {
      const video = document.createElement('video');
      if (content instanceof File) {
        video.src = URL.createObjectURL(content);
      } else {
        video.src = content;
      }
      const api = new VideoApi(video);
      video.onloadedmetadata = e => {
        api.width = video.videoWidth;
        api.height = video.videoHeight;
        api.aspectRatio = api.width / api.height;
        resolve(api);
      };
    });
  }

  static getInstanceFromVideoElement(video: HTMLVideoElement) {
    const api = new VideoApi(video);
    api.width = video.videoWidth;
    api.height = video.videoHeight;
    api.aspectRatio = api.width / api.height;
    return api;
  }

  generateThumbnail() {
    return new Promise<Blob | null>(async resolve => {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;

      this.video.currentTime = Math.ceil(this.video.duration / 4);
      this.video.muted = true;
      await this.video.play();
      
      let ctx = canvas.getContext("2d");
      ctx!.drawImage(this.video, 0, 0, this.width, this.height);
      this.video.pause();

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };
}

export default VideoApi;