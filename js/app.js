
  let currentSlide = 1;
  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;

  document.getElementById("totalSlides").textContent = totalSlides;

  const showSlide = (n) => {
    if (n > totalSlides) currentSlide = totalSlides;
    if (n < 1) currentSlide = 1;

    slides.forEach((slide) => slide.classList.remove("active"));
    slides[currentSlide - 1].classList.add("active");

    document.getElementById("currentSlide").textContent = currentSlide;
    document.getElementById("prevBtn").disabled = currentSlide === 1;
    document.getElementById("nextBtn").disabled = currentSlide === totalSlides;
  };

  const changeSlide = (n) => {
    currentSlide += n;
    showSlide(currentSlide);
  };

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") changeSlide(-1);
    if (e.key === "ArrowRight") changeSlide(1);
  });

  // Initial display
  showSlide(currentSlide);
