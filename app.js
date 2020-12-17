var express = require('express');
var exphbs = require('express-handlebars');
//const http = require('http');//back url
//const url = require('url');//back url
var port = process.env.PORT || 3000

const bodyparser = require('body-parser'); //Post request

//-------------Mercado pago imports-------------/
// SDK de Mercado Pago
const mercadopago = require('mercadopago');
// Agrega credenciales
mercadopago.configure({
    access_token: 'APP_USR-8208253118659647-112521-dd670f3fd6aa9147df51117701a2082e-677408439',
    integrator_id: 'dev_2e4ad5dd362f11eb809d0242ac130004'
});
//----------------------------------------------/

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static('assets'));
app.use(bodyparser.urlencoded({ extended: false })) // Post request imports
app.use('/assets', express.static(__dirname + '/assets'));




app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});


app.post('/checkout', function (req, res) {

    let preference = {
        items: [
            {
                "id": "1234",
                "title": req.body.title,
                "currency_id": "PEN",
                "picture_url": req.body.img,
                "description": "Dispositivo móvil de Tienda e-commerce",
                "quantity": parseFloat(req.body.unit),
                "unit_price": parseFloat(req.body.price)
            }
        ],
        payer: {
            "name": "Lalo",
            "surname": "Landa",
            "email": "test_user_46542185@testuser.com",
            "phone": {
                "area_code": "52",
                "number": parseInt(5549737300),
            },
            "identification": {
                "type": "DNI",
                "number": "22334445"
            },
            "address": {
                "street_name": "Insurgentes Sur",
                "street_number": 1602,
                "zip_code": "03940"
            }
        },
        external_reference: "luis.mancor@hotmail.com",
        back_urls: {
            "success": "https://www.google.com",
            "failure": "http://www.failure.com",
            "pending": "http://www.pending.com"
        },
        auto_return: "approved",
        payment_methods: {
            "excluded_payment_methods": [
                {
                    "id": "diners"
                }
            ],
            "excluded_payment_types": [
                {
                    "id": "atm"
                }
            ],
            "installments": 6
            }
    }
    console.log(preference);

    mercadopago.preferences.create(preference)
        .then(function (response) {
            // Este valor reemplazará el string "<%= global.id %>" en tu HTML
            global.id = response.body.id;

            console.log(response);
            console.log(response.body.id);

            res.redirect(response.body.init_point);

        }).catch(function (error) {
            console.log(error);
        });

});


app.get('/sucess/:collection_id/:collection_status', function (req, res) {
    
    var collection_id = req.params('collection_id');
   //--- var collection_id = req.query.collection_id;
    //---var collection_status = req.query.collection_status;
    //var collection_status = req.params('collection_status');//no
    //--var external_reference = req.params('external_reference');
    //--var payment_id = req.params('payment_id'); //-- o el collection ID
    //var status = req.params('status');
    //--var preference_id = req.params('preference_id');
    //--var payment_type = req.params('payment_type');
    
    /*var datos = {
        "collectionId":collection_id,
        "external":external_reference,
        "payment_id":payment_id,
        "preference_id":preference_id,
        "payment_type":payment_type
    }
    
    res.render('sucess',datos);*/
    console.log(collection_id);
    res.render('home');
});


app.listen(port);