
export const pdfSchema = new mongoose.Schema({
    name: String,
    file: Buffer,
    fileType: String,
    isSign: Boolean,
});