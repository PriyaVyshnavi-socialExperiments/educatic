export interface State {
    Cities: string[];
    StateName: string;
}

export interface Country {
    States: State[];
    CountryName: string;
}

export interface Countries {
    Countries: Country[];
}

export interface CountryStateCity {
    Countries: Country[];
    States: State[];
    Cities: string[];
}