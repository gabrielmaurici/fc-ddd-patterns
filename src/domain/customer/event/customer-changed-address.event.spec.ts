import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import CustomerChangedAdressEvent, { CustomerChangedAddressDataInterface }  from "./customer-changed-address.event"
import Address from "../value-object/address";
import SendConsoleLogChangedAddress from "./handler/send-console-log-changed-address.handler";

describe("customer changed adress event test", () => {
    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLogChangedAddress();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
    
        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);
    
        expect(
          eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
        ).toMatchObject(eventHandler);

        const customer = new Customer("1", "Zézinho");
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.changeAddress(address);

        const customerChangedAdressDataInterface: CustomerChangedAddressDataInterface = {
          customerId: customer.id,
          customerName: customer.name,
          customerAdress: customer.Address
        };
        const customerChangedAdressEvent = new CustomerChangedAdressEvent(customerChangedAdressDataInterface);
        
        eventDispatcher.notify(customerChangedAdressEvent);
    
        expect(spyEventHandler).toHaveBeenCalled();
    });
})