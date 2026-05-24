// assets/js/gallery-config.js
const existingImages = [
  "fotoawal.png",
  "pdkt1.png",
  "pdkt2.png",
  "pdkt3.png",
  "20231.png",
  "20232.png",
  "20233.png",
  "20241.png",
  "20242.png",
  "20243.png",
  "2025.png"
];

// Menambahkan 37 foto baru yang sudah di-rename
const newImages = Array.from({ length: 37 }, (_, i) => `foto_baru_${i + 1}.jpeg`);

const GALLERY_IMAGES = [...existingImages, ...newImages].map(filename => ({
  file: filename,
  caption: "" // Caption dihilangkan sesuai permintaan
}));
