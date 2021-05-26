import express, { Request, Response } from 'express';
import dao from './dao';
import { Disc } from './model/Disc';

const router = express.Router();

router.get('/', function(req: Request, res: Response) {
  let discs: Disc[] = dao.listProducts(); 
  if (req.query.search == undefined || req.query.search == '') {
    res.render(__dirname + '/pages/index.ejs', { discs });  
  } else {
    let query: string = String(req.query.search).toLowerCase();
    let queryProducts: Disc[] = [];
    for (let disc of discs) {
      if (disc.name.toLowerCase().includes(query)) {
        queryProducts.push(disc);
      }
    }
    res.render(__dirname + '/pages/index.ejs', { discs: queryProducts });  
  }  
});

router.get('/create', function(req: Request, res: Response) {  
  res.render(__dirname + '/pages/create.ejs');  
});

router.get('/update', function(req: Request, res: Response) {  
  let disc: Disc = JSON.parse(String(req.query.disc));
  res.render(__dirname + '/pages/update.ejs', { disc });  
});

router.post('/discs/create', function (req: Request, res: Response) {          
  let disc: Disc = new Disc(req.body.id, req.body.name, req.body.author);
  dao.createProduct(disc);
  res.redirect('/create');
});

router.post('/discs/update', function (req: Request, res: Response) {  
  let disc: Disc = new Disc(req.body.id, req.body.name, req.body.author);
  dao.updateProduct(disc);
  res.redirect('/');
});

router.post('/discs/author-change', function (req: Request, res: Response) {  
  let discs: Disc[] = dao.listProducts(); 
  for (let disc of discs) {
    let author = disc.author;
    disc.author = author;
    dao.updateProduct(disc);
  }  
  res.redirect('/');
});

router.post('/discs/delete', function (req: Request, res: Response) {  
  let disc: Disc = JSON.parse(req.body.disc);
  dao.deleteProduct(disc.id);
  res.redirect('/');
});

export default router;