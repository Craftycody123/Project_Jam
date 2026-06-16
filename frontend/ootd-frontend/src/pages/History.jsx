import { useEffect, useState } from "react";


export default function History() {


  const [history, setHistory] = useState([]);



  useEffect(() => {


    const saved =
      localStorage.getItem("outfitHistory");


    if(saved){

      setHistory(
        JSON.parse(saved)
      );

    }


  }, []);





  return (

    <div style={styles.page}>


      <h2>
        Outfit History
      </h2>



      {
        history.length === 0 ?


        (

          <p>
            No saved outfits yet
          </p>

        )


        :


        history.map((outfit,index)=>(


          <div
          key={index}
          style={styles.card}
          >


            <h3>
              Outfit {index+1}
            </h3>



            <div style={styles.clothes}>


            {


              Object.entries(outfit).map(
              ([type,item])=>


              item &&

              (

              <div key={type}>


                <img

                src={item.image_url}

                alt={type}

                style={styles.image}

                />


                <p>
                  {type}
                </p>


              </div>

              )

              )

            }



            </div>


          </div>


        ))

      }



    </div>

  );

}






const styles = {


page:{

padding:"20px",

fontFamily:"Arial",

background:"#f4f6f8",

minHeight:"100vh"

},



card:{

background:"white",

padding:"20px",

marginBottom:"20px",

borderRadius:"15px",

boxShadow:"0 5px 15px rgba(0,0,0,0.1)"

},



clothes:{

display:"flex",

gap:"20px",

alignItems:"center"

},



image:{

width:"120px",

height:"120px",

objectFit:"contain",

filter:
"drop-shadow(0 5px 8px rgba(0,0,0,0.2))"

}


};