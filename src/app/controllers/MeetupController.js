import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    try {
      const meetups = await Meetup.findAll({
        attributes: { exclude: ['user_id', 'banner_id'] },
        where: { user_id: { [Op.eq]: req.userId } },
        include: [
          {
            model: File,
            as: 'banner',
            attributes: ['id', 'path', 'url'],
          },
        ],
      });

      return res.json(meetups);
    } catch (err) {
      return res.status(500).json({ error: err.message || 'wtf!?' });
    }
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().required(),
        location: Yup.string().required(),
        date: Yup.date().required(),
        banner_id: Yup.number().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(422).json({ error: 'Validation failure.' });
      }

      const parsedDate = parseISO(req.body.date);

      // eslint-disable-next-line eqeqeq
      if (parsedDate == 'Invalid Date') {
        return res.status(422).json({ error: 'Invalid Date.' });
      }

      if (isBefore(parsedDate, new Date())) {
        return res
          .status(422)
          .json({ error: 'Only future dates are accepted.' });
      }

      const meetup = await Meetup.create({ ...req.body, user_id: req.userId });

      return res.json(meetup);
    } catch (err) {
      return res.status(500).json({ error: err.message || 'wtf!?' });
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        title: Yup.string(),
        description: Yup.string(),
        location: Yup.string(),
        date: Yup.date(),
        banner_id: Yup.number(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(422).json({ error: 'Validation fails.' });
      }

      const meetup = await Meetup.findByPk(req.params.id);

      if (!meetup) {
        return res.status(404).json({ error: "This meetup don't exists." });
      }

      if (meetup.user_id !== req.userId) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      const parsedDate = parseISO(req.body.date);
      // eslint-disable-next-line eqeqeq
      if (parsedDate == 'Invalid Date') {
        return res.status(422).json({ error: 'Invalid Date.' });
      }

      if (isBefore(parsedDate, new Date())) {
        return res
          .status(422)
          .json({ error: 'Only future dates are accepted.' });
      }

      await meetup.update(req.body);

      return res.json(meetup);
    } catch (err) {
      return res.status(500).json({ error: err.message || 'wtf!?' });
    }
  }

  async delete(req, res) {
    try {
      const meetup = await Meetup.findByPk(req.params.id);

      if (!meetup) {
        return res.status(404).json({ error: "This meetup don't exists." });
      }

      if (meetup.user_id !== req.userId) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      await meetup.destroy();

      return res.json();
    } catch (err) {
      return res.status(500).json({ error: err.message || 'wtf!?' });
    }
  }
}

export default new MeetupController();
