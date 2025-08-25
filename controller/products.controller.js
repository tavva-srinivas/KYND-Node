const Users = require('../model/auth.model.user');
const Product = require('../model/product.model');
const jwt = require('jsonwebtoken');
// const mysqlConnection = require('../config_db/mysql');
const { ObjectId } = require('mongodb');

exports.get_category_prod  = async(req,res) => {
    try{
        // res.query.category
        console.log(`${req.query.category}`);
        const products = await Product.find({category : req.query.category});
        console.log(products);
        return res.json({products});
    }
    catch(error){
        console.log(`error in prod controller category prod ${error}`);
        return res.status(500).json({error : error.message});
    }   
}

exports.get_search_prod = async(req,res) => {
    try{
        console.log(`log ${req.params.name}`);
        // if(req.params.name){
            const products = await Product.find({
                // regex used to search with partial names
                name : { $regex : req.params.name, $options: "i"},
            },
            // second feild tells which params to send
            {
                name : 1,
                _id : 1
            }
        );      
            console.log(products);
            return res.json({products}); 
        
    }catch(error){
        console.log(`error in prod controller get_search prod ${error}`);
        return res.status(500).json({error : error.message});
    }
}


// exports.get_trending_prod = async(_,res) => {
//     try{
//         console.log("in the else");
//             mysqlConnection.query('SELECT * FROM trending_products LIMIT 5', (err,products) => {
//                 if (err) {
//                   console.error('Error fetching products:', err);
//                   return res.status(500).send('Error fetching products');
//                 }
//                 return res.json({products});
//               });
//     }catch(error){
//         console.log(`error in prod controller get_trending prod ${error}`);
//         return res.status(500).json({error : error.message});
//     }
// }


exports.get_meal_products = async (req, res) => {
    try {
        const productIds = req.query.product_ids; // expecting product_ids to be an array of strings
        console.log(`Product IDs: ${productIds}`);

        
    // let products = [];
    //     //Fetch each product individually and append to the products array
    //     for (const id of productIds) {
    //         const product = await Product.find({_id:new ObjectId(String(id))});
    //         if (product) {
    //             products.push(product);
    //         }
    //     }
    const objectIds = productIds.map(id => new ObjectId(String(id)));
    const products = await Product.find({ _id: { $in: objectIds } });
        console.log(products);
        return res.json({ products });
    } catch (error) {
        console.log(`Error in product controller: ${error}`);
        return res.status(500).json({ error: error.message });
    }
};