const {
  join,
  login,
  update_password,
  send_reset_OTP,
  check_reset_OTP,
  reset_password,
} = require('../controllers/authentication.controller');

const router = express.Router();

router.post('/join', join);
router.post('/login', login);
router.patch('/update_password', update_password);
router.post('/send-reset-otp', send_reset_OTP);
router.post('/check-reset-otp', check_reset_OTP);
router.patch('/reset-password', reset_password);

module.exports = router;
