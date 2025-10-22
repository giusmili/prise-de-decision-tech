v1.0.0 – Refonte responsive, thèmes, offline, ES6+

Points clés
- HTML sémantique et accessible (sections, ARIA, labels).
- Thèmes clair/sombre/auto avec variables CSS.
- Design modernisé: typographie Matangi, boutons, grilles, tableaux.
- Transitions fluides entre diapositives (fade + slide).
- Navigation: boutons précéd./suiv. unifiés + pagination par points (tooltips).
- Responsive: grilles adaptatives, contrôles sticky, tableaux scrollables.
- PWA: Service Worker (cache, stale-while-revalidate), page offline personnalisée.
- JS réécrit ES6+: encapsulation, listeners, nettoyage inline handlers.

Détails
- index.html: structure sémantique, ARIA, bouton thème, pagination.
- css/style.css: variables, thèmes, responsive, focus visible, ombres revues.
- js/app.js: ES6+, animation de slides, thème tri-état, tooltips.
- sw.js: cache v2, fallback offline, stratégie réseau distincte navigation/GET.
- offline.html: page hors-ligne personnalisée (SVG nuage barré).

Breaking changes
- Suppression des attributs onclick inline (navigation pilotée en JS).

Post-installation
- Servir via HTTP pour activer le SW (ex: `npx serve -s .`).
- Pour forcer une MAJ SW: incrémenter `CACHE_NAME` dans `sw.js`.

