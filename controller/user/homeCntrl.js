const express = require('express');
const product = require('../../model/admin/productModel')
const categoryModel = require('../../model/admin/categoryModel')
const subCategoryModel = require('../../model/admin/subCategoryModel');
const productModel = require('../../model/admin/productModel');

module.exports = {
    getHome:async(req,res)=>{
        const category = await categoryModel.find()
        const subCategory = await subCategoryModel.find().limit(5)
        res.render('./user/index',{category,subCategory})
    },
    getProductDataFromButtonClick:async(req,res)=>{
        if(req.params.id== 10){
            const fProduct=await productModel.find().limit(16);
           return res.json(fProduct)
        }
        const fProduct=await productModel.find({"subcategory":req.params.id}).limit(16)
        res.json(fProduct)
    }
}