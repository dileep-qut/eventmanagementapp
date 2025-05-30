import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '@/user/entities/user.entity';
import { Event } from '@/event/entities/event.entity';
import { Image } from '@/image/entities/image.entity';
import { TicketList } from '@/ticket/entities/ticket-list.entity';
import mongoose from 'mongoose';

import { CategoryEnum } from '@/event/entities/event.entity';

import * as _ from 'lodash';

import * as process from 'node:process';

@Injectable()
export class Initializer implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
    @InjectModel(TicketList.name)
    private readonly ticketListModel: Model<TicketList>,
  ) {}

  async onModuleInit() {
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.SEED_DB === 'TRUE'
    ) {
      await this.cleanDatabase();
      await this.seedDB();
    }
  }

  private async seedDB() {
    // This must be called in order strictly
    await this.createAdminUser();
    await this.seedUsers();
    await this.seedEvents();
  }

  private async cleanDatabase() {
    await this.userModel.deleteMany({});
    await this.eventModel.deleteMany({});
    await this.imageModel.deleteMany({});
    await this.ticketListModel.deleteMany({});
  }

  private async createAdminUser() {
    await this.userModel.create({
      _id: new mongoose.mongo.ObjectId('68210420f639de1251ae31a5'),
      name: 'dev',
      email: 'dev@qut.edu.au',
      password: '123456',
      phone: '0000000000',
    });
  }

  private async seedUsers() {
    for (let i = 0; i < 50; i++) {
      await this.userModel.create({
        name: `User ${i}`,
        email: `user_${i}@qut.edu.au`,
        password: `password${i}`,
        phone: `000000000${i}`,
        university: `University ${i}`,
        address: `Address ${i}`,
      });
    }
  }

  private async seedEvents() {
    const root_user = await this.userModel.findOne({ name: 'dev' });

    const all_users = await this.userModel.find().select('_id');

    for (let i = 0; i < 20; i++) {
      const possible_participants = _.sampleSize(all_users, 10).map(
        (user) => user._id,
      );

      const event = await this.eventModel.create({
        name: `Event ${i}`,
        description: `Description ${i}`,
        location: `Location ${i}`,
        category: _.sample(CategoryEnum),
        creator: root_user!._id,
        participants: possible_participants,
        ticket_available: 1000,
        ticket_price: 15,
        start_time: new Date(2025, 12, 25),
        end_time: new Date(2025, 12, 26),
        speakers: [],
      });

      for (const e of possible_participants) {
        await this.ticketListModel.create({
          event_id: event._id,
          user_id: e,
          checked_in: false,
          transaction_id: `Sample Transaction ID`,
        });
      }
    }
  }
}
