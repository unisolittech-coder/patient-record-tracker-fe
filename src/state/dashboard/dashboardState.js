import { atom } from "recoil";
import { createPersistedAtom } from "../recoilConfig";

export const dashboardStatsDataAtom = atom(createPersistedAtom("dashboardStatsDataKey", []));

export const registrationChartDataAtom = atom(createPersistedAtom("registrationChartDataKey", []));
export const genderDistributionDataAtom = atom(createPersistedAtom("genderDistributionDataKey", []));