
const fs = require('fs');
const http = require('http');
const url = require('url');
const overview = fs.readFileSync('./templates/overview.html','utf-8');
const card = fs.readFileSync('./templates/card.html','utf-8');
const detail_product = fs.readFileSync('./templates/product.html','utf-8');
const dataJson = fs.readFileSync('./data/data.json','utf-8');
const dataObj = JSON.parse(dataJson);

const replaceTemplate = (temp , detail)=>{
    let output = '';
    output = temp.replace(/{%EMOJI_PRODUCT%}/g , detail.image);
    output = output.replace(/{%PRODUCT_NAME%}/g , detail.productName);
    output = output.replace(/{%PRODUCT_QUENTITY%}/g , detail.quantity);
    output = output.replace(/{%PRODUCT_PRICE%}/g , detail.price);
    output = output.replace(/{%PRODUCT_FROM%}/g , detail.from);
    output = output.replace(/{%PRODUCT_NUTRIENTS%}/g , detail.nutrients);
    output = output.replace(/{%PRODUCT_DESCRIPTION%}/g , detail.description);
    output = output.replace(/{%PRODUCT_ID%}/g , detail.id);
    if(!detail.organic){
        output = output.replace(/{%PRODUCT_ORGANIC%}/g , 'NOT_ORGANIC');
    }
    return output;
};



const server = http.createServer((req,res)=>{
    const {query , pathname} = url.parse(req.url,true);
    if(pathname === '/' || pathname === '/overview'){
        
        const card_contents = dataObj.map(ele => replaceTemplate(card , ele)).join('');
        const overviewContent = overview.replace(/{%PRODUCT_CARD%}/ig , card_contents);
        res.writeHead(200,{'content-type' : 'text/html'});
        res.end(overviewContent);
        


    } else if(pathname === '/product'){

        const product_content = dataObj[query.id];
        const detail_about_product = replaceTemplate(detail_product , product_content);
        res.writeHead(200, {
            'content-type' : 'text/html',
            'created' : 'kareem tarek anwar mohamed yousef',
        })
        res.end(detail_about_product);
    } else{
        res.writeHead(404,{'Content-type' : 'text/html'});
        res.end("page not found");
    }
});
server.listen('5000','127.0.0.1',()=>{
    console.log('listen to request');
});