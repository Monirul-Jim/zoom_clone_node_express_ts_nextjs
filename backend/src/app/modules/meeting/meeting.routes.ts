import express from 'express';

import validateRequest from '../../middleware/validateRequest';
import { createMeetingSchema, joinMeetingSchema } from './meeting.validation';
import { createMeetingController, joinMeetingController } from './meeting.controller';

const router = express.Router();

router.post('/', validateRequest(createMeetingSchema), createMeetingController);
router.post('/join', validateRequest(joinMeetingSchema), joinMeetingController);

export const MeetingRoutes = router;