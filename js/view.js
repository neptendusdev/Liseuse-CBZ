export class View {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.dropZone = document.getElementById('drop-zone');
        this.viewer = document.getElementById('viewer');
        this.loader = document.getElementById('loader');
        this.themeBtn = document.getElementById('theme-switch');
        this.zoomSlider = document.getElementById('zoom-slider');

        // New elements
        this.btnBiblio = document.getElementById('btn-biblio');
        this.jsonInput = document.getElementById('jsonInput');
        this.homeContent = document.getElementById('home-content');
        this.libraryContainer = document.getElementById('library-container');
        this.libraryGrid = document.getElementById('library-grid');
        this.recentReadsGrid = document.getElementById('recent-reads-grid');
    }

    renderLastReads(reads, onCardClick, onCloseClick) {
        if (!this.recentReadsGrid) return;
        this.recentReadsGrid.innerHTML = '';

        if (!reads || reads.length === 0) {
            this.recentReadsGrid.innerHTML = '<div style="color: #999; padding: 20px;">Aucune lecture récente.</div>';
            return;
        }

        reads.forEach(read => {
            const card = document.createElement('div');
            card.className = 'read-card';

            card.innerHTML = `
                <div class="read-card-image-container">
                    <img class="read-card-image" src="${read.cover || 'assets/icon_dark.png'}" alt="Cover">
                    <div class="read-card-badge">Anime</div>
                    <img class="read-card-flag" src="https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/1200px-Flag_of_France.svg.png" alt="FR">
                    <div class="read-card-close" data-title="${read.title}">✕</div>
                </div>
                <div class="read-card-content">
                    <h3 class="read-card-title">${read.title}</h3>
                    <div class="read-card-progress">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"></path></svg>
                        ${read.progress || 'Fichier local'}
                    </div>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('read-card-close')) {
                    e.stopPropagation();
                    if (onCloseClick) onCloseClick(read.title);
                } else {
                    if (onCardClick) onCardClick(read);
                }
            });

            this.recentReadsGrid.appendChild(card);
        });
    }

    renderLibraryGrid(items, onItemClick) {
        this.libraryContainer.style.display = 'block';
        this.libraryGrid.innerHTML = '';

        if (!items || items.length === 0) {
            this.libraryGrid.innerHTML = '<div style="color: #999;">Aucun élément dans la bibliothèque.</div>';
            return;
        }

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'library-item';
            el.innerHTML = `<h3>${item.title}</h3><p style="font-size:12px;color:#aaa">${item.path}</p>`;
            el.addEventListener('click', () => {
                if (onItemClick) onItemClick(item);
            });
            this.libraryGrid.appendChild(el);
        });
    }

    hideHome() {
        if (this.homeContent) this.homeContent.style.display = 'none';
    }

    showHome() {
        if (this.homeContent) this.homeContent.style.display = 'block';
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