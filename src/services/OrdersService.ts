import { IOrder } from '@/entities/IOrder';
import { HttpClient } from './HttpClient';

export class OrdersService {
  static async getOrders() {

    const { data } = await HttpClient.get<{ orders: IOrder[] }>('/orders');

    return data.orders;
  }
}
