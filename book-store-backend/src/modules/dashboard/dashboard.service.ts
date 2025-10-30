// src/modules/dashboard/dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
import { Category } from '../category/entities/category.entity';
import { DashboardStatsDto, SalesOverTimeDto, CategorySalesDto } from './dto/dashboard-stats.dto';
import { subMonths, format, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getDashboardStats(): Promise<DashboardStatsDto> {
    const totalUsers = await this.userRepository.count();
    const totalProducts = await this.productRepository.count();
    const totalOrders = await this.orderRepository.count();

    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalRevenue')
      .where('order.status = :status', { status: 'Completed' })
      .getRawOne();

    const totalRevenue = parseFloat(revenueResult?.totalRevenue) || 0;

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    };
  }

  async getSalesOverTime(): Promise<SalesOverTimeDto[]> {
    const numberOfMonths = 6;
    const endDate = new Date();
    const startDate = startOfMonth(subMonths(endDate, numberOfMonths - 1));

    const monthYearFunction = `TO_CHAR(order.orderDate, 'YYYY-MM')`;

    const salesDataRaw = await this.orderRepository
      .createQueryBuilder('order')
      .select(monthYearFunction, 'month')
      .addSelect('SUM(order.totalAmount)', 'sales')
      .where('order.orderDate >= :startDate', { startDate })
      .andWhere('order.orderDate <= :endDate', { endDate })
      .andWhere('order.status = :status', { status: 'Completed' })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    const salesDataByMonth: { [key: string]: number } = {};
    salesDataRaw.forEach((item) => {
        if (item.month) {
             salesDataByMonth[item.month] = parseFloat(item.sales) || 0;
        }
    });

    const monthsInInterval = eachMonthOfInterval({ start: startDate, end: endDate });

    const filledSalesData: SalesOverTimeDto[] = monthsInInterval.map((monthDate) => {
        const monthString = format(monthDate, 'yyyy-MM');
        const monthLabel = format(monthDate, 'MMM');

        return {
            date: monthLabel,
            sales: salesDataByMonth[monthString] || 0,
        };
    });


    return filledSalesData;
  }

  async getSalesByCategory(): Promise<CategorySalesDto[]> {
      const salesByCategoryRaw = await this.orderItemRepository
          .createQueryBuilder('orderItem')
          .innerJoin('orderItem.order', 'order') 
          .innerJoin('orderItem.product', 'product')
          .innerJoin('product.book', 'book') 
          .innerJoin('book.categories', 'category') 
          .select('category.name', 'name') 
          .addSelect('SUM(orderItem.price)', 'totalSales') 
          .where('order.status = :status', { status: 'Completed' })
          .groupBy('category.name')
          .orderBy('"totalSales"', 'DESC')
          .getRawMany(); 

      const totalOverallSales = salesByCategoryRaw.reduce((sum, item) => sum + (parseFloat(item.totalSales) || 0), 0);

      if (totalOverallSales === 0) {
          return [];
      }


      const topCategories = salesByCategoryRaw.slice(0, 4);
      const otherCategoriesSales = salesByCategoryRaw.slice(4).reduce((sum, item) => sum + (parseFloat(item.totalSales) || 0), 0);

      const result: CategorySalesDto[] = topCategories.map(item => ({
          name: item.name,
          value: parseFloat(((parseFloat(item.totalSales) / totalOverallSales) * 100).toFixed(1)), // Tính % và làm tròn 1 chữ số thập phân
      }));


      if (otherCategoriesSales > 0) {
          result.push({
              name: 'Others',
              value: parseFloat(((otherCategoriesSales / totalOverallSales) * 100).toFixed(1)),
          });
      }

     
      const currentTotalPercentage = result.reduce((sum, item) => sum + item.value, 0);
      const difference = 100 - currentTotalPercentage;
      if (result.length > 0 && Math.abs(difference) > 0.01) { 
          result[result.length - 1].value = parseFloat((result[result.length - 1].value + difference).toFixed(1));
          if (result[result.length-1].value < 0) result[result.length-1].value = 0;
      }


      return result.map(item => CategorySalesDto.fromEntity(item)); 
  }
}