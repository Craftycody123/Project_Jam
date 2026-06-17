import { useState } from "react";

export default function Mannequin() {


  const [currentOutfit, setCurrentOutfit] = useState({

    top: null,
    bottom: null,
    outer: null

  });



  const [savedOutfits, setSavedOutfits] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);



  // CLOTHING LAYER ORDER

  const layers = {

    bottom: 1,
    top: 2,
    outer: 3

  };





  // DROP FROM WARDROBE

  const handleDrop = (e)=>{


    e.preventDefault();


    const data = 
    e.dataTransfer.getData(
      "application/json"
    );



    if(!data) return;



    const item = JSON.parse(data);



    setCurrentOutfit(prev=>({

      ...prev,

      [item.category]: item

    }));


  };







  // SAVE OUTFIT

 
const saveOutfit = ()=>{


const newOutfit = [
 ...savedOutfits,
 currentOutfit
];


setSavedOutfits(newOutfit);


localStorage.setItem(
 "outfitHistory",
 JSON.stringify(newOutfit)
);


};





  // NEXT

  const nextOutfit = ()=>{


    if(currentIndex < savedOutfits.length-1){


      const next = currentIndex+1;


      setCurrentIndex(next);


      setCurrentOutfit(
        savedOutfits[next]
      );

    }


  };







  // PREVIOUS

  const previousOutfit = ()=>{


    if(currentIndex > 0){


      const prev = currentIndex-1;


      setCurrentIndex(prev);


      setCurrentOutfit(
        savedOutfits[prev]
      );


    }


  };







  const clothes = Object.entries(currentOutfit)


  .filter(([_,item])=>item)


  .sort(

    ([a],[b])=>

    layers[a]-layers[b]

  );






return (

<div style={styles.page}>


<h2>
2D AI Mannequin
</h2>



<div style={styles.controls}>


<button onClick={saveOutfit}>
💾 Save Outfit
</button>


<button onClick={previousOutfit}>
⬅ Previous
</button>


<button onClick={nextOutfit}>
Next ➡
</button>


</div>






<div

style={styles.mannequin}


onDragOver={(e)=>e.preventDefault()}


onDrop={handleDrop}


>




{/* HEAD */}

<div style={styles.head}></div>





{/* BODY */}

<div style={styles.body}></div>





{/* LEGS */}

<div style={styles.legLeft}></div>


<div style={styles.legRight}></div>








{/* CLOTHES */}


{

clothes.map(([type,item])=>(


<img

key={type}

src={item.image_url}

alt={type}



style={{

...styles.cloth,


zIndex:layers[type],



top:


type==="bottom"

?

230


:

type==="outer"

?

120


:

100


}}


/>



))


}



</div>



<p>

Outfit :

{savedOutfits.length===0

?

0

:

currentIndex+1

}

/

{savedOutfits.length}

</p>




</div>


);


}









const styles = {



page:{


minHeight:"100vh",

background:"#f4f6f8",

fontFamily:"Arial",

textAlign:"center",

padding:"20px"


},





controls:{


display:"flex",

justifyContent:"center",

gap:"10px",

marginBottom:"20px"


},






mannequin:{


width:"300px",

height:"550px",

margin:"auto",

position:"relative",

background:"linear-gradient(#eee,#ddd)",

border:"3px dashed #aaa",

borderRadius:"80px",

boxShadow:"0 10px 25px rgba(0,0,0,.15)"


},






head:{


width:"60px",

height:"60px",

background:"#ffd2a6",

borderRadius:"50%",


position:"absolute",


top:"20px",

left:"50%",


transform:"translateX(-50%)"


},







body:{


width:"110px",

height:"170px",

background:"#aaa",


position:"absolute",


top:"100px",


left:"50%",


transform:"translateX(-50%)",


borderRadius:"30px"


},







legLeft:{


width:"28px",

height:"160px",

background:"#888",


position:"absolute",


bottom:"30px",


left:"38%",


borderRadius:"20px"


},








legRight:{


width:"28px",

height:"160px",

background:"#888",


position:"absolute",


bottom:"30px",


right:"38%",


borderRadius:"20px"


},







cloth:{


position:"absolute",


width:"140px",


left:"50%",


transform:"translateX(-50%)",


objectFit:"contain",


transition:"0.4s",


filter:
"drop-shadow(0 5px 8px rgba(0,0,0,.25))"


}


};