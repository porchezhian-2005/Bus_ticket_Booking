import Route from '../models/Route.js'; 

export const createRoute = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized as an admin." });
    }

    const { source, destination, stopPoints } = req.body;

    const existingRoute = await Route.findOne({ source, destination });
    if (existingRoute) {
      return res.status(400).json({ message: "This route already exists." });
    }

    const newRoute = await Route.create({
      source,
      destination,
      stopPoints: stopPoints || [],
      createdBy: req.user._id, 
    });

    res.status(201).json({
      message: "Route created successfully",
      route: newRoute,
    });

  } catch (err) {
    console.error("Error creating route:", err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};
