import { Op, QueryTypes } from 'sequelize';
import { Item, } from '@/databases/models';
import sequelize from '@/databases/connection';
import { INodemailerService } from '../nodemailer/nodemailer.service';
import { IFoodService } from './food.service';
import { IReviewService } from '../review/review.service';
import { IUserService } from '../user/user.service';
import { ItemCreateDto } from '@/dto/item/item-create.dto';
import { ItemUpdateDto } from '@/dto/item/item-update.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/container/types';

@injectable()
export default class ItemServiceImpl implements IFoodService {
  constructor(
    @inject(TYPES.NodemailerService)
    private readonly nodemailerService: INodemailerService,
    @inject(TYPES.ReviewService) 
    private readonly reviewService: IReviewService,
    @inject(TYPES.UserService)
    private readonly userService: IUserService
  ) {}

  async getAll(
    page: number | undefined,
    per_page: number | undefined,
    keyword: string | undefined,
    categoryId: number | undefined
  ) {
    if (page && per_page) {
      type Condition = Record<'name' | 'categoryId', any>;
      const condition: Condition = {} as Condition;
      if (keyword) {
        condition.name = {
          [Op.like]: `%${keyword}%`
        };
      }
      if (categoryId) {
        condition.categoryId = {
          [Op.eq]: categoryId
        };
      }
      const { rows: data, count } = await Item.findAndCountAll({
        where: {
          ...condition
        },
        include: 'category',
        offset: (+page - 1) * +per_page,
        limit: +per_page,
        distinct: true
      });
      const total_pages = Math.ceil(count / +per_page);
      return { data, total_pages };
    } else if (keyword) {
      const data = await Item.findAll({
        where: {
          name: {
            [Op.like]: `%${keyword}%`
          }
        },
        include: 'category'
      });
      return { data };
    }
    const data = await Item.findAll();
    return { data };
  }
  async getTopSales() {
    const query = `
      SELECT "Item".*,
        (SELECT SUM("orderitem".quantity)
          FROM "OrderItem" AS "orderitem"
          JOIN "Order" AS "order"
          ON "orderitem"."orderId" = "order".id
          WHERE "order".status = 'Success' AND "orderitem"."itemId" = "Item".id) AS "soldQuantity"
      FROM "Item"
      WHERE (SELECT SUM("orderitem".quantity)
              FROM "OrderItem" AS "orderitem"
              JOIN "Order" AS "order"
            ON "orderitem"."orderId" = "order".id
            WHERE "order".status = 'Success' AND "orderitem"."itemId" = "Item".id) > 0
            ORDER BY "soldQuantity" DESC
            LIMIT 5;
  `;

  const data = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    model: Item,
    mapToModel: true
  });

  return data;
  }
  async getById(id: number) {
    const data = await Item.findByPk(id);
    const reviews = await this.reviewService.getByItemId(id);
    return { data, reviews };
  }
  async create(payload: ItemCreateDto) {
    const { isSendNotification, ...rest } = payload;
    const item = await Item.create(rest);
    if (isSendNotification) {
      const emails = await this.userService.getAllCustomerEmails();
      const content = `
        <div>
            <h1>${item.name} 🤩</h1>
            <img src="${item.thumbnail}"/>
            <p>Price: ${item.price}</p>
            <p>Discount: ${item.discount}</p>
            <p>Quantity: ${item.stock}</p>
        </div>
    `;
      await this.nodemailerService.send({
        subject: '💥 MYCANTEEN: NEW FOOD 🥪',
        content,
        to: emails
      });
    }
  }
  async update(id: number, payload: ItemUpdateDto) {
    await Item.update(payload, { where: { id } });
  }
  async delete(id: number) {
    await Item.destroy({ where: { id } });
  }
  async modifyQuantity(
    quantityToModify: number,
    itemId: number,
    options?: any
  ) {
    await Item.increment(
      { stock: quantityToModify },
      { where: { id: itemId }, ...options }
    );
  }
}