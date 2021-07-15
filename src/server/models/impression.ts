import { Schema, model } from 'mongoose';

export interface Impression {
  timestamp: string;
  type: string;
  experiment: string;
  variant: string;
  clientId: string;
}

export const impressionSchema = new Schema<Impression>({
  type: { type: String, required: true },
  timestamp: { type: Date, required: true },
  experiment: { type: String, required: true },
  variant: { type: String, required: true },
  clientId: { type: String, required: true },
});

const ImpressionModel = model('Beaker-Impression', impressionSchema);

export default ImpressionModel;
