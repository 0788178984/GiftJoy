// IndexedDB Storage Manager for GiftJoy
// Provides much larger storage capacity than localStorage

class GiftStorageManager {
    constructor() {
        this.dbName = 'GiftJoyDB';
        this.version = 1;
        this.storeName = 'gifts';
        this.db = null;
    }

    // Initialize IndexedDB
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('IndexedDB error:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB initialized successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id' });
                    objectStore.createIndex('createdAt', 'createdAt', { unique: false });
                    objectStore.createIndex('occasion', 'occasion', { unique: false });
                    console.log('📦 Object store created');
                }
            };
        });
    }

    // Save gift to IndexedDB
    async saveGift(giftData) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            
            // Convert Base64 image to Blob for efficient storage
            if (giftData.image && giftData.image.startsWith('data:')) {
                giftData.imageBlob = this.dataURLtoBlob(giftData.image);
                delete giftData.image; // Remove Base64 to save space
            }
            
            const request = objectStore.put(giftData);

            request.onsuccess = () => {
                console.log('✅ Gift saved successfully:', giftData.id);
                resolve(giftData.id);
            };

            request.onerror = () => {
                console.error('❌ Error saving gift:', request.error);
                reject(request.error);
            };
        });
    }

    // Get gift from IndexedDB
    async getGift(giftId) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.get(giftId);

            request.onsuccess = () => {
                const gift = request.result;
                
                if (gift && gift.imageBlob) {
                    // Convert Blob back to data URL for display
                    gift.image = this.blobToDataURL(gift.imageBlob);
                }
                
                resolve(gift);
            };

            request.onerror = () => {
                console.error('❌ Error getting gift:', request.error);
                reject(request.error);
            };
        });
    }

    // Get all gifts
    async getAllGifts() {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Delete gift
    async deleteGift(giftId) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.delete(giftId);

            request.onsuccess = () => {
                console.log('🗑️ Gift deleted:', giftId);
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Clear all gifts
    async clearAllGifts() {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const objectStore = transaction.objectStore(this.storeName);
            const request = objectStore.clear();

            request.onsuccess = () => {
                console.log('🧹 All gifts cleared');
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Get storage usage estimate
    async getStorageEstimate() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            const usage = (estimate.usage / 1024 / 1024).toFixed(2); // MB
            const quota = (estimate.quota / 1024 / 1024).toFixed(2); // MB
            const percentUsed = ((estimate.usage / estimate.quota) * 100).toFixed(1);
            
            return {
                usage: `${usage} MB`,
                quota: `${quota} MB`,
                percentUsed: `${percentUsed}%`,
                available: `${(quota - usage).toFixed(2)} MB`
            };
        }
        return null;
    }

    // Convert data URL to Blob (more efficient storage)
    dataURLtoBlob(dataURL) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    // Convert Blob to data URL
    blobToDataURL(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    // Fallback to localStorage if IndexedDB fails
    useFallback() {
        console.warn('⚠️ Using localStorage fallback');
        return {
            saveGift: (data) => {
                try {
                    localStorage.setItem(`gift_${data.id}`, JSON.stringify(data));
                    return Promise.resolve(data.id);
                } catch (e) {
                    return Promise.reject(e);
                }
            },
            getGift: (id) => {
                try {
                    const data = localStorage.getItem(`gift_${id}`);
                    return Promise.resolve(data ? JSON.parse(data) : null);
                } catch (e) {
                    return Promise.reject(e);
                }
            },
            getAllGifts: () => {
                const gifts = [];
                for (let key in localStorage) {
                    if (key.startsWith('gift_')) {
                        try {
                            gifts.push(JSON.parse(localStorage[key]));
                        } catch (e) {
                            console.error('Error parsing gift:', e);
                        }
                    }
                }
                return Promise.resolve(gifts);
            },
            deleteGift: (id) => {
                localStorage.removeItem(`gift_${id}`);
                return Promise.resolve();
            },
            clearAllGifts: () => {
                const keys = Object.keys(localStorage).filter(k => k.startsWith('gift_'));
                keys.forEach(k => localStorage.removeItem(k));
                return Promise.resolve();
            }
        };
    }
}

// Create global instance
window.giftStorage = new GiftStorageManager();

// Initialize on load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        await window.giftStorage.init();
        
        // Show storage info
        const estimate = await window.giftStorage.getStorageEstimate();
        if (estimate) {
            console.log('💾 Storage Available:', estimate.available);
            console.log('📊 Storage Used:', estimate.usage, `(${estimate.percentUsed})`);
        }
    } catch (error) {
        console.error('Failed to initialize IndexedDB, using localStorage fallback');
        window.giftStorage = window.giftStorage.useFallback();
    }
});
