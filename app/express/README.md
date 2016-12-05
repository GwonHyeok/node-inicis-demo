# Express를 이용한 이니시스 결제

해당 예제는 express와 node-inicis를 이용하여 결제를 구현한 예제 입니다
 
# 사용 방법

### back-end

#### 설치
 ```bash
    npm install node-inicis
 ```
 
#### node-inicis express 라우터 추가
```javascript
    const inicis = require('node-inicis');
    
    const express = require('express');
    const app = express();
    
    app.use('/payment', inicis.routes.express(express, {
            mid: '이니시스 mid',
            signKey: '이니시스 웹표준 signKey',
            onRequest: (paymentParam) => {
                // 결제를 요청할때 콜백이 발생
                console.log(`사용자가 결제를 시작하였습니다. ${JSON.stringify(paymentParam, null, 4)}`);
            },
            onCancel: (oid) => {
                // 결제를 취소할때 콜백이 발생 oid 는 주문 아이디
                console.log(`사용자가 결제를 취소하였습니다, orderID : ${oid}`);
            },
            onSuccess: (req, res, next) => {
                // 결제가 성공 하였을때 해당 콜백 호출
                // 해당 콜백을 구현하지 않았다면 라이브러리에서 제공하는 기본 response가 보여집니다.
                // 해당 콜백을 구현하면 res 를 이용하여 response를 어떻게 할지 구현해야 합니다.
                // req.payment 에 결제 관련 데이터가 들어 있습니다.
                console.log('결제가 성공 하였습니다', JSON.stringify(req.payment, null, 4));
                
                // 이 콜백에서 결제 성공 페이지로 리다이렉트 시키는 기능 또는 비지니스 로직을 추가할 수 있습니다
                res.json({message: req.payment});
            },
            onError: (req, res, next) => {
                // 결제가 실패 하였을때 해당 콜백 호출
                // 해당 콜백을 구현하지 않았다면 라이브러리에서 제공하는 기본 response가 보여집니다.
                // 해당 콜백을 구현하면 res 를 이용하여 response를 어떻게 할지 구현해야 합니다.
                // req.payment 에 결제 관련 데이터가 들어 있습니다.
                console.log('결제가 실패 하였습니다', JSON.stringify(req.payment, null, 4));
                
                // 이 콜백에서 결제 실패 페이지로 리다이렉트 시키는 기능 또는 비지니스 로직을 추가할 수 있습니다
                res.json({message: req.payment});            
            }
        }));
```

### front-end

#### javascript 라이브러리 추가
```html
    <script type= "text/javascript" src="https://stdpay.inicis.com/stdjs/INIStdPay.js"></script>
    <script type= "text/javascript" src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script type= "text/javascript" src="https://github.com/GwonHyeok/node-inicis/releases/download/v0.0.1/node-inicis-web-helper.js"></script>
```

#### 결제 라이브러리 초기화 
```javascript
    // 해당 함수는 가능한 빠른 시점에 호출 되어야 합니다.
    NodeINIStdPay.init({paymentUrl: 'http://localhost:3000/payment'});
```
paymentUrl 항목은 express 서버의 __프로토콜://도메인:포트/라우터이름__ 과 같은 식으로 적어야 합니다
해당 항목이 제대로 적히지 않는다면 옳바른 동작이 하지 않습니다.

#### 결제 요청
```javascript
    NodeINIStdPay.pay({
        price: 1000, // 가격
        goodname: '도깨비 방망이', // 상품 이름
        buyername: 'GwonHyeok', // 구매자 이름
        gopaymethod: 'Card' // 상품 결제 방법
    });
```