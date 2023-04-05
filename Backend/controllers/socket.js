
const { questionModel } = require("../Models/questionmodel");

module.exports = function (io) {
    //Socket.IO
    io.on('connection', function (socket) {
       console.log("one new user connected")
        //ON Events
       
            socket.emit("message","hi from socketFunc")
                
    socket.on("details",async msg=>{
        console.log(msg)
        var data = await questionModel.find({room:msg.room})
        // console.log(data)
            if(data.length!=0)
            {
                console.log('update');
                await questionModel.updateOne({room:msg.room},[ { $set: { "question": msg.question, 'opt1':msg.opt1,'opt2':msg.opt2,opt3:msg.opt3,opt4:msg.opt4,count1:0,count2:0,count3:0,count4:0} } ])
            }else{
                console.log("insert")
                await questionModel.insertMany(msg)
            }
        
    })

    socket.on("voter",async room=>{
        console.log(room,"from backend");
        socket.join(room);
        var x = await questionModel.find({room});
        io.to(room).emit('data',x)
    })

    socket.on("send",async(res)=>{
        // console.log(res)
        var x = await questionModel.updateMany({room:res.room},res)
        console.log(x)
    })
       socket.on("hello",msg=>{
        console.log(msg)
       }) 
        //End ON Events
    });
    
};