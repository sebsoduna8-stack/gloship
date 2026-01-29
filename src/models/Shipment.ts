import mongoose from 'mongoose';

const ShipmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Tracking Number
  date: { type: String, required: true },
  expectedDelivery: { type: String, required: true },
  status: { type: String, required: true },
  
  // Shipper
  shipperName: { type: String, required: true },
  shipperAddress: { type: String, required: true },
  shipperPhone: { type: String, required: true },
  shipperEmail: { type: String, required: true },

  // Receiver
  receiverName: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  receiverPhone: { type: String, required: true },
  receiverEmail: { type: String, required: true },

  // Payment
  shippingCost: { type: Number, required: true },
  amountPaid: { type: Number, required: true },
  paymentMethod: { type: String, required: true },

  // Items
  items: [{
    id: String,
    name: String,
    weight: String,
    quantity: Number
  }],

  // Logistics
  pickupTime: { type: String, required: true },
  estimatedDuration: { type: String, required: true },
  notes: { type: String },

  // History
  history: [{
    id: String,
    status: String,
    timestamp: String,
    location: String,
    notes: String
  }]
}, { timestamps: true });

export default mongoose.models.Shipment || mongoose.model('Shipment', ShipmentSchema);
