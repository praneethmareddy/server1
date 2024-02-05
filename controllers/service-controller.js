const Service = require("../models/service-model");

const services = async (req, res) => {
  try {
    const response = await Service.find();

    if (!response || response.length === 0) {
      // Handle the case where no document was found
      return res.status(404).json({ msg: "No service found" });
    }

    return res.status(200).json({ msg: response });
  } catch (error) {
    console.log(`Error from the server: ${error}`);
    // Handle other potential errors here
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = services;
