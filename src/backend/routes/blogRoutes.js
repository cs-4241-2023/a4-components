import { Router } from 'express';
const router = Router();
import { getAllBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from '../controllers/blogController.js';

router.get('/', getAllBlogPosts);
router.post('/', createBlogPost);
router.put('/:id', updateBlogPost);
router.delete('/:id', deleteBlogPost);

export default router;