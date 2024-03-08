# Readme.md

## Tehnologiile folosite:

### Aplicații:
- **Next.js (Admin Page)**: Aplicație construită pentru gestionarea părții de administrare a magazinului.
- **Next.js (Front Page)**: Aplicație construită pentru interfața principală a magazinului destinată utilizatorilor.

### Manager de pachete:
- **Yarn**: Folosit pentru a gestiona dependențele și pentru a rula scripturi în cadrul proiectului.

### Baza de date:
- **MongoDB**: Baza de date folosită pentru a stoca informații despre produse, comenzi, utilizatori și alte date relevante.
- **Mongoose**: Este folosit pentru a interacționa cu baza de date MongoDB și pentru a modela datele.

### Stilizare:
- **Styled-components**: Este folosit pentru a stiliza componentele într-un mod modular și reutilizabil.

### Alte tehnologii:
- **Stripe**: Este folosit pentru a gestiona plățile în cadrul aplicației.

---

## LISTA DE CERINȚE

### INTERFAȚĂ DE UTILIZATOR:
- Design curat și modern.
- Navigare intuitivă și ușor de utilizat.
- Pagini individuale pentru fiecare produs.

### GESTIONAREA PRODUSELOR ÎN PAGINA DE ADMIN:
- Crearea de produse noi cu detalii precum titlu, descriere, preț și imagini.
- Editarea detaliilor produselor existente.
- Ștergerea produselor.
- Operații CRUD (Create, Read, Update, Delete) pentru imaginile produselor.

### GESTIONAREA CATEGORIILOR ÎN PAGINA DE ADMIN:
- Operații CRUD (Create, Read, Update, Delete) pentru categoriile produselor.

### GESTIONAREA COMENZILOR ÎN PAGINA DE ADMIN:
- Vizualizarea tuturor comenzilor plasate.
- Detalii despre fiecare comandă, inclusiv data, destinatar și produsele comandate.

### COȘ DE CUMPĂRĂTURI PE FRONT:
- Adăugarea produselor în coș cu un singur clic.
- Vizualizarea detaliată a conținutului coșului.
- Opțiunea de a șterge produse din coș.
- Calcul automat al totalului plății la adăugarea/eliminarea unui produs din coș.

### PRODUSE RECENT ADĂUGATE:
- Afișarea unei secțiuni cu cele mai recente produse adăugate în magazin.

### PLĂȚI ȘI COMENZI:
- Integrare cu Stripe pentru plăți sigure.

### CONT DE UTILIZATOR:
- Crearea și autentificarea în contul de utilizator.

---

## LISTA DE SPECIFICAȚII TEHNICE

### FRONTEND:
- Construit cu React și Next.js.
- Utilizarea styled-components pentru stilizare.
- Implementarea contextului pentru gestionarea stării coșului de cumpărături.

### BACKEND:
- Utilizarea MongoDB ca bază de date.
- Endpoint-uri API pentru CRUD (Create, Read, Update, Delete) pentru produse, categorii, comenzi și imagini ale produselor.
- Integrare cu Stripe pentru gestionarea plăților.

### SECURITATE:
- Implementarea autentificării utilizatorilor.
- Utilizarea webhooks pentru a valida și procesa evenimentele de plată de la Stripe.

### OPTIMIZARE:
- Lazy loading pentru imagini.

### RESPONSIVE DESIGN:
- Design adaptiv pentru toate dispozitivele.
