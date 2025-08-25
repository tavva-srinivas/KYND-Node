const DietPlan = require('../model/dietPlan.model');

// Get meals by type (veg or non-veg)
exports.get_meals_by_type = async (req, res) => {
    try {
        console.log(req.query.type);
        const meals = await DietPlan.find({ type: req.query.type });
        console.log(meals);
        return res.json({ meals });
    } catch (error) {
        console.log('Error in meal controller get_meals_by_type: ${error}');
        return res.status(500).json({ error: error.message });
    }
}

// Search prod by name
exports.search_meals = async (req, res) => {
    try {
        console.log(req.params.name);
        console.log("start")
        const meals = await DietPlan.find({
            // regex -> regular expression
            // "i" -> tells it will search -> case insensitive
            meal_name: { $regex: req.params.name, $options: "i" }
        }
    );
        console.log(`meals names ${meals.length}`);
        return res.json({ meals });
    } catch (error) {
        console.log(`Error in meal controller search_meals: ${error}`);
        return res.status(500).json({ error: error.message });
    }
}






