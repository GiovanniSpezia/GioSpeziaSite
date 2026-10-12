(() => {
    const feed = document.querySelector("[data-instagram-feed]");
    if (!feed) return;

    // Inserire qui i percorsi delle immagini quando saranno disponibili.
    // Per esempio: { src: "../img/instagram/post-01.webp", alt: "Descrizione della foto" }
    const posts = [
        {
            number: "01",
            type: "post",
            caption: "Post Instagram",
            images: [{ src: "", alt: "Foto del post Instagram 1" }]
        },
        {
            number: "02",
            type: "post",
            caption: "Post Instagram",
            images: [{ src: "", alt: "Foto del post Instagram 2" }]
        },
        {
            number: "03",
            type: "carousel",
            caption: "Carosello Instagram",
            images: Array.from({ length: 6 }, (_, index) => ({
                src: "",
                alt: `Foto ${index + 1} del carosello Instagram`
            }))
        }
    ];

    const renderPost = (post) => {
        let activeIndex = 0;
        const card = document.createElement("article");
        card.className = "insta-item insta-post-card";

        const media = document.createElement("div");
        media.className = `insta-media insta-placeholder insta-placeholder-${post.number}`;
        const image = document.createElement("img");
        image.alt = post.images[0].alt;
        image.loading = "lazy";
        image.decoding = "async";

        const placeholder = document.createElement("div");
        placeholder.className = "insta-placeholder-content";
        placeholder.innerHTML = `<span class="insta-placeholder-mark"><i class="fa-brands fa-instagram" aria-hidden="true"></i></span><span class="insta-placeholder-label">POST ${post.number}</span><strong>La tua foto qui</strong><small>Immagine da inserire</small>`;
        media.append(image, placeholder);

        const typeBadge = document.createElement("span");
        typeBadge.className = "insta-post-type";
        typeBadge.innerHTML = post.type === "carousel"
            ? '<i class="fa-regular fa-images" aria-hidden="true"></i> Carosello'
            : '<i class="fa-regular fa-image" aria-hidden="true"></i> Post';
        media.append(typeBadge);

        const updateSlide = (step) => {
            activeIndex = (activeIndex + step + post.images.length) % post.images.length;
            const slide = post.images[activeIndex];
            image.alt = slide.alt;
            media.classList.toggle("has-image", Boolean(slide.src));
            if (slide.src) {
                image.src = slide.src;
                placeholder.hidden = true;
            } else {
                image.removeAttribute("src");
                placeholder.hidden = false;
                placeholder.querySelector("strong").textContent = "La tua foto qui";
                placeholder.querySelector("small").textContent = `Foto ${activeIndex + 1} · da inserire`;
            }
            const counter = media.querySelector(".insta-carousel-count");
            if (counter) counter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(post.images.length).padStart(2, "0")}`;
        };

        if (post.type === "carousel") {
            const controls = document.createElement("div");
            controls.className = "insta-carousel-controls";
            const counter = document.createElement("span");
            counter.className = "insta-carousel-count";
            counter.setAttribute("aria-live", "polite");
            counter.textContent = `01 / ${String(post.images.length).padStart(2, "0")}`;
            [[-1, "Foto precedente"], [1, "Foto successiva"]].forEach(([step, label]) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "insta-carousel-arrow";
                button.setAttribute("aria-label", label);
                button.innerHTML = `<i class="fa-solid fa-chevron-${step < 0 ? "left" : "right"}" aria-hidden="true"></i>`;
                button.addEventListener("click", () => updateSlide(step));
                controls.append(button);
            });
            controls.append(counter);
            media.append(controls);
            let swipeStart = null;
            media.addEventListener("pointerdown", (event) => {
                if (event.target.closest("button")) return;
                swipeStart = event.clientX;
            });
            media.addEventListener("pointerup", (event) => {
                if (swipeStart === null) return;
                const delta = event.clientX - swipeStart;
                swipeStart = null;
                if (Math.abs(delta) > 45) updateSlide(delta < 0 ? 1 : -1);
            });
            media.addEventListener("pointercancel", () => { swipeStart = null; });
        }

        const details = document.createElement("div");
        details.className = "insta-post-details";
        const caption = document.createElement("p");
        caption.textContent = post.caption;
        const number = document.createElement("span");
        number.className = "insta-post-number";
        number.textContent = post.number;
        details.append(caption, number);
        card.append(media, details);

        if (post.images[0].src) {
            image.src = post.images[0].src;
            media.classList.add("has-image");
            placeholder.hidden = true;
        }
        return card;
    };

    feed.replaceChildren(...posts.map(renderPost));
})();
