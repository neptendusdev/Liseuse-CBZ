export class Model {
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