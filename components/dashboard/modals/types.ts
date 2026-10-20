export interface AdminWallet {
  id:           number;
  name:         string;
  name_display: string;
  symbol:       string;
  network:      string;
  address:      string;
  icon_url:     string | null;
  qr_code_url:  string | null;
}

export interface SavedPaymentMethod {
  wallet_id:    number;
  name:         string;
  name_display: string;
  symbol:       string;
  network:      string;
  icon_url:     string | null;
  address:      string;
  has_method:   boolean;
}

export interface StockPosition {
  id: number;
  symbol: string;
  name: string;
  logo_url: string;
  quantity: number;
  original_quantity: number;
  entry_price: number;
  cost_basis: number;
  current_price: number | null;
  current_value: number | null;
  unrealized_pnl: number | null;
  unrealized_pnl_pct: number | null;
  realized_pnl: number;
  status: "open" | "closed";
  opened_at: string;
  closed_at: string | null;
}
