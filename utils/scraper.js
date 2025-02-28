const axios = require('axios');
const Fuse = require('fuse.js');

const BASE_URL = 'https://raw.githubusercontent.com/alloc8or/gta5-nativedb-data/master/natives.json';
let nativesCache = null;
let fuseIndex = null;
let lastFetch = 0;
const CACHE_DURATION = 3600000;

async function fetchAndCacheNatives() {
    try {
        if (nativesCache && fuseIndex && (Date.now() - lastFetch) < CACHE_DURATION) {
            return { natives: nativesCache, fuseIndex };
        }

        const response = await axios.get(BASE_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        nativesCache = response.data;
        
        const searchableItems = [];
        for (const namespace in nativesCache) {
            for (const hash in nativesCache[namespace]) {
                const native = nativesCache[namespace][hash];
                searchableItems.push({
                    name: native.name,
                    hash,
                    namespace,
                    description: native.comment || 'No description available',
                    params: native.params,
                    returnType: native.return_type
                });
            }
        }

        const fuseOptions = {
            includeScore: true,
            threshold: 0.4,
            keys: [
                { name: 'name', weight: 0.7 },
                { name: 'description', weight: 0.3 }
            ]
        };

        fuseIndex = new Fuse(searchableItems, fuseOptions);
        lastFetch = Date.now();
        return { natives: nativesCache, fuseIndex };
    } catch (error) {
        console.error('Error fetching natives:', error.message);
        throw new Error('Failed to fetch natives database. Please try again later.');
    }
}

async function searchNatives(query) {
    try {
        const { fuseIndex } = await fetchAndCacheNatives();
        const searchResults = fuseIndex.search(query);

        const results = searchResults
            .slice(0, 10)
            .map(result => ({
                name: result.item.name,
                hash: result.item.hash,
                link: `https://alloc8or.re/gta5/nativedb/?n=${result.item.hash}`,
                description: result.item.description,
                namespace: result.item.namespace,
                matchScore: result.score
            }));

        return results;
    } catch (error) {
        console.error('Error searching natives:', error.message);
        throw new Error('Failed to search natives. Please try again later.');
    }
}

async function searchByNamespace(namespace) {
    try {
        const { natives } = await fetchAndCacheNatives();
        const results = [];
        
        if (!natives[namespace]) {
            const namespaces = Object.keys(natives);
            const fuse = new Fuse(namespaces, {
                threshold: 0.3
            });
            
            const matchingNamespace = fuse.search(namespace)[0]?.item;
            if (!matchingNamespace) {
                throw new Error(`No matching namespace found for "${namespace}"`);
            }
            namespace = matchingNamespace;
        }

        for (const hash in natives[namespace]) {
            const native = natives[namespace][hash];
            results.push({
                name: native.name,
                hash: hash,
                link: `https://alloc8or.re/gta5/nativedb/?n=${hash}`,
                description: native.comment || 'No description available'
            });

            if (results.length >= 10) break;
        }

        return results;
    } catch (error) {
        console.error('Error searching namespace:', error.message);
        throw new Error(error.message);
    }
}

async function getNativeByHash(hash) {
    try {
        const { natives } = await fetchAndCacheNatives();
        const cleanHash = hash.toUpperCase();

        const allHashes = [];
        for (const namespace in natives) {
            for (const nativeHash in natives[namespace]) {
                allHashes.push({ hash: nativeHash, namespace });
            }
        }

        const fuse = new Fuse(allHashes, {
            threshold: 0.3,
            keys: ['hash']
        });

        const matchingHash = fuse.search(cleanHash)[0]?.item;
        if (!matchingHash) {
            throw new Error(`No matching native found for hash ${cleanHash}`);
        }

        const native = natives[matchingHash.namespace][matchingHash.hash];
        return {
            name: native.name,
            hash: matchingHash.hash,
            namespace: matchingHash.namespace,
            description: native.comment || 'No description available',
            params: native.params || [],
            returnType: native.return_type || 'void',
            url: `https://alloc8or.re/gta5/nativedb/?n=${matchingHash.hash}`
        };
    } catch (error) {
        console.error(`Error getting native by hash ${hash}:`, error.message);
        throw new Error(error.message);
    }
}

module.exports = {
    searchNatives,
    searchByNamespace,
    getNativeByHash
};