import { TaxYearProvinceConfig } from "../../types";
import {
  ALBERTA_FEDERAL_TRANSFER_NAME,
  ALBERTA_SPENDING,
  ALBERTA_TAX_CONFIG,
} from "./alberta";
import { FEDERAL_SPENDING, FEDERAL_TAX_CONFIG } from "./federal";
import {
  ONTARIO_FEDERAL_TRANSFER_NAME,
  ONTARIO_SPENDING,
  ONTARIO_TAX_CONFIG,
} from "./ontario";

export const YEAR = "2025";

export const ONTARIO_CONFIG: TaxYearProvinceConfig = {
  year: YEAR,
  province: "ontario",
  federal: FEDERAL_TAX_CONFIG,
  provincial: ONTARIO_TAX_CONFIG,
  spending: {
    federal: FEDERAL_SPENDING,
    provincial: ONTARIO_SPENDING,
    federalTransferName: ONTARIO_FEDERAL_TRANSFER_NAME,
  },
};

export const ALBERTA_CONFIG: TaxYearProvinceConfig = {
  year: YEAR,
  province: "alberta",
  federal: FEDERAL_TAX_CONFIG,
  provincial: ALBERTA_TAX_CONFIG,
  spending: {
    federal: FEDERAL_SPENDING,
    provincial: ALBERTA_SPENDING,
    federalTransferName: ALBERTA_FEDERAL_TRANSFER_NAME,
  },
};

// Re-export individual configs for direct access
export {
  ALBERTA_FEDERAL_TRANSFER_NAME,
  ALBERTA_SPENDING,
  ALBERTA_TAX_CONFIG,
} from "./alberta";
export { FEDERAL_SPENDING, FEDERAL_TAX_CONFIG } from "./federal";
export {
  ONTARIO_FEDERAL_TRANSFER_NAME,
  ONTARIO_SPENDING,
  ONTARIO_TAX_CONFIG,
} from "./ontario";
