import LinkPreview from "../../models/linkpreview";
import FacilityService from "../../services/FacilityService";

class LinkPreviewController {
    private facilityService = FacilityService.getInstance();
    private url: string;

    private constructor(url: string) {
        this.url = url;
    }

    static getInstance(url: string) {
        return new LinkPreviewController(url);
    }

    linkPreview(): Promise<LinkPreview | null> {
        return this.facilityService.linkPreview(this.url);
    }
}

export default LinkPreviewController;