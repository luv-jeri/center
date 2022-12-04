const authenticationRouter = require('./authentication.routes');
const serviceRouter = require('./service.routes');
const serviceCategoryRouter = require('./service_category.routes');

const router = express.Router();

router.use('/authentication', authenticationRouter);
router.use('/service_category', serviceCategoryRouter);
router.use('/service', serviceRouter);

module.exports = router;
