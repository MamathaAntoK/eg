const express=require('express');
const app=express();

const path=require('path');

const multer=require('multer');
const morgan=require('morgan');
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(express.static('./tododashboard'));


const cors=require('cors');
app.use(cors());

const mongoose=require('mongoose');
// const bodyParser=require('body-parser');

// app.use(bodyParser.json());

const PORT=3000;


mongoose.connect('mongodb+srv://admin:admin123@cluster0.qlazmk7.mongodb.net/todoappdatas?retryWrites=true&w=majority')
.then(()=>{
    console.log(`Connection to Database established`);
})
.catch((error)=>{
    console.log(`Error in connecting to database ${error.message}`)
});


const todoSchema= new mongoose.Schema({
    description:String,
    completed:Boolean
})
const Todo=mongoose.model('Todo',todoSchema);












app.get('/api',async(req,res)=>{
   
    const todos=await Todo.find();
    console.log(todos)
    res.json(todos);
  
});

app.post('/api',async(req,res)=>{
    const {description,completed}=req.body;
    const todo=new Todo({description,completed});
    await todo.save();
    res.json(todo);
});

app.delete('/api/:id',async(req,res)=>{
    const id=req.params.id;
    console.log(req.params.id)
    await Todo.findByIdAndDelete(id);
    console.log('deleted');
    res.json({masssage:'todo deleted'})


})

app.get('/api/:status',async(req,res)=>{
    const status=req.params.status;
    console.log(req.params.status);
    const todos=await Todo.find({completed:status==='completed'})
    res.json(todos);
})

app.get('/*',function(req,res){
    res.sendFile(path.join(__dirname+'/tododashboard/index.html'))
})

app.listen(PORT,()=>{
    console.log(`server runninhg on port ${PORT}`)
})