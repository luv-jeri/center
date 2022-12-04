const {
  add,
  get,
  update,
  remove,
  get_by_id,
} = require('../controllers/service_category.controller');
const { protect } = require('../controllers/authorization.controller');

const router = express.Router();

router.use(protect);

router.route('/').post(add).get(get);
router.route('/:id').get(get_by_id).patch(update).delete(remove);

module.exports = router;
