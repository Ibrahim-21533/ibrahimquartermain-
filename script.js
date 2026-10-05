// =========================================
// SKY ARCH LAB
// Main Site Script
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       PAGE LOAD
       ===================================== */

    document.body.classList.add("loaded");


    /* =====================================
       SMOOTH INTERNAL LINKS
       ===================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.startsWith("#!")
            ) {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================
       SCROLL REVEAL
       ===================================== */

    const revealElements = document.querySelectorAll(
        ".intro-content, " +
        ".lab-card, " +
        ".process-item, " +
        ".statement-content, " +
        ".about-content, " +
        ".feature-card, " +
        ".vision-content, " +
        ".future-content, " +
        ".cta-content"
    );

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {

            element.classList.add("reveal");

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =====================================
       HEADER SCROLL EFFECT
       ===================================== */

    const header = document.querySelector("header");

    if (header) {

        const updateHeader = () => {

            if (window.scrollY > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        };

        updateHeader();

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );

    }


    /* =====================================
       CARD HOVER EFFECT
       ===================================== */

    const cards = document.querySelectorAll(
        ".lab-card, .feature-card"
    );

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.classList.add("hovered");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("hovered");
        });

    });


    /* =====================================
       CURRENT YEAR
       ===================================== */

    const yearElements =
        document.querySelectorAll(".current-year");

    yearElements.forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


    /* =====================================
       IMAGE ERROR HANDLING
       ===================================== */

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            image.style.opacity = "0";

        });

    });


    /* =====================================
       TOOL BUTTON FEEDBACK
       ===================================== */

    document.querySelectorAll(".tool-form .btn").forEach(button => {

        button.addEventListener("click", () => {

            button.classList.add("clicked");

            setTimeout(() => {
                button.classList.remove("clicked");
            }, 250);

        });

    });


    /* =====================================
       ENTER KEY FOR TOOL FORMS
       ===================================== */

    document.querySelectorAll(".tool-form").forEach(form => {

        form.addEventListener("keydown", event => {

            if (
                event.key === "Enter" &&
                event.target.tagName !== "SELECT"
            ) {

                const button =
                    form.querySelector("button");

                if (button) {
                    button.click();
                }

            }

        });

    });


    /* =====================================
       NUMBER INPUT VALIDATION
       ===================================== */

    document.querySelectorAll(
        '.tool-form input[type="number"]'
    ).forEach(input => {

        input.addEventListener("input", () => {

            if (input.value < 0) {
                input.value = 0;
            }

        });

    });


    /* =====================================
       TOOL INPUT FOCUS
       ===================================== */

    document.querySelectorAll(
        ".tool-form input, .tool-form select"
    ).forEach(input => {

        input.addEventListener("focus", () => {
            input.parentElement?.classList.add("input-focused");
        });

        input.addEventListener("blur", () => {
            input.parentElement?.classList.remove("input-focused");
        });

    });


    /* =====================================
       ACTIVE NAVIGATION
       ===================================== */

    const currentPage =
        window.location.pathname.split("/").pop();

    if (currentPage) {

        document.querySelectorAll("nav a").forEach(link => {

            const linkPage =
                link.getAttribute("href")
                    ?.split("/")
                    .pop();

            if (linkPage === currentPage) {

                link.classList.add("active");

            }

        });

    }


    /* =====================================
       PREVENT EMPTY HASH JUMP
       ===================================== */

    document.querySelectorAll('a[href="#"]').forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

        });

    });

});