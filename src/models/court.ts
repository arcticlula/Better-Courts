export interface ICourt {
    club_id: string;
    club_name: string;
    id: string;
    name: string;
    booking_calendar_length: string;
    roof: string;
    surface: string;
    address: string;
    lat: string;
    lng: string;
    phone: string;
    slots: ISlot[];
}

export interface ISlot {
    id: string;
    court_id: string;
    start: string;
    end: string;
    date: string;
    locked: boolean;
    status: string;
}

export class Court {
    club_id: number;
    club_name: string;
    court_id: number;
    court_name: string;
    booking_calendar_length: number;
    roof: number;
    surface: string;
    address: string;
    lat: string;
    lng: string;
    phone: string;
    slots: ISlot[];
    constructor(court: ICourt) {
        this.club_id = parseInt(court.club_id, 10);
        this.club_name = court.club_name;
        this.court_id = parseInt(court.id, 10);
        this.court_name = court.name;
        this.booking_calendar_length = parseInt(court.booking_calendar_length, 10);;
        this.roof = parseInt(court.roof, 10);
        this.surface = court.surface;
        this.address = court.address;
        this.lat = court.lat;
        this.lng = court.lng;
        this.phone = court.phone;
        this.slots = court.slots;
    }
}

export const UrbanSportsAll = [
    { id: 8, name: 'Top-padel Fluvial' },
    { id: 79, name: 'Top-padel Industrial' },
    { id: 462, name: 'Top-padel Quinta do Fojo' },
    { id: 26, name: 'Quinta de Monserrate Sport - Parque da Cidade' },
    { id: 93, name: 'Quinta de Monserrate Sport - Indoor' },
    { id: 54, name: 'Quinta de Monserrate Sport - Clube' },
    { id: 401, name: 'Norte Padel' },
    { id: 492, name: 'Maia Padel' },
    { id: 247, name: 'PadeLovers Matosinhos' },
    { id: 372, name: 'Pure Sports - Escola Francisco Torrinha' },
    { id: 246, name: 'Mar Padel' },
    { id: 230, name: 'Total Padel' },
    { id: 365, name: 'Ginásio Champion Criterion' },
    { id: 77, name: 'Grupo Desportivo Banco Pinto e Sotto Mayor' },
    { id: 470, name: 'Parque da Aguda' },
    { id: 521, name: 'Trofa Padel' },
    { id: 473, name: 'Padel Pedra' },
    { id: 500, name: 'ProPadel' }
] //missing quinta monserrate gaia

export const UrbanSports = [
    { id: 8, name: 'Top-padel Fluvial' },
    { id: 79, name: 'Top-padel Industrial' },
    { id: 462, name: 'Top-padel Quinta do Fojo' },
    { id: 26, name: 'Quinta de Monserrate Sport - Parque da Cidade' },
    { id: 93, name: 'Quinta de Monserrate Sport - Indoor' },
    { id: 54, name: 'Quinta de Monserrate Sport - Clube' },
    { id: 401, name: 'Norte Padel' },
    { id: 492, name: 'Maia Padel' },
    { id: 247, name: 'PadeLovers Matosinhos' },
    { id: 372, name: 'Pure Sports - Escola Francisco Torrinha' },
    { id: 246, name: 'Mar Padel' }
]