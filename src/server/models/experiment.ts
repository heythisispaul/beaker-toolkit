import { Schema, model } from 'mongoose';

export interface Variant {
  name: string;
  weight: number;
}

export interface Experiment {
  name: string;
  description: string;
  variants: Variant[];
  active: boolean;
  start?: Date;
  end?: Date;
  maxUnique?: number;
}

export const VariantSchema = new Schema<Variant>({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
});

export const ExperimentSchema = new Schema<Experiment>({
  name: { type: String, required: true },
  description: { type: String },
  active: { type: Boolean, default: true },
  variants: [VariantSchema],
  start: { type: Date, default: new Date() },
  end: { type: Date },
  maxUnique: { type: Number, default: 5000 },
});

ExperimentSchema.pre('save', async function() {
  // @ts-ignore
  const currentExperiment: Experiment = this as unknown as Experiment;
  const variantWeightTotal = currentExperiment.variants.reduce(((total, { weight }) => total + weight), 0);
  if (variantWeightTotal !== 100) {
    throw new Error('The combined weight of all variants must be 100');
  }
});

const ExperimentModel = model<Experiment>('Beaker-Experiment', ExperimentSchema);

export default ExperimentModel;
