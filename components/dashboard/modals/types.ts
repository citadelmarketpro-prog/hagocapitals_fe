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
