import fs from 'fs';
import path from 'path';
import { Shipment } from '@/types/shipment';
import { Customer } from '@/types/customer';
import { SiteSettings } from '@/types/settings';
import { AdminProfile } from '@/types/admin';

const SHIPMENTS_PATH = path.join(process.cwd(), 'src/data/shipments.json');
const CUSTOMERS_PATH = path.join(process.cwd(), 'src/data/customers.json');
const SETTINGS_PATH = path.join(process.cwd(), 'src/data/settings.json');
const ADMIN_PATH = path.join(process.cwd(), 'src/data/admin.json');

// Global In-Memory Store
// We use globalThis to ensure data persists across hot reloads in development
// and provides a caching layer in production (until the lambda spins down)
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

function ensureDirectoryExists(filePath: string) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    } catch (error) {
        // Ignore directory creation errors in read-only environments
    }
}

function readInitialData<T>(filePath: string, defaultValue: T): T {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.warn(`[DB] Failed to read initial data from ${filePath}, using default.`, error);
    }
    return defaultValue;
}

function persistData(filePath: string, data: unknown) {
    try {
        ensureDirectoryExists(filePath);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        // In production (Vercel/Lambda), the filesystem is read-only (EROFS).
        // We catch this error so the app doesn't crash, effectively falling back
        // to in-memory storage for the duration of the instance's life.
        console.warn(`[DB] Could not persist data to disk. Data will be held in memory. Error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// Shipments
export function getShipments(): Shipment[] {
    if (global._store.shipments) return global._store.shipments;
    
    global._store.shipments = readInitialData(SHIPMENTS_PATH, []);
    return global._store.shipments!;
}

export function saveShipments(shipments: Shipment[]) {
    global._store.shipments = shipments;
    persistData(SHIPMENTS_PATH, shipments);
}

export function getShipmentById(id: string): Shipment | undefined {
    const shipments = getShipments();
    return shipments.find(s => s.id === id);
}

export function addShipment(shipment: Shipment) {
    const shipments = getShipments();
    shipments.push(shipment);
    saveShipments(shipments);
}

export function updateShipment(shipment: Shipment) {
    const shipments = getShipments();
    const index = shipments.findIndex(s => s.id === shipment.id);
    if (index !== -1) {
        shipments[index] = shipment;
        saveShipments(shipments);
    }
}

export function deleteShipment(id: string) {
    const shipments = getShipments();
    const filtered = shipments.filter(s => s.id !== id);
    saveShipments(filtered);
}

// Customers
export function getCustomers(): Customer[] {
    if (global._store.customers) return global._store.customers;

    global._store.customers = readInitialData(CUSTOMERS_PATH, []);
    return global._store.customers!;
}

export function saveCustomers(customers: Customer[]) {
    global._store.customers = customers;
    persistData(CUSTOMERS_PATH, customers);
}

export function getCustomerById(id: string): Customer | undefined {
    const customers = getCustomers();
    return customers.find(c => c.id === id);
}

export function addCustomer(customer: Customer) {
    const customers = getCustomers();
    customers.push(customer);
    saveCustomers(customers);
}

export function updateCustomer(customer: Customer) {
    const customers = getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
        customers[index] = customer;
        saveCustomers(customers);
    }
}

export function deleteCustomer(id: string) {
    const customers = getCustomers();
    const filtered = customers.filter(c => c.id !== id);
    saveCustomers(filtered);
}

// Settings
export function getSettings(): SiteSettings {
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

    global._store.settings = readInitialData(SETTINGS_PATH, defaultSettings);
    return global._store.settings!;
}

export function saveSettings(settings: SiteSettings) {
    global._store.settings = settings;
    persistData(SETTINGS_PATH, settings);
}

// Admin
export function getAdminProfile(): AdminProfile {
    if (global._store.admin) return global._store.admin;

    const defaultAdmin: AdminProfile = {
        id: 'ADM-001',
        name: 'Main Admin',
        email: 'admin@gloship.online',
        phone: '+1 (555) 000-0000',
        role: 'Super Administrator',
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
        createdAt: new Date().toISOString(),
        password: 'admin123'
    };

    global._store.admin = readInitialData(ADMIN_PATH, defaultAdmin);
    return global._store.admin!;
}

export function saveAdminProfile(profile: AdminProfile) {
    global._store.admin = profile;
    persistData(ADMIN_PATH, profile);
}
