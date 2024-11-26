const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const {checkLogin} = require('../middleware/auth');

// create storage to store images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Thư mục để lưu trữ ảnh
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Đổi tên file để tránh bị trùng lặp
  },
});

// Tạo middleware upload để xử lý yêu cầu upload ảnh
const upload = multer({ storage: storage });

router.get('/', checkLogin, productController.getAllProducts);
router.get('/:id', productController.getProdutById);
router.post('/', upload.single('image'), productController.createProduct);
router.delete('/:id', productController.deleteProduct);
router.put('/:id', upload.single('image'), productController.updateProduct);

module.exports = router;