export class Model {
    async extractImages(file) {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        
        const imageFiles = Object.keys(contents.files).filter(name => {
            const isFile = !contents.files[name].dir;
            const isImage = /\.(webp|jpg|jpeg|png|gif)$/i.test(name);
            const isNotHidden = !name.split('/').some(part => part.startsWith('.'));
            return isFile && isImage;
        });

        imageFiles.sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));
        
        return Promise.all(imageFiles.map(async (name) => {
            const data = await contents.files[name].async("blob");
            return URL.createObjectURL(data);
        }));
    }
}