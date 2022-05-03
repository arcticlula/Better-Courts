import { Roof } from "./roof";

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
    photos: IPhoto[];
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

export interface IPhoto {
    court_id: string;
    path: string;
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
    photos: IPhoto[];
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
        this.photos = court.photos;
    }
}


export class CourtResult {
    club_name: string;
    court_name: string;
    roof: string;
    startTime: string;
    endTime: string;
    lat: string;
    lng: string;
    phone: string;
    address: string;
    photos: IPhoto[];
    constructor(court: Court, startTime: string, endTime: string) {
        this.club_name = court.club_name;
        this.court_name = court.court_name;
        this.roof = getRoof(court.roof);
        this.startTime = startTime;
        this.endTime = endTime;
        this.lat = court.lat;
        this.lng = court.lng;
        this.phone = court.phone;
        this.address = court.address;
        this.photos = court.photos;
    }
}

const getRoof = (roof: number) => {
    switch (roof) {
        case Roof.Descoberto:
            return "Descoberto";
        case Roof.Coberto:
            return "Coberto";
        case Roof.Indoor:
            return "Indoor";
        default:
            return "";
    }
}
