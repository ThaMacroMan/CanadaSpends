// Data fetching functions for First Nations land claims

const BASE_URL = "https://api.buildcanada.com/rest/v1";
const API_KEY = "sb_publishable_nDRd3MFmMdzRsDfAkDPc3g_xWbSiV19";

export interface Claim {
  id: number;
  claimant_bcid: string;
  claimant_name: string;
  band_bcids: string[];
  involved_band_names: string[];
  province: string;
  claim_name: string;
  process_stage: string;
  status: string;
  description: string;
  key_dates: Record<string, string>;
  first_key_date: string | null;
  last_key_date: string | null;
  settlement_amount: number | null;
  settlement_date: string | null;
  tribunal_award: number | null;
  tribunal_award_implementation_date: string | null;
  total_payments: number | null;
}

/**
 * Get all claims for a specific band
 */
export async function getClaimsByBand(bcid: string): Promise<Claim[]> {
  const url = `${BASE_URL}/rpc/get_claims_by_band`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_bcid: bcid }),
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    console.error(
      `Claims API error: ${response.status} ${response.statusText}`,
    );
    return [];
  }

  const data = await response.json();
  return data || [];
}
