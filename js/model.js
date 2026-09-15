export class Model {
    saveLibrary(jsonArray) {
        localStorage.setItem('cbz_library', JSON.stringify(jsonArray));
    }

    getLibrary() {
        const data = localStorage.getItem('cbz_library');
        return data ? JSON.parse(data) : null;
    }

    getLastReads() {
        const data = localStorage.getItem('cbz_last_reads');
        return data ? JSON.parse(data) : [];
    }

    saveLastRead(readData) {
        let reads = this.getLastReads();
        // Remove if exists to place at front
        reads = reads.filter(r => r.title !== readData.title);
        // Add to front
        reads.unshift({
            ...readData,
            timestamp: Date.now()
        });
        // Keep only top 10
        if (reads.length > 10) reads = reads.slice(0, 10);
        localStorage.setItem('cbz_last_reads', JSON.stringify(reads));
    }

    removeLastRead(title) {
        let reads = this.getLastReads();
        reads = reads.filter(r => r.title !== title);
        localStorage.setItem('cbz_last_reads', JSON.stringify(reads));
    }

    async extractImages(file) {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        
        const imageFiles = Object.keys(contents.files).filter(name => {
            const isFile = !contents.files[name].dir;
            const isImage = /\.(webp|jpg|jpeg|png|gif|avif)$/i.test(name);
            const isNotHidden = !name.split('/').some(part => part.startsWith('.'));
            return isFile && isImage;
        });

        imageFiles.sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));
        
        return Promise.all(imageFiles.map(async (name) => {
            // 1. On extrait les données brutes
            const uint8array = await contents.files[name].async("uint8array");
            
            // 2. On détermine le type MIME manuellement si c'est un AVIF
            let type = "";
            if (name.toLowerCase().endsWith('.avif')) {
                type = "image/avif";
            }

            // 3. On crée le Blob avec le type explicite
            const blob = new Blob([uint8array], { type: type });
            return URL.createObjectURL(blob);
        }));
    }
}