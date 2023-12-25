const productModel = require("../models/productModel");
const bannerModel = require("../models/bannerModel");
const categoryModel = require("../models/categoryModel");
const offerModal = require("../models/offerModal");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const reviewModal = require("../models/reviewModel");


const loadHome = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    const offers = await offerModal.find({isActive:true,offerType:{$ne:'Referral'},endDate: { $gt: new Date()}})
    const currentDate = new Date();
    console.log(currentDate);
    const ProductData = await productModel.find({}).limit(4);
    const banner = await bannerModel.find({ endDate: { $gt: currentDate } });
    res.render("home", { category,banner,ProductData,offers});
  
  } catch (error) {
    console.log(error.message);
  }
};


const loaadProductListsByCategory = async(req,res)=>{
  try{

    const  {cat_name} = req.params;
    const ProductData = await productModel.find({category:cat_name});
    const offers = await offerModal.find({isActive:true,offerType:{$ne:'Referral'},endDate: { $gt: new Date()}})
    const ProductCount = await productModel.find({category:cat_name}).countDocuments();
    const category = await categoryModel.find({category:cat_name});
    const result = await productModel.aggregate([
  {
    $match: {
      category: cat_name,
    },
  },
  {
    $group: {
      _id: "$brand",
    },
  },
]);

const brands = result.map((entry) => entry._id);


    res.render("productLists",{ProductData,ProductCount,category,cat_name,brands,offers});

  }catch(error){
    console.error(error);
  }
}

const productDetail = async (req, res) => {
  try {
    const {id} = req.params;
    const offers = await offerModal.find({});
    const ProductData = await productModel.findById({_id:id});
    const reviews = await reviewModal.find({product:id}).populate('user');

    console.log(reviews);
    res.render("productDetail",{ProductData,offers,reviews});
  } catch (error) {
    console.log(error.message);
  }
};


const sortProductByUserPreference = async (req, res) => {
  try {
      const { category, sortOption } = req.params;
      const offer = await offerModal.find({
        $or: [
          { offerType: 'Product' }, { offer: category },
        ],
      });     
       const priceDirection = sortOption === "High to Low"?-1:1;

      const products = await productModel
      .find({ category: category })
      .sort({ price: priceDirection }); 

      res.status(200).json({ products,offer });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
};
const filterProductsByUser = async (req, res) => {
  try {
const {subCategory,brand} = req.query;
const selectedSubCategories = subCategory ? subCategory.split(',') : [];
const selectedBrands = brand ? brand.split(',') : [];
const category = req.params.cat_name;

const offer = await offerModal.find({
  $or: [
    { offerType: 'Product' }, { offer: category },
  ],
});     
const ProductData = await productModel.find({
  category: category,
  $or: [
    { sub_Category: { $in: selectedSubCategories } },
    { brand: { $in: selectedBrands } },
  ],

});


const productCount = ProductData.length;


    res.status(200).json({ProductData,productCount,offer});
  } catch (error) {
    console.error(error);
    // Handle errors and send an error response if necessary
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const searchProducts = async(req,res)=>{

  try{
   const {value} = req.query;
   const {cat_name} = req.params;
   const products = await productModel.find({category:cat_name, name: { $regex: value, $options: 'i' } });
   const offer = await offerModal.find({
    $or: [
      { offerType: 'Product' }, { offer: cat_name },
    ],
  });  
   res.status(200).json({products,offer});

  }catch(error){
    console.error(error);
  }
}

const sendEmailNewsLetter = async(req,res)=>{

  try{
      const {email} = req.body;
        const response = await mailchimp.lists.addListMember(process.env.LIST_ID, {
        email_address: email,
        status: "subscribed",
      }).then(response=>{
      res.status(200).json({response})
      });

  }catch(error){
    res.status(400);
    console.error(error);
  }
}

const loadFaqPage = async(req,res)=>{
  try{

    res.render('faq');

  }catch(error){
    console.error(error);
  }
}


const loadAboutUs = async(req,res)=>{
  try{

    res.render('aboutUs');

  }catch(error){
    console.error(error);
  }
}
module.exports = { 
  loadHome,
  productDetail,
  loaadProductListsByCategory,
  sortProductByUserPreference,
  sendEmailNewsLetter,
  filterProductsByUser,
  searchProducts,
  loadFaqPage,
  loadAboutUs

};
