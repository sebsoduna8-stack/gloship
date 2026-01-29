import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, default: 'Super Administrator' },
  avatarUrl: { type: String },
  password: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
