## Beskrivelse

Daily Challenge Kalender er en personlig kalender-applikasjon der brukeren kan lage egne daglige utfordringer. Utfordringer kan enten legges på bestemte datoer eller velges tilfeldig av systemet og dukke opp på en dag i kalenderen. Brukeren kan fullføre utfordringer og følge egen progresjon over tid.

## Feature Map

### Bruker

- Registrere bruker
- Logge inn og ut
- Se egen profil og progresjon

### Utfordringer

- Opprette egne utfordringer
- Redigere og slette utfordringer
- Knytte utfordringer til spesifikke datoer
- Tilfeldig tildeling av utfordringer på enkelte dager
- Markere utfordringer som fullført

### Kalender og visning

- Kalendervisning av dager og utfordringer
- Oversikt over fullførte og kommende utfordringer

### Progresjon

- Vise gjennomføringsgrad over tid
- Enkel statistikk basert på fullførte utfordringer

### Offline og PWA

- Vise eksisterende utfordringer offline
- Opprette nye utfordringer offline
- Synkronisere data når brukeren er online igjen
- Installerbar som Progressive Web App (PWA)

## Start working on API

API-et håndterer Challenge.

En utfordring representerer en daglig oppgave som kan knyttes til en spesifikk dato og markeres som fullført.

Eksempel på datastruktur:
{
"id": "uuid",
"title": "Gå en tur",
"date": "2026-02-01",
"completed": false
}

- GET Henter alle utfordringer
- POST Oppretter en ny utfordring
- PUT Oppdaterer en eksisterende utfordring
- PATCH Marker utfordring som fullført
- DELETE Sletter en utfordring

API-et støtter CRUD-funksjonalitet (Create, Read, Update, Delete).

API-test ved hjelp av bruno

## CLIENT

Denne innleveringen er en enkel klient for Daily Challenge Kalender som bruker et eksisterende User API.
Klienten ligger i Public og er bygget med tydelig struktur og ryddig filoppsett.
Brukere kan opprettes, redigeres og slettes via egne UI-komponenter.
UI oppdateres automatisk når data endres.
