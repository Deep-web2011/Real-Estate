///////////////////////////////////////////////////////////
// Sticky navigation
document.addEventListener("DOMContentLoaded", () => {
  const sectionHeroEl = document.querySelector(".section-hero");

  if (!sectionHeroEl) return; // Prevent error if element is missing

  const obs = new IntersectionObserver(
    function (entries) {
      const ent = entries[0];

      if (ent.isIntersecting === false) {
        document.body.classList.add("sticky");
      } else {
        document.body.classList.remove("sticky");
      }
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-80px",
    }
  );

  obs.observe(sectionHeroEl);
});

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

  if (!isSupported) document.body.classList.add("no-flexbox-gap");
}
checkFlexGap();

/////////////////////////////////////////////////////
////!SECTION-- NavBar Js /////
const openMenuBtn = document.getElementById("openMenuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const mainMenu = document.getElementById("mainMenu");

const dropdowns = document.querySelectorAll(".header .menu .dropdown");

function toggleMainMenu() {
  mainMenu.classList.toggle("active");
  openMenuBtn.classList.toggle("active");
  document.documentElement.classList.toggle("menu-active");
}

openMenuBtn.addEventListener("click", toggleMainMenu);
closeMenuBtn.addEventListener("click", toggleMainMenu);

function closeAllDropdowns() {
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("active");
    const subMenu = dropdown.querySelector(".sub-menu");
    if (subMenu) {
      subMenu.classList.remove("active");
    }
    const dropdownIcon = dropdown.querySelector(".dropdown-icon");
    if (dropdownIcon) {
      dropdownIcon.style.transform = "rotate(0deg)";
    }
  });
}

dropdowns.forEach((dropdown) => {
  const dropdownLink = dropdown.querySelector("a");
  const subMenu = dropdown.querySelector(".sub-menu");
  const dropdownIcon = dropdownLink.querySelector(".dropdown-icon");

  if (subMenu) {
    dropdownLink.addEventListener("click", (event) => {
      if (window.innerWidth <= 1191) {
        event.preventDefault();

        const isActive = dropdown.classList.contains("active");

        const parentUl = dropdown.closest("ul");
        if (parentUl) {
          Array.from(parentUl.children).forEach((siblingLi) => {
            if (
              siblingLi !== dropdown &&
              siblingLi.classList.contains("dropdown") &&
              siblingLi.classList.contains("active")
            ) {
              siblingLi.classList.remove("active");
              const siblingSubMenu = siblingLi.querySelector(".sub-menu");
              if (siblingSubMenu) {
                siblingSubMenu.classList.remove("active");
              }
              const siblingIcon = siblingLi.querySelector(".dropdown-icon");
              if (siblingIcon) {
                siblingIcon.style.transform = "rotate(0deg)";
              }
            }
          });
        }

        dropdown.classList.toggle("active", !isActive);
        subMenu.classList.toggle("active", !isActive);
        if (dropdownIcon) {
          dropdownIcon.style.transform = !isActive
            ? "rotate(180deg)"
            : "rotate(0deg)";
        }
      }
    });
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1191) {
    mainMenu.classList.remove("active");
    openMenuBtn.classList.remove("active");
    document.documentElement.classList.remove("menu-active");

    closeAllDropdowns();
  }
});

/////////// Testimonial carousel functionality with auto-scroll ////////////////
//////!SECTION - Testimonial carousel
document.addEventListener("DOMContentLoaded", () => {
  const slidesContainer = document.getElementById("testimonialsGrid");
  const slides = slidesContainer?.querySelectorAll(".testimonial-card") || [];
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let currentSlideIndex = 0;
  const totalSlides = slides.length;
  let autoPlayInterval;
  const autoPlayDelay = 3000;

  function getGapValue(container) {
    const style = window.getComputedStyle(container);
    const gap = parseFloat(style.getPropertyValue("gap")) || 0;
    return gap;
  }

  function showSlide(index) {
    if (!slidesContainer || totalSlides === 0) return;

    currentSlideIndex = (index + totalSlides) % totalSlides; // wrap index

    const gap = getGapValue(slidesContainer);
    const cardWidth = slides[0]?.offsetWidth || 0;
    const scrollPosition = currentSlideIndex * (cardWidth + gap);

    slidesContainer.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  }

  function startAutoPlay() {
    if (totalSlides <= 1) return;

    stopAutoPlay(); // Reset first
    autoPlayInterval = setInterval(() => {
      showSlide(currentSlideIndex + 1);
    }, autoPlayDelay);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  function handleNavigationClick(direction) {
    stopAutoPlay();
    showSlide(currentSlideIndex + direction);
    setTimeout(startAutoPlay, 1000);
  }

  prevBtn?.addEventListener("click", () => handleNavigationClick(-1));
  nextBtn?.addEventListener("click", () => handleNavigationClick(1));

  window.addEventListener("resize", () => {
    showSlide(currentSlideIndex);
  });

  showSlide(currentSlideIndex);
  startAutoPlay();
});

//////////!SECTION -------------   Animations ////////////////////
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    rootMargin: "0px 0px -20% 0px",
    threshold: 0.1,
  }
);

revealElements.forEach((el) => revealObserver.observe(el));
