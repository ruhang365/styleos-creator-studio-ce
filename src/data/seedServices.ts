import type { Creator, Service } from "@/types";

export const DEFAULT_CREATOR_ID = "creator_synthetic_default";
export const DEFAULT_SERVICE_ID = "service_hairstyle_suitability_card";

export const defaultCreator: Creator = {
  creatorId: DEFAULT_CREATOR_ID,
  displayName: "Synthetic Creator",
  creatorType: "individual_creator",
  focusArea: "Hairstyle suitability and small-B styling service design",
  studioName: "StyleOS Local Studio",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z"
};

export const seedServices: Service[] = [
  {
    serviceId: DEFAULT_SERVICE_ID,
    creatorId: DEFAULT_CREATOR_ID,
    serviceName: "Hairstyle Suitability Card",
    module: "hairstyle",
    status: "active",
    description:
      "A local-first consultation flow that turns synthetic fan intake into hairstyle tags, starter rule matches, a Lite Report, and a Barber Brief.",
    priceNote: "Local note only. CE does not include payments.",
    deliveryFormat: "Markdown Lite Report + Barber Brief",
    intakePath: `/intake/${DEFAULT_SERVICE_ID}`,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }
];
