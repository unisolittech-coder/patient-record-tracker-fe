const parseNumber = value => {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    const normalized = String(value ?? "").trim();
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(normalized)) {
        return null;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
};

export default function isResultOutOfRange(result, range, isAbnormal = false, abnormalFlag = "") {
    if (isAbnormal || /^(?:H|L|HH|LL|HIGH|LOW|ABNORMAL)$/i.test(String(abnormalFlag || "").trim())) {
        return true;
    }

    const value = parseNumber(result);
    const normalizedRange = String(range ?? "").trim();
    if (value === null || !normalizedRange) return false;

    const bound = "[+-]?(?:\\d+\\.?\\d*|\\.\\d+)(?:e[+-]?\\d+)?";
    const inequalityMatch = normalizedRange.match(new RegExp(`^(<=|>=|<|>|≤|≥)\\s*(${bound})$`, "i"));
    if (inequalityMatch) {
        const limit = Number(inequalityMatch[2]);
        switch (inequalityMatch[1]) {
            case "<":
                return value >= limit;
            case "≤":
            case "<=":
                return value > limit;
            case ">":
                return value <= limit;
            case "≥":
            case ">=":
                return value < limit;
            default:
                return false;
        }
    }

    const intervalMatch = normalizedRange.match(
        new RegExp(`^\\s*(${bound})\\s*(?:-|–|—|to)\\s*(${bound})\\s*$`, "i")
    );
    if (intervalMatch) {
        const firstBound = Number(intervalMatch[1]);
        const secondBound = Number(intervalMatch[2]);
        const minimum = Math.min(firstBound, secondBound);
        const maximum = Math.max(firstBound, secondBound);
        return value < minimum || value > maximum;
    }

    const exactBound = parseNumber(normalizedRange);
    return exactBound !== null && value !== exactBound;
}
