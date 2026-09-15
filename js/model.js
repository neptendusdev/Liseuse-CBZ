export class Model {
    constructor() {
        this.currentUser = null;
        this.loadSession();
    }

    loadSession() {
        const session = localStorage.getItem('currentUser');
        if (session) {
            this.currentUser = session;
        }
    }

    login(id, password) {
        // Simple mock authentication for now, accepting any id and password
        if (id && password) {
            this.currentUser = id;
            localStorage.setItem('currentUser', id);
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUserData() {
        if (!this.currentUser) return { library: [], currentReads: [] };
        const data = localStorage.getItem(`userData_${this.currentUser}`);
        return data ? JSON.parse(data) : { library: [], currentReads: [] };
    }

    saveUserData(data) {
        if (this.currentUser) {
            localStorage.setItem(`userData_${this.currentUser}`, JSON.stringify(data));
        }
    }

    addToLibrary(fileName) {
        if (!this.currentUser) return;
        const data = this.getUserData();
        if (!data.library.includes(fileName)) {
            data.library.push(fileName);
            this.saveUserData(data);
        }
    }

    addCurrentRead(fileName) {
        if (!this.currentUser) return;
        const data = this.getUserData();
        // Remove if it exists to put it at the top
        data.currentReads = data.currentReads.filter(f => f !== fileName);
        data.currentReads.unshift(fileName); // add to start
        this.saveUserData(data);
    }

    getLibrary() {
        return this.getUserData().library;
    }

    getCurrentReads() {
        return this.getUserData().currentReads;
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