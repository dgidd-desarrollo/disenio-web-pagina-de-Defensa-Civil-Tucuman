document.addEventListener("DOMContentLoaded", () => {
  const currentYear = document.querySelector("#currentYear");
  const carouselElement = document.querySelector("#heroCarousel");
  const carouselToggle = document.querySelector("#carouselToggle");
  const navbarCollapse = document.querySelector("#navbarContent");
  const modalElement = document.querySelector("#infoModal");
  const modalTitle = document.querySelector("#infoModalTitle");
  const modalBody = document.querySelector("#infoModalBody");
  const toastElement = document.querySelector("#demoToast");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const guides = {
    tormentas: {
      title: "Tormentas severas",
      intro: "Si hay pronóstico de tormentas, preparate antes y evitá exponerte durante el fenómeno.",
      items: [
        "Permanecé en construcciones cerradas y alejate de ventanas.",
        "Desconectá artefactos eléctricos y evitá usar teléfonos con cable.",
        "No te refugies debajo de árboles, postes ni estructuras metálicas.",
        "Evitá circular; si es imprescindible, hacelo despacio y con luces bajas.",
        "Mantenete informado mediante canales oficiales."
      ]
    },
    inundaciones: {
      title: "Inundaciones y anegamientos",
      intro: "El agua puede ocultar pozos, cables y corrientes peligrosas. No subestimes su fuerza.",
      items: [
        "No camines ni conduzcas por calles anegadas.",
        "Cortá la electricidad si el agua puede ingresar a la vivienda.",
        "Subí documentos, medicamentos y objetos importantes.",
        "No saques residuos: pueden obstruir desagües.",
        "Seguí las indicaciones de evacuación de las autoridades."
      ]
    },
    incendios: {
      title: "Incendios urbanos y forestales",
      intro: "La detección temprana y una salida segura son prioritarias. No intentes combatir un fuego fuera de control.",
      items: [
        "Alejate del humo y ubicá una ruta de salida segura.",
        "No regreses a buscar objetos personales.",
        "En zonas rurales, no realices quemas sin autorización.",
        "Mantené terrenos y perímetros libres de material combustible.",
        "Informá de inmediato la ubicación y características del foco."
      ]
    },
    monoxido: {
      title: "Monóxido de carbono",
      intro: "Es un gas tóxico sin color ni olor. Una correcta ventilación puede salvar vidas.",
      items: [
        "Mantené siempre una abertura que permita renovar el aire.",
        "Revisá calefones, estufas y conductos con personal matriculado.",
        "No uses hornallas ni hornos para calefaccionar ambientes.",
        "La llama debe ser azul; una llama amarilla indica combustión deficiente.",
        "Ante dolor de cabeza, mareos o náuseas, salí al aire libre y pedí ayuda."
      ]
    },
    calor: {
      title: "Temperaturas extremas",
      intro: "Niños, personas mayores y quienes tienen enfermedades crónicas necesitan cuidados especiales.",
      items: [
        "Tomá agua con frecuencia, aun sin sentir sed.",
        "Evitá la exposición y la actividad intensa en horas críticas.",
        "Usá ropa liviana en verano y vestite en capas durante el frío.",
        "Controlá a personas que viven solas y nunca dejes personas o mascotas en vehículos.",
        "Consultá ante síntomas persistentes o cambios repentinos."
      ]
    },
    sismos: {
      title: "Sismos",
      intro: "Conocer los lugares seguros de tu casa, escuela o trabajo reduce riesgos.",
      items: [
        "Agachate, cubrite debajo de un mueble firme y sujetate.",
        "Alejate de ventanas, estanterías y objetos que puedan caer.",
        "No uses ascensores ni corras hacia la salida durante el movimiento.",
        "Al finalizar, cortá suministros si detectás pérdidas o daños.",
        "Reunite en el punto acordado y preparate para posibles réplicas."
      ]
    },
    mochila: {
      title: "Mochila de emergencia",
      intro: "Guardala en un lugar conocido, accesible y revisá su contenido periódicamente.",
      items: [
        "Documentación importante en una bolsa impermeable.",
        "Agua potable y alimentos no perecederos.",
        "Linterna, radio y pilas de repuesto.",
        "Botiquín y medicación habitual.",
        "Abrigo, elementos de higiene y batería externa."
      ]
    },
    plan: {
      title: "Plan familiar de emergencia",
      intro: "Definí con tu familia cómo actuar antes de que ocurra una emergencia.",
      items: [
        "Elegí un punto de encuentro cercano y otro fuera del barrio.",
        "Registrá teléfonos y un contacto fuera de la provincia.",
        "Identificá rutas de evacuación desde casa, escuela y trabajo.",
        "Asigná responsables para niños, mayores y mascotas.",
        "Practicá el plan al menos dos veces al año."
      ]
    }
  };

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (carouselElement && window.bootstrap) {
    const carousel = bootstrap.Carousel.getOrCreateInstance(carouselElement);
    let carouselPaused = reduceMotion.matches;

    const updateCarouselControl = () => {
      const icon = carouselToggle?.querySelector("i");

      if (!carouselToggle || !icon) return;
      carouselToggle.setAttribute("aria-pressed", String(carouselPaused));
      carouselToggle.setAttribute("aria-label", carouselPaused ? "Reanudar carrusel" : "Pausar carrusel");
      icon.className = carouselPaused ? "bi bi-play-fill" : "bi bi-pause-fill";
    };

    if (carouselPaused) carousel.pause();
    updateCarouselControl();

    carouselToggle?.addEventListener("click", () => {
      carouselPaused = !carouselPaused;
      carouselPaused ? carousel.pause() : carousel.cycle();
      updateCarouselControl();
    });

    reduceMotion.addEventListener("change", (event) => {
      carouselPaused = event.matches;
      event.matches ? carousel.pause() : carousel.cycle();
      updateCarouselControl();
    });
  }

  const infoModal = modalElement && window.bootstrap
    ? bootstrap.Modal.getOrCreateInstance(modalElement)
    : null;

  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      const guide = guides[button.dataset.topic];
      if (!guide || !infoModal || !modalTitle || !modalBody) return;

      modalTitle.textContent = guide.title;
      modalBody.replaceChildren();

      const intro = document.createElement("p");
      intro.className = "intro";
      intro.textContent = guide.intro;

      const list = document.createElement("ul");
      guide.items.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        list.appendChild(listItem);
      });

      modalBody.append(intro, list);
      infoModal.show();
    });
  });

  const demoToast = toastElement && window.bootstrap
    ? bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 4500 })
    : null;

  document.querySelectorAll("[data-demo-action]").forEach((button) => {
    button.addEventListener("click", () => demoToast?.show());
  });

  document.querySelectorAll('#navbarContent a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (!navbarCollapse?.classList.contains("show") || !window.bootstrap) return;
      bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
    });
  });
});
