import express from "express"
import cors from "cors"
import {config} from "dotenv"
import { connection } from "./components/BD_config.js"
config();


const vr_PORT = process.env.PORT || 5210;

const app = express();
app.use(cors());
app.use(express.json());


//saving the notes.
app.post("/save", (req,res)=>{
    const title = req.body.noteTitle;
    const text = req.body.noteText;
    const infoDate = req.body.noteDate;

    const sql = "INSERT INTO notas (`vr_title`,`vr_text`,`vr_fecha`) VALUES (?,?,?)";
        
    connection.query(
        sql,
        [title,text,infoDate],
        (err,data)=>{
            if(err)return console.log(err);
            res.json({Status:"new notes"});
        }
    );
});

app.get("/showNoteBD",(req,res)=>{
    const sql = "SELECT * FROM notas";
    connection.query(
        sql,
        (err,data)=>{
            if(err)return console.log(err);
            res.json({Data:data});
        }
    );
});

app.post("/modifyBD",(req,res)=>{
    const title = req.body.noteTitle;
    const text = req.body.noteText;
    const infoDate = req.body.noteDate;
    const id = req.body.id;
    const sql = `UPDATE notas SET vr_title ='${title}', vr_text = '${text}', vr_fecha = '${infoDate}' WHERE id = '${id}' `;
    connection.query(
        sql,
        (err,data)=>{
            if(err)return console.log(err);
            res.json({Status:"modify notes"});
        }
    );
});

app.post("/deleteNote",(req,res)=>{
    const id = req.body.id;
    const sql = `DELETE FROM notas WHERE id = '${id}'`;
    connection.query(
        sql,
        (err,data)=>{
            if(err) return console.log(err);
            res.json({Status:"delete notes"});
        }
    );
});

app.listen(vr_PORT, ()=>{
    console.log(`listing in the PORT: ${vr_PORT}`)
});