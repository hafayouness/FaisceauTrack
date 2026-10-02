import { Op } from 'sequelize';
import { Delivery, DeliveryItem, Reception, Reference, Trailer, Transporter, Destination } from '../models/index.js';
import { getPagination } from '../utils/pagination.js';

export const getReferenceTraceability = async (referenceId) => {
  const reference = await Reference.findByPk(referenceId);
  if (!reference) { const e = new Error('Référence introuvable'); e.statusCode = 404; throw e; }
  const items = await DeliveryItem.findAll({
    where: { referenceId },
    include: [{ model: Delivery, as: 'delivery', include: [
      { model: Trailer, as: 'trailer' },
      { model: Transporter, as: 'transporter' },
      { model: Destination, as: 'destination' }
    ] }],
    order: [[{ model: Delivery, as: 'delivery' }, 'createdAt', 'DESC']]
  });

  const receptions = await Reception.findAll({ where: { referenceId } });
  const receptionByDelivery = new Map(receptions.map((r) => [r.deliveryId, r]));

  const deliveries = items.map((item) => {
    const reception = receptionByDelivery.get(item.deliveryId);
    const sent = Number(item.quantity);
    const received = reception ? Number(reception.quantityReceived) : 0;
    return {
      deliveryId: item.deliveryId,
      deliveryNumber: item.delivery.deliveryNumber,
      date: item.delivery.departureDate || item.delivery.preparationDate || item.delivery.createdAt,
      quantitySent: sent,
      unit: item.unit,
      trailer: item.delivery.trailer,
      transporter: item.delivery.transporter,
      destination: item.delivery.destination,
      deliveryStatus: item.delivery.status,
      quantityReceived: reception ? received : null,
      discrepancy: reception ? sent - received : null,
      receptionStatus: reception?.status || 'PENDING',
      anomaly: reception ? sent !== received || reception.status === 'WITH_ISSUE' : false,
      receptionComment: reception?.comment || null
    };
  });

  return { reference, deliveries };
};

export const listReferences = async ({ req }) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  if (req.query.isActive !== undefined) where.isActive = req.query.isActive === 'true';
  if (req.query.search) where[Op.or] = [
    { code: { [Op.iLike]: `%${req.query.search}%` } },
    { description: { [Op.iLike]: `%${req.query.search}%` } }
  ];
  const result = await Reference.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit, offset });
  return { ...result, page, limit };
};
