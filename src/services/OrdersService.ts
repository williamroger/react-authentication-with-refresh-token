import { IOrder } from '@/entities/IOrder';
import { HttpClient } from './HttpClient';
import { StorageKeys } from '@/configs/StorageKeys';

export class OrdersService {
  static async getOrders() {
    const accessToken = localStorage.getItem(StorageKeys.accessToken);

    const { data } = await HttpClient.get<{ orders: IOrder[] }>('/orders', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    return data.orders;
  }
}
