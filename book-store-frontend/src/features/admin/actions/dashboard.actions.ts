"use server";

import { dashboardService } from "../services/dashboard.service";

export async function getStatsAction() {
  return dashboardService.getStats();
}

export async function getSalesOverTimeAction() {
  return dashboardService.getSalesOverTime();
}

export async function getSalesByCategoryAction() {
  return dashboardService.getSalesByCategory();
}
