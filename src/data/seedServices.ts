import type { Creator, Service } from "@/types";

export const DEFAULT_CREATOR_ID = "creator_synthetic_default";
export const DEFAULT_SERVICE_ID = "service_hairstyle_suitability_card";

export const defaultCreator: Creator = {
  creatorId: DEFAULT_CREATOR_ID,
  displayName: "体验顾问",
  creatorType: "individual_creator",
  focusArea: "发型咨询与小 B 服务流程设计",
  studioName: "StyleOS 本地工作室",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z"
};

export const seedServices: Service[] = [
  {
    serviceId: DEFAULT_SERVICE_ID,
    creatorId: DEFAULT_CREATOR_ID,
    serviceName: "发型适配咨询卡",
    module: "hairstyle",
    status: "active",
    description:
      "把体验顾客的采集信息转成发型标签、入门规则匹配、顾客报告 Lite Report 和理发师沟通卡 Barber Brief。",
    priceNote: "本地备注。CE 不包含支付功能。",
    deliveryFormat: "顾客报告 Lite Report + 理发师沟通卡 Barber Brief",
    intakePath: `/intake/${DEFAULT_SERVICE_ID}`,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];
