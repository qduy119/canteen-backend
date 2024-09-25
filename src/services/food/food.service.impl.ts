import { Op } from 'sequelize';
import { Item, OrderItem, Review, User } from '@/databases/models';
import sequelize from '@/databases/connection';
import { INodemailerService } from '../nodemailer/nodemailer.service';
import { IFoodService } from './food.service';
import { ItemCreateDto } from '@/dto/item/item-create.dto';
import { ItemUpdateDto } from '@/dto/item/item-update.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '@/container/types';

@injectable()
export default class ItemServiceImpl implements IFoodService {
  constructor(
    @inject(TYPES.NodemailerService)
    private readonly nodemailerService: INodemailerService
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
    const data = await Item.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
                            SELECT COUNT (*)
                            FROM OrderItem AS orderitem 
                            JOIN \`Order\` AS \`order\` 
                            ON orderitem.orderId = \`order\`.id
                            WHERE \`order\`.status = "Success" AND orderitem.itemId = item.id
                        )`),
            'soldQuantity'
          ]
        ]
      },
      having: sequelize.literal('soldQuantity > 0'),
      order: [[sequelize.literal('soldQuantity'), 'DESC']],
      limit: 5
    });
    return data;
  }
  async getById(id: number) {
    const data = await Item.findByPk(id);
    const reviews = await Review.findAll({
      include: [
        {
          model: OrderItem,
          where: {
            itemId: id
          }
        },
        {
          model: User,
          as: 'user'
        }
      ],
      order: [['createAt', 'DESC']]
    });
    return { data, reviews };
  }
  async create(payload: ItemCreateDto) {
    const { isSendNotification, ...rest } = payload;
    const item = await Item.create(rest);
    if (isSendNotification) {
      const emails = await User.findAll({
        where: {
          role: {
            [Op.ne]: 'Admin'
          }
        },
        attributes: ['email'],
        raw: true
      });
      const emailStrings = emails.map((item) => item.email).join(', ');
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
        to: emailStrings
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
