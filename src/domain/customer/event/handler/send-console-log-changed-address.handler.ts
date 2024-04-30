import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedAddressEvent from "../customer-changed-address.event";

export default class SendConsoleLogChangedAddress
    implements EventHandlerInterface<CustomerChangedAddressEvent> 
{
    handle(event: CustomerChangedAddressEvent): void {
        console.log(`Endereço do cliente: ${event.eventData.customerId}, ${event.eventData.customerName} ` +
        `alterado para: ${event.eventData.customerAdress}`);
    }
}