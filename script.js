(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navAnchors = [...document.querySelectorAll(".nav-links a")];
  const projects = [...document.querySelectorAll(".project-card")];
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const projectCount = document.querySelector(".project-count");
  const modal = document.querySelector(".modal");
  const lensButtons = [...document.querySelectorAll(".lens-button")];
  const lensDescription = document.querySelector("#lens-description");
  const portraitChip = document.querySelector("#portrait-chip");
  const questBar = document.querySelector(".quest-bar");
  const questTitle = document.querySelector("#quest-title");
  const questHint = document.querySelector("#quest-hint");
  const questCount = document.querySelector("#quest-count");
  const questProgress = document.querySelector(".quest-progress");
  const questProgressFill = document.querySelector(".quest-progress-fill");
  const exploredProjects = new Set();
  const lensContent = {
    build: {
      description: "I turn everyday campus problems into thoughtful digital tools, from easier leave workflows to a marketplace for student ideas.",
      chip: "Building with intention"
    },
    explore: {
      description: "I follow questions into new territory, from explaining banana-leaf disease models to exploring breath-based biometrics.",
      chip: "Always asking why"
    },
    lead: {
      description: "I make space for people to grow too — through student mentoring, GDG on Campus, Toastmasters, and community work.",
      chip: "Better, together"
    }
  };
  const projectDetails = {
    leave: {
      category: "Campus technology · 2026",
      title: "Leave + OD Management",
      description: "A digital leave and on-duty management flow that brings requests, approvals, and documentation together. The project also uses machine-learning models to cross-check event posters against the submitted on-duty details.",
      stack: ["Vite", "React", "Tailwind CSS", "Node.js", "PL/SQL", "ML models"]
    },
    gradstart: {
      category: "Student founders · 2026",
      title: "GradStart",
      description: "A modern, student-friendly frontend for a campus micro-startup marketplace. It gives students a place to launch, showcase, and monetise the digital products they create.",
      stack: ["React", "HTML", "CSS", "JavaScript", "PostgreSQL"]
    },
    breath: {
      category: "Applied AI · 2026",
      title: "AI Breath Identifier",
      description: "An AI-powered biometric authentication concept based on micro-variations in respiratory rhythm, airflow dynamics, and breath acoustics, with a focus on a distinctive and spoof-resistant identity signature.",
      stack: ["HTML", "CSS", "JavaScript", "MERN stack", "Machine learning"]
    }
  };

  document.querySelector("#year").textContent = new Date().getFullYear();

  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    navLinks.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  });

  navAnchors.forEach((anchor) => anchor.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
      closeMenu();
      menuButton.focus();
    }
  });

  let lensTimer;
  lensButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const content = lensContent[button.dataset.lens];
      lensButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      lensDescription.classList.add("is-changing");
      window.clearTimeout(lensTimer);
      lensTimer = window.setTimeout(() => {
        lensDescription.textContent = content.description;
        portraitChip.textContent = content.chip;
        lensDescription.classList.remove("is-changing");
      }, 130);
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      let visibleCount = 0;
      filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      projects.forEach((card) => {
        const matches = filter === "all" || card.dataset.category.split(" ").includes(filter);
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });
      projectCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "project" : "projects"}`;
    });
  });

  document.querySelectorAll(".project-open").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projectDetails[button.dataset.project];
      modal.querySelector(".modal-category").textContent = project.category;
      modal.querySelector("#modal-title").textContent = project.title;
      modal.querySelector(".modal-description").textContent = project.description;
      const stack = modal.querySelector(".modal-stack");
      stack.replaceChildren(...project.stack.map((item) => {
        const tag = document.createElement("span");
        tag.textContent = item;
        return tag;
      }));
      modal.showModal();

      exploredProjects.add(button.dataset.project);
      const count = exploredProjects.size;
      questCount.textContent = count === 3 ? "3 / 3 ✦" : `${count} / 3`;
      questProgress.setAttribute("aria-valuenow", String(count));
      questProgressFill.style.width = `${(count / 3) * 100}%`;
      if (count === 3) {
        questBar.classList.add("is-complete");
        questTitle.textContent = "Badge unlocked: Project Explorer";
        questHint.textContent = "You explored all three project stories. Nice work!";
      } else {
        questTitle.textContent = `Mini quest: explore three projects`;
        questHint.textContent = `${3 - count} more ${3 - count === 1 ? "project" : "projects"} to unlock your badge.`;
      }
    });
  });
  modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
  });

  document.querySelector(".copy-email").addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const status = button.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText(button.dataset.email);
      status.textContent = "Copied ✓";
    } catch {
      status.textContent = "Select email";
      window.location.href = `mailto:${button.dataset.email}`;
    }
    window.setTimeout(() => { status.textContent = "Copy ↗"; }, 2200);
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canTilt) {
    document.querySelectorAll("[data-tilt]").forEach((surface) => {
      surface.addEventListener("pointermove", (event) => {
        const bounds = surface.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        surface.style.setProperty("--tilt-x", `${(0.5 - y) * 7}deg`);
        surface.style.setProperty("--tilt-y", `${(x - 0.5) * 8}deg`);
      });
      surface.addEventListener("pointerleave", () => {
        surface.style.setProperty("--tilt-x", "0deg");
        surface.style.setProperty("--tilt-y", "0deg");
      });
    });

    projects.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        card.style.setProperty("--spot-x", `${x * 100}%`);
        card.style.setProperty("--spot-y", `${y * 100}%`);
        card.style.setProperty("--tilt-x", `${(0.5 - y) * 3}deg`);
        card.style.setProperty("--tilt-y", `${(x - 0.5) * 4}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((anchor) => {
          if (anchor.getAttribute("href") === `#${entry.target.id}`) {
            anchor.setAttribute("aria-current", "location");
          } else {
            anchor.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const progress = document.querySelector(".scroll-progress");
  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progress.style.width = `${percentage}%`;
      scrollTicking = false;
    });
  }, { passive: true });
})();
