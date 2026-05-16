import express from 'express';
import { wrap } from '../common/Routes.js';
import getQueryList from '../services/queryList.js';

const router = express.Router();

router.get('/', wrap(getQueryList));

export default router;
