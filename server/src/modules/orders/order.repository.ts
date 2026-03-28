import { FilterQuery } from 'mongoose';
import { OrderModel } from './order.schema';
import { IOrder } from './order.entity';

export class OrderRepository {
  async create(data: Partial<IOrder>): Promise<IOrder> {
    const order = new OrderModel(data);
    return order.save();
  }

  async findById(id: string): Promise<IOrder | null> {
    return OrderModel.findById(id)
      .populate('user', 'name phoneNumber')
      .populate('items.product', 'name slug images price')
      .lean<IOrder>();
  }

  async findByOrderNumber(orderNumber: string): Promise<IOrder | null> {
    return OrderModel.findOne({ orderNumber })
      .populate('user', 'name phoneNumber')
      .populate('items.product', 'name slug images price')
      .lean<IOrder>();
  }

  async findByUser(userId: string, skip: number, limit: number): Promise<{ data: IOrder[]; total: number }> {
    const query: FilterQuery<IOrder> = { user: userId };
    const [data, total] = await Promise.all([
      OrderModel.find(query)
        .populate('items.product', 'name slug images price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IOrder[]>(),
      OrderModel.countDocuments(query),
    ]);
    return { data, total };
  }

  async findAll(
    filter: FilterQuery<IOrder>,
    skip: number,
    limit: number,
  ): Promise<{ data: IOrder[]; total: number }> {
    const [data, total] = await Promise.all([
      OrderModel.find(filter)
        .populate('user', 'name phoneNumber')
        .populate('items.product', 'name slug images price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IOrder[]>(),
      OrderModel.countDocuments(filter),
    ]);
    return { data, total };
  }

  async update(id: string, data: Partial<IOrder>): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(id, { $set: data }, { new: true })
      .populate('user', 'name phoneNumber')
      .populate('items.product', 'name slug images price')
      .lean<IOrder>();
  }

  async countByStatus(): Promise<Record<string, number>> {
    const result = await OrderModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    return result.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {});
  }

  async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const prefix = `FS${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const lastOrder = await OrderModel.findOne(
      { orderNumber: { $regex: `^${prefix}` } },
      { orderNumber: 1 },
      { sort: { orderNumber: -1 } },
    );
    const lastNum = lastOrder
      ? parseInt(lastOrder.orderNumber.slice(prefix.length), 10)
      : 0;
    return `${prefix}${String(lastNum + 1).padStart(5, '0')}`;
  }
}
