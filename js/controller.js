export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {

        this.view.themeBtn.onclick = () => this.view.toggleTheme();
        this.view.zoomSlider.oninput = (e) => this.view.applyZoom(e.target.value);
        this.view.applyZoom(this.view.zoomSlider.value);

        this.view.dropZone.onclick = () => this.view.fileInput.click();
            console.log("Clic sur la drop-zone détecté");
            this.view.fileInput.click();
        this.view.fileInput.onchange = (e) => this.handleFile(e.target.files[0]);

        this.view.dropZone.ondragover = (e) => {
            e.preventDefault();
            this.view.setDropZoneHighlight(true);
        };
        this.view.dropZone.ondragleave = () => this.view.setDropZoneHighlight(false);
        this.view.dropZone.ondrop = (e) => {
            e.preventDefault();
            this.view.setDropZoneHighlight(false);
            this.handleFile(e.dataTransfer.files[0]);
        };
    }

    async handleFile(file) {
        if (!file) return;
        this.view.clearViewer();
        this.view.showLoader(true);
        try {
            const imageUrls = await this.model.extractImages(file);
            this.view.renderImages(imageUrls);
        } catch (err) {
            alert("Erreur : " + err.message);
        } finally {
            this.view.showLoader(false);
        }
    }
}