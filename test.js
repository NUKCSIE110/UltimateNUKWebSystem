var p2 = new Promise(function(resolve, reject) {
    resolve(()=>{
        console.log(1);
    });
  });
  
  p2.then(function(value) {
    setTimeout(()=>{
        console.log(value + 'first'); // 2- This synchronous usage is virtually pointless
          },2000
    )
    //value; // 1
    return value + 1;
  }).then(function(value) {
      setTimeout(()=>{
      console.log(value + '- This synchronous usage is virtually pointless'); // 2- This synchronous usage is virtually pointless
        },1000
      )
    
  });
