export type Channel = {
	active: boolean;
	remote_pubkey: string;
	channel_point: string;
	chan_id: string;
	capacity: string;
	local_balance: string;
	remote_balance: string;
	commit_fee: string;
	commit_weight: string;
	fee_per_kw: string;
	unsettled_balance: string;
	total_satoshis_sent: string;
	total_satoshis_received: string;
	num_updates: string;
	pending_htlcs: HTLC[];
	csv_delay: number;
	private: boolean;
	initiator: boolean;
	chan_status_flags: string;
	local_chan_reserve_sat: string;
	remote_chan_reserve_sat: string;
	static_remote_key: boolean;
	commitment_type: CommitmentType;
	lifetime: string;
	uptime: string;
	close_address: string;
	push_amount_sat: string;
	thaw_height: number;
	local_constraints: ChannelConstraints;
	remote_constraints: ChannelConstraints;
	alias_scids: string[];
	zero_conf: boolean;
	zero_conf_confirmed_scid: string;
	peer_alias: string;
	peer_scid_alias: string;
	memo: string;
};

type HTLC = {
	// TODO: Define HTLC properties
};

type CommitmentType = 'string'; // Define the actual possible values

export type ChannelConstraints = {
	csv_delay: number;
	chan_reserve_sat: string;
	dust_limit_sat: string;
	max_pending_amt_msat: string;
	min_htlc_msat: string;
	max_accepted_htlcs: number;
};

export type ListChannelsResponse = { channels: Channel[] };

export type GetInfoResponse = {
	version: string;
	commit_hash: string;
	identity_pubkey: string;
	alias: string;
	color: string;
	num_pending_channels: number;
	num_active_channels: number;
	num_inactive_channels: number;
	num_peers: number;
	block_height: number;
	block_hash: string;
	best_header_timestamp: string;
	synced_to_chain: boolean;
	synced_to_graph: boolean;
	testnet: boolean;
	chains?: {
		chain: string;
		network: Network;
	}[];
	uris: string[];
	features: {
		[key: string]: {
			name: string;
			is_required: boolean;
			is_known: boolean;
		};
	};
	require_htlc_interceptor: boolean;
	store_final_htlc_resolutions: boolean;
};

export type WalletBalanceResponse = {
	total_balance: string;
	confirmed_balance: string;
	unconfirmed_balance: string;
	locked_balance: string;
	reserved_balance_anchor_chan: string;
	account_balance: unknown;
};

export type CreateInvoiceResponse = {
	r_hash: string;
	payment_request: string;
	add_index: string;
};

export type ListInvoicesResponse = {
	invoices: Invoice[];
};

export type Invoice = {
	memo: string;
	receipt: string;
	r_preimage: string;
	r_hash: string;
	value: string;
	settled: boolean;
	creation_date: string;
	settle_date: string;
	payment_request: string;
	description_hash: string;
	expiry: string;
	fallback_addr: string;
	cltv_expiry: string;
	route_hints: string[];
	private: boolean;
	add_index: string;
	settle_index: string;
	amt_paid: string;
	amt_paid_sat: string;
	amt_paid_msat: string;
	state: string;
	htlcs: HTLC[];
};

export type NewAddressResponse = {
	address: string;
};

export enum Network {
	MAINNET = 'mainnet',
	TESTNET = 'testnet',
	SIGNET = 'signet'
}
