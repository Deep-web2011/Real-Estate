// h1.addEventListener("click", function () {
//   h1.textContent = myName;
//   h1.style.backgroundColor = "red";
//   h1.style.padding = "5rem";
// });

///////////////////////////////////////////////////////////
// Set current year


///////////////////////////////////////////////////////////
// Smooth scrolling animation

// const allLinks = document.querySelectorAll("a:link");

// allLinks.forEach(function (link) {
//   link.addEventListener("click", function (e) {
//     e.preventDefault();
//     const href = link.getAttribute("href");

//     // Scroll back to top
//     if (href === "#")
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });

//     // Scroll to other links
//     if (href !== "#" && href.startsWith("#")) {
//       const sectionEl = document.querySelector(href);
//       sectionEl.scrollIntoView({ behavior: "smooth" });
//     }

//     // Close mobile naviagtion
//     if (link.classList.contains("main-nav-link"))
//       headerEl.classList.toggle("nav-open");
//   });
// });

///////////////////////////////////////////////////////////
// Sticky navigation

// const sectionHeroEl = document.querySelector(".section-hero");

// const obs = new IntersectionObserver(
//   function (entries) {
//     const ent = entries[0];
//     console.log(ent);

//     if (ent.isIntersecting === false) {
//       document.body.classList.add("sticky");
//     }

//     if (ent.isIntersecting === true) {
//       document.body.classList.remove("sticky");
//     }
//   },
//   {
//     root: null,
//     threshold: 0,
//     rootMargin: "-80px",
//   }
// );
// obs.observe(sectionHeroEl);

///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  var flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";

  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  console.log(isSupported);

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();

/////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const openMenuBtn = document.querySelector(".open-menu-btn");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const menu = document.querySelector(".menu");
  const body = document.body;
  const html = document.documentElement;

  openMenuBtn.addEventListener("click", () => {
    menu.classList.add("active");
    body.classList.add("menu-active");
    html.classList.add("menu-active");
    openMenuBtn.classList.add("active");
  });

  closeMenuBtn.addEventListener("click", () => {
    menu.classList.remove("active");
    body.classList.remove("menu-active");
    html.classList.remove("menu-active");
    openMenuBtn.classList.remove("active");
  });

  // Handle dropdowns for mobile
  const dropdowns = document.querySelectorAll(".menu .dropdown > a");
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", function (e) {
      // Only prevent default and handle dropdown if on mobile breakpoint
      if (window.innerWidth <= 1191) {
        e.preventDefault();
        const parentLi = this.parentElement;
        const subMenu = parentLi.querySelector(".sub-menu");
        const dropdownIcon = this.querySelector(".dropdown-icon");

        if (subMenu) {
          // Close other open sub-menus at the same level
          parentLi.parentElement
            .querySelectorAll(".sub-menu.active")
            .forEach((openSubMenu) => {
              if (openSubMenu !== subMenu) {
                openSubMenu.classList.remove("active");
                openSubMenu.style.maxHeight = "0";
                const siblingDropdownIcon =
                  openSubMenu.parentElement.querySelector(".dropdown-icon");
                if (siblingDropdownIcon) {
                  siblingDropdownIcon.style.transform = "rotate(0deg)";
                }
              }
            });

          // Toggle current sub-menu
          subMenu.classList.toggle("active");
          if (subMenu.classList.contains("active")) {
            subMenu.style.maxHeight = subMenu.scrollHeight + "px";
            if (dropdownIcon) {
              dropdownIcon.style.transform = "rotate(90deg)";
            }
          } else {
            subMenu.style.maxHeight = "0";
            if (dropdownIcon) {
              dropdownIcon.style.transform = "rotate(0deg)";
            }
          }
        }
      }
    });
  });

  // Handle nested dropdowns for mobile
  const nestedDropdowns = document.querySelectorAll(
    ".menu .sub-menu .dropdown > a"
  );
  nestedDropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", function (e) {
      if (window.innerWidth <= 1191) {
        // Updated breakpoint
        e.preventDefault();
        const parentLi = this.parentElement;
        const subMenu = parentLi.querySelector(".sub-menu-left");
        const dropdownIcon = this.querySelector(".dropdown-icon");

        if (subMenu) {
          // Close other open nested sub-menus at the same level
          parentLi.parentElement
            .querySelectorAll(".sub-menu-left.active")
            .forEach((openSubMenu) => {
              if (openSubMenu !== subMenu) {
                openSubMenu.classList.remove("active");
                openSubMenu.style.maxHeight = "0";
                const siblingDropdownIcon =
                  openSubMenu.parentElement.querySelector(".dropdown-icon");
                if (siblingDropdownIcon) {
                  siblingDropdownIcon.style.transform = "rotate(0deg)";
                }
              }
            });

          // Toggle current nested sub-menu
          subMenu.classList.toggle("active");
          if (subMenu.classList.contains("active")) {
            subMenu.style.maxHeight = subMenu.scrollHeight + "px";
            if (dropdownIcon) {
              dropdownIcon.style.transform = "rotate(90deg)";
            }
          } else {
            subMenu.style.maxHeight = "0";
            if (dropdownIcon) {
              dropdownIcon.style.transform = "rotate(0deg)";
            }
          }
        }
      }
    });
  });

  // Close menu and reset states when window is resized to desktop size
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1191) {
      // Updated breakpoint
      menu.classList.remove("active");
      body.classList.remove("menu-active");
      html.classList.remove("menu-active");
      openMenuBtn.classList.remove("active");
      // Reset mobile dropdown states
      document.querySelectorAll(".sub-menu.active").forEach((subMenu) => {
        subMenu.classList.remove("active");
        subMenu.style.maxHeight = "auto"; // Allow content to flow naturally on desktop
      });
      document.querySelectorAll(".dropdown-icon").forEach((icon) => {
        icon.style.transform = "rotate(0deg)";
      });
    }
  });
});


// Testimonial carousel functionality with auto-scroll

document.addEventListener("DOMContentLoaded", () => {
  // Testimonial carousel functionality with auto-scroll
  const slidesContainer = document.getElementById("testimonialsGrid");
  const slides = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let currentSlideIndex = 0;
  const totalSlides = slides ? slides.length : 0;
  let autoPlayInterval;
  const autoPlayDelay = 3000;

  function showSlide(index) {
    if (totalSlides === 0) {
      return;
    }

    let targetIndex = index;

    if (targetIndex >= totalSlides) {
      targetIndex = 0;
    } else if (targetIndex < 0) {
      targetIndex = totalSlides - 1;
    }

    currentSlideIndex = targetIndex;

    const computedStyle = window.getComputedStyle(slidesContainer);
    const gapString = computedStyle.getPropertyValue("gap");
    const gap = parseFloat(gapString) || 0;

    const cardWidth = slides[0] ? slides[0].offsetWidth : 0;
    const scrollPosition = currentSlideIndex * (cardWidth + gap);

    slidesContainer.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  }

  function startAutoPlay() {
    if (totalSlides <= 1) {
      return;
    }
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
      showSlide(currentSlideIndex + 1);
    }, autoPlayDelay);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      stopAutoPlay();
      showSlide(currentSlideIndex + 1);
      setTimeout(startAutoPlay, 1000);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      stopAutoPlay();
      showSlide(currentSlideIndex - 1);
      setTimeout(startAutoPlay, 1000);
    });
  }

  showSlide(currentSlideIndex);
  startAutoPlay();

  window.addEventListener("resize", () => {
    showSlide(currentSlideIndex);
  });
});

