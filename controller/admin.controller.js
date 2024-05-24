const Users = require('../model/auth.model.user');
const Product = require('../model/admin.model');
const jwt = require('jsonwebtoken');

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
      const {name,description,images,quantity,price,category,owner_id} = req.body;
      let product = Product({name,description,images,quantity,price,category,owner_id});
      product = await product.save();
      res.json({product});
   }catch(error){
    console.log("comming to catch in admin controller");
    res.status(500).json({error : error.message});
   }
}


exports.get_products = async (req, res) => {
   try {
      console.log("insode get products");
      let products = await Product.find({ owner_id: req.owner_id });
      console.log(`the products ${products}`);
      return res.json({ products });
   } catch (error) {
      console.log("coming to catch in admin controller");
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
}




