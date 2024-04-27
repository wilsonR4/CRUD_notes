import axios from "axios"
import { objAlert2 } from "./sweetAlert";

function Notes({Title,Text,vrDate,vrID,funcMessage,vrDelete}){

    const vrENV = import.meta.env.VITE_CONNECTION_BD;

    const funcDelete = (e)=>{
        objAlert2.fire({
            icon: "question",
            title: <span className="text-primary">Are you sure you want to delete this note?</span>,
            showDenyButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            denyButtonText: "Delete"
        }).then((res)=>{
            if(res.isDenied){
                const formData = new FormData();
                formData.append("id",vrID);
                axios({
                    method: "post",
                    url:`${vrENV}/deleteNote`,
                    data: formData,
                    headers: { 
                        "Content-Type": "application/json",
                      },
                }).then(res=>{
                    if(res.data.Status === "delete notes"){
                        console.log(res.data.Status);
                        vrDelete(true);
                    }
                }).catch(err=>{console.log(err)});
            }
        })

        
    }

    return(
        <div className="card m-2">
            <div className="card-header">
            <h4 className="card-title text-truncate">{Title}</h4>
            </div>
            <div className="card-body">
            <p className="card-text text-truncate">{Text}</p>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between p-4">
            <div>
                <span>{vrDate}</span>
            </div>
            <div>
                <button className="card-btnDelate" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={(e)=>{
                    return funcMessage(vrID,"modifyNote")
                }}>
                    <i className="bi bi-pen"></i>
                </button>
                <button className="card-btnDelate" onClick={funcDelete}>
                    <i className="bi bi-trash"></i>
                </button>
            </div>
            </div>
        </div>
    )
}

export {Notes};