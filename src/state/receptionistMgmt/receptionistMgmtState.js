import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const receptionistResAtom = atom(createPersistedAtom("receptionistRes", []));

export const receptionistDetailsAtom = atom(createPersistedAtom("receptionistDetailsKey", null));