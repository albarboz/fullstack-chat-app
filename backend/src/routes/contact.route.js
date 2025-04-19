// backend/src/routes/contact.route.js
import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { 
  sendContactRequest,
  acceptContactRequest,
  rejectContactRequest,
  getContacts,
  getContactRequests,
  removeContact
} from '../controllers/contact.controller.js';

const router = express.Router();

router.post('/request/:id', protectRoute, sendContactRequest);
router.post('/accept/:id', protectRoute, acceptContactRequest);
router.post('/reject/:id', protectRoute, rejectContactRequest);
router.delete('/:id', protectRoute, removeContact);
router.get('/', protectRoute, getContacts);
router.get('/requests', protectRoute, getContactRequests);

export default router;