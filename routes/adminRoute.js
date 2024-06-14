const express = require('express');
const admin_route = express();
const nocache = require('nocache');

const session = require('express-session');
const config = require('../config/config');
admin_route.use(session({
    secret:config.sessionSecret,
    saveUninitialized:false,
    resave:false
}));

admin_route.use(nocache());

const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine', 'ejs');
const path = require('path');
admin_route.set('views', path.join(__dirname, '../views/admin'));

const auth = require('../middleware/adminAuth')

const adminController = require("../controllers/adminController");

admin_route.get('/',auth.isLogout,adminController.loadLogin)

admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,adminController.loadDashboard);

admin_route.get('/logout',auth.isLogin,adminController.logout);

admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard);

admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad);

admin_route.post('/new-user',adminController.addUser);

admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad);

admin_route.post('/edit-user',adminController.updateUsers);

admin_route.get('/delete-user',adminController.deleteUser);

admin_route.get('/dashboard-Search',adminController.dashboardSearch);

admin_route.get('*',function(req,res){

    res.redirect('/admin')

})

module.exports =  admin_route;