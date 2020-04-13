module.exports = (folder) => {
    const multer = require("multer");
    const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, process.env.IMAGES + folder);
    },
    filename: function(req, file, callback) {
        callback(
        null,
        file.fieldname +
            Date.now() +
            path.extname(file.originalname).toLowerCase()
        );
    }
    });
    const upload = multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
        return callback(new Error("Only images are allowed"));
        }
        callback(null, true);
    }
    });

    return upload;
}