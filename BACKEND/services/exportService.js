import ExcelJS from "exceljs";
import { Op } from "sequelize";
import {
  Delivery,
  DeliveryItem,
  Reference,
  Trailer,
  Transporter,
  Destination,
  Reception,
} from "../models/index.js";
import { createHistory } from "../utils/audit.js";

export const exportDeliveries = async ({ filters, userId, ipAddress }) => {
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.destinationId) where.destinationId = filters.destinationId;
  if (filters.transporterId) where.transporterId = filters.transporterId;
  if (filters.trailerId) where.trailerId = filters.trailerId;
  if (filters.deliveryNumber)
    where.deliveryNumber = { [Op.iLike]: `%${filters.deliveryNumber}%` };
  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) where.createdAt[Op.gte] = new Date(filters.dateFrom);
    if (filters.dateTo) where.createdAt[Op.lte] = new Date(filters.dateTo);
  }
  const deliveries = await Delivery.findAll({
    where,
    include: [
      { model: Trailer, as: "trailer" },
      { model: Transporter, as: "transporter" },
      { model: Destination, as: "destination" },
      {
        model: DeliveryItem,
        as: "items",
        include: [{ model: Reference, as: "reference" }],
      },
      { model: Reception, as: "receptions" },
    ],
    order: [["createdAt", "DESC"]],
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "FaisceauTrack";
  const sheet = workbook.addWorksheet("Historique livraisons");
  sheet.columns = [
    { header: "Livraison", key: "deliveryNumber", width: 20 },
    { header: "Date", key: "date", width: 22 },
    { header: "Référence", key: "reference", width: 20 },
    { header: "Quantité envoyée", key: "sent", width: 18 },
    { header: "Unité", key: "unit", width: 10 },
    { header: "Remorque", key: "trailer", width: 18 },
    { header: "Transporteur", key: "transporter", width: 25 },
    { header: "Destination", key: "destination", width: 25 },
    { header: "Statut", key: "status", width: 22 },
    { header: "Quantité reçue", key: "received", width: 18 },
    { header: "Écart", key: "difference", width: 14 },
  ];
  sheet.getRow(1).font = { bold: true };
  for (const delivery of deliveries) {
    for (const item of delivery.items) {
      const reception = delivery.receptions.find(
        (r) => r.referenceId === item.referenceId,
      );
      const sent = Number(item.quantity);
      const received = reception ? Number(reception.quantityReceived) : null;
      sheet.addRow({
        deliveryNumber: delivery.deliveryNumber,
        date: delivery.departureDate || delivery.createdAt,
        reference: item.reference.code,
        sent,
        unit: item.unit,
        trailer: delivery.trailer.registrationNumber,
        transporter: delivery.transporter.name,
        destination: delivery.destination.name,
        status: delivery.status,
        received,
        difference: reception ? sent - received : null,
      });
    }
  }
  sheet.autoFilter = { from: "A1", to: "K1" };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  await createHistory({
    userId,
    action: "EXPORT",
    entity: "Delivery",
    details: { filters },
    ipAddress,
  });
  return workbook;
};
