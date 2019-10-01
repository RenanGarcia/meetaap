import { isBefore, isSameHour } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    try {
      const { userId } = req;
      const { meetupId } = req.params;
      const requestedMeetup = await Meetup.findByPk(meetupId);

      if (requestedMeetup.user_id === userId) {
        return res
          .status(400)
          .json({ error: "Can't subscribe to you own meetups" });
      }

      if (isBefore(requestedMeetup.date, new Date())) {
        return res.status(400).json({
          error: "You can't subscribe meetups that have already happened",
        });
      }

      const subscribed = await Subscription.findAll({
        where: {
          user_id: userId,
        },
        include: [{ model: Meetup, as: 'meetup' }],
      }).map(({ dataValues }) => dataValues);

      const sameMeetup = subscribed.filter(sub => sub.meetup_id == meetupId);

      if (sameMeetup.length) {
        return res.status(400).json({
          error: 'You can only sign up once in the same meetup',
        });
      }

      const sameHour = subscribed.filter(({ meetup }) =>
        isSameHour(meetup.date, requestedMeetup.date)
      );

      if (sameHour.length) {
        return res.status(400).json({
          error: "Can't join two meetings at the same start time",
        });
      }

      const subscription = Subscription.create({
        meetup_id: meetupId,
        user_id: userId,
      });

      return res.json(subscription);
    } catch (err) {
      return res.status(500).json({ error: err.message || 'wtf!?' });
    }
  }
}

export default new SubscriptionController();
