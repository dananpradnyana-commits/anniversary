// assets/js/gallery.js
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("gallery-grid");
    const fullscreenGallery = document.getElementById("fullscreen-gallery");
    const openGalleryBtn = document.getElementById("openGalleryBtn");
    const closeGalleryBtn = document.getElementById("closeGalleryBtn");
    const previewStack = document.getElementById("previewStack");

    if (!galleryContainer || typeof GALLERY_IMAGES === "undefined") return;

    // 1. DYNAMICALLY RENDER POLAROIDS FOR FULLSCREEN OVERLAY
    GALLERY_IMAGES.forEach((item, index) => {
      const polaroid = document.createElement("div");
      polaroid.className = "polaroid lightbox-trigger reveal reveal-delay-1";
      polaroid.setAttribute("data-caption", item.caption);
      
      // Calculate a randomized rotation angle for scrapbook styling (-3 to 3 deg)
      const randomRotation = (Math.random() * 6 - 3).toFixed(1);
      polaroid.style.transform = `rotate(${randomRotation}deg)`;

      const imgPath = `assets/images/gallery/${item.file}`;
      polaroid.setAttribute("data-src", imgPath);

      const img = document.createElement("img");
      img.src = imgPath;
      img.alt = item.caption;
      img.loading = "lazy";

      polaroid.appendChild(img);
      galleryContainer.appendChild(polaroid);

      polaroid.addEventListener("click", () => {
        if (typeof openLightbox === "function") {
          openLightbox(imgPath, item.caption);
        }
      });
    });

    // 2. FULLSCREEN OVERLAY TOGGLE LOGIC
    function openFullscreenGallery() {
      if (fullscreenGallery) {
        fullscreenGallery.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    }

    function closeFullscreenGallery() {
      if (fullscreenGallery) {
        fullscreenGallery.classList.remove("active");
        document.body.style.overflow = "";
      }
    }

    if (openGalleryBtn) openGalleryBtn.addEventListener("click", openFullscreenGallery);
    if (previewStack) previewStack.addEventListener("click", openFullscreenGallery);
    if (closeGalleryBtn) closeGalleryBtn.addEventListener("click", closeFullscreenGallery);

    // Initial trigger for dynamically added reveal elements inside overlay
    if (typeof initScrollReveal === "function") {
      initScrollReveal();
    }
  });
})();
