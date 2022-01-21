import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import changeText from './controller/api';
const app = express();
const port = 5000;

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json())

app.listen(port, () => {
    console.log('Express server running by TS');
})

const testAPI = (request:Request, response: Response, next: NextFunction) => {
    response.status(200).json({
        message: "Succeed"
    })
}

app.get('/test', testAPI)
app.post('/change', changeText)