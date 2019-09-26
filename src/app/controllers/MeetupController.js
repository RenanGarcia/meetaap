import * as Yup from 'yup';
import Meetup from '../models/Meetup';

class MeetupController {
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
        return res.status(400).json({ error: 'Validation fails' });
      }

      const meetup = await Meetup.create({ ...req.body, user_id: req.userId });

      return res.json(meetup);
    } catch (err) {
      return res.status(500).json({ error: err.message || 'wtf!?' });
    }
  }
}

export default new MeetupController();
