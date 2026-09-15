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

        this.view.dropZone.onclick = () => {
            console.log("Clic sur la drop-zone détecté");
            this.view.fileInput.click();
        };
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

        // Navigation
        this.view.tabLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = e.target.dataset.target;
                this.view.switchTab(target);
                if (target === 'biblio-tab') {
                    this.updateLists();
                } else if (target === 'accueil-tab') {
                    this.updateLists();
                }
            });
        });

        // Authentication
        this.view.loginForm.onsubmit = (e) => {
            e.preventDefault();
            const id = this.view.loginIdInput.value;
            const pwd = this.view.loginPwdInput.value;
            if (this.model.login(id, pwd)) {
                this.updateAuth();
            } else {
                alert("Erreur de connexion");
            }
        };

        this.view.logoutBtn.onclick = () => {
            this.model.logout();
            this.updateAuth();
        };

        this.view.goBiblioBtn.onclick = () => {
            this.view.switchTab('biblio-tab');
            this.updateLists();
        };

        this.view.addToBiblioBtn.onclick = () => {
            if (this.model.isLoggedIn() && this.currentFile) {
                this.model.addToLibrary(this.currentFile.name);
                alert(`${this.currentFile.name} ajouté à la bibliothèque.`);
            }
        };

        // Initial setup
        this.updateAuth();
        this.view.switchTab('accueil-tab');
    }

    updateAuth() {
        const isLoggedIn = this.model.isLoggedIn();
        const userId = this.model.getCurrentUser();
        this.view.updateAuthUI(isLoggedIn, userId);

        if (isLoggedIn) {
            this.updateLists();
        }
    }

    updateLists() {
        if (this.model.isLoggedIn()) {
            this.view.renderLibrary(this.model.getLibrary());
            this.view.renderCurrentReads(this.model.getCurrentReads());
        }
    }

    async handleFile(file) {
        if (!file) return;
        this.currentFile = file;
        this.view.clearViewer();
        this.view.showLoader(true);
        this.view.switchTab('lecteur-tab');

        if (this.model.isLoggedIn()) {
            this.model.addCurrentRead(file.name);
            this.view.addToBiblioBtn.style.display = 'block';
        }

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