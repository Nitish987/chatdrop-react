class ImageApi {
  public image: HTMLImageElement;
  public width: number;
  public height: number;
  public aspectRatio: number;

  private constructor(content: File | string) {
    this.image = new Image();
    if (content instanceof File) {
      this.image.src = URL.createObjectURL(content);
    } else {
      this.image.src = content;
    }
    this.width = this.image.width;
    this.height = this.image.height;
    this.aspectRatio = this.width / this.height;
  }

  static getInstance(content: File | string) {
    return new ImageApi(content);
  }
}

export default ImageApi;