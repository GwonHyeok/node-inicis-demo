const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const inicis = require('node-inicis');

const app = express();

// View Engine 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', require('./routes/index'));

// 노드 이니시스 결제 구현
// http://domain:port/payment
app.use('/payment', inicis.routes.express(express, {
    mid: process.env.mid || 'INIBillTst',
    signKey: process.env.signKey || 'SU5JTElURV9UUklQTEVERVNfS0VZU1RS',

    onRequest: (paymentParam) => {
        console.log(`사용자가 결제를 시작하였습니다. ${JSON.stringify(paymentParam, null, 4)}`);
    },

    onCancel: (oid) => {
        console.log(`사용자가 결제를 취소하였습니다, orderID : ${oid}`);
    },

    onSuccess: (req, res, next) => {
        console.log('결제가 성공 하였습니다', JSON.stringify(req.payment, null, 4));

        // 해당 콜백에서 특정 페이지로 리다이렉트 시키거나, 비지니스 로직을 추가할 수 있습니다.
        res.json({message: req.payment});
    },

    onError: (req, res, next) => {
        console.log('결제가 실패 하였습니다', JSON.stringify(req.payment, null, 4));

        // 해당 콜백에서 특정 페이지로 리다이렉트 시키거나, 비지니스 로직을 추가할 수 있습니다.
        res.json({message: req.payment});
    }
}));

// 404 에러 handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 에러 handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
