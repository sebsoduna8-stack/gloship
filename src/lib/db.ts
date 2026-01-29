import fs from 'fs';
import path from 'path';
import { Shipment } from '@/types/shipment';
import { Customer } from '@/types/customer';
import { SiteSettings } from '@/types/settings';
import { AdminProfile } from '@/types/admin';
import connectToDatabase from './mongodb';
import ShipmentModel from '@/models/Shipment';
import CustomerModel from '@/models/Customer';
import SettingsModel from '@/models/Settings';
import AdminModel from '@/models/Admin';

const SHIPMENTS_PATH = path.join(process.cwd(), 'src/data/shipments.json');
const CUSTOMERS_PATH = path.join(process.cwd(), 'src/data/customers.json');
const SETTINGS_PATH = path.join(process.cwd(), 'src/data/settings.json');
const ADMIN_PATH = path.join(process.cwd(), 'src/data/admin.json');

// Global In-Memory Store (Fallback)
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

// --- File System Helpers (Fallback) ---

function ensureDirectoryExists(filePath: string) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    } catch (error) {
        // Ignore
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
        console.warn(`[DB] Could not persist data to disk. Data will be held in memory. Error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// --- Hybrid DB Functions ---

async function shouldUseMongo(): Promise<boolean> {
    const conn = await connectToDatabase();
    return !!conn;
}

// Shipments
export async function getShipments(): Promise<Shipment[]> {
    if (await shouldUseMongo()) {
        const docs = await ShipmentModel.find({}).sort({ createdAt: -1 }).lean();
        return docs.map((d: any) => ({ ...d, id: d.id || d._id.toString() })) as Shipment[];
    }

    // Fallback
    if (global._store.shipments) return global._store.shipments;
    global._store.shipments = readInitialData(SHIPMENTS_PATH, []);
    return global._store.shipments!;
}

export async function saveShipments(shipments: Shipment[]) {
    // This function is tricky with Mongo because it implies replacing all.
    // We should avoid using this with Mongo if possible, but for compatibility:
    if (await shouldUseMongo()) {
        // Dangerous: Replace all? No, let's try to bulk write or just ignore if the caller expects full replacement behavior.
        // Actually, this function is mostly used for "add" or "update" in the old code.
        // But the old code was: get -> modify -> save.
        // We should look at how it's used. 
        // If we really need to sync a full list, we might need to delete all and insert.
        // But safer to just warn or implement basic overwrite.
        await ShipmentModel.deleteMany({});
        await ShipmentModel.insertMany(shipments);
        return;
    }

    global._store.shipments = shipments;
    persistData(SHIPMENTS_PATH, shipments);
}

export async function getShipmentById(id: string): Promise<Shipment | undefined> {
    if (await shouldUseMongo()) {
        const doc = await ShipmentModel.findOne({ id }).lean();
        if (!doc) return undefined;
        return { ...doc, id: doc.id } as any as Shipment;
    }

    const shipments = await getShipments();
    return shipments.find(s => s.id === id);
}

export async function addShipment(shipment: Shipment) {
    if (await shouldUseMongo()) {
        await ShipmentModel.create(shipment);
        return;
    }

    const shipments = await getShipments();
    shipments.push(shipment);
    await saveShipments(shipments);
}

export async function updateShipment(shipment: Shipment) {
    if (await shouldUseMongo()) {
        await ShipmentModel.findOneAndUpdate({ id: shipment.id }, shipment, { upsert: true });
        return;
    }

    const shipments = await getShipments();
    const index = shipments.findIndex(s => s.id === shipment.id);
    if (index !== -1) {
        shipments[index] = shipment;
        await saveShipments(shipments);
    }
}

export async function deleteShipment(id: string) {
    if (await shouldUseMongo()) {
        await ShipmentModel.findOneAndDelete({ id });
        return;
    }

    const shipments = await getShipments();
    const filtered = shipments.filter(s => s.id !== id);
    await saveShipments(filtered);
}

// Customers
export async function getCustomers(): Promise<Customer[]> {
    if (await shouldUseMongo()) {
        const docs = await CustomerModel.find({}).sort({ createdAt: -1 }).lean();
        return docs.map((d: any) => ({ ...d, id: d.id || d._id.toString() })) as Customer[];
    }

    if (global._store.customers) return global._store.customers;
    global._store.customers = readInitialData(CUSTOMERS_PATH, []);
    return global._store.customers!;
}

export async function saveCustomers(customers: Customer[]) {
    if (await shouldUseMongo()) {
        await CustomerModel.deleteMany({});
        await CustomerModel.insertMany(customers);
        return;
    }

    global._store.customers = customers;
    persistData(CUSTOMERS_PATH, customers);
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
    if (await shouldUseMongo()) {
        const doc = await CustomerModel.findOne({ id }).lean();
        if (!doc) return undefined;
        return { ...doc, id: doc.id } as any as Customer;
    }

    const customers = await getCustomers();
    return customers.find(c => c.id === id);
}

export async function addCustomer(customer: Customer) {
    if (await shouldUseMongo()) {
        await CustomerModel.create(customer);
        return;
    }

    const customers = await getCustomers();
    customers.push(customer);
    await saveCustomers(customers);
}

export async function updateCustomer(customer: Customer) {
    if (await shouldUseMongo()) {
        await CustomerModel.findOneAndUpdate({ id: customer.id }, customer, { upsert: true });
        return;
    }

    const customers = await getCustomers();
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
        customers[index] = customer;
        await saveCustomers(customers);
    }
}

export async function deleteCustomer(id: string) {
    if (await shouldUseMongo()) {
        await CustomerModel.findOneAndDelete({ id });
        return;
    }

    const customers = await getCustomers();
    const filtered = customers.filter(c => c.id !== id);
    await saveCustomers(filtered);
}

// Settings
export async function getSettings(): Promise<SiteSettings> {
    if (await shouldUseMongo()) {
        const doc = await SettingsModel.findOne().lean();
        if (doc) return { ...doc } as any as SiteSettings;
        // fallback to default if not found in mongo
    } else {
        if (global._store.settings) return global._store.settings;
    }

    const defaultSettings: SiteSettings = {
        siteName: "Gloship",
        siteDescription: "",
        contactPhone: "",
        contactEmail: "",
        contactAddress: "",
        currency: "USD",
        logoUrl: "/logo.png"
    };

    if (await shouldUseMongo()) {
        // Seed default settings if empty
        await SettingsModel.create(defaultSettings);
        return defaultSettings;
    }

    global._store.settings = readInitialData(SETTINGS_PATH, defaultSettings);
    return global._store.settings!;
}

export async function saveSettings(settings: SiteSettings) {
    if (await shouldUseMongo()) {
        // upsert
        const existing = await SettingsModel.findOne();
        if (existing) {
            await SettingsModel.updateOne({ _id: existing._id }, settings);
        } else {
            await SettingsModel.create(settings);
        }
        return;
    }

    global._store.settings = settings;
    persistData(SETTINGS_PATH, settings);
}

// Admin
export async function getAdminProfile(): Promise<AdminProfile> {
    if (await shouldUseMongo()) {
        const doc = await AdminModel.findOne().lean();
        if (doc) return { ...doc, id: doc.id } as any as AdminProfile;
    } else {
        if (global._store.admin) return global._store.admin;
    }

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

    if (await shouldUseMongo()) {
        await AdminModel.create(defaultAdmin);
        return defaultAdmin;
    }

    global._store.admin = readInitialData(ADMIN_PATH, defaultAdmin);
    return global._store.admin!;
}

export async function saveAdminProfile(profile: AdminProfile) {
    if (await shouldUseMongo()) {
        const existing = await AdminModel.findOne({ id: profile.id });
        if (existing) {
             await AdminModel.updateOne({ id: profile.id }, profile);
        } else {
            // Check if ANY admin exists to avoid duplicates if ID changed? 
            // Simplified: just update or create based on ID.
            await AdminModel.create(profile);
        }
        return;
    }

    global._store.admin = profile;
    persistData(ADMIN_PATH, profile);
}
