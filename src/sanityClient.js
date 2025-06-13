import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "rohfbykz", // 👈 from sanity.config.js
  dataset: "production",
  useCdn: false,
  token:
    "skH89gnGDbtqV1ahF5aFbks3TGpVa9z6GK6Z18JIJv2JwAIQ8owEwc3GQsblm5ah9EQIgsMtysOEhdaZSSY7PpBj8iid9s1vlSmGO5YuEJ91g1u2YuLqCZf25XnZ6j64873GfKgg9AzpL55nbhlC30Vzjk4TMyOBDsGMjhgwOKknwq4LXwrt",
});
