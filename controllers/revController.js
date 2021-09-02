const Express = require('express');
const router = Express.Router();
let validateJWT = require('../middleware/validate-jwt');
const { RevModel } = require('../models');

router.post('/create', validateJWT, async (req, res) => {
  const { title, date, entry } = req.body.rev;
  const { id } = req.user.id;
  const revEntry = {
    title,
    date,
    entry,
    owner: id
  }
  try {
    const newRev = await RevModel.create(revEntry);
    res.status(200).json(newRev);
  } catch (err) {
    res.status(500).json({ error: err });
    RevModel.create(revEntry)
  }
});


router.get('/all', async (req, res) => {
  try {
    const reviews = await RevModel.findAll();
    res.status(200).json(reviews);
  } catch(err) {
    res.status(500).json({ error: err })
  }
});


router.get('/mine', validateJWT, async (req, res) => {
  let { id } = req.user;
  try {
    const userRev = await RevModel.findAll({
      where: {
        owner: id
      }
    });
    res.status(200).json(userRev);
  } catch (err) {
    res.status(500).json({ error: err })
  }
});


router.put('/update/:id', validateJWT, async (req, res) => {
  const { title, date, entry} = req.body;
  const revId = req.params.id;
  const userId = req.user.id;

  const query = {
    where: {
      id: revId,
      owner: userId
    }
  };

  const updatedRev = {
    title: title,
    date: date,
    entry: entry
  };

  try {
    const update = await RevModel.update(updatedRev, query);
    res.status(200).json(update);
  } catch (err) {
    res.status(500).json({ error: err })
  }
});


router.delete('/delete/:id', validateJWT, async (req, res) => {
  const ownerId = req.user.id;
  const revId = req.params.id;

  try {
    const query = {
      where: {
        id: revId,
        owner: ownerId
      }
    };
    await RevModel.destroy(query);
    res.status(200).json({message: 'Review Deleted'})
  } catch (err) {
    res.status(500).json({error: err})
  }
})

modult.exports = router;