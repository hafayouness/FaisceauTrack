import bcrypt from "bcryptjs";

/* =========================================================
   🌱 SEED UNIQUE — FaisceauTrack
   Toutes les données dans un seul fichier
   ========================================================= */

/* ---------- Users ---------- */
const USER_ADMIN = "11111111-1111-1111-1111-111111111111";
const USER_LOGISTIC = "11111111-1111-1111-1111-111111111112";
const USER_RECEPTION = "11111111-1111-1111-1111-111111111113";
const USER_VIEWER = "11111111-1111-1111-1111-111111111114";

/* ---------- References ---------- */
const REF_001 = "22222222-2222-2222-2222-222222222201";
const REF_002 = "22222222-2222-2222-2222-222222222202";
const REF_015 = "22222222-2222-2222-2222-222222222203";
const REF_023 = "22222222-2222-2222-2222-222222222204";
const REF_045 = "22222222-2222-2222-2222-222222222205";
const REF_050 = "22222222-2222-2222-2222-222222222206";
const REF_060 = "22222222-2222-2222-2222-222222222207";

/* ---------- Trailers ---------- */
const TRAILER_025 = "33333333-3333-3333-3333-333333333301";
const TRAILER_026 = "33333333-3333-3333-3333-333333333302";
const TRAILER_027 = "33333333-3333-3333-3333-333333333303";
const TRAILER_030 = "33333333-3333-3333-3333-333333333304";
const TRAILER_041 = "33333333-3333-3333-3333-333333333305";

/* ---------- Transporters ---------- */
const TRANS_XYZ = "44444444-4444-4444-4444-444444444401";
const TRANS_ABC = "44444444-4444-4444-4444-444444444402";
const TRANS_EXPRESS = "44444444-4444-4444-4444-444444444403";
const TRANS_LOGIPRO = "44444444-4444-4444-4444-444444444404";

/* ---------- Destinations ---------- */
const DEST_A = "55555555-5555-5555-5555-555555555501";
const DEST_B = "55555555-5555-5555-5555-555555555502";
const DEST_NORD = "55555555-5555-5555-5555-555555555503";
const DEST_SUD = "55555555-5555-5555-5555-555555555504";
const DEST_EU = "55555555-5555-5555-5555-555555555505";

/* ---------- Deliveries ---------- */
const DEL_001 = "66666666-6666-6666-6666-666666666601";
const DEL_002 = "66666666-6666-6666-6666-666666666602";
const DEL_003 = "66666666-6666-6666-6666-666666666603";
const DEL_004 = "66666666-6666-6666-6666-666666666604";
const DEL_005 = "66666666-6666-6666-6666-666666666605";

