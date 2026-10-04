// SKY ARCH LAB
// Main site interactions

document.addEventListener("DOMContentLoaded", () => {

    /* --------------------------------
       PAGE LOAD
    -------------------------------- */

    document.body.classList.add("loaded");


    /* --------------------------------
       SMOOTH SCROLLING
    -------------------------------- */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId === "#" || !targetId) return;

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


    /* --------------------------------
       SCROLL REVEAL
    -------------------------------- */

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


    /* --------------------------------
       HEADER SCROLL EFFECT
    -------------------------------- */

    const header = document.querySelector("header");

    if (header) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 40) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        });

    }


    /* --------------------------------
       LAB CARD HOVER EFFECT
    -------------------------------- */

    const cards = document.querySelectorAll(".lab-card, .feature-card");

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.classList.add("hovered");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("hovered");
        });

    });


    /* --------------------------------
       CURRENT YEAR
    -------------------------------- */

    const yearElements = document.querySelectorAll(".current-year");

    yearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });


    /* --------------------------------
       IMAGE ERROR HANDLING
    -------------------------------- */

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            image.style.opacity = "0";

        });

    });

});