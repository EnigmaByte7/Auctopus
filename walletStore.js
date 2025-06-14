import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useWalletStore = create(
    persist(
        (set, get) => ({
            isHydrated: false,
            address: '',
            isConnected: false,
            balance: 0,
            setHydrated: (status) => set({isHydrated: status}),
            setWallet: (address, isConnected, balance) => set({ address, isConnected, balance }),
        }),
        {
            onRehydrateStorage: (state) => {return () => state.setHydrated(true)},
            name: 'wallet-storage',
        }
    )
)

export default useWalletStore