export default {
  async up(queryInterface) {
    const now = new Date();

    /* =======================================================
       1. 👥 USERS
       Mot de passe pour tous : password123
       ======================================================= */
    const password = await bcrypt.hash("password123", 12);

    await queryInterface.bulkInsert("Users", [
      {
        id: USER_ADMIN,
        name: "Youness Hafa",
        email: "admin@faisceautrack.com",
        password,
        role: "ADMIN",
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: USER_LOGISTIC,
        name: "Marie Dupont",
        email: "logistique@faisceautrack.com",
        password,
        role: "LOGISTIC_MANAGER",
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: USER_RECEPTION,
        name: "Pierre Martin",
        email: "reception@faisceautrack.com",
        password,
        role: "RECEPTION",
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: USER_VIEWER,
        name: "Sophie Bernard",
        email: "viewer@faisceautrack.com",
        password,
        role: "VIEWER",
        isActive: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    /* =======================================================
       2. 📦 REFERENCES
       ======================================================= */
    await queryInterface.bulkInsert("References", [
      {
        id: REF_001,
        code: "FA-001",
        description: "Faisceau moteur principal - 2.0L",
        unit: "PCS",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: REF_002,
        code: "FA-002",
        description: "Faisceau capteur ABS avant droit",
        unit: "PCS",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: REF_015,
        code: "FA-015",
        description: "Faisceau éclairage arrière",
        unit: "PCS",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: REF_023,
        code: "FA-023",
        description: "Faisceau câble accélérateur",
        unit: "PCS",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: REF_045,
        code: "FA-045",
        description: "Câble haute tension",
        unit: "M",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: REF_050,
        code: "FA-050",
        description: "Faisceau tableau de bord",
        unit: "PCS",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: REF_060,
        code: "FA-060",
        description: "Gaine thermorétractable",
        unit: "KG",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    /* =======================================================
       3. 🚛 TRAILERS
       ======================================================= */
    await queryInterface.bulkInsert("Trailers", [
      {
        id: TRAILER_025,
        registrationNumber: "REM-025",
        type: "SEMI_REMORQUE",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: TRAILER_026,
        registrationNumber: "REM-026",
        type: "PORTE_CONTENEUR",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: TRAILER_027,
        registrationNumber: "REM-027",
        type: "FRIGORIFIQUE",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: TRAILER_030,
        registrationNumber: "REM-030",
        type: "PLATEAU",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: TRAILER_041,
        registrationNumber: "REM-041",
        type: "TAUTLINER",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    /* =======================================================
       4. 🏢 TRANSPORTERS
       ======================================================= */
    await queryInterface.bulkInsert("Transporters", [
      {
        id: TRANS_XYZ,
        name: "Transport XYZ",
        company: "XYZ Logistique SARL",
        phone: "+33 6 12 34 56 78",
        email: "contact@transport-xyz.com",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: TRANS_ABC,
        name: "Transport ABC",
        company: "ABC Logistique",
        phone: "+33 6 98 76 54 32",
        email: "contact@abc-logistique.fr",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: TRANS_EXPRESS,
        name: "Trans Express",
        company: "Trans Express International",
        phone: "+33 1 23 45 67 89",
        email: "info@trans-express.com",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: TRANS_LOGIPRO,
        name: "Logi Pro",
        company: "Logi Pro Services",
        phone: "+33 7 11 22 33 44",
        email: "contact@logipro.fr",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    /* =======================================================
       5. 📍 DESTINATIONS
       ======================================================= */
    await queryInterface.bulkInsert("Destinations", [
      {
        id: DEST_A,
        name: "Site Production A",
        city: "Casablanca",
        country: "Maroc",
        contactName: "Ahmed Benali",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: DEST_B,
        name: "Site Production B",
        city: "Rabat",
        country: "Maroc",
        contactName: "Fatima Zahra",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: DEST_NORD,
        name: "Entrepôt Nord",
        city: "Tanger",
        country: "Maroc",
        contactName: "Karim Idrissi",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: DEST_SUD,
        name: "Entrepôt Sud",
        city: "Agadir",
        country: "Maroc",
        contactName: "Youssef Amrani",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: DEST_EU,
        name: "Client Final Europe",
        city: "Lyon",
        country: "France",
        contactName: "Jean Dupont",
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    /* =======================================================
       6. 🚚 DELIVERIES
       ======================================================= */
    await queryInterface.bulkInsert("Deliveries", [
      {
        id: DEL_001,
        deliveryNumber: "DL-2026-001",
        destinationId: DEST_A,
        transporterId: TRANS_XYZ,
        trailerId: TRAILER_025,
        status: "RECEIVED",
        preparationDate: new Date("2026-10-01T08:00:00"),
        departureDate: new Date("2026-10-01T10:00:00"),
        arrivalDate: new Date("2026-10-02T14:00:00"),
        notes: "Livraison terminée sans incident",
        createdBy: USER_LOGISTIC,
        updatedBy: USER_LOGISTIC,
        createdAt: new Date("2026-10-01T08:00:00"),
        updatedAt: new Date("2026-10-02T14:00:00"),
      },
      {
        id: DEL_002,
        deliveryNumber: "DL-2026-002",
        destinationId: DEST_B,
        transporterId: TRANS_ABC,
        trailerId: TRAILER_026,
        status: "IN_TRANSIT",
        preparationDate: new Date("2026-10-05T08:00:00"),
        departureDate: new Date("2026-10-05T10:00:00"),
        arrivalDate: null,
        notes: "En route vers Rabat",
        createdBy: USER_LOGISTIC,
        updatedBy: USER_LOGISTIC,
        createdAt: new Date("2026-10-05T08:00:00"),
        updatedAt: new Date("2026-10-05T10:00:00"),
      },
      {
        id: DEL_003,
        deliveryNumber: "DL-2026-003",
        destinationId: DEST_NORD,
        transporterId: TRANS_EXPRESS,
        trailerId: TRAILER_027,
        status: "PREPARATION",
        preparationDate: new Date("2026-10-08T08:00:00"),
        departureDate: null,
        arrivalDate: null,
        notes: "En cours de chargement",
        createdBy: USER_LOGISTIC,
        updatedBy: USER_LOGISTIC,
        createdAt: new Date("2026-10-08T08:00:00"),
        updatedAt: new Date("2026-10-08T08:00:00"),
      },
      {
        id: DEL_004,
        deliveryNumber: "DL-2026-004",
        destinationId: DEST_SUD,
        transporterId: TRANS_LOGIPRO,
        trailerId: TRAILER_030,
        status: "PARTIAL_RECEPTION",
        preparationDate: new Date("2026-09-28T08:00:00"),
        departureDate: new Date("2026-09-28T10:00:00"),
        arrivalDate: new Date("2026-09-29T12:00:00"),
        notes: "Réception partielle - 50 unités manquantes",
        createdBy: USER_LOGISTIC,
        updatedBy: USER_RECEPTION,
        createdAt: new Date("2026-09-28T08:00:00"),
        updatedAt: new Date("2026-09-29T15:00:00"),
      },
      {
        id: DEL_005,
        deliveryNumber: "DL-2026-005",
        destinationId: DEST_A,
        transporterId: TRANS_XYZ,
        trailerId: TRAILER_041,
        status: "CANCELLED",
        preparationDate: new Date("2026-10-03T08:00:00"),
        departureDate: null,
        arrivalDate: null,
        notes: "Annulée par le client",
        createdBy: USER_LOGISTIC,
        updatedBy: USER_LOGISTIC,
        createdAt: new Date("2026-10-03T08:00:00"),
        updatedAt: new Date("2026-10-03T12:00:00"),
      },
    ]);

    /* =======================================================
       7. 📦 DELIVERY ITEMS
       ======================================================= */
    await queryInterface.bulkInsert("DeliveryItems", [
      /* DL-2026-001 */
      {
        id: "77777777-7777-7777-7777-777777777701",
        deliveryId: DEL_001,
        referenceId: REF_001,
        quantity: 500,
        unit: "PCS",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "77777777-7777-7777-7777-777777777702",
        deliveryId: DEL_001,
        referenceId: REF_002,
        quantity: 250,
        unit: "PCS",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "77777777-7777-7777-7777-777777777703",
        deliveryId: DEL_001,
        referenceId: REF_015,
        quantity: 120,
        unit: "PCS",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "77777777-7777-7777-7777-777777777704",
        deliveryId: DEL_001,
        referenceId: REF_023,
        quantity: 800,
        unit: "PCS",
        createdAt: now,
        updatedAt: now,
      },

      /* DL-2026-002 */
      {
        id: "77777777-7777-7777-7777-777777777705",
        deliveryId: DEL_002,
        referenceId: REF_001,
        quantity: 300,
        unit: "PCS",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "77777777-7777-7777-7777-777777777706",
        deliveryId: DEL_002,
        referenceId: REF_045,
        quantity: 150,
        unit: "M",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "77777777-7777-7777-7777-777777777707",
        deliveryId: DEL_002,
        referenceId: REF_060,
        quantity: 40,
        unit: "KG",
        createdAt: now,
        updatedAt: now,
      },

      /* DL-2026-003 */
      {
        id: "77777777-7777-7777-7777-777777777708",
        deliveryId: DEL_003,
        referenceId: REF_050,
        quantity: 200,
        unit: "PCS",
        createdAt: now,
        updatedAt: now,
      },

      /* DL-2026-004 */
      {
        id: "77777777-7777-7777-7777-777777777709",
        deliveryId: DEL_004,
        referenceId: REF_001,
        quantity: 400,
        unit: "PCS",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "77777777-7777-7777-7777-777777777710",
        deliveryId: DEL_004,
        referenceId: REF_015,
        quantity: 150,
        unit: "PCS",
        createdAt: now,
        updatedAt: now,
      },

      /* DL-2026-005 */
      {
        id: "77777777-7777-7777-7777-777777777711",
        deliveryId: DEL_005,
        referenceId: REF_002,
        quantity: 100,
        unit: "PCS",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    /* =======================================================
       8. 📥 RECEPTIONS
       ======================================================= */
    /* =======================================================
       8. 📥 RECEPTIONS
       ======================================================= */
    await queryInterface.bulkInsert("Receptions", [
      /* DL-2026-001 — tout reçu (5 réceptions) */
      {
        id: "88888888-8888-8888-8888-888888888801",
        deliveryId: DEL_001,
        referenceId: REF_001,
        quantityExpected: 500,
        quantityReceived: 500,
        status: "COMPLETED",
        comment: "Réception conforme",
        receivedAt: new Date("2026-10-02T14:00:00"),
        receivedBy: USER_RECEPTION,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "88888888-8888-8888-8888-888888888802",
        deliveryId: DEL_001,
        referenceId: REF_002,
        quantityExpected: 250,
        quantityReceived: 250,
        status: "COMPLETED",
        comment: null,
        receivedAt: new Date("2026-10-02T14:00:00"),
        receivedBy: USER_RECEPTION,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "88888888-8888-8888-8888-888888888803",
        deliveryId: DEL_001,
        referenceId: REF_015,
        quantityExpected: 120,
        quantityReceived: 120,
        status: "COMPLETED",
        comment: null,
        receivedAt: new Date("2026-10-02T14:00:00"),
        receivedBy: USER_RECEPTION,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "88888888-8888-8888-8888-888888888804",
        deliveryId: DEL_001,
        referenceId: REF_023,
        quantityExpected: 800,
        quantityReceived: 800,
        status: "COMPLETED",
        comment: null,
        receivedAt: new Date("2026-10-02T14:00:00"),
        receivedBy: USER_RECEPTION,
        createdAt: now,
        updatedAt: now,
      },

      /* DL-2026-004 — réceptions avec anomalie */
      {
        id: "88888888-8888-8888-8888-888888888805",
        deliveryId: DEL_004,
        referenceId: REF_001,
        quantityExpected: 400,
        quantityReceived: 380,
        status: "WITH_ISSUE",
        comment: "20 pièces manquantes - colis endommagé",
        receivedAt: new Date("2026-09-29T12:00:00"),
        receivedBy: USER_RECEPTION,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "88888888-8888-8888-8888-888888888806",
        deliveryId: DEL_004,
        referenceId: REF_015,
        quantityExpected: 150,
        quantityReceived: 120,
        status: "WITH_ISSUE",
        comment: "30 pièces manquantes",
        receivedAt: new Date("2026-09-29T12:00:00"),
        receivedBy: USER_RECEPTION,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    console.log("\n✅ ========================================");
    console.log("🌱 SEED TERMINÉ AVEC SUCCÈS");
    console.log("========================================\n");
    console.log("📊 Données créées :");
    console.log("   👥 4 utilisateurs");
    console.log("   📦 7 références");
    console.log("   🚛 5 remorques");
    console.log("   🏢 4 transporteurs");
    console.log("   📍 5 destinations");
    console.log("   🚚 5 livraisons");
    console.log("   📋 11 lignes de livraison");
    console.log("   📥 6 réceptions\n");
    console.log("🔑 Comptes (mdp : password123) :");
    console.log("   🟣 admin@faisceautrack.com");
    console.log("   🔵 logistique@faisceautrack.com");
    console.log("   🟢 reception@faisceautrack.com");
    console.log("   ⚪ viewer@faisceautrack.com\n");
  },

  async down(queryInterface) {
    /* Suppression dans l'ordre inverse des dépendances */
    await queryInterface.bulkDelete("Receptions", null, {});
    await queryInterface.bulkDelete("DeliveryItems", null, {});
    await queryInterface.bulkDelete("Deliveries", null, {});
    await queryInterface.bulkDelete("Destinations", null, {});
    await queryInterface.bulkDelete("Transporters", null, {});
    await queryInterface.bulkDelete("Trailers", null, {});
    await queryInterface.bulkDelete("References", null, {});
    await queryInterface.bulkDelete("Users", null, {});

    console.log("\n🗑️  Toutes les données ont été supprimées.\n");
  },
};
