import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: "Gloship" },
  siteDescription: { type: String, default: "" },
  contactPhone: { type: String, default: "" },
  contactEmail: { type: String, default: "" },
  contactAddress: { type: String, default: "" },
  currency: { type: String, default: "USD" },
  logoUrl: { type: String, default: "/logo.png" }
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
