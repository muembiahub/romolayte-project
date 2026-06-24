import { getDashboardStatsModel, getAllOrdersModel } from "../models/dashboardModels.js";

/* =====================================================
   DASHBOARD CONTROLLER
===================================================== */

export const getDashboardStats = async (req, res, next) => {
  try {
    const data = await getDashboardStatsModel();

    return res.json({
      success: true,
      ...data,
    });

  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrdersModel();
    console.log(orders);

    return res.json({
      success: true,
      orders,
    });

  } catch (error) {
    next(error);
  }
};