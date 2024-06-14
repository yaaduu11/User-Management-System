const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const loadLogin = async(req,res)=>{
    try {
        
        res.render('login');

    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});
        if(userData){

            const passwordMatch = await bcrypt.compare(password, userData.password);

            if(passwordMatch){

               if(userData.is_admin === 1){
                   res.render('login',"Email and password is incorrect.");
               }else{
                 req.session.user_id = userData._id;
                 res.redirect("/admin/home");
               }

            }else{
                res.render('login',"Email and password is incorrect.");
            }

        }else{

            res.render('login',"Email and password is incorrect.");
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id});
        res.render('home',{admin:userData});
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/admin')

    } catch (error) {
        console.log(error.message);
    }
}

const adminDashboard = async(req,res)=>{
    try {
        const usersData = await User.find({is_admin:0});
        res.render('dashboard',{users:usersData});
    } catch (error) {
        console.log(error.message);
    }
}

// add new work start

const newUserLoad = async(req,res)=>{
    try {
        res.render('new-user');
    } catch (error) {
        console.log(error.message);
    }
}

const addUser = async(req,res)=>{
    try {
        const name = req.body.name;
        const email = req.body.email;
        const mobile = req.body.mno;
        const password = req.body.password;


        const user = new User({
            name:name,
            email:email,
            mobile:mobile,
            password:password,
            is_admin:0
        });

        const userData = await user.save();

        if(userData){
            res.redirect('/admin/dashboard');
        }else{
            res.render('new-user',{message:'Something Wrong'});
        }

    } catch (error) {
        console.log(error.message);
    }
}

//edit user functionality

const editUserLoad = async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id:id })
        if(userData){
            res.render("edit-user",{ user:userData });
        }else{
            res.redirect('/admin/dashboard');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const updateUsers = async(req,res)=>{
    try {
        const idUser = req.query.id

        const userData = await User.findByIdAndUpdate({ _id:idUser },{ $set:{ name:req.body.name, email:req.body.email, mobile:req.body.mno, is_verified:req.body.verify}});
        
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}

//delete users

const deleteUser = async(req,res)=>{
    try {

        const id = req.query.id;
        const userData = await User.deleteOne({ _id:id });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

const dashboardSearch = async (req, res) => {
    try {
      let users = [];
      if (req.query.search) {
        users = await User.find({ name: { $regex: req.query.search, $options: 'i' } });
      } else {
        users = await User.find();
      }
      res.render('dashboard', { users });
    } catch (error) {
      console.log(error.message);
      res.render('error'); 
    }
};

const logoutt = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }
};


module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser,
    dashboardSearch,
    logoutt

}