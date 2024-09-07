export interface RelabelerConfig { // cSpell: ignore RelabelerConfig
    pulls: {
        labels: {
            label: {
                name: string;
                add: {
                    when: {
                        statuses?: Record<string, string>;
                        canBeMerged?: boolean;
                        reviewRequestChange?: boolean;
                        notLabeled?: string[];
                        reviewResponseToRequestChange?: boolean;
                        onPush?: boolean;
                        reviewApproved?: boolean;
                    };
                }[];
                remove: {
                    when: {
                        statuses?: Record<string, string>;
                        canBeMerged?: boolean;
                        reviewResponseToRequestChange?: boolean;
                        onPush?: boolean;
                        labeled?: string | string[];
                        reviewApproved?: boolean;
                    };
                }[];
            };
        }[];
    };
}
