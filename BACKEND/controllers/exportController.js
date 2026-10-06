import { exportDeliveries } from "../services/exportService.js";
export const exportDeliveryHistory = async (req, res) => {
  const workbook = await exportDeliveries({
    filters: req.query,
    userId: req.user.id,
    ipAddress: req.ip,
  });
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="faisceautrack-livraisons-${new Date().toISOString().slice(0, 10)}.xlsx"`,
  );
  await workbook.xlsx.write(res);
  res.end();
};
