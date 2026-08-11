import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const labHeadResAtom = atom(createPersistedAtom("labHeadRes", []));

export const labHeadDetailsAtom = atom(createPersistedAtom("labHeadDetailsKey", null));

export const labHeadLoadingAtom = atom(createPersistedAtom("labHeadLoading", false));

export const labHeadErrorAtom = atom(createPersistedAtom("labHeadError", null));
