export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        // Library JSON loading
        if (this.view.btnBiblio) {
            this.view.btnBiblio.onclick = () => this.view.jsonInput.click();
        }
        if (this.view.jsonInput) {
            this.view.jsonInput.onchange = (e) => this.handleJsonUpload(e.target.files[0]);
        }

        // Restore library if exists
        const lib = this.model.getLibrary();
        if (lib) {
            this.view.renderLibraryGrid(lib, (item) => this.handleLibraryItemClick(item));
        }

        // Restore recent reads
        this.refreshLastReads();

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

    handleJsonUpload(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                if (Array.isArray(json)) {
                    this.model.saveLibrary(json);
                    this.view.renderLibraryGrid(json, (item) => this.handleLibraryItemClick(item));
                    alert("Bibliothèque chargée avec succès !");
                } else {
                    alert("Le fichier JSON doit contenir un tableau d'objets.");
                }
            } catch (err) {
                alert("Erreur lors de la lecture du JSON : " + err.message);
            }
        };
        reader.readAsText(file);
    }

    refreshLastReads() {
        const reads = this.model.getLastReads();
        this.view.renderLastReads(
            reads,
            (readData) => {
                // Resume click: find matching library item if it exists
                const lib = this.model.getLibrary() || [];
                const libItem = lib.find(item => item.title === readData.title);
                if (libItem && libItem.path) {
                    this.handleLibraryItemClick(libItem);
                } else {
                    alert(`Veuillez rouvrir ce fichier manuellement: ${readData.title}`);
                }
            },
            (title) => {
                // Close click
                this.model.removeLastRead(title);
                this.refreshLastReads();
            }
        );
    }

    async handleLibraryItemClick(item) {
        if (!item.path) {
            alert("Chemin du fichier manquant.");
            return;
        }
        try {
            // Attempt to fetch the local file (requires --allow-file-access-from-files if purely local)
            const response = await fetch(item.path);
            if (!response.ok) throw new Error("Fichier introuvable");
            const blob = await response.blob();
            // Create a pseudo File object to pass to handleFile
            const file = new File([blob], item.path.split('/').pop() || 'comic.cbz', { type: blob.type });
            await this.handleFile(file);
        } catch (err) {
            alert(`Impossible de charger le fichier automatique.\nChemin: ${item.path}\nErreur: ${err.message}`);
        }
    }

    async handleFile(file) {
        if (!file) return;

        // Update last read for any opened file
        let coverPath = "assets/icon_dark.png";

        // Try to match cover if opened from library
        const lib = this.model.getLibrary() || [];
        const match = lib.find(item => file.name.includes(item.path.split('/').pop()) || item.title === file.name.replace(/\.(cbz|zip)$/i, ''));
        if (match && match.cover) {
            coverPath = match.cover;
        }

        this.model.saveLastRead({
            title: match ? match.title : file.name.replace(/\.(cbz|zip)$/i, ''),
            progress: "Lecture en cours",
            cover: coverPath
        });
        this.refreshLastReads();

        this.view.hideHome();
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