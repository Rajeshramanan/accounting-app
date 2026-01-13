import { supabase, isCloudEnabled } from './supabaseClient';
import type { Ledger, StockItem, Voucher, BusinessProfile } from '../types';
import { INITIAL_LEDGERS, INITIAL_STOCK, BUSINESS_PROFILE } from '../constants';

// Keys for LocalStorage
const LS_KEYS = {
  LEDGERS: 'accusim_ledgers',
  STOCK: 'accusim_stock',
  VOUCHERS: 'accusim_vouchers',
  PROFILE: 'accusim_profile'
};

export const dataService = {
  
  async getInitialData() {
    if (isCloudEnabled && supabase) {
      try {
        const { data: ledgersData } = await supabase.from('ledgers').select('*');
        const { data: stockData } = await supabase.from('stock').select('*');
        const { data: vouchersData } = await supabase.from('vouchers').select('*');
        const { data: profileData } = await supabase.from('business_profile').select('*');

        // If cloud is empty, return defaults (and maybe seed later)
        // If cloud has data, parse it (assuming we store the object in a 'data' json column or mapped fields)
        // For simplicity in this tutorial, we assume the table structure maps or we store JSON in a 'data' column
        
        // Mapping strategy: tables have (id, data: jsonb)
        const ledgers = ledgersData?.length ? ledgersData.map((row: any) => row.data) : [];
        const stock = stockData?.length ? stockData.map((row: any) => row.data) : [];
        const vouchers = vouchersData?.length ? vouchersData.map((row: any) => row.data) : [];
        const profile = profileData?.length ? profileData[0].data : null;

        if (ledgers.length === 0 && stock.length === 0) {
            console.log("Cloud empty, returning defaults");
            return {
                ledgers: INITIAL_LEDGERS,
                stock: INITIAL_STOCK,
                vouchers: [],
                profile: BUSINESS_PROFILE,
                isCloudEmpty: true
            };
        }

        return {
            ledgers: ledgers as Ledger[],
            stock: stock as StockItem[],
            vouchers: vouchers as Voucher[],
            profile: profile as BusinessProfile || BUSINESS_PROFILE,
            isCloudEmpty: false
        };

      } catch (e) {
        console.error("Cloud fetch failed, falling back to local", e);
      }
    }

    // Fallback: LocalStorage
    const localLedgers = localStorage.getItem(LS_KEYS.LEDGERS);
    const localStock = localStorage.getItem(LS_KEYS.STOCK);
    const localVouchers = localStorage.getItem(LS_KEYS.VOUCHERS);
    const localProfile = localStorage.getItem(LS_KEYS.PROFILE);

    return {
      ledgers: localLedgers ? JSON.parse(localLedgers) : INITIAL_LEDGERS,
      stock: localStock ? JSON.parse(localStock) : INITIAL_STOCK,
      vouchers: localVouchers ? JSON.parse(localVouchers) : [],
      profile: localProfile ? JSON.parse(localProfile) : BUSINESS_PROFILE,
      isCloudEmpty: false
    };
  },

  async seedCloudIfEmpty(ledgers: Ledger[], stock: StockItem[], profile: BusinessProfile) {
      if (!isCloudEnabled || !supabase) return;
      // Simple seeding
      for (const l of ledgers) await supabase.from('ledgers').insert({ id: l.id, data: l });
      for (const s of stock) await supabase.from('stock').insert({ id: s.id, data: s });
      await supabase.from('business_profile').insert({ data: profile });
  },

  async saveVoucher(voucher: Voucher, updatedLedgers: Ledger[], updatedStock: StockItem[]) {
    // 1. Save to LocalStorage immediately (Optimistic UI)
    localStorage.setItem(LS_KEYS.VOUCHERS, JSON.stringify([voucher, ...this.getLocalVouchers()]));
    localStorage.setItem(LS_KEYS.LEDGERS, JSON.stringify(updatedLedgers));
    localStorage.setItem(LS_KEYS.STOCK, JSON.stringify(updatedStock));

    // 2. Sync to Cloud
    if (isCloudEnabled && supabase) {
        await supabase.from('vouchers').insert({ id: voucher.id, data: voucher });
        
        // In a real app, use RPC. Here we just update the specific rows changed.
        // For simplicity in this demo, we upsert the entire changed records
        for (const l of updatedLedgers) {
            await supabase.from('ledgers').upsert({ id: l.id, data: l });
        }
        for (const s of updatedStock) {
            await supabase.from('stock').upsert({ id: s.id, data: s });
        }
    }
  },

  async updateLedger(ledger: Ledger) {
      const all = this.getLocalLedgers();
      const updated = all.map(l => l.id === ledger.id ? ledger : l);
      localStorage.setItem(LS_KEYS.LEDGERS, JSON.stringify(updated));

      if (isCloudEnabled && supabase) {
          await supabase.from('ledgers').upsert({ id: ledger.id, data: ledger });
      }
      return updated;
  },

  async saveProfile(profile: BusinessProfile) {
      localStorage.setItem(LS_KEYS.PROFILE, JSON.stringify(profile));
      if (isCloudEnabled && supabase) {
          // Assuming single row profile, we might need a fixed ID or delete previous
          const { data } = await supabase.from('business_profile').select('id');
          if (data && data.length > 0) {
              await supabase.from('business_profile').update({ data: profile }).eq('id', data[0].id);
          } else {
              await supabase.from('business_profile').insert({ data: profile });
          }
      }
  },

  // Helpers
  getLocalVouchers(): Voucher[] {
      const v = localStorage.getItem(LS_KEYS.VOUCHERS);
      return v ? JSON.parse(v) : [];
  },
  getLocalLedgers(): Ledger[] {
      const l = localStorage.getItem(LS_KEYS.LEDGERS);
      return l ? JSON.parse(l) : INITIAL_LEDGERS;
  }
};