
import { create } from "zustand";
import {persist } from 'zustand/middleware'

 const useFormStore = create(
    persist((set, get) => ({
        isHydrated:false,
        current:0,
        name:'',
        desc:'',
        image:[],
        imageurl:'',
        incr:0,
        init:0,
        time:'',
        metauri:'',
        tokenid:null,
        t:'',
        sett: (t) => set({t: t}),
        setbasic: (name, desc) => set({name:name, desc:desc}),
        setimage: (file) => set({image: file}),
        setfinal: (incr, init, time) => set({incr, init, time}),
        reset: () => set({name:'', desc:'',image:[], imageurl:'', incr:0, init:0, time:'',metauri:'',tokenid:null, current:0,t:''}),
        setHydrated: (state) => set({isHydrated: state}),
        setcurrent: (curr) => set({current: curr}),
        uploadimage: (imageuri, metauri, id) => set({imageurl: imageuri, metauri: metauri, tokenid:id})
    }),
    {
        name:'form-state',
        onRehydrateStorage: (state) => {return () => state.setHydrated(true)}
    }
)
)

export default useFormStore