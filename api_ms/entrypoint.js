"use strict";

global.express = require('express');
const rootPath = require('path');
const app = express();
global.appRoot = rootPath.resolve(__dirname);
const moment = require("moment");
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRouter = require(appRoot + '/routes/apiRouter');
const apiv1Router = require(appRoot + '/routes/apiv1Router');
const port = 4002;

const swaggerUi = require('swagger-ui-express');

const rbackswaggerDocument = require(appRoot + '/swagger/swagger.json');
const masterMsSwaggerDocument = require('./swagger/swagger_master_ms.json');

rbackswaggerDocument["paths"] = { ...rbackswaggerDocument["paths"], ...masterMsSwaggerDocument }

rbackswaggerDocument.host = process.env.BASE_URL_SWAGGER_HOST;
console.log('swagger base url : ',rbackswaggerDocument.host)
const options = {
  //customCss: '.swagger-ui .topbar { display: none }',
  docExpansion:"none"
};

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(rbackswaggerDocument,false,options));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

var timeout = require('connect-timeout')
app.use(timeout('300s'))

app.get('/', (req, res) => {
	//res.status(200);
	res.send('200 ok');
});

app.use(cors());
app.options('*', cors());

app.use((req,res,next)=>{
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Expose-Headers", "*");
	res.setHeader("Server-Timestamp", moment().unix());
	next();
});

app.use(apiRouter);
app.use('/api/v1/', apiv1Router);
app.use('/api/v3/', apiv1Router);
app.use('/api/v2/', apiv1Router);

const routeList = require('./utils/expressRoutes');
// routeList.routeList(app);

app.use(haltOnTimedout)

function haltOnTimedout (req, res, next) {
	if (!req.timedout) next()
}

app.listen(port, () => {

	console.log('Server is up on ' + port)
	//console.log(process.env)
});

console.log(process.env.IS_HEADER_SKIP == 1)