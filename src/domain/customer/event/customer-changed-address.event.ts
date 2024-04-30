import EventInterface from "../../@shared/event/event.interface";
import Address from "../value-object/address";

export interface CustomerChangedAddressDataInterface {
    customerId: string,
    customerName: string,
    customerAdress: Address 
}

export default class CustomerChangedAddressEvent implements EventInterface {
    dataTimeOccurred: Date;
    eventData: CustomerChangedAddressDataInterface;
    
    constructor(eventData: CustomerChangedAddressDataInterface) {
        this.dataTimeOccurred = new Date();
        this.eventData = eventData;
    }
}