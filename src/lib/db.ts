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

function ensureDirectoryExists(filePath: string) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Shipments
export function getShipments(): Shipment[] {
    if (!fs.existsSync(SHIPMENTS_PATH)) return [];
    try {
        const data = fs.readFileSync(SHIPMENTS_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading shipments:', error);
        return [];
    }
}

export function saveShipments(shipments: Shipment[]) {
    ensureDirectoryExists(SHIPMENTS_PATH);
    fs.writeFileSync(SHIPMENTS_PATH, JSON.stringify(shipments, null, 2));
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
    if (!fs.existsSync(CUSTOMERS_PATH)) return [];
    try {
        const data = fs.readFileSync(CUSTOMERS_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading customers:', error);
        return [];
    }
}

export function saveCustomers(customers: Customer[]) {
    ensureDirectoryExists(CUSTOMERS_PATH);
    fs.writeFileSync(CUSTOMERS_PATH, JSON.stringify(customers, null, 2));
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
    const defaultSettings: SiteSettings = {
        siteName: "Gloship",
        siteDescription: "",
        contactPhone: "",
        contactEmail: "",
        contactAddress: "",
        currency: "USD",
        logoUrl: "/logo.png"
    };

    if (!fs.existsSync(SETTINGS_PATH)) {
        return defaultSettings;
    }
    try {
        const data = fs.readFileSync(SETTINGS_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading settings:', error);
        return defaultSettings;
    }
}

export function saveSettings(settings: SiteSettings) {
    ensureDirectoryExists(SETTINGS_PATH);
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

// Admin
export function getAdminProfile(): AdminProfile {
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

    if (!fs.existsSync(ADMIN_PATH)) {
        return defaultAdmin;
    }
    try {
        const data = fs.readFileSync(ADMIN_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading admin profile:', error);
        return defaultAdmin;
    }
}

export function saveAdminProfile(profile: AdminProfile) {
    ensureDirectoryExists(ADMIN_PATH);
    fs.writeFileSync(ADMIN_PATH, JSON.stringify(profile, null, 2));
}
