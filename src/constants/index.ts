export const CHANNEL_MAP = {
  "36ef3d8a-400e-4c46-b1b7-2729162b47c4": {
    "eline-performance": "ch_001",
    "eline-traffic": "ch_002",
    "ut-performance": "ch_003",
  },

  "c3d4e5f6-90d4-44ab-8d8c-3191266300fa": {
    "eline-performance": "ch_004",
    "eline-traffic": "ch_005",
    "ut-performance": "ch_006",
  },

  "b8c9d0e1-1528-435e-b5af-5f67d8b64d3f": {
    "eline-performance": "ch_007",
    "eline-traffic": "ch_008",
    "ut-performance": "ch_009",
  },
} as const;

export type TabKey =
  | "eline-performance"
  | "eline-traffic"
  | "ut-performance";