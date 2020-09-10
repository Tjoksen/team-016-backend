const express =require('express');
const router=express.Router();
const {create,categoryById,read,updateCategory,deleteCategory,list}=require('../controllers/category');
const {requireSignin,isAuth,isAdmin}=require('../controllers/auth');
const {userById}=require('../controllers/user');

router.get('/categories',list);
router.get('/category/:categoryId',read);
router.post('/category/create/:userId',requireSignin,isAuth,isAdmin,create);
router.put('/category/:categoryId/:userId',requireSignin,isAuth,isAdmin,updateCategory);
router.delete('/category/:categoryId/:userId',requireSignin,isAuth,isAdmin,deleteCategory);


router.param('categoryId',categoryById);
router.param('userId',userById);

  module.exports=router;