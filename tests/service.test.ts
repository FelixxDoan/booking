import { describe, it, expect } from "vitest";

import {getAllServices} from "../src/modules/services/service.service.js";

describe("getAllServices", () => {
  it('Get all services', async () => {
    const { data } = await getAllServices();
    console.log({ data });
  });
});