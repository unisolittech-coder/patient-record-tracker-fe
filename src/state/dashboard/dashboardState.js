import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const dashboardStatsDataAtom = atom(createPersistedAtom("dashboardStatsDataKey", []));