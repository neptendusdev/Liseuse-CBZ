export class View {
    constructor() {
        this.fileInput = document.getElementById('fileInput');
        this.dropZone = document.getElementById('drop-zone');
        this.viewer = document.getElementById('viewer');
        this.loader = document.getElementById('loader');
        this.themeBtn = document.getElementById('theme-switch');
        this.zoomSlider = document.getElementById('zoom-slider');
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