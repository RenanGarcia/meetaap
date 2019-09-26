import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    try {
      const meetup = await Meetup.create(req.body);

      return res.json(meetup);
    } catch (err) {
      return res.status(500).json({ error: err.message || 'wtf!?' });
    }
  }
}

export default new MeetupController();
