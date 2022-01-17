var express = require('express');
var app = express();
const puppeteer = require('puppeteer');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
   res.send('Hello World');
});

app.get('/about', function (req, res) {
    res.send('About Hello World');
 });

 const pdf2base64 = require('pdf-to-base64');
 
app.post('/printPDF', function (req, res) {
    console.log("Got a POST request for the PrintPDF");
    //console.log(JSON.stringify(req.headers));
   // var userAgent = req.headers['Authentication']; 
   console.log(req.body);
     let url = req.body.url;
     console.log("URL: "+url);
     let format = req.body.format;
     console.log("format: "+format);
     let scaleExpected = req.body.scale;
     console.log("scaleExpected: "+scaleExpected);
     let scale = parseFloat(scaleExpected);
      console.log("scale: "+scale);
     let currenttime = new Date().getTime();
     let fileName = currenttime + ".pdf";
     console.log("time is: " + currenttime);
     (async () => {
        const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: 'networkidle2'});
        const pdf =  await page.pdf({path: fileName, format: format, printBackground: true, scale: scale});
      //   await page.pdf({ path: 'resultApril_DLS_KH_02.pdf',  format: 'A5',
      //       printBackground: true,
			// width : '0cm',
			// height:'0cm',
      //       margin: {
      //           left: '5px',
      //           top: '0px',
      //           right: '25px',
      //           bottom: '0px'
      //       } });
	  console.log("file name is: " + fileName);
      pdf2base64(fileName)
     .then(
         (response) => {
           //  console.log(response); //cGF0aC90by9maWxlLmpwZw==
            // await browser.close();
             res.set({ 'Content-Type': 'application/json; charset=UTF-8', 'Content-Length': pdf.length });
             res.send({"content": response});
         }
     )
     .catch(
         (error) => {
             console.log(error); //Exepection error....
         }
     )
	 
	 browser.close();
	 
	var fs = require('fs');
	fs.unlink(fileName, function (err) {
	if (err) throw err;
	console.log('File deleted!');
	});


       
      })();
    // printPDF(url).then(pdf => {
    // res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
    // res.send(pdf)
    // res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
   // res.send('Hello World'); 
 })

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Application is running at this url: http://%s:%s", host, port)
});


/*
 (async function printPDF(url) {
    console.log("start reading URL :"+url);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
      //await page.type('#email', process.env.PDF_USER);
      //await page.type('#password', process.env.PDF_PASSWORD);
      //await page.click('#submit');
    await page.goto('https://blog.risingstack.com', {waitUntil: 'networkidle0'});
    //await page.goto(url, {waitUntil: 'networkidle0'});
    //await page.addStyleTag({ content: '.nav { display: none} .navbar { border: 0px} #print-button {display: none}' })
    const pdf = await page.pdf({ format: 'A4' });
   
    await browser.close();
    console.log("end generating PDF :");
    return pdf;
  }); */

/*
  const scrape = async (targetURL) => {
    const browser = await puppeteer.launch({ args: ['–no-sandbox', '–disable-setuid-sandbox'] });
    const page = await browser.newPage();
   
    await page.goto(targetURL);
    await page.waitFor(1000);
    //await page.click(elementToClick);
    const result = await page.pdf({ format: 'A4' });
   
    browser.close();
    return result;
   }*/
