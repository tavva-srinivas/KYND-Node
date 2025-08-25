const Users = require('../model/auth.model.user');
const Order = require('../model/order.model');
const Product = require('../model/product.model');
const DietPlan = require('../model/dietPlan.model');


const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose'); 
const { ObjectId } = require('mongodb');

// for check_product there is a middleware
exports.check_product =  async(req,res,next) => {
   try{
      

      if (!req.owner_id) {
         return res.status(401).json({ msg: "Owner ID is missing" });
     }
      
       // i feel like this is optional
       const user = await Users.findById(req.owner_id);

       ////actually i think no need of this if condition already they come to this page if they are admin------------------------------------------------------
       if( user.type != "admin" ){
           return res.status(401).json({msg : "You ar not a admin!"});
         }

      // to get the product name
       const {name} = req.body;
       const query = { owner_id : req.owner_id, name: name };
       // by doing exec we get only the document instead of unessasary things insid """product""" variable
       const product = await Product.findOne(query).exec();
       if (product) {
           return res.status(409).json({msg : "Product already exsists"});
       }else{
           return res.sendStatus(200);
       }

   }catch(error){
       console.log(`error in admin controller.js check product ${error}`);
       res.status(500).json({error : error.message});

   }
}


exports.add_product = async (req,res,next) => {
   try{
      console.log("coming to the admin controller");
      const {name,description,images,quantity,price,category,owner_id,calories,carbs,protein,fat,rating,items} = req.body;
      let product = Product({name,description,images,quantity,price,category,owner_id,calories,carbs,protein,fat,rating,items});
      product = await product.save();
      res.json({product});
   }catch(error){
    console.log("comming to catch in admin controller");
    res.status(500).json({error : error.message});
   }
}


exports.get_products = async (req, res) => {
   try {
      //     const objectIds = productIds.map(id => new ObjectId(String(id)));
 


      console.log("insode get products");
      const owner_id =  new ObjectId(req.owner_id);
      console.log(`products  : ${owner_id}`);
      let products = await Product.find({ owner_id});
      console.log(`the products ${products.length}`);
      return res.json({ products });
   } catch (error) {
      console.log(`coming to catch in admin controller a ${error}`);
      res.status(500).json({ error: error.message });
   }
}



exports.delete_product = async (req, res) => {
   try{
      console.log("hello");
      const {_id}  = req.body;
      console.log(req.owner_id);
      console.log(`the id ${_id}`);

      let product_found = await Product.findOneAndDelete({_id : _id,owner_id:req.owner_id});
      console.log(product_found)
      if (!product_found) {
         return res.status(403).json({ error: "Cannot delete item"});
       }
       res.json({msg: 'Product deleted successfully'});

   }catch (error) {
      console.log("coming to catch in admin controller delete product");
      res.status(500).json({ error: error.message });
   }
};




// Get all active orders for admin/chef
exports.get_active_orders = async (req, res) => {
  try {
    const today = new Date();

    // Step 1: Fetch all active orders (products or meal plans)
    const activeOrders = await Order.find({
      startDate: { $lte: today },
      endDate: { $gte: today }
    })
      .populate({
        path: "customer_id",
        select: "name preferences email"
      })
      .populate({
        path: "productId",
        populate: {
          path: "items",       // Only applies if mealPlan
          model: "Product",
          select: "name category price"
        }
      });

    // Step 2: Group orders by date
    const groupedOrders = {};

    activeOrders.forEach(order => {
      const start = new Date(order.startDate);
      const end = new Date(order.endDate);

      // Expand each day between startDate and endDate
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split("T")[0]; // yyyy-mm-dd
        if (!groupedOrders[dateKey]) groupedOrders[dateKey] = [];

        let productsToCook = [];

        if (order.type === "product") {
          // Single product order → full product details
          productsToCook.push({
            name: order.productId.name,
            category: order.productId.category,
            quantity: order.quantity || 1
          });
        } else if (order.type === "mealPlan") {
          // Meal plan → expand all items in the plan for this day
          order.productId.items.forEach(prod => {
            productsToCook.push({
              name: prod.name,
              category: prod.category,
              quantity: 1 // or compute based on plan specifics
            });
          });
        }

        groupedOrders[dateKey].push({
          customer: {
            _id: order.customer_id._id,
            name: order.customer_id.name,
            preferences: order.customer_id.preferences
          },
          time: order.time,
          products: productsToCook
        });
      }
    });

    // Optional: convert grouped object to list for frontend
    const response = Object.entries(groupedOrders).map(([date, orders]) => ({
      date,
      orders
    }));

    res.json({ groupedOrders: response });
  } catch (err) {
    console.error("Error in get_active_orders:", err);
    res.status(500).json({ error: err.message });
  }
};



exports.check_dietplan = async (req, res, next) => {
  try {
    if (!req.owner_id) {
      return res.status(401).json({ msg: "Owner ID is missing" });
    }

    // Optional: verify user type
    const user = await Users.findById(req.owner_id);
    if (user.type !== "admin") {
      return res.status(401).json({ msg: "You are not an admin!" });
    }

    // Get meal_name from request
    const { meal_name } = req.body;
    if (!meal_name) return res.status(400).json({ msg: "Meal name is required" });

    // Check if a diet plan with the same meal_name exists
    const plan = await DietPlan.findOne({ meal_name }).exec();
    if (plan) {
      return res.status(409).json({ msg: "Diet plan already exists" });
    } else {
      return res.sendStatus(200);
    }
  } catch (error) {
    console.error(`Error in check_dietplan: ${error}`);
    res.status(500).json({ error: error.message });
  }
};



exports.createPlan = async (req, res) => {
  try {
    const { meal_name, foodtype, images, cost, description, items, rating } = req.body;

    // Basic validation
    if (!meal_name || !foodtype || !description || !items || items.length === 0) {
      return res.status(400).json({ error: "Meal name, foodtype, description, and items are required" });
    }

    // Create new diet plan
    const plan = new DietPlan({
      meal_name,
      foodtype,
      images,
      cost,
      description,
      items,
      rating,
    });

    // Save to DB
    await plan.save();

    res.status(201).json({ message: "Diet plan created successfully", plan });
  } catch (err) {
    console.error("Error creating diet plan:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.delete_dietplan = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!req.owner_id) {
      return res.status(401).json({ msg: "Owner ID is missing" });
    }

    const plan_found = await DietPlan.findOneAndDelete({ _id: _id, owner_id: req.owner_id });
    if (!plan_found) {
      return res.status(403).json({ error: "Cannot delete diet plan" });
    }

    res.json({ msg: "Diet plan deleted successfully" });
  } catch (error) {
    console.error("Error in delete_dietplan:", error);
    res.status(500).json({ error: error.message });
  }
};




