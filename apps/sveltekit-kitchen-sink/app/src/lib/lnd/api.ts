import type {
  CreateInvoiceResponse,
  GetInfoResponse,
  ListChannelsResponse,
  ListInvoicesResponse,
  NewAddressResponse,
  WalletBalanceResponse,
} from "./types";

const mimeType = "application/json";

const ADMIN_MACAROON = import.meta.env.VITE_ADMIN_MACAROON;
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

async function lndFetcher<T>(
  path: string,
  postBody?: Record<string, unknown> | null
) {
  const url = `${API_ENDPOINT}${path}`;
  const method = postBody ? "POST" : "GET";
  const init: RequestInit = { method };
  let headers: HeadersInit = {
    "Grpc-Metadata-Macaroon": ADMIN_MACAROON,
    Accept: mimeType,
  };
  if (postBody) {
    init.body = JSON.stringify(postBody);
    headers = { ...headers, "Content-Type": mimeType };
  }

  const result = await window.fetch(url, { ...init, headers });
  const data = await result.json().catch();
  if (!result.ok) {
    throw new Error(
      data?.message || result.statusText || `${path} 😱 ${result.status}`
    );
  }
  return data as T;
}

export function lndGetWalletBalance() {
  return lndFetcher<WalletBalanceResponse>("/v1/balance/blockchain");
}

export function lndGetInfo() {
  return lndFetcher<GetInfoResponse>("/v1/getinfo");
}

export function lndListChannels() {
  return lndFetcher<ListChannelsResponse>("/v1/channels");
}

export function lndListInvoices() {
  return lndFetcher<ListInvoicesResponse>("/v1/invoices");
}

export function lndCreateInvoice(amount: number, memo: string) {
  return lndFetcher<CreateInvoiceResponse>("/v1/invoices", {
    value: amount,
    memo,
  });
}

export function lndNewAddress() {
  return lndFetcher<NewAddressResponse>("/v1/newaddress");
}
