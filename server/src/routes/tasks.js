import { Router } from 'express';
import mongoose from 'mongoose';
import { Task } from '../models/Task.js';

const router = Router();

router.get('/', async (_request, response, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    response.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (request, response, next) => {
  try {
    const task = await Task.create({ title: request.body.title });
    response.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(400).json({ message: 'Invalid task ID' });
    }

    const updates = {};
    if (typeof request.body.title === 'string') updates.title = request.body.title;
    if (typeof request.body.completed === 'boolean') updates.completed = request.body.completed;

    const task = await Task.findByIdAndUpdate(request.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) return response.status(404).json({ message: 'Task not found' });
    return response.json(task);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (request, response, next) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await Task.findByIdAndDelete(request.params.id);
    if (!task) return response.status(404).json({ message: 'Task not found' });
    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
