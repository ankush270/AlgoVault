import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: 'Remote / Worldwide',
      trim: true,
    },
    tags: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    source: {
      type: String,
      default: 'Scraper',
    },
    date: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ date: -1 });

export const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;
