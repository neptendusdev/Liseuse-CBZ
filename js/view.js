export class View {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.dropZone = document.getElementById('drop-zone');
        this.viewer = document.getElementById('viewer');
        this.loader = document.getElementById('loader');
        this.themeBtn = document.getElementById('theme-switch');
        this.zoomSlider = document.getElementById('zoom-slider');

        // Navigation and Auth elements
        this.tabLinks = document.querySelectorAll('.tab-link');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.navBiblio = document.getElementById('nav-biblio');

        this.loginSection = document.getElementById('login-section');
        this.userSection = document.getElementById('user-section');
        this.loginForm = document.getElementById('login-form');
        this.loginIdInput = document.getElementById('login-id');
        this.loginPwdInput = document.getElementById('login-pwd');

        this.welcomeMessage = document.getElementById('welcome-message');
        this.logoutBtn = document.getElementById('logout-btn');
        this.goBiblioBtn = document.getElementById('go-biblio-btn');

        this.currentReadsList = document.getElementById('current-reads-list');
        this.libraryList = document.getElementById('library-list');
        this.addToBiblioBtn = document.getElementById('add-to-biblio-btn');

        // Toolbar elements
        this.iconZoomMoins = document.querySelector('.icon-zoom-moins');
        this.iconZoomPlus = document.querySelector('.icon-zoom-plus');
    }

    switchTab(tabId) {
        this.tabLinks.forEach(link => {
            if (link.dataset.target === tabId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        this.tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Show/hide toolbar elements based on tab
        const isLecteur = tabId === 'lecteur-tab';
        this.dropZone.style.display = isLecteur ? 'block' : 'none';
        this.iconZoomMoins.style.display = isLecteur ? 'block' : 'none';
        this.iconZoomPlus.style.display = isLecteur ? 'block' : 'none';
        this.zoomSlider.style.display = isLecteur ? 'block' : 'none';

        // add to biblio btn is only shown in lecteur if logged in and file loaded
        if (!isLecteur) {
            this.addToBiblioBtn.style.display = 'none';
        }
    }

    updateAuthUI(isLoggedIn, userId) {
        if (isLoggedIn) {
            this.loginSection.style.display = 'none';
            this.userSection.style.display = 'block';
            this.navBiblio.style.display = 'inline-block';
            this.welcomeMessage.textContent = `Bienvenue, ${userId} !`;
        } else {
            this.loginSection.style.display = 'block';
            this.userSection.style.display = 'none';
            this.navBiblio.style.display = 'none';
            this.loginIdInput.value = '';
            this.loginPwdInput.value = '';
            this.switchTab('accueil-tab'); // redirect to accueil on logout
            this.addToBiblioBtn.style.display = 'none';
        }
    }

    renderList(container, items, emptyMessage = "Aucun élément") {
        container.innerHTML = '';
        if (items.length === 0) {
            const li = document.createElement('li');
            li.textContent = emptyMessage;
            container.appendChild(li);
            return;
        }

        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            container.appendChild(li);
        });
    }

    renderLibrary(items) {
        this.renderList(this.libraryList, items, "Votre bibliothèque est vide.");
    }

    renderCurrentReads(items) {
        this.renderList(this.currentReadsList, items, "Aucune lecture en cours.");
    }

    toggleTheme() {
        document.body.classList.toggle('light-mode');
    }

    applyZoom(value) {
        const images = this.viewer.querySelectorAll('img');
        images.forEach(img => {
            img.style.width = `${value}vw`;
        });
    }

    clearViewer() {
        this.viewer.innerHTML = '';
        window.scrollTo(0, 0);
    }

    showLoader(isVisible) {
        this.loader.style.display = isVisible ? 'block' : 'none';
    }

    renderImages(urls) {
        urls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.loading = "lazy";
            this.viewer.appendChild(img);
        });
    }

    setDropZoneHighlight(isHighlighted) {
        this.dropZone.style.borderColor = isHighlighted ? "#007bff" : "#444";
    }
}