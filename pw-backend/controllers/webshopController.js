const { Webshop, Scraper } = require("../models");

// Other existing methods ...

exports.createWebshop = async (req, res) => {
  const webshopData = req.body;
  try {
    const webshop = await Webshop.create(webshopData);
    return res.status(201).json({ message: "Webshop created", webshop });
  } catch (error) {
     console.error('Error in createWebshop:', error);
    return res.status(500).json({ message: "Error creating webshop", error });
  }
};

exports.getAllWebshops = async (req, res) => {
  try {
    const webshops = await Webshop.findAll();
    res.status(200).json(webshops);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching webshops', error });
  }
};

exports.updateWebshop = async (req, res) => {
  try {
    const webshopId = req.params.id;
    const webshopData = req.body;

    const webshop = await Webshop.findByPk(webshopId);

    if (!webshop) {
      return res.status(404).send({ message: 'Webshop not found' });
    }

    await webshop.update(webshopData);
    res.status(200).send(webshop);
  } catch (error) {
    console.error('Error updating webshop:', error);
    res.status(500).send({ message: 'Error updating webshop' });
  }
};

exports.deleteWebshop = async (req, res) => {
  const { id } = req.params;
  try {
    await Webshop.destroy({ where: { id } });
    res.status(200).json({ message: 'Webshop deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting webshop', error });
  }
};
