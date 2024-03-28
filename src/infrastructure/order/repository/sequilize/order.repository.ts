import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import { Op } from "sequelize";
import OrderItem from "../../../../domain/checkout/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface{

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    entity.items.forEach(async item => {
      var itemDb = await OrderItemModel.findOne({ where: {id: item.id} });
      if(!itemDb) {
        OrderItemModel.create({
          id: item.id,
          product_id: item.productId,
          order_id: entity.id,
          quantity: item.quantity,
          name: item.name,
          price: item.price
        })
      }
    });

    const existingItemIds = entity.items.map(item => item.id);
    await OrderItemModel.destroy({
      where: {
        order_id: entity.id,
        id: { [Op.notIn]: existingItemIds }
      }
    });

    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Order> {
    let orderModel;

    try {
      orderModel = await OrderModel.findOne(
      { 
        where: { id: id },
        include: [{model: OrderItemModel}],
        rejectOnEmpty: true
      });
    } catch (error) {
      throw new Error("Order not found");
    };

    const orderItems: OrderItem[] = [];
    orderModel.items.forEach(item => {
      orderItems.push(new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));
    });

    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }

  async findAll(): Promise<Order[]> {
    throw new Error("Method not implemented.");
  }
}
