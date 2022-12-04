const {
  add,
  get,
  update,
  remove,
  get_by_id,
} = require('../controllers/service.controller');
const { protect, restrictTo } = require('../controllers/authorization.controller');

const router = express.Router();

router.route('/').post(protect, add).get(protect, get);
router
  .route('/:id')
  .get(protect, get_by_id)
  .patch(protect, update)
  .delete(protect, remove);

module.exports = router;
