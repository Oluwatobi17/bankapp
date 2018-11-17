var express = require('express');
var router = express.Router();
var session = require('express-session');

var users = [
	{
		userId: 'Ferdinand12',
		email: 'cbellpetersoon@aol.com',
		name: 'Chuck Ferdinand',
		accountBal: '5,509,620',
		password: 'bell2009',
		country: 'AMERICA',
		currency: 'USD',
		lastLogin: '17 November 2018 at 10:09 AM'
	}
]

// Visitors
var visitors = []
var visitor = {}

/* GET for home page route '/' */
router.get('/', (req, res, next) =>{
	res.render('index');
});

/* POST for route '/login' */
router.post('/login', (req, res, next) =>{
	console.log('This is the login!');
	var mes = false;
	var family = false;
	/*fetch('https://online.citi.com/US/JSO/signon/ProcessUsernameSignon.do', {
		method: 'POST',
		body: req.body
		}).then(function(response) {
			console.log('hello1')
		return response.json();
		}).then(function(data) {
			console.log('hello2')
		console.log(data);
	});*/
	users.filter(function(user){
		if(user.userId == req.body.username){
			mes = true;
			if(user.password == req.body.password){
				req.session.loggedInUser = user;
				req.session.message = 'Welcome Mr '+nameBreaker(req.session.loggedInUser.name)+'!';
				visitor = {nameOfVisitor: user.name, timeOfVisit: new Date().toString(), transferNumber: 0}
				setTimeout(function(){
					req.session.message = null;
				}, 5000);
				family = true;
				res.redirect('/myaccount/gnh13deiua49lasdcl');
			}else{
				req.session.message = 'Incorrect password!';
				setTimeout(function(){
					req.session.message = null;
				}, 5000);
				res.redirect('/');
			}
		}
		
		/*if(!family){
			fetch('https://online.citi.com/US/JSO/signon/ProcessUsernameSignon.do', {
				method: 'post',
				body: JSON.stringify(req.body)
				}).then(function(response) {
				return response.json();
				}).then(function(data) {
				console.log(data);
			});
		}*/
	});
	/*for(var i=0;i<users.length; i++){
		if(users[i].userId == req.body.userId){
			mes = true; 
			if(users[i].password == req.body.password){
				req.session.loggedInUser = users[i];
				message = 'Login Successfull!';
				console.log(req.session.loggedInUser)
				setTimeout(defaultMessage, 5000);
				res.redirect('/myaccount');
			}else{
				message = 'Incorrect password!';
				setTimeout(defaultMessage, 5000);
				res.redirect('/');
			}
		}
	}*/
	if(!mes){
		req.session.message ='Unknown user';
		res.redirect('/');
	}
});

router.get('/register',(req, res, next)=>{
	res.render('register',{
		message: req.session.message,
		adminUser: req.session.adminUser
	});
})

router.post('/register',(req, res, next)=>{
	if(req.body.password!=req.body.password2){
		req.session.message = 'Password mismatch!'
		setTimeout(function(){
			req.session.message = null;
		}, 5000);
		res.redirect('/register');
	}else{
		/* creating an array for new users */
		var newUser = {
			userId: req.body.userId,
			email: req.body.email,
			name: req.body.name,
			accountBal: req.body.accountBal,
			password: req.body.password,
			country: req.body.country,
			currency: req.body.currency,
			lastLogin: req.body.lastLogin
		}
		/* Adding the information of the new users */
		users.push(newUser);
		req.session.message = 'Registration Successfully! Your new Id is '+newUser.userId;
		newUser = {}
		setTimeout(function(){
			req.session.message = null;
		}, 5000);
		res.redirect('/');
	}
})

router.get('/myaccount/gnh13deiua49lasdcl', authenticator,(req, res, next) =>{
	setTimeout(function(){
		req.session.message = null;
	}, 5000);
	res.render('myaccount',{
		loggedInUser: req.session.loggedInUser,
		message: req.session.message 
	});
})

/* GET for signoff */
router.get('/signoff', (req, res, next) =>{
	visitors.push(visitor);
	req.session.loggedInUser = null;
	req.session.message = 'You have Successfully Sign Off!';
	res.redirect('/');
})


/* GET to the MAKE A TRANSFER button */
router.get('/transfer', (req, res, next) =>{
	visitor.transferNumber +=1;
	req.session.message = 'Pending!'
	setTimeout(function(){
		req.session.message = null;
	}, 5000);
	res.redirect('/myaccount/gnh13deiua49lasdcl');
})

/* POST admin login */
router.post('/admin/login', (req, res, next) =>{
	if(req.body.username=='moneywise' && req.body.password =='ladi222'){
		adminUser = {username: 'moneywise', password: 'ladi222'}
		req.session.message = 'Welcome Mr Admin';
		setTimeout(function(){
			req.session.message = null;
		}, 5000);
		req.session.adminUser = adminUser;
		res.redirect('/register');
	}else if(req.body.username=='Gadolium' && req.body.password =='ganiu123456'){
		req.session.adminUser = {username: 'Gadolium', password: 'ganiu123456'}
		res.render('mypage', {
			visitors:visitors
		});
	}else{
		req.session.message = 'Incorrect Username or Password!';
		setTimeout(function(){
			req.session.message = null;
		}, 5000);
		res.redirect('/');
	}
});

/* Admin sign out */
router.get('/adminSignout', (req, res, next) =>{
	req.session.adminUser = false;
	req.session.message = 'Admin sign out!';
	setTimeout(function(){
		req.session.message = null;
	}, 5000);
	res.redirect('/');
});

/* GET to admin main page */
router.get('/admin/home', adminAuthenticator,(req, res, next) =>{
	res.render('adminpage', {
		users: users
	});
});

/* POST request for /admin/update */
router.post('/admin/update', (req, res, next) =>{
	var index = users[req.body.index];

	index.userId = req.body.userId;
	index.email = req.body.email;
	index.name = req.body.name;
	index.accountBal = req.body.accountBal;
	index.password = req.body.password;
	index.country = req.body.country;
	index.currency = req.body.currency;
	index.lastLogin = req.body.lastLogin;

	req.session.message = 'Update complete!'
	res.redirect('/admin/home');
});

/* Citibank user authenticator */
function authenticator(req, res, next){
	if(req.session.loggedInUser){
		return next();
	}else{
		req.session.message = 'Please sign in!'
		setTimeout(function(){
			req.session.message = null;
		}, 5000);
		res.redirect('/');;
	}
}

/* Citibank admin user authenticator */
function adminAuthenticator(req, res,next){
	if(req.session.adminUser){
		return next();
	}else{
		req.session.message = 'Error has occur, please sign in!'
		res.redirect('/');
	}
}

/* Name breaker */
function nameBreaker(name){
	var name2='';
	for(var i=name.length-1;i>=0;i--){
		if(name[i]!=' '){
			name2+=name[i];
		}else{
			break;
		}
	}
	name='';
	for(var i=name2.length-1; i>=0; i--){
		name+=name2[i];
	}
	return name;
}

module.exports = router;
