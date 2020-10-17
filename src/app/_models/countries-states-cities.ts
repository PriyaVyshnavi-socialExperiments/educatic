export interface City {
    id: number;
    name: string;
}

export interface State {
    id: number;
    name: string;
    cities: City[];
}

export interface Country {
    id: number;
    name: string;
    states: State[];
}