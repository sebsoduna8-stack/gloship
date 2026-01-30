import fs from 'fs';
import path from 'path';
import { Shipment } from '@/types/shipment';
import { Customer } from '@/types/customer';
import { SiteSettings } from '@/types/settings';
import { AdminProfile } from '@/types/admin';

// Configuration for GitHub Persistence (The "Simple Storage")
const REPO_OWNER = 'sebsoduna8-stack';
const REPO_NAME = 'gloship';
const BRANCH = 'main'; // or 'master'
// GITHUB_TOKEN must be set in environment variables

const SHIPMENTS_FILE_PATH = 'src/data/shipments.json';
const CUSTOMERS_FILE_PATH = 'src/data/customers.json';
const SETTINGS_FILE_PATH = 'src/data/settings.json';
const ADMIN_FILE_PATH = 'src/data/admin.json';

const LOCAL_SHIPMENTS_PATH = path.join(process.cwd(), SHIPMENTS_FILE_PATH);
const LOCAL_CUSTOMERS_PATH = path.join(process.cwd(), CUSTOMERS_FILE_PATH);
const LOCAL_SETTINGS_PATH = path.join(process.cwd(), SETTINGS_FILE_PATH);
const LOCAL_ADMIN_PATH = path.join(process.cwd(), ADMIN_FILE_PATH);

// Global In-Memory Cache
declare global {
    var _store: {
        shipments: Shipment[] | null;
        customers: Customer[] | null;
        settings: SiteSettings | null;
        admin: AdminProfile | null;
    }
}

if (!global._store) {
    global._store = {
        shipments: null,
        customers: null,
        settings: null,
        admin: null
    };
}

// --- GitHub Storage Helpers ---

async function fetchFromGitHub<T>(filePath: string, defaultValue: T): Promise<T> {
    if (!process.env.GITHUB_TOKEN) {
        // Fallback to local file if no token (Dev mode)
        return readLocalData(path.join(process.cwd(), filePath), defaultValue);
    }

    try {
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`;
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Cache-Control': 'no-cache'
            },
            next: { revalidate: 0 } // Disable Next.js cache
        });

        if (!res.ok) {
            if (res.status === 404) return defaultValue;
            console.error(`[DB] GitHub Fetch Error ${res.status}:`, await res.text());
            return defaultValue;
        }

        const data = await res.json();
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('[DB] Failed to fetch from GitHub:', error);
        return defaultValue;
    }
}

async function saveToGitHub(filePath: string, data: unknown) {
    if (!process.env.GITHUB_TOKEN) {
        // Fallback to local file (Dev mode)
        return saveLocalData(path.join(process.cwd(), filePath), data);
    }

    try {
        // 1. Get current SHA
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`;
        const getRes = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            next: { revalidate: 0 }
        });

        let sha: string | undefined;
        if (getRes.ok) {
            const fileData = await getRes.json();
            sha = fileData.sha;
        }

        // 2. Update file
        const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
        const putRes = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Update ${path} via App`,
                content: content,
                sha: sha,
                branch: BRANCH
            })
        });

        if (!putRes.ok) {
            console.error(`[DB] GitHub Save Error ${putRes.status}:`, await putRes.text());
        }
    } catch (error) {
        console.error('[DB] Failed to save to GitHub:', error);
    }
}

// --- Local File Helpers ---

function readLocalData<T>(filePath: string, defaultValue: T): T {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.warn(`[DB] Failed to read local data from ${filePath}`, error);
    }
    return defaultValue;
}

function saveLocalData(filePath: string, data: unknown) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.warn(`[DB] Failed to save local data to ${filePath}`, error);
    }
}

// --- Data Accessors ---

// Shipments
export async function getShipments(): Promise<Shipment[]> {
    if (global._store.shipments) return global._store.shipments;
    
    const data = await fetchFromGitHub(SHIPMENTS_FILE_PATH, []);
    global._store.shipments = data;
    return data;
}

export async function saveShipments(shipments: Shipment[]) {
    global._store.shipments = shipments;
    // We don't await this to keep UI snappy, but in serverless we might need to await
    // to ensure it finishes before lambda freezes. Safest to await.
    await saveToGitHub(SHIPMENTS_FILE_PATH, shipments);
}

export async function getShipmentById(id: string): Promise<Shipment | undefined> {
    const shipments = await getShipments();
    return shipments.find(s => s.id === id);
}

export async function addShipment(shipment: Shipment) {
    const shipments = await getShipments();
    shipments.push(shipment);
    await saveShipments(shipments);
}

export async function updateShipment(shipment: Shipment) {
    const shipments = await getShipments();
    const index = shipments.findIndex(s => s.id === shipment.id);
    if (index !== -1) {
        shipments[index] = shipment;
        await saveShipments(shipments);
    }
}

export async function deleteShipment(id: string) {
    const shipments = await getShipments();
    const filtered = shipments.filter(s => s.id !== id);
    await saveShipments(filtered);
}

// Customers
export async function getCustomers(): Promise<Customer[]> {
    if (global._store.customers) return global._store.customers;

    const data = await fetchFromGitHub(CUSTOMERS_FILE_PATH, []);
    global._store.customers = data;
    return data;
}

export async function saveCustomers(customers: Customer[]) {
    global._store.customers = customers;
    await saveToGitHub(CUSTOMERS_FILE_PATH, customers);
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
    const customers = await getCustomers();
    return customers.find(c => c.id === id);
}

export async function addCustomer(customer: Customer) {
    const customers = await getCustomers();
    customers.push(customer);
    await saveCustomers(customers);
}

export async function updateCustomer(customer: Customer) {
    const customers = await getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
        customers[index] = customer;
        await saveCustomers(customers);
    }
}

export async function deleteCustomer(id: string) {
    const customers = await getCustomers();
    const filtered = customers.filter(c => c.id !== id);
    await saveCustomers(filtered);
}

// Settings
export async function getSettings(): Promise<SiteSettings> {
    if (global._store.settings) return global._store.settings;

    const defaultSettings: SiteSettings = {
        siteName: "Gloship",
        siteDescription: "",
        contactPhone: "",
        contactEmail: "",
        contactAddress: "",
        currency: "USD",
        logoUrl: "/logo.png"
    };

    const data = await fetchFromGitHub(SETTINGS_FILE_PATH, defaultSettings);
    global._store.settings = data;
    return data;
}

export async function saveSettings(settings: SiteSettings) {
    global._store.settings = settings;
    await saveToGitHub(SETTINGS_FILE_PATH, settings);
}

// Admin
export async function getAdminProfile(): Promise<AdminProfile> {
    if (global._store.admin) return global._store.admin;

    const defaultAdmin: AdminProfile = {
        id: 'ADM-001',
        name: 'Gloship',
        email: 'gloshipper2@gmail.com',
        phone: '+1 (555) 000-0000',
        role: 'Super Administrator',
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
        createdAt: new Date().toISOString(),
        password: 'admin123'
    };

    const data = await fetchFromGitHub(ADMIN_FILE_PATH, defaultAdmin);
    global._store.admin = data;
    return data;
}

export async function saveAdminProfile(profile: AdminProfile) {
    global._store.admin = profile;
    await saveToGitHub(ADMIN_FILE_PATH, profile);
}
