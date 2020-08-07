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