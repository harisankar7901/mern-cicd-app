import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Task = mongoose.model('Task', taskSchema);
