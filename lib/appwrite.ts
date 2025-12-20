import { Client, Account, Databases, ID } from 'appwrite';

/**
 * Appwrite Configuration
 * Project: DevA.I AGENCY
 * Verified Endpoint: https://fra.cloud.appwrite.io/v1
 */
const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') 
    .setProject('69464b94000f516cfa92'); 

// Verify connection on initialization using standard SDK methods
// We attempt to fetch the current account; a 401 (Unauthorized) still confirms the server is reachable.
const connectivityCheck = new Account(client);
connectivityCheck.get()
    .then(() => console.log("Appwrite: Neural Link Established (Session Verified)"))
    .catch((e: any) => {
        if (e.code === 401) {
            console.log("Appwrite: Neural Link Established (Handshake Success)");
        } else {
            console.warn("Appwrite: Connection Error - Check Project ID or Endpoint", e);
        }
    });

export const account = new Account(client);
export const databases = new Databases(client);
export const APPWRITE_ID = ID;

export const DATABASE_ID = 'agency_db'; 
export const COLLECTION_ID_LEADS = 'leads';
export const COLLECTION_ID_PROFILES = 'profiles';

export { client };
export default client;